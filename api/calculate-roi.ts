import { GoogleGenAI, Type } from "@google/genai";

// Vercel Serverless Function (Node.js runtime)
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { initial_analysis, company_name, event_name, booth_size_sqm, stand_cost, average_deal_size, close_rate } = req.body;

        let suggestions: any = {};
        let finalFormData: any = req.body;

        if (initial_analysis) {
            // --- AI-Powered Initial Analysis ---
            if (!company_name || !event_name) {
                return res.status(400).json({ error: 'Company name and event name are required for analysis.' });
            }

            const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
            if (!apiKey) {
                throw new Error("API key is not configured on the server.");
            }
            const ai = new GoogleGenAI({ apiKey });

            const prompt = `You are a market research analyst for FANN, an exhibition design firm. Your task is to provide data-driven estimates for a client's exhibition participation.
Client Company: "${company_name}"
Exhibition: "${event_name}"

1.  **Research:** Use your search tool to find information about the company (their industry, typical product/service value, market position) and the exhibition (its scale, target audience, typical exhibitor profile).
2.  **Estimate:** Based on your research, provide realistic estimates for the following parameters. Prioritize data over assumptions.
    -   **booth_size_sqm:** A suitable booth size in square meters.
    -   **stand_cost:** An estimated design & build cost in AED for a high-quality stand of that size at this event.
    -   **average_deal_size:** A plausible average deal size or customer lifetime value in AED for this company.
    -   **close_rate:** A conservative but realistic sales close rate percentage for leads from this type of event.
3.  **Output:** Your response MUST be a single, valid JSON object and nothing else. Do not include markdown formatting or explanations.

Example for a large tech company at a major tech show:
{ "booth_size_sqm": 100, "stand_cost": 250000, "average_deal_size": 150000, "close_rate": 15 }`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                }
            });
            
            let jsonText = response.text.trim();
            // Clean up potential markdown fences from the response
            if (jsonText.startsWith('```json')) {
                jsonText = jsonText.slice(7, -3).trim();
            } else if (jsonText.startsWith('```')) {
                 jsonText = jsonText.slice(3, -3).trim();
            }

            suggestions = JSON.parse(jsonText);
            finalFormData = { ...req.body, ...suggestions };
        }

        // --- Core ROI Calculation Logic ---
        const {
            booth_size_sqm: final_booth_size,
            stand_cost: final_stand_cost,
            average_deal_size: final_avg_deal_size,
            close_rate: final_close_rate,
            event_name: final_event_name
        } = finalFormData;

        // Validation for calculated values
        if (final_booth_size < 9) return res.status(400).json({ error: "Minimum booth size is 9 sqm for meaningful ROI." });
        if (final_avg_deal_size < 1000) return res.status(400).json({ error: "Deal size seems too low for this type of event." });
        
        // --- Calculation Steps ---
        let baseVisitorsMin, baseVisitorsMax;
        if (final_booth_size <= 20) { [baseVisitorsMin, baseVisitorsMax] = [360, 540]; }
        else if (final_booth_size <= 50) { [baseVisitorsMin, baseVisitorsMax] = [540, 750]; }
        else if (final_booth_size <= 100) { [baseVisitorsMin, baseVisitorsMax] = [750, 1200]; }
        else { [baseVisitorsMin, baseVisitorsMax] = [1200, 1800]; }
        
        const eventNameLower = final_event_name.toLowerCase();
        let eventMultiplier = 1;
        if (['gitex', 'adipec', 'arab health'].some(e => eventNameLower.includes(e))) eventMultiplier = 1.30;
        else if (['gulfood', 'big 5', 'cityscape'].some(e => eventNameLower.includes(e))) eventMultiplier = 1.15;
        else if (['dubai watch week', 'mebaa show'].some(e => eventNameLower.includes(e))) eventMultiplier = 0.80;

        const booth_visitors_min = Math.round(baseVisitorsMin * eventMultiplier);
        const booth_visitors_max = Math.round(baseVisitorsMax * eventMultiplier);

        const qualified_leads_min = Math.round(booth_visitors_min * 0.10); // More conservative lead rate
        const qualified_leads_max = Math.round(booth_visitors_max * 0.15);

        const revenue_min = qualified_leads_min * (final_close_rate / 100) * final_avg_deal_size;
        const revenue_max = qualified_leads_max * (final_close_rate / 100) * final_avg_deal_size;

        const total_investment = final_stand_cost + (final_booth_size * 150) + 9000; // Stand + Additional + Staff

        const roi_min = ((revenue_min - total_investment) / total_investment) * 100;
        const roi_max = ((revenue_max - total_investment) / total_investment) * 100;

        const roi_ratio_min = (revenue_min / total_investment).toFixed(2);
        const roi_ratio_max = (revenue_max / total_investment).toFixed(2);

        const cost_per_lead = total_investment / ((qualified_leads_min + qualified_leads_max) / 2);
        const break_even_deals = Math.ceil(total_investment / final_avg_deal_size);

        const results = {
            visitor_projections: { qualified_leads_min, qualified_leads_max },
            financial_projections: { expected_revenue_min: revenue_min, expected_revenue_max: revenue_max },
            roi_metrics: {
                roi_percentage_min: Math.round(roi_min),
                roi_percentage_max: Math.round(roi_max),
                roi_ratio_min: `${roi_ratio_min}:1`,
                roi_ratio_max: `${roi_ratio_max}:1`,
                break_even_deals,
            },
        };

        const responsePayload = initial_analysis ? { suggestions, results } : { results };
        return res.status(200).json(responsePayload);

    } catch (error: any) {
        console.error("ROI Calculation Error:", error);
        return res.status(500).json({ error: error.message || "An internal error occurred during calculation." });
    }
}