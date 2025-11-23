
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const config = await req.json();
        const { companyName, eventName, guestCount, eventType, brief, features } = config;

        if (!companyName || !eventName) {
            return new Response(JSON.stringify({ error: 'Missing required design parameters.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        // Define Schema
        const conceptSchema = {
            type: Type.OBJECT,
            properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                detailedDescription: { type: Type.STRING, description: "3-4 sentences describing the atmosphere." },
                decorElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                lighting: { type: Type.STRING },
                engagementTech: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['conceptName', 'style', 'detailedDescription', 'decorElements', 'lighting', 'engagementTech']
        };

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                industryDetected: { type: Type.STRING },
                conceptA: conceptSchema,
                conceptB: conceptSchema,
                conceptC: conceptSchema,
                conceptD: conceptSchema
            },
            required: ['industryDetected', 'conceptA', 'conceptB', 'conceptC', 'conceptD']
        };

        // === 1. Generate 4 Text Concepts ===
        const textPrompt = `
        You are a world-class creative director for luxury events in Dubai.
        
        Context:
        - Client: "${companyName}"
        - Event: "${eventName}" (${eventType})
        - Guests: ~${guestCount}
        - Brief/Theme: "${brief || 'No specific theme, surprise us.'}"
        - Must Haves: ${features.join(', ') || 'Standard luxury event features'}

        Task:
        Create FOUR distinct event concepts to pitch to the client:
        1. Concept A: "Timeless Luxury" (Elegant, classic, opulent).
        2. Concept B: "Futuristic Tech" (Digital, immersive, neon/holographic).
        3. Concept C: "Avant-Garde" (Artistic, bold, unexpected).
        4. Concept D: "Organic Sanctuary" (Sustainable, biophilic, warm).

        OUTPUT INSTRUCTION:
        Return ONLY a raw valid JSON object matching the following structure. Do not include markdown code blocks.
        Structure: ${JSON.stringify(responseSchema)}
        `;

        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: textPrompt }] },
            config: {
                tools: [{ googleSearch: {} }] // Use search to understand the company context if needed
                // Removed responseMimeType: 'application/json' to avoid conflict with tools
            },
        });

        // Clean and Parse JSON
        let rawText = textResponse.text.trim();
        rawText = rawText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        let designData;
        try {
            designData = JSON.parse(rawText);
        } catch (e) {
            console.error("JSON Parsing Failed", rawText);
            throw new Error("Failed to parse generated event concepts.");
        }

        // === 2. Generate Images (4 distinct renders) ===
        
        const generateImage = async (concept: any) => {
             const imagePrompt = `Photorealistic, award-winning event photography of "${concept.conceptName}" for "${companyName}".
            Event Type: ${eventType}.
            Style: ${concept.style}.
            Scene Description: ${concept.detailedDescription}.
            Key Decor: ${concept.decorElements.join(', ')}.
            Lighting Atmosphere: ${concept.lighting}.
            Venue: High-end luxury venue in Dubai.
            Resolution: 8k, cinematic, atmospheric depth.`;

            const resp = await ai.models.generateContent({
                model: 'gemini-3-pro-image-preview',
                contents: { parts: [{ text: imagePrompt }] },
                config: {
                    imageConfig: { aspectRatio: "16:9", imageSize: "1K" }
                }
            } as any);

            if (resp.candidates?.[0]?.content?.parts) {
                for (const part of resp.candidates[0].content.parts) {
                    if (part.inlineData) return part.inlineData.data;
                }
            }
            return null;
        };

        // Run image generation in parallel
        const [imageA, imageB, imageC, imageD] = await Promise.all([
            generateImage(designData.conceptA),
            generateImage(designData.conceptB),
            generateImage(designData.conceptC),
            generateImage(designData.conceptD)
        ]);

        // === 3. Respond ===
        return new Response(JSON.stringify({ 
            industry: designData.industryDetected,
            conceptA: { ...designData.conceptA, image: imageA },
            conceptB: { ...designData.conceptB, image: imageB },
            conceptC: { ...designData.conceptC, image: imageC },
            conceptD: { ...designData.conceptD, image: imageD }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Error in generate-event-design API:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
