import { GoogleGenAI, Modality, Type, Part } from "@google/genai";
import { kv } from '@vercel/kv';
import { Resend } from 'resend';

// Helper function to format form data for the sales email
const formatFormDataForEmail = (data: any) => {
    let detailsHtml = '';
    for (const [key, value] of Object.entries(data)) {
        if (['logo', 'logoPreview', 'floorPlan', 'moodboards', 'brandColors', 'functionality', 'eventElements'].includes(key) || typeof value === 'object' && value !== null && !Array.isArray(value)) continue;
        let formattedValue = String(value);
        if (!formattedValue) continue;
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        detailsHtml += `<tr><td style="padding: 4px 8px; border: 1px solid #444; font-weight: bold; vertical-align: top;">${formattedKey}</td><td style="padding: 4px 8px; border: 1px solid #444;">${formattedValue}</td></tr>`;
    }
    // Add array values separately for better formatting
    const arrayFields = ['brandColors', 'functionality', 'eventElements', 'functionalZones'];
    arrayFields.forEach(key => {
        if (data[key] && Array.isArray(data[key]) && data[key].length > 0) {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            detailsHtml += `<tr><td style="padding: 4px 8px; border: 1px solid #444; font-weight: bold; vertical-align: top;">${formattedKey}</td><td style="padding: 4px 8px; border: 1px solid #444;">${data[key].join(', ')}</td></tr>`;
        }
    });
    return detailsHtml;
};


// This is a Vercel Serverless Function. It uses a Node.js-style request object.
// The `req.body` is pre-parsed, so we don't use `req.json()`.
// We use `res.status().json()` to send back the response.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { logo, mimeType, promptData, prompt, promptDataInterior, formData } = req.body;

    // --- Rate Limiting & User Info Extraction ---
    const userEmail = formData?.userEmail || formData?.email;
    if (!userEmail) {
        return res.status(400).json({ error: 'User email is required to generate designs.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
        return res.status(400).json({ error: 'Invalid email format provided.' });
    }

    const generationCount = await kv.get<number>(userEmail) || 0;
    if (generationCount >= 2) {
        return res.status(429).json({ error: "You’ve reached your free design limit. Please talk to our agent for more assistance." });
    }

    const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not configured on the server. Please set either API_KEY or GOOGLE_CLOUD_API_KEY in your Vercel environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    let studioType = '';
    let resultPayload: any = {};
    
    // --- Branch for Exhibition Studio ---
    if (promptData) {
      studioType = 'Exhibition';
      if (!logo || !mimeType) return res.status(400).json({ error: 'Missing logo or mimeType for Exhibition' });
      
      const baseTextGenPrompt = `Based on the following design brief for an exhibition stand, generate 3 distinct and creative concept proposals. For each proposal, provide a unique "title" and a short "description" (2-3 sentences that highlight a key feature or benefit).
**Design Brief:**
- **Event:** ${promptData.event}
- **Industry:** ${promptData.industry}
- **Stand Dimensions:** ${promptData.dimensions}.
- **Layout:** ${promptData.layout}. This is ${promptData.layoutDescription}.
- **Stand Type:** ${promptData.type}.
- **Structure:** ${promptData.structure}.
- **Style:** The overall design aesthetic should be **${promptData.style}**.
- **Functionality Requirements:** ${promptData.functionality}.
- **Brand Colors:** ${promptData.colors}.

**Output Format:**
Return your response as a single, valid JSON array. Do not include any text or markdown formatting outside of the JSON structure. Each object in the array must have two keys: "title" (string) and "description" (string).`;
      
      const textResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: baseTextGenPrompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                          title: { type: Type.STRING },
                          description: { type: Type.STRING }
                      },
                      required: ['title', 'description']
                  }
              }
          }
      });

      if (!textResponse.candidates || textResponse.candidates.length === 0) {
        throw new Error("The model failed to generate text descriptions. This might be due to a content safety restriction.");
      }

      let jsonText = textResponse.text.trim();
      const textData = JSON.parse(jsonText);
      if (!Array.isArray(textData) || textData.length < 3) {
          throw new Error("The model failed to generate enough titles and descriptions.");
      }

      const angles = [
        { id: 'front', prompt: 'Generate a photorealistic **Front View** of the stand, as seen from the main aisle.' },
        { id: 'top', prompt: 'Generate a photorealistic **Top-Down Isometric View** of the stand, showing the complete layout and floor plan clearly.' },
        { id: 'interior', prompt: 'Generate a photorealistic **Interior Perspective View** from inside the stand, looking towards a key feature like the reception or a demo station.' }
      ];

      const imagePromises = textData.flatMap((concept: any) => {
        const imageGenPrompt = `You are an expert exhibition stand designer. Generate a single photorealistic concept image for a bespoke exhibition stand, following these strict requirements:
- **Concept Title:** "${concept.title}"
- **Concept Description:** "${concept.description}"
- **Event:** ${promptData.event}
- **Industry:** ${promptData.industry}
- **Stand Dimensions:** ${promptData.dimensions}.
- **Stand Layout:** ${promptData.layout}. **This is a non-negotiable requirement.** The image MUST strictly depict a stand that is ${promptData.layoutDescription}.
- **Stand Type:** ${promptData.type}.
- **Structure:** ${promptData.structure}.
- **Style:** The overall design aesthetic must be **${promptData.style}**.
- **Key Mandate:** The stand must visibly include spaces/areas for all specified 'Functionality Requirements': ${promptData.functionality}.
- **Branding:** The stand is for a company whose logo is attached. The brand colors are **${promptData.colors}**. Integrate the logo and colors naturally.
- **Atmosphere:** The image must look high-end, professionally lit, and visually stunning. Do not include any people.`;

        return angles.map(angle => 
          ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: { parts: [
                  { inlineData: { data: logo, mimeType: mimeType } }, 
                  { text: `${imageGenPrompt}\n\n- **VIEW ANGLE:** ${angle.prompt}` }
              ]},
              config: { responseModalities: [Modality.IMAGE] },
          })
        );
      });

      const imageResponses = await Promise.all(imagePromises);

      const concepts = textData.map((concept: any, conceptIndex: number) => {
          const images: Record<string, string> = {};
          angles.forEach((angle, angleIndex) => {
              const res = imageResponses[conceptIndex * angles.length + angleIndex];
              const inlineData = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;
              images[angle.id] = inlineData ? `data:${inlineData.mimeType};base64,${inlineData.data}` : '';
          });
          return { title: concept.title, description: concept.description, images };
      });

      resultPayload = { concepts };
    }
    
    // --- Branch for Interior Studio ---
    else if (promptDataInterior) {
        studioType = 'Interior Design';
        const pdi = promptDataInterior;
        const isCommercial = ['Office', 'Retail space'].includes(pdi.spaceType);

        const textGenPrompt = `As a senior interior designer in Dubai, generate 3 distinct concept proposals for the following client brief. For each, provide a "title" and a "description" (2-3 sentences capturing the essence of the design).
**Client Brief:**
- **Space Type:** ${pdi.spaceType}, ${pdi.area} sqm.
- **Location:** ${pdi.location}.
- **Objective:** ${pdi.designObjective}.
- **Style:** ${pdi.style}.
- **Color Palette:** ${pdi.colorPreferences}.
- **Functional Zones:** ${pdi.functionalZones.join(', ')}.
- **Custom Features:** ${pdi.customFeatures || 'None'}.
- **Special Requests:** ${pdi.specialRequests || 'None'}.
${isCommercial ? `- **Brand Keywords:** ${pdi.brandKeywords}` : ''}
The user has provided a floor plan and moodboard images for inspiration.

**Output Format:** Return a valid JSON array of 3 objects, each with a "title" and "description" key. No extra text or markdown.`;

        const textResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: textGenPrompt,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }}, required: ['title', 'description']}}}
        });

        if (!textResponse.candidates || textResponse.candidates.length === 0) throw new Error("Model failed to generate text descriptions for interior design.");
        const textData = JSON.parse(textResponse.text.trim());
        if (!Array.isArray(textData) || textData.length < 3) throw new Error("Model failed to generate enough interior design titles/descriptions.");
        
        const angles = [
            { id: 'perspective', prompt: 'Generate a photorealistic, magazine-quality **main perspective view** showing the primary living or working area.' },
            { id: 'topDown', prompt: 'Generate a visually appealing, stylized **top-down floor plan view**. This should clearly show the layout of furniture and zones, rendered with textures and lighting.' },
            { id: 'detail', prompt: 'Generate a beautifully composed **close-up detail shot** of a key feature, like custom joinery, a material transition, or a statement furniture piece.' }
        ];

        const imagePromises = textData.flatMap((concept: any) => {
            const baseImagePrompt = `You are a world-class Dubai-based interior designer. Create a single, photorealistic image based on this specific concept and the user's detailed brief.
- **Concept Title:** "${concept.title}"
- **Concept Description:** "${concept.description}"
**User Brief Adherence is CRITICAL:**
- **Space:** ${pdi.spaceType}, ${pdi.area} sqm, located in ${pdi.location}.
- **Style:** Strictly **${pdi.style}**.
- **Layout and Function:** The layout must be informed by the attached floor plan and must include zones for: ${pdi.functionalZones.join(', ')}.
- **Inspiration:** The aesthetic must be heavily inspired by the attached moodboard images.
- **Colors:** The color scheme is: ${pdi.colorPreferences}.
${isCommercial && pdi.brandGuidelinesData ? '- **Branding:** The space must reflect the corporate identity from the attached brand guidelines.' : ''}
**Atmosphere:** High-end, luxurious, impeccable lighting, and extremely realistic. No people.`;

            const parts: Part[] = [];
            if (pdi.floorPlanData) parts.push({ inlineData: { data: pdi.floorPlanData.base64, mimeType: pdi.floorPlanData.mimeType } });
            pdi.moodboardsData.forEach((mb: any) => parts.push({ inlineData: { data: mb.base64, mimeType: mb.mimeType } }));
            if (isCommercial && pdi.brandGuidelinesData) parts.push({ inlineData: { data: pdi.brandGuidelinesData.base64, mimeType: pdi.brandGuidelinesData.mimeType } });

            return angles.map(angle => {
                const finalParts = [...parts, { text: `${baseImagePrompt}\n\n- **REQUIRED VIEW:** ${angle.prompt}` }];
                return ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: finalParts },
                    config: { responseModalities: [Modality.IMAGE] }
                });
            });
        });
        
        const imageResponses = await Promise.all(imagePromises);

        const concepts = textData.map((concept: any, conceptIndex: number) => {
            const images: Record<string, string> = {};
            angles.forEach((angle, angleIndex) => {
                const res = imageResponses[conceptIndex * angles.length + angleIndex];
                const inlineData = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;
                images[angle.id] = inlineData ? `data:${inlineData.mimeType};base64,${inlineData.data}` : '';
            });
            return { title: concept.title, description: concept.description, images };
        });

        resultPayload = { concepts };
    }

    // --- Branch for Event Studio ---
    else if (prompt) {
        studioType = 'Event';
        if (!logo || !mimeType) return res.status(400).json({ error: 'Missing logo or mimeType for Event' });

        const imagePromises = Array(2).fill(0).map(() => 
            ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [
                    { inlineData: { data: logo, mimeType: mimeType } }, 
                    { text: prompt }
                ]},
                config: { responseModalities: [Modality.IMAGE] },
            })
        );

        const imageResponses = await Promise.all(imagePromises);
        const imageUrls = imageResponses
            .map(res => res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData)
            .filter(Boolean)
            .map((data: any) => `data:${data.mimeType};base64,${data.data}`);

        if (imageUrls.length < 2) {
            throw new Error(`The model only generated ${imageUrls.length} out of 2 images. Please try again.`);
        }

        resultPayload = { imageUrls };
    } else {
        return res.status(400).json({ error: 'Invalid request payload.' });
    }

    // --- Post-Generation Actions ---
    const newCount = await kv.incr(userEmail);

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const subject = `FANN Studio: Design Generation #${newCount} by ${userEmail}`;
        const salesEmail = 'sales@fann.ae';
        const fromEmail = 'FANN AI Studio <bot@fann.ae>';
        const html = `
            <div style="font-family: Arial, sans-serif; color: #f5f5dc; background-color: #1a1a1a; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #D4AF76;">
                <h1 style="color: #D4AF76;">New AI Design Generation</h1>
                <p>A user has generated a design concept. This is generation <strong>#${newCount}</strong> for this user.</p>
                <ul>
                    <li><strong>User Email:</strong> <a href="mailto:${userEmail}" style="color: #5A8B8C;">${userEmail}</a></li>
                    <li><strong>Studio:</strong> ${studioType}</li>
                    <li><strong>Timestamp:</strong> ${new Date().toUTCString()}</li>
                </ul>
                <h2 style="color: #D4AF76;">Project Brief Details</h2>
                <table style="width: 100%; border-collapse: collapse; color: #f5f5dc; font-size: 14px;"><tbody>
                    ${formatFormDataForEmail(formData)}
                </tbody></table>
            </div>`;

        await resend.emails.send({ from: fromEmail, to: salesEmail, subject, html, reply_to: userEmail });
    } else {
        console.warn("RESEND_API_KEY not set. Skipping generation notification email.");
    }

    return res.status(200).json({ ...resultPayload, newCount });


  } catch (error: any) {
    console.error('Error in generate-images API:', error);
    return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}