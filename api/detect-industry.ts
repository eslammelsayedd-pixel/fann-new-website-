import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { eventName } = await req.json();
        if (!eventName) {
             return new Response(JSON.stringify({ industry: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Identify the primary industry associated with the trade show or event named "${eventName}". Return ONLY a single short string (e.g. "Technology", "Healthcare", "Automotive", "Food & Beverage"). If you are unsure or it's generic, return "General". Do not include punctuation.`,
        });

        const industry = response.text ? response.text.trim() : "General";
        return new Response(JSON.stringify({ industry }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Error detecting industry:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}