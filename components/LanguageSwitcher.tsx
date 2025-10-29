import React, { useState, useEffect, useRef } from 'react';
import { supportedLanguages } from '../constants';
import { Globe, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const LanguageSwitcher: React.FC = () => {
    const [currentLanguageCode, setCurrentLanguageCode] = useState('en');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            const cookie = getCookie('googtrans');
            if (cookie) {
                const langCode = cookie.split('/')[2];
                if (langCode && langCode !== currentLanguageCode) {
                    setCurrentLanguageCode(langCode);
                }
            } else if (currentLanguageCode !== 'en') {
                 setCurrentLanguageCode('en');
            }
        }, 500);

        return () => clearInterval(intervalId);
    }, [currentLanguageCode]);


    const changeLanguage = (langCode: string) => {
        document.cookie = `googtrans=/en/${langCode}; path=/`;
        setCurrentLanguageCode(langCode);
        setIsDropdownOpen(false);
        window.location.reload();
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-fann-teal dark:text-fann-peach hover:text-fann-gold transition-colors duration-300 w-full justify-center lg:w-auto"
                 aria-haspopup="true"
                 aria-expanded={isDropdownOpen}
            >
                <Globe size={16} />
                <span className="font-bold">{currentLanguageCode.split('-')[0].toUpperCase()}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-fann-charcoal-light/95 backdrop-blur-sm rounded-md shadow-lg z-50 overflow-hidden"
                    >
                        <ul className="max-h-60 overflow-y-auto">
                            {supportedLanguages.map(lang => (
                                <li key={lang.code}>
                                    <button
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`w-full text-left px-4 py-2 text-sm text-white hover:bg-fann-gold/20 transition-colors ${currentLanguageCode === lang.code ? 'bg-fann-gold/30' : ''}`}
                                    >
                                        {lang.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;