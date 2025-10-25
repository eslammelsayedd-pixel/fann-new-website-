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
        // Function to detect clicks outside of the dropdown to close it
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        // Add event listener when the dropdown is open
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);
    
    useEffect(() => {
        // Periodically check for the Google Translate cookie to update the UI
        // This is necessary because the widget can take time to initialize and set the cookie
        const intervalId = setInterval(() => {
            const cookie = getCookie('googtrans');
            if (cookie) {
                const langCode = cookie.split('/')[2];
                if (langCode !== currentLanguageCode) {
                    setCurrentLanguageCode(langCode);
                }
            } else if (currentLanguageCode !== 'en') {
                // If cookie is removed (e.g., "Show Original" clicked), reset to English
                 setCurrentLanguageCode('en');
            }
        }, 500); // Check every 500ms

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [currentLanguageCode]);


    const changeLanguage = (langCode: string) => {
        const googleTranslateElement = document.getElementById('google_translate_element');
        if (googleTranslateElement) {
            const select = googleTranslateElement.querySelector('select.goog-te-combo');
            if (select instanceof HTMLSelectElement) {
                select.value = langCode;
                select.dispatchEvent(new Event('change'));
                
                // Manually update UI for immediate feedback
                setCurrentLanguageCode(langCode);
            }
        }
        setIsDropdownOpen(false);
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-sm font-medium hover:text-fann-gold transition-colors duration-300 w-full justify-center lg:w-auto"
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
                        className="absolute top-full right-0 mt-2 w-48 bg-fann-charcoal/95 backdrop-blur-sm rounded-md shadow-lg z-50 overflow-hidden"
                    >
                        <ul className="max-h-60 overflow-y-auto">
                            {supportedLanguages.map(lang => (
                                <li key={lang.code}>
                                    <button
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`w-full text-left px-4 py-2 text-sm text-white hover:bg-fann-teal/50 transition-colors ${currentLanguageCode === lang.code ? 'bg-fann-teal' : ''}`}
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