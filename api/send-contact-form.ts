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
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT, 10),
            secure: SMTP_SECURE === 'true', // false for 587 (STARTTLS)
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });
        
        await transporter.verify();

        const subject = `New Contact Form Submission from ${name}`;
        const toEmail = 'sales@fann.ae';
        const fromEmail = `FANN Contact Form <${SMTP_USER}>`;

        const html = `
            <div style="font-family: Arial, sans-serif; color: #f5f5dc; background-color: #1a1a1a; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #D4AF76;">
                <h1 style="color: #D4AF76;">New Contact Form Message</h1>
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #5A8B8C;">${email}</a></p>
                <hr style="border-color: #444; margin: 20px 0;"/>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; background-color: #2c2c2c; padding: 15px; border-radius: 5px;">${message}</p>
            </div>
        `;

        await transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            subject: subject,
            replyTo: email,
            html: html,
        });

        return res.status(200).json({ message: 'Message sent successfully.' });

    } catch (error: any) {
        console.error('Error in send-contact-form API:', error);
        if (error.code === 'EAUTH' || error.message.includes('Authentication failed')) {
            return res.status(500).json({ error: 'SMTP Authentication failed. Please check your credentials.' });
        }
        return res.status(500).json({ error: 'Failed to send message.' });
    }
}