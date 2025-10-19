import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { logo, prompt, mimeType } = await req.json();
    if (!logo || !prompt || !mimeType) {
        return new Response(JSON.stringify({ error: 'Missing required fields: logo, prompt, mimeType' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Create multiple images in parallel
    const imagePromises = Array(4).fill(0).map((_, i) => 
        ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [
                { inlineData: { data: logo, mimeType: mimeType } }, 
                { text: `${prompt}\\n\\nVariation ${i + 1} of 4.` }
            ]},
            config: { responseModalities: ['IMAGE'] },
        })
    );

    const responses = await Promise.all(imagePromises);
    const imageUrls = responses
        .map(res => res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData)
        .filter(Boolean)
        .map(data => `data:${data.mimeType};base64,${data.data}`);

    if (imageUrls.length < 1) {
        throw new Error("The AI model failed to generate any images.");
    }

    return new Response(JSON.stringify({ imageUrls }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('Error in generate-images API:', error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}