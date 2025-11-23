import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, MapPin, Box, Check, Loader2, ArrowRight } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

const CostCalculatorPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        size: 18,
        type: 'Inline',
        location: 'Dubai',
        email: ''
    });
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const calculateCost = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCalculating(true);
        
        // Simulate API call & Calculation logic
        setTimeout(async () => {
            // Basic logic for demo purposes
            let baseRate = 1500; // AED per sqm for shell scheme/basic
            if (formData.type === 'Island') baseRate = 2500;
            if (formData.type === 'Peninsula') baseRate = 2200;
            
            const minCost = formData.size * baseRate;
            const maxCost = minCost * 1.4;
            
            const formattedMin = new Intl.NumberFormat('en-AE').format(minCost);
            const formattedMax = new Intl.NumberFormat('en-AE').format(maxCost);
            
            setResult(`AED ${formattedMin} - ${formattedMax}`);
            setIsCalculating(false);
            setStep(4);

            // Send lead to API
            await fetch('/api/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: formData.email, 
                    magnetId: 'cost-calculator',
                    details: formData 
                })
            });

        }, 1500);
    };

    return (
        <AnimatedPage>
            <SEO title="Exhibition Stand Cost Calculator | FANN" description="Get an instant cost estimate for your exhibition stand in Dubai or Riyadh." />
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-fann-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-fann-gold border border-fann-gold/20">
                            <Calculator size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Instant Cost Estimator</h1>
                        <p className="text-gray-400 text-lg">Get a realistic budget range for your upcoming exhibition stand in under 2 minutes.</p>
                    </div>

                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
                        {step === 4 && result ? (
                            <div className="text-center py-8">
                                <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">Estimated Budget Range</h3>
                                <div className="text-5xl md:text-6xl font-serif text-fann-gold mb-8">{result}</div>
                                <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                                    This estimate includes design, fabrication, and installation. The final cost depends on specific materials and AV requirements.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link to="/book-consultation" className="btn-gold">Book Free Consultation</Link>
                                    <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white py-3 text-sm">Start Over</button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={calculateCost}>
                                {/* Step 1: Size */}
                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <h3 className="text-2xl font-serif mb-6">1. What is your booth size?</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[9, 18, 36, 54].map(s => (
                                                <button 
                                                    key={s} 
                                                    type="button" 
                                                    onClick={() => setFormData({...formData, size: s})}
                                                    className={`p-6 border rounded-xl text-center transition-all ${formData.size === s ? 'border-fann-gold bg-fann-gold/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                                                >
                                                    <span className="block text-2xl font-bold mb-1">{s} sqm</span>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-xs text-gray-500 uppercase mb-2">Or enter custom size (sqm)</label>
                                            <input 
                                                type="number" 
                                                value={formData.size} 
                                                onChange={(e) => setFormData({...formData, size: parseInt(e.target.value) || 0})}
                                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3"
                                            />
                                        </div>
                                        <button type="button" onClick={() => setStep(2)} className="btn-gold w-full mt-6">Next Step</button>
                                    </motion.div>
                                )}

                                {/* Step 2: Configuration */}
                                {step === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <h3 className="text-2xl font-serif mb-6">2. Booth Configuration</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {['Inline (1 side open)', 'Corner (2 sides open)', 'Peninsula (3 sides open)', 'Island (4 sides open)'].map(type => (
                                                <button 
                                                    key={type} 
                                                    type="button" 
                                                    onClick={() => setFormData({...formData, type: type.split(' ')[0]})}
                                                    className={`p-4 border rounded-xl text-left transition-all flex justify-between items-center ${formData.type === type.split(' ')[0] ? 'border-fann-gold bg-fann-gold/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                                                >
                                                    <span>{type}</span>
                                                    {formData.type === type.split(' ')[0] && <Check size={18} className="text-fann-gold"/>}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-4 mt-6">
                                            <button type="button" onClick={() => setStep(1)} className="text-gray-500 px-4">Back</button>
                                            <button type="button" onClick={() => setStep(3)} className="btn-gold flex-1">Next Step</button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Final & Email */}
                                {step === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <h3 className="text-2xl font-serif mb-4">3. Get Your Estimate</h3>
                                        <p className="text-gray-400 text-sm mb-6">Enter your email to unlock the calculated estimate range and receive a detailed breakdown.</p>
                                        
                                        <div>
                                            <label className="block text-xs text-gray-500 uppercase mb-2">Location</label>
                                            <select 
                                                value={formData.location} 
                                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white mb-4"
                                            >
                                                <option value="Dubai">Dubai (UAE)</option>
                                                <option value="Abu Dhabi">Abu Dhabi (UAE)</option>
                                                <option value="Riyadh">Riyadh (KSA)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-500 uppercase mb-2">Business Email</label>
                                            <input 
                                                type="email" 
                                                required 
                                                placeholder="name@company.com"
                                                value={formData.email} 
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-fann-gold focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex gap-4 mt-6">
                                            <button type="button" onClick={() => setStep(2)} className="text-gray-500 px-4">Back</button>
                                            <button 
                                                type="submit" 
                                                disabled={isCalculating || !formData.email} 
                                                className="btn-gold flex-1 flex items-center justify-center gap-2"
                                            >
                                                {isCalculating ? <Loader2 className="animate-spin" /> : <ArrowRight size={18} />}
                                                Calculate Now
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default CostCalculatorPage;