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
                { text: "Analyze the attached logo. Identify the 3-5 most dominant brand colors. Return them as a simple, comma-separated string of HEX codes. Example: '#0A192F, #D4AF76, #F5F5DC'. Return ONLY the comma-separated HEX codes and nothing else." }
            ] },
        });
        
        const text = response.text.trim();
        // Simple validation to ensure we're getting hex-like strings
        const colors = text.split(',').map(c => c.trim()).filter(c => /^#([0-9A-F]{3}){1,2}$/i.test(c));
        
        return new Response(JSON.stringify({ colors }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Error in extract-colors API:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}