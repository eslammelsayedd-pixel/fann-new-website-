import { GoogleGenAI, Modality, Type } from "@google/genai";

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await req.json();
    const { logo, mimeType, promptData, prompt } = body;

    if (!logo || !mimeType) {
      return new Response(JSON.stringify({ error: 'Missing logo or mimeType' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!promptData && !prompt) {
      return new Response(JSON.stringify({ error: 'Missing promptData or prompt' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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

      const imageResponses = await Promise.all(imagePromises);
      const imageUrls = imageResponses
          .map(res => res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData)
          .filter(Boolean)
          .map(data => `data:${data.mimeType};base64,${data.data}`);

      if (imageUrls.length < 4) {
          throw new Error(`The AI model only generated ${imageUrls.length} out of 4 images. Please try again.`);
      }

      const textGenPrompt = `Based on the following design brief for an exhibition stand, generate 4 distinct and creative concept proposals. For each proposal, provide a unique "title" and a short "description" (2-3 sentences).
**Design Brief:**
${imageGenPrompt.replace('The stand is for a company whose logo is attached.', '')}
**Output Format:**
Return your response as a single, valid JSON array. Do not include any text or markdown formatting outside of the JSON structure. Each object in the array must have two keys: "title" (string) and "description" (string).`;

      const textResponse = await ai.models.generateContent({
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

      const textData = JSON.parse(textResponse.text);

      if (!textData || textData.length < 4) {
          throw new Error("The AI model failed to generate enough titles and descriptions.");
      }
      
      const concepts = imageUrls.map((url, index) => ({
          imageUrl: url,
          title: textData[index].title,
          description: textData[index].description,
      }));

      return new Response(JSON.stringify({ concepts }), { status: 200, headers: { 'Content-Type': 'application/json' } });
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

        return new Response(JSON.stringify({ imageUrls }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // This should not be reached if validation is correct
    return new Response(JSON.stringify({ error: 'Invalid request payload.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('Error in generate-images API:', error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}