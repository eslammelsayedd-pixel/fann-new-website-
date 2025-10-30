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
        const { company_name, event_name, booth_size_sqm, stand_cost, average_deal_size, close_rate } = body;

        if (!company_name || !event_name) {
            return new Response(JSON.stringify({ error: 'Company name and event name are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
        Act as a world-class exhibition ROI consultant for the Middle East market (UAE & KSA).
        Analyze the following data for a company exhibiting at an event:
        - Company Name: "${company_name}"
        - Event Name: "${event_name}"
        - Booth Size: ${booth_size_sqm} sqm
        - Stand Design & Build Cost: AED ${stand_cost}
        - Average Deal Size: AED ${average_deal_size}
        - Sales Close Rate: ${close_rate}%

        Based on your expert knowledge of events like GITEX, Arab Health, Cityscape, LEAP, etc., and considering the booth size and typical industry performance, generate a hyper-personalized and realistic ROI projection. Provide a range (min/max) for key metrics to account for variability.

        Your response MUST be a single, valid JSON object with the exact structure below. Do not include any text, notes, or markdown formatting before or after the JSON object.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                visitor_projections: {
                    type: Type.OBJECT,
                    properties: {
                        total_visitors_min: { type: Type.INTEGER, description: "Lowest estimated number of total visitors to the booth." },
                        total_visitors_max: { type: Type.INTEGER, description: "Highest estimated number of total visitors to the booth." },
                        qualified_leads_min: { type: Type.INTEGER, description: "Lowest estimated number of qualified leads generated." },
                        qualified_leads_max: { type: Type.INTEGER, description: "Highest estimated number of qualified leads generated." },
                    }
                },
                financial_projections: {
                    type: Type.OBJECT,
                    properties: {
                        expected_deals_min: { type: Type.INTEGER, description: "Lowest estimated number of deals closed from leads." },
                        expected_deals_max: { type: Type.INTEGER, description: "Highest estimated number of deals closed from leads." },
                        expected_revenue_min: { type: Type.NUMBER, description: "Lowest estimated total revenue from closed deals (AED)." },
                        expected_revenue_max: { type: Type.NUMBER, description: "Highest estimated total revenue from closed deals (AED)." },
                    }
                },
                roi_metrics: {
                    type: Type.OBJECT,
                    properties: {
                        roi_percentage_min: { type: Type.NUMBER, description: "Lowest estimated Return on Investment percentage." },
                        roi_percentage_max: { type: Type.NUMBER, description: "Highest estimated Return on Investment percentage." },
                        roi_ratio_min: { type: Type.STRING, description: "Lowest estimated ROI ratio (e.g., '1:3')." },
                        roi_ratio_max: { type: Type.STRING, description: "Highest estimated ROI ratio (e.g., '1:5')." },
                        break_even_deals: { type: Type.INTEGER, description: "Number of deals required to cover the stand cost." },
                    }
                },
                strategic_recommendation: {
                  type: Type.STRING,
                  description: "A concise, actionable strategic recommendation (2-3 sentences) for the company to maximize their ROI at this specific event."
                }
            },
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
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
        console.error('Error in calculate-roi API:', error);
        return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}