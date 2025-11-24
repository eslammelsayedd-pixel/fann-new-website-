
import { Type } from "@google/genai";
import nodemailer from 'nodemailer';

// Switch to Node.js runtime to support nodemailer
// export const config = { runtime: 'edge' };

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const body = req.body;
        const { 
            standType,
            dimensions, 
            configuration, 
            location, 
            duration, 
            features,
            contact
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
        
        // Always add basic graphics cost estimation if not strictly excluded
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

        // === SEND EMAIL TO SALES ===
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

        if (SMTP_HOST && contact && contact.email) {
            try {
                const transporter = nodemailer.createTransport({
                    host: SMTP_HOST,
                    port: parseInt(SMTP_PORT || '587', 10),
                    secure: SMTP_SECURE === 'true',
                    auth: { user: SMTP_USER, pass: SMTP_PASS },
                });

                const formatCurrency = (val: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(val);

                const html = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #C9A962;">New Stand Cost Calculation</h2>
                        <p><strong>Client:</strong> ${contact.name} (${contact.company})</p>
                        <p><strong>Email:</strong> ${contact.email}</p>
                        <p><strong>Phone:</strong> ${contact.phone}</p>
                        <p><strong>Event:</strong> ${contact.eventName || 'N/A'} at ${location}</p>
                        <hr/>
                        <h3>Specifications</h3>
                        <ul>
                            <li>Type: ${standType}</li>
                            <li>Size: ${dimensions.length}x${dimensions.width}m (${totalSqm} sqm)</li>
                            <li>Config: ${configuration}</li>
                            <li>Features: ${features.length > 0 ? features.join(', ') : 'None'}</li>
                        </ul>
                        <h3>Estimate</h3>
                        <p style="font-size: 18px; font-weight: bold;">${formatCurrency(finalMin)} - ${formatCurrency(finalMax)}</p>
                    </div>
                `;

                await transporter.sendMail({
                    from: `FANN Calculator <${SMTP_USER}>`,
                    to: 'sales@fann.ae',
                    subject: `New Cost Calc Lead: ${contact.company}`,
                    html: html,
                });
            } catch (emailError) {
                console.error("Failed to send lead email:", emailError);
                // Don't fail the response if email fails
            }
        }

        return res.status(200).json(result);

    } catch (error: any) {
        console.error('Error in calculate-stand-cost API:', error);
        return res.status(500).json({ error: error.message || 'Calculation failed.' });
    }
}
