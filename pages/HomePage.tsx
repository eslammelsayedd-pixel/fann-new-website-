import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Wrench, Users, Headset, ShieldCheck, CheckCircle } from 'lucide-react';
import { testimonials } from '../constants';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center text-center text-fann-peach overflow-hidden bg-fann-teal">
         <picture>
            <source srcSet="https://images.pexels.com/photos/8112165/pexels-photo-8112165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2&fm=webp" type="image/webp" />
            <source srcSet="https://images.pexels.com/photos/8112165/pexels-photo-8112165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" type="image/jpeg" />
            <img 
                src="https://images.pexels.com/photos/8112165/pexels-photo-8112165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Professional custom exhibition stand built by FANN at GITEX Dubai 2024"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                loading="eager"
                width="1260"
                height="750"
            />
        </picture>
        <div className="relative z-10 p-4 w-full">
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-fann-peach drop-shadow-md">
                Dubai's Premier Exhibition Stand Builders
                <br />
                <span className="text-fann-gold">
                  Custom Design to Installation
                </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-fann-peach/90 drop-shadow">
                Transform your vision into a powerful brand experience with FANN. As a DMCC licensed contractor with over six years of dedicated expertise, we have successfully delivered more than 200 projects for the region's most ambitious brands. Our expert team ensures a seamless process, delivering award-winning custom stands that captivate audiences and drive results.
            </p>
            <div className="mt-10">
                <Link to="/contact">
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-fann-gold text-fann-charcoal font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider transition-all duration-300 shadow-lg shadow-fann-gold/30 hover:shadow-xl hover:shadow-fann-gold/50"
                    >
                        Get Your Free Quote in 24 Hours
                    </motion.button>
                </Link>
            </div>
        </div>
    </section>
);

const WhyChooseFann: React.FC = () => {
    const features = [
        { icon: ShieldCheck, title: "DMCC Licensed", description: "Ensuring quality, compliance, and reliability for your peace of mind." },
        { icon: Award, title: "6+ Years Expertise", description: "Deep knowledge of the UAE & KSA markets, venues, and regulations." },
        { icon: Users, title: "200+ Successful Projects", description: "A proven track record of delivering excellence for leading brands." },
        { icon: Wrench, title: "In-House Fabrication", description: "Complete control over quality, timelines, and craftsmanship." },
        { icon: Headset, title: "Turnkey Solutions", description: "From 3D design to dismantling, we manage every detail seamlessly." },
    ];
    return (
        <section className="py-24 bg-white dark:bg-fann-accent-teal text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">Why Choose FANN for Your Exhibition Stand?</h2>
            <p className="max-w-3xl mx-auto text-fann-teal/80 dark:text-fann-light-gray mb-12">
                Choosing the right exhibition partner in Dubai is critical. FANN stands apart as a fully <Link to="/contact" className="font-bold hover:underline">DMCC licensed</Link> contractor, providing you with the assurance of quality, compliance, and reliability. Our state-of-the-art in-house fabrication facilities give us complete control over quality and timelines, enabling us to deliver stunning <Link to="/services" className="font-bold hover:underline">custom stands</Link> and modular systems.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                {features.map(feature => (
                    <div key={feature.title}>
                        <feature.icon className="w-12 h-12 text-fann-accent-teal dark:text-fann-gold mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-fann-teal dark:text-fann-peach mb-2">{feature.title}</h3>
                        <p className="text-fann-teal/80 dark:text-fann-light-gray text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
             <div className="text-center mt-12">
                 <Link to="/portfolio">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        className="border-2 border-fann-accent-teal dark:border-fann-gold text-fann-accent-teal dark:text-fann-gold font-bold py-3 px-8 rounded-full text-base uppercase tracking-wider"
                    >
                        View Our Portfolio
                    </motion.button>
                </Link>
            </div>
        </section>
    );
};

const ServicesOverview: React.FC = () => (
    <section className="py-24">
        <div className="grid md:grid-cols-2 items-center gap-12 max-w-7xl mx-auto">
            <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Exhibition Stand Services</h2>
                <p className="text-fann-teal/80 dark:text-fann-light-gray mb-6 leading-relaxed">
                    FANN offers a comprehensive suite of services. Our <Link to="/services" className="font-bold hover:underline">Custom Exhibition Stands</Link> are bespoke, brand-centric environments. For flexibility, our **Modular Systems** provide reusable, scalable solutions. As a leading <Link to="/contact" className="font-bold hover:underline">booth contractor in Dubai</Link>, we offer true **Turnkey Services**, a complete end-to-end solution from initial <span className="font-bold">exhibition stand design</span> to post-event breakdown. Our strength lies in our **In-house Fabrication** and professional **Interior Fit-Out** for hospitality suites and meeting rooms.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {["Custom Stand Design", "Modular Systems", "Turnkey Project Management", "In-House Fabrication", "AV & Lighting", "Logistics & Storage"].map(service => (
                        <div key={service} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-fann-accent-teal dark:text-fann-gold" />
                            <span>{service}</span>
                        </div>
                    ))}
                </div>
                 <div className="mt-8">
                     <Link to="/services">
                        <motion.button whileHover={{ scale: 1.05 }} className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-base uppercase tracking-wider">
                            Explore Our Services
                        </motion.button>
                    </Link>
                </div>
            </div>
            <div>
                 <picture>
                    <source srcSet="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=600&q=75&fm=webp" type="image/webp" />
                    <source srcSet="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=600&q=75" type="image/jpeg" />
                    <img 
                        src="https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=600&q=75" 
                        alt="FANN exhibition stand design and fabrication team working on project"
                        className="rounded-lg shadow-xl"
                        loading="lazy"
                        width="600"
                        height="400"
                    />
                </picture>
            </div>
        </div>
    </section>
);

const StatsSection: React.FC = () => {
     const stats = [
        { value: "200+", label: "Successful Exhibitions" },
        { value: "87", label: "Satisfied Clients" },
        { value: "6", label: "Years in Business" },
        { value: "5.0/5", label: "Star Average Rating" },
    ];
    return (
        <section className="py-24 bg-white dark:bg-fann-accent-teal text-center">
             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">200+ Successful Exhibitions Across Dubai & UAE</h2>
            <p className="max-w-3xl mx-auto text-fann-teal/80 dark:text-fann-light-gray mb-12">
                Our numbers tell a story of trust, quality, and consistent delivery. As a preferred contractor at the Dubai World Trade Centre (DWTC), we have a deep understanding of what it takes to succeed in the region's most competitive environments.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map(stat => (
                    <div key={stat.label}>
                        <p className="text-5xl font-bold text-fann-accent-teal dark:text-fann-gold">{stat.value}</p>
                        <p className="text-fann-teal/80 dark:text-fann-light-gray mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>
             <div className="text-center mt-12">
                 <Link to="/contact">
                    <motion.button whileHover={{ scale: 1.05 }} className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-base uppercase tracking-wider">
                        Join Our Success Stories
                    </motion.button>
                </Link>
            </div>
        </section>
    );
};

const EventsSection: React.FC = () => (
    <section className="py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Major Exhibition Events We Serve</h2>
        <p className="max-w-3xl mx-auto text-fann-teal/80 dark:text-fann-light-gray mb-12">We specialize in creating impactful stands for the GCC's most prestigious events. Our extensive experience means we understand the unique audience, regulations, and opportunities at each show.</p>
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">GITEX Technology Week</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">Gulfood</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">Arab Health</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">The Big 5</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">Arabian Travel Market</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">Cityscape Global</Link>
            <Link to="/events" className="font-bold bg-white dark:bg-fann-accent-teal py-2 px-4 rounded-full hover:bg-fann-gold hover:text-fann-charcoal transition-colors">ADIPEC</Link>
        </div>
    </section>
);


const TestimonialsSection: React.FC = () => (
    <section className="py-24 bg-white dark:bg-fann-accent-teal text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">What Our Clients Say About FANN</h2>
        <p className="max-w-3xl mx-auto text-fann-teal/80 dark:text-fann-light-gray mb-12">With an aggregate rating of **5.0/5 stars from 87 reviews**, we have built a reputation for reliability, creativity, and outstanding service. As a DMCC licensed and verified company, we operate with the highest standards of professionalism.</p>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial) => (
                <div key={testimonial.client} className="bg-fann-peach dark:bg-fann-teal p-8 rounded-lg text-left">
                    <p className="italic text-fann-teal dark:text-fann-peach mb-6">"{testimonial.quote}"</p>
                    <p className="font-bold text-fann-accent-teal dark:text-fann-gold">{testimonial.client}</p>
                    <p className="text-sm text-fann-light-gray">{testimonial.company}</p>
                </div>
            ))}
        </div>
    </section>
);


const HomePage: React.FC = () => {
    return (
        <div>
            <SEO
                title="Exhibition Stand Builders Dubai | FANN - Custom Stands UAE"
                description="Award-winning exhibition stand builders in Dubai. 200+ successful stands for GITEX, Gulfood, Arab Health. DMCC licensed. Same-day quote. Call +971-50-566-7502"
            />
            <HeroSection />

            <div className="bg-fann-peach dark:bg-fann-teal">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                   <WhyChooseFann />
                   <ServicesOverview />
                   <StatsSection />
                   <EventsSection />
                   <TestimonialsSection />
                </div>
            </div>
        </div>
    );
};

export default HomePage;