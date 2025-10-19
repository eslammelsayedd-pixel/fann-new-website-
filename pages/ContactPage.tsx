import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-fann-charcoal pt-32 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Contact Us</h1>
            <p className="text-xl text-fann-cream max-w-3xl mx-auto">We'd love to hear about your next project. Reach out to us through any of the channels below.</p>
          </div>
          
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-fann-charcoal-light p-8 rounded-lg">
                <h2 className="text-3xl font-serif text-white mb-6">Get in Touch</h2>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Phone className="text-fann-gold" size={24} />
                        <a href="tel:+971000000000" className="text-lg hover:text-fann-gold transition-colors">+971 (0) 0 000 0000</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Mail className="text-fann-gold" size={24} />
                        <a href="mailto:info@fann.ae" className="text-lg hover:text-fann-gold transition-colors">info@fann.ae</a>
                    </div>
                     <div className="flex items-start space-x-4">
                        <MapPin className="text-fann-gold mt-1" size={24} />
                        <p className="text-lg">Dubai Design District<br/>Building 7, Office A301<br/>Dubai, UAE</p>
                    </div>
                </div>
            </div>

            <div className="bg-fann-charcoal-light p-8 rounded-lg">
                 <h2 className="text-3xl font-serif text-white mb-6">Send a Message</h2>
                 <form className="space-y-4">
                    <div>
                        <input type="text" placeholder="Your Name" className="w-full bg-fann-charcoal border border-fann-border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fann-gold" />
                    </div>
                     <div>
                        <input type="email" placeholder="Your Email" className="w-full bg-fann-charcoal border border-fann-border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fann-gold" />
                    </div>
                     <div>
                        <textarea placeholder="Your Message" rows={4} className="w-full bg-fann-charcoal border border-fann-border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fann-gold"></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-fann-gold text-fann-charcoal font-bold py-3 rounded-full uppercase tracking-wider hover:opacity-90 transition-opacity">
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