import { GoogleGenAI, Type } from "@google/genai";

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
      return new Response(JSON.stringify({ error: 'eventName is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not configured on the server.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are an expert in the global events and exhibitions industry. Based on the event name provided, identify the primary industry it belongs to.
Event Name: "${eventName}"
Your response MUST be a single, valid JSON object with one key: "industry". The value should be a concise industry name (e.g., "Technology", "Healthcare", "Aviation", "Food & Beverage"). Do not include any other text, explanations, or markdown formatting.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    industry: { type: Type.STRING, description: 'The primary industry of the event.' }
                },
                required: ['industry']
            }
        }
    });

    const rawText = response.text.trim();
    const result = JSON.parse(rawText);
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('Error in analyze-event-industry API:', error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
