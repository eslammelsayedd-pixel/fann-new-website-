import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { navLinks } from '../constants';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Button animation variants
    const buttonTransition = { type: 'spring', stiffness: 400, damping: 17 } as const;

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled || isOpen 
                ? 'bg-[#1a1a1a]/95 backdrop-blur-md shadow-xl py-3' 
                : 'bg-gradient-to-b from-black/60 to-transparent py-6'
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* LOGO: Original Image Logo */}
                    <Link to="/" className="group relative z-50">
                        <img 
                            src="/favicon.svg" 
                            alt="FANN" 
                            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" 
                        />
                    </Link>

                    {/* DESKTOP NAVIGATION */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            link.children ? (
                                <div key={link.name} className="relative group h-full">
                                    <button className="flex items-center space-x-1 text-sm font-bold uppercase tracking-wider text-white hover:text-fann-gold transition-colors duration-300 py-2">
                                        <span>{link.name}</span>
                                        <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                    </button>
                                    
                                    {/* Dropdown */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl overflow-hidden py-2">
                                            {link.children.map(child => (
                                                <NavLink
                                                    key={child.name}
                                                    to={child.path}
                                                    className={({ isActive }) => `block px-6 py-3 text-sm font-medium transition-all duration-200 ${
                                                        isActive 
                                                        ? 'text-fann-charcoal bg-fann-gold' 
                                                        : 'text-gray-200 hover:text-fann-gold hover:bg-white/5'
                                                    }`}
                                                >
                                                    {child.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <NavLink
                                    key={link.name}
                                    to={link.path!}
                                    className={({ isActive }) => `text-sm font-bold uppercase tracking-wider transition-all duration-300 relative group py-2 ${
                                        isActive ? 'text-fann-gold' : 'text-white hover:text-fann-gold'
                                    }`}
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fann-gold transition-all duration-300 group-hover:w-full"></span>
                                </NavLink>
                            )
                        ))}
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="hidden lg:flex items-center space-x-5">
                        <div id="google_translate_element" className="opacity-80 hover:opacity-100 transition-opacity"></div>
                        <ThemeToggle />
                        <Link to="/contact">
                          <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={buttonTransition}
                              className="bg-fann-gold text-fann-charcoal border border-fann-gold font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-widest shadow-lg shadow-fann-gold/20 hover:shadow-fann-gold/40 hover:bg-white transition-all duration-300"
                          >
                              Start Designing
                          </motion.button>
                        </Link>
                    </div>

                    {/* MOBILE TOGGLE */}
                    <div className="lg:hidden flex items-center gap-4 z-50">
                        <ThemeToggle />
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="text-fann-gold p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* MOBILE MENU OVERLAY */}
            <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: '100vh' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="lg:hidden fixed inset-0 bg-[#1a1a1a]/98 backdrop-blur-xl z-40 overflow-y-auto pt-24"
                >
                    <nav className="flex flex-col items-center space-y-6 px-6 pb-12">
                        {navLinks.map((link) => (
                             <div key={link.name} className="text-center w-full">
                                {link.children ? (
                                    <div className="flex flex-col items-center">
                                        <button 
                                            onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                                            className={`flex items-center justify-center w-full text-xl font-bold uppercase tracking-widest mb-4 transition-colors ${openDropdown === link.name ? 'text-fann-gold' : 'text-white'}`}
                                        >
                                            {link.name}
                                            <ChevronDown size={20} className={`ml-2 transition-transform duration-300 ${openDropdown === link.name ? 'rotate-180 text-fann-gold' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openDropdown === link.name && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden flex flex-col items-center space-y-4 w-full bg-black/20 rounded-xl py-4 border border-fann-gold/10"
                                                >
                                                    {link.children.map(child => (
                                                        <NavLink
                                                            key={child.name}
                                                            to={child.path}
                                                            onClick={() => setIsOpen(false)}
                                                            className={({ isActive }) => `${isActive ? 'text-fann-gold' : 'text-gray-300'} text-sm font-medium uppercase tracking-wider hover:text-white transition-colors`}
                                                        >
                                                            {child.name}
                                                        </NavLink>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <NavLink
                                        to={link.path!}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) => `${isActive ? 'text-fann-gold scale-105' : 'text-white'} block text-xl font-bold uppercase tracking-widest hover:text-fann-gold transition-all`}
                                    >
                                        {link.name}
                                    </NavLink>
                                )}
                            </div>
                        ))}
                        
                        <div className="w-24 h-px bg-fann-gold/30 my-6"></div>

                        <div className="flex flex-col items-center gap-6 w-full">
                            <div id="google_translate_element_mobile"></div>
                            <Link to="/contact" className="w-full max-w-xs">
                              <motion.button 
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-fann-gold text-fann-charcoal font-bold py-4 px-8 rounded-full text-lg uppercase tracking-wider shadow-lg hover:bg-white transition-colors"
                              >
                                  Start Designing
                              </motion.button>
                            </Link>
                        </div>
                    </nav>
                </motion.div>
            )}
            </AnimatePresence>
        </header>
    );
};

export default Header;