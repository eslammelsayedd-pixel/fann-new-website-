import { Resend } from 'resend';

// This is a Vercel Serverless Function.
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error('RESEND_API_KEY is not set in environment variables.');
        return res.status(500).json({ error: 'Server configuration error: Email service is not set up.' });
    }

    const resend = new Resend(resendApiKey);

    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const subject = `New Contact Form Submission from ${name}`;
        const toEmail = 'sales@fann.ae';
        const fromEmail = 'FANN Contact Form <bot@fann.ae>'; // NOTE: fann.ae must be a verified domain on Resend.

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

        await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: subject,
            reply_to: email,
            html: html,
        });

        return res.status(200).json({ message: 'Message sent successfully.' });

    } catch (error: any) {
        console.error('Error in send-contact-form API:', error);
        return res.status(500).json({ error: 'Failed to send message.' });
    }
}
