// Single client-side entry point for every website form.
// Sends via Web3Forms from the browser when VITE_WEB3FORMS_ACCESS_KEY is set, otherwise via /api/lead (SMTP).
// Only resolves when delivery is confirmed.
export interface LeadPayload {
  formType: string;           // e.g. "Contact", "Consultation", "Exhibition Studio"
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  details?: Record<string, unknown>;
  website?: string;           // honeypot - must stay empty
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const body = {
    ...payload,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
  };
  if (payload.website) return; // honeypot: silently drop bots
  const web3Key = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
  if (web3Key) {
    // Web3Forms must be called from the browser (server-side calls are blocked on the free plan).
    // The access key is designed to be public; submissions go to the inbox it was created with (sales@fann.ae).
    const name = payload.name || '';
    const details = Object.entries(payload.details || {})
      .filter(([, v]) => v !== '' && v !== null && v !== undefined)
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`);
    const text = [
      `New ${payload.formType} from fann.ae`, '',
      `Name: ${name || '-'}`, `Email: ${payload.email || '-'}`, `Phone: ${payload.phone || '-'}`, `Company: ${payload.company || '-'}`, '',
      payload.message ? `Message:\n${payload.message}\n` : '',
      details.length ? `Details:\n${details.join('\n')}\n` : '',
      `Page: ${body.page || '-'}`, `Referrer: ${body.referrer || '-'}`,
    ].join('\n');
    if (!payload.email && !payload.phone) throw new Error('Please add an email or phone number so we can reach you.');
    let r: Response;
    try {
      r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3Key,
          subject: `[fann.ae] ${payload.formType}${name ? ' - ' + name : ''}${payload.company ? ' (' + payload.company + ')' : ''}`,
          from_name: 'FANN Website',
          replyto: payload.email || undefined,
          message: text,
          botcheck: '',
        }),
      });
    } catch {
      throw new Error('Network error - please check your connection and try again, or WhatsApp us on +971 50 566 7502.');
    }
    let d: any = {};
    try { d = await r.json(); } catch { /* ignore */ }
    if (!r.ok || d.success === false) {
      throw new Error('Sorry, your message could not be sent right now. Please WhatsApp us on +971 50 566 7502 or email sales@fann.ae.');
    }
  } else {
    let response: Response;
    try {
      response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error('Network error - please check your connection and try again, or WhatsApp us on +971 50 566 7502.');
    }
    let data: any = {};
    try { data = await response.json(); } catch { /* ignore */ }
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Sorry, your message could not be sent. Please WhatsApp us on +971 50 566 7502 or email sales@fann.ae.');
    }
  }
  try {
    const w = window as any;
    if (typeof w.gtag === 'function') w.gtag('event', 'generate_lead', { form_type: payload.formType });
    if (typeof w.fbq === 'function') w.fbq('track', 'Lead', { content_name: payload.formType });
    (w.dataLayer = w.dataLayer || []).push({ event: 'lead_submitted', form_type: payload.formType });
  } catch { /* tracking must never break the form */ }
}
