import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { navLinks } from '../constants';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'bg-fann-charcoal/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="text-3xl font-serif font-bold text-fann-gold tracking-wider">
                        FANN
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} text-sm font-medium uppercase tracking-wider`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center space-x-4">
                        <div className="relative group">
                            <button className="flex items-center space-x-1 text-sm font-medium hover:text-fann-gold transition-colors duration-300">
                                <Globe size={16} />
                                <span>EN</span>
                                <ChevronDown size={16} />
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-32 bg-fann-charcoal/90 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                                <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-fann-teal">English</a>
                                <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-fann-teal">العربية</a>
                                <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-fann-teal">Русский</a>
                            </div>
                        </div>
                        <Link to="/contact">
                          <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-fann-gold text-fann-charcoal font-bold py-2 px-6 rounded-full text-sm uppercase tracking-wider transition-transform duration-300"
                          >
                              Get Quote
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
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="lg:hidden bg-fann-charcoal/95 absolute top-20 left-0 right-0"
                >
                    <nav className="flex flex-col items-center space-y-6 py-8">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} text-lg font-medium uppercase tracking-wider`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <Link to="/contact">
                          <button className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider mt-4">
                              Get Quote
                          </button>
                        </Link>
                    </nav>
                </motion.div>
            )}
        </header>
    );
};

export default Header;