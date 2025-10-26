import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, BarChart2, Briefcase, CheckCircle, Download, FileText, Loader2, Target, TrendingUp, Users, Zap } from 'lucide-react';
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

const initialFormData: FormData = {
    event_name: 'GITEX Global',
    booth_size_sqm: 50,
    stand_cost: 75000,
    average_deal_size: 50000,
    close_rate: 20,
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const ROICalculatorPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [results, setResults] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateRoi = useCallback(async (data: FormData) => {
        setIsLoading(true);
        setError(null);
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

    const ResultCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode; color: string;}> = ({ icon: Icon, title, children, color }) => (
        <div className="bg-fann-charcoal-light p-4 rounded-lg border-l-4" style={{borderColor: color}}>
            <h3 className="text-lg font-bold flex items-center gap-2" style={{color: color}}><Icon size={20} />{title}</h3>
            <div className="mt-2 text-fann-cream space-y-2">{children}</div>
        </div>
    );
    
    const Metric: React.FC<{ label: string; value: string | React.ReactNode; }> = ({ label, value }) => (
        <div className="flex justify-between items-baseline text-sm">
            <span className="text-fann-light-gray">{label}</span>
            <span className="font-bold text-white text-right">{value}</span>
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
                        <div className="bg-fann-charcoal-light p-6 rounded-lg space-y-6">
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
                                {isLoading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-fann-charcoal-light/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                                        <Loader2 className="w-12 h-12 text-fann-gold animate-spin"/>
                                        <p className="mt-4 font-semibold">Calculating Projections...</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                             <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
                                {error && (
                                     <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-sm flex items-start gap-3 h-full">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                {results && !error && (
                                    <div className="space-y-4">
                                        <div className="bg-fann-teal/10 p-4 rounded-lg text-center">
                                            <p className="text-fann-light-gray uppercase tracking-wider text-sm">Projected ROI</p>
                                            <p className="text-4xl lg:text-5xl font-bold text-fann-teal">{results.roi_metrics.roi_percentage_min}% - {results.roi_metrics.roi_percentage_max}%</p>
                                            <p className="text-fann-light-gray text-sm mt-1">({results.roi_metrics.roi_ratio_min} to {results.roi_metrics.roi_ratio_max} return on investment)</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <ResultCard icon={Users} title="Visitor Projections" color="#5A8B8C">
                                                <Metric label="Booth Visitors" value={`${results.visitor_projections.booth_visitors_min} - ${results.visitor_projections.booth_visitors_max}`} />
                                                <Metric label="Engaged Visitors" value={`${results.visitor_projections.engaged_visitors_min} - ${results.visitor_projections.engaged_visitors_max}`} />
                                                <Metric label="Qualified Leads" value={`${results.visitor_projections.qualified_leads_min} - ${results.visitor_projections.qualified_leads_max}`} />
                                            </ResultCard>
                                             <ResultCard icon={Briefcase} title="Financial Projections" color="#D4AF76">
                                                <Metric label="Sales Pipeline" value={<>{formatCurrency(results.financial_projections.pipeline_value_min)}<br/>- {formatCurrency(results.financial_projections.pipeline_value_max)}</>} />
                                                <Metric label="Expected Revenue" value={<>{formatCurrency(results.financial_projections.expected_revenue_min)}<br/>- {formatCurrency(results.financial_projections.expected_revenue_max)}</>} />
                                            </ResultCard>
                                        </div>
                                         <ResultCard icon={TrendingUp} title="Investment & Metrics" color="#B0B0B0">
                                            <Metric label="Total Investment" value={formatCurrency(results.investment_breakdown.total_investment)} />
                                            <Metric label="Cost Per Qualified Lead" value={formatCurrency(results.roi_metrics.cost_per_lead)} />
                                            <Metric label="Deals to Break-Even" value={results.roi_metrics.break_even_deals} />
                                        </ResultCard>
                                         <ResultCard icon={FileText} title="Methodology" color="#B0B0B0">
                                            <p className="text-sm text-fann-light-gray">
                                                Projections are based on a proprietary model developed by FANN, analyzing industry benchmarks from leading authorities like CEIR and DWTC, combined with our internal data from over 150 successful regional exhibitions.
                                            </p>
                                        </ResultCard>
                                        <ResultCard icon={CheckCircle} title="FANN Recommendations" color="#5A8B8C">
                                            <ul className="text-sm text-fann-cream space-y-2 list-disc list-inside">
                                                {results.personalized_recommendations.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
                                            </ul>
                                        </ResultCard>
                                    </div>
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