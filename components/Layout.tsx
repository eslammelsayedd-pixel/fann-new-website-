import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import MetaPixelTracker from './MetaPixelTracker';
import MobileActionBar from './MobileActionBar';
import { Chatbot } from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isAdsLanding = useLocation().pathname === '/exhibition-stand-quote';
  useEffect(() => {
    const trackPhoneClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href^="tel:"]');
      if (!link) return;
      const gtag = (window as any).gtag;
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', { send_to: 'AW-17220461597/viDOCImN24odEJ3IrZNA' });
      }
    };
    document.addEventListener('click', trackPhoneClick);
    return () => document.removeEventListener('click', trackPhoneClick);
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-fann-charcoal text-fann-grey">
      <Header />
      <MetaPixelTracker />
      <main className="flex-grow">{children}</main>
      {isAdsLanding ? <footer className="border-t border-white/10 bg-[#111] px-5 py-8 text-center text-sm text-[#aaa49b]">FANN · <a href="tel:+971505667502" className="underline">+971 50 566 7502</a> · <a href="mailto:sales@fann.ae" className="underline">sales@fann.ae</a></footer> : <div className="pb-16 md:pb-0"><Footer /></div>}
      
      {/* Conversion Tools */}
      {!isAdsLanding && <WhatsAppButton />}
      {!isAdsLanding && <Chatbot />}
      {!isAdsLanding && <MobileActionBar />}
    </div>
  );
};

export default Layout;
