import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { navLinks } from '../constants';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';

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
    const inactiveLinkClass = "hover:text-fann-gold transition-colors duration-300";

    return (
        <header className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'fixed bg-fann-charcoal/90 backdrop-blur-sm shadow-lg' : 'absolute bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="text-3xl font-serif font-bold text-fann-gold tracking-wider">
                        FANN
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            link.children ? (
                                <div key={link.name} className="relative group">
                                    <button className={`flex items-center space-x-1 text-sm font-medium uppercase tracking-wider ${inactiveLinkClass}`}>
                                        <span>{link.name}</span>
                                        <ChevronDown size={16} />
                                    </button>
                                    <div 
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-fann-charcoal-light/95 backdrop-blur-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto transform scale-95 group-hover:scale-100 origin-top"
                                    >
                                        <div className="py-1">
                                            {link.children.map(child => (
                                                <NavLink
                                                    key={child.name}
                                                    to={child.path}
                                                    className={({ isActive }) => `block w-full text-left px-4 py-2 text-sm text-white hover:bg-fann-teal/50 ${isActive ? activeLinkClass : ''}`}
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
                                    className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} text-sm font-medium uppercase tracking-wider`}
                                >
                                    {link.name}
                                </NavLink>
                            )
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center space-x-4">
                        <LanguageSwitcher />
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

                    <div className="lg:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
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
                    className="lg:hidden bg-fann-charcoal/95 absolute top-20 left-0 right-0"
                >
                    <nav className="flex flex-col items-center space-y-6 py-8">
                        {navLinks.map((link) => (
                             <div key={link.name} className="text-center w-full px-8">
                                {link.children ? (
                                    <>
                                        <button 
                                            onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                                            className={`flex items-center justify-center w-full text-lg font-medium uppercase tracking-wider ${inactiveLinkClass}`}
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
                                                            className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} text-base font-medium uppercase tracking-wider`}
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
                                        className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} text-lg font-medium uppercase tracking-wider`}
                                    >
                                        {link.name}
                                    </NavLink>
                                )}
                            </div>
                        ))}
                        <div className="my-6 w-full px-8">
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