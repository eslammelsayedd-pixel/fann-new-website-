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
        const { companyName, websiteUrl, eventName, boothSize, boothType, style, features } = config;

        if (!companyName || !boothSize || !boothType || !style) {
            return new Response(JSON.stringify({ error: 'Missing required design parameters.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        // === 1. Generate Text Concept ===
        let textPrompt = `
        You are a world-class exhibition stand designer for the luxury and tech markets in Dubai.
        Based on the following client requirements, generate a compelling and creative design concept.
        - Company: "${companyName}"
        - Website: "${websiteUrl || 'Not provided'}"
        - Event: "${eventName}"
        - Booth Size: ${boothSize} sqm
        - Booth Type: ${boothType}
        - Desired Style: ${style}
        - Key Features Required: ${features.join(', ') || 'None specified'}

        Instruction:
        `;

        if (websiteUrl) {
            textPrompt += `\nUse the Google Search tool to research the company at "${websiteUrl}". Analyze their brand identity, logo colors, and visual language. Incorporate their specific brand colors and aesthetic style into the "materials", "detailedDescription" and "conceptName".\n`;
        }

        textPrompt += `
        Your concept should be innovative, luxurious, and practical for a high-traffic event like GITEX or Arab Health.
        The "detailedDescription" should be a captivating paragraph (3-4 sentences) that mentions the brand colors specifically if found.
        Return a single, valid JSON object with the exact structure defined. Do not include any text, notes, or markdown formatting before or after the JSON.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                conceptName: { type: Type.STRING, description: "A catchy, professional name for the stand concept (e.g., 'The Apex Horizon Pavilion')." },
                detailedDescription: { type: Type.STRING, description: "A detailed paragraph describing the stand's look, feel, brand color usage, and visitor journey." },
                materials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 key materials suggested for construction (e.g., 'Brushed bronze accents', 'Matte finish laminates')." },
                lighting: { type: Type.STRING, description: "A brief description of the lighting strategy (e.g., 'Architectural track lighting with soft-lit LED strips')." },
                technologyFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 suggested technology integrations (e.g., 'Holographic product display', 'Interactive touch table')." },
            },
            required: ['conceptName', 'detailedDescription', 'materials', 'lighting', 'technologyFeatures']
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

        const designConcept = JSON.parse(textResponse.text.trim());

        // === 2. Generate Image (Using gemini-3-pro-image-preview / Nano Banana Pro) ===
        const imagePrompt = `Photorealistic, award-winning 3D render of a bespoke exhibition stand for "${companyName}" at "${eventName}".
        The design style is "${style}".
        The concept is named "${designConcept.conceptName}" and is described as: "${designConcept.detailedDescription}".
        It's a ${boothSize} sqm ${boothType} stand.
        Key features visible should include: ${features.join(', ')}.
        Prominently use these materials: ${designConcept.materials.join(', ')}.
        The lighting should be ${designConcept.lighting}.
        The overall atmosphere is professional, high-end, and immersive, suitable for a major Dubai trade show. High-quality, detailed rendering.`;
        
        // Fix: Cast the entire object to any to bypass type checking for imageConfig/imageSize
        const imageResponse = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: imagePrompt }],
            },
            config: {
                imageConfig: {
                    aspectRatio: "16:9",
                    imageSize: "1K"
                } 
            }
        } as any);
        
        let image = null;
        if (imageResponse.candidates?.[0]?.content?.parts) {
            for (const part of imageResponse.candidates[0].content.parts) {
                if (part.inlineData) {
                    image = part.inlineData.data;
                    break;
                }
            }
        }

        if (!image) {
            throw new Error("Failed to generate image.");
        }

        // === 3. Respond ===
        return new Response(JSON.stringify({ designConcept, image }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Error in generate-exhibition-design API:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}