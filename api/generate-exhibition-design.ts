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
        const { companyName, boothSize, boothType, style, features, brandColors } = config;

        if (!companyName || !boothSize || !boothType || !style) {
            return new Response(JSON.stringify({ error: 'Missing required design parameters.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
        You are a world-class exhibition stand designer for the luxury and tech markets in Dubai.
        Based on the following client requirements, generate a compelling and creative design concept.
        - Company: "${companyName}"
        - Booth Size: ${boothSize} sqm
        - Booth Type: ${boothType}
        - Desired Style: ${style}
        - Key Features: ${features.join(', ') || 'None specified'}
        - Brand Colors: ${brandColors.join(', ')}

        Your concept should be innovative, luxurious, and practical for a high-traffic event like GITEX or Arab Health.
        The "detailedDescription" should be a captivating paragraph (3-4 sentences).
        Return a single, valid JSON object with the exact structure defined. Do not include any text, notes, or markdown formatting before or after the JSON.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                conceptName: { type: Type.STRING, description: "A catchy, professional name for the stand concept (e.g., 'The Apex Horizon Pavilion')." },
                detailedDescription: { type: Type.STRING, description: "A detailed paragraph describing the stand's look, feel, and visitor journey." },
                materials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 key materials suggested for construction (e.g., 'Brushed bronze accents', 'Matte finish laminates')." },
                lighting: { type: Type.STRING, description: "A brief description of the lighting strategy (e.g., 'Architectural track lighting with soft-lit LED strips')." },
                technologyFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 suggested technology integrations (e.g., 'Holographic product display', 'Interactive touch table')." },
            },
            required: ['conceptName', 'detailedDescription', 'materials', 'lighting', 'technologyFeatures']
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const rawJson = response.text.trim();
        const result = JSON.parse(rawJson);

        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Error in generate-exhibition-design API:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}