import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { eventName, industryContext, availableStyles } = await req.json();
        if (!eventName || !availableStyles || !Array.isArray(availableStyles)) {
            return new Response(JSON.stringify({ error: 'Missing or invalid required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `You are a design assistant. Your task is to analyze an event and recommend a design style.
Event Name: '${eventName}'.
Event Industry context: ${industryContext}
Available design styles: [${availableStyles.join(', ')}].
Your response MUST be a single, valid JSON object and nothing else. Do not include markdown formatting, explanations, or any text outside of the JSON structure.
The JSON object must contain two keys: "style" and "description".
- The "style" value must be exactly one of the available design styles.
- The "description" value must be a concise, one-sentence summary of the typical stand aesthetics for the event.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        style: { type: Type.STRING, description: `The single best style for the event. Must be one of: ${availableStyles.join(', ')}.` },
                        description: { type: Type.STRING, description: 'A one-sentence description of typical stand characteristics.' }
                    },
                    required: ['style', 'description']
                }
            }
        });

        const rawText = response.text.trim();
        try {
            const result = JSON.parse(rawText);
            return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } catch (e) {
            console.error("Failed to parse AI response as JSON:", rawText);
            throw new Error("AI returned an invalid JSON response.");
        }

    } catch (error: any) {
        console.error('Error in analyze-show-style API:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}