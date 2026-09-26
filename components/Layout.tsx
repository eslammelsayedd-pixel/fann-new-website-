import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import ExitIntentPopup from './ExitIntentPopup';
import MetaPixelTracker from './MetaPixelTracker';
import MobileActionBar from './MobileActionBar';
import { Chatbot } from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isAdsLanding = useLocation().pathname === '/exhibition-stand-quote';
  return (
    <div className="flex flex-col min-h-screen bg-fann-charcoal text-fann-grey">
      <Header />
      <MetaPixelTracker />
      <main className="flex-grow">{children}</main>
      {isAdsLanding ? <footer className="border-t border-white/10 bg-[#111] px-5 py-8 text-center text-sm text-[#aaa49b]">FANN · <a href="tel:+971505667502" className="underline">+971 50 566 7502</a> · <a href="mailto:sales@fann.ae" className="underline">sales@fann.ae</a></footer> : <div className="pb-16 md:pb-0"><Footer /></div>}
      
      {/* Conversion Tools */}
      {!isAdsLanding && <WhatsAppButton />}
      {!isAdsLanding && <Chatbot />}
      {!isAdsLanding && <ExitIntentPopup />}
      {!isAdsLanding && <MobileActionBar />}
    </div>
  );
};

export default Layout;
