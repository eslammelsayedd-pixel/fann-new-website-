
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.12c-1.48 0-2.91-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.28-1.26-2.79-1.26-4.38 0-4.54 3.7-8.23 8.24-8.23 2.22 0 4.29.86 5.82 2.39S20.27 9.82 20.27 12s-3.7 8.12-8.23 8.12zm4.24-6.01c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.52.12-.15.23-.59.75-.73.9-.13.15-.27.17-.5.05-.23-.12-1-.36-1.89-1.17-.7-.64-1.17-1.44-1.31-1.68-.13-.23 0-.36.11-.47.11-.11.23-.27.35-.41.12-.13.16-.23.25-.38.08-.15.04-.28-.02-.4-.06-.12-.52-1.25-.71-1.71-.19-.46-.39-.4-.52-.41-.13 0-.28-.02-.43-.02-.15 0-.4.06-.61.3-.21.24-.81.79-.81 1.94s.83 2.25.94 2.4c.12.15 1.64 2.5 4 3.48.58.24 1.03.38 1.38.48.5.15.94.13 1.3.08.4-.06 1.36-.56 1.55-1.1.19-.54.19-1 .13-1.1-.06-.11-.22-.18-.46-.3z"/>
    </svg>
);

const WhatsAppButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const phoneNumber = "971505667502";
    const message = "Hello FANN, I'm interested in your services and would like to discuss a project.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    useEffect(() => {
        // Defer loading of the button interaction until after main content paints
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 bg-[#25D366] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Chat on WhatsApp"
        >
            <WhatsAppIcon className="w-8 h-8" />
        </motion.a>
    );
};

export default WhatsAppButton;
