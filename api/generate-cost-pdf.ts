
// Vercel Serverless Function
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { calculation, inputs } = req.body;
        const date = new Date().toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' });
        const formatCurrency = (val: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(val);

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Exhibition Cost Estimate - FANN</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 40px; background: #fff; }
                    .header { border-bottom: 2px solid #C9A962; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                    .logo { font-size: 24px; font-weight: bold; color: #C9A962; letter-spacing: 2px; }
                    .title { font-size: 32px; font-weight: 700; margin: 0 0 10px 0; }
                    .meta { font-size: 14px; color: #666; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
                    .card { background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee; }
                    .card h3 { margin-top: 0; font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 1px; }
                    .card .value { font-size: 18px; font-weight: 600; }
                    .estimate-box { background: #111; color: #fff; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 40px; }
                    .estimate-box h2 { margin: 0 0 10px 0; color: #C9A962; font-size: 48px; }
                    .estimate-box p { margin: 0; color: #ccc; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                    th { text-align: left; border-bottom: 2px solid #eee; padding: 10px; font-size: 12px; text-transform: uppercase; color: #666; }
                    td { border-bottom: 1px solid #eee; padding: 15px 10px; font-size: 14px; }
                    .footer { font-size: 12px; color: #999; text-align: center; margin-top: 60px; border-top: 1px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="logo">FANN</div>
                        <div class="meta">Exhibition Design & Build</div>
                    </div>
                    <div style="text-align: right;">
                        <div class="meta">Date: ${date}</div>
                        <div class="meta">Prepared For: ${inputs.contact.company}</div>
                    </div>
                </div>

                <h1 class="title">Preliminary Cost Estimate</h1>
                <p style="margin-bottom: 40px; color: #666;">Based on 2025 market rates for ${inputs.location}.</p>

                <div class="grid">
                    <div class="card">
                        <h3>Specifications</h3>
                        <div class="value">${inputs.dimensions.length}m x ${inputs.dimensions.width}m (${inputs.dimensions.length * inputs.dimensions.width} sqm)</div>
                        <div style="margin-top: 5px; font-size: 14px;">${inputs.configuration} Configuration</div>
                    </div>
                    <div class="card">
                        <h3>Details</h3>
                        <div class="value">${inputs.standType}</div>
                        <div style="margin-top: 5px; font-size: 14px;">${inputs.features.length} add-ons selected</div>
                    </div>
                </div>

                <div class="estimate-box">
                    <p>Estimated Budget Range</p>
                    <h2>${formatCurrency(calculation.estimatedCost.min)} - ${formatCurrency(calculation.estimatedCost.max)}</h2>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 70%;">Category</th>
                            <th style="width: 30%; text-align: right;">Avg. Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${calculation.breakdown.map((item: any) => `
                            <tr>
                                <td><strong>${item.category}</strong></td>
                                <td style="text-align: right;">${formatCurrency(item.amount)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
                    <h3 style="margin-top: 0; font-size: 14px;">Included Hidden Costs & Fees</h3>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #444;">
                        ${calculation.hiddenCosts.map((cost: string) => `<li>${cost}</li>`).join('')}
                    </ul>
                </div>

                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} FANN Exhibition Interiors LLC. | sales@fann.ae | +971 50 566 7502</p>
                    <p>${calculation.disclaimer}</p>
                </div>
            </body>
            </html>
        `;

        res.status(200).json({ htmlContent });

    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to generate report.' });
    }
}
