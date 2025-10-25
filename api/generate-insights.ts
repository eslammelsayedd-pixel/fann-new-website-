import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { prompt } = await req.json();
        if (!prompt) {
             return new Response(JSON.stringify({ error: 'Prompt is required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
          throw new Error("API key is not configured on the server. Please set either API_KEY or GOOGLE_CLOUD_API_KEY in your Vercel environment variables.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: { 
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });

        const content = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) || [];
        const filteredSources = sources.filter(source => source && source.uri);

        return new Response(JSON.stringify({ content, sources: filteredSources }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Error in generate-insights API:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}