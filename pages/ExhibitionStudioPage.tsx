import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, ArrowLeft, Building, ListChecks, Palette, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyProvider';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { useUser, UserDetails } from '../context/UserProvider';
import UserDetailsModal from '../components/modals/UserDetailsModal';
import WatermarkWrapper from '../components/WatermarkWrapper';
import { countryCodes } from '../constants';


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
    location: string;
    style: string;
    eventStyleDescription: string;
    functionality: string[];
    logo: File | null;
    logoPreview: string;
    brandColors: string[];
}

type Angle = 'front' | 'top' | 'interior';

interface GeneratedConcept {
    title: string;
    description: string;
    images: Record<Angle, string>;
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
    location: '',
    style: '',
    eventStyleDescription: '',
    functionality: [],
    logo: null,
    logoPreview: '',
    brandColors: [],
};

const styles = [
    { name: 'Luxury', image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Minimalist', image: 'https://images.pexels.com/photos/1227511/pexels-photo-1227511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Futuristic', image: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Biophilic', image: 'https://images.pexels.com/photos/1739849/pexels-photo-1739849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Industrial', image: 'https://images.pexels.com/photos/196643/pexels-photo-196643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Playful', image: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

const functionalityGroups = {
    "Reception & Hospitality": ['Reception Desk', 'Hospitality Bar', 'Lounge Area', 'Charging Stations'],
    "Display & Demonstration": ['Product Displays', 'Interactive Demo Stations', 'VR/AR Demo Zone'],
    "Media & Presentation": ['LED Video Wall', 'Live Presentation Stage'],
    "Meeting & Operations": ['Private Meeting Room', 'Storage Room'],
    "Structural Elements": ['Raised Flooring'],
    "Staffing & Services": ['Hostess'],
};

const layoutOptions = [
    { name: 'Linear (1 side open / in-line)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-t-2 border-l-2 border-r-2 border-fann-light-gray"><div className="absolute inset-x-0 -bottom-px h-1 bg-fann-gold"></div></div>, description: 'One side open to the aisle.' },
    { name: 'Corner (2 sides open)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-t-2 border-l-2 border-fann-light-gray"><div className="absolute inset-x-0 -bottom-px h-1 bg-fann-gold"></div><div className="absolute inset-y-0 -right-px w-1 bg-fann-gold"></div></div>, description: 'Two open sides, on a corner.' },
    { name: 'Peninsula (3 sides open)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-t-2 border-fann-light-gray"><div className="absolute inset-x-0 -bottom-px h-1 bg-fann-gold"></div><div className="absolute inset-y-0 -right-px w-1 bg-fann-gold"></div><div className="absolute inset-y-0 -left-px w-1 bg-fann-gold"></div></div>, description: 'Three open sides into an aisle.' },
    { name: 'Island (4 sides open / standalone)', visual: <div className="w-16 h-12 bg-fann-charcoal relative border-2 border-fann-gold"></div>, description: 'Fully standalone with four open sides.' },
];

const steps = [
    { name: 'Brief', icon: Building },
    { name: 'Structure', icon: Building },
    { name: 'Functionality', icon: ListChecks },
    { name: 'Aesthetics', icon: Palette },
    { name: 'Generate', icon: Sparkles },
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
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { currentUser, login, incrementGenerations, getGenerationsRemaining } = useUser();
    const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);

    const [currentStep, setCurrentStep] = useState(() => {
        const stepParam = searchParams.get('step');
        const initialStep = stepParam ? parseInt(stepParam, 10) : 0;
        return Math.max(0, Math.min(initialStep, steps.length - 1));
    });

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedConcepts, setGeneratedConcepts] = useState<GeneratedConcept[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isExtractingColors, setIsExtractingColors] = useState(false);
    const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
    const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
    const [isProposalRequested, setIsProposalRequested] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isAnalyzingStyle, setIsAnalyzingStyle] = useState(false);
    const [isAnalyzingIndustry, setIsAnalyzingIndustry] = useState(false);
    
    const [activeAngles, setActiveAngles] = useState<Record<number, Angle>>({});


    const { ensureApiKey, handleApiError, error: apiKeyError, clearError: clearApiKeyError } = useApiKey();
    const [localError, setLocalError] = useState<string | null>(null);
    
    const error = useMemo(() => apiKeyError || localError, [apiKeyError, localError]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSearchParams({ step: currentStep.toString() });
    }, [currentStep, setSearchParams]);

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

    useEffect(() => {
        const heightValue = parseFloat(formData.standHeight);
        const doubleDeckerError = "Minimum height for a Double Decker stand is 5 meters. Please select 5m or higher.";

        if (formData.doubleDecker && !isNaN(heightValue) && heightValue < 5) {
            setError(doubleDeckerError);
        } else if (error === doubleDeckerError) {
            clearAllErrors();
        }
    }, [formData.doubleDecker, formData.standHeight, error]);


    const validateStep = (step: number): boolean => {
        clearAllErrors();
        switch (step) {
            case 0:
                if (!formData.eventName) { setError("Please enter an event name."); return false; }
                if (!formData.location) { setError("Please enter the event location."); return false; }
                if (!formData.industry) { setError("Could not determine industry. Please enter a recognized event name or contact us."); return false; }
                break;
            case 1:
                if (!formData.standLayout || !formData.standType || !formData.standHeight) { setError("Please complete all structure details."); return false; }
                const heightValue = parseFloat(formData.standHeight);
                if (formData.doubleDecker && !isNaN(heightValue) && heightValue < 5) { setError("Minimum height for a Double Decker stand is 5 meters."); return false; }
                break;
            case 2:
                if (formData.functionality.length === 0) { setError("Please select at least one functionality requirement."); return false; }
                break;
            case 3:
                if (!formData.style) { setError("Please select a design style."); return false; }
                if (!formData.logo) { setError("Please upload your company logo."); return false; }
                if (formData.brandColors.length === 0) { setError("Please provide your brand colors."); return false; }
                break;
            case 4:
                // Generation step, no validation here
                break;
        }
        return true;
    };
    
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const prevStep = () => {
        clearAllErrors();
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleActualGeneration = async () => {
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
            
            incrementGenerations(); 
            setGeneratedConcepts(data.concepts);
            setIsFinished(true);
            
        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    }

    const generateDesign = () => {
        if (!currentUser) {
            setShowUserDetailsModal(true);
            return;
        }

        const generationsUsed = currentUser.generationsUsed;
        
        if (generationsUsed >= 2) {
            navigate('/pricing');
            return;
        }

        if (generationsUsed === 1) {
             if (window.confirm("This is your last free generation. Are you sure you want to proceed?")) {
                handleActualGeneration();
            }
            return;
        }

        // generationsUsed is 0
        handleActualGeneration();
    };

    const handleUserDetailsSuccess = (details: UserDetails) => {
        login(details);
        setShowUserDetailsModal(false);
        // Automatically trigger generation after user signs up
        handleActualGeneration();
    };

    const sendProposalRequest = async () => {
        if (selectedConcept === null) return;
        setIsSending(true);
        // Simulate sending proposal.
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSending(false);
        setIsProposalRequested(true);
    };

    const isNextButtonDisabled = currentStep === 3 && isExtractingColors || currentStep === 0 && (isAnalyzingStyle || isAnalyzingIndustry);
    
    const analyzeShowStyle = async (eventName: string, industry: string) => {
        if (!eventName || !industry) return;
        if (!await ensureApiKey()) return;
        setIsAnalyzingStyle(true);
        try {
            const response = await fetch('/api/analyze-show-style', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventName, industryContext: industry, availableStyles: styles.map(s => s.name) })
            });
            if (!response.ok) throw new Error('Failed to analyze style.');
            const data = await response.json();
            if (data.style && data.description) {
                setFormData(p => ({ ...p, style: data.style, eventStyleDescription: data.description }));
            }
        } catch (e) { console.error('Error analyzing show style:', e); } 
        finally { setIsAnalyzingStyle(false); }
    };

    const analyzeIndustry = async (eventName: string) => {
        if (!eventName.trim()) return;
        if (!await ensureApiKey()) return;
        setIsAnalyzingIndustry(true);
        setFormData(p => ({ ...p, industry: '', style: '', eventStyleDescription: '' }));
        try {
            const response = await fetch('/api/analyze-event-industry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventName })
            });
            if (!response.ok) throw new Error('Failed to analyze industry.');
            const data = await response.json();
            if (data.industry) {
                setFormData(p => ({ ...p, industry: data.industry }));
            }
        } catch (e) { handleApiError(e); } 
        finally { setIsAnalyzingIndustry(false); }
    };
    
     useEffect(() => {
        if (formData.eventName && formData.industry) {
            analyzeShowStyle(formData.eventName, formData.industry);
        }
    }, [formData.eventName, formData.industry]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Brief
                 return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 1: Project Brief</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="eventName" className="block text-sm font-medium text-fann-light-gray mb-2">Event Name</label>
                                <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={handleInputChange} onBlur={(e) => analyzeIndustry(e.target.value)} placeholder="e.g., GITEX Global" className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"/>
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-fann-light-gray mb-2">Event Location</label>
                                <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Dubai World Trade Centre" className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="industry" className="block text-sm font-medium text-fann-light-gray mb-2">Industry (Auto-detected)</label>
                            <div className="relative">
                                <input type="text" id="industry" name="industry" value={formData.industry} readOnly placeholder="Analyzed from event name..." className="w-full bg-fann-charcoal-light/50 border border-fann-border rounded-md px-3 py-2 text-fann-light-gray"/>
                                {isAnalyzingIndustry && ( <div className="absolute inset-y-0 right-0 flex items-center pr-3"> <Loader2 className="w-5 h-5 animate-spin text-fann-gold" /> </div> )}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 pt-4">
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
                    <div className="space-y-8">
                        <h2 className="text-2xl font-serif text-white">Step 2: Structural Configuration</h2>
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-3">Stand Layout (Open Sides)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {layoutOptions.map(opt => (
                                    <div key={opt.name} onClick={() => setFormData(p => ({ ...p, standLayout: opt.name }))} className={`p-4 rounded-lg border-2 cursor-pointer transition-colors flex flex-col justify-between items-center h-full ${formData.standLayout === opt.name ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border hover:border-fann-gold/50'}`}>
                                        <div className="flex justify-center items-center h-16">{opt.visual}</div>
                                        <div className="text-center">
                                            <p className="font-semibold text-sm mt-3">{opt.name.split(' (')[0]}</p>
                                            <p className="text-xs text-fann-light-gray">{opt.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-fann-border pt-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="standType" className="block text-sm font-medium text-fann-light-gray mb-2">Stand Type</label>
                                    <select id="standType" name="standType" value={formData.standType} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"> <option value="" disabled>Select type...</option> <option>Shell Scheme</option> <option>Modular</option> <option>Custom Built</option> </select>
                                </div>
                                <div>
                                    <label htmlFor="standHeight" className="block text-sm font-medium text-fann-light-gray mb-2">Maximum Height</label>
                                    <select id="standHeight" name="standHeight" value={formData.standHeight} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"> <option value="" disabled>Select height...</option> <option>2 meters</option> <option>3 meters</option> <option>4 meters</option> <option>5 meters</option> <option>6 meters</option> <option>Venue Maximum</option> </select>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-fann-border pt-6">
                            <label className="block text-sm font-medium text-fann-light-gray mb-3">Structural Add-ons</label>
                            <div className="flex items-center space-x-8">
                                <label htmlFor="doubleDecker" className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-white/5"> <input type="checkbox" id="doubleDecker" name="doubleDecker" checked={formData.doubleDecker} onChange={handleInputChange} className="h-4 w-4 rounded accent-fann-teal"/> <span>Double Decker (Two Story)</span> </label>
                                <label htmlFor="hangingStructure" className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-white/5"> <input type="checkbox" id="hangingStructure" name="hangingStructure" checked={formData.hangingStructure} onChange={handleInputChange} className="h-4 w-4 rounded accent-fann-teal"/> <span>Hanging Structure</span> </label>
                            </div>
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
                                        <div className={`w-4 h-4 rounded-sm flex-shrink-0 border-2 flex items-center justify-center ${formData.functionality.includes(item) ? 'bg-fann-teal border-fann-teal' : 'border-fann-light-gray'}`}> {formData.functionality.includes(item) && <CheckCircle size={12} className="text-white"/>} </div>
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
                const handleColorToggle = (color: string) => { setFormData(prev => ({ ...prev, brandColors: prev.brandColors.includes(color) ? prev.brandColors.filter(c => c !== color) : [...prev.brandColors, color] })); };
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-white mb-4">Step 4: Aesthetics & Branding</h2>
                         <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-3">Design Style</label>
                             <div className="relative">
                                {isAnalyzingStyle && <div className="absolute -top-2 -right-2 z-10 p-1 bg-fann-charcoal rounded-full"><Loader2 className="w-5 h-5 animate-spin text-fann-gold" /></div>}
                                <div className="grid grid-cols-3 gap-3"> {styles.map(s => ( <div key={s.name} onClick={() => setFormData(p => ({...p, style: s.name}))} className={`relative h-28 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${formData.style === s.name ? 'border-fann-gold' : 'border-transparent'}`}> <img src={s.image} alt={s.name} className="w-full h-full object-cover"/> <div className="absolute inset-0 bg-black/50 hover:bg-black/30 transition-colors"></div> <p className="absolute bottom-2 left-2 text-xs font-bold">{s.name}</p> </div> ))} </div>
                             </div>
                             {formData.eventStyleDescription && ( <p className="text-xs text-fann-light-gray mt-2 bg-fann-charcoal p-2 rounded-md border border-fann-border"> <strong>FANN Suggestion for {formData.eventName}:</strong> {formData.eventStyleDescription} </p> )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 items-start pt-4">
                            <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">Upload Your Logo (Vector Preferred)</label>
                                <div onClick={() => fileInputRef.current?.click()} className="h-48 w-full bg-fann-charcoal border-2 border-dashed border-fann-border rounded-lg flex items-center justify-center cursor-pointer hover:border-fann-gold transition-colors"> {formData.logoPreview ? <img src={formData.logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain p-4" /> : <div className="text-center text-fann-light-gray"><Upload className="mx-auto w-8 h-8 mb-2" /><p>Click to upload</p></div>} </div>
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif, .svg" />
                            </div>
                            <div>
                                <label htmlFor="brandColors" className="block text-sm font-medium text-fann-light-gray mb-2">Primary Brand Colors</label>
                                <input type="text" id="brandColors" name="brandColors" value={formData.brandColors.join(', ')} onChange={(e) => setFormData(p => ({...p, brandColors: e.target.value.split(',').map(c => c.trim()).filter(Boolean)}))} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" placeholder="e.g., #0A192F, Fann Gold, White" />
                                <div className="mt-2 min-h-[4rem]">
                                    {isExtractingColors ? <div className="flex items-center gap-2 text-sm text-fann-light-gray"><Loader2 className="w-4 h-4 animate-spin"/>Analyzing...</div> : suggestedColors.length > 0 && suggestedColors[0] !== 'ERROR' ? (
                                        <div>
                                            <span className="flex items-center gap-1 text-green-400 mb-2 text-sm"> <CheckCircle className="w-4 h-4"/>Suggestions are ready. Click to select/deselect. </span>
                                            <div className="flex flex-wrap gap-2"> {suggestedColors.map(color => { const isSelected = formData.brandColors.includes(color); return ( <button type="button" key={color} onClick={() => handleColorToggle(color)} className={`flex items-center text-xs gap-1.5 p-1.5 rounded-md transition-all border ${isSelected ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border bg-fann-charcoal hover:border-fann-gold/50'}`}> <div className="w-5 h-5 rounded border border-white/20" style={{ backgroundColor: color }}></div> <span className="font-mono text-fann-light-gray">{color}</span> </button> ); })} </div>
                                        </div>
                                    ) : suggestedColors[0] === 'ERROR' ? ( <span className="flex items-center gap-1 text-red-400 text-sm"> <AlertCircle className="w-4 h-4"/>Could not extract colors. Please enter them manually. </span> ) : <p className="text-sm text-fann-light-gray">Upload a logo to see suggestions.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Generate
                return (
                    <div className="text-center min-h-[400px] flex flex-col items-center justify-center">
                        <h2 className="text-3xl font-serif text-white mb-4">Your Brief is Complete!</h2>
                        <p className="text-fann-light-gray max-w-md mx-auto mb-8">
                            Ready to see your vision come to life? Click below to generate your bespoke 3D concepts.
                        </p>
                    </div>
                );
            default: return null;
        }
    };
    
    if (isLoading) return (
        <div className="min-h-screen pt-32 flex flex-col justify-center items-center text-center p-4">
            <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />
            <h2 className="text-3xl font-serif text-white mt-6">Generating Your Concepts...</h2>
            <p className="text-fann-light-gray mt-2 max-w-sm">Our generative technology is drafting architectural plans and rendering photorealistic visuals. This may take up to a minute.</p>
        </div>
    );

    if (isFinished && isProposalRequested) return (
        <div className="min-h-screen pt-32 flex flex-col justify-center items-center text-center p-4">
            <CheckCircle className="w-20 h-20 text-fann-teal mb-6" />
            <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Thank You!</h1>
            <p className="text-xl text-fann-cream max-w-2xl mx-auto mb-8">Your request has been sent. Our design team will contact you at <strong>{currentUser?.email}</strong> with a detailed proposal and quotation shortly.</p>
            {selectedConcept !== null && <img src={generatedConcepts[selectedConcept].images.front} alt="Selected Concept" className="rounded-lg shadow-2xl w-full max-w-lg mt-8" />}
        </div>
    );
    
    if (isFinished) return (
        <AnimatedPage>
            <div className="min-h-screen pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Sparkles className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-4xl font-serif font-bold text-fann-gold mt-4 mb-4">Your FANN-Generated Concepts</h1>
                        <p className="text-lg text-fann-cream max-w-3xl mx-auto">Select your preferred design to receive a detailed proposal and quotation from our team.</p>
                        <div className="mt-8">
                            <motion.button
                                onClick={generateDesign}
                                className="border-2 border-fann-gold text-fann-gold font-bold py-2 px-6 rounded-full flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <RefreshCw size={16} />
                                Regenerate Concepts
                            </motion.button>
                            
                           {currentUser?.plan === 'free' && (
                                <p className="text-xs text-fann-light-gray mt-2">
                                    You have <strong>{getGenerationsRemaining()}</strong> free generation(s) remaining.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {generatedConcepts.map((concept, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }} onClick={() => setSelectedConcept(index)} className={`p-4 bg-fann-charcoal-light rounded-lg cursor-pointer border-2 transition-all duration-300 hover:border-fann-gold/50 ${selectedConcept === index ? 'border-fann-gold' : 'border-fann-border'}`}>
                                <div className="relative aspect-video mb-4 rounded-md overflow-hidden bg-fann-charcoal">
                                     <AnimatePresence mode="wait">
                                         <motion.img key={`${index}-${activeAngles[index] || 'front'}`} src={concept.images[activeAngles[index] || 'front']} alt={`${concept.title} - ${activeAngles[index] || 'front'}`} className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
                                    </AnimatePresence>
                                     {currentUser?.plan === 'free' && <WatermarkWrapper />}
                                </div>
                                <div className="flex justify-center gap-2 mb-4">
                                    {(['front', 'top', 'interior'] as Angle[]).map(angle => (
                                        <button key={angle} onClick={(e) => { e.stopPropagation(); setActiveAngles(p => ({...p, [index]: angle}))}} className={`px-3 py-1 text-xs rounded-full transition-colors ${(activeAngles[index] || 'front') === angle ? 'bg-fann-teal text-white' : 'bg-fann-charcoal hover:bg-white/10'}`}>{angle.charAt(0).toUpperCase() + angle.slice(1)} View</button>
                                    ))}
                                </div>
                                <h3 className="text-xl font-serif font-bold text-white">{concept.title}</h3>
                                <p className="text-sm text-fann-light-gray mt-1">{concept.description}</p>
                            </motion.div>
                        ))}
                    </div>
                    <AnimatePresence>
                    {selectedConcept !== null && (
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="mt-12 bg-fann-charcoal-light p-8 rounded-lg sticky bottom-6 border-2 border-fann-gold shadow-2xl max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-fann-gold">You've Selected: "{generatedConcepts[selectedConcept].title}"</h3>
                                    <p className="text-fann-cream mt-1">Ready for the next step? Request a detailed proposal to get pricing and a project timeline.</p>
                                </div>
                                 <motion.button onClick={sendProposalRequest} disabled={isSending} className="bg-fann-teal text-white font-bold py-3 px-8 rounded-full flex-shrink-0 flex items-center justify-center gap-2 w-full md:w-auto" whileHover={{ scale: !isSending ? 1.05 : 1 }} whileTap={{ scale: !isSending ? 0.95 : 1 }}>
                                    {isSending ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : "Request Detailed Proposal"}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </AnimatedPage>
    );

    return (
        <AnimatedPage>
             {showUserDetailsModal && <UserDetailsModal designType="Exhibition" onSuccess={handleUserDetailsSuccess} />}
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                         {currentUser && currentUser.plan === 'free' && (
                             <div className="bg-fann-gold/10 border border-fann-gold text-fann-gold p-3 rounded-lg text-center text-sm mb-6">
                                 You have <span className="font-bold">{getGenerationsRemaining()} of 2</span> free generations remaining. <Link to="/pricing" className="font-bold underline">Upgrade</Link> to get more and remove watermarks.
                            </div>
                         )}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                {steps.map((step, index) => (
                                    <div key={step.name} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= index ? 'bg-fann-gold text-fann-charcoal' : 'bg-fann-charcoal-light text-fann-light-gray'}`}><step.icon size={16} /></div>
                                        <span className={`text-xs mt-1 text-center ${currentStep >= index ? 'text-white' : 'text-fann-light-gray'}`}>{step.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-fann-charcoal-light rounded-full h-1.5"><motion.div className="bg-fann-gold h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} transition={{ type: 'spring', stiffness: 50 }}/></div>
                        </div>

                        <div className="bg-fann-charcoal-light p-6 sm:p-8 rounded-lg">
                            <AnimatePresence mode="wait">
                                <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                                    {renderStepContent()}
                                </motion.div>
                            </AnimatePresence>
                            <div className="mt-8">
                                {error && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 mb-4">
                                        <div className="flex-shrink-0 pt-0.5"><AlertCircle className="w-5 h-5" /></div>
                                        <div className="flex-grow"> <span className="whitespace-pre-wrap">{error}</span> </div>
                                    </motion.div>
                                )}
                                <div className="flex justify-between items-center">
                                    <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-fann-gold disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: currentStep !== 0 ? 1.05 : 1}} whileTap={{scale: currentStep !== 0 ? 0.95 : 1}}> <ArrowLeft size={16} /> Back </motion.button>
                                    {currentStep < steps.length - 1 ? (
                                        <motion.button type="button" onClick={nextStep} disabled={isNextButtonDisabled} className="bg-fann-gold text-fann-charcoal font-bold py-2 px-6 rounded-full w-32 disabled:bg-fann-charcoal-light disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: !isNextButtonDisabled ? 1.05 : 1}} whileTap={{scale: !isNextButtonDisabled ? 0.95 : 1}}> {isNextButtonDisabled ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Next'} </motion.button>
                                    ) : (
                                        <motion.button type="button" onClick={generateDesign} className="bg-fann-teal text-white font-bold py-2 px-6 rounded-full flex items-center gap-2" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}> <Sparkles size={16} /> Generate My Concepts </motion.button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionStudioPage;