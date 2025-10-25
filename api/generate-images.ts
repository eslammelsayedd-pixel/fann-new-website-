import { GoogleGenAI, Modality, Type } from "@google/genai";

// This is a Vercel Serverless Function. It uses a Node.js-style request object.
// The `req.body` is pre-parsed, so we don't use `req.json()`.
// We use `res.status().json()` to send back the response.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { logo, mimeType, promptData, prompt } = req.body;

    if (!logo || !mimeType) {
      return res.status(400).json({ error: 'Missing logo or mimeType' });
    }
    if (!promptData && !prompt) {
      return res.status(400).json({ error: 'Missing promptData or prompt' });
    }

    const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not configured on the server. Please set either API_KEY or GOOGLE_CLOUD_API_KEY in your Vercel environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    // --- Branch for Exhibition Studio ---
    if (promptData) {
      const baseTextGenPrompt = `Based on the following design brief for an exhibition stand, generate 4 distinct and creative concept proposals. For each proposal, provide a unique "title" and a short "description" (2-3 sentences that highlight a key feature or benefit).
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
        throw new Error("The AI failed to generate text descriptions. This might be due to a content safety restriction.");
      }

      let jsonText = textResponse.text.trim();
      if (jsonText.startsWith('```json')) jsonText = jsonText.substring(7, jsonText.lastIndexOf('```')).trim();
      
      const textData = JSON.parse(jsonText);
      if (!Array.isArray(textData) || textData.length < 4) {
          throw new Error("The AI model failed to generate enough titles and descriptions.");
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
              const responseIndex = conceptIndex * angles.length + angleIndex;
              const res = imageResponses[responseIndex];
              const inlineData = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;
              if (inlineData) {
                  images[angle.id] = `data:${inlineData.mimeType};base64,${inlineData.data}`;
              } else {
                  // Fallback in case one angle fails
                  images[angle.id] = 'https://images.unsplash.com/photo-1594008137128-2041a7d65373?w=800&q=80';
              }
          });
          
          return {
              title: concept.title,
              description: concept.description,
              images: images
          };
      });

      return res.status(200).json({ concepts });
    }

    // --- Branch for Event Studio ---
    if (prompt) {
        const imagePromises = Array(4).fill(0).map(() => 
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
            .map(data => `data:${data.mimeType};base64,${data.data}`);

        if (imageUrls.length < 4) {
            throw new Error(`The AI model only generated ${imageUrls.length} out of 4 images. Please try again.`);
        }

        return res.status(200).json({ imageUrls });
    }

    return res.status(400).json({ error: 'Invalid request payload.' });

  } catch (error: any) {
    console.error('Error in generate-images API:', error);
    return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}