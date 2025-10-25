import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';
import { Mail, Phone, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
    }, 1500);
  };

  return (
    <AnimatedPage>
      <SEO
        title="Contact FANN | Get a Quote for Your Project"
        description="Reach out to FANN's team of design experts in Dubai. Contact us for a complimentary consultation on your next exhibition, event, or interior design project."
      >
        <script type="application/ld+json">
            {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "FANN",
                "image": "https://fann.ae/favicon.svg",
                "@id": "https://fann.ae/",
                "url": "https://fann.ae/contact",
                "telephone": "+971505667502",
                "email": "sales@fann.ae",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Office 508, Dusseldorf Business Point, Al Barsha 1",
                    "addressLocality": "Dubai",
                    "addressCountry": "AE"
                },
                 "department": [
                    {
                        "@type": "ContactPoint",
                        "contactType": "Warehouse",
                        "areaServed": "AE",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "WH10-Umm Dera",
                            "addressLocality": "Umm Al Quwain",
                            "addressCountry": "AE"
                        }
                    }
                ],
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday" ],
                    "opens": "09:00",
                    "closes": "18:00"
                }
            })}
        </script>
      </SEO>
      <div className="min-h-screen bg-fann-charcoal pt-40 pb-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-fann-gold mb-4">Contact Us</h1>
            <p className="text-lg text-fann-cream max-w-3xl mx-auto">We'd love to hear about your next project. Reach out to us through any of the channels below.</p>
          </div>
          
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Get in Touch Card */}
            <div className="bg-fann-charcoal-light p-8 rounded-lg">
                <h2 className="text-3xl font-serif text-white mb-8">Get in Touch</h2>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Phone className="text-fann-gold flex-shrink-0" size={20} />
                        <a href="tel:+971505667502" className="text-base hover:text-fann-gold transition-colors">+971 50 566 7502</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Mail className="text-fann-gold flex-shrink-0" size={20} />
                        <a href="mailto:sales@fann.ae" className="text-base hover:text-fann-gold transition-colors">sales@fann.ae</a>
                    </div>
                     <div className="flex items-start space-x-4">
                        <MapPin className="text-fann-gold flex-shrink-0 mt-1" size={20} />
                        <div>
                            <h3 className="text-base font-bold">Office Address</h3>
                            <p className="text-base text-fann-light-gray">Office 508, Dusseldorf Business Point, <br/>Al Barsha 1, Dubai, UAE</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <MapPin className="text-fann-gold flex-shrink-0 mt-1" size={20} />
                         <div>
                            <h3 className="text-base font-bold">Warehouse Address</h3>
                            <p className="text-base text-fann-light-gray">WH10-Umm Dera, <br/>Umm Al Quwain, UAE</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Send a Message Card */}
            <div className="bg-fann-charcoal-light p-8 rounded-lg">
                 <h2 className="text-3xl font-serif text-white mb-8">Send a Message</h2>
                 {isSubmitted ? (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="h-full flex flex-col items-center justify-center text-center">
                        <CheckCircle className="w-16 h-16 text-fann-teal mb-4"/>
                        <h3 className="text-2xl font-serif text-white">Message Sent!</h3>
                        <p className="text-fann-light-gray mt-2">Thank you for reaching out. Our team will get back to you shortly.</p>
                    </motion.div>
                 ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="text-sm font-semibold text-fann-light-gray mb-2 block">Your Name</label>
                            <input type="text" id="name" name="name" value={formState.name} onChange={handleInputChange} required className="w-full bg-fann-charcoal border border-fann-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fann-gold" />
                        </div>
                        <div>
                            <label htmlFor="email" className="text-sm font-semibold text-fann-light-gray mb-2 block">Your Email</label>
                            <input type="email" id="email" name="email" value={formState.email} onChange={handleInputChange} required className="w-full bg-fann-charcoal border border-fann-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fann-gold" />
                        </div>
                        <div>
                            <label htmlFor="message" className="text-sm font-semibold text-fann-light-gray mb-2 block">Your Message</label>
                            <textarea id="message" name="message" value={formState.message} onChange={handleInputChange} required rows={4} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fann-gold"></textarea>
                        </div>
                        <div>
                            <button type="submit" disabled={isSubmitting} className="w-full bg-fann-gold text-fann-charcoal font-bold py-3 rounded-md uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50">
                                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                                {isSubmitting ? 'Sending...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                 )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ContactPage;