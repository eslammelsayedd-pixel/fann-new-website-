import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-fann-charcoal-light text-fann-cream py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold text-fann-gold mb-4">FANN</h3>
            <p className="text-sm text-fann-light-gray">Transforming visions into unforgettable experiences. Dubai's premier exhibition, event, and interior design innovators.</p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-fann-gold transition-colors text-sm">About FANN</Link></li>
              <li><Link to="/portfolio" className="hover:text-fann-gold transition-colors text-sm">Portfolio</Link></li>
              <li><Link to="/services" className="hover:text-fann-gold transition-colors text-sm">Services</Link></li>
              <li><Link to="/contact" className="hover:text-fann-gold transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:info@fann.ae" className="hover:text-fann-gold transition-colors">info@fann.ae</a></li>
              <li><a href="tel:+971000000000" className="hover:text-fann-gold transition-colors">+971 (0) 0 000 0000</a></li>
              <li>Dubai Design District, Dubai, UAE</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-fann-light-gray hover:text-fann-gold transition-colors"><Facebook /></a>
              <a href="#" className="text-fann-light-gray hover:text-fann-gold transition-colors"><Instagram /></a>
              <a href="#" className="text-fann-light-gray hover:text-fann-gold transition-colors"><Linkedin /></a>
              <a href="#" className="text-fann-light-gray hover:text-fann-gold transition-colors"><Twitter /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-fann-charcoal mt-8 pt-6 text-center text-sm text-fann-light-gray">
          <p>&copy; {new Date().getFullYear()} FANN. All Rights Reserved. | <a href="#" className="hover:text-fann-gold">Privacy Policy</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;