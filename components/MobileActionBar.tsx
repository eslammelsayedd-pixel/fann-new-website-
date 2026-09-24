import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, FileText } from 'lucide-react';

const track = (label: string) => {
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: 'cta_click', cta_label: label, cta_location: 'mobile_action_bar' });
};

// Sticky call + quote bar on phones. WhatsApp stays as the floating button above it.
const MobileActionBar: React.FC = () => (
  <div className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 bg-fann-charcoal/95 backdrop-blur border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
    <a href="tel:+971505667502" onClick={() => track('call')} className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-white">
      <Phone size={18} className="text-fann-gold" /> Call us
    </a>
    <Link to="/book-consultation" onClick={() => track('get_quote')} className="flex items-center justify-center gap-2 py-4 text-sm font-bold uppercase tracking-wider bg-fann-gold text-black">
      <FileText size={18} /> Get a quote
    </Link>
  </div>
);

export default MobileActionBar;
