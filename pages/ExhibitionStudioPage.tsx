import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, ArrowLeft, Building, Scaling, ListChecks, User, CheckCircle, AlertCircle, Palette, View } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { regionalEvents } from '../constants';
import { useApiKey } from '../context/ApiKeyProvider';
// FIX: Add a type-only import from 'types.ts' to ensure the TypeScript
// compiler includes the global JSX augmentations defined in that file, resolving
// the error for the custom <model-viewer> element.
import type {} from '../types';


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
    brandColors: string[];
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
    brandColors: [],
    userName: '',
    userEmail: '',
    userMobile: '',
};

// The styles array is used to provide a constrained list of options to the AI for the automatic style analysis.
// This improves the reliability of the AI's output and is not shown to the user in the UI.
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

    const { ensureApiKey, handleApiError, error: apiKeyError, isKeyError, clearError: clearApiKeyError } = useApiKey();
    const [localError, setLocalError] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const setError = (message: string | null) => {
        clearApiKeyError();
        setLocalError(message);
    };

    const clearAllErrors = () => {
        setLocalError(null);
        clearApiKeyError();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const handleFunctionalityChange = (item: string) => {
        setFormData(prev => {
            const newFunctionality = prev.functionality.includes(item)
                ? prev.functionality.filter(i => i !== item)
                : [...prev.functionality, item];
            return { ...prev, functionality: newFunctionality };
        });
    };
    
    const extractColorsFromLogo = async (file: File) => {
        clearAllErrors();
        const hasApiKey = await ensureApiKey();
        if (!hasApiKey) {
            setError("Color analysis requires an API key. Please upload the logo again to select a key.");
            return;
        }

        setIsExtractingColors(true);
        setSuggestedColors([]);
        setFormData(prev => ({ ...prev, brandColors: [] }));
        
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
                // Let users manually select colors - no auto-selection
                setFormData(prev => ({ ...prev, brandColors: [] }));
            } else {
                setSuggestedColors(['ERROR']);
                throw new Error("No distinct colors were found in the logo.");
            }
        } catch (e: any) {
            console.error("Error extracting colors:", e);
            handleApiError(e);
        } finally {
            setIsExtractingColors(false);
        }
    };
    
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const logoPreview = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, logo: file, logoPreview, brandColors: [] }));
            extractColorsFromLogo(file);
        }
    };

    const validateStep = (step: number, shouldSetError: boolean): boolean => {
        let errorMessage = '';
        switch (step) {
            case 0:
                if (!formData.industry || !formData.eventName) errorMessage = "Please select an industry and event.";
                break;
            case 1:
                if (!formData.standLayout || !formData.standType || !formData.standHeight) errorMessage = "Please complete all structure details.";
                break;
            case 2:
                if (formData.functionality.length === 0) errorMessage = "Please select at least one functionality requirement.";
                break;
            case 3:
                if (!formData.logo) errorMessage = "Please upload your company logo.";
                else if (formData.brandColors.length === 0) errorMessage = "Please provide your brand colors.";
                break;
            case 4:
                if (!formData.userName.trim() || !formData.userEmail.trim() || !formData.userMobile.trim()) errorMessage = "Please fill in all your contact details.";
                else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) errorMessage = "Please enter a valid email address.";
                break;
        }

        if (errorMessage && shouldSetError) {
            setError(errorMessage);
        }

        return !errorMessage;
    }
    
    const nextStep = () => {
        clearAllErrors();
        if (validateStep(currentStep, true)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        clearAllErrors();
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const generateDesign = async () => {
        clearAllErrors();
        if (!await ensureApiKey()) return;

        setIsLoading(true);
        setGeneratedImages([]);

        if (!formData.logo) {
            setError("Logo is missing. Please go back and upload it.");
            setIsLoading(false);
            return;
        }

        try {
            const logoBase64 = await blobToBase64(formData.logo);
            
            const prompt = `Generate 4 photorealistic concept images for a bespoke exhibition stand.
- **Event:** ${formData.eventName}
- **Industry:** ${formData.industry}
- **Stand Dimensions:** ${formData.standWidth}m width x ${formData.standLength}m length (${formData.standWidth * formData.standLength} sqm).
- **Layout:** ${formData.standLayout}. This is ${getLayoutDescription(formData.standLayout)}
- **Stand Type:** ${formData.standType}.
- **Structure:** Maximum height is ${formData.standHeight}. ${formData.doubleDecker ? 'It MUST be a double-decker (two-story) stand.' : ''} ${formData.hangingStructure ? 'It MUST include a prominent hanging structure suspended from the ceiling.' : ''}
- **Style:** The overall design aesthetic should be **${formData.style}**.
- **Functionality Requirements:** The stand must visibly include areas for: ${formData.functionality.join(', ')}.
- **Branding:** The stand is for a company whose logo is attached. The brand colors are **${formData.brandColors.join(', ')}**. Integrate the logo and colors naturally into the design on walls, reception desks, or digital screens.
- **Atmosphere:** The images should look high-end, professionally lit, and visually stunning. Do not include any people in the images.`;

            const response = await fetch('/api/generate-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logo: logoBase64,
                    mimeType: formData.logo.type,
                    prompt: prompt,
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
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (apiKeyError) return;
        clearAllErrors();

        for (let i = 0; i < steps.length; i++) {
            if (!validateStep(i, true)) {
                setCurrentStep(i); 
                return;
            }
        }
        
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
    const isNextButtonDisabled = currentStep === 3 && isExtractingColors || currentStep === 0 && isAnalyzingStyle;
    
    const analyzeShowStyle = async (eventName: string, industry: string) => {
        if (!eventName || !industry) return;
        
        clearAllErrors();
        if (!await ensureApiKey()) return;

        setIsAnalyzingStyle(true);
        try {
            const response = await fetch('/api/analyze-show-style', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    eventName, 
                    industryContext: industry, 
                    availableStyles: styles.map(s => s.name)
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to analyze event style.');
            }

            const data = await response.json();
            if (data.style && data.description) {
                setFormData(p => ({ ...p, style: data.style, eventStyleDescription: data.description }));
            }
        } catch (e: any) {
            console.error('Error analyzing show style:', e);
            handleApiError(e); // This will show the error in the UI
        } finally {
            setIsAnalyzingStyle(false);
        }
    };
    
     useEffect(() => {
        if (formData.eventName && formData.industry && !isCustomEvent) {
            analyzeShowStyle(formData.eventName, formData.industry);
        }
    }, [formData.eventName, formData.industry, isCustomEvent]);
    
    const events = useMemo(() => {
        const uniqueEvents = new Map<string, { industry: string }>();
        regionalEvents.forEach(event => {
            if (!uniqueEvents.has(event.name)) {
                uniqueEvents.set(event.name, { industry: event.industry });
            }
        });
        return Array.from(uniqueEvents.entries()).map(([name, { industry }]) => ({ name, industry }));
    }, []);
    
    const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedEventName = e.target.value;
        if (selectedEventName === 'custom') {
            setIsCustomEvent(true);
            setFormData(p => ({ ...p, eventName: '', industry: p.industry || '', style: '', eventStyleDescription: '' }));
        } else {
            setIsCustomEvent(false);
            const selectedEvent = events.find(event => event.name === selectedEventName);
            setFormData(p => ({
                ...p,
                eventName: selectedEventName,
                industry: selectedEvent?.industry || p.industry,
                style: '',
                eventStyleDescription: ''
            }));
        }
    };

    // --- RENDER LOGIC ---

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Foundation
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 1: The Foundation</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="eventName" className="block text-sm font-medium text-fann-light-gray mb-2">Event Name</label>
                                <select id="eventName" value={isCustomEvent ? 'custom' : formData.eventName} onChange={handleEventChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    <option value="" disabled>Select an event...</option>
                                    {events.map(e => <option key={e.name} value={e.name}>{e.name}</option>)}
                                    <option value="custom">Other / Not Listed</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="industry" className="block text-sm font-medium text-fann-light-gray mb-2">Industry</label>
                                <input type="text" id="industry" name="industry" value={formData.industry} onChange={handleInputChange} disabled={!isCustomEvent} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2 disabled:bg-fann-charcoal-light/50" />
                            </div>
                        </div>
                        {isCustomEvent && (
                            <input type="text" name="eventName" placeholder="Enter your event name" value={formData.eventName} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2 mt-4" />
                        )}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="standWidth" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Width (m): {formData.standWidth}</label>
                                <input type="range" id="standWidth" name="standWidth" min="3" max="30" value={formData.standWidth} onChange={handleInputChange} className="w-full h-2 bg-fann-charcoal-light rounded-lg appearance-none cursor-pointer accent-fann-gold" />
                            </div>
                            <div>
                                <label htmlFor="standLength" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Length (m): {formData.standLength}</label>
                                <input type="range" id="standLength" name="standLength" min="3" max="30" value={formData.standLength} onChange={handleInputChange} className="w-full h-2 bg-fann-charcoal-light rounded-lg appearance-none cursor-pointer accent-fann-gold" />
                            </div>
                        </div>
                         <div className="text-center text-lg font-bold">Total Area: <span className="text-fann-gold">{formData.standWidth * formData.standLength} sqm</span></div>
                    </div>
                );
            case 1: // Structure
                 return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 2: The Structure</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                           <div>
                                <label htmlFor="standLayout" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Layout (Open Sides)</label>
                                <select id="standLayout" name="standLayout" value={formData.standLayout} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    <option value="" disabled>Select layout...</option>
                                    <option>Linear (1 side open / in-line)</option>
                                    <option>Corner (2 sides open)</option>
                                    <option>Peninsula (3 sides open)</option>
                                    <option>Island (4 sides open / standalone)</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="standType" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Type</label>
                                <select id="standType" name="standType" value={formData.standType} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    <option value="" disabled>Select type...</option>
                                    <option>Custom Build</option>
                                    <option>Modular System</option>
                                    <option>Hybrid (Custom + Modular)</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="standHeight" className="block text-sm font-medium text-fann-light-gray mb-2">Maximum Height</label>
                                <select id="standHeight" name="standHeight" value={formData.standHeight} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    <option value="" disabled>Select height...</option>
                                    <option>4 meters</option>
                                    <option>6 meters</option>
                                    <option>Venue Maximum</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-8 pt-4">
                            <label htmlFor="doubleDecker" className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" id="doubleDecker" name="doubleDecker" checked={formData.doubleDecker} onChange={handleInputChange} className="h-4 w-4 rounded accent-fann-teal"/>
                                <span>Double Decker (Two Story)</span>
                            </label>
                             <label htmlFor="hangingStructure" className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" id="hangingStructure" name="hangingStructure" checked={formData.hangingStructure} onChange={handleInputChange} className="h-4 w-4 rounded accent-fann-teal"/>
                                <span>Hanging Structure</span>
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
                    </div>
                );
            case 3: // Branding
                const handleColorToggle = (color: string) => {
                    setFormData(prev => {
                        const newColors = prev.brandColors.includes(color)
                            ? prev.brandColors.filter(c => c !== color)
                            : [...prev.brandColors, color];
                        return { ...prev, brandColors: newColors };
                    });
                };
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 4: Style & Branding</h2>
                         <div>
                            <label htmlFor="style" className="block text-sm font-medium text-fann-light-gray mb-2">Design Style</label>
                            <div className="relative">
                                <select id="style" name="style" value={formData.style} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2">
                                    <option value="" disabled>Select a style...</option>
                                    {styles.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                                {isAnalyzingStyle && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-fann-gold" />}
                            </div>
                            {formData.eventStyleDescription && (
                                <p className="text-xs text-fann-light-gray mt-2 bg-fann-charcoal p-2 rounded-md border border-fann-border">
                                    <strong>AI Suggestion:</strong> {formData.eventStyleDescription}
                                </p>
                            )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-start pt-4">
                            <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">Upload Your Logo (Vector Preferred)</label>
                                <div onClick={() => fileInputRef.current?.click()} className="h-48 w-full bg-fann-charcoal border-2 border-dashed border-fann-border rounded-lg flex items-center justify-center cursor-pointer hover:border-fann-gold transition-colors">
                                    {formData.logoPreview ? <img src={formData.logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain p-4" /> : <div className="text-center text-fann-light-gray"><Upload className="mx-auto w-8 h-8 mb-2" /><p>Click to upload</p></div>}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif, .svg" />
                            </div>
                            <div>
                                <label htmlFor="brandColors" className="block text-sm font-medium text-fann-light-gray mb-2">Primary Brand Colors</label>
                                <input type="text" id="brandColors" name="brandColors" value={formData.brandColors.join(', ')} onChange={(e) => setFormData(p => ({...p, brandColors: e.target.value.split(',').map(c => c.trim()).filter(c => c)}))} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="e.g., #0A192F, Fann Gold, White" />
                                <div className="mt-2 min-h-[4rem]">
                                    {isExtractingColors ? <div className="flex items-center gap-2 text-sm text-fann-light-gray"><Loader2 className="w-4 h-4 animate-spin"/>Analyzing...</div> : suggestedColors.length > 0 && suggestedColors[0] !== 'ERROR' ? (
                                        <div>
                                            <span className="flex items-center gap-1 text-green-400 mb-2 text-sm"><CheckCircle className="w-4 h-4"/>AI suggestions are ready. Click to select/deselect.</span>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestedColors.map(color => {
                                                    const isSelecte<span class="cursor">█</span>