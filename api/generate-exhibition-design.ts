
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
        const { companyName, websiteUrl, eventName, boothSize, boothType, features, analysis, standWidth, standLength, standHeight, brief } = config;

        if (!boothSize || !boothType || !eventName) {
            return new Response(JSON.stringify({ error: 'Missing required design parameters.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        // Use analysis from Step 1 if available (now mostly manual inputs), otherwise prompt for it.
        // If analysis is provided manually by the user, trust it.
        const brandContext = analysis ? 
            `Brand Industry: ${analysis.industry}. Brand Vibe: ${analysis.vibe}. Brand Colors: ${analysis.colors.join(', ')}.` : 
            `Analyze the website "${websiteUrl}" for brand vibe.`;

        // === 1. Generate Text Concepts (2 Distinct Options) ===
        let textPrompt = `
        You are a world-class exhibition stand designer.
        
        Context:
        - Event: "${eventName}" (Infer the industry if not provided).
        - Company: "${companyName || 'The Client'}"
        - Website: "${websiteUrl}"
        - ${brandContext}
        - Client Brief/Notes: "${brief || 'No specific instructions provided.'}"
        
        STRICT Design Constraints:
        - Orientation: ${boothType} (Must adhere to this configuration).
        - Dimensions: ${standWidth}m x ${standLength}m.
        - Max Height: ${standHeight || 4}m.
        
        Task:
        Create TWO distinct design concepts (Option A and Option B) for this ${boothSize} sqm stand.
        - Option A: "Modern, Tech-Forward & Bold". Focus on high impact and innovation.
        - Option B: "Elegant, Sophisticated & Premium". Focus on luxury materials and hospitality.
        
        Requirements:
        - Must include: ${features.join(', ') || 'Standard exhibition requirements'}.

        Return a single, valid JSON object with the exact structure defined.
        `;

        const conceptSchema = {
            type: Type.OBJECT,
            properties: {
                conceptName: { type: Type.STRING },
                style: { type: Type.STRING },
                description: { type: Type.STRING, description: "Captivating description. Mention how it fits the specific orientation and height." },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                keyFeature: { type: Type.STRING, description: "The standout element of this design." }
            },
            required: ['conceptName', 'style', 'description', 'materials', 'keyFeature']
        };

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                industryDetected: { type: Type.STRING },
                conceptA: conceptSchema,
                conceptB: conceptSchema
            },
            required: ['industryDetected', 'conceptA', 'conceptB']
        };

        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textPrompt,
            config: {
                // Only use googleSearch if we don't have pre-analysis (manual or auto)
                tools: analysis ? [] : [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const designData = JSON.parse(textResponse.text.trim());

        // === 2. Generate Images (2 Distinct Renders) ===
        
        const generateImage = async (concept: any) => {
             const imagePrompt = `Photorealistic, award-winning 3D render of an exhibition stand for "${companyName || 'Corporate Brand'}" at "${eventName}".
            Style: ${concept.style}.
            Concept Name: "${concept.conceptName}". 
            Description: ${concept.description}.
            Configuration: ${boothType} Stand (${standWidth}m x ${standLength}m, Height ${standHeight || 4}m).
            Key Feature: ${concept.keyFeature}.
            Materials: ${concept.materials.join(', ')}.
            Industry: ${designData.industryDetected}.
            Visible Requirements: ${features.join(', ')}.
            Client Specifics: "${brief || ''}".
            Lighting: Cinematic, volumetric, studio lighting. High resolution, architectural visualization.`;

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
        const [imageA, imageB] = await Promise.all([
            generateImage(designData.conceptA),
            generateImage(designData.conceptB)
        ]);

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