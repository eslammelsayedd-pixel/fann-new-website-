
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Crown, Palette, Sparkles, SlidersHorizontal, Users, Check, ArrowLeft, ArrowRight, Building, Mail, Phone, Calendar, MapPin, Music, Mic2, Wine, Lightbulb, Aperture, Loader2 } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const eventTypes = [
    { id: 'Gala Dinner', label: 'Gala Dinner', icon: <Wine size={24} /> },
    { id: 'Product Launch', label: 'Product Launch', icon: <RocketIcon /> },
    { id: 'Conference', label: 'Conference', icon: <Mic2 size={24} /> },
    { id: 'Brand Activation', label: 'Activation', icon: <Aperture size={24} /> },
    { id: 'Award Ceremony', label: 'Award Show', icon: <Crown size={24} /> },
    { id: 'Networking', label: 'Networking', icon: <Users size={24} /> }
];

function RocketIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;
}

const featuresList = [
    'Stage & AV Production', 'Immersive Projection', 'Live Entertainment', 
    'VIP Lounge Area', 'Interactive Photo Ops', 'Sustainable Decor',
    'Catering & Bar Station', 'Registration Tech', 'Social Media Wall',
    'Custom Fabrication', 'Outdoor Cooling', 'Holographic Display'
];

const countryCodes = [
    { code: '+971', country: 'UAE' },
    { code: '+966', country: 'KSA' },
    { code: '+974', country: 'QAT' },
    { code: '+973', country: 'BHR' },
    { code: '+968', country: 'OMN' },
    { code: '+965', country: 'KWT' },
    { code: '+44', country: 'UK' },
    { code: '+1', country: 'USA' },
    { code: 'Other', country: 'Other' }
];

const steps = [
    { id: 1, title: 'The Vision' },
    { id: 2, title: 'The Experience' },
    { id: 3, title: 'Unlock Concepts' }
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
                                backgroundColor: isActive ? '#C9A962' : isCompleted ? '#333' : '#1a1a1a',
                                borderColor: isActive ? '#C9A962' : isCompleted ? '#333' : '#333',
                                color: isActive ? '#000' : isCompleted ? '#fff' : '#666',
                                scale: isActive ? 1.1 : 1
                            }}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg z-20`}
                        >
                            {isCompleted ? <Check size={18} /> : step.id}
                        </motion.div>
                        <span className={`text-xs mt-3 font-bold tracking-widest uppercase ${isActive ? 'text-fann-gold' : isCompleted ? 'text-white' : 'text-gray-700'}`}>
                            {step.title}
                        </span>
                    </div>
                );
            })}
        </div>
        <div className="absolute top-5 left-0 w-full px-8 -z-0">
             <div className="h-0.5 bg-gray-800 w-full rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-gradient-to-r from-fann-gold/50 to-fann-gold" 
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    </div>
);

const publicEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'live.com', 'me.com', 'protonmail.com'];

const EventStudioPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: boolean | string}>({});
    const [detectedVibe, setDetectedVibe] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        // Step 1
        companyName: '',
        eventName: '',
        eventDate: '',
        location: '',
        guestCount: 200,
        eventType: 'Gala Dinner',
        brief: '',
        // Step 2
        features: [] as string[],
        // Step 3
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+971',
        phone: '',
    });

    // Simulating AI Analysis for "Vibe"
    useEffect(() => {
        if (formData.eventType && formData.eventName.length > 3) {
            const timer = setTimeout(() => {
                const vibes = ['Elegant', 'High-Tech', 'Corporate', 'Celebratory', 'Networking-Focused'];
                setDetectedVibe(vibes[Math.floor(Math.random() * vibes.length)]);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [formData.eventName, formData.eventType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: parseInt(e.target.value, 10) });
    };

    const handleFeatureChange = (feature: string) => {
        setFormData(prev => {
            const newFeatures = prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature];
            return { ...prev, features: newFeatures };
        });
    };

    const isWorkEmail = (email: string) => {
        if (!email.includes('@')) return false;
        const domain = email.split('@')[1].toLowerCase();
        return !publicEmailDomains.includes(domain);
    };

    const validateStep = (step: number) => {
        const newErrors: any = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.companyName) newErrors.companyName = true;
            if (!formData.eventName) newErrors.eventName = true;
            if (!formData.eventDate) newErrors.eventDate = true;
            if (!formData.location) newErrors.location = true;
        } else if (step === 3) {
            if (!formData.firstName) newErrors.firstName = true;
            if (!formData.lastName) newErrors.lastName = true;
            if (!formData.phone) newErrors.phone = true;
            if (!formData.email) {
                newErrors.email = true;
            } else if (!isWorkEmail(formData.email)) {
                newErrors.email = "Please use a work email address.";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }
        return isValid;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            setIsSubmitting(true);
            
            try {
                // Fire lead inquiry
                fetch('/api/send-inquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        type: 'Event Studio Concept Request',
                        ...formData
                    })
                });

                // Navigate to results
                navigate('/fann-studio/event/result', { 
                    state: { formData } 
                });
            } catch (error) {
                console.error("Submission error", error);
                setIsSubmitting(false);
            }
        }
    };

    const getInputClass = (fieldName: string) => `w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-gray-600 transition-all duration-300 focus:outline-none focus:border-fann-gold rounded-none font-light ${errors[fieldName] ? 'border-red-500' : ''}`;

    return (
        <AnimatedPage>
            <SEO
                title="Event Design Studio | FANN"
                description="Create stunning mood boards and concept visuals for your next corporate event."
            />
            <div className="min-h-screen bg-[#050505] pt-32 pb-20 text-white selection:bg-fann-gold selection:text-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight">Event Studio</h1>
                        <p className="text-xl text-gray-500">Orchestrate your event in 3 steps.</p>
                    </div>

                    <div className="bg-[#0A0A0A] border border-white/5 p-6 sm:p-12 shadow-2xl relative overflow-hidden rounded-sm min-h-[600px] flex flex-col">
                        
                        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

                        <AnimatePresence mode="wait">
                            {Object.keys(errors).length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-900/20 border border-red-500/50 text-red-200 p-3 rounded mb-6 text-center text-sm font-semibold"
                                >
                                    Please complete all required fields correctly. {errors.email && typeof errors.email === 'string' && `(${errors.email})`}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between">
                            <div className="flex-grow">
                                {currentStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-serif text-white">The Vision</h2>
                                            <p className="text-gray-500 text-sm">Set the stage for your event.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Host Company</label>
                                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={getInputClass('companyName')} placeholder="e.g. Emaar" />
                                                </div>
                                                <div className="relative">
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest flex justify-between">
                                                        Event Name
                                                        {detectedVibe && <span className="text-green-400 flex items-center gap-1 lowercase normal-case animate-pulse"><Sparkles size={10}/> {detectedVibe} vibe detected</span>}
                                                    </label>
                                                    <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className={getInputClass('eventName')} placeholder="e.g. Annual Gala 2025" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Date</label>
                                                    <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className={getInputClass('eventDate')} />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Venue/Location</label>
                                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className={getInputClass('location')} placeholder="e.g. Armani Hotel, Dubai" />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-4 block">Event Type</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {eventTypes.map(type => (
                                                            <button
                                                                key={type.id}
                                                                type="button"
                                                                onClick={() => setFormData({...formData, eventType: type.id})}
                                                                className={`p-3 border flex flex-col items-center justify-center gap-2 text-xs transition-all rounded-sm h-24 ${formData.eventType === type.id ? 'border-fann-gold bg-fann-gold text-black font-bold' : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'}`}
                                                            >
                                                                {type.icon}
                                                                {type.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-2 block flex justify-between">
                                                        Guest Count <span className="text-white font-mono">{formData.guestCount}</span>
                                                    </label>
                                                    <input 
                                                        type="range" 
                                                        name="guestCount" 
                                                        min="50" max="5000" step="50" 
                                                        value={formData.guestCount} 
                                                        onChange={handleSliderChange} 
                                                        className="w-full h-1 bg-gray-700 appearance-none cursor-pointer accent-fann-gold" 
                                                    />
                                                    <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono uppercase"><span>50</span><span>5000+</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-serif text-white">The Experience</h2>
                                            <p className="text-gray-500 text-sm">Curate the atmosphere.</p>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-4 block">Your Brief / Theme</label>
                                            <textarea 
                                                name="brief" 
                                                value={formData.brief} 
                                                onChange={handleInputChange} 
                                                rows={4}
                                                className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm placeholder-gray-500 focus:border-fann-gold focus:outline-none rounded-sm resize-none"
                                                placeholder="Describe the mood, colors, or specific theme you have in mind (e.g., 'Futuristic Oasis', 'Great Gatsby', 'Sustainable Luxury')..."
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-4 block">Key Features & Tech</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {featuresList.map(f => (
                                                    <button
                                                        key={f}
                                                        type="button"
                                                        onClick={() => handleFeatureChange(f)}
                                                        className={`p-3 text-xs uppercase tracking-wider border transition-all rounded-sm text-center ${formData.features.includes(f) ? 'bg-white text-black border-white font-bold' : 'border-white/10 text-gray-500 hover:text-white hover:border-white/30'}`}
                                                    >
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto space-y-8">
                                        <div className="text-center mb-8">
                                            <Sparkles className="w-12 h-12 text-fann-gold mx-auto mb-4" />
                                            <h2 className="text-3xl font-serif text-white">Unlock 4 Unique Concepts</h2>
                                            <p className="text-gray-500">Enter your details to see your event reimagined in 4 distinct styles.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="relative">
                                                <Users className="absolute left-0 top-3 text-gray-500" size={16}/>
                                                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`${getInputClass('firstName')} pl-6`} placeholder="First Name *" />
                                            </div>
                                            <div className="relative">
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`${getInputClass('lastName')} pl-2`} placeholder="Last Name *" />
                                            </div>
                                            <div className="md:col-span-2 relative">
                                                <Mail className="absolute left-0 top-3 text-gray-500" size={16}/>
                                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`${getInputClass('email')} pl-6`} placeholder="Work Email (No Gmail/Yahoo) *" />
                                            </div>
                                            <div className="md:col-span-2 flex gap-3">
                                                <select 
                                                    name="countryCode" 
                                                    value={formData.countryCode} 
                                                    onChange={handleInputChange}
                                                    className="bg-transparent border-b border-white/20 py-4 w-24 text-white focus:border-fann-gold focus:outline-none"
                                                >
                                                    {countryCodes.map(c => <option key={c.code} value={c.code} className="bg-black">{c.code}</option>)}
                                                </select>
                                                <div className="relative flex-grow">
                                                    <Phone className="absolute left-0 top-3 text-gray-500" size={16}/>
                                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`${getInputClass('phone')} pl-6`} placeholder="Phone Number *" />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 text-center pt-4">* We respect your privacy. Your details are only used to share your designs.</p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`flex items-center gap-2 font-bold uppercase tracking-widest text-sm transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>

                                {currentStep < steps.length ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="btn-gold"
                                    >
                                        Next Step
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-gradient-to-r from-fann-gold to-[#bfa172] text-black font-bold py-4 px-12 rounded-sm uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(201,169,98,0.4)] transition-all disabled:opacity-70 flex items-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                                        Surprise Me
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
