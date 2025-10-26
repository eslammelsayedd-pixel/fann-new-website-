import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, BarChart2, Briefcase, CheckCircle, Download, FileText, Loader2, Target, TrendingUp, Users, Zap, Building } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';
import { regionalEvents } from '../constants';

const eventOptions = [...new Set(regionalEvents.map(e => e.name))].sort();

interface FormData {
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
    event_name: 'GITEX Global',
    booth_size_sqm: 50,
    stand_cost: 75000,
    average_deal_size: 50000,
    close_rate: 20,
};

const ROICalculatorPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [leadData, setLeadData] = useState<LeadData>({ name: '', email: '', company: '' });
    const [results, setResults] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateRoi = useCallback(async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        setIsDownloaded(false);
        try {
            const response = await fetch('/api/calculate-roi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to calculate ROI.');
            }
            
            const resultData = await response.json();
            setResults(resultData);
        } catch (e: any) {
            setError(e.message);
            setResults(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            calculateRoi(formData);
        }, 800); // Debounce API calls

        return () => {
            clearTimeout(handler);
        };
    }, [formData, calculateRoi]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'event_name' ? value : Number(value) }));
    };

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
            a.download = `FANN_ROI_Analysis_${formData.event_name.replace(/\s/g, '_')}.html`;
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

    const ROIResultCard = () => (
        <div className="bg-fann-charcoal-light p-6 rounded-lg text-center">
            <p className="text-fann-light-gray uppercase tracking-wider text-sm">Projected ROI</p>
            <p className="text-5xl lg:text-6xl font-bold text-fann-teal my-2">{results.roi_metrics.roi_percentage_min}% - {results.roi_metrics.roi_percentage_max}%</p>
            <p className="text-fann-light-gray text-sm">({results.roi_metrics.roi_ratio_min} to {results.roi_metrics.roi_ratio_max} return on investment)</p>
        </div>
    );

    return (
        <AnimatedPage>
            <SEO
                title="Exhibition ROI Calculator"
                description="Calculate your potential return on investment for major Dubai & KSA exhibitions with FANN's data-driven ROI calculator. Get instant projections for your next event."
            />
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <BarChart2 className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Exhibition ROI Calculator</h1>
                        <p className="text-xl text-fann-cream max-w-3xl mx-auto">
                           Make data-driven decisions. Project your potential return on investment for your next exhibition.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {/* Input Form */}
                        <div className="bg-fann-charcoal-light p-6 rounded-lg space-y-6 self-start">
                            <h2 className="text-2xl font-serif font-bold text-white border-b border-fann-border pb-3">Your Event Details</h2>
                             <div>
                                <label htmlFor="event_name" className="block text-sm font-medium text-fann-light-gray mb-2">Event Name</label>
                                <select id="event_name" name="event_name" value={formData.event_name} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    {eventOptions.map(name => <option key={name} value={name}>{name}</option>)}
                                </select>
                             </div>
                             <div>
                                <label htmlFor="booth_size_sqm" className="block text-sm font-medium text-fann-light-gray mb-2">Booth Size (sqm): <span className="text-fann-gold font-bold">{formData.booth_size_sqm}</span></label>
                                <input type="range" id="booth_size_sqm" name="booth_size_sqm" min="9" max="200" step="1" value={formData.booth_size_sqm} onChange={handleInputChange} className="w-full h-2 bg-fann-charcoal-light rounded-lg appearance-none cursor-pointer accent-fann-gold" />
                             </div>
                              <div>
                                <label htmlFor="stand_cost" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Design & Build Cost (AED)</label>
                                <input type="number" id="stand_cost" name="stand_cost" value={formData.stand_cost} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="e.g., 75000" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="average_deal_size" className="block text-sm font-medium text-fann-light-gray mb-2">Avg. Deal Size (AED)</label>
                                    <input type="number" id="average_deal_size" name="average_deal_size" value={formData.average_deal_size} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="e.g., 50000" />
                                </div>
                                 <div>
                                    <label htmlFor="close_rate" className="block text-sm font-medium text-fann-light-gray mb-2">Sales Close Rate: <span className="text-fann-gold font-bold">{formData.close_rate}%</span></label>
                                    <input type="range" id="close_rate" name="close_rate" min="5" max="50" step="1" value={formData.close_rate} onChange={handleInputChange} className="w-full h-2 bg-fann-charcoal-light rounded-lg appearance-none cursor-pointer accent-fann-gold" />
                                </div>
                            </div>
                        </div>

                        {/* Results Display */}
                        <div className="relative">
                             <AnimatePresence>
                                {isLoading && !results && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-fann-charcoal-light/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                                        <Loader2 className="w-12 h-12 text-fann-gold animate-spin"/>
                                        <p className="mt-4 font-semibold">Calculating Projections...</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                             <div className={`transition-opacity duration-300 ${isLoading && !results ? 'opacity-30' : 'opacity-100'} space-y-6`}>
                                {error && (
                                     <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-sm flex items-start gap-3 h-full">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                {!results && !error && (
                                    <div className="bg-fann-charcoal-light p-6 rounded-lg text-center h-full flex flex-col justify-center items-center">
                                        <p className="text-fann-light-gray">Your ROI projections will appear here.</p>
                                    </div>
                                )}
                                {results && !error && (
                                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                                        <ROIResultCard />
                                        
                                        <AnimatePresence mode="wait">
                                        {isDownloaded ? (
                                            <motion.div
                                                key="thank-you"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-fann-charcoal-light p-6 rounded-lg mt-6 text-center border-2 border-fann-teal"
                                            >
                                                <CheckCircle className="mx-auto h-12 w-12 text-fann-teal" />
                                                <h3 className="text-2xl font-serif font-bold text-white mt-4">Thank You!</h3>
                                                <p className="text-fann-light-gray mt-2">Your report has been downloaded. Our team will be in touch shortly to discuss your project.</p>
                                            </motion.div>
                                        ) : (
                                            <motion.form
                                                key="lead-form"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                onSubmit={handleDownloadReport}
                                                className="bg-fann-charcoal-light p-6 rounded-lg mt-6"
                                            >
                                                <h3 className="text-xl font-serif font-bold text-white mb-1">Unlock Your Full Report</h3>
                                                <p className="text-fann-light-gray text-sm mb-4">Enter your details to download the FANN Proprietary ROI Analysis, including visitor projections, financial modeling, and strategic recommendations.</p>
                                                <div className="space-y-4">
                                                    <input type="text" name="name" placeholder="Full Name" value={leadData.name} onChange={handleLeadInputChange} required className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                                                    <input type="email" name="email" placeholder="Business Email" value={leadData.email} onChange={handleLeadInputChange} required className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                                                    <input type="text" name="company" placeholder="Company Name" value={leadData.company} onChange={handleLeadInputChange} required className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                                                    <button type="submit" disabled={isDownloading} className="w-full bg-fann-gold text-fann-charcoal font-bold py-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-50">
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
