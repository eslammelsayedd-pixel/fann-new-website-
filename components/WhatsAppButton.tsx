import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.475L0 24h.057zM6.481 5.564c.224-.447.363-.464.634-.471.271-.007.47.011.671.241.202.232.733.729.733 1.777s-.271 1.217-.472 1.448c-.201.23-1.004.982-1.205 1.148-.201.164-.402.181-.567.117-.166-.065-.701-.258-1.336-.831-.635-.572-1.058-1.28-1.189-1.511-.131-.23-.007-.363.063-.464.07-.101.166-.232.247-.333.082-.102.117-.165.182-.281.065-.116.031-.216 0-.332-.031-.117-.437-1.043-.593-1.425-.156-.383-.312-.332-.437-.332s-.271 0-.402.016c-.13.016-.312.1-.471.347s-.616.598-.616 1.448c0 .85.632 1.666.716 1.797.085.132 1.251 1.96 3.03 2.66.402.164.716.265.968.348.452.149.854.129 1.17.078.368-.057 1.157-.466 1.322-.919.166-.452.166-.85.117-.919-.049-.065-.181-.1-.382-.216z"/>
    </svg>
);

const WhatsAppButton: React.FC = () => {
    const phoneNumber = "971505667502";
    const message = "Hello FANN, I'm interested in your services and would like to discuss a project.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 bg-[#25D366] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Chat on WhatsApp"
        >
            <WhatsAppIcon className="w-8 h-8" />
        </motion.a>
    );
};

export default WhatsAppButton;