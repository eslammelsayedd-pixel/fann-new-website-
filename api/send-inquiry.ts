import nodemailer from 'nodemailer';

// This is a Vercel Serverless Function.
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        console.error('SMTP environment variables are not configured on the server.');
        return res.status(500).json({ error: 'Server configuration error: Email service is not set up.' });
    }

    try {
        const { type, companyName, firstName, lastName, email, phone, countryCode, websiteUrl, eventName, eventDate, eventLocation, standWidth, standLength, standHeight, boothType, features } = req.body;

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

        const subject = `New Lead: ${type} - ${companyName}`;
        const toEmail = 'sales@fann.ae';
        const fromEmail = `FANN Studio <${SMTP_USER}>`;

        const html = `
            <div style="font-family: Arial, sans-serif; color: #f5f5dc; background-color: #1a1a1a; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #D4AF76;">
                <h1 style="color: #D4AF76; font-size: 22px;">New FANN Studio Inquiry</h1>
                
                <div style="background-color: #2c2c2c; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                    <h3 style="color: #fff; border-bottom: 1px solid #444; padding-bottom: 5px; margin-top: 0;">Client Details</h3>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #5A8B8C;">${email}</a></p>
                    <p style="margin: 5px 0;"><strong>Phone:</strong> ${countryCode} ${phone}</p>
                    <p style="margin: 5px 0;"><strong>Website:</strong> ${websiteUrl}</p>
                </div>

                <div style="background-color: #2c2c2c; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                    <h3 style="color: #fff; border-bottom: 1px solid #444; padding-bottom: 5px; margin-top: 0;">Project Specs</h3>
                    <p style="margin: 5px 0;"><strong>Event:</strong> ${eventName}</p>
                    <p style="margin: 5px 0;"><strong>Venue:</strong> ${eventLocation} (${eventDate})</p>
                    <p style="margin: 5px 0;"><strong>Dimensions:</strong> ${standWidth}m x ${standLength}m</p>
                    <p style="margin: 5px 0;"><strong>Max Height:</strong> ${standHeight || 'N/A'}m</p>
                    <p style="margin: 5px 0;"><strong>Orientation:</strong> ${boothType}</p>
                </div>

                <div style="background-color: #2c2c2c; padding: 15px; border-radius: 5px;">
                    <h3 style="color: #fff; border-bottom: 1px solid #444; padding-bottom: 5px; margin-top: 0;">Requirements</h3>
                    <ul style="padding-left: 20px; margin: 5px 0;">
                        ${Array.isArray(features) && features.length > 0 
                            ? features.map(f => `<li>${f}</li>`).join('') 
                            : '<li>None specified</li>'}
                    </ul>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            subject: subject,
            replyTo: email,
            html: html,
        });

        return res.status(200).json({ message: 'Inquiry sent successfully.' });

    } catch (error: any) {
        console.error('Error in send-inquiry API:', error);
        return res.status(500).json({ error: 'Failed to send inquiry.' });
    }
}