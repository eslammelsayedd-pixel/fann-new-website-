import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { pricingPlans } from '../constants';
import SEO from '../components/SEO';

const PricingPage: React.FC = () => {
    return (
        <AnimatedPage>
            <SEO
                title="Pricing Plans | FANN Studio"
                description="Choose the perfect plan for your design needs. From a free trial to unlimited professional generation and full-service enterprise solutions, FANN has a plan for you."
            />
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-fann-gold mb-4">Find Your Perfect Plan</h1>
                        <p className="text-xl text-fann-cream max-w-3xl mx-auto">
                            From a single project to an unlimited subscription for your entire agency, we have a plan that fits.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`
                                    relative flex flex-col h-full bg-fann-charcoal-light rounded-lg p-6 border-2 
                                    ${plan.isPopular ? 'border-fann-gold' : 'border-fann-border'}
                                `}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-fann-gold text-fann-charcoal text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <h3 className="text-2xl font-serif font-bold text-white">{plan.name}</h3>
                                    <p className="text-fann-light-gray mt-2 text-sm h-12">{plan.description}</p>
                                    <div className="my-6">
                                        <span className="text-4xl font-bold text-fann-gold">{plan.price}</span>
                                        {plan.priceDetails && <span className="text-fann-light-gray"> / {plan.priceDetails}</span>}
                                    </div>
                                    <ul className="space-y-3 text-sm">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start">
                                                <Check className="w-4 h-4 text-fann-teal mr-3 mt-1 flex-shrink-0" />
                                                <span className="text-fann-cream">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-8">
                                    <Link to={plan.name === 'Enterprise' ? '/contact' : '#'} className={`
                                        block w-full text-center font-bold py-3 px-6 rounded-full transition-all duration-300
                                        ${plan.isPopular 
                                            ? 'bg-fann-gold text-fann-charcoal hover:opacity-90' 
                                            : 'bg-fann-teal text-white hover:bg-fann-teal/80'}
                                    `}>
                                        {plan.cta}
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default PricingPage;
