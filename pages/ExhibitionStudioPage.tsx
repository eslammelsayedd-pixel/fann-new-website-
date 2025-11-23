
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Sparkles, Check, ArrowRight, ArrowLeft, Ruler, AlertCircle, Globe, Mail, Phone, User, Upload, Loader2, Palette, Briefcase, ScanSearch } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';

const steps = [
    { id: 1, title: 'Company' },
    { id: 2, title: 'Event' },
    { id: 3, title: 'Specs' },
    { id: 4, title: 'Requirements' }
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
    { 
        id: 'Island', 
        label: 'Island (4-side open)', 
        icon: (isSelected: boolean) => (
            <svg viewBox="0 0 100 100" className={`w-16 h-16 ${isSelected ? 'stroke-fann-gold' : 'stroke-gray-500'} fill-none stroke-2`}>
                <rect x="30" y="30" width="40" height="40" rx="2" className={isSelected ? 'fill-fann-gold/20' : 'fill-white/5'} />
                <path d="M50 20 L50 10 M50 10 L45 15 M50 10 L55 15" /> {/* Top */}
                <path d="M50 80 L50 90 M50 90 L45 85 M50 90 L55 85" /> {/* Bottom */}
                <path d="M20 50 L10 50 M10 50 L15 45 M10 50 L15 55" /> {/* Left */}
                <path d="M80 50 L90 50 M90 50 L85 45 M90 50 L85 55" /> {/* Right */}
            </svg>
        )
    },
    { 
        id: 'Peninsula', 
        label: 'Peninsula (3-side open)',
        icon: (isSelected: boolean) => (
            <svg viewBox="0 0 100 100" className={`w-16 h-16 ${isSelected ? 'stroke-fann-gold' : 'stroke-gray-500'} fill-none stroke-2`}>
                <rect x="30" y="30" width="40" height="40" rx="2" className={isSelected ? 'fill-fann-gold/20' : 'fill-white/5'} />
                <path d="M25 30 L25 70" className="stroke-gray-600 stroke-[4px]" /> {/* Wall */}
                <path d="M50 20 L50 10 M50 10 L45 15 M50 10 L55 15" /> {/* Top */}
                <path d="M50 80 L50 90 M50 90 L45 85 M50 90 L55 85" /> {/* Bottom */}
                <path d="M80 50 L90 50 M90 50 L85 45 M90 50 L85 55" /> {/* Right */}
            </svg>
        )
    },
    { 
        id: 'Corner', 
        label: 'Corner (2-side open)',
        icon: (isSelected: boolean) => (
            <svg viewBox="0 0 100 100" className={`w-16 h-16 ${isSelected ? 'stroke-fann-gold' : 'stroke-gray-500'} fill-none stroke-2`}>
                <rect x="30" y="30" width="40" height="40" rx="2" className={isSelected ? 'fill-fann-gold/20' : 'fill-white/5'} />
                <path d="M25 30 L25 70 M25 70 L70 70" className="stroke-gray-600 stroke-[4px]" /> {/* Walls */}
                <path d="M50 20 L50 10 M50 10 L45 15 M50 10 L55 15" /> {/* Top */}
                <path d="M80 50 L90 50 M90 50 L85 45 M90 50 L85 55" /> {/* Right */}
            </svg>
        )
    },
    { 
        id: 'Inline', 
        label: 'Inline (1-side open)',
        icon: (isSelected: boolean) => (
            <svg viewBox="0 0 100 100" className={`w-16 h-16 ${isSelected ? 'stroke-fann-gold' : 'stroke-gray-500'} fill-none stroke-2`}>
                <rect x="30" y="30" width="40" height="40" rx="2" className={isSelected ? 'fill-fann-gold/20' : 'fill-white/5'} />
                <path d="M25 30 L25 70 M25 70 L75 70 M75 70 L75 30" className="stroke-gray-600 stroke-[4px]" /> {/* Walls */}
                <path d="M50 20 L50 10 M50 10 L45 15 M50 10 L55 15" /> {/* Top */}
            </svg>
        )
    }
];

const requirementsList = [
    'Hanging Structure / Banner', 'Reception Desk', 'Private Meeting Room', 
    'Storage Area', 'LED Video Wall', 'Product Display Shelving', 
    'Bar / Hospitality Area', 'Interactive Demo Zone', 'Lounge Seating', 
    'Raised Flooring', 'Touchscreens / Kiosks', 'Brochure Stand'
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
                                backgroundColor: isActive ? '#D4AF76' : isCompleted ? '#333' : '#1a1a1a',
                                borderColor: isActive ? '#D4AF76' : isCompleted ? '#333' : '#333',
                                color: isActive ? '#000' : isCompleted ? '#fff' : '#666',
                                scale: isActive ? 1.1 : 1
                            }}
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 shadow-lg`}
                        >
                            {isCompleted ? <Check size={16} /> : step.id}
                        </motion.div>
                        <span className={`text-[10px] md:text-xs mt-3 font-bold tracking-widest uppercase ${isActive ? 'text-fann-gold' : isCompleted ? 'text-white' : 'text-gray-700'}`}>
                            {step.title}
                        </span>
                    </div>
                );
            })}
        </div>
        <div className="absolute top-4 md:top-5 left-0 w-full px-8 -z-0">
             <div className="h-0.5 bg-gray-800 w-full rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-fann-gold" 
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    </div>
);

interface ValidationErrors {
    [key: string]: boolean | string;
}

interface AnalysisResult {
    industry: string;
    colors: string[];
    vibe: string;
}

const ExhibitionStudioPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [shake, setShake] = useState(false);
    const [showErrorBanner, setShowErrorBanner] = useState(false);
    
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const [formData, setFormData] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        countryCode: '+971',
        phone: '',
        websiteUrl: '',
        logo: null as string | null,
        eventName: '',
        eventDate: '',
        eventLocation: '',
        eventIndustry: '',
        standWidth: 6,
        standLength: 3,
        boothType: 'Inline',
        features: [] as string[],
    });

    const isBusinessEmail = (email: string) => {
        const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'live.com', 'me.com'];
        const domain = email.split('@')[1];
        return domain && !publicDomains.includes(domain.toLowerCase());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
            if (Object.keys(errors).length <= 1) setShowErrorBanner(false);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logo: reader.result as string }));
                if (errors.logo) {
                    setErrors(prev => { const { logo, ...rest } = prev; return rest; });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeBrand = async () => {
        if (!formData.websiteUrl || !formData.logo) {
            setErrors(prev => ({ 
                ...prev, 
                websiteUrl: !formData.websiteUrl ? 'Required for analysis' : false,
                logo: !formData.logo ? 'Required for analysis' : false 
            }));
            return;
        }

        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/analyze-brand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    logo: formData.logo.split(',')[1], // Send base64 data only
                    mimeType: formData.logo.match(/data:(.*);base64/)?.[1] || 'image/png',
                    websiteUrl: formData.websiteUrl
                })
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data);
            } else {
                console.error("Analysis failed");
                // Fallback mock if API fails or isn't set up yet
                setAnalysisResult({
                    industry: "Technology & Innovation",
                    colors: ["#000000", "#D4AF76", "#FFFFFF"],
                    vibe: "Modern, Professional, High-End"
                });
            }
        } catch (e) {
            console.error(e);
             // Fallback mock
             setAnalysisResult({
                industry: "Detected Industry",
                colors: ["#333333", "#CCCCCC"],
                vibe: "Corporate"
            });
        } finally {
            setIsAnalyzing(false);
        }
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

    const validateStep = (step: number) => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!formData.firstName) newErrors.firstName = true;
            if (!formData.lastName) newErrors.lastName = true;
            if (!formData.phone) newErrors.phone = true;
            if (!formData.websiteUrl) newErrors.websiteUrl = true;
            if (!formData.logo) newErrors.logo = "Logo is mandatory";
            
            if (!formData.email) {
                newErrors.email = true;
            } else if (!isBusinessEmail(formData.email)) {
                newErrors.email = "Please use a work email (no Gmail/Outlook)";
            }
        } else if (step === 2) {
             if (!formData.eventName) newErrors.eventName = true;
             // Date and Location are optional but good to have
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setShake(true);
            setShowErrorBanner(true);
            setTimeout(() => setShake(false), 500);
            isValid = false;
        } else {
            setShowErrorBanner(false);
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
        setShowErrorBanner(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            navigate('/fann-studio/exhibition/result', { 
                state: { 
                    formData: {
                        ...formData,
                        boothSize: formData.standWidth * formData.standLength,
                        analysis: analysisResult
                    }
                } 
            });
        }
    };

    const getInputClass = (fieldName: string) => `input-premium ${errors[fieldName] ? 'border-red-500 ring-1 ring-red-500 bg-red-900/10' : ''}`;

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Company Essentials</h2>
                            <p className="text-gray-400">Tell us about your brand.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Company Name (Optional)</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="input-premium pl-12" placeholder="e.g. TechGlobal" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest flex items-center gap-1">First Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`${getInputClass('firstName')} pl-12`} placeholder="John" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest flex items-center gap-1">Last Name <span className="text-red-500">*</span></label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={getInputClass('lastName')} placeholder="Doe" />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest flex items-center gap-1">Work Email <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`${getInputClass('email')} pl-12`} placeholder="name@company.com" />
                                </div>
                                {errors.email && (
                                    <span className="text-red-400 text-xs flex items-center gap-1 mt-1 font-semibold">
                                        <AlertCircle size={10} /> {typeof errors.email === 'string' ? errors.email : 'Required'}
                                    </span>
                                )}
                            </div>

                            <div className="md:col-span-1 space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest flex items-center gap-1">Phone <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <select 
                                        name="countryCode" 
                                        value={formData.countryCode} 
                                        onChange={handleInputChange}
                                        className="bg-[#151515] border border-white/10 text-white px-2 py-4 w-24 focus:border-fann-gold focus:outline-none"
                                    >
                                        {countryCodes.map(c => <option key={c.country} value={c.code}>{c.code} ({c.country})</option>)}
                                    </select>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={getInputClass('phone')} placeholder="50 123 4567" />
                                </div>
                            </div>

                             <div className="md:col-span-1 space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest flex items-center gap-1">Website <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                                    <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} className={`${getInputClass('websiteUrl')} pl-12`} placeholder="https://..." />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest flex items-center gap-1">Company Logo <span className="text-red-500">*</span></label>
                                <div className={`border-2 border-dashed ${errors.logo ? 'border-red-500' : 'border-white/20'} rounded-lg p-6 text-center hover:bg-white/5 transition-colors relative`}>
                                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    {formData.logo ? (
                                        <div className="flex items-center justify-center gap-4">
                                            <img src={formData.logo} alt="Logo Preview" className="h-12 w-auto object-contain" />
                                            <span className="text-green-400 text-sm flex items-center gap-1"><Check size={14}/> Uploaded</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <Upload size={24} />
                                            <span className="text-sm">Click to upload logo</span>
                                        </div>
                                    )}
                                </div>
                                {errors.logo && <span className="text-red-400 text-xs flex items-center gap-1 mt-1 font-semibold"><AlertCircle size={10} /> Required</span>}
                            </div>
                        </div>

                        {/* Analysis Section */}
                        <div className="mt-8 border-t border-white/10 pt-8">
                            {!analysisResult ? (
                                <div className="text-center">
                                    <button 
                                        type="button"
                                        onClick={handleAnalyzeBrand}
                                        disabled={isAnalyzing}
                                        className="bg-fann-gold/10 border border-fann-gold text-fann-gold hover:bg-fann-gold hover:text-black font-bold py-3 px-8 rounded-full uppercase tracking-wider text-sm transition-all flex items-center gap-2 mx-auto"
                                    >
                                        {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <ScanSearch size={18} />} 
                                        {isAnalyzing ? 'Analyzing Brand...' : 'Analyze Brand Identity'}
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">We'll extract your colors and vibe to personalize the design.</p>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    className="bg-[#111] border border-fann-gold/30 rounded-xl p-6"
                                >
                                    <h3 className="text-fann-gold font-serif font-bold text-lg mb-4 flex items-center gap-2"><Sparkles size={18}/> AI Brand Findings</h3>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Briefcase size={12}/> Detected Industry</p>
                                            <p className="text-white font-bold">{analysisResult.industry}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Palette size={12}/> Brand Colors</p>
                                            <div className="flex gap-2">
                                                {analysisResult.colors.map((color, i) => (
                                                    <div key={i} className="w-8 h-8 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: color }} title={color}></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Brand Vibe</p>
                                            <p className="text-white font-light italic">"{analysisResult.vibe}"</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Event Details</h2>
                            <p className="text-gray-400">Where will you be exhibiting?</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                             <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest flex items-center gap-1">Event Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="eventName" 
                                    value={formData.eventName} 
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        // Simple heuristic for immediate feedback (real analysis happens on submit)
                                        if(e.target.value.toLowerCase().includes('tech') || e.target.value.toLowerCase().includes('gitex')) setFormData(prev => ({...prev, eventIndustry: 'Technology'}));
                                        else if(e.target.value.toLowerCase().includes('food') || e.target.value.toLowerCase().includes('gulfood')) setFormData(prev => ({...prev, eventIndustry: 'Food & Beverage'}));
                                    }} 
                                    className={getInputClass('eventName')} 
                                    placeholder="e.g. GITEX Global 2024" 
                                />
                                {formData.eventIndustry && <p className="text-xs text-fann-gold flex items-center gap-1 mt-1"><Sparkles size={10}/> Detected Context: {formData.eventIndustry}</p>}
                                {errors.eventName && <span className="text-red-400 text-xs flex items-center gap-1 mt-1 font-semibold"><AlertCircle size={10} /> Required</span>}
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Date</label>
                                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className={getInputClass('eventDate')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-fann-gold uppercase tracking-widest">Venue</label>
                                <input type="text" name="eventLocation" value={formData.eventLocation} onChange={handleInputChange} className={getInputClass('eventLocation')} placeholder="e.g. DWTC" />
                            </div>
                        </div>
                    </motion.div>
                );
            case 3: 
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                         <div className="text-center mb-6">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Stand Specs</h2>
                            <p className="text-gray-400">Define your footprint.</p>
                        </div>
                        
                        <div className="bg-[#151515] p-8 border border-white/5 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10"><Ruler size={100} className="text-fann-gold"/></div>
                            <div className="flex justify-between items-end mb-10 relative z-10">
                                <span className="text-4xl font-bold text-fann-gold">{formData.standWidth * formData.standLength} <span className="text-lg text-gray-400">sqm</span></span>
                                <span className="text-sm font-mono text-gray-500 uppercase">
                                    {formData.standWidth}m width × {formData.standLength}m length
                                </span>
                            </div>
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-fann-gold uppercase tracking-widest mb-4"><span>Width</span><span>{formData.standWidth}m</span></div>
                                    <input type="range" name="standWidth" min="3" max="50" value={formData.standWidth} onChange={handleSliderChange} className="w-full h-1 bg-gray-800 appearance-none cursor-pointer accent-fann-gold" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-fann-gold uppercase tracking-widest mb-4"><span>Length</span><span>{formData.standLength}m</span></div>
                                    <input type="range" name="standLength" min="3" max="50" value={formData.standLength} onChange={handleSliderChange} className="w-full h-1 bg-gray-800 appearance-none cursor-pointer accent-fann-gold" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-bold text-fann-gold uppercase tracking-widest block mb-4">Configuration</label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {boothConfigs.map(config => (
                                    <motion.button
                                        key={config.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => handleOptionClick('boothType', config.id)}
                                        className={`flex flex-col items-center justify-center p-6 border transition-all duration-300 gap-4 ${
                                            formData.boothType === config.id 
                                            ? 'border-fann-gold bg-fann-gold/10' 
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        }`}
                                    >
                                        {config.icon(formData.boothType === config.id)}
                                        <span className={`text-sm font-bold ${formData.boothType === config.id ? 'text-fann-gold' : 'text-gray-400'}`}>
                                            {config.label}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Stand Requirements</h2>
                            <p className="text-gray-400">Select the essential elements you need.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {requirementsList.map(item => {
                                const isSelected = formData.features.includes(item);
                                return (
                                    <motion.button 
                                        key={item} 
                                        type="button"
                                        onClick={() => handleFeatureChange(item)} 
                                        whileTap={{ scale: 0.98 }}
                                        className={`p-4 border text-left flex items-center justify-between transition-all ${
                                            isSelected 
                                            ? 'border-fann-gold bg-fann-gold/20 text-white' 
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/30'
                                        }`}
                                    >
                                        <span className="font-semibold text-sm">{item}</span>
                                        {isSelected && <Check size={16} className="text-fann-gold" />}
                                    </motion.button>
                                )
                            })}
                        </div>
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <h4 className="text-fann-gold font-bold mb-6 text-sm uppercase tracking-widest">Summary</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-400">
                                <div><p className="text-xs text-gray-600 uppercase">Company</p><p className="text-white">{formData.companyName || 'N/A'}</p></div>
                                <div><p className="text-xs text-gray-600 uppercase">Event</p><p className="text-white">{formData.eventName}</p></div>
                                <div><p className="text-xs text-gray-600 uppercase">Size</p><p className="text-white">{formData.standWidth}m x {formData.standLength}m</p></div>
                                <div><p className="text-xs text-gray-600 uppercase">Type</p><p className="text-white">{formData.boothType}</p></div>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatedPage>
            <SEO title="Exhibition Stand Designer | FANN Studio" description="Design your custom exhibition stand." />
            <div className="min-h-screen bg-[#050505] pt-32 pb-20 text-white selection:bg-fann-gold selection:text-black">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-4 border border-white/10 bg-white/5 rounded-none mb-6">
                            <Building2 className="h-8 w-8 text-fann-gold" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tight">Exhibition Designer</h1>
                        <p className="text-xl text-gray-500">Create world-class concepts in 4 simple steps.</p>
                    </div>

                    <motion.div 
                        className={`bg-[#0A0A0A] border border-white/5 p-6 sm:p-12 shadow-2xl relative overflow-hidden ${shake ? 'animate-shake border-red-500/50' : ''}`}
                    >
                        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

                        <AnimatePresence>
                            {showErrorBanner && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute top-4 left-0 right-0 mx-6 md:mx-12 bg-red-900/80 border border-red-500 text-white p-3 rounded text-center text-sm font-semibold flex items-center justify-center gap-2 z-50 backdrop-blur-sm"
                                >
                                    <AlertCircle size={16} /> Please complete all required fields correctly.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="relative z-10 min-h-[400px] flex flex-col justify-between mt-8">
                            {renderStepContent()}

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
                                        className="btn-secondary flex items-center gap-3"
                                    >
                                        Next <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn-primary flex items-center gap-3"
                                    >
                                        <Sparkles size={16} /> Generate Concepts
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;
