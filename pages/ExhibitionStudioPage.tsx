import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, ArrowLeft, Building, Scaling, ListChecks, User, CheckCircle, AlertCircle, Palette, View } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { regionalEvents } from '../constants';
import { useApiKey } from '../context/ApiKeyProvider';

// --- Helper Functions & Types ---
interface FormData {
    standWidth: number;
    standLength: number;
    industry: string;
    standLayout: string;
    standType: string;
    standHeight: string;
    doubleDecker: boolean;
    hangingStructure: boolean;
    eventName: string;
    style: string;
    eventStyleDescription: string;
    functionality: string[];
    hostess: boolean;
    logo: File | null;
    logoPreview: string;
    brandColors: string;
    userName: string;
    userEmail: string;
    userMobile: string;
}

const initialFormData: FormData = {
    standWidth: 10,
    standLength: 6,
    industry: '',
    standLayout: '',
    standType: '',
    standHeight: '',
    doubleDecker: false,
    hangingStructure: false,
    eventName: '',
    style: '',
    eventStyleDescription: '',
    functionality: [],
    hostess: false,
    logo: null,
    logoPreview: '',
    brandColors: '',
    userName: '',
    userEmail: '',
    userMobile: '',
};

const styles = [
    { name: 'Luxury', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80' },
    { name: 'Minimalist', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800&q=80' },
    { name: 'Futuristic', image: 'https://images.unsplash.com/photo-1678393972445-5026e018505e?w=800&q=80' },
    { name: 'Biophilic', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80' },
    { name: 'Industrial', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80' },
    { name: 'Playful', image: 'https://images.unsplash.com/photo-1551232864-3fefa8901183?w=800&q=80' },
];

const functionalityOptions = [
    'Reception Desk', 'Lounge Area', 'Product Displays', 'LED Video Wall', 'Private Meeting Room', 'Storage Room', 'Hospitality Bar', 'Interactive Demo Stations', 'Raised Flooring', 'VR/AR Demo Zone', 'Live Presentation Stage', 'Charging Stations'
];

const steps = [
    { name: 'Foundation', icon: Building },
    { name: 'Structure', icon: Scaling },
    { name: 'Functionality', icon: ListChecks },
    { name: 'Branding', icon: Palette },
    { name: 'Your Details', icon: User },
];

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error('Failed to convert blob to base64 string'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const getLayoutDescription = (layout: string): string => {
    switch (layout) {
        case 'Linear (1 side open / in-line)':
            return 'An in-line booth, typically positioned in a row with other stands. It has solid walls on three sides (back, left, and right) and is only open to the aisle from the front.';
        case 'Corner (2 sides open)':
            return 'A corner booth, located at the end of a row. It has two solid walls (back and one side) and is open to aisles on two intersecting sides (front and one side), offering more visibility.';
        case 'Peninsula (3 sides open)':
            return 'A peninsula booth, which juts out into an aisle. It is open to aisles on three sides (front, left, and right) and has one solid back wall connecting it to a row of other stands.';
        case 'Island (4 sides open / standalone)':
            return 'An island booth, a completely standalone structure open to aisles on all four sides. It offers the highest visibility and has no connecting walls to other stands.';
        default:
            return `A standard ${layout} layout.`;
    }
};

const ExhibitionStudioPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isExtractingColors, setIsExtractingColors] = useState(false);
    const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [isProposalRequested, setIsProposalRequested] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isCustomEvent, setIsCustomEvent] = useState(false);
    const [isAnalyzingStyle, setIsAnalyzingStyle] = useState(false);

    const { ensureApiKey, handleApiError, error: apiKeyError, isKeyError, clearError } = useApiKey();
    const [localError, setLocalError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const eventNames = useMemo(() => ['Other (Please Specify)', ...new Set(regionalEvents.map(e => e.name))].sort(), []);
    const industries = useMemo(() => [...new Set(regionalEvents.map(event => event.industry))].sort(), []);

    const clearLocalError = () => setLocalError(null);

    const triggerStyleAnalysis = async (eventName: string, industry: string) => {
        if (!eventName || !industry) return;
        clearLocalError();
        if (!await ensureApiKey()) return;
        
        setIsAnalyzingStyle(true);
        setFormData(prev => ({ ...prev, style: '', eventStyleDescription: '' }));
    
        try {
            const response = await fetch('/api/analyze-show-style', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventName: eventName,
                    industryContext: `The event is in the ${industry} industry.`,
                    availableStyles: styles.map(s => s.name)
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to analyze event style.');
            }
            
            const result = await response.json();
            const validStyle = styles.map(s => s.name).find(s => s.toLowerCase() === result.style.toLowerCase());
            
            if (validStyle) {
                setFormData(prev => ({
                    ...prev,
                    style: validStyle,
                    eventStyleDescription: result.description || "Style analysis complete.",
                }));
            } else {
                throw new Error(`The AI suggested an unsupported style ('${result.style}'). Please select a style manually or try again.`);
            }
    
        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsAnalyzingStyle(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const target = e.target as HTMLInputElement;

        setFormData(prev => {
            let newFormData: FormData;
            if (target.type === 'number') {
                newFormData = { ...prev, [name]: value === '' ? 0 : parseInt(value, 10) };
            } else {
                newFormData = { ...prev, [name]: value };
            }

            if (name === 'industry' && newFormData.eventName && newFormData.eventName !== 'Other (Please Specify)') {
                triggerStyleAnalysis(newFormData.eventName, value);
            }
             if (name === 'eventName' && value !== 'Other (Please Specify)' && newFormData.industry) {
                triggerStyleAnalysis(value, newFormData.industry);
            }

            return newFormData;
        });
    };
    
    const handleEventSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'Other (Please Specify)') {
            setIsCustomEvent(true);
            setFormData(prev => ({ ...prev, eventName: '', style: '', eventStyleDescription: '' }));
        } else {
            setIsCustomEvent(false);
            const newFormData = { ...formData, eventName: value, style: '', eventStyleDescription: '' };
            setFormData(newFormData);
            if (newFormData.industry) {
                triggerStyleAnalysis(value, newFormData.industry);
            }
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFunctionalityChange = (item: string) => {
        setFormData(prev => ({
            ...prev,
            functionality: prev.functionality.includes(item)
                ? prev.functionality.filter(i => i !== item)
                : [...prev.functionality, item]
        }));
    };

    const extractColorsFromLogo = async (file: File) => {
        clearLocalError();
        if (!await ensureApiKey()) return;

        setIsExtractingColors(true);
        setSuggestedColors([]);
        setFormData(prev => ({ ...prev, brandColors: '' }));
        
        try {
            const base64Data = await blobToBase64(file);
            const response = await fetch('/api/extract-colors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Data, mimeType: file.type })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to extract colors.');
            }
            
            const data = await response.json();
            const extracted = data.colors || [];
            
            if (extracted.length > 0) {
                setSuggestedColors(extracted);
                setFormData(prev => ({ ...prev, brandColors: extracted.join(', ') }));
            } else {
                throw new Error("No distinct colors were found in the logo.");
            }
        } catch (e: any) {
            console.error("Error extracting colors:", e);
            handleApiError(e);
            setSuggestedColors(['ERROR']);
        } finally {
            setIsExtractingColors(false);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const logoPreview = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, logo: file, logoPreview, brandColors: '' }));
            extractColorsFromLogo(file);
        }
    };
    
    const nextStep = () => {
        if (apiKeyError) return;
        clearLocalError();
        if (validateStep(currentStep, false)) { // Don't set error on "Next"
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        clearLocalError();
        clearError(); // Clear API key errors when navigating back
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const generateDesign = async () => {
        clearLocalError();
        if (!await ensureApiKey()) return;

        setIsLoading(true);
        setGeneratedImages([]);

        if (!formData.logo) {
            setLocalError("Logo is missing.");
            setIsLoading(false);
            return;
        }

        try {
            const logoBase64 = await blobToBase64(formData.logo);
            const layoutDescription = getLayoutDescription(formData.standLayout);

            const textPrompt = `Generate 4 photorealistic 2D renders of a bespoke exhibition stand concept for a tradeshow.
- **Client Industry:** ${formData.industry}
- **Event Name:** ${formData.eventName}
- **Stand Dimensions:** ${formData.standWidth}m width x ${formData.standLength}m length (${formData.standWidth * formData.standLength} sqm area).
- **Stand Layout:** ${formData.standLayout}. ${layoutDescription}
- **Stand Type:** ${formData.standType}.
- **Structure:** ${formData.standHeight} height. It ${formData.doubleDecker ? 'IS a double-decker' : 'is NOT a double-decker'}. It ${formData.hangingStructure ? 'DOES have a hanging structure/banner' : 'does NOT have a hanging structure'}.
- **Core Functionality:** Must include areas for: ${formData.functionality.join(', ')}.
- **Staffing:** The client ${formData.hostess ? 'DOES require a hostess desk/area' : 'does NOT require a hostess'}.
- **Design Style:** The overall aesthetic must be **${formData.style || 'Modern and professional'}**. ${formData.eventStyleDescription ? `The AI's analysis for this event suggests the following characteristics: ${formData.eventStyleDescription}` : ''}
- **Branding:** Use the attached logo prominently but elegantly. The primary brand colors are **${formData.brandColors}**.
- **Atmosphere:** The stand should feel professional, high-end, and inviting, suitable for a major international event in Dubai or Riyadh. Use realistic lighting and materials. Do not include people.`;
            
            const response = await fetch('/api/generate-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logo: logoBase64,
                    mimeType: formData.logo.type,
                    prompt: textPrompt,
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to generate images.');
            }

            const data = await response.json();
            
            if (!data.imageUrls || data.imageUrls.length === 0) {
                 throw new Error("The AI model failed to generate any images.");
            }

            setGeneratedImages(data.imageUrls);
            setIsFinished(true);
            
        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const validateStep = (step: number, shouldSetError: boolean): boolean => {
        let errorMessage = '';
        switch(step) {
            case 0:
                if (!formData.standWidth || !formData.standLength || !formData.industry || !formData.standLayout || !formData.eventName) {
                    errorMessage = "Please complete all foundation details, including the event name.";
                }
                break;
            case 1:
                if (!formData.standType || !formData.standHeight) {
                    errorMessage = "Please select a stand type and maximum height.";
                } else if (formData.doubleDecker && formData.standHeight === '4m') {
                    errorMessage = "A double-decker stand requires a height of more than 4 meters. Please select a greater height.";
                }
                break;
            case 2:
                if (formData.functionality.length === 0) {
                    errorMessage = "Please select at least one required feature for your stand.";
                }
                break;
            case 3:
                if (!formData.logo || !formData.brandColors.trim()) {
                    errorMessage = "Please upload your logo and provide brand colors for the design.";
                }
                break;
            case 4:
                if (!formData.userName.trim() || !formData.userMobile.trim() || !/\S+@\S+\.\S+/.test(formData.userEmail)) {
                    errorMessage = "Please provide your full name, a valid email, and mobile number.";
                }
                break;
        }

        if (errorMessage && shouldSetError) {
            setLocalError(errorMessage);
        }
        
        return !errorMessage;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit button clicked. Current form data:", formData);
        
        if (apiKeyError) return;
        clearLocalError();

        for (let i = 0; i < steps.length; i++) {
            if (!validateStep(i, true)) {
                console.log(`Validation failed at step ${i}`);
                setCurrentStep(i); 
                return;
            }
        }
        
        console.log("All steps validated successfully. Calling generateDesign.");
        generateDesign();
    };


    const sendProposalRequest = async () => {
        if (selectedImage === null) return;
        setIsSending(true);
        console.log("--- PROPOSAL REQUEST (SIMULATED) ---", { ...formData, logo: formData.logo?.name, selectedConceptImageIndex: selectedImage });
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSending(false);
        setIsProposalRequested(true);
    };

    const error = apiKeyError || localError;

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Foundation
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 1: The Foundation</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">Stand Size (meters)</label>
                                <div className="flex items-center gap-2">
                                    <input type="number" name="standWidth" value={formData.standWidth} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="Width" />
                                    <span className="text-fann-light-gray">x</span>
                                    <input type="number" name="standLength" value={formData.standLength} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="Length" />
                                </div>
                                <p className="text-xs text-fann-light-gray mt-1">{formData.standWidth * formData.standLength} sqm</p>
                            </div>
                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-fann-light-gray mb-2">Your Industry</label>
                                <select
                                    id="industry"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleInputChange}
                                    className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"
                                >
                                    <option value="" disabled>Select an industry...</option>
                                    {industries.map(industry => (
                                        <option key={industry} value={industry}>{industry}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                             <label htmlFor="standLayout" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Layout</label>
                            <select id="standLayout" name="standLayout" value={formData.standLayout} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                <option value="" disabled>Select a layout...</option>
                                <option>Linear (1 side open / in-line)</option>
                                <option>Corner (2 sides open)</option>
                                <option>Peninsula (3 sides open)</option>
                                <option>Island (4 sides open / standalone)</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="eventName" className="block text-sm font-medium text-fann-light-gray mb-2">Event Name</label>
                            <select id="eventName" name="eventName" value={isCustomEvent ? 'Other (Please Specify)' : formData.eventName} onChange={handleEventSelectChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                <option value="" disabled>Select an event...</option>
                                {eventNames.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                        </div>
                         {isAnalyzingStyle && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-fann-light-gray mt-2">
                                <Loader2 className="w-4 h-4 animate-spin"/>
                                Analyzing event style...
                            </motion.div>
                        )}
                        {isCustomEvent && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                                <label htmlFor="customEventName" className="block text-sm font-medium text-fann-light-gray mb-2 mt-4">Please specify the event name</label>
                                <input type="text" id="customEventName" name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="e.g., My Company's Annual Conference" />
                            </motion.div>
                        )}
                    </div>
                );
            case 1: // Structure
                 return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 2: The Structure</h2>
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-2">Stand Type</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['Custom-built', 'Modular System', 'Shell Scheme'].map(type => (
                                    <button type="button" key={type} onClick={() => setFormData(prev => ({...prev, standType: type}))} className={`p-4 rounded-lg border-2 text-center transition-colors ${formData.standType === type ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border hover:border-fann-gold/50'}`}>
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-2">Max Stand Height (Venue Permitted)</label>
                            <div className="grid grid-cols-4 gap-4">
                                {['4m', '5m', '6m', '6m+'].map(height => (
                                    <button type="button" key={height} onClick={() => setFormData(prev => ({...prev, standHeight: height}))} className={`p-4 rounded-lg border-2 text-center transition-colors ${formData.standHeight === height ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border hover:border-fann-gold/50'}`}>
                                        {height}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-around">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="doubleDecker" checked={formData.doubleDecker} onChange={handleCheckboxChange} className="h-5 w-5 rounded bg-fann-charcoal border-fann-border text-fann-teal focus:ring-fann-teal" />
                                <span>Double-Decker?</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="hangingStructure" checked={formData.hangingStructure} onChange={handleCheckboxChange} className="h-5 w-5 rounded bg-fann-charcoal border-fann-border text-fann-teal focus:ring-fann-teal" />
                                <span>Hanging Structure?</span>
                            </label>
                        </div>
                    </div>
                );
            case 2: // Functionality
                return (
                     <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 3: Functionality & Features</h2>
                        <p className="text-fann-light-gray text-sm">Select all the features you require for your stand.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {functionalityOptions.map(item => (
                                <button type="button" key={item} onClick={() => handleFunctionalityChange(item)} className={`p-3 rounded-lg border-2 text-left text-sm transition-colors flex items-center gap-2 ${formData.functionality.includes(item) ? 'border-fann-teal bg-fann-teal/10' : 'border-fann-border hover:border-fann-teal/50'}`}>
                                    <div className={`w-4 h-4 rounded-sm flex-shrink-0 border-2 ${formData.functionality.includes(item) ? 'bg-fann-teal border-fann-teal' : 'border-fann-light-gray'}`}/>
                                    <span>{item}</span>
                                </button>
                            ))}
                        </div>
                        <div className="pt-6 mt-6 border-t border-fann-border">
                            <label className="flex items-center gap-3 cursor-pointer text-white">
                                <input type="checkbox" name="hostess" checked={formData.hostess} onChange={handleCheckboxChange} className="h-5 w-5 rounded bg-fann-charcoal border-fann-border text-fann-teal focus:ring-fann-teal" />
                                <span>Do you require a hostess for the stand?</span>
                            </label>
                        </div>
                    </div>
                );
            case 3: // Branding
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 4: Branding</h2>
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">Upload Your Logo (Vector Preferred)</label>
                                <div onClick={() => fileInputRef.current?.click()} className="h-48 w-full bg-fann-charcoal border-2 border-dashed border-fann-border rounded-lg flex items-center justify-center cursor-pointer hover:border-fann-gold transition-colors">
                                    {formData.logoPreview ? (
                                        <img src={formData.logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain p-4" />
                                    ) : (
                                        <div className="text-center text-fann-light-gray">
                                            <Upload className="mx-auto w-8 h-8 mb-2" />
                                            <p>Click to upload</p>
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/png, image/jpeg, image/svg+xml, image/webp" />
                            </div>
                             <div>
                                <label htmlFor="brandColors" className="block text-sm font-medium text-fann-light-gray mb-2">Primary Brand Colors</label>
                                <input 
                                    type="text" 
                                    id="brandColors" 
                                    name="brandColors" 
                                    value={formData.brandColors} 
                                    onChange={handleInputChange} 
                                    className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" 
                                    placeholder="Colors will be extracted from your logo" 
                                />
                                <div className="mt-2 text-xs min-h-[4rem]">
                                    {isExtractingColors ? (
                                        <span className="flex items-center gap-1 text-fann-light-gray">
                                            <Loader2 className="w-3 h-3 animate-spin"/>Analyzing logo colors...
                                        </span>
                                    ) : suggestedColors.length > 0 && suggestedColors[0] !== 'ERROR' ? (
                                        <div>
                                            <span className="flex items-center gap-1 text-green-400 mb-2">
                                                <CheckCircle className="w-3 h-3"/>Colors extracted successfully.
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestedColors.map(color => (
                                                    <div key={color} className="flex items-center gap-1.5 p-1 bg-fann-charcoal rounded">
                                                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color }}></div>
                                                        <span className="text-xs font-mono text-fann-light-gray">{color}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : suggestedColors[0] === 'ERROR' ? (
                                         <span className="flex items-center gap-1 text-red-400">
                                            <AlertCircle className="w-3 h-3"/>Could not extract colors. Please enter them manually.
                                        </span>
                                    ) : (
                                        <span className="text-fann-light-gray">
                                            Upload a logo to automatically detect brand colors.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                         {formData.eventStyleDescription && (
                             <motion.div initial={{opacity:0, y: -10}} animate={{opacity:1, y:0}} className="bg-fann-charcoal/50 p-3 rounded-lg text-sm text-fann-cream mt-4 border-l-2 border-fann-teal">
                                <strong>AI Design Direction:</strong> {formData.eventStyleDescription}
                            </motion.div>
                        )}
                    </div>
                );
            case 4: // Your Details
                 return (
                    <div className="space-y-6 max-w-md mx-auto">
                        <h2 className="text-2xl font-serif text-white text-center">Step 5: Your Details</h2>
                        <p className="text-center text-fann-light-gray text-sm">We'll use this to send you the generated concepts and proposal.</p>
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-fann-light-gray mb-1">Full Name</label>
                            <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label htmlFor="userEmail" className="block text-sm font-medium text-fann-light-gray mb-1">Email Address</label>
                            <input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label htmlFor="userMobile" className="block text-sm font-medium text-fann-light-gray mb-1">Mobile Number</label>
                            <input type="tel" id="userMobile" name="userMobile" value={formData.userMobile} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
                <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />
                <h2 className="text-3xl font-serif text-white mt-6">Crafting Your Vision...</h2>
                <p className="text-fann-light-gray mt-2 max-w-sm">Our AI is assembling architectural elements, materials, and lighting to bring your concept to life. This may take a few moments.</p>
            </div>
        );
    }
    
    if (isFinished && isProposalRequested) {
        return (
            <AnimatedPage>
                <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
                    <CheckCircle className="w-20 h-20 text-fann-teal mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Thank You!</h1>
                    <p className="text-xl text-fann-cream max-w-2xl mx-auto mb-8">
                        Your selection has been received. Our team is now preparing a detailed proposal which includes additional 3D views, a full quotation, and material specifications.
                    </p>
                    <p className="text-lg text-fann-light-gray">
                        You will receive the proposal at <strong>{formData.userEmail}</strong> shortly.
                    </p>
                     {selectedImage !== null && generatedImages[selectedImage] && (
                        <div className="mt-8 max-w-lg w-full">
                            <p className="text-sm text-fann-light-gray mb-2">Your Selected Concept:</p>
                            <img src={generatedImages[selectedImage]} alt="Selected Concept" className="rounded-lg shadow-2xl w-full h-auto object-cover" />
                        </div>
                    )}
                </div>
            </AnimatedPage>
        );
    }

    if (isFinished) {
         return (
            <AnimatedPage>
                 <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <Sparkles className="mx-auto h-16 w-16 text-fann-gold" />
                            <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Your AI Concepts Are Ready</h1>
                            <p className="text-xl text-fann-cream max-w-3xl mx-auto">
                                We've generated a 3D model and several 2D concepts. Choose your favorite 2D visual to receive a detailed proposal.
                            </p>
                        </div>
                        
                         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                             <div className="lg:col-span-3 space-y-8">
                                <div className="bg-fann-charcoal-light p-6 rounded-lg">
                                    <h3 className="text-2xl font-serif text-fann-gold mb-4 flex items-center gap-3"><View size={28} /> Interactive 3D Preview</h3>
                                    <p className="text-fann-light-gray mb-4 text-sm max-w-2xl">Rotate and zoom to inspect the generated 3D model of your stand concept. Note: This is a representation of the structure; materials and colors are best viewed in the 2D concepts below.</p>
                                    <div className="h-96 rounded-lg overflow-hidden bg-fann-charcoal">
                                        <model-viewer
                                            src="https://cdn.glitch.global/6a80426b-692c-4386-b48d-64d5a2305370/exhibition_stand.glb?v=1716498858169"
                                            alt="Interactive 3D model of the exhibition stand"
                                            camera-controls
                                            auto-rotate
                                            ar
                                            shadow-intensity="1"
                                            style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a' }}
                                        ></model-viewer>
                                    </div>
                                </div>
                                 
                                <div>
                                    <h3 className="text-2xl font-serif text-fann-gold mb-4">Select Your Favorite 2D Concept</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {generatedImages.map((img, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                onClick={() => setSelectedImage(index)}
                                                className={`rounded-lg overflow-hidden cursor-pointer border-4 transition-all duration-300 hover:border-fann-gold/50 ${selectedImage === index ? 'border-fann-gold' : 'border-transparent'}`}
                                            >
                                                <img src={img} alt={`AI Concept ${index + 1}`} className="w-full h-auto object-cover" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                             </div>

                             <div className="lg:col-span-1 bg-fann-charcoal-light p-6 rounded-lg self-start sticky top-24">
                                <h3 className="text-2xl font-serif text-fann-gold mb-4">Project Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <p><strong>Event:</strong> {formData.eventName}</p>
                                    <p><strong>Size:</strong> {formData.standWidth}m x {formData.standLength}m ({formData.standWidth * formData.standLength} sqm)</p>
                                    <p><strong>AI Style:</strong> {formData.style}</p>
                                    <p><strong>Layout:</strong> {formData.standLayout}</p>
                                    <p><strong>Type:</strong> {formData.standType}, {formData.standHeight} height</p>
                                     <div className="pt-4 mt-4 border-t border-fann-border">
                                        <motion.button
                                            onClick={sendProposalRequest}
                                            disabled={selectedImage === null || isSending}
                                            className="w-full bg-fann-teal text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 disabled:bg-fann-charcoal-light disabled:text-fann-light-gray disabled:cursor-not-allowed"
                                            whileHover={{ scale: selectedImage !== null && !isSending ? 1.05 : 1 }}
                                            whileTap={{ scale: selectedImage !== null && !isSending ? 0.95 : 1 }}
                                        >
                                            {isSending ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : "Request Detailed Proposal"}
                                        </motion.button>
                                        {selectedImage === null && <p className="text-xs text-center text-fann-light-gray mt-2">Please select a 2D design to proceed.</p>}
                                    </div>
                                </div>
                             </div>
                         </div>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Exhibition Stand Studio</h1>
                        <p className="text-xl text-fann-cream">Follow the steps to create a bespoke exhibition stand concept.</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {steps.map((step, index) => (
                                <div key={step.name} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= index ? 'bg-fann-gold text-fann-charcoal' : 'bg-fann-charcoal-light text-fann-light-gray'}`}>
                                        <step.icon size={16} />
                                    </div>
                                    <span className={`text-xs mt-1 text-center ${currentStep >= index ? 'text-white' : 'text-fann-light-gray'}`}>{step.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-fann-charcoal-light rounded-full h-1.5">
                            <motion.div 
                                className="bg-fann-gold h-1.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentStep / (steps.length -1)) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 50 }}
                            />
                        </div>
                    </div>

                    <div className="bg-fann-charcoal-light p-8 rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderStepContent()}
                                </motion.div>
                            </AnimatePresence>
                            
                            <div className="mt-8">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 mb-4"
                                    >
                                        <div className="flex-shrink-0 pt-0.5"><AlertCircle className="w-5 h-5" /></div>
                                        <div className="flex-grow">
                                            <span>{error}</span>
                                            {isKeyError && (
                                                <div className="mt-2 flex items-center gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            await window.aistudio.openSelectKey();
                                                            clearError();
                                                        }}
                                                        className="bg-fann-gold text-fann-charcoal text-xs font-bold py-1 px-3 rounded-full hover:opacity-90"
                                                    >
                                                        Select API Key
                                                    </button>
                                                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-fann-light-gray hover:underline">
                                                        Learn about billing
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                                <div className="flex justify-between items-center">
                                    <motion.button type="button" onClick={prevStep} disabled={currentStep === 0 || isAnalyzingStyle} className="flex items-center gap-2 text-fann-gold disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: currentStep !== 0 ? 1.05 : 1}} whileTap={{scale: currentStep !== 0 ? 0.95 : 1}}>
                                        <ArrowLeft size={16} /> Back
                                    </motion.button>
                                    
                                    {currentStep < steps.length - 1 ? (
                                        <motion.button type="button" onClick={nextStep} disabled={isAnalyzingStyle} className="bg-fann-gold text-fann-charcoal font-bold py-2 px-6 rounded-full w-32 disabled:bg-fann-charcoal-light disabled:text-fann-light-gray" whileHover={{scale: !isAnalyzingStyle ? 1.05 : 1}} whileTap={{scale: !isAnalyzingStyle ? 0.95 : 1}}>
                                            {isAnalyzingStyle ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Next'}
                                        </motion.button>
                                    ) : (
                                        <motion.button type="submit" className="bg-fann-teal text-white font-bold py-2 px-6 rounded-full flex items-center gap-2" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                            <Sparkles size={16} /> Generate My Design
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;