
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { WHATSAPP_PHONE, getPageContext, UTM_CONFIG } from '../whatsappConfig';
import { pushWhatsAppEvent } from '../whatsappTracking';
import { useABTest } from '../ABTest';
import './WhatsAppButton.css';

const WhatsAppIconSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="wa-icon">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.12c-1.48 0-2.91-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.28-1.26-2.79-1.26-4.38 0-4.54 3.7-8.23 8.24-8.23 2.22 0 4.29.86 5.82 2.39S20.27 9.82 20.27 12s-3.7 8.12-8.23 8.12zm4.24-6.01c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.52.12-.15.23-.59.75-.73.9-.13.15-.27.17-.5.05-.23-.12-1-.36-1.89-1.17-.7-.64-1.17-1.44-1.31-1.68-.13-.23 0-.36.11-.47.11-.11.23-.27.35-.41.12-.13.16-.23.25-.38.08-.15.04-.28-.02-.4-.06-.12-.52-1.25-.71-1.71-.19-.46-.39-.4-.52-.41-.13 0-.28-.02-.43-.02-.15 0-.4.06-.61.3-.21.24-.81.79-.81 1.94s.83 2.25.94 2.4c.12.15 1.64 2.5 4 3.48.58.24 1.03.38 1.38.48.5.15.94.13 1.3.08.4-.06 1.36-.56 1.55-1.1.19-.54.19-1 .13-1.1-.06-.11-.22-.18-.46-.3z"/>
  </svg>
);

const WhatsAppButton: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  
  // A/B Test: 'A' = Icon Only, 'B' = Icon + Text
  const variant = useABTest('wa_button_v1');

  useEffect(() => {
    setStartTime(Date.now());
    // Slight delay for entrance animation
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const timeOnPage = (Date.now() - startTime) / 1000;
    const scrollDepth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const { type, source } = getPageContext(location.pathname);

    pushWhatsAppEvent({
      label: location.pathname,
      pageType: type,
      messageVariant: source === 'homepage' ? 'a' : source === 'portfolio' ? 'b' : source === 'services' ? 'c' : 'd',
      scrollDepth,
      timeOnPage
    });
  };

  const getWhatsAppUrl = () => {
    const { message, source } = getPageContext(location.pathname);
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
    
    const params = new URLSearchParams();
    params.append('text', message);
    // UTM Params appended to the text usually for WA, but here we are constructing a direct WA Me link
    // Standard UTMs aren't processed by WhatsApp app, but we can track them if we used a redirector.
    // Per requirements: URL FORMAT: https://wa.me/...?text=...&utm_source=...
    // Note: WhatsApp API ignores extra params like utm_source, but we will add them as requested for compliance.
    
    let url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    url += `&utm_source=${source}`;
    url += `&utm_medium=${UTM_CONFIG.medium}`;
    url += `&utm_campaign=${UTM_CONFIG.campaign_prefix}${source}_${month}`;
    
    return url;
  };

  if (!isVisible) return null;

  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`wa-floating-button wa-slide-in wa-anim-pulse ${variant === 'A' ? 'wa-variant-a' : 'wa-variant-b'}`}
      aria-label="Chat with FANN on WhatsApp"
      role="button"
    >
      <WhatsAppIconSVG />
      {variant === 'B' && (
        <span className="wa-text">Chat Now</span>
      )}
    </a>
  );
};

export default WhatsAppButton;
