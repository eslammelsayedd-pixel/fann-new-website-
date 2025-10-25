import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 32 32" {...props}><path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.044-.53-.044-.302 0-.53.09-.66.36-.66 1.312-1.227 2.622-1.227 3.785 0 1.164.545 2.29 1.518 3.285.973.994 2.163 1.848 3.58 2.46.487.214.96.36 1.49.36.73 0 1.64-.187 1.84-.29.4-.187.995-.945.995-1.848 0-.802-.383-1.312-.516-1.447z" fill="#ffffff"></path><path d=" M16 .003C7.163.003 0 7.165 0 16c0 8.837 7.163 16 16 16s16-7.163 16-16c0-8.837-7.163-16-16-16zm0 29.75c-7.6 0-13.75-6.15-13.75-13.75S8.4 2.253 16 2.253 29.75 8.403 29.75 16 23.6 29.753 16 29.753z" fill="#ffffff"></path></svg>
);

const WhatsAppButton: React.FC = () => {
    const phoneNumber = "971505667502";
    const message = encodeURIComponent("Hello FANN, I'm interested in learning more about your services.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 w-16 h-16 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center z-50 text-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Chat on WhatsApp"
        >
            <WhatsAppIcon className="w-8 h-8"/>
        </motion.a>
    );
};

export default WhatsAppButton;
