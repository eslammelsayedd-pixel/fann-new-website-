import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { image, mimeType } = await req.json();
        if (!image || !mimeType) {
            return new Response(JSON.stringify({ error: 'Missing image or mimeType' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
          throw new Error("API key is not configured on the server. Please set either API_KEY or GOOGLE_CLOUD_API_KEY in your Vercel environment variables.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [
                { inlineData: { mimeType, data: image } },
                { text: "Analyze the attached logo to identify the 3-5 most dominant brand colors and return them as an array of HEX codes." }
            ]},
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        colors: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: 'A color in HEX code format (e.g., "#RRGGBB").'
                            }
                        }
                    },
                    required: ['colors']
                }
            }
        });
        
        const rawText = response.text.trim();
        try {
            const result = JSON.parse(rawText);
            const colors = result.colors || [];
            // Validate that the returned values are indeed hex codes.
            const validatedColors = colors.filter((c: any) => typeof c === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(c));
            return new Response(JSON.stringify({ colors: validatedColors }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (e) {
            console.error("Failed to parse AI JSON response for colors:", rawText);
            throw new Error("AI returned an invalid JSON response for color extraction.");
        }

    } catch (error: any) {
        console.error('Error in extract-colors API:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}