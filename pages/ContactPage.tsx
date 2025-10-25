import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { Mail, Phone, MapPin } from 'lucide-react';

const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.475L0 24h.057zM6.481 5.564c.224-.447.363-.464.634-.471.271-.007.47.011.671.241.202.232.733.729.733 1.777s-.271 1.217-.472 1.448c-.201.23-1.004.982-1.205 1.148-.201.164-.402.181-.567.117-.166-.065-.701-.258-1.336-.831-.635-.572-1.058-1.28-1.189-1.511-.131-.23-.007-.363.063-.464.07-.101.166-.232.247-.333.082-.102.117-.165.182-.281.065-.116.031-.216 0-.332-.031-.117-.437-1.043-.593-1.425-.156-.383-.312-.332-.437-.332s-.271 0-.402.016c-.13.016-.312.1-.471.347s-.616.598-.616 1.448c0 .85.632 1.666.716 1.797.085.132 1.251 1.96 3.03 2.66.402.164.716.265.968.348.452.149.854.129 1.17.078.368-.057 1.157-.466 1.322-.919.166-.452.166-.85.117-.919-.049-.065-.181-.1-.382-.216z"/>
    </svg>
);


const ContactPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-fann-gold mb-4">Contact Us</h1>
            <p className="text-xl text-fann-cream max-w-3xl mx-auto">We'd love to hear about your next project. Reach out to us through any of the channels below.</p>
          </div>
          
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-fann-charcoal-light p-8 rounded-lg">
                <h2 className="text-3xl font-serif text-white mb-8" style={{ fontWeight: 600}}>Get in Touch</h2>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Phone className="text-white flex-shrink-0" size={24} />
                        <a href="tel:+971505667502" className="text-lg text-fann-light-gray hover:text-fann-gold transition-colors">+971 50 566 7502</a>
                    </div>
                     <div className="flex items-center space-x-4">
                        <WhatsAppIcon className="text-white flex-shrink-0" size={24} />
                        <a href="https://wa.me/971505667502" target="_blank" rel="noopener noreferrer" className="text-lg text-fann-light-gray hover:text-fann-gold transition-colors">Chat on WhatsApp</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Mail className="text-white flex-shrink-0" size={24} />
                        <a href="mailto:sales@fann.ae" className="text-lg text-fann-light-gray hover:text-fann-gold transition-colors">sales@fann.ae</a>
                    </div>
                     <div className="flex items-start space-x-4 pt-4 mt-4 border-t border-fann-border">
                        <MapPin className="text-white mt-1 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="text-lg font-bold text-white">Office Address</h3>
                            <p className="text-lg text-fann-light-gray">Office 508, Dusseldorf Business Point, <br/>Al Barsha 1, Dubai, UAE</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4 pt-4 mt-4 border-t border-fann-border">
                        <MapPin className="text-white mt-1 flex-shrink-0" size={24} />
                         <div>
                            <h3 className="text-lg font-bold text-white">Warehouse Address</h3>
                            <p className="text-lg text-fann-light-gray">WH10-Umm Dera, <br/>Umm Al Quwain, UAE</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-fann-charcoal-light p-8 rounded-lg">
                 <h2 className="text-3xl font-serif text-white mb-8" style={{ fontWeight: 600}}>Send a Message</h2>
                 <form className="space-y-6">
                    <div>
                        <input type="text" placeholder="Your Name" required className="w-full bg-fann-charcoal border border-fann-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fann-gold transition-shadow" />
                    </div>
                     <div>
                        <input type="email" placeholder="Your Email" required className="w-full bg-fann-charcoal border border-fann-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fann-gold transition-shadow" />
                    </div>
                     <div>
                        <textarea placeholder="Your Message" rows={5} required className="w-full bg-fann-charcoal border border-fann-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fann-gold transition-shadow"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-fann-gold text-fann-charcoal font-bold py-3 rounded-full uppercase tracking-wider hover:opacity-90 transition-opacity duration-300">
                            Submit
                        </button>
                    </div>
                 </form>
            </div>
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
};

export default ContactPage;