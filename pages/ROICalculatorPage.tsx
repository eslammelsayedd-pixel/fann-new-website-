import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, BarChart2, CheckCircle, Download, Loader2, Sparkles, TrendingUp, Users, Target } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';
import { regionalEvents } from '../constants';

const eventOptions = [...new Set(regionalEvents.map(e => e.name))].sort();

interface FormData {
    company_name: string;
    event_name: string;
    booth_size_sqm: number;
    stand_cost: number;
    average_deal_size: number;
    close_rate: number;
}

interface LeadData {
    name: string;
    email: string;
    company: string;
}

const initialFormData: FormData = {
    company_name: '',
    event_name: '',
    booth_size_sqm: 50,
    stand_cost: 75000,
    average_deal_size: 50000,
    close_rate: 20,
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);


const ROICalculatorPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [leadData, setLeadData] = useState<LeadData>({ name: '', email: '', company: '' });
    const [results, setResults] = useState<any | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // FIX: Replaced NodeJS.Timeout with number, which is the correct return type for setTimeout in a browser environment.
    const analysisTimeoutRef = useRef<number | null>(null);
    const recalcTimeoutRef = useRef<number | null>(null);


    const runCalculation = useCallback(async (data: FormData, isAnalysis: boolean) => {
        if (isAnalysis) {
            setIsAnalyzing(true);
        } else {
            setIsRecalculating(true);
        }
        setError(null);
        if(!isAnalysis) setIsDownloaded(false);

        try {
            const payload = isAnalysis 
                ? { company_name: data.company_name, event_name: data.event_name, initial_analysis: true }
                : { ...data, initial_analysis: false };

            const response = await fetch('/api/calculate-roi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                 const errText = await response.text();
                let errMessage = `Server responded with status ${response.status}`;
                try {
                    const err = JSON.parse(errText);
                    errMessage = err.error || errText;
                } catch(e) { errMessage = errText; }
                throw new Error(errMessage);
            }
            
            const resultData = await response.json();
            
            if (isAnalysis && resultData.suggestions) {
                setFormData(prev => ({...prev, ...resultData.suggestions}));
                setLeadData(prev => ({...prev, company: data.company_name}));
                setSuggestionsLoaded(true);
            }
            setResults(resultData.results);

        } catch (e: any) {
            setError(e.message);
            setResults(null);
            if(isAnalysis) setSuggestionsLoaded(false);
        } finally {
             if (isAnalysis) {
                setIsAnalyzing(false);
            } else {
                setIsRecalculating(false);
            }
        }
    }, []);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumeric = !['company_name', 'event_name'].includes(name);
        setFormData(prev => ({
            ...prev,
            [name]: isNumeric ? Number(value) : value
        }));
    };
    
    // Effect for AI analysis on company/event name change
    useEffect(() => {
        if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
        
        analysisTimeoutRef.current = window.setTimeout(() => {
            if (formData.company_name.trim().length > 2 && formData.event_name.trim().length > 2) {
                runCalculation(formData, true);
            }
        }, 1500); // 1.5s debounce

        return () => {
            if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
        };
    }, [formData.company_name, formData.event_name, runCalculation]);

    // Effect for recalculation on numeric field changes
    const { booth_size_sqm, stand_cost, average_deal_size, close_rate } = formData;
    useEffect(() => {
        if (!results) return; // Don't recalc if there are no initial results

        if (recalcTimeoutRef.current) clearTimeout(recalcTimeoutRef.current);

        recalcTimeoutRef.current = window.setTimeout(() => {
            runCalculation(formData, false);
        }, 800); // 0.8s debounce

        return () => {
             if (recalcTimeoutRef.current) clearTimeout(recalcTimeoutRef.current);
        };
    }, [booth_size_sqm, stand_cost, average_deal_size, close_rate, runCalculation, results]);


    const handleLeadInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLeadData(prev => ({...prev, [name]: value }));
    };

    const handleDownloadReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadData.name || !leadData.email || !leadData.company) {
            setError("Please fill in all fields to download the report.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
            setError("Please enter a valid email address.");
            return;
        }
        
        setError(null);
        setIsDownloading(true);

        try {
            const response = await fetch('/api/generate-roi-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roiData: results, userData: leadData }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Failed to generate the report.");
            }

            const { htmlContent } = await response.json();
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `FANN_ROI_Analysis_${formData.company_name.replace(/\s/g, '_')}_${formData.event_name.replace(/\s/g, '_')}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setIsDownloaded(true);

        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsDownloading(false);
        }
    };
    
    return (
        <AnimatedPage>
            <SEO
                title="Personalized Exhibition ROI Calculator"
                description="Get hyper-personalized ROI projections for major Dubai & KSA exhibitions. Our AI-powered calculator analyzes your company and event to provide a data-driven forecast."
            />
            <div className="min-h-screen bg-fann-teal pt-32 pb-20 text-fann-peach">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <BarChart2 className="mx-auto h-16 w-16 text-fann-accent-peach" />
                        <h1 className="text-5xl font-serif font-bold text-fann-accent-peach mt-4 mb-4">Exhibition ROI Calculator</h1>
                        <p className="text-xl text-fann-peach/90 max-w-3xl mx-auto">
                           From generic estimates to hyper-personalized forecasts. Tell us who you are and where you're going.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {/* Input Form */}
                        <div className="bg-fann-teal-dark p-6 rounded-lg space-y-6 self-start">
                            <h2 className="text-2xl font-serif font-bold text-fann-peach border-b border-fann-border pb-3">Your Event Details</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="company_name" className="block text-sm font-medium text-fann-light-gray mb-2">Company Name</label>
                                    <input type="text" id="company_name" name="company_name" placeholder="Your Company Name" value={formData.company_name} onChange={handleInputChange} required className="w-full bg-fann-teal border border-fann-border rounded-md px-3 py-2" />
                                </div>
                                <div>
                                    <label htmlFor="event_name" className="block text-sm font-medium text-fann-light-gray mb-2">Event Name</label>
                                    <input type="text" id="event_name" name="event_name" list="event-options" placeholder="e.g., GITEX Global" value={formData.event_name} onChange={handleInputChange} required className="w-full bg-fann-teal border border-fann-border rounded-md px-3 py-2" />
                                    <datalist id="event-options">
                                        {eventOptions.map(name => <option key={name} value={name} />)}
                                    </datalist>
                                </div>
                            </div>
                            
                            {(isAnalyzing || suggestionsLoaded) && (
                                <motion.div initial={{opacity: 0, y:-10}} animate={{opacity: 1, y:0}} className="text-xs text-fann-light-gray bg-fann-teal p-2 rounded-md flex gap-2 items-center">
                                    {isAnalyzing ? <><Loader2 size={16} className="text-fann-accent-peach flex-shrink-0 animate-spin"/>Analyzing your details to provide personalized suggestions...</> : <><Sparkles size={16} className="text-fann-accent-peach flex-shrink-0"/>We've pre-filled these fields based on our analysis. Please review and adjust for accuracy.</>}
                                </motion.div>
                            )}
                            
                            <div className="border-t border-fann-border pt-6 space-y-6">
                                <div>
                                    <label htmlFor="booth_size_sqm" className="block text-sm font-medium text-fann-light-gray mb-2">Booth Size (sqm): <span className="text-fann-accent-peach font-bold">{formData.booth_size_sqm}</span></label>
                                    <input type="range" id="booth_size_sqm" name="booth_size_sqm" min="9" max="500" step="1" value={formData.booth_size_sqm} onChange={handleInputChange} className="w-full h-2 bg-fann-teal-dark rounded-lg appearance-none cursor-pointer accent-fann-accent-peach" />
                                </div>
                                <div>
                                    <label htmlFor="stand_cost" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Design & Build Cost (AED)</label>
                                    <input type="number" step="1000" id="stand_cost" name="stand_cost" value={formData.stand_cost} onChange={handleInputChange} className="w-full bg-fann-teal border border-fann-border rounded-md px-3 py-2" />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="average_deal_size" className="block text-sm font-medium text-fann-light-gray mb-2">Avg. Deal Size (AED)</label>
                                        <input type="number" step="1000" id="average_deal_size" name="average_deal_size" value={formData.average_deal_size} onChange={handleInputChange} className="w-full bg-fann-teal border border-fann-border rounded-md px-3 py-2" />
                                    </div>
                                    <div>
                                        <label htmlFor="close_rate" className="block text-sm font-medium text-fann-light-gray mb-2">Sales Close Rate: <span className="text-fann-accent-peach font-bold">{formData.close_rate}%</span></label>
                                        <input type="range" id="close_rate" name="close_rate" min="1" max="80" step="1" value={formData.close_rate} onChange={handleInputChange} className="w-full h-2 bg-fann-teal-dark rounded-lg appearance-none cursor-pointer accent-fann-accent-peach" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Display */}
                        <div className="relative">
                            <AnimatePresence>
                                {(isRecalculating || (isAnalyzing && !results)) && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-fann-teal-dark/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                                        <Loader2 className="w-12 h-12 text-fann-accent-peach animate-spin"/>
                                        <p className="mt-4 font-semibold">{isAnalyzing ? 'Calculating...' : 'Recalculating...'}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="space-y-6">
                                {error && !isAnalyzing && (
                                    <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-sm flex items-start gap-3 h-full">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                {!results && !error && !isAnalyzing && (
                                    <div className="bg-fann-teal-dark p-6 rounded-lg text-center h-full flex flex-col justify-center items-center min-h-[400px]">
                                        <p className="text-fann-light-gray">Your ROI projections will appear here once you provide your company and event details.</p>
                                    </div>
                                )}
                                {results && !error && (
                                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-6">
                                        <div className="bg-fann-teal p-8 rounded-lg text-center">
                                            <p className="text-fann-light-gray uppercase tracking-wider text-sm">Projected ROI</p>
                                            <p className="text-5xl lg:text-7xl font-bold text-fann-accent-teal my-2">{results.roi_metrics.roi_percentage_min}% - {results.roi_metrics.roi_percentage_max}%</p>
                                            <p className="text-fann-light-gray text-base">({results.roi_metrics.roi_ratio_min} to {results.roi_metrics.roi_ratio_max} return on investment)</p>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-fann-peach mb-4">Key Projections Snippet</h3>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className="bg-fann-teal p-4 rounded-lg flex items-center gap-4"><Users className="w-8 h-8 text-fann-accent-peach flex-shrink-0" /><div><p className="text-sm text-fann-light-gray">Qualified Leads</p><p className="text-xl font-bold text-fann-peach">{`${results.visitor_projections.qualified_leads_min} - ${results.visitor_projections.qualified_leads_max}`}</p></div></div>
                                                <div className="bg-fann-teal p-4 rounded-lg flex items-center gap-4"><TrendingUp className="w-8 h-8 text-fann-accent-peach flex-shrink-0" /><div><p className="text-sm text-fann-light-gray">Expected Revenue</p><p className="text-xl font-bold text-fann-peach">{`${formatCurrency(results.financial_projections.expected_revenue_min)}`}</p></div></div>
                                                <div className="bg-fann-teal p-4 rounded-lg flex items-center gap-4"><Target className="w-8 h-8 text-fann-accent-peach flex-shrink-0" /><div><p className="text-sm text-fann-light-gray">Deals to Break-Even</p><p className="text-xl font-bold text-fann-peach">{`${results.roi_metrics.break_even_deals}`}</p></div></div>
                                            </div>
                                        </div>
                                        
                                        <AnimatePresence mode="wait">
                                        {isDownloaded ? (
                                            <motion.div key="thank-you" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-fann-teal p-6 rounded-lg text-center border-2 border-fann-accent-teal">
                                                <CheckCircle className="mx-auto h-12 w-12 text-fann-accent-teal" />
                                                <h3 className="text-2xl font-serif font-bold text-fann-peach mt-4">Thank You!</h3>
                                                <p className="text-fann-light-gray mt-2">Your report has been downloaded. Our team will be in touch shortly to discuss your project.</p>
                                            </motion.div>
                                        ) : (
                                            <motion.form key="lead-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} onSubmit={handleDownloadReport} className="bg-fann-teal p-6 rounded-lg border border-fann-border">
                                                <h3 className="text-xl font-serif font-bold text-fann-peach mb-1">Unlock the Full, Multi-Page Analysis</h3>
                                                <p className="text-fann-light-gray text-sm mb-4">Enter your details to download the FANN Proprietary ROI Analysis, including visitor projections, financial modeling, and strategic recommendations.</p>
                                                <div className="space-y-4">
                                                    <input type="text" name="name" placeholder="Full Name" value={leadData.name} onChange={handleLeadInputChange} required className="w-full bg-fann-teal-dark border border-fann-border rounded-md px-3 py-2" />
                                                    <input type="email" name="email" placeholder="Business Email" value={leadData.email} onChange={handleLeadInputChange} required className="w-full bg-fann-teal-dark border border-fann-border rounded-md px-3 py-2" />
                                                    <input type="text" name="company" placeholder="Company Name" value={leadData.company} onChange={handleLeadInputChange} required className="w-full bg-fann-teal-dark border border-fann-border rounded-md px-3 py-2" />
                                                    <button type="submit" disabled={isDownloading} className="w-full bg-fann-accent-peach text-fann-teal font-bold py-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-50">
                                                        {isDownloading ? <><Loader2 className="animate-spin w-5 h-5"/> Generating...</> : <><Download size={18}/> Download Full Report</>}
                                                    </button>
                                                </div>
                                            </motion.form>
                                        )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ROICalculatorPage;