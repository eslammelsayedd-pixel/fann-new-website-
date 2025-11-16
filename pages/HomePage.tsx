import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Calendar, Star, PenTool } from 'lucide-react';
import { portfolioProjects, testimonials } from '../constants';
import SEO from '../components/SEO';

const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "FANN",
    "image": "https://images.pexels.com/photos/8112165/pexels-photo-8112165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "@id": "https://fann.ae",
    "url": "https://fann.ae",
    "telephone": "+971505667502",
    "priceRange": "$$$",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office 508, Dusseldorf Business Point, Al Barsha 1",
        "addressLocality": "Dubai",
        "addressCountry": "AE"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.1173,
        "longitude": 55.2036
    },
    "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday"
        ],
        "opens": "09:00",
        "closes": "18:00"
    },
    "sameAs": [
        "https://www.facebook.com/fannuae/",
        "https://www.instagram.com/fann_uae/",
        "https://ae.linkedin.com/company/fannaedubai",
        "https://fannae.quora.com/"
    ],
    "areaServed": [
        {
            "@type": "City",
            "name": "Dubai"
        },
        {
            "@type": "City",
            "name": "Abu Dhabi"
        },
        {
            "@type": "City",
            "name": "Sharjah"
        }
    ],
    "description": "FANN is a premier exhibition, events, and interior design company in Dubai, transforming visions into unforgettable experiences."
};

const HeroSection: React.FC = () => {
    return (
        <section className="relative h-screen flex items-center justify-center text-center text-fann-peach overflow-hidden bg-fann-teal">
            <div 
                className="relative z-10 p-4 w-full"
            >
                <h1 
                    className="text-4xl md:text-6xl font-serif font-bold leading-snug text-fann-peach drop-shadow-md"
                >
                    Transforming Visions Into
                    <br />
                    <span className="text-fann-gold">
                      Unforgettable Experiences
                    </span>
                </h1>
                <p 
                    className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-fann-peach/90 drop-shadow"
                >
                    Dubai's Premier Partner in Exhibitions, Events & Interiors.
                </p>
                <div 
                    className="mt-10"
                >
                    <Link to="/portfolio">
                        <button 
                            className="bg-fann-gold text-fann-charcoal font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider transition-all duration-300 shadow-lg shadow-fann-gold/30 hover:shadow-xl hover:shadow-fann-gold/50"
                        >
                            Explore Our Work
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string; }> = ({ icon, title, description, link }) => (
    <div 
        className="relative p-8 bg-white dark:bg-fann-accent-teal rounded-lg overflow-hidden border border-fann-teal/10 dark:border-fann-border shadow-md"
    >
        <div className="relative z-10">
            <div className="text-fann-accent-teal dark:text-fann-gold mb-4">{icon}</div>
            <h3 className="text-2xl font-serif font-bold mb-2 text-fann-teal dark:text-fann-peach">{title}</h3>
            <p className="text-fann-teal/80 dark:text-fann-light-gray mb-6">{description}</p>
            <Link to={link} className="font-bold text-fann-accent-teal dark:text-fann-gold hover:underline underline-offset-4">Learn More &rarr;</Link>
        </div>
    </div>
);

const HomePage: React.FC = () => {
    const studioImageUrl = "https://images.pexels.com/photos/8927043/pexels-photo-8927043.jpeg?auto=compress&cs=tinysrgb&w=1024&q=75";

    return (
        <div>
            <SEO
                title="FANN: Expert Exhibition Stand Design & Build in Dubai"
                description="Transform your vision with Dubai's leading exhibition stand contractor. FANN offers award-winning design, build, and event services. Experience our 3D Studio today!"
                schema={homePageSchema}
            />
            <HeroSection />

            <div className="py-24 md:py-32 bg-fann-peach dark:bg-fann-teal">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Services Section */}
                    <section 
                        className="text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12">Our Expertise</h2>
                        <div 
                            className="grid md:grid-cols-3 gap-8"
                        >
                            <ServiceCard icon={<Layers size={40} />} title="Exhibitions" description="Designing and building immersive brand pavilions that captivate audiences and drive business." link="/services" />
                            <ServiceCard icon={<Calendar size={40} />} title="Events" description="Executing flawless corporate events, from grand openings to global summits." link="/services" />
                            <ServiceCard icon={<PenTool size={40} />} title="Interior Design" description="Designing and building inspiring commercial and residential spaces with a touch of luxury." link="/services" />
                        </div>
                    </section>

                    {/* FANN Studio Section */}
                    <section 
                        className="mt-32 text-center bg-white dark:bg-fann-accent-teal rounded-lg py-16 px-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-fann-accent-teal dark:text-fann-gold mb-4">Visualize Your Vision in Minutes</h2>
                        <p className="max-w-2xl mx-auto text-fann-teal/90 dark:text-fann-peach mb-8">Our revolutionary FANN Studio allows you to configure your exhibition stand, see it in 3D, and get instant pricing. Innovation at your fingertips.</p>
                        <div className="mb-8">
                           <picture>
                                <source srcSet={`${studioImageUrl}&fm=webp`} type="image/webp" />
                                <source srcSet={studioImageUrl} type="image/jpeg" />
                                <img 
                                    src={studioImageUrl} 
                                    alt="A sleek, modern exhibition stand with integrated lighting and a hospitality bar, showcasing a 3D concept from FANN Studio." 
                                    className="rounded-lg shadow-2xl mx-auto" 
                                    loading="lazy"
                                    width="1024"
                                    height="576"
                                />
                           </picture>
                        </div>
                         <Link to="/fann-studio">
                           <button 
                                className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-fann-gold/40"
                            >
                                Try It Now - Free
                            </button>
                        </Link>
                    </section>
                    
                    {/* Featured Projects Section */}
                    <section 
                        className="mt-32"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12">Featured Projects</h2>
                        <div 
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {portfolioProjects.slice(0, 6).map(project => (
                                <div 
                                    key={project.id} 
                                    className="group relative overflow-hidden rounded-lg shadow-lg"
                                >
                                    <picture>
                                        <source srcSet={`${project.image}&fm=webp`} type="image/webp" />
                                        <source srcSet={project.image} type="image/jpeg" />
                                        <img 
                                            src={project.image} 
                                            alt={project.title} 
                                            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" 
                                            loading="lazy"
                                            width="400"
                                            height="320"
                                        />
                                    </picture>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-6">
                                        <span className="text-sm bg-fann-gold text-fann-charcoal font-bold py-1 px-2 rounded">{project.service}</span>
                                        <h3 className="text-xl font-bold mt-2 text-white">{project.title}</h3>
                                        <p className="text-fann-peach/90">{project.client}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-12">
                             <Link to="/portfolio">
                                <button 
                                    className="border-2 border-fann-accent-teal dark:border-fann-gold text-fann-accent-teal dark:text-fann-gold font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider transition-all duration-300 hover:bg-fann-accent-teal/10 dark:hover:bg-fann-gold/10"
                                >
                                    View Full Portfolio
                                </button>
                            </Link>
                        </div>
                    </section>
                    
                    {/* Testimonials Section */}
                    <section 
                        className="mt-32 text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12">What Our Clients Say</h2>
                        <div className="relative max-w-4xl mx-auto">
                           <div className="p-8">
                                <Star className="text-fann-gold mx-auto mb-6" size={40} />
                                <p className="text-2xl md:text-3xl font-serif italic text-fann-teal/90 dark:text-fann-peach mb-8 leading-relaxed">"{testimonials[0].quote}"</p>
                                <h4 className="font-bold text-fann-teal dark:text-fann-peach text-xl uppercase tracking-wider">{testimonials[0].client}</h4>
                                <p className="text-fann-light-gray mt-1">{testimonials[0].company}</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section 
                        className="mt-32 text-center bg-gradient-to-r from-fann-accent-teal to-fann-gold p-1 rounded-lg"
                    >
                         <div className="bg-white dark:bg-fann-accent-teal rounded-lg py-16 px-8">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">Ready to Create Something Extraordinary?</h2>
                            <p className="max-w-2xl mx-auto text-fann-teal/90 dark:text-fann-peach/90 mb-8">Let's discuss how our design and build expertise can bring your vision to life. Schedule a complimentary consultation with our experts today.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                               <Link to="/contact">
                                  <button 
                                      className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-fann-gold/40"
                                  >
                                      Book Consultation
                                  </button>
                                </Link>
                                <Link to="/fann-studio">
                                   <button 
                                      className="border-2 border-fann-accent-teal dark:border-fann-gold text-fann-accent-teal dark:text-fann-gold font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider w-full sm:w-auto transition-all duration-300 hover:bg-fann-accent-teal/10 dark:hover:bg-fann-gold/10"
                                  >
                                      Start Designing
                                  </button>
                                </Link>
                            </div>
                         </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HomePage;