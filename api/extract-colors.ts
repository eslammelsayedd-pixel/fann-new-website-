import { GoogleGenAI } from "@google/genai";

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
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [
                { inlineData: { mimeType, data: image } },
                { text: "Analyze the attached logo. Identify 3-5 primary brand colors. List them as a simple, comma-separated string. Example: 'Deep Navy Blue, Metallic Gold, Off-White'. Return only the color names." }
            ] },
        });
        
        const colors = response.text.split(',').map(c => c.trim()).filter(Boolean);
        return new Response(JSON.stringify({ colors }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Error in extract-colors API:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}