
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, MapPin, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';
import { detailedTestimonials } from '../constants/testimonials';
import { Link } from 'react-router-dom';

const TestimonialsPage: React.FC = () => {
    return (
        <AnimatedPage>
            <SEO 
                title="Client Testimonials | Exhibition Stand Reviews Dubai" 
                description="Read authentic reviews from local and international SMEs who trusted FANN with their exhibition stands at GITEX, Gulfood, Arab Health, and ADIPEC."
            />
            
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                {/* Hero Section */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-fann-gold text-xs font-bold uppercase tracking-widest border border-fann-gold/20 px-3 py-1 rounded-full bg-fann-gold/5 mb-6 inline-block">
                            Client Success Stories
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                            Trusted by <span className="text-fann-gold">Ambitious Brands</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            We don't just build stands; we build lasting partnerships. Here is what our clients have to say about their experience exhibiting with FANN in Dubai and Abu Dhabi.
                        </p>
                    </motion.div>
                </div>

                {/* Testimonials Grid */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {detailedTestimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-fann-charcoal-light border border-white/10 p-8 rounded-lg relative group hover:border-fann-gold/30 transition-all duration-300 flex flex-col h-full"
                            >
                                {/* Quote Icon */}
                                <div className="absolute top-6 right-6 text-fann-gold/10 group-hover:text-fann-gold/20 transition-colors">
                                    <Quote size={48} fill="currentColor" />
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 text-fann-gold mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-gray-300 text-sm leading-relaxed mb-8 flex-grow relative z-10 italic">
                                    "{testimonial.quote}"
                                </p>

                                {/* Footer Info */}
                                <div className="mt-auto pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-fann-gold border border-white/10">
                                            {testimonial.author.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{testimonial.author}</h4>
                                            <p className="text-xs text-gray-500">{testimonial.role}, {testimonial.company}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-black/30 px-2 py-1 rounded border border-white/5">
                                            <Calendar size={10} /> {testimonial.event}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-black/30 px-2 py-1 rounded border border-white/5">
                                            <MapPin size={10} /> {testimonial.venue.split(' ')[0]}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-fann-gold/20 to-transparent p-1 rounded-lg border border-fann-gold/20"
                    >
                        <div className="bg-black/60 backdrop-blur-sm rounded-lg py-16 px-8 text-center">
                            <MessageSquare className="w-12 h-12 text-fann-gold mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-white">Ready to Create Your Own Success Story?</h2>
                            <p className="max-w-2xl mx-auto text-gray-400 mb-8 text-lg">
                                Join hundreds of satisfied clients who trust FANN to deliver excellence at Dubai's biggest trade shows.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link to="/contact">
                                    <button className="bg-fann-gold text-fann-charcoal font-bold py-4 px-8 rounded-full text-sm uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-fann-gold/20 w-full sm:w-auto">
                                        Get a Free Quote
                                    </button>
                                </Link>
                                <Link to="/portfolio">
                                    <button className="border border-white/20 text-white font-bold py-4 px-8 rounded-full text-sm uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                                        View Portfolio <ArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default TestimonialsPage;
