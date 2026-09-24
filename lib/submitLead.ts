// Single client-side entry point for every website form.
// Posts to /api/lead and only resolves when the server confirms delivery.
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
  try {
    const w = window as any;
    if (typeof w.gtag === 'function') w.gtag('event', 'generate_lead', { form_type: payload.formType });
    if (typeof w.fbq === 'function') w.fbq('track', 'Lead', { content_name: payload.formType });
    (w.dataLayer = w.dataLayer || []).push({ event: 'lead_submitted', form_type: payload.formType });
  } catch { /* tracking must never break the form */ }
}
