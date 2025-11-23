
// Vercel Serverless Function
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { guideData, userContext } = req.body;
        const date = new Date().toLocaleDateString('en-AE', { year: 'numeric', month: 'long', day: 'numeric' });

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>FANN Exhibition Strategy - ${userContext.industry}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 40px; background: #fff; }
                    .header { border-bottom: 2px solid #C9A962; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; }
                    .logo { font-size: 28px; font-weight: bold; color: #C9A962; letter-spacing: 2px; }
                    h1 { font-size: 32px; font-weight: 700; margin: 0 0 10px 0; color: #111; }
                    h2 { font-size: 24px; color: #C9A962; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                    .summary { background: #f9f9f9; padding: 20px; border-left: 4px solid #C9A962; margin-bottom: 30px; font-style: italic; }
                    .phase { margin-bottom: 30px; break-inside: avoid; }
                    .phase-title { font-weight: bold; font-size: 18px; color: #333; background: #eee; padding: 10px; display: inline-block; margin-bottom: 10px; border-radius: 4px; }
                    ul { list-style-type: none; padding: 0; }
                    li { margin-bottom: 8px; padding-left: 20px; position: relative; }
                    li:before { content: "•"; color: #C9A962; font-weight: bold; position: absolute; left: 0; }
                    .compliance-box { background: #eefdf5; border: 1px solid #a8eec5; padding: 15px; border-radius: 8px; margin-top: 20px; }
                    .warning-box { background: #fff4f4; border: 1px solid #fcc; padding: 15px; border-radius: 8px; margin-top: 20px; color: #c00; }
                    .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">FANN</div>
                    <div style="text-align: right; font-size: 12px; color: #666;">
                        Generated on ${date}<br>
                        ${userContext.industry} | ${userContext.location}
                    </div>
                </div>

                <h1>${guideData.guideTitle}</h1>
                <div class="summary">
                    ${guideData.executiveSummary}
                </div>

                <h2>Strategic Timeline</h2>
                ${guideData.phases.map((phase: any) => `
                    <div class="phase">
                        <div class="phase-title">${phase.phaseName} (${phase.timeframe})</div>
                        <p>${phase.description}</p>
                        <ul>
                            ${phase.actions.map((action: any) => `
                                <li><strong>${action.task}</strong> ${action.priority === 'High' ? '(High Priority)' : ''}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}

                <h2>Compliance & Regulations (${userContext.location})</h2>
                <div class="compliance-box">
                    <ul>
                        ${guideData.compliance_notes.map((note: string) => `<li>${note}</li>`).join('')}
                    </ul>
                </div>

                <h2>Budget Optimization</h2>
                <ul>
                    ${guideData.budget_hacks.map((hack: string) => `<li>${hack}</li>`).join('')}
                </ul>

                <h2>Common Pitfalls to Avoid</h2>
                <div class="warning-box">
                    <ul>
                        ${guideData.common_pitfalls.map((pitfall: string) => `<li>${pitfall}</li>`).join('')}
                    </ul>
                </div>

                <div class="footer">
                    <p>Powered by FANN Intelligence | sales@fann.ae | +971 50 566 7502</p>
                </div>
            </body>
            </html>
        `;

        res.status(200).json({ htmlContent });

    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to generate PDF.' });
    }
}
