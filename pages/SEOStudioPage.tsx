import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, Copy, Check, Bot } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useApiKey } from '../context/ApiKeyProvider';

const SEOStudioPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedMetadata, setGeneratedMetadata] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { ensureApiKey, handleApiError, error, clearError } = useApiKey();
    
    const handleRunAgent = async () => {
        clearError();
        if (!await ensureApiKey()) return;
        
        setIsLoading(true);
        setGeneratedMetadata(null);

        try {
            const response = await fetch('/api/generate-site-seo', {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to run the SEO agent.');
            }

            const data = await response.json();
            const formattedJson = `// src/seo-metadata.ts\n\nexport const siteMetadata = ${JSON.stringify(data, null, 2)};`;
            setGeneratedMetadata(formattedJson);

        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (!generatedMetadata) return;
        navigator.clipboard.writeText(generatedMetadata);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                         <Bot className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">SEO & LLMO Agent</h1>
                        <p className="text-xl text-fann-cream">
                           Automate the optimization of your entire website for search engines and AI language models with a single click.
                        </p>
                    </div>
                    
                    <div className="bg-fann-charcoal-light p-8 rounded-lg text-center">
                         <h2 className="text-2xl font-serif text-white">Run Site-Wide Analysis</h2>
                         <p className="text-fann-light-gray mt-2 mb-6 max-w-2xl mx-auto">The agent will scan all pages of your site, analyze their content, and generate optimized SEO titles, meta descriptions, and structured data for each one.</p>
                        
                        <motion.button
                            onClick={handleRunAgent}
                            disabled={isLoading}
                            className="bg-fann-teal text-white font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2 disabled:opacity-50 mx-auto"
                            whileHover={{ scale: !isLoading ? 1.05 : 1 }}
                            whileTap={{ scale: !isLoading ? 0.95 : 1 }}
                        >
                            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin"/> Analyzing Site...</> : <><Sparkles size={20} /> Run Agent</>}
                        </motion.button>

                         {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 my-4 text-left"
                            >
                                 <div className="flex-shrink-0 pt-0.5"><AlertCircle className="w-5 h-5" /></div>
                                 <div className="flex-grow">
                                    <span className="whitespace-pre-wrap">{error}</span>
                                 </div>
                            </motion.div>
                        )}
                    </div>

                    {generatedMetadata && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8"
                        >
                            <div className="bg-fann-charcoal-light rounded-lg">
                                <div className="flex justify-between items-center p-4 border-b border-fann-border">
                                    <div>
                                        <h3 className="font-semibold text-white text-lg">Agent Output</h3>
                                        <p className="text-sm text-fann-light-gray">Copy this code and replace the content of the <code className="bg-fann-charcoal px-1 rounded-sm text-fann-gold">src/seo-metadata.ts</code> file.</p>
                                    </div>
                                    <button onClick={handleCopy} className="text-fann-light-gray hover:text-white transition-colors text-sm flex items-center gap-1 bg-fann-charcoal px-3 py-2 rounded-md">
                                        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                        {copied ? 'Copied!' : 'Copy Code'}
                                    </button>
                                </div>
                                <div className="p-4">
                                    <pre className="whitespace-pre-wrap text-sm text-fann-cream bg-fann-charcoal p-4 rounded-md max-h-[50vh] overflow-auto">
                                        <code>{generatedMetadata}</code>
                                    </pre>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </AnimatedPage>
    );
};

export default SEOStudioPage;