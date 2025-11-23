
import { Type } from "@google/genai";

// Vercel Edge Runtime
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
            standType,
            dimensions, 
            configuration, 
            location, 
            duration, 
            features 
        } = body;

        // === CONSTANTS & RATES (AED) ===
        
        // Base Rates per SQM (Min - Max)
        const rates: any = {
            'Shell Scheme': {
                small: [1000, 1400], // 9-20
                medium: [850, 1200], // 21-50
                large: [700, 1000]   // 51+
            },
            'Custom-Built': {
                small: [1000, 1500],
                medium: [900, 1300],
                large: [700, 1200]
            },
            'Premium/Luxury': {
                all: [1500, 2000]
            }
        };

        const configMultipliers: any = {
            'Island': 1.25,
            'Peninsula': 1.15,
            'Corner': 1.08,
            'Inline': 1.0
        };

        const locationMultipliers: any = {
            'Dubai World Trade Centre (DWTC)': 1.15,
            'Dubai Expo City': 1.12,
            'ADNEC Abu Dhabi': 1.08,
            'Riyadh Front Exhibition Center': 1.20,
            'Jeddah JCFE': 1.10,
            'Other GCC': 1.0
        };

        const durationMultipliers: any = {
            '1 day': 0.75,
            '2-3 days': 1.0,
            '4-5 days': 1.08,
            '1 week+': 1.15
        };

        const featureCosts: any = {
            "Reception Desk": 2500,
            "Storage Room": 3500,
            "Meeting Room": 6000,
            "LED Video Wall": 7200, // Fixed assumption 6sqm @ 1200
            "Premium Flooring": 150, // Per sqm
            "Hanging Structure": 5500,
            "Premium Lighting": 3800,
            "Audio System": 2800,
            "Graphics & Branding": 200, // Per sqm assumption
            "Furniture Package": 1800,
            "WiFi Setup": 1500
        };

        // === CALCULATION ===

        const totalSqm = dimensions.length * dimensions.width;
        
        // 1. Determine Base Rate
        let baseRateMin = 0;
        let baseRateMax = 0;

        if (standType === 'Premium/Luxury') {
            baseRateMin = rates['Premium/Luxury'].all[0];
            baseRateMax = rates['Premium/Luxury'].all[1];
        } else {
            const category = standType === 'Shell Scheme' ? 'Shell Scheme' : 'Custom-Built';
            let sizeKey = 'medium';
            if (totalSqm <= 20) sizeKey = 'small';
            else if (totalSqm > 50) sizeKey = 'large';
            
            baseRateMin = rates[category][sizeKey][0];
            baseRateMax = rates[category][sizeKey][1];
        }

        // 2. Base Construction Cost
        let constructionMin = baseRateMin * totalSqm;
        let constructionMax = baseRateMax * totalSqm;

        // 3. Apply Multipliers
        const multiplier = (configMultipliers[configuration] || 1) * 
                           (locationMultipliers[location] || 1) * 
                           (durationMultipliers[duration] || 1);

        constructionMin *= multiplier;
        constructionMax *= multiplier;

        // 4. Add Features
        let featuresTotal = 0;
        if (Array.isArray(features)) {
            features.forEach((f: string) => {
                if (featureCosts[f]) {
                    featuresTotal += featureCosts[f];
                }
                // Handle per sqm features specifically by checking ID
                if (f === "Premium Flooring") {
                    featuresTotal += (150 * totalSqm) - 150; // Subtract the flat 150 added above, add full sqm cost
                }
            });
        }
        
        // Always add basic graphics cost estimation if not strictly excluded, but for this logic we stick to checklist
        // Assuming "Graphics & Branding" adds 200/sqm if selected (not in checklist but standard)
        // Let's add a baseline graphics cost for Custom stands
        if (standType !== 'Shell Scheme') {
            featuresTotal += (200 * totalSqm); 
        }

        // 5. Hidden Costs (Estimates)
        const hiddenCostsList = [
            "Venue Registration & Insurance (AED 1,500)",
            "Rigging Permits & Waste Disposal (AED 1,200)",
            "Transport & Logistics (AED 2,000)"
        ];
        let hiddenTotalMin = 3000;
        let hiddenTotalMax = 6000;

        if (dimensions.height > 4) {
            hiddenTotalMin += 2000; // Engineering approval
            hiddenTotalMax += 4000;
            hiddenCostsList.push("Structural Engineer Approval (Height > 4m)");
        }

        // 6. Final Totals
        const finalMin = Math.round(constructionMin + featuresTotal + hiddenTotalMin);
        const finalMax = Math.round(constructionMax + featuresTotal + hiddenTotalMax);

        const result = {
            estimatedCost: {
                min: finalMin,
                max: finalMax
            },
            breakdown: [
                { category: "Structure & Fabrication", amount: Math.round((constructionMin + constructionMax) / 2) },
                { category: "Features & AV", amount: featuresTotal },
                { category: "Logistics & Approvals", amount: Math.round((hiddenTotalMin + hiddenTotalMax) / 2) }
            ],
            hiddenCosts: hiddenCostsList,
            disclaimer: "This is an AI-powered estimate based on 2025 market rates. Final pricing requires a detailed technical drawing."
        };

        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Error in calculate-stand-cost API:', error);
        return new Response(JSON.stringify({ error: error.message || 'Calculation failed.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
