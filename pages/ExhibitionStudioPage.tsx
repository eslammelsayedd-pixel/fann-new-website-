import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, ArrowLeft, Building, Scaling, ListChecks, User, CheckCircle, AlertCircle, Palette, View, FileText } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { regionalEvents } from '../constants';
import { useApiKey } from '../context/ApiKeyProvider';
// FIX: Explicitly import a type from '../types' to ensure TypeScript processes
// the global JSX augmentations for custom elements like <model-viewer>. The previous 'import type {}' was not sufficient.
import type { Project } from '../types';


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

interface GeneratedConcept {
    imageUrl: string;
    title: string;
    description: string;
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

const styles = [
    { name: 'Luxury', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80' },
    { name: 'Minimalist', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800&q=80' },
    { name: 'Futuristic', image: 'https://images.unsplash.com/photo-1678393972445-5026e018505e?w=800&q=80' },
    { name: 'Biophilic', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80' },
    { name: 'Industrial', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80' },
    { name: 'Playful', image: 'https://images.unsplash.com/photo-1551232864-3fefa8901183?w=800&q=80' },
];

const functionalityGroups = {
    "Reception & Hospitality": ['Reception Desk', 'Hospitality Bar', 'Lounge Area', 'Charging Stations'],
    "Display & Demonstration": ['Product Displays', 'Interactive Demo Stations', 'VR/AR Demo Zone'],
    "Media & Presentation": ['LED Video Wall', 'Live Presentation Stage'],
    "Meeting & Operations": ['Private Meeting Room', 'Storage Room'],
    "Structural Elements": ['Raised Flooring'],
};

const layoutOptions = [
    { name: 'Linear (1 side open / in-line)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-t-2 border-l-2 border-r-2 border-fann-light-gray"><div className="absolute inset-x-0 -bottom-px h-1 bg-fann-gold"></div></div>, description: 'One side open to the aisle.' },
    { name: 'Corner (2 sides open)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-t-2 border-l-2 border-fann-light-gray"><div className="absolute inset-x-0 -bottom-px h-1 bg-fann-gold"></div><div className="absolute inset-y-0 -right-px w-1 bg-fann-gold"></div></div>, description: 'Two open sides, on a corner.' },
    { name: 'Peninsula (3 sides open)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-t-2 border-fann-light-gray"><div className="absolute inset-x-0 -bottom-px h-1 bg-fann-gold"></div><div className="absolute inset-y-0 -right-px w-1 bg-fann-gold"></div><div className="absolute inset-y-0 -left-px w-1 bg-fann-gold"></div></div>, description: 'Three open sides into an aisle.' },
    { name: 'Island (4 sides open / standalone)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-2 border-fann-gold"></div>, description: 'Fully standalone with four open sides.' },
];

const steps = [
    { name: 'Brief', icon: Building },
    { name: 'Structure', icon: Scaling },
    { name: 'Functionality', icon: ListChecks },
    { name: 'Aesthetics', icon: Palette },
    { name: 'Review & Contact', icon: User },
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
    const [generatedConcepts, setGeneratedConcepts] = useState<GeneratedConcept[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isExtractingColors, setIsExtractingColors] = useState(false);
    const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
    const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
    const [isProposalRequested, setIsProposalRequested] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isCustomEvent, setIsCustomEvent] = useState(false);
    const [isAnalyzingStyle, setIsAnalyzingStyle] = useState(false);
    const [isModelViewerOpen, setIsModelViewerOpen] = useState(false);

    const { ensureApiKey, handleApiError, error: apiKeyError, clearError: clearApiKeyError } = useApiKey();
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
        if (!await ensureApiKey()) return;

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
                setFormData(prev => ({ ...prev, brandColors: [extracted[0]] }));
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
            clearAllErrors();
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
                if (!formData.style) errorMessage = "Please select a design style.";
                else if (!formData.logo) errorMessage = "Please upload your company logo.";
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
        setGeneratedConcepts([]);

        if (!formData.logo) {
            setError("Logo is missing. Please go back and upload it.");
            setIsLoading(false);
            return;
        }

        try {
            const logoBase64 = await blobToBase64(formData.logo);
            
            const promptData = {
                event: formData.eventName,
                industry: formData.industry,
                dimensions: `${formData.standWidth}m width x ${formData.standLength}m length (${formData.standWidth * formData.standLength} sqm)`,
                layout: formData.standLayout,
                layoutDescription: getLayoutDescription(formData.standLayout),
                type: formData.standType,
                structure: `Maximum height is ${formData.standHeight}. ${formData.doubleDecker ? 'It MUST be a double-decker (two-story) stand.' : ''} ${formData.hangingStructure ? 'It MUST include a prominent hanging structure suspended from the ceiling.' : ''}`,
                style: formData.style,
                functionality: formData.functionality.join(', '),
                colors: formData.brandColors.join(', '),
            };

            const response = await fetch('/api/generate-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logo: logoBase64,
                    mimeType: formData.logo.type,
                    promptData: promptData,
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to generate images.');
            }

            const data = await response.json();
            
            if (!data.concepts || data.concepts.length === 0) {
                 throw new Error("The AI model failed to generate any concepts.");
            }
            
            setGeneratedConcepts(data.concepts);
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
        if (selectedConcept === null) return;
        setIsSending(true);
        console.log("--- PROPOSAL REQUEST (SIMULATED) ---", { ...formData, logo: formData.logo?.name, selectedConcept: generatedConcepts[selectedConcept] });
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
            // Non-critical error, so we don't block the user.
            // handleApiError(e); 
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
            case 0: // Brief
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 1: Project Brief</h2>
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
                        <h2 className="text-2xl font-serif text-white mb-4">Step 2: Structural Configuration</h2>
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-3">Stand Layout (Open Sides)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {layoutOptions.map(opt => (
                                    <div key={opt.name} onClick={() => setFormData(p => ({ ...p, standLayout: opt.name }))} className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${formData.standLayout === opt.name ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border hover:border-fann-gold/50'}`}>
                                        <div className="flex justify-center items-center h-16">{opt.visual}</div>
                                        <p className="font-semibold text-sm mt-3 text-center">{opt.name.split(' (')[0]}</p>
                                        <p className="text-xs text-fann-light-gray text-center">{opt.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="grid md:grid-cols-2 gap-6 pt-4">
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
                        <h2 className="text-2xl font-serif text-white mb-4">Step 3: Functional Zones & Features</h2>
                        <p className="text-fann-light-gray text-sm">Select all the features you require for your stand.</p>
                        <div className="space-y-4">
                        {Object.entries(functionalityGroups).map(([groupName, items]) => (
                            <div key={groupName}>
                                <h3 className="font-semibold text-fann-light-gray mb-2">{groupName}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {items.map(item => (
                                    <button type="button" key={item} onClick={() => handleFunctionalityChange(item)} className={`p-3 rounded-lg border-2 text-left text-sm transition-colors flex items-center gap-2 ${formData.functionality.includes(item) ? 'border-fann-teal bg-fann-teal/10' : 'border-fann-border hover:border-fann-teal/50'}`}>
                                        <div className={`w-4 h-4 rounded-sm flex-shrink-0 border-2 flex items-center justify-center ${formData.functionality.includes(item) ? 'bg-fann-teal border-fann-teal' : 'border-fann-light-gray'}`}>
                                            {formData.functionality.includes(item) && <CheckCircle size={12} className="text-white"/>}
                                        </div>
                                        <span>{item}</span>
                                    </button>
                                ))}
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                );
            case 3: // Aesthetics
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
                        <h2 className="text-2xl font-serif text-white mb-4">Step 4: Aesthetics & Branding</h2>
                         <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-3">Design Style</label>
                             <div className="relative">
                                {isAnalyzingStyle && <div className="absolute -top-2 -right-2 z-10 p-1 bg-fann-charcoal rounded-full"><Loader2 className="w-5 h-5 animate-spin text-fann-gold" /></div>}
                                <div className="grid grid-cols-3 gap-3">
                                    {styles.map(s => (
                                        <div key={s.name} onClick={() => setFormData(p => ({...p, style: s.name}))} className={`relative h-28 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${formData.style === s.name ? 'border-fann-gold' : 'border-transparent'}`}>
                                            <img src={s.image} alt={s.name} className="w-full h-full object-cover"/>
                                            <div className="absolute inset-0 bg-black/50 hover:bg-black/30 transition-colors"></div>
                                            <p className="absolute bottom-2 left-2 text-xs font-bold">{s.name}</p>
                                        </div>
                                    ))}
                                </div>
                             </div>
                             {formData.eventStyleDescription && (
                                <p className="text-xs text-fann-light-gray mt-2 bg-fann-charcoal p-2 rounded-md border border-fann-border">
                                    <strong>AI Suggestion for {formData.eventName}:</strong> {formData.eventStyleDescription}
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
                                            <span className="flex items-center gap-1 text-green-400 mb-2 text-sm"><CheckCircle className="w-4 h-4"/>AI suggestions are ready.</span>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestedColors.map(color => {
                                                    const isSelected = formData.brandColors.includes(color);
                                                    return (
                                                        <button type="button" key={color} onClick={() => handleColorToggle(color)} className={`flex items-center text-xs gap-1.5 p-1.5 rounded-md transition-all border ${isSelected ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border bg-fann-charcoal hover:border-fann-gold/50'}`}>
                                                            <div className="w-5 h-5 rounded border border-white/20" style={{ backgroundColor: color }}></div>
                                                            <span className="font-mono text-fann-light-gray">{color}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : suggestedColors[0] === 'ERROR' ? (
                                         <span className="flex items-center gap-1 text-red-400 text-sm"><AlertCircle className="w-4 h-4"/>Could not extract. Enter manually.</span>
                                    ) : <p className="text-sm text-fann-light-gray">Upload a logo for AI color suggestions.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Review & Contact
                return (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif text-white">Step 5: Review & Contact</h2>
                            <p className="text-fann-light-gray text-sm">Please provide your details. The generated concepts and a proposal link will be sent to your email.</p>
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
                        <div className="bg-fann-charcoal p-4 rounded-lg">
                             <h3 className="text-lg font-serif text-white mb-3 flex items-center gap-2"><FileText size={20}/> Design Brief Summary</h3>
                             <div className="space-y-2 text-sm text-fann-light-gray">
                                <p><strong>Event:</strong> <span className="text-white">{formData.eventName || 'N/A'}</span></p>
                                <p><strong>Size:</strong> <span className="text-white">{formData.standWidth}m x {formData.standLength}m ({formData.standWidth * formData.standLength} sqm)</span></p>
                                <p><strong>Layout:</strong> <span className="text-white">{formData.standLayout || 'N/A'}</span></p>
                                <p><strong>Structure:</strong> <span className="text-white">{[formData.standType, formData.standHeight, formData.doubleDecker && "Double Decker", formData.hangingStructure && "Hanging Structure"].filter(Boolean).join(', ') || 'N/A'}</span></p>
                                <p><strong>Style:</strong> <span className="text-white">{formData.style || 'N/A'}</span></p>
                                <p><strong>Functionality:</strong> <span className="text-white">{formData.functionality.length > 0 ? formData.functionality.join(', ') : 'N/A'}</span></p>
                             </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    if (isLoading) return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
            <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />
            <h2 className="text-3xl font-serif text-white mt-6">Building Your Vision...</h2>
            <p className="text-fann-light-gray mt-2 max-w-sm">Our AI is drafting blueprints and rendering concepts. This might take up to a minute.</p>
        </div>
    );
    
    if (isFinished && isProposalRequested) return (
        <AnimatedPage>
            <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
                <CheckCircle className="w-20 h-20 text-fann-teal mb-6" />
                <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Thank You!</h1>
                <p className="text-xl text-fann-cream max-w-2xl mx-auto mb-8">Our team has received your concept selection and will prepare a detailed proposal, which will be sent to <strong>{formData.userEmail}</strong> shortly.</p>
                {selectedConcept !== null && <img src={generatedConcepts[selectedConcept].imageUrl} alt="Selected" className="rounded-lg shadow-2xl w-full max-w-lg mt-8" />}
            </div>
        </AnimatedPage>
    );

    if (isFinished) return (
        <AnimatedPage>
             <AnimatePresence>
                {isModelViewerOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModelViewerOpen(false)} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-4xl h-[80vh] bg-fann-charcoal-light rounded-lg">
                            <button onClick={() => setIsModelViewerOpen(false)} className="absolute top-2 right-2 z-10 text-white bg-black/50 rounded-full p-1">&times;</button>
                            <model-viewer
                                src="https://cdn.glitch.global/6a86e927-2ace-4493-9706-e71e9a385203/booth_concept.glb?v=1717593231454"
                                alt="A 3D model of an exhibition stand"
                                camera-controls
                                auto-rotate
                                ar
                                shadow-intensity="1"
                                style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                            ></model-viewer>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Sparkles className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Your AI-Generated Concepts</h1>
                        <p className="text-xl text-fann-cream max-w-3xl mx-auto">Click your preferred design. Our team will then prepare a detailed proposal and quotation for you.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {generatedConcepts.map((concept, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }} onClick={() => setSelectedConcept(index)} className={`rounded-lg overflow-hidden cursor-pointer border-4 bg-fann-charcoal-light transition-all duration-300 ${selectedConcept === index ? 'border-fann-gold' : 'border-transparent hover:border-fann-gold/50'}`}>
                                <img src={concept.imageUrl} alt={concept.title} className="w-full h-auto object-cover aspect-video" />
                                <div className="p-6">
                                    <h3 className="text-2xl font-serif font-bold text-fann-gold">{concept.title}</h3>
                                    <p className="text-fann-cream mt-2 text-sm">{concept.description}</p>
                                    <button onClick={(e) => { e.stopPropagation(); setIsModelViewerOpen(true); }} className="mt-4 text-sm font-semibold text-fann-teal flex items-center gap-2 hover:underline">
                                        <View size={16} /> View in 3D
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                     <div className="text-center mt-12">
                        <motion.button onClick={sendProposalRequest} disabled={selectedConcept === null || isSending} className="bg-fann-teal text-white font-bold py-4 px-10 rounded-full text-lg uppercase tracking-wider flex items-center justify-center gap-2 disabled:bg-fann-charcoal-light disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{ scale: selectedConcept !== null && !isSending ? 1.05 : 1 }} whileTap={{ scale: selectedConcept !== null && !isSending ? 0.95 : 1 }}>
                            {isSending ? <><Loader2 className="w-6 h-6 animate-spin" /> Sending Request...</> : "Request Detailed Proposal"}
                        </motion.button>
                        {selectedConcept === null && <p className="text-sm text-center text-fann-light-gray mt-3">Please select a design concept to proceed.</p>}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Exhibition Stand Studio</h1>
                        <p className="text-xl text-fann-cream">Follow the steps to generate a bespoke stand concept.</p>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {steps.map((step, index) => (
                                <div key={step.name} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${currentStep >= index ? 'bg-fann-gold text-fann-charcoal border-fann-gold' : 'bg-fann-charcoal-light text-fann-light-gray border-fann-border'}`}><step.icon size={20} /></div>
                                    <span className={`text-xs mt-2 text-center font-semibold ${currentStep >= index ? 'text-white' : 'text-fann-light-gray'}`}>{step.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-fann-charcoal-light rounded-full h-1.5"><motion.div className="bg-fann-gold h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} transition={{ type: 'spring', stiffness: 50 }}/></div>
                    </div>

                    <div className="bg-fann-charcoal-light p-8 rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                                {renderStepContent()}
                            </motion.div>
                            <div className="mt-8">
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 mb-4">
                                        <div className="flex-shrink-0 pt-0.5"><AlertCircle className="w-5 h-5" /></div>
                                        <div className="flex-grow">
                                            <span className="whitespace-pre-wrap">{error}</span>
                                        </div>
                                    </motion.div>
                                )}
                                <div className="flex justify-between items-center">
                                    <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-fann-gold disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: currentStep !== 0 ? 1.05 : 1}} whileTap={{scale: currentStep !== 0 ? 0.95 : 1}}>
                                        <ArrowLeft size={16} /> Back
                                    </motion.button>
                                    
                                    {currentStep < steps.length - 1 ? (
                                        <motion.button type="button" onClick={nextStep} disabled={isNextButtonDisabled} className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full w-36 disabled:bg-fann-charcoal-light disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: !isNextButtonDisabled ? 1.05 : 1}} whileTap={{scale: !isNextButtonDisabled ? 0.95 : 1}}>
                                            {isNextButtonDisabled ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Next Step'}
                                        </motion.button>
                                    ) : (
                                        <motion.button type="submit" className="bg-fann-teal text-white font-bold py-3 px-8 rounded-full flex items-center gap-2" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
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