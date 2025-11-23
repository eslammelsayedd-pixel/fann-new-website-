import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Building2, Palette, Sparkles, SlidersHorizontal, Check, Globe } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const boothTypes = ['Island (4-side open)', 'Peninsula (3-side open)', 'Corner (2-side open)', 'Inline (1-side open)'];
const designStyles = ['Luxurious & Elegant', 'Minimalist & Clean', 'High-Tech & Futuristic', 'Bold & Experiential', 'Warm & Natural'];
const featureOptions = ['Private Meeting Room', 'Hospitality Bar', 'LED Screen Wall', 'Product Display Pods', 'Interactive Demo Area', 'Storage Room'];

const steps = ['Brief', 'Structure', 'Aesthetics', 'Functionality'];
const ProgressIndicator: React.FC = () => (
    <div className="mb-12 px-2 sm:px-4">
        <div className="flex items-start">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center text-center w-20 sm:w-24">
                        <div className={`w-10 h-10 rounded-full bg-fann-gold text-fann-charcoal flex items-center justify-center font-bold text-lg`}>
                            {index + 1}
                        </div>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-fann-teal dark:text-fann-peach">{step}</p>
                    </div>
                    {index < steps.length - 1 && <div className="flex-1 h-1 bg-fann-gold/30 rounded-full mt-5"></div>}
                </React.Fragment>
            ))}
        </div>
    </div>
);

interface FormSectionProps {
  step: number;
  title: string;
  icon: React.ElementType;
  description: string;
  children: React.ReactNode;
}
const FormSection: React.FC<FormSectionProps> = ({ step, title, icon: Icon, description, children }) => (
    <div className="border-t border-fann-teal/10 dark:border-fann-border pt-8 mt-8 first:mt-0 first:border-t-0 first:pt-0">
        <div className="flex items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-fann-peach dark:bg-fann-teal flex-shrink-0 flex items-center justify-center border border-fann-teal/10 dark:border-fann-border">
                <Icon className="w-7 h-7 text-fann-accent-teal dark:text-fann-gold" />
            </div>
            <div>
                 <h2 className="text-2xl font-serif font-bold text-fann-teal dark:text-fann-peach">{`Step ${step}: ${title}`}</h2>
                 <p className="text-sm text-fann-light-gray mt-1">{description}</p>
            </div>
        </div>
        <div className="md:pl-16 pt-6">
             {children}
        </div>
    </div>
);

interface FeatureCheckboxProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}
const FeatureCheckbox: React.FC<FeatureCheckboxProps> = ({ label, isChecked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer group p-3 rounded-lg transition-colors duration-200 hover:bg-fann-peach/50 dark:hover:bg-fann-teal-dark/50">
        <div className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${isChecked ? 'bg-fann-gold border-fann-gold' : 'bg-transparent border-fann-light-gray group-hover:border-fann-gold/50'}`}>
            {isChecked && <Check size={16} className="text-fann-charcoal" />}
        </div>
        <span className={`transition-colors duration-200 text-base ${isChecked ? 'text-fann-teal dark:text-fann-peach font-semibold' : 'text-fann-teal/80 dark:text-fann-light-gray'}`}>{label}</span>
    </label>
);


const ExhibitionStudioPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: '',
        websiteUrl: '',
        eventName: '',
        standWidth: 10,
        standLength: 6,
        boothType: 'Island (4-side open)',
        style: 'Luxurious & Elegant',
        features: ['Hospitality Bar', 'LED Screen Wall', 'Private Meeting Room'],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    };

    const handleOptionClick = (field: 'boothType' | 'style', value: string) => {
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
        navigate('/fann-studio/exhibition/result', { 
            state: { 
                formData: {
                    ...formData,
                    boothSize: formData.standWidth * formData.standLength,
                }
            } 
        });
    };

    return (
        <AnimatedPage>
            <SEO
                title="Exhibition Design Brief | FANN Studio"
                description="Start designing your exhibition stand with our guided step-by-step brief. Provide your requirements to receive a custom concept from FANN."
            />
            <div className="min-h-screen bg-fann-peach dark:bg-fann-teal pt-32 pb-20 text-fann-teal dark:text-fann-peach">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                         <Building2 className="mx-auto h-16 w-16 text-fann-accent-teal dark:text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-accent-teal dark:text-fann-gold mt-4 mb-4">Exhibition Studio</h1>
                        <p className="text-xl text-fann-teal/90 dark:text-fann-peach/90">
                           Complete the brief below to generate a bespoke 3D concept for your stand.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-fann-accent-teal p-6 sm:p-10 rounded-lg shadow-xl">
                        <ProgressIndicator />
                        <form onSubmit={handleSubmit} className="space-y-0">
                            <FormSection step={1} title="The Brief" icon={FileText} description="Tell us about your company and the event.">
                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <input type="text" name="companyName" placeholder="Your Company Name" value={formData.companyName} onChange={handleInputChange} required className="w-full bg-fann-peach/50 dark:bg-fann-teal border border-fann-teal/20 dark:border-fann-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fann-accent-teal dark:focus:ring-fann-gold" />
                                        <input type="text" name="eventName" placeholder="Event Name (e.g., GITEX)" value={formData.eventName} onChange={handleInputChange} required className="w-full bg-fann-peach/50 dark:bg-fann-teal border border-fann-teal/20 dark:border-fann-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fann-accent-teal dark:focus:ring-fann-gold" />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Globe className="h-5 w-5 text-fann-light-gray" />
                                        </div>
                                        <input 
                                            type="url" 
                                            name="websiteUrl" 
                                            placeholder="Company Website URL (Optional - AI will analyze your brand style)" 
                                            value={formData.websiteUrl} 
                                            onChange={handleInputChange} 
                                            className="w-full pl-10 bg-fann-peach/50 dark:bg-fann-teal border border-fann-teal/20 dark:border-fann-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-fann-accent-teal dark:focus:ring-fann-gold" 
                                        />
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection step={2} title="Stand Structure" icon={Building2} description="Define the size and type of your booth.">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium">Width:</label>
                                            <span className="font-bold text-lg text-fann-accent-teal dark:text-fann-gold bg-fann-peach/50 dark:bg-fann-teal px-2 py-0.5 rounded-md">{formData.standWidth}m</span>
                                        </div>
                                        <input type="range" name="standWidth" min="3" max="50" value={formData.standWidth} onChange={handleSliderChange} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-fann-teal/20 dark:bg-fann-border accent-fann-accent-teal dark:accent-fann-gold" />
                                        <div className="flex justify-between text-xs text-fann-light-gray mt-1"><span>3m</span><span>50m</span></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium">Length:</label>
                                            <span className="font-bold text-lg text-fann-accent-teal dark:text-fann-gold bg-fann-peach/50 dark:bg-fann-teal px-2 py-0.5 rounded-md">{formData.standLength}m</span>
                                        </div>
                                        <input type="range" name="standLength" min="3" max="50" value={formData.standLength} onChange={handleSliderChange} className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-fann-teal/20 dark:bg-fann-border accent-fann-accent-teal dark:accent-fann-gold" />
                                        <div className="flex justify-between text-xs text-fann-light-gray mt-1"><span>3m</span><span>50m</span></div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-3">Booth Type</label>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                        {boothTypes.map(type => (
                                            <button key={type} type="button" onClick={() => handleOptionClick('boothType', type)} className={`px-3 py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center ${formData.boothType === type ? 'bg-fann-gold text-fann-charcoal' : 'bg-fann-peach/50 dark:bg-fann-teal-dark hover:bg-fann-peach'}`}>
                                                {formData.boothType === type && <Check size={16} className="mr-2 flex-shrink-0" />}
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </FormSection>

                            <FormSection step={3} title="Aesthetics" icon={Palette} description="Choose the look and feel that represents your brand.">
                                <label className="block text-sm font-medium mb-3">Design Style</label>
                                <div className="flex flex-wrap gap-2">
                                    {designStyles.map(style => (
                                        <button key={style} type="button" onClick={() => handleOptionClick('style', style)} className={`px-3 py-2 text-sm font-semibold rounded-md transition-all flex items-center ${formData.style === style ? 'bg-fann-gold text-fann-charcoal' : 'bg-fann-peach/50 dark:bg-fann-teal-dark hover:bg-fann-peach'}`}>
                                            {formData.style === style && <Check size={16} className="mr-2 flex-shrink-0" />}
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </FormSection>

                            <FormSection step={4} title="Functionality" icon={SlidersHorizontal} description="Select the key features your stand will need.">
                                <label className="block text-sm font-medium mb-3">Key Features</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                    {featureOptions.map(feature => (
                                        <FeatureCheckbox key={feature} label={feature} isChecked={formData.features.includes(feature)} onChange={() => handleFeatureChange(feature)} />
                                    ))}
                                </div>
                            </FormSection>
                            
                            <div className="pt-10">
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
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;