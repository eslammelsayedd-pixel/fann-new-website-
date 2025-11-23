import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Building2, Palette, Sparkles, SlidersHorizontal, Check, Globe, ArrowRight, ArrowLeft, Briefcase, Mail, Phone, Calendar, MapPin, Users, Ruler, Activity } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const boothTypes = ['Island (4-side open)', 'Peninsula (3-side open)', 'Corner (2-side open)', 'Inline (1-side open)'];
const designStyles = ['Luxurious & Elegant', 'Minimalist & Clean', 'High-Tech & Futuristic', 'Bold & Experiential', 'Warm & Natural'];
const featureOptions = ['Private Meeting Room', 'Hospitality Bar', 'LED Screen Wall', 'Product Display Pods', 'Interactive Demo Area', 'Storage Room'];
const eventTypes = ['Exhibition', 'Product Launch', 'Conference', 'Gala', 'Corporate Event', 'Summit'];

const steps = [
    { id: 1, title: 'Basics' },
    { id: 2, title: 'Event' },
    { id: 3, title: 'Specs' },
    { id: 4, title: 'Style' },
    { id: 5, title: 'Features' }
];

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
    <div className="mb-12 relative px-4">
        <div className="flex justify-between items-center relative z-10">
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                    <div key={step.id} className="flex flex-col items-center">
                        <motion.div 
                            initial={false}
                            animate={{
                                backgroundColor: isActive ? '#D4AF76' : isCompleted ? '#2D767F' : '#1a1a1a',
                                borderColor: isActive ? '#D4AF76' : isCompleted ? '#2D767F' : '#333333',
                                color: isActive || isCompleted ? '#1a1a1a' : '#A99E96',
                                scale: isActive ? 1.2 : 1
                            }}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg`}
                        >
                            {isCompleted ? <Check size={18} className="text-white" /> : step.id}
                        </motion.div>
                        <span className={`text-xs mt-3 font-bold tracking-widest uppercase ${isActive ? 'text-fann-gold' : isCompleted ? 'text-fann-accent-teal' : 'text-gray-600'}`}>
                            {step.title}
                        </span>
                    </div>
                );
            })}
        </div>
        {/* Connecting Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-800 -z-0 transform -translate-y-1/2 px-8">
             <div className="h-full bg-gray-700 w-full rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-gradient-to-r from-fann-accent-teal to-fann-gold" 
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    </div>
);

const OptionCard: React.FC<{ label: string; isSelected: boolean; onClick: () => void; icon?: React.ReactNode }> = ({ label, isSelected, onClick, icon }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onClick}
        className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden w-full ${
            isSelected 
            ? 'border-fann-gold bg-fann-gold/10 shadow-[0_0_20px_rgba(212,175,118,0.2)]' 
            : 'border-white/5 bg-white/5 hover:border-fann-gold/30 hover:bg-white/10'
        }`}
    >
        <div className="flex items-center justify-between z-10 relative">
            <div className="flex items-center gap-3">
                {icon && <span className={`${isSelected ? 'text-fann-gold' : 'text-gray-500 group-hover:text-gray-300'}`}>{icon}</span>}
                <span className={`font-semibold text-lg ${isSelected ? 'text-fann-gold' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
            </div>
            {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={20} className="text-fann-gold" /></motion.div>}
        </div>
    </motion.button>
);

const InputField: React.FC<{ label: string; icon: React.ReactNode; type?: string; name: string; value: string | number; onChange: (e: any) => void; placeholder?: string; required?: boolean }> = ({ label, icon, type = "text", name, value, onChange, placeholder, required }) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-fann-gold ml-1 uppercase tracking-wider">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-fann-gold transition-colors">
                {icon}
            </div>
            <input 
                type={type} 
                name={name} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                required={required} 
                className="w-full bg-[#151515] border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-fann-gold focus:ring-1 focus:ring-fann-gold transition-all text-white placeholder-gray-600 shadow-inner" 
            />
        </div>
    </div>
);

const ExhibitionStudioPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Basics
        companyName: '',
        eventType: 'Exhibition',
        contactName: '',
        email: '',
        phone: '',
        websiteUrl: '',
        // Event Details
        eventName: '',
        eventDate: '',
        eventLocation: '',
        footfall: '',
        // Specs
        standWidth: 6,
        standLength: 3,
        boothType: 'Inline (1-side open)',
        // Style
        style: 'Modern & Corporate',
        // Features
        features: [] as string[],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    };

    const handleOptionClick = (field: string, value: string) => {
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

    const nextStep = () => {
        if (currentStep === 1) {
            if (!formData.companyName || !formData.email || !formData.contactName) return; 
        }
        setCurrentStep(prev => Math.min(prev + 1, steps.length));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basics
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Let's Start With The Basics</h2>
                            <p className="text-gray-400">Tell us a bit about who you are.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField label="Company Name" icon={<Building2 size={20}/>} name="companyName" value={formData.companyName} onChange={handleInputChange} required placeholder="Your Company" />
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-fann-gold ml-1 uppercase tracking-wider">Event Type</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-fann-gold">
                                        <Activity size={20}/>
                                    </div>
                                    <select 
                                        name="eventType" 
                                        value={formData.eventType} 
                                        onChange={handleInputChange} 
                                        className="w-full bg-[#151515] border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-fann-gold focus:ring-1 focus:ring-fann-gold transition-all text-white shadow-inner appearance-none"
                                    >
                                        {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                            </div>
                            <InputField label="Contact Name" icon={<Users size={20}/>} name="contactName" value={formData.contactName} onChange={handleInputChange} required placeholder="Full Name" />
                            <InputField label="Work Email" icon={<Mail size={20}/>} type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="name@company.com" />
                            <InputField label="Phone Number" icon={<Phone size={20}/>} type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+971 50 000 0000" />
                            <InputField label="Website" icon={<Globe size={20}/>} type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} placeholder="https://www.company.com" />
                        </div>
                    </div>
                );
            case 2: // Event Details
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Event Information</h2>
                            <p className="text-gray-400">Where will you be showcasing?</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <InputField label="Event Name" icon={<Briefcase size={20}/>} name="eventName" value={formData.eventName} onChange={handleInputChange} required placeholder="e.g. GITEX Global" />
                            </div>
                            <InputField label="Event Date" icon={<Calendar size={20}/>} type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} required />
                            <InputField label="Location / Venue" icon={<MapPin size={20}/>} name="eventLocation" value={formData.eventLocation} onChange={handleInputChange} required placeholder="e.g. Dubai World Trade Centre" />
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-fann-gold ml-1 uppercase tracking-wider">Expected Footfall</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['< 500', '500 - 2000', '2000+'].map((range) => (
                                        <button
                                            key={range}
                                            type="button"
                                            onClick={() => setFormData({...formData, footfall: range})}
                                            className={`py-4 rounded-xl border border-white/10 font-bold transition-all ${formData.footfall === range ? 'bg-fann-gold text-fann-charcoal' : 'bg-[#151515] text-gray-400 hover:bg-white/5'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3: // Specs
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Stand Structure</h2>
                            <p className="text-gray-400">Define the dimensions and layout of your space.</p>
                        </div>
                        
                        <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-xl text-white flex items-center gap-2"><Ruler className="text-fann-gold"/> Stand Dimensions</span>
                                <span className="text-fann-gold font-mono bg-fann-gold/10 px-4 py-2 rounded-lg border border-fann-gold/20">
                                    {formData.standWidth}m × {formData.standLength}m ({formData.standWidth * formData.standLength} sqm)
                                </span>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between text-sm text-gray-400 mb-3 font-bold uppercase tracking-wider"><span>Width</span><span>{formData.standWidth}m</span></div>
                                    <input type="range" name="standWidth" min="3" max="50" value={formData.standWidth} onChange={handleSliderChange} className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gray-800 accent-fann-gold" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm text-gray-400 mb-3 font-bold uppercase tracking-wider"><span>Length</span><span>{formData.standLength}m</span></div>
                                    <input type="range" name="standLength" min="3" max="50" value={formData.standLength} onChange={handleSliderChange} className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gray-800 accent-fann-gold" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-fann-gold ml-1 uppercase tracking-wider">Booth Configuration</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {boothTypes.map(type => (
                                    <OptionCard 
                                        key={type} 
                                        label={type} 
                                        isSelected={formData.boothType === type} 
                                        onClick={() => handleOptionClick('boothType', type)} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4: // Style
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Visual Style</h2>
                            <p className="text-gray-400">Choose the aesthetic that best represents your brand.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {designStyles.map(style => (
                                <OptionCard 
                                    key={style} 
                                    label={style} 
                                    isSelected={formData.style === style} 
                                    onClick={() => handleOptionClick('style', style)} 
                                />
                            ))}
                        </div>
                        <div className="bg-fann-gold/10 p-6 rounded-2xl flex items-start gap-4 border border-fann-gold/20 backdrop-blur-sm">
                            <Palette className="text-fann-gold flex-shrink-0 mt-1 w-8 h-8" />
                            <p className="text-sm text-gray-200 leading-relaxed">
                                <strong>FANN Intelligence:</strong> Our smart system will analyze your provided website to extract brand colors and identity, blending it seamlessly with your selected style for a bespoke result.
                            </p>
                        </div>
                    </div>
                );
            case 5: // Features
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Key Features</h2>
                            <p className="text-gray-400">What functional elements does your stand need?</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {featureOptions.map(feature => (
                                <OptionCard 
                                    key={feature} 
                                    label={feature} 
                                    isSelected={formData.features.includes(feature)} 
                                    onClick={() => handleFeatureChange(feature)} 
                                />
                            ))}
                        </div>
                        <div className="bg-[#151515] p-6 rounded-2xl border border-white/10 mt-8">
                            <h4 className="text-fann-gold font-bold mb-4 flex items-center gap-2 text-lg uppercase tracking-wider"><SlidersHorizontal size={20}/> Final Summary</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                                <div className="p-3 bg-white/5 rounded-lg"><strong>Company:</strong> {formData.companyName}</div>
                                <div className="p-3 bg-white/5 rounded-lg"><strong>Event:</strong> {formData.eventName}</div>
                                <div className="p-3 bg-white/5 rounded-lg"><strong>Size:</strong> {formData.standWidth}m x {formData.standLength}m</div>
                                <div className="p-3 bg-white/5 rounded-lg"><strong>Style:</strong> {formData.style}</div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatedPage>
            <SEO
                title="Exhibition Stand Designer | FANN Studio"
                description="Design your custom exhibition stand in minutes with our intelligent wizard."
            />
            <div className="min-h-screen bg-[#050505] pt-32 pb-20 text-white selection:bg-fann-gold selection:text-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-fann-gold to-yellow-600 rounded-2xl mb-6 shadow-lg shadow-fann-gold/20 transform rotate-3">
                            <Building2 className="h-10 w-10 text-black" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4">Exhibition Designer</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Create a world-class concept for your next show in 5 simple steps.</p>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 p-6 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-fann-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fann-accent-teal/10 rounded-full blur-[100px] pointer-events-none"></div>

                        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

                        <form onSubmit={handleSubmit} className="relative z-10 min-h-[400px] flex flex-col justify-between">
                            
                            {renderStepContent()}

                            <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`flex items-center gap-2 font-bold px-6 py-3 rounded-full transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <ArrowLeft size={20} /> Back
                                </button>

                                {currentStep < steps.length ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex items-center gap-3 bg-fann-gold text-black font-bold py-4 px-10 rounded-full hover:bg-white transition-all shadow-lg shadow-fann-gold/20 hover:scale-105"
                                    >
                                        Next Step <ArrowRight size={20} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="flex items-center gap-3 bg-gradient-to-r from-fann-gold to-[#bfa172] text-black font-bold py-4 px-12 rounded-full hover:shadow-[0_0_40px_rgba(212,175,118,0.4)] transition-all transform hover:-translate-y-1"
                                    >
                                        <Sparkles size={20} /> Generate Concept
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;