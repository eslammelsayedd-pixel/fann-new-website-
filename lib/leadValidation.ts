import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js/min';

// Country-aware phone validation backed by real numbering-plan metadata
// (libphonenumber-js), defaulting to AE when no country code is typed.
// A number fails when it is impossible or invalid for its country, e.g. a
// UAE mobile missing digits: "+971 50 123" errors, "+971 50 123 4567" passes.
export interface PhoneCheck { valid: boolean; error: string | null; actualCountry?: string; international?: string; }
export function describeLeadPhone(raw: string, country?: string): PhoneCheck {
  const input = (raw || '').trim();
  if (!input) return { valid: false, error: 'Phone number is required.' };
  // 'OTHER' (or unknown) => no default region: the number must carry +<code>.
  const region = !country || country === 'OTHER' ? undefined : (country as any);
  const phone = parsePhoneNumberFromString(input, region);
  if (!phone || !phone.isPossible() || !phone.isValid()) {
    // Error must name the SELECTED country's code, not a misleading UAE example.
    let example = ' (type the full international number starting with +)';
    if (region) {
      try { example = `, e.g. +${getCountryCallingCode(region)} followed by the full national number`; } catch { /* keep generic */ }
    }
    return { valid: false, error: `Enter a complete phone number${example}.` };
  }
  return { valid: true, error: null, actualCountry: phone.country, international: phone.formatInternational() };
}
export function validateLeadPhone(raw: string, country?: string): string | null {
  return describeLeadPhone(raw, country).error;
}

// Work-email rule: free webmail domains are rejected for business enquiry
// forms (same rule FANN Studio already shipped).
export const PUBLIC_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'live.com', 'me.com', 'protonmail.com'];
export function isWorkEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].toLowerCase().trim();
  return !!domain && !PUBLIC_EMAIL_DOMAINS.includes(domain);
}
export const WORK_EMAIL_ERROR = 'Please use your work email for business enquiries.';
