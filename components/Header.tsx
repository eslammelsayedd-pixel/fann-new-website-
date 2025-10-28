import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { navLinks } from '../constants';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';

const FannLogo = () => (
    <svg width="100" height="42" viewBox="0 0 138 55" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.858398 5.69873H29.1722V0.858398H0.858398V5.69873Z" />
        <path d="M0.858398 54.1416H5.69873V0.858398H0.858398V54.1416Z" />
        <path d="M0.858398 29.1721H18.8471V24.3318H0.858398V29.1721Z" />
        <path d="M34.793 54.1416H39.6333V0.858398H34.793V54.1416Z" />
        <path d="M34.793 5.69873H60.2866V0.858398H34.793V5.69873Z" />
        <path d="M60.2861 54.1416H65.1265V0.858398H60.2861V54.1416Z" />
        <path d="M60.2861 5.69873H85.7798V0.858398H60.2861V5.69873Z" />
        <path d="M91.4043 54.1416H96.2446V0.858398H91.4043V54.1416Z" />
        <path d="M101.903 54.1416H106.743V0.858398H101.903V54.1416Z" />
        <path d="M112.528 54.1416H117.368V0.858398H112.528V54.1416Z" />
        <path d="M123.152 54.1416H127.993V0.858398H123.152V54.1416Z" />
        <path d="M132.834 54.1416H137.674V0.858398H132.834V54.1416Z" />
        <path d="M37.1045 42.1416H51.4882L51.4883 37.3013H41.9448V26.6768H50.5204V21.8364H41.9448V11.2119H51.4883L51.4882 6.37158H37.1045V42.1416Z" />
        <path d="M62.5977 42.1416H71.291L80.043 24.3318H79.8867L71.4473 42.1416H68.3242L60.041 24.3318H59.8848L62.5977 42.1416Z" />
        <path d="M82.8584 42.1416H97.1245V37.3013H87.6987V6.37158H82.8584V42.1416Z" />
        <path d="M104.214 42.1416H118.48V37.3013H109.055V26.6768H117.494V21.8364H109.055V11.2119H118.48V6.37158H104.214V42.1416Z" />
        <path d="M120.792 42.1416H125.632V11.2119L131.55 26.6768H132.41L138.328 11.2119V42.1416H143.168V6.37158H137.25L131.979 20.3552L126.708 6.37158H120.792V42.1416Z" />
        <text x="0" y="52" font-family="Inter, sans-serif" font-size="6" font-weight="500" letter-spacing="0.1em">EXHIBITIONS & INTERIORS</text>
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

    const activeLinkClass = "text-fann-accent-peach";
    const inactiveLinkClass = "text-fann-peach dark:text-fann-peach hover:text-fann-accent-peach transition-colors duration-300";
    const lightInactiveLinkClass = "text-fann-teal hover:text-fann-accent-teal";

    return (
        <header className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'fixed bg-fann-peach/90 dark:bg-fann-teal/90 backdrop-blur-sm shadow-lg' : 'absolute bg-transparent'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="text-fann-accent-teal dark:text-fann-accent-peach">
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
                                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 bg-white/95 dark:bg-fann-teal-dark/95 backdrop-blur-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto transform scale-95 group-hover:scale-100 origin-top"
                                    >
                                        <div className="py-1">
                                            {link.children.map(child => (
                                                <NavLink
                                                    key={child.name}
                                                    to={child.path}
                                                    className={({ isActive }) => `block w-full text-left px-4 py-2 text-sm text-fann-teal dark:text-fann-peach hover:bg-fann-accent-teal/50 dark:hover:bg-fann-accent-peach/20 ${isActive ? `text-fann-accent-teal dark:${activeLinkClass}` : ''}`}
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
                                    className={({ isActive }) => `${isActive ? `text-fann-accent-teal dark:${activeLinkClass}` : `${lightInactiveLinkClass} dark:${inactiveLinkClass}`} text-sm font-medium uppercase tracking-wider`}
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
                              className="bg-fann-accent-peach text-fann-teal font-bold py-2 px-6 rounded-full text-sm uppercase tracking-wider transition-transform duration-300"
                          >
                              Start Designing
                          </motion.button>
                        </Link>
                    </div>

                    <div className="lg:hidden">
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
                    className="lg:hidden bg-fann-peach/95 dark:bg-fann-teal/95 absolute top-20 left-0 right-0"
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
                                                            className={({ isActive }) => `${isActive ? `text-fann-accent-teal dark:${activeLinkClass}` : `${lightInactiveLinkClass} dark:${inactiveLinkClass}`} text-base font-medium uppercase tracking-wider`}
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
                                        className={({ isActive }) => `${isActive ? `text-fann-accent-teal dark:${activeLinkClass}` : `${lightInactiveLinkClass} dark:${inactiveLinkClass}`} text-lg font-medium uppercase tracking-wider`}
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
                            className="bg-fann-accent-peach text-fann-teal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider mt-4"
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