// Vercel Serverless Function (Node.js runtime)
export default function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { event_name, booth_size_sqm, stand_cost, average_deal_size, close_rate } = req.body;

        // --- Input Validation ---
        if (booth_size_sqm < 9) return res.status(400).json({ error: "Minimum booth size is 9 sqm for meaningful ROI." });
        if (booth_size_sqm > 200) return res.status(400).json({ error: "Contact FANN directly for custom large-scale exhibition planning." });
        if (average_deal_size < 5000) return res.status(400).json({ error: "For low-ticket items, consider trade shows as brand awareness vs. direct ROI." });
        if (close_rate < 5) return res.status(400).json({ error: "Close rate seems low - consider sales training or better lead qualification." });


        // --- Helper Functions ---
        const formatCurrency = (value: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
        
        // --- STEP 1: ESTIMATE BOOTH VISITORS ---
        let baseVisitorsMin: number, baseVisitorsMax: number;
        if (booth_size_sqm <= 20) { [baseVisitorsMin, baseVisitorsMax] = [360, 540]; } 
        else if (booth_size_sqm <= 50) { [baseVisitorsMin, baseVisitorsMax] = [540, 750]; } 
        else if (booth_size_sqm <= 100) { [baseVisitorsMin, baseVisitorsMax] = [750, 1200]; } 
        else { [baseVisitorsMin, baseVisitorsMax] = [1200, 1800]; }

        const megaEvents = ['gitex', 'adipec'];
        const largeEvents = ['gulfood', 'big 5'];
        const nicheEvents = ['dubai watch week', 'mebaa show'];
        const eventNameLower = event_name.toLowerCase();

        let eventMultiplier = 1;
        if (megaEvents.some(e => eventNameLower.includes(e))) eventMultiplier = 1.30;
        else if (largeEvents.some(e => eventNameLower.includes(e))) eventMultiplier = 1.15;
        else if (nicheEvents.some(e => eventNameLower.includes(e))) eventMultiplier = 0.80;

        const booth_visitors_min = Math.round(baseVisitorsMin * eventMultiplier);
        const booth_visitors_max = Math.round(baseVisitorsMax * eventMultiplier);

        // --- STEP 2: CALCULATE ENGAGEMENT RATE ---
        const engaged_visitors_min = Math.round(booth_visitors_min * 0.12); // 15% - 3%
        const engaged_visitors_max = Math.round(booth_visitors_max * 0.18); // 15% + 3%

        // --- STEP 3: CALCULATE QUALIFIED LEADS ---
        const qualified_leads_min = Math.round(engaged_visitors_min * 0.65);
        const qualified_leads_max = Math.round(engaged_visitors_max * 0.65);

        // --- STEP 4: CALCULATE SALES PIPELINE ---
        const opportunities_min = Math.round(qualified_leads_min * 0.25);
        const opportunities_max = Math.round(qualified_leads_max * 0.25);
        const pipeline_value_min = opportunities_min * average_deal_size * 0.85;
        const pipeline_value_max = opportunities_max * average_deal_size * 1.15;

        // --- STEP 5: CALCULATE CLOSED DEALS ---
        const closed_deals_min = opportunities_min * (close_rate / 100);
        const closed_deals_max = opportunities_max * (close_rate / 100);
        const revenue_min = closed_deals_min * average_deal_size * 0.90;
        const revenue_max = closed_deals_max * average_deal_size * 1.10;

        // --- STEP 6: CALCULATE TOTAL INVESTMENT ---
        const additional_costs = booth_size_sqm * 150;
        const staff_costs = 9000;
        const total_investment = stand_cost + additional_costs + staff_costs;

        // --- STEP 7: CALCULATE ROI ---
        const roi_min = ((revenue_min - total_investment) / total_investment) * 100;
        const roi_max = ((revenue_max - total_investment) / total_investment) * 100;
        
        let finalRoiMin = Math.round(roi_min);
        if (finalRoiMin < -50) finalRoiMin = -50;
        let finalRoiMax = Math.round(roi_max);
        
        const roi_ratio_min = (revenue_min / total_investment).toFixed(2);
        const roi_ratio_max = (revenue_max / total_investment).toFixed(2);
        
        // --- STEP 8: COST PER LEAD & BREAK-EVEN ---
        const cost_per_lead = total_investment / ((qualified_leads_min + qualified_leads_max) / 2);
        const break_even_deals = Math.ceil(total_investment / average_deal_size);
        
        // --- AI RECOMMENDATIONS ---
        const recommendations = [];
        if (finalRoiMin < 50) recommendations.push("Your projected ROI is below the industry average. Consider adding interactive elements like a VR demo or a photobooth to increase visitor engagement and lead quality.");
        if (booth_size_sqm < 20 && ['gitex', 'gulfood', 'big 5', 'adipec'].some(e => eventNameLower.includes(e))) recommendations.push(`For a major event like ${event_name}, consider upgrading your booth to 25-30 sqm for significantly better visibility and foot traffic.`);
        if (close_rate > 30) recommendations.push(`Your ${close_rate}% close rate is well above the industry average! This indicates a strong sales process, which will maximize your event ROI.`);
        if (average_deal_size > 100000) recommendations.push("With a high average deal size, investing in premium stand features like a private meeting room or a hospitality area is highly justified to impress key prospects.");
        if (recommendations.length < 2) recommendations.push("To maximize lead capture, ensure your staff are trained to use a lead scanning app and qualify visitors with 2-3 targeted questions.");
        if (recommendations.length < 3) recommendations.push("Launch a pre-show email and social media campaign 2-3 weeks before the event to book meetings in advance and drive traffic to your stand.");

        // --- Construct Final JSON ---
        const response = {
          "event_analysis": { "event_name": event_name, "booth_size": `${booth_size_sqm} sqm` },
          "visitor_projections": {
            "booth_visitors_min": booth_visitors_min, "booth_visitors_max": booth_visitors_max,
            "engaged_visitors_min": engaged_visitors_min, "engaged_visitors_max": engaged_visitors_max,
            "qualified_leads_min": qualified_leads_min, "qualified_leads_max": qualified_leads_max
          },
          "financial_projections": {
            "pipeline_value_min": pipeline_value_min, "pipeline_value_max": pipeline_value_max,
            "expected_revenue_min": revenue_min, "expected_revenue_max": revenue_max,
            "closed_deals_min": parseFloat(closed_deals_min.toFixed(1)), "closed_deals_max": parseFloat(closed_deals_max.toFixed(1))
          },
          "investment_breakdown": {
            "stand_cost": stand_cost, "additional_costs": additional_costs,
            "staff_costs": staff_costs, "total_investment": total_investment
          },
          "roi_metrics": {
            "roi_percentage_min": finalRoiMin, "roi_percentage_max": finalRoiMax,
            "roi_ratio_min": `${roi_ratio_min}:1`, "roi_ratio_max": `${roi_ratio_max}:1`,
            "cost_per_lead": Math.round(cost_per_lead), "break_even_deals": break_even_deals
          },
          "reality_check": {
            "confidence_level": "Medium",
            "key_assumptions": [
              "12-18% visitor engagement rate (industry average)",
              "25% lead-to-opportunity conversion (with proper follow-up)",
              `${close_rate}% opportunity-to-close rate (user input)`,
              "3-9 month sales cycle post-event"
            ],
            "risk_factors": [
              "Actual results depend heavily on sales team performance and post-event follow-up speed.",
              "Stand design quality and location significantly impact engagement rates.",
              "Pre-event marketing is crucial for driving targeted booth traffic."
            ]
          },
          "personalized_recommendations": recommendations.slice(0, 3)
        };

        return res.status(200).json(response);

    } catch (error: any) {
        console.error("ROI Calculation Error:", error);
        return res.status(500).json({ error: "An internal error occurred during calculation." });
    }
}