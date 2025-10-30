import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, Building, Check, Image as ImageIcon, Loader2, Palette, Sparkles, Wand2 } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';
import { GeneratedDesign } from '../src/types';

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });

const ExhibitionStudioPage: React.FC = () => {
    // Form state
    const [companyName, setCompanyName] = useState('');
    const [boothSize, setBoothSize] = useState(50);
    const [boothType, setBoothType] = useState('Corner');
    const [style, setStyle] = useState('Luxury & Elegant');
    const [features, setFeatures] = useState<string[]>([]);
    const [logo, setLogo] = useState<{ file: File | null, url: string | null, mimeType: string | null }>({ file: null, url: null, mimeType: null });
    const [brandColors, setBrandColors] = useState<string[]>(['#1E565A', '#FCE5D4', '#D4AF76']);
    
    // API state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedDesign, setGeneratedDesign] = useState<GeneratedDesign | null>(null);

    const handleFeatureChange = (feature: string) => {
        setFeatures(prev => prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setError(null);
            setLogo({ file, url: URL.createObjectURL(file), mimeType: file.type });
            try {
                const base64Image = await fileToBase64(file);
                const response = await fetch('/api/extract-colors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Image, mimeType: file.type }),
                });
                if (!response.ok) throw new Error('Failed to extract colors.');
                const data = await response.json();
                if (data.colors && data.colors.length > 0) {
                    setBrandColors(data.colors);
                }
            } catch (err) {
                setError('Could not automatically extract colors from this logo.');
            }
        }
    };

    const generateDesign = async () => {
        if (!companyName) {
            setError("Please enter your company name to generate a design.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedDesign(null);

        try {
            const response = await fetch('/api/generate-exhibition-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyName, boothSize, boothType, style, features, brandColors }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "An unknown error occurred while generating the design.");
            }
            const data = await response.json();
            setGeneratedDesign(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <SEO
                title="AI Exhibition Stand Designer | FANN Studio"
                description="Visualize your exhibition stand in minutes. Use FANN's AI-powered studio to configure your booth size, style, and features, and receive an instant 3D concept and design proposal."
            />
            <div className="min-h-screen bg-fann-peach dark:bg-fann-teal pt-32 pb-20 text-fann-teal dark:text-fann-peach">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Building className="mx-auto h-16 w-16 text-fann-accent-teal dark:text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-accent-teal dark:text-fann-gold mt-4 mb-4">Exhibition Studio</h1>
                        <p className="text-xl text-fann-teal/90 dark:text-fann-peach/90 max-w-3xl mx-auto">
                            Configure your ideal stand and let our AI generate a bespoke design concept for you.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {/* CONTROLS */}
                        <div className="bg-white dark:bg-fann-accent-teal p-6 rounded-lg space-y-6 self-start shadow-lg">
                            <h2 className="text-2xl font-serif font-bold text-fann-teal dark:text-fann-peach border-b border-fann-teal/10 dark:border-fann-border pb-3">1. Your Brand & Booth</h2>
                             <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">Company Name</label>
                                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g., Apex Innovations" className="w-full bg-fann-peach/50 dark:bg-fann-teal border border-fann-teal/20 dark:border-fann-border rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">Upload Your Logo</label>
                                <div className="flex items-center gap-4">
                                    <label htmlFor="logo-upload" className="cursor-pointer bg-fann-peach/50 dark:bg-fann-teal border border-fann-teal/20 dark:border-fann-border rounded-md px-4 py-2 flex items-center gap-2 hover:border-fann-gold dark:hover:border-fann-gold transition-colors">
                                        <ImageIcon size={18} /> Choose File
                                    </label>
                                    <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                    {logo.url && <img src={logo.url} alt="company logo" className="h-10 w-auto object-contain rounded-sm bg-gray-200 p-1" />}
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2 flex items-center gap-2"><Palette size={16}/> Brand Colors</label>
                                <div className="flex gap-2 flex-wrap">
                                    {brandColors.map((color, i) => <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20" style={{backgroundColor: color}} title={color}></div>)}
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">Booth Size (sqm): <span className="font-bold text-fann-accent-teal dark:text-fann-gold">{boothSize} sqm</span></label>
                                <input type="range" min="9" max="400" value={boothSize} onChange={e => setBoothSize(parseInt(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-fann-peach dark:bg-fann-teal-dark accent-fann-gold" />
                            </div>

                             <h2 className="text-2xl font-serif font-bold text-fann-teal dark:text-fann-peach border-b border-fann-teal/10 dark:border-fann-border pb-3 pt-4">2. Design & Style</h2>
                             <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-3">Booth Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Inline', 'Corner', 'Island'].map(type => (
                                        <button key={type} onClick={() => setBoothType(type)} className={`py-2 text-sm rounded-md ${boothType === type ? 'bg-fann-gold text-fann-charcoal' : 'bg-fann-peach/50 dark:bg-fann-teal'}`}>{type}</button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-3">Overall Style</label>
                                <div className="space-y-2">
                                    {['Luxury & Elegant', 'Modern & Minimalist', 'High-Tech & Interactive'].map(s => (
                                        <button key={s} onClick={() => setStyle(s)} className={`w-full text-left p-3 rounded-md flex items-center gap-3 ${style === s ? 'bg-fann-accent-teal/20 dark:bg-fann-gold/20' : 'bg-fann-peach/50 dark:bg-fann-teal'}`}>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${style === s ? 'border-fann-accent-teal dark:border-fann-gold' : 'border-fann-light-gray'}`}>{style === s && <Check size={12} className="text-fann-accent-teal dark:text-fann-gold" />}</div>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-3">Key Features</label>
                                 <div className="grid grid-cols-2 gap-2">
                                     {['Double Deck', 'Hospitality Area', 'Private Meeting Room', 'Interactive LED Wall'].map(feature => (
                                        <button key={feature} onClick={() => handleFeatureChange(feature)} className={`p-3 text-sm rounded-md flex items-center gap-2 ${features.includes(feature) ? 'bg-fann-accent-teal/20 dark:bg-fann-gold/20' : 'bg-fann-peach/50 dark:bg-fann-teal'}`}>
                                             <div className={`w-5 h-5 rounded-sm flex items-center justify-center border-2 ${features.includes(feature) ? 'border-fann-accent-teal dark:border-fann-gold' : 'border-fann-light-gray'}`}>{features.includes(feature) && <Check size={12} className="text-fann-accent-teal dark:text-fann-gold" />}</div>
                                             {feature}
                                         </button>
                                     ))}
                                 </div>
                            </div>

                            <div className="pt-6 border-t border-fann-teal/10 dark:border-fann-border">
                                {error && (
                                     <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-sm flex items-start gap-3 mb-4">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}
                                <button onClick={generateDesign} disabled={isLoading || !companyName} className="w-full bg-fann-gold text-fann-charcoal font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                                    {isLoading ? <><Loader2 className="animate-spin" /> Generating Concept...</> : <><Wand2/> Generate Concept</>}
                                </button>
                            </div>
                        </div>

                        {/* VIEWER & RESULTS */}
                        <div className="relative">
                            <AnimatePresence>
                                {isLoading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/80 dark:bg-fann-teal/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                                        <Loader2 className="w-12 h-12 text-fann-accent-teal dark:text-fann-gold animate-spin"/>
                                        <p className="mt-4 font-semibold text-lg">Generating Your Custom Design...</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="bg-white dark:bg-fann-accent-teal rounded-lg shadow-lg sticky top-24">
                                <model-viewer
                                    src="https://cdn.glitch.global/6a86e971-40b4-436f-8700-61d151048b61/exhibition_stand.glb?v=1716409890924"
                                    alt="3D model of an exhibition stand"
                                    camera-controls
                                    auto-rotate
                                    shadow-intensity="1"
                                    exposure="1.2"
                                    environment-image="neutral"
                                    camera-orbit="15deg 75deg 10m"
                                    style={{ width: '100%', height: '400px', backgroundColor: 'transparent' }}
                                ></model-viewer>
                                <div className="p-6">
                                    <AnimatePresence mode="wait">
                                    {generatedDesign ? (
                                        <motion.div key="results" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                            <h2 className="text-3xl font-serif font-bold text-fann-accent-teal dark:text-fann-gold">{generatedDesign.conceptName}</h2>
                                            <p className="mt-2 text-fann-teal/90 dark:text-fann-peach/90">{generatedDesign.detailedDescription}</p>
                                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <h3 className="font-bold mb-1">Materials</h3>
                                                    <ul className="list-disc list-inside text-fann-light-gray">{generatedDesign.materials.map(m => <li key={m}>{m}</li>)}</ul>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold mb-1">Lighting</h3>
                                                    <p className="text-fann-light-gray">{generatedDesign.lighting}</p>
                                                </div>
                                            </div>
                                             <div className="mt-6 text-center">
                                                <a href="/contact" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full inline-flex items-center gap-2">
                                                    Get a Quote for this Design <ArrowRight size={18}/>
                                                </a>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="placeholder" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="text-center">
                                            <Sparkles className="w-10 h-10 text-fann-accent-teal dark:text-fann-gold mx-auto mb-2" />
                                            <h3 className="text-xl font-serif font-bold">Your AI-Generated Design Awaits</h3>
                                            <p className="text-fann-light-gray mt-1">Fill in your details to see a custom concept here.</p>
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;