
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Sparkles, Check, ArrowRight, ArrowLeft, Ruler, AlertCircle, Globe, Mail, Phone, User, Upload, Loader2, LayoutGrid, Box, PenTool, Scan } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const steps = [
    { id: 1, title: 'Brand & Vision' },
    { id: 2, title: 'The Blueprint' },
    { id: 3, title: 'Unlock Designs' }
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
    { code: '+91', country: 'IND' },
    { code: '+86', country: 'CHN' },
    { code: 'Other', country: 'Other' }
];

const boothConfigs = [
    { id: 'Island', label: 'Island (4-side)', icon: <Box size={24} /> },
    { id: 'Peninsula', label: 'Peninsula (3-side)', icon: <LayoutGrid size={24} /> },
    { id: 'Corner', label: 'Corner (2-side)', icon: <Building2 size={24} /> },
    { id: 'Inline', label: 'Inline (1-side)', icon: <ArrowRight size={24} /> }
];

const featuresList = [
    'LED Video Wall', 'Meeting Room', 'Hospitality Bar', 
    'Hanging Banner', 'Product Display', 'Interactive Screens',
    'Storage Room', 'Reception Desk', 'Lounge Area',
    'Double Decker', 'Green Wall', 'Podium/Stage'
];

const publicEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'live.com', 'me.com', 'protonmail.com'];

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

const ExhibitionStudioPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<{[key: string]: boolean | string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [scannedData, setScannedData] = useState({ colors: false, industry: false });

    const [formData, setFormData] = useState({
        // Step 1
        companyName: '',
        websiteUrl: '',
        eventName: '',
        logo: null as string | null,
        brief: '',
        // Step 2 (Specs)
        standWidth: 6,
        standLength: 3,
        standHeight: 4,
        boothType: 'Island', 
        features: [] as string[],
        // Step 3 (Lead)
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+971',
        phone: '',
    });

    // Simulation of AI scanning
    useEffect(() => {
        if (formData.websiteUrl && formData.websiteUrl.length > 8 && !scannedData.industry) {
            const timer = setTimeout(() => setScannedData(prev => ({ ...prev, industry: true })), 2000);
            return () => clearTimeout(timer);
        }
    }, [formData.websiteUrl]);

    useEffect(() => {
        if (formData.logo && !scannedData.colors) {
            const timer = setTimeout(() => setScannedData(prev => ({ ...prev, colors: true })), 1500);
            return () => clearTimeout(timer);
        }
    }, [formData.logo]);

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

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
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
            if (!formData.websiteUrl) newErrors.websiteUrl = true;
            if (!formData.eventName) newErrors.eventName = true;
        } else if (step === 2) {
            // Sliders and radio buttons always have values, check features if needed? No, optional.
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
                // Fire and forget lead capture
                fetch('/api/send-inquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        type: 'Exhibition Studio Design Request',
                        ...formData
                    })
                });

                // Navigate to results where actual generation happens
                navigate('/fann-studio/exhibition/result', { 
                    state: { 
                        formData: {
                            ...formData,
                            boothSize: formData.standWidth * formData.standLength
                        }
                    } 
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
            <SEO title="Exhibition Studio | Design Your Stand" description="AI-Powered Exhibition Stand Designer" />
            <div className="min-h-screen bg-[#050505] pt-32 pb-20 text-white selection:bg-fann-gold selection:text-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight">Exhibition Studio</h1>
                        <p className="text-xl text-gray-500">Design your presence in 3 steps.</p>
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
                                    All fields are mandatory to help with the design. {errors.email && typeof errors.email === 'string' && `(${errors.email})`}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between">
                            <div className="flex-grow">
                                {currentStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-serif text-white">Tell us about your brand</h2>
                                            <p className="text-gray-500 text-sm">Our AI will analyze your digital identity.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Company Name</label>
                                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={getInputClass('companyName')} placeholder="e.g. TechGlobal" />
                                                </div>
                                                <div className="relative">
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest flex items-center justify-between">
                                                        Website
                                                        {scannedData.industry && <span className="text-green-400 flex items-center gap-1 lowercase normal-case"><Check size={10}/> info collected</span>}
                                                    </label>
                                                    <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} className={getInputClass('websiteUrl')} placeholder="https://..." />
                                                    {formData.websiteUrl.length > 5 && !scannedData.industry && (
                                                        <span className="absolute right-0 bottom-4 text-xs text-fann-gold animate-pulse flex items-center gap-1"><Scan size={10}/> scanning...</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Event Name</label>
                                                    <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className={getInputClass('eventName')} placeholder="e.g. GITEX 2025" />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-2 block flex justify-between">
                                                        Logo
                                                        {scannedData.colors && <span className="text-green-400 flex items-center gap-1 lowercase normal-case"><Check size={10}/> colors extracted</span>}
                                                    </label>
                                                    <div className="border border-dashed border-white/20 rounded-sm h-32 flex items-center justify-center relative group hover:border-fann-gold transition-colors bg-white/5">
                                                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                                        {formData.logo ? (
                                                            <img src={formData.logo} alt="Uploaded" className="h-20 object-contain" />
                                                        ) : (
                                                            <div className="text-center text-gray-500 group-hover:text-fann-gold">
                                                                <Upload className="mx-auto mb-2" size={20}/>
                                                                <span className="text-xs uppercase tracking-widest">Upload Logo</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-2 block">Your Vision (Brief)</label>
                                                    <textarea 
                                                        name="brief" 
                                                        value={formData.brief} 
                                                        onChange={handleInputChange} 
                                                        rows={3}
                                                        className="w-full bg-transparent border border-white/20 p-4 text-white text-sm placeholder-gray-600 focus:border-fann-gold focus:outline-none rounded-sm resize-none"
                                                        placeholder="Describe your goals, vibe, or specific requirements..."
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                        <div className="text-center mb-6">
                                            <h2 className="text-2xl font-serif text-white">Define your space</h2>
                                            <p className="text-gray-500 text-sm">Dimensions, layout, and must-haves.</p>
                                        </div>

                                        {/* Dimensions */}
                                        <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                                            <h3 className="text-fann-gold text-xs font-bold uppercase tracking-widest mb-6">Dimensions (Meters)</h3>
                                            <div className="grid grid-cols-3 gap-8">
                                                {['Width', 'Length', 'Height'].map(dim => (
                                                    <div key={dim}>
                                                        <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase">
                                                            <span>{dim}</span>
                                                            <span className="text-white font-mono">
                                                                {dim === 'Width' ? formData.standWidth : dim === 'Length' ? formData.standLength : formData.standHeight}m
                                                            </span>
                                                        </div>
                                                        <input 
                                                            type="range" 
                                                            name={`stand${dim}`}
                                                            min="3" max={dim === 'Height' ? "10" : "50"} 
                                                            value={dim === 'Width' ? formData.standWidth : dim === 'Length' ? formData.standLength : formData.standHeight} 
                                                            onChange={handleSliderChange} 
                                                            className="w-full h-1 bg-gray-700 appearance-none cursor-pointer accent-fann-gold" 
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Config & Features */}
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <h3 className="text-fann-gold text-xs font-bold uppercase tracking-widest mb-4">Layout</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {boothConfigs.map(config => (
                                                        <button
                                                            key={config.id}
                                                            type="button"
                                                            onClick={() => setFormData({...formData, boothType: config.id})}
                                                            className={`p-3 border flex items-center gap-3 text-sm transition-all ${formData.boothType === config.id ? 'border-fann-gold bg-fann-gold text-black font-bold' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                                                        >
                                                            {config.icon}
                                                            {config.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-fann-gold text-xs font-bold uppercase tracking-widest mb-4">Key Features</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {featuresList.map(f => (
                                                        <button
                                                            key={f}
                                                            type="button"
                                                            onClick={() => handleFeatureChange(f)}
                                                            className={`px-3 py-2 text-xs uppercase tracking-wider border transition-all rounded-sm ${formData.features.includes(f) ? 'bg-white text-black border-white font-bold' : 'border-white/10 text-gray-500 hover:text-white hover:border-white/30'}`}
                                                        >
                                                            {f}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto space-y-8">
                                        <div className="text-center mb-8">
                                            <Sparkles className="w-12 h-12 text-fann-gold mx-auto mb-4" />
                                            <h2 className="text-3xl font-serif text-white">Unlock 4 Unique Concepts</h2>
                                            <p className="text-gray-500">Enter your details to reveal your custom designs.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="relative">
                                                <User className="absolute left-0 top-3 text-gray-500" size={16}/>
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

export default ExhibitionStudioPage;
