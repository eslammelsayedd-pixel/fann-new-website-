import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { navLinks } from '../constants';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const FannLogo = () => (
    <svg width="74" height="42" viewBox="0 0 100 57" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="FANN Logo">
        {/* Icon */}
        <g>
            <path d="M0 0H51.4286V4.28571H0V0Z"/>
            <path d="M0 4.28571V34.2857H4.28571V4.28571H0Z"/>
            <path d="M0 17.1429H25.7143V21.4286H0V17.1429Z"/>
            <path d="M0 34.2857H47.1429V38.5714H0V34.2857Z"/>
            <path d="M47.1429 4.28571V38.5714H51.4286V4.28571H47.1429Z"/>
            <path d="M8.57143 21.4286H12.8571V34.2857H8.57143V21.4286Z"/>
            <path d="M15.4286 21.4286H19.7143V34.2857H15.4286V21.4286Z"/>
            <path d="M22.2857 21.4286H26.5714V34.2857H22.2857V21.4286Z"/>
            <path d="M51.4286 21.4286L64.2857 8.57143L77.1429 21.4286V38.5714H51.4286V21.4286ZM55.7143 23.3371V34.2857H72.8571V23.3371L64.2857 14.7657L55.7143 23.3371Z"/>
        </g>
        {/* Text "FANN" */}
        <g transform="translate(1, 44)">
            <path d="M0 13H3.5V8.5H10.5V13H14V0H0V13ZM3.5 4.5H10.5V0H3.5V4.5Z"/>
            <path d="M17 13H20.5L25.25 0H28.75L33.5 13H37L27.5 0H26.5L17 13ZM23.3 8.5H30.6L27 2.9L23.3 8.5Z"/>
            <path d="M40.25 13H43.75V4.5L50.75 13H54.25L47.25 4.5V0H40.25V13Z"/>
            <path d="M57 13H60.5V4.5L67.5 13H71L64 4.5V0H57V13Z"/>
        </g>
    </svg>
);


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

    return (
        <header className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'fixed bg-fann-peach/90 dark:bg-fann-charcoal/90 backdrop-blur-sm shadow-lg' : 'absolute bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="text-fann-teal dark:text-fann-peach">
                        <FannLogo />
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            link.children ? (
                                <div key={link.name} className="relative group">
                                    <button className={`flex items-center space-x-1 text-sm font-medium uppercase tracking-wider ${lightInactiveLinkClass} dark:${inactiveLinkClass}`}>
                                        <span>{link.name}</span>
                                        <ChevronDown size={16} />
                                    </button>
                                    <div 
                                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 bg-white/95 dark:bg-fann-charcoal-light/95 backdrop-blur-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto transform scale-95 group-hover:scale-100 origin-top"
                                    >
                                        <div className="py-1">
                                            {link.children.map(child => (
                                                <NavLink
                                                    key={child.name}
                                                    to={child.path}
                                                    className={({ isActive }) => `block w-full text-left px-4 py-2 text-sm text-fann-teal dark:text-fann-peach hover:bg-fann-accent-teal/50 dark:hover:bg-fann-gold/20 ${isActive ? `text-fann-gold dark:${activeLinkClass}` : ''}`}
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
                                    className={({ isActive }) => `${isActive ? `text-fann-gold dark:${activeLinkClass}` : `${lightInactiveLinkClass} dark:${inactiveLinkClass}`} text-sm font-medium uppercase tracking-wider`}
                                >
                                    {link.name}
                                </NavLink>
                            )
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center space-x-4">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <Link to="/fann-studio">
                          <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-fann-gold text-fann-charcoal font-bold py-2 px-6 rounded-full text-sm uppercase tracking-wider transition-transform duration-300"
                          >
                              Start Designing
                          </motion.button>
                        </Link>
                    </div>

                    <div className="lg:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button onClick={() => setIsOpen(!isOpen)} className="text-fann-teal dark:text-fann-peach">
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
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden bg-fann-peach/95 dark:bg-fann-charcoal/95 absolute top-20 left-0 right-0"
                >
                    <nav className="flex flex-col items-center space-y-6 py-8">
                        {navLinks.map((link) => (
                             <div key={link.name} className="text-center w-full px-8">
                                {link.children ? (
                                    <>
                                        <button 
                                            onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                                            className={`flex items-center justify-center w-full text-lg font-medium uppercase tracking-wider ${lightInactiveLinkClass} dark:${inactiveLinkClass}`}
                                        >
                                            {link.name}
                                            <ChevronDown size={20} className={`ml-2 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openDropdown === link.name && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    className="overflow-hidden flex flex-col items-center space-y-4"
                                                >
                                                    {link.children.map(child => (
                                                        <NavLink
                                                            key={child.name}
                                                            to={child.path}
                                                            onClick={() => setIsOpen(false)}
                                                            className={({ isActive }) => `${isActive ? `text-fann-gold dark:${activeLinkClass}` : `${lightInactiveLinkClass} dark:${inactiveLinkClass}`} text-base font-medium uppercase tracking-wider`}
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
                                        className={({ isActive }) => `${isActive ? `text-fann-gold dark:${activeLinkClass}` : `${lightInactiveLinkClass} dark:${inactiveLinkClass}`} text-lg font-medium uppercase tracking-wider`}
                                    >
                                        {link.name}
                                    </NavLink>
                                )}
                            </div>
                        ))}
                        <div className="my-6 w-full px-8 flex justify-center items-center gap-4">
                            <LanguageSwitcher />
                        </div>
                        <Link to="/fann-studio">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(false)}
                            className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider mt-4"
                          >
                              Start Designing
                          </motion.button>
                        </Link>
                    </nav>
                </motion.div>
            )}
            </AnimatePresence>
        </header>
    );
};

export default Header;