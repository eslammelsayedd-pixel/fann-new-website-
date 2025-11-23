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
        const { companyName, eventName, guestCount, eventType, style, features } = config;

        if (!companyName || !eventName || !guestCount || !eventType || !style) {
            return new Response(JSON.stringify({ error: 'Missing required design parameters.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        // === 1. Generate Text Concept ===
        const textPrompt = `
        You are a world-class event designer for luxury corporate events in Dubai.
        Based on the following client brief, generate a compelling and creative event concept.
        - Company: "${companyName}"
        - Event Name: "${eventName}"
        - Guest Count: Approximately ${guestCount}
        - Event Type: ${eventType}
        - Desired Style: ${style}
        - Key Features Required: ${features.join(', ') || 'None specified'}

        The concept should be innovative and high-end, suitable for a major corporate gathering in a premium Dubai venue like the Armani Hotel or Madinat Jumeirah.
        The "detailedDescription" should be a captivating paragraph (3-4 sentences).
        Return a single, valid JSON object with the exact structure defined. Do not include any text, notes, or markdown formatting before or after the JSON.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                conceptName: { type: Type.STRING, description: "A catchy, professional name for the event theme (e.g., 'The Lumina Gala')." },
                detailedDescription: { type: Type.STRING, description: "A detailed paragraph describing the event's atmosphere, decor, and guest experience." },
                decorElements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-4 key decor elements (e.g., 'Cascading floral installations', 'Custom-branded ice sculptures')." },
                lighting: { type: Type.STRING, description: "A brief description of the AV & lighting strategy (e.g., 'Dynamic projection mapping on walls with warm, ambient uplighting')." },
                engagementTech: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 suggested technology integrations for guest engagement (e.g., 'Interactive social media wall', 'Live digital caricature artist')." },
            },
            required: ['conceptName', 'detailedDescription', 'decorElements', 'lighting', 'engagementTech']
        };

        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const designConcept = JSON.parse(textResponse.text.trim());

        // === 2. Generate Image (Using gemini-3-pro-image-preview / Nano Banana Pro) ===
        const imagePrompt = `Photorealistic, atmospheric mood board image for a bespoke corporate event: the "${designConcept.conceptName}" for "${companyName}".
        The event is a "${eventType}" with a "${style}" theme.
        The scene depicts the main event space, described as: "${designConcept.detailedDescription}".
        Key visual elements include: ${features.join(', ')}.
        The decor features: ${designConcept.decorElements.join(', ')}.
        The lighting is ${designConcept.lighting}.
        The overall atmosphere is professional, luxurious, and highly engaging. High-quality, detailed rendering.`;
        
        // Fix: Use 'as any' to bypass strict type checking on imageConfig which may cause build errors with certain SDK versions
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
            } as any,
        });
        
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
        console.error('Error in generate-event-design API:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}