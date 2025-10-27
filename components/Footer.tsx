import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const QuoraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.53 16.22c-.29-.13-.56-.29-.81-.48-.25-.19-.45-.4-.62-.63-.17-.23-.25-.48-.25-.75 0-.39.14-.7.42-.93.28-.23.66-.34 1.14-.34.42 0 .76.08 1.02.25.26.17.39.41.39.72 0 .19-.05.37-.15.53-.1.16-.26.3-.46.42-.2.12-.45.22-.75.3.53.31.91.74 1.14 1.27.23.53.34 1.13.34 1.8 0 .79-.23 1.48-.7 2.06s-1.09.88-1.87.88c-.73 0-1.35-.25-1.87-.75-.52-.5-.78-1.12-.78-1.85 0-.71.13-1.34.4-1.89.26-.55.67-.97 1.23-1.27M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10C22 6.48 17.52 2 12 2zm0 18c-4.41 0-8 3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2.57-2.89c-.21.19-.47.29-.78.29-.3 0-.56-.09-.78-.28-.22-.19-.33-.44-.33-.75s.12-.57.35-.77.55-.3.94-.3c.06 0 .12 0 .18 0 .19.25.33.5.41.76.11.39.07.69.01.99z"/>
    </svg>
);


const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-fann-charcoal dark:bg-fann-charcoal-light dark:text-fann-cream py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-12 lg:col-span-4">
            <h3 className="text-2xl font-serif font-bold text-fann-gold mb-4">FANN</h3>
            <p className="text-sm text-gray-600 dark:text-fann-light-gray">Your full-service design and build partner. Transforming visions into unforgettable experiences across exhibitions, events, and interiors.</p>
          </div>
          <div className="md:col-span-6 lg:col-span-2">
            <h4 className="font-bold text-fann-charcoal dark:text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><Link to="/about" className="hover:text-fann-gold transition-colors text-sm">About FANN</Link></li>
              <li><Link to="/portfolio" className="hover:text-fann-gold transition-colors text-sm">Portfolio</Link></li>
              <li><Link to="/services" className="hover:text-fann-gold transition-colors text-sm">Services</Link></li>
              <li><Link to="/contact" className="hover:text-fann-gold transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>
          <div className="md:col-span-6 lg:col-span-3">
            <h4 className="font-bold text-fann-charcoal dark:text-white uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li><a href="mailto:sales@fann.ae" className="hover:text-fann-gold transition-colors">sales@fann.ae</a></li>
              <li><a href="tel:+971505667502" className="hover:text-fann-gold transition-colors">+971 50 566 7502</a></li>
              <li className="font-semibold mt-2 pt-2 border-t border-gray-300 dark:border-fann-border">Office:</li>
              <li>Office 508, Dusseldorf Business Point, Al Barsha 1, Dubai, UAE</li>
              <li className="font-semibold mt-2 pt-2 border-t border-gray-300 dark:border-fann-border">Warehouse:</li>
              <li>WH10-Umm Dera, Umm Al Quwain, UAE</li>
            </ul>
          </div>
          <div className="md:col-span-12 lg:col-span-3">
            <h4 className="font-bold text-fann-charcoal dark:text-white uppercase tracking-wider mb-4">Follow Us</h4>
            <div className="flex space-x-4 text-gray-500 dark:text-fann-light-gray">
              <a href="https://www.facebook.com/fannuae/reels/" target="_blank" rel="noopener noreferrer" className="hover:text-fann-gold transition-colors"><Facebook /></a>
              <a href="https://www.instagram.com/fann_uae/" target="_blank" rel="noopener noreferrer" className="hover:text-fann-gold transition-colors"><Instagram /></a>
              <a href="https://ae.linkedin.com/company/fannaedubai" target="_blank" rel="noopener noreferrer" className="hover:text-fann-gold transition-colors"><Linkedin /></a>
              <a href="https://fannae.quora.com/" target="_blank" rel="noopener noreferrer" className="hover:text-fann-gold transition-colors"><QuoraIcon /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-fann-charcoal mt-8 pt-6 text-center text-sm text-gray-500 dark:text-fann-light-gray">
          <p>&copy; {new Date().getFullYear()} FANN. All Rights Reserved. | <a href="#" className="hover:text-fann-gold">Privacy Policy</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;