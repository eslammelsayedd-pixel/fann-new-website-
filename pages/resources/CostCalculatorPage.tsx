
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, DollarSign, MapPin, Box, Check, Loader2, ArrowRight, AlertTriangle, Info, PieChart, Download, Share2, RotateCcw, Mail, User, Phone, Building } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';

// --- Types ---
interface CostState {
    step: number;
    standType: 'Shell Scheme' | 'Custom-Built' | 'Premium/Luxury';
    dimensions: { length: number; width: number; height: number };
    location: string;
    duration: string;
    configuration: 'Island' | 'Peninsula' | 'Corner' | 'Inline';
    features: string[];
    contact: {
        name: string;
        email: string;
        phone: string;
        company: string;
        eventName: string;
    };
}

// --- Constants ---
const locations = [
    "Dubai World Trade Centre (DWTC)",
    "Dubai Expo City",
    "ADNEC Abu Dhabi",
    "Riyadh Front Exhibition Center",
    "Jeddah JCFE",
    "Other GCC"
];

const durations = ["1 day", "2-3 days", "4-5 days", "1 week+"];

const featuresList = [
    { id: "Reception Desk", price: 2500, label: "Reception Desk (+AED 2,500)" },
    { id: "Storage Room", price: 3500, label: "Storage Room (+AED 3,500)" },
    { id: "Meeting Room", price: 6000, label: "Meeting Room (+AED 6,000)" },
    { id: "LED Video Wall", price: 7200, label: "LED Video Wall (6sqm) (+AED 7,200)" }, // Assumed 6sqm @ 1200
    { id: "Premium Flooring", price: 150, label: "Premium Flooring (+AED 150/sqm)", perSqm: true },
    { id: "Hanging Structure", price: 5500, label: "Hanging Structure (+AED 5,500)" },
    { id: "Premium Lighting", price: 3800, label: "Premium Lighting (+AED 3,800)" },
    { id: "Audio System", price: 2800, label: "Audio System (+AED 2,800)" },
    { id: "Furniture Package", price: 1800, label: "Furniture Package (+AED 1,800)" },
    { id: "WiFi Setup", price: 1500, label: "WiFi Setup (+AED 1,500)" },
];

const CostCalculatorPage: React.FC = () => {
    // --- State ---
    const [state, setState] = useState<CostState>({
        step: 1,
        standType: 'Custom-Built',
        dimensions: { length: 6, width: 3, height: 3 },
        location: locations[0],
        duration: durations[1],
        configuration: 'Inline',
        features: [],
        contact: { name: '', email: '', phone: '', company: '', eventName: '' }
    });

    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    // --- Helpers ---
    const totalSqm = state.dimensions.length * state.dimensions.width;
    
    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, [e.target.name]: parseFloat(e.target.value) }
        }));
    };

    const toggleFeature = (id: string) => {
        setState(prev => ({
            ...prev,
            features: prev.features.includes(id)
                ? prev.features.filter(f => f !== id)
                : [...prev.features, id]
        }));
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState(prev => ({
            ...prev,
            contact: { ...prev.contact, [e.target.name]: e.target.value }
        }));
    };

    const calculateCost = async () => {
        if (!state.contact.name || !state.contact.email || !state.contact.phone) {
            setError("Please fill in all required contact fields.");
            return;
        }
        
        setIsCalculating(true);
        setError(null);

        try {
            const response = await fetch('/api/calculate-stand-cost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state),
            });

            if (!response.ok) throw new Error("Calculation failed");
            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsCalculating(false);
        }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(val);

    return (
        <AnimatedPage>
            <SEO title="Exhibition Cost Calculator Dubai | FANN" description="Calculate accurate exhibition stand costs for DWTC, ADNEC, and Riyadh Front based on 2025 market rates." />
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Stand Cost Estimator</h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Based on 2025 market rates for Dubai & KSA. Get a precise breakdown including hidden fees.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Steps */}
                        <div className="lg:col-span-2 bg-fann-charcoal-light border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                            
                            {/* Progress */}
                            <div className="flex gap-2 mb-8">
                                {[1, 2, 3, 4].map(s => (
                                    <div key={s} className={`h-1 flex-1 rounded-full ${state.step >= s ? 'bg-fann-gold' : 'bg-white/10'}`} />
                                ))}
                            </div>

                            {/* Step 1: Specs */}
                            {state.step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif text-white">Stand Specifications</h2>
                                    
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-4">Stand Type</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {['Shell Scheme', 'Custom-Built', 'Premium/Luxury'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setState(prev => ({ ...prev, standType: type as any }))}
                                                    className={`p-4 border rounded-lg text-center transition-all ${state.standType === type ? 'border-fann-gold bg-fann-gold/10 text-fann-gold' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                                                >
                                                    <span className="font-bold text-sm">{type}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-4">Dimensions (Meters)</label>
                                        <div className="grid grid-cols-3 gap-6">
                                            <div>
                                                <span className="block text-sm mb-2 text-gray-300 font-medium">Width: {state.dimensions.width}m</span>
                                                <input type="range" name="width" min="3" max="30" value={state.dimensions.width} onChange={handleDimensionChange} className="w-full accent-fann-gold" />
                                            </div>
                                            <div>
                                                <span className="block text-sm mb-2 text-gray-300 font-medium">Length: {state.dimensions.length}m</span>
                                                <input type="range" name="length" min="3" max="30" value={state.dimensions.length} onChange={handleDimensionChange} className="w-full accent-fann-gold" />
                                            </div>
                                            <div>
                                                <span className="block text-sm mb-2 text-gray-300 font-medium">Height: {state.dimensions.height}m</span>
                                                <input type="range" name="height" min="2.5" max="8" step="0.5" value={state.dimensions.height} onChange={handleDimensionChange} className="w-full accent-fann-gold" />
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-white/5 p-3 rounded flex justify-between items-center">
                                            <span className="text-sm text-gray-300">Total Area</span>
                                            <span className="text-xl font-bold text-fann-gold">{totalSqm} sqm</span>
                                        </div>
                                        {totalSqm > 500 && (
                                            <p className="text-xs text-red-400 mt-2 flex items-center gap-2"><AlertTriangle size={12}/> Large stands require structural engineer consultation.</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <button onClick={() => setState(prev => ({ ...prev, step: 2 }))} className="btn-gold">Next Step</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Config & Location */}
                            {state.step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif text-white">Context & Config</h2>

                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-4">Configuration</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { id: 'Island', sides: 4, label: 'Island' },
                                                { id: 'Peninsula', sides: 3, label: 'Peninsula' },
                                                { id: 'Corner', sides: 2, label: 'Corner' },
                                                { id: 'Inline', sides: 1, label: 'Inline' }
                                            ].map(c => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => setState(prev => ({ ...prev, configuration: c.id as any }))}
                                                    className={`p-4 border rounded-lg text-center transition-all ${state.configuration === c.id ? 'border-fann-gold bg-fann-gold/10 text-fann-gold' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                                                >
                                                    <Box className="mx-auto mb-2" size={20} />
                                                    <div className="font-bold text-sm">{c.label}</div>
                                                    <div className="text-[10px] text-gray-500">{c.sides} Side Open</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Location</label>
                                            <select 
                                                value={state.location}
                                                onChange={(e) => setState(prev => ({...prev, location: e.target.value}))}
                                                className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-fann-gold outline-none"
                                            >
                                                {locations.map(l => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Event Duration</label>
                                            <select 
                                                value={state.duration}
                                                onChange={(e) => setState(prev => ({...prev, duration: e.target.value}))}
                                                className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-fann-gold outline-none"
                                            >
                                                {durations.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <button onClick={() => setState(prev => ({ ...prev, step: 1 }))} className="text-gray-400 hover:text-white font-medium">Back</button>
                                        <button onClick={() => setState(prev => ({ ...prev, step: 3 }))} className="btn-gold">Next Step</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Features */}
                            {state.step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif text-white">Add-ons & Features</h2>
                                    
                                    <div className="grid md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {featuresList.map(f => (
                                            <button
                                                key={f.id}
                                                onClick={() => toggleFeature(f.id)}
                                                className={`flex items-center justify-between p-4 border rounded-lg text-left transition-all ${state.features.includes(f.id) ? 'border-fann-gold bg-fann-gold/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}`}
                                            >
                                                <span className="text-sm font-medium">{f.label}</span>
                                                {state.features.includes(f.id) && <Check size={16} className="text-fann-gold" />}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex justify-between">
                                        <button onClick={() => setState(prev => ({ ...prev, step: 2 }))} className="text-gray-400 hover:text-white font-medium">Back</button>
                                        <button onClick={() => setState(prev => ({ ...prev, step: 4 }))} className="btn-gold">Next Step</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Contact */}
                            {state.step === 4 && !result && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif text-white">Where should we send the detailed breakdown?</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 text-gray-500" size={16}/>
                                                <input type="text" name="name" placeholder="Full Name *" value={state.contact.name} onChange={handleContactChange} className="w-full pl-10 bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-fann-gold outline-none placeholder-gray-500"/>
                                            </div>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-3 text-gray-500" size={16}/>
                                                <input type="text" name="company" placeholder="Company Name *" value={state.contact.company} onChange={handleContactChange} className="w-full pl-10 bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-fann-gold outline-none placeholder-gray-500"/>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 text-gray-500" size={16}/>
                                                <input type="email" name="email" placeholder="Work Email *" value={state.contact.email} onChange={handleContactChange} className="w-full pl-10 bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-fann-gold outline-none placeholder-gray-500"/>
                                            </div>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 text-gray-500" size={16}/>
                                                <input type="text" name="phone" placeholder="Phone Number *" value={state.contact.phone} onChange={handleContactChange} className="w-full pl-10 bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-fann-gold outline-none placeholder-gray-500"/>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input type="text" name="eventName" placeholder="Event Name (Optional)" value={state.contact.eventName} onChange={handleContactChange} className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white focus:border-fann-gold outline-none placeholder-gray-500"/>
                                        </div>
                                    </div>

                                    {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{error}</div>}

                                    <div className="flex justify-between items-center pt-4">
                                        <button onClick={() => setState(prev => ({ ...prev, step: 3 }))} className="text-gray-400 hover:text-white font-medium">Back</button>
                                        <button onClick={calculateCost} disabled={isCalculating} className="btn-gold flex items-center gap-2 px-8 py-4">
                                            {isCalculating ? <Loader2 className="animate-spin"/> : <Calculator size={18}/>} Calculate Now
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Result View */}
                            {result && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div className="text-center">
                                        <h3 className="text-gray-400 uppercase tracking-widest text-xs mb-2">Estimated Budget Range</h3>
                                        <div className="text-4xl md:text-5xl font-mono font-bold text-fann-gold mb-2">
                                            {formatCurrency(result.estimatedCost.min)} - {formatCurrency(result.estimatedCost.max)}
                                        </div>
                                        <p className="text-xs text-gray-500">*Includes structure, labor, logistics, and hidden venue fees.</p>
                                    </div>

                                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                        <h4 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Cost Breakdown (Average)</h4>
                                        <div className="space-y-3 text-sm">
                                            {result.breakdown.map((item: any, i: number) => (
                                                <div key={i} className="flex justify-between">
                                                    <span className="text-gray-300">{item.category}</span>
                                                    <span className="font-mono text-fann-gold">{formatCurrency(item.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl">
                                        <h4 className="text-red-400 text-sm font-bold mb-2 flex items-center gap-2"><Info size={16}/> Hidden Venue Costs Included</h4>
                                        <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                                            {result.hiddenCosts.map((cost: string, i: number) => (
                                                <li key={i}>{cost}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={() => window.print()} className="flex-1 border border-white/20 hover:bg-white/5 rounded-lg py-3 text-sm font-bold text-white transition-colors">Print / PDF</button>
                                        <button onClick={() => { setResult(null); setState(prev => ({ ...prev, step: 1 })); }} className="flex-1 bg-fann-gold text-black rounded-lg py-3 text-sm font-bold hover:bg-white transition-colors">Start Over</button>
                                    </div>
                                </motion.div>
                            )}

                        </div>

                        {/* Right Column: Summary */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-fann-charcoal-light border border-white/10 rounded-xl p-6">
                                <h3 className="text-fann-gold font-bold uppercase tracking-widest text-xs mb-4">Project Summary</h3>
                                <ul className="space-y-4 text-sm">
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-gray-400">Dimensions</span>
                                        <span className="text-white font-medium">{state.dimensions.length}x{state.dimensions.width}m ({totalSqm}m²)</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-gray-400">Type</span>
                                        <span className="text-white font-medium">{state.standType}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-gray-400">Location</span>
                                        <span className="text-right text-white font-medium">{state.location.split('(')[0]}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-gray-400">Features</span>
                                        <span className="text-right text-white font-medium">{state.features.length} Selected</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-xl">
                                <h3 className="text-blue-400 font-bold mb-2 text-sm flex items-center gap-2"><Info size={16}/> Why this tool?</h3>
                                <p className="text-xs text-gray-300 leading-relaxed">
                                    Most online calculators ignore venue-specific hidden fees like rigging permits and waste disposal. Our engine uses real 2025 data from DWTC & ADNEC to give you a realistic budget, not just a construction quote.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default CostCalculatorPage;
