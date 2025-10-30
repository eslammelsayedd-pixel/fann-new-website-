import nodemailer from 'nodemailer';

// This is a Vercel Serverless Function.
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { roiData, userData } = req.body;
        if (!roiData || !userData) {
            return res.status(400).json({ error: 'Missing ROI data or user data.' });
        }

        // 1. Send lead notification email
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
        if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
             try {
                const transporter = nodemailer.createTransport({
                    host: SMTP_HOST,
                    port: parseInt(SMTP_PORT || "587", 10),
                    secure: SMTP_SECURE === 'true',
                    auth: { user: SMTP_USER, pass: SMTP_PASS },
                });
                
                await transporter.sendMail({
                    from: `FANN ROI Calculator <${SMTP_USER}>`,
                    to: 'sales@fann.ae',
                    subject: `New ROI Report Download: ${userData.company} for ${roiData.event_name}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #f5f5dc; background-color: #1a1a1a; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #D4AF76;">
                            <h1 style="color: #D4AF76;">New ROI Report Lead</h1>
                            <p><strong>Name:</strong> ${userData.name}</p>
                            <p><strong>Email:</strong> <a href="mailto:${userData.email}" style="color: #5A8B8C;">${userData.email}</a></p>
                            <p><strong>Company:</strong> ${userData.company}</p>
                            <hr style="border-color: #444; margin: 20px 0;"/>
                            <h2 style="color: #D4AF76;">Report Details</h2>
                            <p><strong>Event:</strong> ${roiData.event_name}</p>
                            <p><strong>Projected ROI:</strong> ${roiData.roi_metrics.roi_percentage_min}% - ${roiData.roi_metrics.roi_percentage_max}%</p>
                        </div>
                    `,
                });
            } catch (emailError) {
                console.error("Failed to send lead notification email:", emailError);
                // Do not block the user from getting their report if email fails
            }
        } else {
             console.warn("SMTP variables not set. Skipping lead notification email.");
        }
        

        // 2. Generate and return HTML content for download
        const formatCurrency = (value: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>FANN ROI Analysis for ${userData.company}</title>
                <style>
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #121212; color: #FCE5D4; }
                    .container { max-width: 800px; margin: 40px auto; padding: 40px; background-color: #1E1E1E; border-radius: 8px; border: 1px solid #D4AF76; }
                    h1, h2, h3 { font-family: 'Playfair Display', serif; color: #D4AF76; }
                    h1 { font-size: 36px; text-align: center; }
                    h2 { font-size: 28px; border-bottom: 2px solid #2D767F; padding-bottom: 10px; margin-top: 40px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #333; }
                    th { color: #A99E96; text-transform: uppercase; font-size: 12px; }
                    td { font-size: 16px; }
                    .highlight { font-size: 24px; font-weight: bold; color: #FCE5D4; }
                    .summary-card { background-color: #121212; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; }
                    .summary-card p { margin: 0; color: #A99E96; text-transform: uppercase; font-size: 14px; }
                    .summary-card .value { font-size: 48px; color: #2D767F; font-weight: bold; margin: 10px 0; font-family: 'Playfair Display', serif; }
                    .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #A99E96; }
                </style>
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <h1>FANN Proprietary ROI Analysis</h1>
                    <p style="text-align:center; color: #A99E96;">Prepared for ${userData.company} at ${roiData.event_name}</p>

                    <div class="summary-card">
                        <p>Projected Return on Investment (ROI)</p>
                        <div class="value">${roiData.roi_metrics.roi_percentage_min}% - ${roiData.roi_metrics.roi_percentage_max}%</div>
                        <p>(${roiData.roi_metrics.roi_ratio_min} to ${roiData.roi_metrics.roi_ratio_max} return)</p>
                    </div>

                    <h2>Visitor & Lead Projections</h2>
                    <table>
                        <tr><th>Metric</th><th>Min Projection</th><th>Max Projection</th></tr>
                        <tr><td>Total Booth Visitors</td><td>${roiData.visitor_projections.total_visitors_min}</td><td>${roiData.visitor_projections.total_visitors_max}</td></tr>
                        <tr><td>Qualified Leads</td><td class="highlight">${roiData.visitor_projections.qualified_leads_min}</td><td class="highlight">${roiData.visitor_projections.qualified_leads_max}</td></tr>
                    </table>

                    <h2>Financial Projections</h2>
                    <table>
                        <tr><th>Metric</th><th>Min Projection</th><th>Max Projection</th></tr>
                        <tr><td>Expected Deals</td><td>${roiData.financial_projections.expected_deals_min}</td><td>${roiData.financial_projections.expected_deals_max}</td></tr>
                        <tr><td>Expected Revenue</td><td class="highlight">${formatCurrency(roiData.financial_projections.expected_revenue_min)}</td><td class="highlight">${formatCurrency(roiData.financial_projections.expected_revenue_max)}</td></tr>
                        <tr><td>Deals to Break-Even</td><td colspan="2">${roiData.roi_metrics.break_even_deals}</td></tr>
                    </table>

                    <h2>Strategic Recommendations</h2>
                    <p>${roiData.strategic_recommendation || "To maximize these results, focus on pre-show marketing to drive targeted traffic to your booth, implement a robust lead-capture system, and ensure prompt post-event follow-up. A compelling stand design from FANN is your first step to attracting high-quality visitors."}</p>
                    
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} FANN. All Rights Reserved.</p>
                        <p>This is an AI-powered projection and should be used for planning purposes. Actual results may vary.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        res.status(200).json({ htmlContent });

    } catch (error: any) {
        console.error('Error in generate-roi-pdf API:', error);
        return res.status(500).json({ error: 'Failed to generate report.' });
    }
}