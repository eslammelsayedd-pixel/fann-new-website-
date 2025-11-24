
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MESSAGES, WHATSAPP_PHONE } from '../whatsappConfig';
import { pushWhatsAppEvent } from '../whatsappTracking';

const ExitIntentPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check storage
    const dismissed = localStorage.getItem('exit_popup_shown');
    if (dismissed) {
      setHasShown(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    const handleExitIntent = (e: MouseEvent) => {
      // Desktop: Mouse leaves top of viewport
      if (e.clientY < 10 && !hasShown) {
        triggerPopup();
      }
    };

    const handleScroll = () => {
      // Mobile/General: Scroll depth > 50%
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50 && !hasShown) {
        triggerPopup();
      }
    };

    // Timer trigger: 30s
    timer = setTimeout(() => {
      if (!hasShown) triggerPopup();
    }, 30000);

    window.addEventListener('mouseleave', handleExitIntent);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mouseleave', handleExitIntent);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [hasShown]);

  const triggerPopup = () => {
    if (hasShown) return;
    setIsVisible(true);
    setHasShown(true);
    localStorage.setItem('exit_popup_shown', 'true');
    
    // Auto dismiss after 30s if no interaction
    setTimeout(() => {
      setIsVisible(false);
    }, 30000);
  };

  const closePopup = () => {
    setIsVisible(false);
  };

  const handleWhatsAppClick = () => {
    pushWhatsAppEvent({
      label: 'exit_intent_popup',
      pageType: 'popup',
      messageVariant: 'e'
    });
    closePopup();
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(MESSAGES.exit_intent)}&utm_source=exit_intent&utm_medium=chat&utm_campaign=whatsapp_exit&discount=5percent`;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-fann-charcoal border border-fann-gold rounded-lg shadow-2xl w-full max-w-md p-8 text-center"
          >
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-fann-gold/20 text-2xl">
              🎁
            </div>

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
              Wait! Don't Miss Out
            </h2>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              Get <span className="text-fann-gold font-bold">5% off</span> your exhibition stand + <span className="text-fann-gold font-bold">FREE 3D design</span> when you chat with us now!
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="block w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-4 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.12c-1.48 0-2.91-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.28-1.26-2.79-1.26-4.38 0-4.54 3.7-8.23 8.24-8.23 2.22 0 4.29.86 5.82 2.39S20.27 9.82 20.27 12s-3.7 8.12-8.23 8.12zm4.24-6.01c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.52.12-.15.23-.59.75-.73.9-.13.15-.27.17-.5.05-.23-.12-1-.36-1.89-1.17-.7-.64-1.17-1.44-1.31-1.68-.13-.23 0-.36.11-.47.11-.11.23-.27.35-.41.12-.13.16-.23.25-.38.08-.15.04-.28-.02-.4-.06-.12-.52-1.25-.71-1.71-.19-.46-.39-.4-.52-.41-.13 0-.28-.02-.43-.02-.15 0-.4.06-.61.3-.21.24-.81.79-.81 1.94s.83 2.25.94 2.4c.12.15 1.64 2.5 4 3.48.58.24 1.03.38 1.38.48.5.15.94.13 1.3.08.4-.06 1.36-.56 1.55-1.1.19-.54.19-1 .13-1.1-.06-.11-.22-.18-.46-.3z"/>
              </svg>
              Claim My Discount →
            </a>
            
            <p className="mt-4 text-xs text-gray-500">
              Limited time offer. Valid for new inquiries only.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
