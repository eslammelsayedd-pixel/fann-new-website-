import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';
import { Layers, Calendar, PenTool, CheckCircle, ArrowRight } from 'lucide-react';

interface ServiceSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  services: string[];
  imagePosition?: 'left' | 'right';
  link: string;
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ icon, title, description, image, services, imagePosition = 'right', link }) => {
  const imageVariants: Variants = {
    offscreen: { opacity: 0, x: imagePosition === 'right' ? 100 : -100 },
    onscreen: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50, duration: 0.8 } }
  };
  
  const textVariants: Variants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, duration: 0.8, delay: 0.2 } }
  };

  return (
    <motion.section 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className={`grid md:grid-cols-2 gap-12 items-center`}>
        <motion.div className={`order-2 ${imagePosition === 'left' ? 'md:order-2' : 'md:order-1'}`} variants={textVariants}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-fann-gold">{icon}</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-fann-gold">{title}</h2>
          </div>
          <p className="text-fann-cream mb-6 leading-relaxed">{description}</p>
          <ul className="space-y-3 mb-8">
            {services.map((service, index) => (
              <li key={index} className="flex items-center gap-3">
                <CheckCircle className="text-fann-teal w-5 h-5 flex-shrink-0" />
                <span className="text-white">{service}</span>
              </li>
            ))}
          </ul>
           <Link to={link}>
              <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-fann-gold text-fann-gold font-bold py-3 px-8 rounded-full text-base uppercase tracking-wider flex items-center gap-2 group"
              >
                  View Projects
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
          </Link>
        </motion.div>
        <motion.div className={`order-1 ${imagePosition === 'left' ? 'md:order-1' : 'md:order-2'}`} variants={imageVariants}>
          <img src={image} alt={title} className="rounded-lg shadow-2xl w-full h-auto object-cover" />
        </motion.div>
      </div>
    </motion.section>
  );
};

const ServicesPage: React.FC = () => {
  return (
    <AnimatedPage>
      <SEO
          title="Expert Services for Exhibitions, Events & Interiors"
          description="Explore FANN's core capabilities: award-winning exhibition stand design and build, flawless corporate event management, and bespoke commercial and residential interior design."
      >
          <script type="application/ld+json">
              {JSON.stringify([
                  {
                      "@context": "https://schema.org",
                      "@type": "Service",
                      "serviceType": "Exhibition Stand Design & Build",
                      "provider": { "@type": "Organization", "name": "FANN" },
                      "areaServed": "Dubai, UAE",
                      "description": "Turnkey solutions for creating powerful brand experiences at major venues like the Dubai World Trade Centre and ADNEC, from 3D concept to final handover."
                  },
                  {
                      "@context": "https://schema.org",
                      "@type": "Service",
                      "serviceType": "Corporate Event Management",
                      "provider": { "@type": "Organization", "name": "FANN" },
                      "areaServed": "Dubai, UAE",
                      "description": "Meticulous planning and creative production for high-profile product launches, elegant gala dinners, and global summits."
                  },
                  {
                      "@context": "https://schema.org",
                      "@type": "Service",
                      "serviceType": "Commercial & Residential Interiors",
                      "provider": { "@type": "Organization", "name": "FANN" },
                      "areaServed": "Dubai, UAE",
                      "description": "Designing inspiring and functional commercial environments and luxurious residential properties with a blend of timeless aesthetics and modern innovation."
                  }
              ])}
          </script>
      </SEO>
      <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-fann-gold mb-4">Our Core Capabilities</h1>
          <p className="text-xl text-fann-cream max-w-3xl mx-auto">
            From monumental exhibitions to bespoke interiors, we deliver end-to-end solutions with precision, creativity, and a commitment to excellence.
          </p>
        </div>

        <ServiceSection
          icon={<Layers size={40} />}
          title="Exhibition Stand Design & Build"
          description="We transform exhibition spaces into powerful brand experiences. At major venues like the Dubai World Trade Centre and ADNEC, we manage every detail from the initial 3D concept to the final handover, ensuring your stand is not just seen, but remembered."
          image="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80"
          services={[
            "Conceptual Design & 3D Visualization",
            "Turnkey Project Management",
            "Custom Fabrication & Joinery",
            "Advanced AV & Lighting Integration",
            "On-site Installation & Dismantling",
            "Global Logistics Coordination"
          ]}
          imagePosition="right"
          link="/portfolio"
        />

        <div className="bg-fann-charcoal-light">
          <ServiceSection
            icon={<Calendar size={40} />}
            title="Corporate Event Management"
            description="We orchestrate flawless corporate events that resonate with your audience. Whether it's a high-profile product launch, an elegant gala dinner, or a global summit, our meticulous planning and creative production deliver unforgettable, stress-free experiences."
            image="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80"
            services={[
              "Strategic Event Concept & Theming",
              "Venue Sourcing & Management",
              "Stage Design & Technical Production",
              "Delegate & VIP Management",
              "Entertainment & Speaker Sourcing",
              "Full-Service Event Execution"
            ]}
            imagePosition="left"
            link="/portfolio"
          />
        </div>

        <ServiceSection
          icon={<PenTool size={40} />}
          title="Commercial & Residential Interiors"
          description="Our interior design philosophy centers on creating spaces that are both beautiful and functional. We specialize in designing inspiring commercial environments and luxurious residential properties, blending timeless aesthetics with modern innovation to reflect your unique identity."
          image="https://images.unsplash.com/photo-16182211957_10-dd6b41fa2047?w=800&q=80"
          services={[
            "Comprehensive Space Planning",
            "Concept & Mood Board Development",
            "FF&E Sourcing & Procurement",
            "Custom Furniture & Joinery Design",
            "Complete Fit-Out & Project Management",
            "Turnkey Design & Build Solutions"
          ]}
          imagePosition="right"
          link="/portfolio"
        />
        
         {/* CTA Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="text-center bg-gradient-to-r from-fann-teal to-fann-gold p-1 rounded-lg">
                 <div className="bg-fann-charcoal rounded-lg py-16 px-8">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Have a Project in Mind?</h2>
                    <p className="max-w-2xl mx-auto text-fann-cream mb-8">Let's turn your vision into a reality. Contact us today for a complimentary consultation with our design experts.</p>
                    <Link to="/contact">
                        <motion.button 
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(212, 175, 118, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider"
                        >
                            Get a Free Quote
                        </motion.button>
                    </Link>
                 </div>
            </div>
        </section>

      </div>
    </AnimatedPage>
  );
};

export default ServicesPage;