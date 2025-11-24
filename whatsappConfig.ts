
export const WHATSAPP_PHONE = '971505667502';

export const MESSAGES = {
  homepage: "Hi FANN! I need an exhibition stand for GITEX 2025. Can you send me a quote?",
  portfolio: "Hi FANN! I saw your Microsoft Azure stand in the portfolio. Can you quote me for a similar 50sqm stand at Arab Health 2026?",
  services: "Hi FANN! I have questions about modular vs custom exhibition stands. Which is better for my budget?",
  contact: "Hi FANN! I'd like to schedule a visit to your production facility this week. When are you available?",
  exit_intent: "Hi FANN! I saw the 5% discount offer. I'm ready to discuss my exhibition stand project now!",
  default: "Hi FANN! I'm interested in your exhibition stand services in Dubai."
};

export const UTM_CONFIG = {
  medium: 'chat',
  campaign_prefix: 'whatsapp_',
};

export const getPageContext = (pathname: string) => {
  if (pathname === '/' || pathname === '') {
    return { type: 'homepage', message: MESSAGES.homepage, source: 'homepage' };
  }
  if (pathname.includes('portfolio')) {
    return { type: 'portfolio', message: MESSAGES.portfolio, source: 'portfolio' };
  }
  if (pathname.includes('services')) {
    return { type: 'services', message: MESSAGES.services, source: 'services' };
  }
  if (pathname.includes('contact')) {
    return { type: 'contact', message: MESSAGES.contact, source: 'contact' };
  }
  return { type: 'general', message: MESSAGES.default, source: 'general' };
};
