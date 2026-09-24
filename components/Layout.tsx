import React from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import ExitIntentPopup from './ExitIntentPopup';
import MetaPixelTracker from './MetaPixelTracker';
import MobileActionBar from './MobileActionBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-fann-charcoal text-fann-grey">
      <Header />
      <MetaPixelTracker />
      <main className="flex-grow">{children}</main>
      <div className="pb-16 md:pb-0"><Footer /></div>
      
      {/* Conversion Tools */}
      <WhatsAppButton />
      <ExitIntentPopup />
      <MobileActionBar />
    </div>
  );
};

export default Layout;
