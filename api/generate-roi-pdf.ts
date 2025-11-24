
import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { roiData, userData, inputs } = req.body;
        const date = new Date().toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' });
        const formatCurrency = (val: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(val);

        const metrics = roiData.scenarios.realistic.metrics;

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>FANN ROI Report - ${inputs.event_name}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 40px; background: #fff; }
                    .header { border-bottom: 2px solid #C9A962; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                    .logo { font-size: 24px; font-weight: bold; color: #C9A962; letter-spacing: 2px; }
                    .meta { font-size: 12px; color: #666; text-align: right; }
                    h1 { font-size: 36px; margin: 0 0 10px 0; }
                    h2 { font-size: 20px; color: #C9A962; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                    .summary-box { background: #f9f9f9; padding: 30px; border-radius: 8px; text-align: center; border: 1px solid #eee; margin-bottom: 30px; }
                    .summary-box .roi { font-size: 64px; font-weight: bold; color: ${metrics.cash_roi.roi_percentage >= 0 ? '#22c55e' : '#ef4444'}; }
                    .summary-box .label { text-transform: uppercase; letter-spacing: 1px; font-size: 14px; color: #666; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                    .card { border: 1px solid #eee; padding: 20px; border-radius: 8px; }
                    .card-title { font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 5px; }
                    .card-value { font-size: 24px; font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { text-align: left; border-bottom: 2px solid #eee; padding: 10px; font-size: 12px; text-transform: uppercase; color: #666; }
                    td { border-bottom: 1px solid #eee; padding: 15px 10px; font-size: 14px; }
                    .advice-box { background: #fffbeb; border: 1px solid #fcd34d; padding: 20px; border-radius: 8px; margin-top: 30px; }
                    .footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 12px; color: #999; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">FANN</div>
                    <div class="meta">
                        Generated for: ${userData.company}<br>
                        Date: ${date}
                    </div>
                </div>

                <h1>Exhibition Financial Analysis</h1>
                <p style="color: #666; font-size: 18px;">Event: ${inputs.event_name} | Industry: ${inputs.industry}</p>

                <div class="summary-box">
                    <div class="label">Projected Cash ROI (Realistic)</div>
                    <div class="roi">${metrics.cash_roi.roi_percentage}%</div>
                    <p>Net Profit: ${formatCurrency(metrics.cash_roi.net_profit)}</p>
                </div>

                <div class="grid">
                    <div class="card">
                        <div class="card-title">Total Investment</div>
                        <div class="card-value">${formatCurrency(inputs.total_investment)}</div>
                    </div>
                    <div class="card">
                        <div class="card-title">Break-Even Sales</div>
                        <div class="card-value">${metrics.cash_roi.break_even_deals} Deals</div>
                    </div>
                    <div class="card">
                        <div class="card-title">Cost Per Lead</div>
                        <div class="card-value">${formatCurrency(metrics.cash_roi.cost_per_lead)}</div>
                    </div>
                    <div class="card">
                        <div class="card-title">Brand Media Value</div>
                        <div class="card-value">${formatCurrency(metrics.brand_roi.media_value)}</div>
                    </div>
                </div>

                <h2>Scenario Planning</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Scenario</th>
                            <th>Net Profit</th>
                            <th>ROI %</th>
                            <th>Payback Period</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Conservative</strong></td>
                            <td>${formatCurrency(roiData.scenarios.conservative.metrics.cash_roi.net_profit)}</td>
                            <td>${roiData.scenarios.conservative.metrics.cash_roi.roi_percentage}%</td>
                            <td>${roiData.scenarios.conservative.metrics.cash_roi.payback_period_months} Months</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td><strong>Realistic</strong> (Likely)</td>
                            <td><strong>${formatCurrency(roiData.scenarios.realistic.metrics.cash_roi.net_profit)}</strong></td>
                            <td><strong>${roiData.scenarios.realistic.metrics.cash_roi.roi_percentage}%</strong></td>
                            <td><strong>${roiData.scenarios.realistic.metrics.cash_roi.payback_period_months} Months</strong></td>
                        </tr>
                        <tr>
                            <td><strong>Optimistic</strong></td>
                            <td>${formatCurrency(roiData.scenarios.optimistic.metrics.cash_roi.net_profit)}</td>
                            <td>${roiData.scenarios.optimistic.metrics.cash_roi.roi_percentage}%</td>
                            <td>${roiData.scenarios.optimistic.metrics.cash_roi.payback_period_months} Months</td>
                        </tr>
                    </tbody>
                </table>

                <h2>Strategic Recommendations</h2>
                <div class="advice-box">
                    <ul style="margin: 0; padding-left: 20px;">
                        ${roiData.strategic_advice.map((tip: string) => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>

                <div class="footer">
                    <p>Powered by FANN Intelligence Engine | sales@fann.ae</p>
                </div>
            </body>
            </html>
        `;

        // In production, also send email using nodemailer here if configured
        
        res.status(200).json({ htmlContent });

    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to generate report.' });
    }
}
