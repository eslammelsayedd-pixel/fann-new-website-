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
            config: { responseMimeType: "application/json", responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }}, required: ['title', 'description'] } } }
        });

        if (!textResponse.candidates || textResponse.candidates.length === 0) {
            throw new Error("The model failed to generate text descriptions.");
        }
        const textData = JSON.parse(textResponse.text.trim());
        if (!Array.isArray(textData) || textData.length < 3) {
            throw new Error("The model failed to generate enough titles and descriptions.");
        }

        const angles = [
            { id: 'perspective', prompt: 'a main **Perspective View** showing the overall look and feel of the space.' },
            { id: 'topDown', prompt: 'a stylized, 3D **Top-Down Floor Plan View** showing the layout.' },
            { id: 'detail', prompt: 'a **Detail or Vignette View** focusing on a key area like a reception desk or a custom joinery piece.' }
        ];

        const imagePromises = textData.flatMap((concept: any) => {
            const imageGenPrompt = `You are a professional interior architectural visualizer. Generate a single, photorealistic 3D render for a luxury ${pdi.spaceType} based on the following:
- **Concept Title:** "${concept.title}"
- **Concept Description:** "${concept.description}"
- **Base Style:** ${pdi.style}.
- **Color Preferences:** ${pdi.colorPreferences}.
- **Key Zones/Features to include:** ${pdi.functionalZones.join(', ')}.
- **Inspiration:** The client provided moodboard images and a floor plan (attached). Draw inspiration from them for the layout, materials, and overall ambiance.
- **Atmosphere:** The render must be high-end, beautifully lit, and exceptionally detailed.`;
            
            const contentParts: Part[] = [
                ...pdi.moodboardsData.map((mb: any) => ({ inlineData: { data: mb.base64, mimeType: mb.mimeType } })),
                ...(pdi.floorPlanData ? [{ inlineData: { data: pdi.floorPlanData.base64, mimeType: pdi.floorPlanData.mimeType } }] : []),
            ];

            return angles.map(angle => 
                ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [
                        ...contentParts,
                        { text: `${imageGenPrompt}\n\n- **REQUIRED VIEW:** The render must be ${angle.prompt}` }
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
    
    // --- Branch for Event Studio ---
    else if (prompt) { 
        studioType = 'Event';
        if (!logo || !mimeType) return res.status(400).json({ error: 'Missing logo or mimeType for Event' });

        const imagePromises = Array(2).fill(0).map(() => 
            ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [
                    { inlineData: { mimeType, data: logo } }, 
                    { text: prompt }
                ]},
                config: { responseModalities: [Modality.IMAGE] },
            })
        );
        const imageResponses = await Promise.all(imagePromises);
        const imageUrls = imageResponses.map(res => {
            const inlineData = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;
            return inlineData ? `data:${inlineData.mimeType};base64,${inlineData.data}` : '';
        }).filter(Boolean);

        resultPayload = { imageUrls };
    } 
    
    // --- Default / Error Case ---
    else {
        return res.status(400).json({ error: 'Invalid request. No valid prompt data provided.' });
    }
    
    // --- Update user count and send notification ---
    const newCount = await kv.incr(userEmail);
    await kv.expire(userEmail, 86400); // Set a 24-hour expiry for the count

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
        try {
            const resend = new Resend(resendApiKey);
            const userName = formData.userFirstName || formData.userName || formData.firstName || 'A User';
            await resend.emails.send({
                from: `FANN Studio <noreply@fann.ae>`, // Assumes verified domain
                to: 'sales@fann.ae',
                subject: `FANN Studio Design Generated (${studioType})`,
                reply_to: userEmail,
                html: `<p>${userName} (${userEmail}) has generated a design using the ${studioType} Studio. This is their ${newCount === 1 ? 'first' : 'second'} design.</p>
                       <p><strong>Design Brief Summary:</strong></p>
                       <table style="width: 100%; border-collapse: collapse;">
                           <tbody>${formatFormDataForEmail(formData)}</tbody>
                       </table>`
            });
        } catch (emailError: any) {
            console.error("Failed to send notification email via Resend:", emailError.message);
            // Do not fail the request if email fails, just log it.
        }
    } else {
        console.warn("RESEND_API_KEY not set. Skipping email notification.");
    }


    return res.status(200).json({ ...resultPayload, newCount });

  } catch (error: any) {
    console.error(`Error in generate-images API:`, error);
    return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}