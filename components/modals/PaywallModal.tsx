import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pricingPlans } from '../../constants';
import { Sparkles, X } from 'lucide-react';

interface PaywallModalProps {
  onClose: () => void;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ onClose }) => {
  const featuredPlans = pricingPlans.filter(p => p.name === 'One-Time Package' || p.name === 'Starter' || p.name === 'Professional');

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-fann-charcoal w-full max-w-4xl rounded-lg p-8 border border-fann-border text-white relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-fann-light-gray hover:text-white">
            <X size={24} />
        </button>

        <div className="text-center">
            <Sparkles className="mx-auto w-12 h-12 text-fann-gold mb-4" />
            <h2 className="text-3xl font-serif font-bold mb-2">Unlock Unlimited Creativity</h2>
            <p className="text-fann-light-gray mb-8">You've used your 2 free generations. Choose a plan to continue designing.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            {featuredPlans.map(plan => (
                <div key={plan.name} className={`relative flex flex-col bg-fann-charcoal-light rounded-lg p-6 border-2 ${plan.isPopular ? 'border-fann-gold' : 'border-fann-border'}`}>
                    {plan.isPopular && (
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-fann-gold text-fann-charcoal text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                            Most Popular
                        </div>
                    )}
                    <div className="flex-grow">
                        <h3 className="text-xl font-serif font-bold text-white">{plan.name}</h3>
                        <div className="my-4">
                            <span className="text-3xl font-bold text-fann-gold">{plan.price}</span>
                             {plan.priceDetails && <span className="text-fann-light-gray"> / {plan.priceDetails}</span>}
                        </div>
                        <ul className="space-y-2 text-sm text-fann-cream">
                            {plan.features.slice(0, 4).map((feature, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-fann-teal mr-2 mt-1">&#10003;</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="mt-6">
                        <Link to="/pricing" className={`
                            block w-full text-center font-bold py-2 px-4 rounded-full transition-colors
                            ${plan.isPopular ? 'bg-fann-gold text-fann-charcoal' : 'bg-fann-teal text-white'}`}
                        >
                            {plan.cta}
                        </Link>
                    </div>
                </div>
            ))}
        </div>
        <div className="text-center mt-8">
            <Link to="/pricing" className="text-fann-gold font-semibold hover:underline">
                Compare all plans &rarr;
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaywallModal;
