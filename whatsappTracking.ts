
declare global {
  interface Window {
    dataLayer: any[];
  }
}

interface WhatsAppEventParams {
  pageType: string;
  messageVariant: string;
  label: string;
  scrollDepth?: number;
  timeOnPage?: number;
}

export const pushWhatsAppEvent = ({
  pageType,
  messageVariant,
  label,
  scrollDepth = 0,
  timeOnPage = 0
}: WhatsAppEventParams) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'whatsapp_click',
      event_category: 'engagement',
      event_action: 'whatsapp_button_click',
      event_label: label, // e.g. current pathname
      page_type: pageType,
      message_variant: messageVariant,
      user_scroll_depth: Math.round(scrollDepth),
      time_on_page: Math.round(timeOnPage),
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop'
    });
  }
};
