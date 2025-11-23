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
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const activeLinkClass = "text-fann-gold";
    const inactiveLinkClass = "text-fann-peach hover:text-fann-gold transition-colors duration-300";
    const lightInactiveLinkClass = "text-fann-teal hover:text-fann-gold";
    
    // FIX: Add 'as const' to the transition object to ensure TypeScript infers a literal type for 'type'.
    const buttonTransition = { type: 'spring', stiffness: 400, damping: 17 } as const;

    return (
        <header 
            className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || isOpen 
                ? 'fixed bg-white/95 dark:bg-fann-teal/95 backdrop-blur-md shadow-xl py-2' 
                : 'absolute bg-transparent py-4'
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="group">
                        <div className="font-serif text-4xl font-extrabold tracking-widest text-fann-gold transition-transform duration-300 group-hover:scale-105">
                            FANN
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            link.children ? (
                                <div key={link.name} className="relative group">
                                    <button className={`flex items-center space-x-1 text-sm font-semibold uppercase tracking-wider transition-colors duration-300 ${lightInactiveLinkClass} dark:text-fann-peach dark:hover:text-fann-gold`}>
                                        <span>{link.name}</span>
                                        <ChevronDown size={16} />
                                    </button>
                                    <div 
                                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-56 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto transform scale-95 group-hover:scale-100 origin-top"
                                    >
                                        <div className="bg-white dark:bg-fann-teal-dark rounded-lg shadow-xl border border-fann-teal/10 dark:border-fann-gold/20 overflow-hidden py-2">
                                            {link.children.map(child => (
                                                <NavLink
                                                    key={child.name}
                                                    to={child.path}
                                                    className={({ isActive }) => `block w-full text-left px-6 py-3 text-sm font-medium transition-colors ${isActive ? 'text-fann-gold bg-fann-teal/5 dark:bg-fann-gold/10' : 'text-fann-teal dark:text-fann-peach hover:bg-fann-peach/20 dark:hover:bg-fann-gold/10 hover:text-fann-gold'}`}
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
                                    className={({ isActive }) => `${isActive ? `text-fann-gold` : `${lightInactiveLinkClass} dark:text-fann-peach dark:hover:text-fann-gold`} text-sm font-semibold uppercase tracking-wider transition-colors duration-300`}
                                >
                                    {link.name}
                                </NavLink>
                            )
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center space-x-4">
                        <div id="google_translate_element"></div>
                        <ThemeToggle />
                        <Link to="/contact">
                          <motion.button 
                              whileHover={{ scale: 1.05, y: -1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={buttonTransition}
                              className="bg-transparent border-2 border-fann-teal dark:border-fann-gold text-fann-teal dark:text-fann-gold font-bold py-2.5 px-6 rounded-full text-sm uppercase tracking-wider transition-all duration-300 hover:bg-fann-teal hover:text-white dark:hover:bg-fann-gold dark:hover:text-fann-charcoal"
                          >
                              Get a Quote
                          </motion.button>
                        </Link>
                    </div>

                    <div className="lg:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button onClick={() => setIsOpen(!isOpen)} className="text-fann-teal dark:text-fann-gold p-2">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Menu */}
            <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: '100vh' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden bg-white/98 dark:bg-fann-teal/98 backdrop-blur-xl absolute top-full left-0 right-0 border-t border-fann-teal/10 dark:border-fann-gold/20 overflow-y-auto"
                >
                    <nav className="flex flex-col items-center space-y-6 py-12 px-6 min-h-[calc(100vh-80px)]">
                        {navLinks.map((link) => (
                             <div key={link.name} className="text-center w-full">
                                {link.children ? (
                                    <>
                                        <button 
                                            onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                                            className={`flex items-center justify-center w-full text-xl font-bold uppercase tracking-wider mb-2 ${lightInactiveLinkClass} dark:text-fann-peach`}
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
                                                    className="overflow-hidden flex flex-col items-center space-y-4 bg-fann-peach/20 dark:bg-black/20 rounded-xl py-4"
                                                >
                                                    {link.children.map(child => (
                                                        <NavLink
                                                            key={child.name}
                                                            to={child.path}
                                                            onClick={() => setIsOpen(false)}
                                                            className={({ isActive }) => `${isActive ? `text-fann-gold` : `text-fann-teal dark:text-fann-light-gray`} text-base font-semibold uppercase tracking-wider hover:text-fann-gold transition-colors`}
                                                        >
                                                            {child.name}
                                                        </NavLink>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    <NavLink
                                        to={link.path!}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) => `${isActive ? `text-fann-gold` : `text-fann-teal dark:text-fann-peach`} text-xl font-bold uppercase tracking-wider hover:text-fann-gold transition-colors`}
                                    >
                                        {link.name}
                                    </NavLink>
                                )}
                            </div>
                        ))}
                        
                        <div className="w-full h-px bg-fann-teal/10 dark:bg-fann-gold/20 my-4"></div>

                        <div className="flex flex-col items-center gap-6 w-full">
                            <div id="google_translate_element_mobile"></div>
                            <Link to="/portfolio" className="w-full">
                              <motion.button 
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-fann-gold text-fann-charcoal font-bold py-4 px-8 rounded-full text-lg uppercase tracking-wider shadow-lg hover:shadow-fann-gold/30"
                              >
                                  Explore Our Work
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