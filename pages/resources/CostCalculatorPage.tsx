import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, DollarSign, MapPin, Box, Check, Loader2, ArrowRight, AlertTriangle, Info, PieChart, Download, Share2, RotateCcw } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

// --- Types ---
interface Dimensions {
    length: number;
    width: number;
    height: number;
}

interface LocationData {
    city: string;
    country: string;
}

interface CostState {
    step: number;
    dimensions: Dimensions;
    location: LocationData;
    duration: number;
    configuration: 'Island' | 'Peninsula' | 'Corner' | 'Inline';
    quality: 'Economy' | 'Standard' | 'Premium' | 'Luxury';
    features: string[];
}

interface CalculationResult {
    scenarios: {
        conservative: number;
        realistic: number;
        premium: number;
    };
    breakdown: Array<{
        category: string;
        amount: number;
        details: string;
    }>;
    hidden_costs: string[];
    industry_benchmark: string;
    warnings: string[];
}

// --- Constants ---
const locations: LocationData[] = [
    { city: 'Dubai', country: 'UAE' },
    { city: 'Abu Dhabi', country: 'UAE' },
    { city: 'Riyadh', country: 'KSA' },
    { city: 'Jeddah', country: 'KSA' },
    { city: 'Doha', country: 'Qatar' },
];

const featuresList = [
    "Raised Flooring (100mm)", "High-End Carpet/Laminate", "Double Decker Structure",
    "LED Video Wall (>3m wide)", "Touchscreens / Interactive", "Custom Hanging Banner",
    "Barista / Coffee Station", "VIP Lounge Furniture", "Floral & Greenery",
    "Storage Room with Lock", "High-speed Dedicated WiFi", "3D Illuminated Logo"
];

// --- Components ---

const PieChartVisual: React.FC<{ data: { category: string; amount: number }[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.amount, 0);
    let cumulativePercent = 0;

    const colors = ['#C9A962', '#B08D55', '#8C6B3D', '#5E4626', '#3D2E18', '#261C0E', '#E5C580'];

    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                {data.map((item, index) => {
                    const percent = (item.amount / total) * 100;
                    const dashArray = `${percent} ${100 - percent}`;
                    const offset = 100 - cumulativePercent;
                    cumulativePercent += percent;

                    return (
                        <circle
                            key={item.category}
                            r="40"
                            cx="50"
                            cy="50"
                            fill="transparent"
                            stroke={colors[index % colors.length]}
                            strokeWidth="20"
                            strokeDasharray={dashArray}
                            strokeDashoffset={offset}
                            className="hover:opacity-80 transition-opacity"
                        >
                            <title>{item.category}: {Math.round(percent)}%</title>
                        </circle>
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Total</span>
                    <div className="text-sm font-bold text-white font-mono">100%</div>
                </div>
            </div>
        </div>
    );
};

const CostCalculatorPage: React.FC = () => {
    // --- State ---
    const [state, setState] = useState<CostState>({
        step: 1,
        dimensions: { length: 6, width: 3, height: 4 },
        location: locations[0],
        duration: 3,
        configuration: 'Inline',
        quality: 'Standard',
        features: []
    });

    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [validationMsg, setValidationMsg] = useState<string | null>(null);

    // --- Logic ---

    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const val = parseFloat(value);
        setState(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, [name]: val }
        }));
    };

    const toggleFeature = (feature: string) => {
        setState(prev => ({
            ...prev,
            features: prev.features.includes(feature) 
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature]
        }));
    };

    // Step 1 Validation
    const validateStep1 = () => {
        const { length, width, height } = state.dimensions;
        const area = length * width;

        if (length <= 0 || width <= 0 || height <= 0) {
            setValidationMsg("Dimensions must be positive numbers.");
            return false;
        }
        if (area < 9) {
            setValidationMsg("Minimum booth size is 9 sqm (3x3m).");
            return false;
        }
        if (height > 6) {
            setValidationMsg("Warning: Heights > 6m usually require special engineering approvals. We can proceed, but costs will reflect this.");
            // Allow proceed after 2 seconds delay or user acknowledgement mechanism (simplifying to allow proceed)
        }
        if (area > 500) {
             setValidationMsg("Warning: Stands > 500sqm are classified as 'Space Only' mega-structures. Major structural costs apply.");
        }
        setValidationMsg(null);
        return true;
    };

    const nextStep = () => {
        if (state.step === 1 && !validateStep1()) return;
        setState(prev => ({ ...prev, step: prev.step + 1 }));
    };

    const calculateCost = async () => {
        setIsCalculating(true);
        setError(null);

        try {
            const response = await fetch('/api/calculate-stand-cost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state),
            });

            if (!response.ok) {
                throw new Error("Calculation failed. Please try again.");
            }

            const data = await response.json();
            setResult(data);
            setState(prev => ({ ...prev, step: 4 }));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsCalculating(false);
        }
    };

    const downloadPDF = async () => {
        try {
            const response = await fetch('/api/generate-cost-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calculation: result, inputs: state }),
            });
            const { htmlContent } = await response.json();
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `FANN_Estimate_${state.location.city}_${new Date().toISOString().split('T')[0]}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.error(e);
        }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(val);

    // --- Render ---

    return (
        <AnimatedPage>
            <SEO title="Battle-Tested Exhibition Cost Calculator | FANN" description="Get a precise, AI-powered cost breakdown for your exhibition stand in Dubai & KSA." />
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-fann-gold/10 border border-fann-gold/20 text-fann-gold text-xs uppercase tracking-widest mb-6">
                            <Calculator size={14} /> Beta 3.0 Powered
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Stand Cost Calculator</h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            A battle-tested estimator using 2025 market rates for Dubai & Riyadh. Account for hidden fees, labor, and finish quality.
                        </p>
                    </div>

                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                        
                        {/* Progress Bar */}
                        {state.step < 4 && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                                <motion.div 
                                    className="h-full bg-fann-gold" 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `${(state.step / 3) * 100}%` }} 
                                />
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            
                            {/* Step 1: Dimensions & Location */}
                            {state.step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif text-white">The Basics</h2>
                                    
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-xs text-gray-500 uppercase mb-2">Length (m)</label>
                                            <input type="number" name="length" value={state.dimensions.length} onChange={handleDimensionChange} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-fann-gold outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 uppercase mb-2">Width (m)</label>
                                            <input type="number" name="width" value={state.dimensions.width} onChange={handleDimensionChange} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-fann-gold outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 uppercase mb-2">Height (m)</label>
                                            <input type="number" name="height" value={state.dimensions.height} onChange={handleDimensionChange} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-fann-gold outline-none" />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs text-gray-500 uppercase mb-2">Location</label>
                                            <select 
                                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-fann-gold outline-none"
                                                onChange={(e) => setState(prev => ({ ...prev, location: locations.find(l => l.city === e.target.value) || locations[0] }))}
                                                value={state.location.city}
                                            >
                                                {locations.map(l => <option key={l.city} value={l.city}>{l.city}, {l.country}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 uppercase mb-2">Event Duration (Days)</label>
                                            <input type="number" min="1" max="30" value={state.duration} onChange={(e) => setState(prev => ({...prev, duration: parseInt(e.target.value)}))} className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-fann-gold outline-none" />
                                        </div>
                                    </div>

                                    {validationMsg && (
                                        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg flex gap-3 items-start text-sm">
                                            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                            {validationMsg}
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <button onClick={nextStep} className="btn-gold flex items-center gap-2">Next <ArrowRight size={16} /></button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Config & Quality */}
                            {state.step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif text-white">Structure & Finish</h2>

                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase mb-4">Configuration Type</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['Inline', 'Corner', 'Peninsula', 'Island'].map(type => (
                                                <button 
                                                    key={type} 
                                                    onClick={() => setState(prev => ({...prev, configuration: type as any}))}
                                                    className={`p-4 border rounded-xl text-center transition-all ${state.configuration === type ? 'border-fann-gold bg-fann-gold text-black font-bold' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                                                >
                                                    <Box size={24} className="mx-auto mb-2" />
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase mb-4">Quality Tier</label>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            {[
                                                { id: 'Economy', desc: 'Standard Shell / Modular', mult: '1x' },
                                                { id: 'Standard', desc: 'Custom Joinery + Graphics', mult: '1.5x' },
                                                { id: 'Premium', desc: 'High-end Paint, AV, VIP', mult: '2.5x' }
                                            ].map(q => (
                                                <button 
                                                    key={q.id} 
                                                    onClick={() => setState(prev => ({...prev, quality: q.id as any}))}
                                                    className={`p-6 border rounded-xl text-left transition-all ${state.quality === q.id ? 'border-fann-gold bg-fann-gold/10' : 'border-white/10 hover:border-white/30'}`}
                                                >
                                                    <div className={`text-lg font-bold mb-1 ${state.quality === q.id ? 'text-fann-gold' : 'text-white'}`}>{q.id}</div>
                                                    <div className="text-sm text-gray-500">{q.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <button onClick={() => setState(prev => ({ ...prev, step: 1 }))} className="text-gray-500 hover:text-white">Back</button>
                                        <button onClick={nextStep} className="btn-gold flex items-center gap-2">Next <ArrowRight size={16} /></button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Features Checklist */}
                            {state.step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <h2 className="text-2xl font-serif text-white">Features Checklist</h2>
                                    <p className="text-gray-400 text-sm">Select specific items to improve estimation accuracy.</p>

                                    <div className="grid md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {featuresList.map(f => (
                                            <button 
                                                key={f} 
                                                onClick={() => toggleFeature(f)}
                                                className={`flex items-center justify-between p-4 border rounded-lg text-sm text-left transition-all ${state.features.includes(f) ? 'border-fann-gold bg-fann-gold/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                                            >
                                                {f}
                                                {state.features.includes(f) && <Check size={16} className="text-fann-gold" />}
                                            </button>
                                        ))}
                                    </div>

                                    {error && <div className="text-red-400 text-sm text-center">{error}</div>}

                                    <div className="flex justify-between">
                                        <button onClick={() => setState(prev => ({ ...prev, step: 2 }))} className="text-gray-500 hover:text-white">Back</button>
                                        <button 
                                            onClick={calculateCost} 
                                            disabled={isCalculating}
                                            className="btn-gold flex items-center gap-2 min-w-[160px] justify-center"
                                        >
                                            {isCalculating ? <Loader2 className="animate-spin" /> : <Calculator size={18} />}
                                            Calculate
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Results */}
                            {state.step === 4 && result && (
                                <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    
                                    {/* Top: 3 Scenarios */}
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Conservative</div>
                                            <div className="text-2xl font-mono text-gray-300">{formatCurrency(result.scenarios.conservative)}</div>
                                        </div>
                                        <div className="bg-fann-gold text-black p-6 rounded-xl text-center transform scale-105 shadow-2xl relative">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-fann-gold text-[10px] uppercase font-bold px-3 py-1 rounded-full">Recommended Budget</div>
                                            <div className="text-xs uppercase tracking-widest mb-2 font-bold opacity-70">Realistic</div>
                                            <div className="text-3xl font-bold font-mono">{formatCurrency(result.scenarios.realistic)}</div>
                                        </div>
                                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Premium</div>
                                            <div className="text-2xl font-mono text-gray-300">{formatCurrency(result.scenarios.premium)}</div>
                                        </div>
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-8">
                                        {/* Left: Chart & Benchmark */}
                                        <div className="space-y-6">
                                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                                <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><PieChart size={16} /> Cost Distribution</h3>
                                                <div className="flex items-center justify-center">
                                                    <PieChartVisual data={result.breakdown.map(b => ({ category: b.category, amount: b.amount }))} />
                                                </div>
                                                <div className="mt-6 space-y-2">
                                                    {result.breakdown.map((item, i) => (
                                                        <div key={i} className="flex justify-between text-xs">
                                                            <span className="text-gray-400">{item.category}</span>
                                                            <span className="text-white font-mono">{formatCurrency(item.amount)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex gap-3 items-start">
                                                <Info className="text-blue-400 shrink-0 mt-1" size={18} />
                                                <div>
                                                    <div className="text-sm font-bold text-blue-300 mb-1">Industry Benchmark</div>
                                                    <p className="text-xs text-blue-200/70">{result.industry_benchmark}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Details & Hidden Costs */}
                                        <div className="space-y-6">
                                            {result.warnings.length > 0 && (
                                                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl">
                                                    <h4 className="text-red-400 text-sm font-bold mb-2 flex items-center gap-2"><AlertTriangle size={16} /> Critical Warnings</h4>
                                                    <ul className="list-disc list-inside text-xs text-red-200/80 space-y-1">
                                                        {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                                <h3 className="text-sm font-bold text-white mb-4">Detailed Breakdown</h3>
                                                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                                    {result.breakdown.map((item, i) => (
                                                        <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                                                            <div className="flex justify-between mb-1">
                                                                <span className="text-sm font-bold text-white">{item.category}</span>
                                                                <span className="text-sm text-fann-gold">{formatCurrency(item.amount)}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">{item.details}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Potential Hidden Costs</h3>
                                                <ul className="space-y-2">
                                                    {result.hidden_costs.map((cost, i) => (
                                                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                            <span className="text-fann-gold">•</span> {cost}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
                                        <button onClick={downloadPDF} className="flex-1 bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                            <Download size={18} /> Download PDF Report
                                        </button>
                                        <button onClick={() => setState(prev => ({ ...prev, step: 1 }))} className="px-6 py-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-gray-400 flex items-center justify-center gap-2">
                                            <RotateCcw size={18} /> New
                                        </button>
                                    </div>

                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default CostCalculatorPage;