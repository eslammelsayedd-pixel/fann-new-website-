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

    const subject = `New ${studioType} Studio Lead: ${formData.eventName || formData.spaceSubType || formData.theme || 'N/A'}`;
    const toEmail = 'sales@fann.ae';
    const fromEmail = 'FANN AI Studio <bot@fann.ae>'; // NOTE: fann.ae must be a verified domain on Resend.

    const generateHtml = () => {
        let detailsHtml = '';
        for (const [key, value] of Object.entries(formData)) {
            // Exclude file objects and other complex objects from the summary table
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
                <table style="width: 100%; border-collapse: collapse; color: #f5f5dc; font-size: 14px;">
                    <tbody>
                        ${detailsHtml}
                    </tbody>
                </table>
                <h2 style="color: #D4AF76; margin-top: 20px;">Selected Concept</h2>
                <h3 style="color: #f5f5dc;">${selectedConcept.title}</h3>
                <p style="font-style: italic;">${selectedConcept.description || ''}</p>
                <img src="${selectedConcept.images?.front || selectedConcept.images?.perspective || selectedConcept.image}" alt="Selected Concept" style="max-width: 100%; border-radius: 8px; border: 2px solid #D4AF76; margin-top: 10px;" />
            </div>
        `;
    };
    
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: subject,
      reply_to: formData.userEmail || formData.email,
      html: generateHtml(),
    });

    return res.status(200).json({ message: 'Proposal request sent successfully.' });

  } catch (error: any) {
    console.error('Error in send-proposal API:', error);
    return res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}
