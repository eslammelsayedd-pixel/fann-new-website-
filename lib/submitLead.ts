// Passive, session-scoped enquiry attribution. No analytics request or conversion is fired.
// Click references are evidence for reconciliation, not proof of a completed call or qualified lead.
const ATTRIBUTION_KEY = 'fann-enquiry-attribution-v1';
const ATTRIBUTION_FIELDS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
type EnquiryAttribution = { captured_at: string; landing_path: string; fields: Record<string, string> };
let visitAttribution: EnquiryAttribution | null = null;
export function captureLeadAttribution(): EnquiryAttribution | null {
  if (typeof window === 'undefined') return null;
  try {
    if (visitAttribution && Date.now() - Date.parse(visitAttribution.captured_at) >= 86400000) visitAttribution = null;
    const params = new URLSearchParams(window.location.search);
    const fields: Record<string, string> = {};
    for (const field of ATTRIBUTION_FIELDS) {
      const value = (params.get(field) || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 512);
      if (value) fields[field] = value;
    }
    if (Object.keys(fields).length) {
      visitAttribution = { captured_at: new Date().toISOString(), landing_path: window.location.pathname.slice(0, 300), fields };
      try { window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(visitAttribution)); } catch { /* this page still has its reference */ }
    } else if (!visitAttribution) {
      try {
        const saved = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) || 'null');
        const age = Date.now() - Date.parse(saved?.captured_at || '');
        if (saved && age >= 0 && age < 86400000 && typeof saved.landing_path === 'string' && saved.fields && typeof saved.fields === 'object') {
          const allowed: Record<string, string> = {};
          for (const field of ATTRIBUTION_FIELDS) if (typeof saved.fields[field] === 'string') allowed[field] = saved.fields[field].slice(0, 512);
          if (Object.keys(allowed).length) visitAttribution = { captured_at: saved.captured_at, landing_path: saved.landing_path.slice(0, 300), fields: allowed };
        }
      } catch { /* unavailable storage must never break delivery */ }
    }
  } catch { /* URL parsing must never break delivery */ }
  return visitAttribution;
}
// App imports this module on entry so an internal navigation cannot discard the landing reference.
captureLeadAttribution();


// First-party lead-source cookies: first touch (90 days) and last touch (30 days).
// Passive only: no network request, no analytics event. Stored values are the external referrer host,
// landing path, UTMs and click ids from the visitor's own URL. Last touch changes only on a tagged or external-referral visit.
const FIRST_TOUCH_COOKIE = 'fann_ft';
const LAST_TOUCH_COOKIE = 'fann_lt';
type Touch = { at: string; landing: string; referrer: string; f: Record<string, string> };
function readTouch(name: string): Touch | null {
  try {
    const m = document.cookie.split('; ').find(c => c.startsWith(name + '='));
    if (!m) return null;
    const t = JSON.parse(decodeURIComponent(m.slice(name.length + 1)));
    if (!t || typeof t.at !== 'string' || typeof t.landing !== 'string') return null;
    const f: Record<string, string> = {};
    for (const k of ATTRIBUTION_FIELDS) if (t.f && typeof t.f[k] === 'string') f[k] = t.f[k].slice(0, 200);
    return { at: t.at.slice(0, 30), landing: t.landing.slice(0, 200), referrer: String(t.referrer || '').slice(0, 120), f };
  } catch { return null; }
}
function writeTouch(name: string, t: Touch, days: number) {
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(t))}; Max-Age=${days * 86400}; Path=/; SameSite=Lax${secure}`;
  } catch { /* cookies unavailable: enquiry still sends */ }
}
export function captureLeadSource(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const f: Record<string, string> = {};
    for (const k of ATTRIBUTION_FIELDS) {
      const v = (params.get(k) || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 200);
      if (v) f[k] = v;
    }
    let ref = '';
    try {
      const u = new URL(document.referrer);
      if (u.hostname && u.hostname.replace(/^www\./, '') !== window.location.hostname.replace(/^www\./, '')) ref = u.hostname.slice(0, 120);
    } catch { /* no referrer */ }
    const touch: Touch = { at: new Date().toISOString(), landing: (window.location.pathname || '/').slice(0, 200), referrer: ref, f };
    if (!readTouch(FIRST_TOUCH_COOKIE)) writeTouch(FIRST_TOUCH_COOKIE, touch, 90);
    if (ref || Object.keys(f).length || !readTouch(LAST_TOUCH_COOKIE)) writeTouch(LAST_TOUCH_COOKIE, touch, 30);
  } catch { /* never break the page */ }
}
function describeTouch(t: Touch | null): string {
  if (!t) return 'unknown';
  const parts = [`referrer=${t.referrer || 'direct'}`, `landing=${t.landing}`, ...Object.entries(t.f).map(([k, v]) => `${k}=${v}`), `at=${t.at}`];
  return parts.join(' | ').slice(0, 800);
}
captureLeadSource();

// Single client-side entry point for every website form.
// Sends via Web3Forms from the browser when VITE_WEB3FORMS_ACCESS_KEY is set, otherwise via /api/lead (SMTP).
// Only resolves when delivery is confirmed.
export interface LeadPayload {
  formType: string;           // e.g. "Contact", "Consultation", "Exhibition Studio"
  name?: string;
  email?: string;
  phone?: string;
  phoneCountry?: string;    // ISO region selected in PhoneInput; drives per-country validation
  company?: string;
  message?: string;
  details?: Record<string, unknown>;
  website?: string;           // honeypot - must stay empty
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const attribution = captureLeadAttribution();
  captureLeadSource();
  const details = { ...(payload.details || {}), ...(attribution ? { enquiry_attribution: attribution } : {}), lead_source_first_touch: describeTouch(readTouch(FIRST_TOUCH_COOKIE)), lead_source_last_touch: describeTouch(readTouch(LAST_TOUCH_COOKIE)) };
  const body = {
    ...payload,
    details,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
  };
  if (payload.website) return; // honeypot: silently drop bots
  const web3Key = (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
  if (web3Key) {
    // Web3Forms must be called from the browser (server-side calls are blocked on the free plan).
    // The access key is designed to be public; submissions go to the inbox it was created with (sales@fann.ae).
    const name = payload.name || '';
    const detailLines = Object.entries(details)
      .filter(([, v]) => v !== '' && v !== null && v !== undefined)
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`);
    const text = [
      `New ${payload.formType} from fann.ae`, '',
      `Name: ${name || '-'}`, `Email: ${payload.email || '-'}`, `Phone: ${payload.phone || '-'}`, `Company: ${payload.company || '-'}`, '',
      payload.message ? `Message:\n${payload.message}\n` : '',
      detailLines.length ? `Details:\n${detailLines.join('\n')}\n` : '',
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
    if (!r.ok || d.success !== true) {
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
  // Provider delivery succeeded. Persist privately without sending another email.
  // A receipt failure must not turn a delivered enquiry into a form error.
  try {
    if (typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function') {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      let receipt: Response;
      try { receipt = await fetch('/api/lead-receipt', {
        signal: controller.signal, method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...body, deliveryConfirmed: true, requestToken: window.crypto.randomUUID() }),
      }); } finally { clearTimeout(timeout); }
      const data = await receipt.json();
      if (receipt.ok && data.persisted === true) (window as any).fannOpenAIConversion?.measurePersistedLead(data);
    }
  } catch { /* delivered enquiry stays successful; no conversion without committed receipt */ }

}


// Snapshot of every first-party source field, used to fill hidden form inputs.
// Values come only from the visitor's own URL, referrer and the first-party cookies above.
export function getLeadSourceSnapshot(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const out: Record<string, string> = {};
  try {
    const attribution = captureLeadAttribution();
    if (attribution) {
      for (const [k, v] of Object.entries(attribution.fields)) out[k] = v;
      out.landing_page = attribution.landing_path;
      out.attribution_captured_at = attribution.captured_at;
    }
    const first = readTouch(FIRST_TOUCH_COOKIE);
    const last = readTouch(LAST_TOUCH_COOKIE);
    if (first) out.first_touch = describeTouch(first);
    if (last) out.last_touch = describeTouch(last);
    let refHost = last?.referrer || first?.referrer || '';
    if (!refHost) {
      try {
        const u = new URL(document.referrer);
        if (u.hostname && u.hostname.replace(/^www\./, '') !== window.location.hostname.replace(/^www\./, '')) refHost = u.hostname;
      } catch { /* no referrer */ }
    }
    if (refHost) out.referrer = refHost.slice(0, 120);
    if (!out.landing_page) out.landing_page = (last?.landing || first?.landing || window.location.pathname || '/').slice(0, 300);
  } catch { /* attribution must never break the form */ }
  return out;
}
