import { GoogleGenAI, Modality, Type, Part } from "@google/genai";

// This is a Vercel Serverless Function. It uses a Node.js-style request object.
// The `req.body` is pre-parsed, so we don't use `req.json()`.
// We use `res.status().json()` to send back the response.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { logo, mimeType, promptData, prompt, promptDataInterior } = req.body;

    const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not configured on the server. Please set either API_KEY or GOOGLE_CLOUD_API_KEY in your Vercel environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    // --- Branch for Exhibition Studio ---
    if (promptData) {
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

      return res.status(200).json({ concepts });
    }
    
    // --- NEW Branch for Interior Studio ---
    else if (promptDataInterior) {
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

        return res.status(200).json({ concepts });
    }

    // --- Branch for Event Studio ---
    else if (prompt) {
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

        return res.status(200).json({ imageUrls });
    }

    return res.status(400).json({ error: 'Invalid request payload.' });

  } catch (error: any) {
    console.error('Error in generate-images API:', error);
    return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}