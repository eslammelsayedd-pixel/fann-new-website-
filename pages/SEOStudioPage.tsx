import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, Bot, Copy } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useApiKey } from '../context/ApiKeyProvider';

const SEOStudioPage: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [result, setResult] = React.useState<string | null>(null);
    const [isCopied, setIsCopied] = React.useState(false);
    const { ensureApiKey, handleApiError, error, clearError } = useApiKey();

    const handleRunAgent = async () => {
        clearError();
        setResult(null);
        if (!await ensureApiKey()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/generate-site-seo');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate SEO data.');
            }
            const data = await response.json();
            setResult(data.seoData);
        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <Bot className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">AI SEO Agent</h1>
                        <p className="text-xl text-fann-cream max-w-3xl mx-auto">
                            Automate your entire website's SEO. Run the agent to generate optimized titles, descriptions, and schema markup for every page.
                        </p>
                    </div>

                    <div className="bg-fann-charcoal-light p-8 rounded-lg">
                        {!result && (
                             <div className="text-center">
                                <p className="text-fann-light-gray mb-6">Click the button below to start the automated analysis. The agent will process all site routes and generate a centralized SEO data file.</p>
                                <motion.button
                                    onClick={handleRunAgent}
                                    disabled={isLoading}
                                    className="bg-fann-teal text-white font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                                    whileHover={{ scale: !isLoading ? 1.05 : 1 }}
                                    whileTap={{ scale: !isLoading ? 0.95 : 1 }}
                                >
                                    {isLoading ? <><Loader2 className="w-5 h-5 animate-spin"/> Analyzing...</> : <><Sparkles size={20} /> Run Agent</>}
                                </motion.button>
                            </div>
                        )}
                       
                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 my-6">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="whitespace-pre-wrap">{error}</span>
                            </motion.div>
                        )}
                        
                        <AnimatePresence>
                        {result && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-2xl font-serif text-fann-gold text-center mb-4">Agent Complete</h2>
                                <p className="text-center text-fann-light-gray mb-6">Copy the code below and paste it into the <code className="bg-fann-charcoal text-fann-gold px-1 rounded-sm">src/seo-metadata.ts</code> file, replacing its contents.</p>
                                <div className="relative bg-fann-charcoal rounded-lg p-4 border border-fann-border">
                                    <button onClick={handleCopy} className="absolute top-3 right-3 bg-fann-border text-white px-3 py-1 text-xs font-bold rounded-md hover:bg-fann-teal transition-colors flex items-center gap-1">
                                        <Copy size={12}/> {isCopied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                                        <code>{result}</code>
                                    </pre>
                                </div>
                                <div className="text-center mt-6">
                                    <motion.button onClick={() => { setResult(null); clearError();}} className="border-2 border-fann-gold text-fann-gold font-bold py-2 px-6 rounded-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        Run Again
                                    </motion.button>
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

export default SEOStudioPage;