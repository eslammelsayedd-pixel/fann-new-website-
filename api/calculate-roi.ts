import { GoogleGenAI, Type } from "@google/genai";

// Vercel Serverless Function (Node.js runtime)
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { company_name, event_name, booth_size_sqm, stand_cost, average_deal_size, close_rate } = req.body;
        
        if (!company_name || !event_name || !booth_size_sqm || !stand_cost || !average_deal_size || !close_rate) {
            return res.status(400).json({ error: 'All form fields are required for calculation.' });
        }

        const apiKey = process.env.API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured on the server.");
        }
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a senior exhibition strategist at FANN, a world-class exhibition design firm in Dubai. Your task is to create a detailed and hyper-personalized ROI projection for a client based on the data they provided.

**Client & Event Data:**
- Company Name: "${company_name}"
- Event Name: "${event_name}"
- Booth Size: ${booth_size_sqm} sqm
- Stand Design & Build Cost (Client's Input): ${stand_cost} AED
- Average Deal Size (Client's Input): ${average_deal_size} AED
- Sales Close Rate (Client's Input): ${close_rate}%

**Your Task:**
1.  **Analyze & Research:** Use your search tool to gather context about the client's company (industry, scale, typical customers) and the event (prestige, attendance numbers, audience demographics).
2.  **Calculate Projections:** Based on your research and the client's data, generate a comprehensive analysis. Your calculations should be realistic for the Dubai/GCC market.
3.  **Generate Output:** Your response MUST be a single, valid JSON object and nothing else. Do not include any text, explanations, or markdown formatting outside of the JSON structure.

The JSON object must follow this exact structure:
{
  "event_analysis": {
    "event_name": "${event_name}",
    "booth_size": "${booth_size_sqm} sqm"
  },
  "visitor_projections": {
    "booth_visitors_min": "number (Estimate total visitors to a ${booth_size_sqm} sqm stand at an event like ${event_name})",
    "booth_visitors_max": "number (Provide a reasonable upper range for visitors)",
    "engaged_visitors_min": "number (Calculate as ~25% of booth_visitors_min)",
    "engaged_visitors_max": "number (Calculate as ~35% of booth_visitors_max)",
    "qualified_leads_min": "number (Calculate as ~10% of booth_visitors_min)",
    "qualified_leads_max": "number (Calculate as ~15% of booth_visitors_max)"
  },
  "financial_projections": {
    "pipeline_value_min": "number (qualified_leads_min * ${average_deal_size})",
    "pipeline_value_max": "number (qualified_leads_max * ${average_deal_size})",
    "expected_revenue_min": "number (pipeline_value_min * (${close_rate} / 100))",
    "expected_revenue_max": "number (pipeline_value_max * (${close_rate} / 100))"
  },
  "investment_breakdown": {
    "stand_cost": ${stand_cost},
    "additional_costs": "number (Estimate based on booth size, e.g., 150 AED/sqm for space, drayage)",
    "staff_costs": "number (Estimate, e.g., 9000 AED)",
    "total_investment": "number (Sum of the above three costs)"
  },
  "roi_metrics": {
    "roi_percentage_min": "number (Round((expected_revenue_min - total_investment) / total_investment * 100))",
    "roi_percentage_max": "number (Round((expected_revenue_max - total_investment) / total_investment * 100))",
    "roi_ratio_min": "string (Format as 'X.XX:1')",
    "roi_ratio_max": "string (Format as 'X.XX:1')",
    "cost_per_lead": "number (total_investment / average of qualified_leads_min and qualified_leads_max)",
    "break_even_deals": "number (Ceiling of total_investment / ${average_deal_size})"
  },
  "reality_check": {
    "confidence_level": "string (e.g., 'High', 'Medium-High')",
    "key_assumptions": ["string (e.g., 'Assumes effective pre-show marketing and a well-trained booth staff.')", "string (e.g., 'Projections are dependent on the client's sales team's ability to convert leads post-event.')"],
    "risk_factors": ["string (e.g., 'Lower than expected event footfall due to external factors.')", "string (e.g., 'Stronger than anticipated competitor presence drawing away traffic.')"]
  },
  "personalized_recommendations": ["string (Provide 2-3 actionable recommendations for '${company_name}' at '${event_name}')", "string"],
  "fann_driven_tips": ["string (Provide 2-3 tips on how a FANN-designed stand specifically helps achieve these results, mentioning things like 'strategic layout for lead capture' or 'immersive tech integration')", "string"]
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro", // Using a more powerful model for this complex task
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });

        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.slice(7, -3).trim();
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.slice(3, -3).trim();
        }

        const results = JSON.parse(jsonText);

        return res.status(200).json(results);

    } catch (error: any) {
        console.error("ROI Calculation Error:", error);
        return res.status(500).json({ error: error.message || "An internal error occurred during calculation." });
    }
}