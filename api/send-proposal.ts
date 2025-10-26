import { Resend } from 'resend';

// This is a Vercel Serverless Function.
// It is used by Exhibition, Event, and Interior studios.
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
    const { studioType, formData, selectedConcept } = req.body;

    if (!studioType || !formData || !selectedConcept) {
      return res.status(400).json({ error: 'Missing required data in request.' });
    }
    
    const userEmail = formData.userEmail || formData.email;
    const userName = formData.userFirstName || formData.userName || formData.firstName || 'Valued Client';
    const salesEmail = 'sales@fann.ae';
    const fromEmail = 'FANN AI Studio <bot@fann.ae>';

    // --- Email 1: Internal Notification to Sales Team ---
    const generateSalesHtml = () => {
        let detailsHtml = '';
        for (const [key, value] of Object.entries(formData)) {
            if (key === 'logo' || key === 'logoPreview' || key === 'floorPlan' || key === 'moodboards' || typeof value === 'object' && value !== null && !Array.isArray(value)) continue;
            let formattedValue = Array.isArray(value) ? value.join(', ') : String(value);
            if (!formattedValue) continue;
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            detailsHtml += `<tr><td style="padding: 4px 8px; border: 1px solid #444; font-weight: bold; vertical-align: top;">${formattedKey}</td><td style="padding: 4px 8px; border: 1px solid #444;">${formattedValue}</td></tr>`;
        }

        return `
            <div style="font-family: Arial, sans-serif; color: #f5f5dc; background-color: #1a1a1a; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; border: 1px solid #D4AF76;">
                <h1 style="color: #D4AF76; font-family: 'Playfair Display', serif;">New Lead from FANN ${studioType} Studio</h1>
                <p>A new potential client has generated a design concept and submitted their details.</p>
                <h2 style="color: #D4AF76;">Client & Project Brief</h2>
                <table style="width: 100%; border-collapse: collapse; color: #f5f5dc; font-size: 14px;"><tbody>${detailsHtml}</tbody></table>
                <h2 style="color: #D4AF76; margin-top: 20px;">Selected Concept</h2>
                <h3 style="color: #f5f5dc;">${selectedConcept.title}</h3>
                <p style="font-style: italic;">${selectedConcept.description || ''}</p>
                <img src="${selectedConcept.images?.front || selectedConcept.images?.perspective || selectedConcept.image}" alt="Selected Concept" style="max-width: 100%; border-radius: 8px; border: 2px solid #D4AF76; margin-top: 10px;" />
            </div>
        `;
    };

    // --- Email 2: Confirmation to User ---
    const generateUserHtml = () => `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #ffffff; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                 <h1 style="font-family: 'Playfair Display', serif; color: #D4AF76; font-size: 36px; margin: 0;">FANN</h1>
            </div>
            <div style="padding: 20px 0;">
                <h2 style="font-family: 'Playfair Display', serif; color: #1a1a1a; font-size: 24px;">Thank you for your request, ${userName}!</h2>
                <p>Our team has received your details from the FANN Studio and will contact you within <strong>1 business day</strong> to discuss and finalize your design.</p>
                 <p>If you need urgent assistance, please reply directly to this email or call us at +971 50 566 7502.</p>
                <div style="text-align: center; margin: 20px 0; background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
                    <h3 style="color: #1a1a1a; margin-top:0;">Your Selected Concept:</h3>
                    <p style="font-weight: bold; font-size: 18px; margin-bottom: 15px;">${selectedConcept.title}</p>
                    <img src="${selectedConcept.images?.front || selectedConcept.images?.perspective || selectedConcept.image}" alt="Your Selected Concept" style="max-width: 100%; border-radius: 8px; border: 1px solid #ccc;" />
                </div>
                <p style="margin-top: 30px;">We look forward to creating something extraordinary with you.</p>
                <p>Best regards,<br><strong>The FANN Team</strong></p>
            </div>
            <div style="text-align: center; font-size: 12px; color: #999; padding-top: 20px; border-top: 1px solid #eee;">
                <p>FANN | Office 508, Dusseldorf Business Point, Al Barsha 1, Dubai, UAE</p>
            </div>
        </div>
    `;

    // Send both emails concurrently
    await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: salesEmail,
        subject: `New ${studioType} Studio Lead: ${formData.eventName || formData.spaceSubType || formData.theme || 'N/A'}`,
        reply_to: userEmail,
        html: generateSalesHtml(),
      }),
      resend.emails.send({
        from: fromEmail,
        to: userEmail,
        subject: `Thank you for your request | FANN Studio`,
        html: generateUserHtml(),
      })
    ]);

    return res.status(200).json({ message: 'Proposal request sent successfully.' });

  } catch (error: any) {
    console.error('Error in send-proposal API:', error);
    // Provide a more specific error if it's from Resend
    if (error.name === 'ResendError') {
        return res.status(500).json({ error: `Email service failed: ${error.message}` });
    }
    return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}