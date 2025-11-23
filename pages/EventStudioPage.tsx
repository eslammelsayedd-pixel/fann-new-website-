import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Crown, Palette, Sparkles, SlidersHorizontal, Users, Check, ArrowLeft, ArrowRight, Building, Mail, Phone, Calendar, MapPin, Music } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const eventTypes = ['Gala Dinner', 'Product Launch', 'Corporate Conference', 'Brand Activation', 'Award Ceremony', 'Networking Event'];
const designStyles = ['Modern & Corporate', 'Luxury & Opulent', 'Themed & Immersive', 'Minimalist & Chic', 'Futuristic & Tech', 'Bohemian & Natural'];
const featureOptions = ['Stage & AV Production', 'Thematic Decor', 'Live Entertainment Area', 'Catering & Bar Zone', 'VIP Lounge', 'Interactive Elements', 'Photo Ops/Backdrops'];

const steps = [
    { id: 1, title: 'Basics' },
    { id: 2, title: 'Details' },
    { id: 3, title: 'Theme' },
    { id: 4, title: 'Features' }
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

const OptionCard: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => (
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
            <span className={`font-semibold text-lg ${isSelected ? 'text-fann-gold' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
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

const EventStudioPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        eventName: '',
        eventDate: '',
        location: '',
        guestCount: 200,
        eventType: 'Gala Dinner',
        style: 'Luxury & Opulent',
        features: [] as string[],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    };

    const handleOptionClick = (field: 'eventType' | 'style', value: string) => {
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
             if (!formData.companyName || !formData.email) return;
        }
        setCurrentStep(prev => Math.min(prev + 1, steps.length));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/fann-studio/event/result', { 
            state: { formData } 
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basics
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Event Essentials</h2>
                            <p className="text-gray-400">Tell us about you and your event goals.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField label="Company Name" icon={<Crown size={20}/>} name="companyName" value={formData.companyName} onChange={handleInputChange} required placeholder="Host Company" />
                            <InputField label="Contact Name" icon={<Users size={20}/>} name="contactName" value={formData.contactName} onChange={handleInputChange} required placeholder="Your Name" />
                            <InputField label="Email" icon={<Mail size={20}/>} type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="email@company.com" />
                            <InputField label="Phone" icon={<Phone size={20}/>} type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+971..." />
                        </div>
                    </div>
                );
            case 2: // Details
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                         <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Event Specifics</h2>
                            <p className="text-gray-400">Define the scope and type of event.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                             <InputField label="Event Name" icon={<FileText size={20}/>} name="eventName" value={formData.eventName} onChange={handleInputChange} required placeholder="e.g. Annual Gala" />
                             <InputField label="Date" icon={<Calendar size={20}/>} type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} required />
                             <div className="md:col-span-2">
                                <InputField label="Venue / Location" icon={<MapPin size={20}/>} name="location" value={formData.location} onChange={handleInputChange} required placeholder="e.g. Armani Hotel Dubai" />
                             </div>
                        </div>

                        <div className="bg-[#151515] p-6 rounded-2xl border border-white/10 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold text-lg text-white flex items-center gap-2"><Users size={20} className="text-fann-gold"/> Guest Count</span>
                                <span className="text-fann-gold font-mono bg-fann-gold/10 px-3 py-1 rounded-lg border border-fann-gold/20">
                                    {formData.guestCount}
                                </span>
                            </div>
                            <input type="range" name="guestCount" min="50" max="2000" step="50" value={formData.guestCount} onChange={handleSliderChange} className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gray-800 accent-fann-gold" />
                             <div className="flex justify-between text-xs text-gray-500 mt-2 font-bold uppercase"><span>50</span><span>2000+</span></div>
                        </div>

                         <div>
                            <label className="text-sm font-bold text-fann-gold ml-1 uppercase tracking-wider mb-3 block">Event Type</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {eventTypes.map(type => (
                                    <OptionCard 
                                        key={type} 
                                        label={type} 
                                        isSelected={formData.eventType === type} 
                                        onClick={() => handleOptionClick('eventType', type)} 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 3: // Theme
                 return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Atmosphere & Style</h2>
                            <p className="text-gray-400">Set the mood for your guests.</p>
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
                    </div>
                );
            case 4: // Features
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Event Features</h2>
                            <p className="text-gray-400">Select key elements required for success.</p>
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
                            <h4 className="text-fann-gold font-bold mb-4 flex items-center gap-2 text-lg uppercase tracking-wider"><SlidersHorizontal size={20}/> Concept Summary</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                                <div className="p-3 bg-white/5 rounded-lg"><strong>Event:</strong> {formData.eventName}</div>
                                <div className="p-3 bg-white/5 rounded-lg"><strong>Type:</strong> {formData.eventType}</div>
                                <div className="p-3 bg-white/5 rounded-lg"><strong>Guests:</strong> {formData.guestCount}</div>
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
                title="Event Design Studio | FANN"
                description="Create a stunning mood board and concept visual for your next corporate event."
            />
            <div className="min-h-screen bg-[#050505] pt-32 pb-20 text-white selection:bg-fann-gold selection:text-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                         <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-fann-gold to-yellow-600 rounded-2xl mb-6 shadow-lg shadow-fann-gold/20 transform rotate-3">
                            <Crown className="h-10 w-10 text-black" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-4">Event Designer</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Craft an unforgettable experience in 4 simple steps.</p>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 p-6 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
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

export default EventStudioPage;