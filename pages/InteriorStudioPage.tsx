import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, PenTool, Palette, Sparkles, SlidersHorizontal, Square } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const spaceTypes = ['Corporate Office', 'Luxury Retail', 'Private Villa', 'Hospitality Lounge'];
const designStyles = ['Contemporary Luxury', 'Modern Industrial', 'Scandinavian (Scandi)', 'Classic & Ornate', 'Biophilic & Natural'];
const featureOptions = ['Open-plan Workspace', 'Executive Offices', 'Client Reception Area', 'Custom Joinery', 'Feature Lighting', 'Living Green Wall'];

const FormSection = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <div className="border-t border-fann-teal/10 dark:border-fann-border pt-6">
        <div className="flex items-center gap-3 mb-4">
            <Icon className="w-6 h-6 text-fann-accent-teal dark:text-fann-gold" />
            <h2 className="text-2xl font-serif font-bold text-fann-teal dark:text-fann-peach">{title}</h2>
        </div>
        {children}
    </div>
);

const InteriorStudioPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        projectName: '',
        clientName: '',
        spaceArea: 150,
        spaceType: 'Corporate Office',
        style: 'Contemporary Luxury',
        features: ['Client Reception Area', 'Executive Offices'],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    };

    const handleOptionClick = (field: 'spaceType' | 'style', value: string) => {
        setFormData({ ...formData, [field]: value });
    };
    
    const handleFeatureChange = (feature: string) => {
        setFormData(prev => {
            const newFeatures = prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature];
            return { ...prev, features: newFeatures };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/fann-studio/interior/result', { 
            state: { formData } 
        });
    };

    return (
        <AnimatedPage>
            <SEO
                title="Interior Design Brief | FANN Studio"
                description="Visualize your commercial or residential interior. Experiment with styles, materials, and layouts for your unique space with FANN."
            />
            <div className="min-h-screen bg-fann-peach dark:bg-fann-teal pt-32 pb-20 text-fann-teal dark:text-fann-peach">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                         <PenTool className="mx-auto h-16 w-16 text-fann-accent-teal dark:text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-accent-teal dark:text-fann-gold mt-4 mb-4">Interior Design Studio</h1>
                        <p className="text-xl text-fann-teal/90 dark:text-fann-peach/90">
                           Complete the brief below to generate a bespoke concept for your space.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-fann-accent-teal p-8 rounded-lg space-y-8">
                        <FormSection title="The Brief" icon={FileText}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <input type="text" name="projectName" placeholder="Project Name (e.g., Downtown HQ)" value={formData.projectName} onChange={handleInputChange} required className="w-full bg-fann-peach/50 dark:bg-fann-teal border border-fann-teal/20 dark:border-fann-border rounded-md px-4 py-3" />
                                <input type="text" name="clientName" placeholder="Your Name or Company" value={formData.clientName} onChange={handleInputChange} required className="w-full bg-fann-peach/50 dark:bg-fann-teal border border-fann-teal/20 dark:border-fann-border rounded-md px-4 py-3" />
                            </div>
                        </FormSection>

                        <FormSection title="Space Definition" icon={Square}>
                             <div>
                                <label className="block text-sm font-medium mb-2">Total Area (sqm): <span className="font-bold text-fann-accent-teal dark:text-fann-gold">{formData.spaceArea}</span></label>
                                <input type="range" name="spaceArea" min="50" max="3000" step="10" value={formData.spaceArea} onChange={handleSliderChange} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-fann-teal/20 dark:bg-fann-border accent-fann-accent-teal dark:accent-fann-gold" />
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm font-medium mb-3">Space Type</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {spaceTypes.map(type => (
                                        <button key={type} type="button" onClick={() => handleOptionClick('spaceType', type)} className={`px-3 py-2 text-sm font-semibold rounded-md transition-all ${formData.spaceType === type ? 'bg-fann-gold text-fann-charcoal' : 'bg-fann-peach/50 dark:bg-fann-teal-dark hover:bg-fann-peach'}`}>{type}</button>
                                    ))}
                                </div>
                            </div>
                        </FormSection>

                        <FormSection title="Aesthetics" icon={Palette}>
                            <label className="block text-sm font-medium mb-3">Design Style</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                {designStyles.map(style => (
                                    <button key={style} type="button" onClick={() => handleOptionClick('style', style)} className={`px-3 py-2 text-sm font-semibold rounded-md transition-all ${formData.style === style ? 'bg-fann-gold text-fann-charcoal' : 'bg-fann-peach/50 dark:bg-fann-teal-dark hover:bg-fann-peach'}`}>{style}</button>
                                ))}
                            </div>
                        </FormSection>

                        <FormSection title="Functionality" icon={SlidersHorizontal}>
                            <label className="block text-sm font-medium mb-3">Key Features</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {featureOptions.map(feature => (
                                    <label key={feature} className="flex items-center space-x-3 cursor-pointer">
                                        <input type="checkbox" checked={formData.features.includes(feature)} onChange={() => handleFeatureChange(feature)} className="h-5 w-5 rounded border-gray-300 text-fann-accent-teal focus:ring-fann-accent-teal"/>
                                        <span>{feature}</span>
                                    </label>
                                ))}
                            </div>
                        </FormSection>
                        
                        <div className="pt-6">
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit" 
                                className="w-full bg-fann-gold text-fann-charcoal font-bold py-4 rounded-full text-lg uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-fann-gold/40"
                            >
                                <Sparkles size={20} /> Generate My Design
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default InteriorStudioPage;