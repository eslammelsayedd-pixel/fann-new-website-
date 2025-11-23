import nodemailer from 'nodemailer';

// Vercel Serverless Function
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, firstName, magnetId, details } = req.body;
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Map magnet IDs to download links
    const magnetResources: any = {
        'exhibition-guide-pdf': {
            subject: 'Your Ultimate Exhibition Success Guide',
            link: 'https://fann.ae/downloads/FANN_Exhibition_Success_Guide_2025.pdf', // Placeholder
            title: 'Exhibition Success Guide'
        },
        'trends-2026': {
            subject: '2026 Exhibition Trends Report',
            link: 'https://fann.ae/downloads/FANN_Trends_Report_2026.pdf', // Placeholder
            title: '2026 Trends Report'
        },
        'cost-calculator': {
            subject: 'Your Exhibition Cost Estimate',
            title: 'Cost Estimate'
        }
    };

    const resource = magnetResources[magnetId] || { subject: 'Thank you for contacting FANN', title: 'Resource' };

    if (SMTP_HOST) {
        try {
            const transporter = nodemailer.createTransport({
                host: SMTP_HOST,
                port: parseInt(SMTP_PORT || '587'),
                secure: SMTP_SECURE === 'true',
                auth: { user: SMTP_USER, pass: SMTP_PASS },
            });

            // 1. Send User Email
            await transporter.sendMail({
                from: `FANN Resources <${SMTP_USER}>`,
                to: email,
                subject: resource.subject,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2>Hi ${firstName || 'there'},</h2>
                        <p>Thank you for requesting the <strong>${resource.title}</strong>.</p>
                        ${resource.link ? `<p>You can download it here: <a href="${resource.link}" style="color: #C9A962; font-weight: bold;">Download PDF</a></p>` : ''}
                        ${details ? `<p>Your estimated cost range: <strong>AED ${new Intl.NumberFormat().format(details.size * 1500)} - ${new Intl.NumberFormat().format(details.size * 2200)}</strong></p>` : ''}
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p>Ready to start your project? <a href="https://fann.ae/book-consultation">Book a free consultation</a>.</p>
                    </div>
                `
            });

            // 2. Send Admin Notification
            await transporter.sendMail({
                from: `FANN Lead Gen <${SMTP_USER}>`,
                to: 'sales@fann.ae',
                subject: `New Lead: ${magnetId}`,
                html: `
                    <p><strong>Lead Magnet:</strong> ${magnetId}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Name:</strong> ${firstName || 'N/A'}</p>
                    ${details ? `<pre>${JSON.stringify(details, null, 2)}</pre>` : ''}
                `
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Email error', error);
            // Allow client success even if email fails (don't block user flow)
            return res.status(200).json({ success: true, warning: 'Email failed' });
        }
    }

    // Mock success if no SMTP
    return res.status(200).json({ success: true, mock: true });
}