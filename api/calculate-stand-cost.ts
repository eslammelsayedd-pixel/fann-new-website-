import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const body = await req.json();
        const { 
            dimensions, 
            configuration, 
            quality, 
            location, 
            duration, 
            features 
        } = body;

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const totalArea = dimensions.length * dimensions.width;

        const prompt = `
        Act as a senior Quantity Surveyor for the Exhibition industry in ${location.city}, ${location.country}.
        Calculate the itemized cost for an exhibition stand with the following specifications:

        - **Dimensions:** ${dimensions.length}m (L) x ${dimensions.width}m (W) x ${dimensions.height}m (H). Total Area: ${totalArea} sqm.
        - **Configuration:** ${configuration} (Impacts wall counts and structural needs).
        - **Quality Tier:** ${quality} (Impacts material finish rates).
        - **Duration:** ${duration} days.
        - **Features Required:** ${features.join(', ') || 'Standard shell scheme basics'}.

        **Context:** 
        Use 2025 industry market rates for ${location.city}. 
        If the height is > 4m, factor in extra structural rigging and engineering approvals.
        If the area is > 100sqm, factor in dedicated health & safety officer costs.

        **Output Requirements:**
        Return a JSON object with 3 scenarios: "Conservative" (-15% below average), "Realistic" (Market Average), and "Premium" (+25% for high-end finish).
        For the "Realistic" scenario, provide a category breakdown for a Pie Chart.
        
        Structure the response exactly according to the schema.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                scenarios: {
                    type: Type.OBJECT,
                    properties: {
                        conservative: { type: Type.NUMBER, description: "Total cost in AED (Low estimate)" },
                        realistic: { type: Type.NUMBER, description: "Total cost in AED (Market Average)" },
                        premium: { type: Type.NUMBER, description: "Total cost in AED (High finish)" },
                    }
                },
                breakdown: {
                    type: Type.ARRAY,
                    description: "Itemized breakdown for the Realistic scenario",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING, enum: ["Structure", "Flooring", "AV & Tech", "Graphics", "Furniture", "Services & Labor", "Logistics"] },
                            amount: { type: Type.NUMBER },
                            details: { type: Type.STRING, description: "Brief list of items included" }
                        }
                    }
                },
                hidden_costs: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of 3-4 often overlooked costs specific to this location (e.g., 'Venue Performance Bond', 'Rigging Points')."
                },
                industry_benchmark: {
                    type: Type.STRING,
                    description: "Average cost per sqm for this tier (e.g., 'AED 1,500 - 2,000 / sqm')."
                },
                warnings: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Critical warnings based on inputs (e.g., 'Double decker requires structural engineer')."
                }
            },
            required: ['scenarios', 'breakdown', 'hidden_costs', 'industry_benchmark', 'warnings']
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
        console.error('Error in calculate-stand-cost API:', error);
        return new Response(JSON.stringify({ error: error.message || 'Calculation failed.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}