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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = scrolled
        ? 'bg-fann-charcoal/90 backdrop-blur-md border-b border-white/5 py-4'
        : 'bg-transparent py-6';

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerClasses}`}
        >
            <div className="container mx-auto flex items-center justify-between">
                {/* LOGO */}
                <Link to="/" className="flex items-center gap-3 z-50 hover-trigger">
                    <img 
                        src="/favicon.svg" 
                        alt="FANN Logo" 
                        className="h-8 w-auto" 
                    />
                    <span className="font-sans font-bold text-xl tracking-[0.15em] text-white">
                        FANN
                    </span>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden lg:flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <div key={link.name} className="relative group h-full">
                            {link.children ? (
                                <button 
                                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-gray-300 hover:text-fann-gold transition-colors py-2 hover-trigger"
                                >
                                    {link.name}
                                    <ChevronDown size={10} className="opacity-70" />
                                </button>
                            ) : (
                                <NavLink
                                    to={link.path!}
                                    className={({ isActive }) => `text-xs font-semibold uppercase tracking-widest transition-colors relative link-underline hover-trigger ${
                                        isActive ? 'text-fann-gold' : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    {link.name}
                                </NavLink>
                            )}
                            
                            {/* Dropdown */}
                            {link.children && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="bg-fann-charcoal border border-white/10 p-4 min-w-[200px] shadow-2xl rounded-sm">
                                        {link.children.map(child => (
                                            <NavLink
                                                key={child.name}
                                                to={child.path}
                                                className="block px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-fann-gold hover:bg-white/5 transition-colors hover-trigger"
                                            >
                                                {child.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* RIGHT ACTIONS */}
                <div className="hidden lg:flex items-center gap-6">
                    <ThemeToggle />
                    <Link to="/contact" className="hover-trigger">
                      <button 
                          className="btn-gold"
                      >
                          Start Project
                      </button>
                    </Link>
                </div>

                {/* MOBILE TOGGLE */}
                <div className="lg:hidden flex items-center gap-4 z-50">
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="text-white p-2 hover:text-fann-gold transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
            
            {/* MOBILE MENU */}
            <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-fann-charcoal z-40 pt-24 px-6 overflow-y-auto"
                >
                    <nav className="flex flex-col space-y-6">
                        {navLinks.map((link) => (
                             <div key={link.name}>
                                {link.children ? (
                                    <div className="space-y-4">
                                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">{link.name}</div>
                                        <div className="pl-4 space-y-4 border-l border-white/10">
                                            {link.children.map(child => (
                                                <NavLink
                                                    key={child.name}
                                                    to={child.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block text-lg font-medium text-white hover:text-fann-gold"
                                                >
                                                    {child.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <NavLink
                                        to={link.path!}
                                        onClick={() => setIsOpen(false)}
                                        className="block text-2xl font-serif text-white hover:text-fann-gold"
                                    >
                                        {link.name}
                                    </NavLink>
                                )}
                            </div>
                        ))}
                        <div className="pt-8 mt-8 border-t border-white/10">
                            <Link to="/contact" onClick={() => setIsOpen(false)} className="block w-full btn-gold text-center">
                                Contact Us
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