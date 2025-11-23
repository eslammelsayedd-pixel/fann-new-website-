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
        const { companyName, websiteUrl, eventName, boothSize, boothType, features } = config;

        if (!companyName || !boothSize || !boothType || !eventName) {
            return new Response(JSON.stringify({ error: 'Missing required design parameters.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        // === 1. Generate Text Concepts (2 Distinct Options) ===
        // We prompt the AI to analyze the website/brand and event/industry implicitly.
        let textPrompt = `
        You are a world-class exhibition stand designer.
        
        Task:
        1. Analyze the company website: "${websiteUrl || 'Not provided'}" to determine brand colors, vibe, and industry.
        2. Analyze the event name: "${eventName}" to determine the industry vertical (e.g., Tech, Food, Real Estate).
        3. Create TWO distinct design concepts (Concept A and Concept B) for a ${boothSize} sqm ${boothType} stand.
           - Concept A should be "Modern, Bold, and High-Impact".
           - Concept B should be "Luxurious, Elegant, and Sophisticated" (or an alternative style that fits the brand analysis).
        
        Client Details:
        - Company: "${companyName}"
        - Key Essentials Required: ${features.join(', ') || 'Standard exhibition requirements'}

        Return a single, valid JSON object with the exact structure defined. Do not include any text, notes, or markdown formatting before or after the JSON.
        `;

        const conceptSchema = {
            type: Type.OBJECT,
            properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                description: { type: Type.STRING, description: "Captivating description of the look and feel." },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyFeature: { type: Type.STRING, description: "The standout element of this design." }
            },
            required: ['conceptName', 'style', 'description', 'materials', 'keyFeature']
        };

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                industryDetected: { type: Type.STRING, description: "The industry inferred from the event name." },
                brandAnalysis: { type: Type.STRING, description: "Brief analysis of the brand vibe from the website." },
                conceptA: conceptSchema,
                conceptB: conceptSchema
            },
            required: ['industryDetected', 'brandAnalysis', 'conceptA', 'conceptB']
        };

        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textPrompt,
            config: {
                tools: websiteUrl ? [{ googleSearch: {} }] : [],
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const designData = JSON.parse(textResponse.text.trim());

        // === 2. Generate Images (2 Distinct Renders) ===
        
        const generateImage = async (concept: any) => {
             const imagePrompt = `Photorealistic, award-winning 3D render of an exhibition stand for "${companyName}" at "${eventName}".
            Style: ${concept.style}.
            Concept: "${concept.conceptName}". Description: ${concept.description}.
            Stand Type: ${boothSize} sqm ${boothType}.
            Key Feature: ${concept.keyFeature}.
            Materials: ${concept.materials.join(', ')}.
            Industry: ${designData.industryDetected}.
            Essentials visible: ${features.join(', ')}.
            High-quality, professional architectural visualization, cinematic lighting.`;

            // Fix: Cast config to any to use imageConfig
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

        // Run image generation in parallel for speed
        const [imageA, imageB] = await Promise.all([
            generateImage(designData.conceptA),
            generateImage(designData.conceptB)
        ]);

        if (!imageA || !imageB) {
            throw new Error("Failed to generate images.");
        }

        // === 3. Respond ===
        return new Response(JSON.stringify({ 
            industry: designData.industryDetected,
            conceptA: { ...designData.conceptA, image: imageA },
            conceptB: { ...designData.conceptB, image: imageB }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Error in generate-exhibition-design API:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}