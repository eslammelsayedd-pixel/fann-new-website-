
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
        const { companyName, websiteUrl, eventName, boothSize, boothType, features, standWidth, standLength, standHeight, brief, logo } = config;

        if (!boothSize || !boothType) {
            return new Response(JSON.stringify({ error: 'Missing required design parameters.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        // === 1. Analyze Brand & Generate 4 Text Concepts ===
        const textPrompt = `
        You are a world-class exhibition stand designer.
        
        Context:
        - Event: "${eventName}" (Infer the industry).
        - Company: "${companyName}"
        - Website: "${websiteUrl}"
        - Client Brief: "${brief || 'No specific instructions.'}"
        
        Constraints:
        - Orientation: ${boothType} (${standWidth}m x ${standLength}m).
        - Height: ${standHeight || 4}m.
        - Must include: ${features.join(', ') || 'Standard exhibition features'}.
        
        Task:
        Create FOUR distinct design concepts:
        1. Concept A: "Modern & Tech-Forward" (Innovation focus).
        2. Concept B: "Luxury & Hospitality" (Premium materials, lounge focus).
        3. Concept C: "Interactive & Engaging" (Gamification/Demo focus).
        4. Concept D: "Sustainable & Organic" (Greenery, wood, eco-friendly focus).

        Return a single valid JSON object.
        `;

        const conceptSchema = {
            type: Type.OBJECT,
            properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                description: { type: Type.STRING, description: "2-3 sentences describing the look and feel." },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyFeature: { type: Type.STRING, description: "The standout element." }
            },
            required: ['conceptName', 'style', 'description', 'materials', 'keyFeature']
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

        // If logo is provided, pass it for color analysis implicitly
        const parts = [];
        if (logo && logo.startsWith('data:')) {
             // Extract mime type and base64
             const matches = logo.match(/^data:(.+);base64,(.+)$/);
             if (matches && matches.length === 3) {
                 parts.push({ inlineData: { mimeType: matches[1], data: matches[2] } });
             }
        }
        parts.push({ text: textPrompt });

        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts },
            config: {
                tools: [{ googleSearch: {} }], // Use search to understand the company/event
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const designData = JSON.parse(textResponse.text.trim());

        // === 2. Generate Images (4 distinct renders) ===
        
        const generateImage = async (concept: any) => {
             const imagePrompt = `Photorealistic 3D render of an exhibition stand for "${companyName}".
            Style: ${concept.style}.
            Concept: "${concept.conceptName}".
            Description: ${concept.description}.
            Layout: ${boothType} Stand (${standWidth}m x ${standLength}m).
            Key Feature: ${concept.keyFeature}.
            Materials: ${concept.materials.join(', ')}.
            Industry: ${designData.industryDetected}.
            Lighting: Cinematic studio lighting, high resolution 8k.`;

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
            return null; // Fallback handled in frontend
        };

        // Run image generation in parallel for speed
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
        console.error('Error in generate-exhibition-design API:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
