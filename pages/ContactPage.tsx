import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage: React.FC = () => {
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
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Sunday"
                    ],
                    "opens": "09:00",
                    "closes": "18:00"
                }
            })}
        </script>
      </SEO>
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
                        <a href="tel:+971505667502" className="text-lg hover:text-fann-gold transition-colors">+971 50 566 7502</a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Mail className="text-fann-gold" size={24} />
                        <a href="mailto:sales@fann.ae" className="text-lg hover:text-fann-gold transition-colors">sales@fann.ae</a>
                    </div>
                     <div className="flex items-start space-x-4">
                        <MapPin className="text-fann-gold mt-1" size={24} />
                        <div>
                            <h3 className="text-lg font-semibold">Office Address</h3>
                            <p className="text-lg text-fann-light-gray">Office 508, Dusseldorf Business Point, <br/>Al Barsha 1, Dubai, UAE</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <MapPin className="text-fann-gold mt-1" size={24} />
                         <div>
                            <h3 className="text-lg font-semibold">Warehouse Address</h3>
                            <p className="text-lg text-fann-light-gray">WH10-Umm Dera, <br/>Umm Al Quwain, UAE</p>
                        </div>
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