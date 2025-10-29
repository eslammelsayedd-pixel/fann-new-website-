import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { eventName } = await req.json();
        if (!eventName) {
            return new Response(JSON.stringify({ error: 'Missing eventName' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
          throw new Error("API key is not configured on the server.");
        }
        
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on the event name "${eventName}", what is the single most likely industry it belongs to? Examples: Technology, Healthcare, Aviation, Real Estate. Return only the industry name.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        industry: {
                            type: Type.STRING,
                            description: 'The single most relevant industry for the event.'
                        }
                    },
                    required: ['industry']
                }
            }
        });
        
        const rawText = response.text.trim();
        try {
            const result = JSON.parse(rawText);
            return new Response(JSON.stringify({ industry: result.industry || 'General' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (e) {
            console.error("Failed to parse model's JSON response for industry:", rawText);
            // Fallback for non-json response from the model
            const cleanedText = rawText.replace(/[\*"\`]/g, '').trim();
            return new Response(JSON.stringify({ industry: cleanedText || 'General' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

    } catch (error: any) {
        console.error('Error in analyze-event-industry API:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
