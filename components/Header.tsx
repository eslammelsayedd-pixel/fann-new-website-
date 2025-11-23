import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navLinks } from '../constants';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Consistent Dark Theme Styles
    const headerClasses = scrolled
        ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 py-4'
        : isHome
            ? 'bg-gradient-to-b from-black/80 to-transparent py-6'
            : 'bg-[#0A0A0A] border-b border-white/5 py-6';

    const textColorClass = 'text-white';
    const hoverColorClass = 'hover:text-fann-gold';
    const activeLinkClass = 'text-fann-gold';
    const dropdownBgClass = 'bg-[#151515] border border-white/10';
    const dropdownTextClass = 'text-gray-300 hover:text-white hover:bg-white/5';

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerClasses}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* LOGO */}
                    <Link to="/" className="group relative z-50 flex items-center gap-3">
                        <img 
                            src="/favicon.svg" 
                            alt="FANN Logo" 
                            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" 
                        />
                        <span className={`font-sans font-bold text-2xl tracking-widest transition-colors duration-300 text-white`}>
                            FANN
                        </span>
                    </Link>

                    {/* DESKTOP NAVIGATION */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            link.children ? (
                                <div key={link.name} className="relative group h-full">
                                    <button className={`flex items-center space-x-1 text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 py-2 ${textColorClass} ${hoverColorClass}`}>
                                        <span>{link.name}</span>
                                        <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                    </button>
                                    
                                    {/* Dropdown */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <div className={`rounded-none shadow-2xl overflow-hidden py-2 ${dropdownBgClass}`}>
                                            {link.children.map(child => (
                                                <NavLink
                                                    key={child.name}
                                                    to={child.path}
                                                    className={({ isActive }) => `block px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                                                        isActive 
                                                        ? 'text-fann-gold bg-white/5' 
                                                        : dropdownTextClass
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
                                    className={({ isActive }) => `text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 relative group py-2 ${
                                        isActive ? activeLinkClass : `${textColorClass} ${hoverColorClass}`
                                    }`}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {link.name}
                                            <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-fann-gold transition-all duration-300 ${isActive ? 'w-full' : 'group-hover:w-full'}`}></span>
                                        </>
                                    )}
                                </NavLink>
                            )
                        ))}
                    </nav>

                    {/* RIGHT ACTIONS */}
                    <div className="hidden lg:flex items-center space-x-5">
                        <div id="google_translate_element" className="opacity-80 hover:opacity-100 transition-opacity"></div>
                        <ThemeToggle />
                        <Link to="/contact">
                          <button 
                              className="bg-fann-gold text-black border border-fann-gold font-bold py-2.5 px-6 rounded-none text-xs uppercase tracking-[0.15em] hover:bg-transparent hover:text-fann-gold transition-all duration-300"
                          >
                              Start Designing
                          </button>
                        </Link>
                    </div>

                    {/* MOBILE TOGGLE */}
                    <div className="lg:hidden flex items-center gap-4 z-50">
                        <ThemeToggle />
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className={`p-2 transition-colors text-white hover:bg-white/10`}
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
                    className="lg:hidden fixed inset-0 bg-[#0F0F0F] z-40 overflow-y-auto pt-24"
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
                                                    className="overflow-hidden flex flex-col items-center space-y-4 w-full bg-white/5 py-4 border-t border-b border-white/10"
                                                >
                                                    {link.children.map(child => (
                                                        <NavLink
                                                            key={child.name}
                                                            to={child.path}
                                                            onClick={() => setIsOpen(false)}
                                                            className={({ isActive }) => `${isActive ? 'text-fann-gold' : 'text-gray-300'} text-sm font-bold uppercase tracking-wider hover:text-white transition-colors`}
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
                                        className={({ isActive }) => `${isActive ? 'text-fann-gold' : 'text-white'} block text-xl font-bold uppercase tracking-widest hover:text-fann-gold transition-all`}
                                    >
                                        {link.name}
                                    </NavLink>
                                )}
                            </div>
                        ))}
                        
                        <div className="w-24 h-px bg-white/10 my-6"></div>

                        <div className="flex flex-col items-center gap-6 w-full">
                            <div id="google_translate_element_mobile"></div>
                            <Link to="/contact" className="w-full max-w-xs">
                              <button 
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-fann-gold text-black font-bold py-4 px-8 rounded-none text-lg uppercase tracking-wider hover:bg-white transition-colors"
                              >
                                  Start Designing
                              </button>
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