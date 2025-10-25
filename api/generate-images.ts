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
      const imageGenPrompt = `You are an expert exhibition stand designer. Generate a photorealistic concept image for a bespoke exhibition stand, following these strict requirements:
- **Event:** ${promptData.event}
- **Industry:** ${promptData.industry}
- **Stand Dimensions:** ${promptData.dimensions}.
- **Layout:** ${promptData.layout}. This is ${promptData.layoutDescription}
- **Stand Type:** ${promptData.type}.
- **Structure:** ${promptData.structure}.
- **Style:** The overall design aesthetic should be **${promptData.style}**.
- **Key Mandate:** The stand must visibly include spaces/areas for all specified 'Functionality Requirements': ${promptData.functionality}. This is critical.
- **Branding:** The stand is for a company whose logo is attached. The brand colors are **${promptData.colors}**. Integrate the logo and colors naturally into the design on walls, reception desks, or digital screens.
- **Atmosphere:** The image should look high-end, professionally lit, and visually stunning. Do not include any people in the image.`;

      // OPTIMIZATION: Run image and text generation in parallel to avoid timeouts.
      const imagePromises = Array(4).fill(0).map(() => 
          ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: { parts: [
                  { inlineData: { data: logo, mimeType: mimeType } }, 
                  { text: imageGenPrompt }
              ]},
              config: { responseModalities: [Modality.IMAGE] },
          })
      );

      const textGenPrompt = `Based on the following design brief for an exhibition stand, generate 4 distinct and creative concept proposals. For each proposal, provide a unique "title" and a short "description" (2-3 sentences).
**Design Brief:**
${imageGenPrompt.replace('The stand is for a company whose logo is attached.', '')}
**Output Format:**
Return your response as a single, valid JSON array. Do not include any text or markdown formatting outside of the JSON structure. Each object in the array must have two keys: "title" (string) and "description" (string).`;
      
      const textPromise = ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: textGenPrompt,
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
      
      const [imageResponses, textResponse] = await Promise.all([
        Promise.all(imagePromises),
        textPromise
      ]);

      const imageUrls = imageResponses
          .map(res => res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData)
          .filter(Boolean)
          .map(data => `data:${data.mimeType};base64,${data.data}`);

      if (imageUrls.length < 4) {
          throw new Error(`The AI model only generated ${imageUrls.length} out of 4 images. Please try again.`);
      }

      if (!textResponse.candidates || textResponse.candidates.length === 0) {
        console.error("Text generation failed: No candidates returned from the model.", textResponse);
        throw new Error("The AI failed to generate text descriptions. This might be due to a content safety restriction on the text prompt or an internal model error. Please try modifying your brief or try again.");
      }

      let jsonText = textResponse.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7, jsonText.lastIndexOf('```')).trim();
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.substring(3, jsonText.lastIndexOf('```')).trim();
      }

      let textData;
      try {
          textData = JSON.parse(jsonText);
      } catch (e) {
          console.error("Failed to parse JSON from AI response for descriptions:", jsonText);
          throw new Error("The AI failed to return valid JSON for the concept descriptions. Please try generating again.");
      }

      if (!Array.isArray(textData) || textData.length < 4) {
          console.error("AI response for descriptions was not a valid array of 4 items:", textData);
          throw new Error("The AI model failed to generate enough titles and descriptions in the correct format.");
      }
      
      const concepts = imageUrls.map((url, index) => ({
          imageUrl: url,
          title: textData[index]?.title || `Concept ${index + 1}`,
          description: textData[index]?.description || "A stunning and creative concept for your event.",
      }));

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