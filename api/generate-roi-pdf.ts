import nodemailer from 'nodemailer';

// FIX: Add type declaration for nodemailer module.
declare const nodemailer: any;


const formatCurrency = (value: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

const generateReportHtml = (roiData: any, userData: any) => {
    const { event_analysis, visitor_projections, financial_projections, investment_breakdown, roi_metrics, reality_check, personalized_recommendations, fann_driven_tips } = roiData;
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FANN Proprietary ROI Analysis for ${event_analysis.event_name}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #1a1a1a; color: #F5F5DC; }
            .container { max-width: 800px; margin: 40px auto; padding: 40px; background-color: #2C2C2C; border-radius: 8px; border: 1px solid #D4AF76; }
            h1, h2, h3 { font-family: 'Playfair Display', serif; color: #D4AF76; margin: 0 0 10px 0; }
            h1 { font-size: 32px; text-align: center; border-bottom: 2px solid #D4AF76; padding-bottom: 20px; margin-bottom: 20px; }
            h2 { font-size: 24px; margin-top: 30px; border-bottom: 1px solid #5A8B8C; padding-bottom: 5px; }
            p, li { line-height: 1.6; color: #B0B0B0; }
            .summary-card { background-color: #1a1a1a; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .summary-card .label { font-size: 14px; text-transform: uppercase; color: #B0B0B0; letter-spacing: 1px; }
            .summary-card .value { font-size: 48px; font-weight: bold; color: #5A8B8C; margin: 10px 0; }
            .summary-card .sub-value { font-size: 16px; color: #B0B0B0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
            .card { background-color: #1a1a1a; padding: 15px; border-radius: 8px; }
            .card h3 { font-family: 'Inter', sans-serif; font-size: 18px; color: #F5F5DC; margin-bottom: 15px; }
            .metric { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #444; }
            .metric:last-child { border-bottom: none; }
            .metric span:first-child { color: #B0B0B0; }
            .metric span:last-child { font-weight: bold; color: #F5F5DC; }
            ul { padding-left: 20px; margin-top: 10px; }
            footer { text-align: center; margin-top: 40px; font-size: 12px; color: #B0B0B0; border-top: 1px solid #444; padding-top: 20px; }
            .print-note { text-align: center; margin-top: 20px; font-style: italic; color: #B0B0B0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>FANN Proprietary ROI Analysis</h1>
            <p style="text-align:center;">Prepared for: ${userData.company}<br>Date: ${today}</p>
            
            <div class="summary-card">
                <p class="label">Projected Return on Investment (ROI)</p>
                <p class="value">${roi_metrics.roi_percentage_min}% - ${roi_metrics.roi_percentage_max}%</p>
                <p class="sub-value">(${roi_metrics.roi_ratio_min} to ${roi_metrics.roi_ratio_max} return on investment)</p>
            </div>

            <h2>Executive Summary</h2>
            <p>This report outlines the projected return on investment for <strong>${event_analysis.event_name}</strong> with a <strong>${event_analysis.booth_size}</strong> booth. The analysis is based on FANN's proprietary model, which synthesizes industry benchmark data with our extensive experience in over 150 regional exhibitions. The projections indicate a strong potential for positive ROI, contingent on strategic execution and effective post-event follow-up.</p>

            <div class="grid">
                <div class="card">
                    <h3>Visitor Projections</h3>
                    <div class="metric"><span>Booth Visitors</span> <span>${visitor_projections.booth_visitors_min} - ${visitor_projections.booth_visitors_max}</span></div>
                    <div class="metric"><span>Engaged Visitors</span> <span>${visitor_projections.engaged_visitors_min} - ${visitor_projections.engaged_visitors_max}</span></div>
                    <div class="metric"><span>Qualified Leads</span> <span>${visitor_projections.qualified_leads_min} - ${visitor_projections.qualified_leads_max}</span></div>
                </div>
                <div class="card">
                    <h3>Financial Projections</h3>
                    <div class="metric"><span>Sales Pipeline</span> <span>${formatCurrency(financial_projections.pipeline_value_min)} - ${formatCurrency(financial_projections.pipeline_value_max)}</span></div>
                    <div class="metric"><span>Expected Revenue</span> <span>${formatCurrency(financial_projections.expected_revenue_min)} - ${formatCurrency(financial_projections.expected_revenue_max)}</span></div>
                    <div class="metric"><span>Deals to Break-Even</span> <span>${roi_metrics.break_even_deals}</span></div>
                </div>
            </div>

            <h2>Investment & Key Metrics</h2>
            <div class="card">
                <div class="metric"><span>Stand Design & Build (Input)</span> <span>${formatCurrency(investment_breakdown.stand_cost)}</span></div>
                <div class="metric"><span>Est. Additional Costs</span> <span>${formatCurrency(investment_breakdown.additional_costs)}</span></div>
                <div class="metric"><span>Est. Staffing Costs</span> <span>${formatCurrency(investment_breakdown.staff_costs)}</span></div>
                <div class="metric" style="background-color:#444; margin: 8px -15px 0 -15px; padding: 8px 15px;"><span><strong>Total Estimated Investment</strong></span> <span><strong>${formatCurrency(investment_breakdown.total_investment)}</strong></span></div>
                <div class="metric"><span>Cost Per Qualified Lead</span> <span>${formatCurrency(roi_metrics.cost_per_lead)}</span></div>
            </div>

            <h2>FANN Strategic Recommendations</h2>
            <div class="card">
                <ul>
                    ${personalized_recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <h2>FANN-Powered Tips</h2>
             <div class="card">
                <ul>
                    ${fann_driven_tips.map((tip: string) => `<li>${tip}</li>`).join('')}
                </ul>
            </div>

            <h2>Methodology & Assumptions</h2>
            <div class="card">
                <p><strong>Confidence Level:</strong> ${reality_check.confidence_level}</p>
                <p><strong>Key Assumptions:</strong></p>
                <ul>
                    ${reality_check.key_assumptions.map((ass: string) => `<li>${ass}</li>`).join('')}
                </ul>
                 <p><strong>Risk Factors:</strong></p>
                <ul>
                    ${reality_check.risk_factors.map((risk: string) => `<li>${risk}</li>`).join('')}
                </ul>
                <p style="margin-top:15px; font-size: 12px; font-style: italic;">This is a projection based on our model and industry data. Actual results may vary based on market conditions, sales execution, and other factors.</p>
            </div>
            <p class="print-note">You can print this page to PDF (Ctrl+P or Cmd+P) for a portable version of your report.</p>
            <footer>
                <p><strong>FANN | Exhibition, Events & Interior Design</strong></p>
                <p>Office 508, Dusseldorf Business Point, Al Barsha 1, Dubai, UAE</p>
                <p>sales@fann.ae | +971 50 566 7502</p>
            </footer>
        </div>
    </body>
    </html>
    `;
};


// Vercel Serverless Function (Node.js runtime)
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        console.error('SMTP environment variables are not configured on the server.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        const { roiData, userData } = req.body;
        if (!roiData || !userData) {
            return res.status(400).json({ error: 'Missing ROI data or user data.' });
        }
        
        // --- Generate Report Content ---
        const htmlContent = generateReportHtml(roiData, userData);

        // --- Send Lead Notification Email to Sales ---
        const salesEmailHtml = `
            <h1>New ROI Report Downloaded</h1>
            <p>A new lead has downloaded a detailed ROI report.</p>
            <h2>Lead Details</h2>
            <ul>
                <li><strong>Name:</strong> ${userData.name}</li>
                <li><strong>Email:</strong> ${userData.email}</li>
                <li><strong>Company:</strong> ${userData.company}</li>
            </ul>
            <h2>ROI Summary</h2>
            <ul>
                <li><strong>Event:</strong> ${roiData.event_analysis.event_name}</li>
                <li><strong>Booth Size:</strong> ${roiData.event_analysis.booth_size}</li>
                <li><strong>Stand Cost:</strong> ${formatCurrency(roiData.investment_breakdown.stand_cost)}</li>
                <li><strong>Projected ROI:</strong> ${roiData.roi_metrics.roi_percentage_min}% - ${roiData.roi_metrics.roi_percentage_max}%</li>
            </ul>
            <p><strong>Please follow up with this lead promptly.</strong></p>
        `;

        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT, 10),
            secure: SMTP_SECURE === 'true',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        await transporter.verify();

        await transporter.sendMail({
            from: `FANN ROI Calculator <${SMTP_USER}>`,
            to: 'sales@fann.ae',
            subject: `New Lead: ROI Report for ${userData.company}`,
            replyTo: userData.email,
            html: salesEmailHtml,
        });

        // --- Return HTML to client for download ---
        return res.status(200).json({ htmlContent });

    } catch (error: any) {
        console.error("Generate ROI PDF Error:", error);
         if (error.code === 'EAUTH' || error.message.includes('Authentication failed')) {
            return res.status(500).json({ error: 'SMTP Authentication failed. Please check your credentials.' });
        }
        return res.status(500).json({ error: "An internal error occurred while generating the report." });
    }
}