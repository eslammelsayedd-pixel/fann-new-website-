
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BarChart2, CheckCircle, Download, Loader2, Sparkles, 
    TrendingUp, Users, Target, Briefcase, Calculator, 
    AlertTriangle, RefreshCcw, ChevronRight, DollarSign 
} from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';
import { regionalEvents } from '../constants';

// --- Types ---

interface ROIMetrics {
    net_profit: number;
    roi_percentage: number;
    payback_period_months: number;
    cost_per_lead: number;
    cost_per_acquisition: number;
    break_even_deals: number;
}

interface ROIModel {
    cash_roi: ROIMetrics;
    pipeline_roi: { projected_value: number; ltv_impact: number };
    brand_roi: { impressions: number; media_value: number };
    network_roi: { partnership_value: number };
}

interface ScenarioData {
    label: string;
    metrics: ROIModel;
    probability: number;
}

interface AnalysisResult {
    scenarios: {
        conservative: ScenarioData;
        realistic: ScenarioData;
        optimistic: ScenarioData;
    };
    benchmarks: {
        industry_avg_cpl: number;
        industry_avg_conversion: number;
        verdict: string;
    };
    strategic_advice: string[];
}

interface FormData {
    // Event Context
    event_name: string;
    industry: string;
    duration_days: number;
    
    // Financials (Investment)
    stand_cost: number;
    staff_cost: number;
    marketing_cost: number;
    logistics_cost: number;
    
    // Performance (Goals/Actuals)
    visitors_expected: number;
    leads_expected: number;
    
    // Sales Data
    avg_deal_value: number;
    close_rate_percent: number;
    sales_cycle_months: number;
    customer_ltv: number;
}

const initialFormData: FormData = {
    event_name: '',
    industry: 'Technology',
    duration_days: 3,
    stand_cost: 75000,
    staff_cost: 15000,
    marketing_cost: 10000,
    logistics_cost: 5000,
    visitors_expected: 500,
    leads_expected: 150,
    avg_deal_value: 25000,
    close_rate_percent: 10,
    sales_cycle_months: 3,
    customer_ltv: 50000
};

const eventOptions = [...new Set(regionalEvents.map(e => e.name))].sort();
const industries = ["Technology", "Real Estate", "Healthcare", "Energy", "Construction", "Retail", "Finance", "Automotive"];

const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(value);

const ROICalculatorPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [activeScenario, setActiveScenario] = useState<'conservative' | 'realistic' | 'optimistic'>('realistic');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [leadForm, setLeadForm] = useState({ name: '', email: '', company: '' });
    const [isDownloading, setIsDownloading] = useState(false);

    const totalInvestment = formData.stand_cost + formData.staff_cost + formData.marketing_cost + formData.logistics_cost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);
        setFormData(prev => ({
            ...prev,
            [name]: isNaN(numValue) ? value : numValue
        }));
    };

    const handleCalculate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/calculate-roi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, total_investment: totalInvestment }),
            });
            
            if (!response.ok) throw new Error("Calculation failed");
            const data = await response.json();
            setResults(data);
            setStep(4); // Move to results
        } catch (e: any) {
            setError(e.message || "Failed to calculate ROI");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadReport = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDownloading(true);
        try {
            const response = await fetch('/api/generate-roi-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roiData: results, userData: leadForm, inputs: formData }),
            });
            const { htmlContent } = await response.json();
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `FANN_ROI_Report_${formData.event_name.replace(/\s/g, '_')}.html`;
            a.click();
        } catch (e) {
            console.error(e);
        } finally {
            setIsDownloading(false);
        }
    };

    // --- Render Components ---

    const MetricCard = ({ label, value, subtext, color = "text-white" }: { label: string, value: string, subtext?: string, color?: string }) => (
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">{label}</p>
            <p className={`text-2xl font-bold font-serif ${color}`}>{value}</p>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
    );

    const renderFormStep = () => {
        switch(step) {
            case 1: // Financials
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Event Name</label>
                                <input type="text" list="events" name="event_name" value={formData.event_name} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-3 text-white focus:border-fann-gold outline-none placeholder-gray-500" placeholder="e.g. GITEX" />
                                <datalist id="events">{eventOptions.map(e => <option key={e} value={e}/>)}</datalist>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Industry</label>
                                <select name="industry" value={formData.industry} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-3 text-white focus:border-fann-gold outline-none">
                                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-fann-gold text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Calculator size={16}/> Investment Breakdown (AED)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs text-gray-400 font-medium block mb-1">Stand Design & Build</label><input type="number" name="stand_cost" value={formData.stand_cost} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-2 text-white"/></div>
                                <div><label className="text-xs text-gray-400 font-medium block mb-1">Staff & Travel</label><input type="number" name="staff_cost" value={formData.staff_cost} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-2 text-white"/></div>
                                <div><label className="text-xs text-gray-400 font-medium block mb-1">Marketing & Promo</label><input type="number" name="marketing_cost" value={formData.marketing_cost} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-2 text-white"/></div>
                                <div><label className="text-xs text-gray-400 font-medium block mb-1">Logistics & Misc</label><input type="number" name="logistics_cost" value={formData.logistics_cost} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-2 text-white"/></div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-sm text-gray-300">Total Estimated Investment</span>
                                <span className="text-xl font-bold text-white">{formatCurrency(totalInvestment)}</span>
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full btn-gold">Next: Performance Metrics</button>
                    </motion.div>
                );
            case 2: // Performance
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Target Visitors (Footfall)</label>
                                <input type="number" name="visitors_expected" value={formData.visitors_expected} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-3 text-white focus:border-fann-gold outline-none"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Target Leads Generated</label>
                                <input type="number" name="leads_expected" value={formData.leads_expected} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-3 text-white focus:border-fann-gold outline-none"/>
                            </div>
                        </div>
                        <div className="bg-blue-900/10 border border-blue-500/30 p-4 rounded-xl flex items-start gap-3">
                            <Target className="text-blue-400 flex-shrink-0 mt-1" size={18}/>
                            <p className="text-xs text-gray-300 leading-relaxed">Tip: For a standard 3-day Dubai trade show, a 30sqm stand typically captures 150-300 qualified leads depending on location and engagement strategy.</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 text-gray-400 font-medium hover:text-white">Back</button>
                            <button onClick={() => setStep(3)} className="flex-1 btn-gold">Next: Sales Data</button>
                        </div>
                    </motion.div>
                );
            case 3: // Sales
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Avg. Deal Value (AED)</label>
                                <input type="number" name="avg_deal_value" value={formData.avg_deal_value} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-3 text-white focus:border-fann-gold outline-none"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Sales Close Rate (%)</label>
                                <input type="number" name="close_rate_percent" value={formData.close_rate_percent} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-3 text-white focus:border-fann-gold outline-none"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Sales Cycle (Months)</label>
                                <input type="number" name="sales_cycle_months" value={formData.sales_cycle_months} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-3 text-white focus:border-fann-gold outline-none"/>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2 font-medium">Customer LTV (AED)</label>
                                <input type="number" name="customer_ltv" value={formData.customer_ltv} onChange={handleInputChange} className="w-full bg-black/30 border border-white/20 rounded p-3 text-white focus:border-fann-gold outline-none"/>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="flex-1 text-gray-400 font-medium hover:text-white">Back</button>
                            <button onClick={handleCalculate} disabled={isLoading} className="flex-1 btn-gold flex justify-center items-center gap-2">
                                {isLoading ? <Loader2 className="animate-spin"/> : <Sparkles size={18}/>} Run Simulation
                            </button>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    const activeMetrics = results?.scenarios[activeScenario].metrics;

    return (
        <AnimatedPage>
            <SEO title="Exhibition ROI Intelligence Engine | FANN" description="Advanced multi-model ROI calculator for Dubai exhibitions. Simulate financial, brand, and network returns." />
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center mb-12">
                        <span className="text-fann-gold text-xs font-bold uppercase tracking-widest border border-fann-gold/20 px-3 py-1 rounded-full bg-fann-gold/5 mb-4 inline-block">Financial Intelligence</span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">ROI Engine</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Simulate the financial impact of your next exhibition with our multi-model analysis tool.
                        </p>
                    </div>

                    {step < 4 ? (
                        <div className="max-w-2xl mx-auto bg-fann-charcoal-light border border-white/10 p-8 rounded-2xl shadow-2xl">
                            <div className="flex gap-2 mb-8">
                                {[1, 2, 3].map(s => (
                                    <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-fann-gold' : 'bg-white/10'}`}/>
                                ))}
                            </div>
                            {renderFormStep()}
                        </div>
                    ) : (
                        // Results Dashboard
                        results && activeMetrics && (
                            <div className="max-w-7xl mx-auto space-y-8">
                                
                                {/* Scenario Controller */}
                                <div className="bg-fann-charcoal-light border border-white/10 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 sticky top-24 z-40 shadow-2xl backdrop-blur-md bg-opacity-90">
                                    <div className="flex gap-2 bg-black/50 p-1 rounded-lg">
                                        {['conservative', 'realistic', 'optimistic'].map((s) => (
                                            <button 
                                                key={s}
                                                onClick={() => setActiveScenario(s as any)}
                                                className={`px-6 py-2 rounded-md text-sm font-bold uppercase transition-all ${activeScenario === s ? 'bg-fann-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Projected Net Profit</p>
                                        <p className={`text-3xl font-bold font-serif ${activeMetrics.cash_roi.net_profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {formatCurrency(activeMetrics.cash_roi.net_profit)}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-3 gap-8">
                                    {/* Left: Financial Core */}
                                    <div className="lg:col-span-2 space-y-8">
                                        
                                        {/* 4-Pillar Grid */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="bg-fann-charcoal-light p-6 rounded-xl border border-white/10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-2 bg-green-900/20 rounded-lg text-green-400"><DollarSign size={20}/></div>
                                                    <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400 font-bold">Immediate</span>
                                                </div>
                                                <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-1">Cash ROI</h3>
                                                <p className="text-3xl font-bold text-white mb-2">{activeMetrics.cash_roi.roi_percentage}%</p>
                                                <p className="text-xs text-gray-400">Break-even: {activeMetrics.cash_roi.break_even_deals} Deals</p>
                                            </div>

                                            <div className="bg-fann-charcoal-light p-6 rounded-xl border border-white/10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400"><TrendingUp size={20}/></div>
                                                    <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400 font-bold">Long Term</span>
                                                </div>
                                                <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-1">Pipeline Value</h3>
                                                <p className="text-3xl font-bold text-white mb-2">{formatCurrency(activeMetrics.pipeline_roi.projected_value)}</p>
                                                <p className="text-xs text-gray-400">Over {formData.sales_cycle_months} months</p>
                                            </div>

                                            <div className="bg-fann-charcoal-light p-6 rounded-xl border border-white/10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400"><Users size={20}/></div>
                                                    <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400 font-bold">Soft Value</span>
                                                </div>
                                                <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-1">Brand Equity</h3>
                                                <p className="text-3xl font-bold text-white mb-2">{formatCurrency(activeMetrics.brand_roi.media_value)}</p>
                                                <p className="text-xs text-gray-400">Based on {activeMetrics.brand_roi.impressions.toLocaleString()} impressions</p>
                                            </div>

                                            <div className="bg-fann-charcoal-light p-6 rounded-xl border border-white/10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-2 bg-fann-gold/20 rounded-lg text-fann-gold"><Briefcase size={20}/></div>
                                                    <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400 font-bold">Strategic</span>
                                                </div>
                                                <h3 className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-1">Network Value</h3>
                                                <p className="text-3xl font-bold text-white mb-2">{formatCurrency(activeMetrics.network_roi.partnership_value)}</p>
                                                <p className="text-xs text-gray-400">Projected partnership equity</p>
                                            </div>
                                        </div>

                                        {/* Efficiency Metrics */}
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                            <h3 className="text-white font-bold mb-6 flex items-center gap-2"><BarChart2 size={18} className="text-fann-gold"/> Efficiency Ratios</h3>
                                            <div className="grid md:grid-cols-3 gap-6">
                                                <MetricCard label="Cost Per Lead (CPL)" value={formatCurrency(activeMetrics.cash_roi.cost_per_lead)} />
                                                <MetricCard label="Cost Per Acquisition" value={formatCurrency(activeMetrics.cash_roi.cost_per_acquisition)} />
                                                <MetricCard label="Payback Period" value={`${activeMetrics.cash_roi.payback_period_months} Mo`} />
                                            </div>
                                        </div>

                                        {/* Benchmark Analysis */}
                                        <div className="bg-fann-charcoal-light border border-white/10 rounded-xl p-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-20"><Target size={64}/></div>
                                            <h3 className="text-white font-bold mb-4">Industry Benchmark: {formData.industry}</h3>
                                            <p className="text-gray-300 mb-4">{results.benchmarks.verdict}</p>
                                            <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mb-1">
                                                <div 
                                                    className={`h-full rounded-full ${activeMetrics.cash_roi.cost_per_lead < results.benchmarks.industry_avg_cpl ? 'bg-green-500' : 'bg-red-500'}`} 
                                                    style={{ width: `${Math.min((results.benchmarks.industry_avg_cpl / activeMetrics.cash_roi.cost_per_lead) * 50, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                                <span>Your CPL: {formatCurrency(activeMetrics.cash_roi.cost_per_lead)}</span>
                                                <span>Industry Avg: {formatCurrency(results.benchmarks.industry_avg_cpl)}</span>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Right: AI Consultant & Export */}
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-fann-gold/20 to-transparent border border-fann-gold/30 p-6 rounded-xl">
                                            <div className="flex items-center gap-2 mb-4 text-fann-gold">
                                                <Sparkles size={20}/>
                                                <h3 className="font-bold uppercase tracking-widest text-sm">AI Strategic Advice</h3>
                                            </div>
                                            <ul className="space-y-4">
                                                {results.strategic_advice.map((tip, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-gray-200">
                                                        <CheckCircle className="w-4 h-4 text-fann-gold flex-shrink-0 mt-1"/>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="bg-fann-charcoal-light border border-white/10 p-6 rounded-xl">
                                            <h3 className="text-white font-bold mb-4">Download Full Report</h3>
                                            <div className="space-y-3">
                                                <input type="text" placeholder="Name" className="w-full bg-black/50 border border-white/20 rounded p-2 text-sm text-white focus:border-fann-gold outline-none placeholder-gray-500" onChange={e => setLeadForm({...leadForm, name: e.target.value})} />
                                                <input type="email" placeholder="Email" className="w-full bg-black/50 border border-white/20 rounded p-2 text-sm text-white focus:border-fann-gold outline-none placeholder-gray-500" onChange={e => setLeadForm({...leadForm, email: e.target.value})} />
                                                <input type="text" placeholder="Company" className="w-full bg-black/50 border border-white/20 rounded p-2 text-sm text-white focus:border-fann-gold outline-none placeholder-gray-500" onChange={e => setLeadForm({...leadForm, company: e.target.value})} />
                                                <button onClick={handleDownloadReport} disabled={isDownloading} className="w-full btn-gold flex items-center justify-center gap-2 mt-2">
                                                    {isDownloading ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>} Export PDF
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 mx-auto font-medium">
                                                <RefreshCcw size={14}/> Start New Calculation
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ROICalculatorPage;
