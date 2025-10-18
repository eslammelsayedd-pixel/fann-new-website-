

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from "@google/genai";
import { Loader2, Sparkles, Upload, ArrowLeft, Building, Scaling, ListChecks, Crown, User, CheckCircle, PartyPopper, AlertCircle, Popcorn, Palette } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { regionalEvents } from '../constants';

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
    { name: 'Show Details', icon: Popcorn },
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
    const [error, setError] = useState<string | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [isExtractingColors, setIsExtractingColors] = useState(false);
    const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [isProposalRequested, setIsProposalRequested] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isCustomEvent, setIsCustomEvent] = useState(false);
    const [isAnalyzingStyle, setIsAnalyzingStyle] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const eventNames = useMemo(() => [...new Set(regionalEvents.map(e => e.name))].sort(), []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEventSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'other') {
            setIsCustomEvent(true);
            setFormData(prev => ({ ...prev, eventName: '', style: '', eventStyleDescription: '' }));
        } else {
            setIsCustomEvent(false);
            setFormData(prev => ({ ...prev, eventName: value, style: '', eventStyleDescription: '' }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        
        setFormData(prev => {
            const newFormData = { ...prev, [name]: checked };
            if (name === 'doubleDecker' && checked && (newFormData.standHeight === '4m' || newFormData.standHeight === '5m')) {
                newFormData.standHeight = '6m';
            }
            return newFormData;
        });
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
        setIsExtractingColors(true);
        setSuggestedColors([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Data = await blobToBase64(file);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [
                    { inlineData: { mimeType: file.type, data: base64Data } },
                    { text: "Analyze the attached logo. Identify 3-5 primary brand colors. List them as a simple, comma-separated string. Example: 'Deep Navy Blue, Metallic Gold, Off-White'. Return only the color names." }
                ] },
            });
            const colorsArray = response.text.split(',').map(c => c.trim()).filter(Boolean);
            setSuggestedColors(colorsArray);
        } catch (e) {
            console.error("Error extracting colors:", e);
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

    const addSuggestedColor = (color: string) => {
        setFormData(prev => {
            const currentColors = prev.brandColors.trim();
            const colorSet = new Set(currentColors.split(',').map(c => c.trim().toLowerCase()).filter(Boolean));
            if (colorSet.has(color.toLowerCase())) return prev;
            return { ...prev, brandColors: currentColors ? `${currentColors}, ${color}` : color };
        });
    };

    const analyzeShowStyle = async () => {
        if (!formData.eventName) {
            setError("Please select or enter an event name.");
            return;
        }
        setIsAnalyzingStyle(true);
        setError(null);
        setFormData(prev => ({ ...prev, style: '', eventStyleDescription: '' }));

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const availableStyles = styles.map(s => s.name);

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Analyze the event named '${formData.eventName}'. Based on its industry and reputation, determine the single most appropriate exhibition stand design style from the following options: [${availableStyles.join(', ')}]. Provide a concise, one-sentence description of this event's typical stand characteristics.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            style: { type: Type.STRING, description: `The single best style for the event. Must be one of: ${availableStyles.join(', ')}.` },
                            description: { type: Type.STRING, description: 'A one-sentence description of typical stand characteristics.' }
                        },
                        required: ['style', 'description']
                    }
                }
            });

            let jsonString = response.text.trim();
            if (jsonString.startsWith('```json')) {
                jsonString = jsonString.substring(7, jsonString.length - 3).trim();
            } else if (jsonString.startsWith('```')) {
                 jsonString = jsonString.substring(3, jsonString.length - 3).trim();
            }

            const result = JSON.parse(jsonString);
            const returnedStyle = result.style;
            const validStyle = availableStyles.find(s => s.toLowerCase() === returnedStyle.toLowerCase());

            if (validStyle) {
                setFormData(prev => ({
                    ...prev,
                    style: validStyle,
                    eventStyleDescription: result.description,
                }));
            } else {
                throw new Error(`AI returned an invalid style: '${returnedStyle}'.`);
            }
        } catch (e) {
            console.error("Style analysis failed:", e);
            setError("Could not analyze the event style. Please try a different name or check the console for details.");
        } finally {
            setIsAnalyzingStyle(false);
        }
    };

    const validateStep = (step: number): boolean => {
        setError(null);
        switch(step) {
            case 0:
                if (!formData.standWidth || !formData.standLength || !formData.industry || !formData.standLayout) {
                    setError("Please complete all foundation details.");
                    return false;
                }
                return true;
            case 1:
                if (!formData.standType || !formData.standHeight) {
                    setError("Please select structure details.");
                    return false;
                }
                if (formData.doubleDecker && (formData.standHeight === '4m' || formData.standHeight === '5m')) {
                    setError("A double-decker stand requires at least 6m height.");
                    return false;
                }
                return true;
            case 2:
                if (!formData.eventName || !formData.style) {
                    setError("Please select an event and analyze its style.");
                    return false;
                }
                return true;
            case 3:
                if (formData.functionality.length === 0) {
                    setError("Please select at least one feature.");
                    return false;
                }
                return true;
            case 4:
                if (!formData.logo || !formData.brandColors.trim()) {
                    setError("Please upload your logo and provide brand colors.");
                    return false;
                }
                return true;
            case 5:
                if (!formData.userName.trim() || !formData.userEmail.trim() || !formData.userMobile.trim() || !/\S+@\S+\.\S+/.test(formData.userEmail)) {
                    setError("Please provide valid contact details.");
                    return false;
                }
                return true;
            default: return true;
        }
    }
    
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setError(null);
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const generateDesign = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        if (!formData.logo) {
            setError("Logo is missing.");
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const logoBase64 = await blobToBase64(formData.logo);
            
            const layoutDescription = getLayoutDescription(formData.standLayout);

            const textPrompt = `
Objective: Create a photorealistic 3D concept render for a premium, award-winning exhibition stand.

**Event Context:**
- Event Name: ${formData.eventName}
- Exhibitor Industry: ${formData.industry}

**Architectural Specifications:**
- Dimensions: ${formData.standWidth}m wide x ${formData.standLength}m long.
- Stand Layout: ${formData.standLayout}.
- Layout Constraint: ${layoutDescription} This is a critical instruction. The generated image's perspective MUST clearly show the stand's configuration, including any solid walls and open sides as described. The surrounding environment should hint at its position (e.g., adjacent stands for a linear layout, aisles on all sides for an island).
- Stand Type: ${formData.standType} build.
- Max Height: ${formData.standHeight}.

**Mandatory Structural Features:**
${formData.doubleDecker ? '- The stand MUST be a two-story, double-decker structure.\\n' : ''}${formData.hangingStructure ? '- Include a large, branded hanging structure suspended from the ceiling.\\n' : ''}
**Core Design & Style:**
- Primary Style: ${formData.style}.
- Style Guide: Adhere to these characteristics: "${formData.eventStyleDescription}".
- Atmosphere: Professional, high-end, and inviting.

**Functional Zones (Must be visible):**
- Include areas for: ${formData.functionality.join(', ')}.

**Branding & Aesthetics:**
- **Primary Colors:** The design MUST prominently feature these brand colors: ${formData.brandColors}.
- **Logo Integration:** The provided company logo is CRITICAL. It must be clearly visible and integrated elegantly on a major architectural feature like a main wall, reception desk, or the hanging structure.
- **Visuals:** Ensure high-quality lighting, realistic textures, and a clean, uncluttered composition.
${formData.hostess ? '- A professionally dressed hostess should be visible at the reception desk.' : ''}

Generate a single, compelling, wide-angle view of the stand as if a visitor is approaching it.
`;

            const imagePromises = Array(4).fill(0).map((_, i) => 
                ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [{ inlineData: { data: logoBase64, mimeType: formData.logo!.type } }, { text: `${textPrompt}\\n\\nVariation ${i + 1} of 4.` }] },
                    config: { responseModalities: ['IMAGE'] },
                })
            );

            const responses = await Promise.all(imagePromises);
            const imageUrls = responses.map(res => res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData)
                                        .filter(Boolean)
                                        .map(data => `data:${data.mimeType};base64,${data.data}`);

            if (imageUrls.length < 1) {
                throw new Error("The AI model failed to generate any images.");
            }
            
            setGeneratedImages(imageUrls);
            setIsFinished(true);
            
        } catch (e) {
            console.error("Design generation failed:", e);
            setError('An error occurred during design generation. This could be a temporary issue or a safety filter violation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            nextStep();
            generateDesign();
        }
    };

    const sendProposalRequest = async () => {
        if (selectedImage === null) return;
        setIsSending(true);
        // Simulate API call
        console.log("--- PROPOSAL REQUEST (SIMULATED) ---", { ...formData, logo: formData.logo?.name, selectedConceptImageIndex: selectedImage });
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSending(false);
        setIsProposalRequested(true);
    };

    const renderStepContent = () => {
        switch(currentStep) {
            case 0: // Foundation
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Step 1: The Foundation</h3>
                        <p className="text-gray-400 mb-6">Let's start with the basics of your space.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-end gap-2">
                                <div>
                                    <label htmlFor="standWidth" className="block text-sm font-medium text-gray-400 mb-1">Width (m)</label>
                                    <input id="standWidth" type="number" name="standWidth" value={formData.standWidth} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" required min="1" />
                                </div>
                                <span className="text-gray-400 pb-2.5">x</span>
                                <div>
                                    <label htmlFor="standLength" className="block text-sm font-medium text-gray-400 mb-1">Length (m)</label>
                                    <input id="standLength" type="number" name="standLength" value={formData.standLength} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" required min="1" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Your Industry</label>
                                <select name="industry" value={formData.industry} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-gray-700 rounded px-3 py-2" required>
                                    <option value="" disabled>Select your industry</option>
                                    <option>Technology</option><option>Healthcare</option><option>Aviation</option><option>Real Estate</option><option>Luxury Goods</option><option>Food & Beverage</option><option>Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Stand Layout</label>
                                <select name="standLayout" value={formData.standLayout} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-gray-700 rounded px-3 py-2" required>
                                    <option value="" disabled>Select stand layout</option>
                                    <option>Corner (2 sides open)</option>
                                    <option>Linear (1 side open / in-line)</option>
                                    <option>Island (4 sides open / standalone)</option>
                                    <option>Peninsula (3 sides open)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 1: // Structure
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Step 2: Structure & Scale</h3>
                        <p className="text-gray-400 mb-6">Define the physical presence of your stand.</p>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Stand Type</label>
                                    <select name="standType" value={formData.standType} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-gray-700 rounded px-3 py-2" required>
                                        <option value="" disabled>Select stand type</option>
                                        <option>Space Only</option><option>Shell Scheme</option><option>Modular System</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Stand Height</label>
                                    <select name="standHeight" value={formData.standHeight} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-gray-700 rounded px-3 py-2" required>
                                        <option value="" disabled>Select stand height</option>
                                        <option>4m</option><option>5m</option><option>6m</option><option>Max Height Permitted</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <label className="flex items-center p-4 bg-fann-charcoal border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800">
                                   <input type="checkbox" name="doubleDecker" checked={formData.doubleDecker} onChange={handleCheckboxChange} className="h-5 w-5 rounded text-fann-teal focus:ring-fann-teal" />
                                   <span className="ml-3 text-white">Double Decker?</span>
                               </label>
                               <label className="flex items-center p-4 bg-fann-charcoal border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800">
                                   <input type="checkbox" name="hangingStructure" checked={formData.hangingStructure} onChange={handleCheckboxChange} className="h-5 w-5 rounded text-fann-teal focus:ring-fann-teal" />
                                   <span className="ml-3 text-white">Hanging Structure?</span>
                               </label>
                            </div>
                        </div>
                    </div>
                );
            case 2: // Show Details
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Step 3: Show Details</h3>
                        <p className="text-gray-400 mb-6">Select your event to help our AI tailor the design style.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Event Name</label>
                                <select onChange={handleEventSelectChange} value={isCustomEvent ? 'other' : formData.eventName} className="w-full bg-fann-charcoal border border-gray-700 rounded px-3 py-2" required>
                                    <option value="" disabled>Select from the list...</option>
                                    {eventNames.map(name => <option key={name} value={name}>{name}</option>)}
                                    <option value="other">Other (Please specify)</option>
                                </select>
                            </div>
                            {isCustomEvent && (
                                <input type="text" name="eventName" placeholder="Enter your event name" value={formData.eventName} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" />
                            )}
                            <button type="button" onClick={analyzeShowStyle} disabled={isAnalyzingStyle || !formData.eventName} className="w-full flex items-center justify-center gap-2 bg-fann-teal text-white font-bold py-2.5 px-6 rounded-full disabled:bg-gray-600">
                                {isAnalyzingStyle ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Sparkles size={16} /> Analyze Show Style</>}
                            </button>

                            {formData.style && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-fann-charcoal border border-fann-teal/50 rounded-lg">
                                    <p className="text-sm text-gray-400">Recommended Style:</p>
                                    <p className="text-xl font-bold text-fann-gold">{formData.style}</p>
                                    <p className="text-gray-300 mt-1">{formData.eventStyleDescription}</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                );
            case 3: // Functionality
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Step 4: Functionality & Services</h3>
                        <p className="text-gray-400 mb-6">Select the key features and services your stand must include.</p>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            {functionalityOptions.map(opt => (
                                <label key={opt} className={`flex items-center p-3 text-sm rounded-lg cursor-pointer transition-colors ${formData.functionality.includes(opt) ? 'bg-fann-teal text-white' : 'bg-fann-charcoal border border-gray-700'}`}>
                                    <input type="checkbox" checked={formData.functionality.includes(opt)} onChange={() => handleFunctionalityChange(opt)} className="hidden" />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                         <label className="flex items-center p-4 bg-fann-charcoal border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800">
                             <input type="checkbox" name="hostess" checked={formData.hostess} onChange={handleCheckboxChange} className="h-5 w-5 rounded text-fann-teal focus:ring-fann-teal" />
                             <span className="ml-3 text-white">Hostess Required?</span>
                         </label>
                    </div>
                );
            case 4: // Branding
                return (
                    <div>
                         <h3 className="text-2xl font-semibold mb-2">Step 5: Branding & Vision</h3>
                         <p className="text-gray-400 mb-6">Provide your brand assets to guide the design.</p>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Upload Your Logo</label>
                                <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer">
                                    <div className="space-y-1 text-center">
                                        {formData.logoPreview ? (
                                            <img src={formData.logoPreview} alt="Logo Preview" className="mx-auto h-24 w-auto" />
                                        ) : (
                                            <>
                                                <Upload className="mx-auto h-12 w-12 text-gray-500" />
                                                <p className="text-sm text-gray-400">Click to upload a file</p>
                                                <p className="text-xs text-gray-500">PNG, JPG, SVG up to 10MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleLogoChange} accept="image/*"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Brand Colors</label>
                                <input type="text" name="brandColors" value={formData.brandColors} onChange={handleInputChange} placeholder="e.g., Navy Blue, Gold, White" className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" required />
                                {isExtractingColors && (
                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Extracting colors from your logo...</span>
                                    </div>
                                )}
                                {!isExtractingColors && suggestedColors.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-400 mb-2">Suggested colors (click to add):</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedColors.map(color => (
                                                <button
                                                    type="button"
                                                    key={color}
                                                    onClick={() => addSuggestedColor(color)}
                                                    className="bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded-full hover:bg-fann-teal transition-colors"
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                         </div>
                    </div>
                );
            case 5: // User Details
                return (
                     <div>
                         <h3 className="text-2xl font-semibold mb-2">Step 6: Almost There!</h3>
                         <p className="text-gray-400 mb-6">Enter your details to generate your design and receive your complimentary proposal.</p>
                         <div className="space-y-4">
                            <input type="text" name="userName" placeholder="Your Name" value={formData.userName} onChange={handleInputChange} required className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" />
                            <input type="email" name="userEmail" placeholder="Your Email" value={formData.userEmail} onChange={handleInputChange} required className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" />
                            <input type="tel" name="userMobile" placeholder="Your Mobile" value={formData.userMobile} onChange={handleInputChange} required className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" />
                         </div>
                    </div>
                );
            default: return null;
        }
    }
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-center">
                <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />
                <h2 className="text-3xl font-serif text-white mt-6">Crafting Your Vision...</h2>
                <p className="text-gray-400 mt-2 max-w-sm">Our AI is assembling architectural elements, materials, and lighting to bring your concept to life. This may take a few moments.</p>
            </div>
        );
    }
    
    if (isFinished && isProposalRequested) {
        return (
            <AnimatedPage>
                <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
                    <CheckCircle className="w-20 h-20 text-fann-teal mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Thank You!</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                        Your selection has been received. Our team is now preparing a detailed proposal which includes additional 3D views, a full quotation, and material specifications.
                    </p>
                    <p className="text-lg text-gray-400">
                        You will receive the proposal at <strong>{formData.userEmail}</strong> shortly.
                    </p>
                     {selectedImage !== null && generatedImages[selectedImage] && (
                        <div className="mt-8 max-w-lg w-full">
                            <p className="text-sm text-gray-500 mb-2">Your Selected Concept:</p>
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
                            <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Select Your Favorite Concept</h1>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Click your preferred design below. Our team will then prepare a detailed proposal with more angles and a full quotation, sent directly to your email.
                            </p>
                        </div>
                        
                         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                             <div className="lg:col-span-3">
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
                             <div className="lg:col-span-1 bg-black/20 p-6 rounded-lg self-start sticky top-24">
                                <h3 className="text-2xl font-serif text-fann-gold mb-4">Project Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <p><strong>Event:</strong> {formData.eventName}</p>
                                    <p><strong>Size:</strong> {formData.standWidth}m x {formData.standLength}m ({formData.standWidth * formData.standLength} sqm)</p>
                                    <p><strong>AI Style:</strong> {formData.style}</p>
                                    <p><strong>Layout:</strong> {formData.standLayout}</p>
                                    <p><strong>Type:</strong> {formData.standType}, {formData.standHeight} height</p>
                                     <div className="pt-4 mt-4 border-t border-gray-700">
                                        <motion.button
                                            onClick={sendProposalRequest}
                                            disabled={selectedImage === null || isSending}
                                            className="w-full bg-fann-teal text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                            whileHover={{ scale: selectedImage !== null && !isSending ? 1.05 : 1 }}
                                            whileTap={{ scale: selectedImage !== null && !isSending ? 0.95 : 1 }}
                                        >
                                            {isSending ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : "Request Detailed Proposal"}
                                        </motion.button>
                                        {selectedImage === null && <p className="text-xs text-center text-gray-400 mt-2">Please select a design to proceed.</p>}
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
                        <p className="text-xl text-gray-300">Follow the steps to create a bespoke exhibition stand concept.</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {steps.map((step, index) => (
                                <div key={step.name} className="flex flex-col items-center w-1/6">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= index ? 'bg-fann-gold text-fann-charcoal' : 'bg-gray-700 text-gray-400'}`}>
                                        <step.icon size={16} />
                                    </div>
                                    <span className={`text-xs mt-1 text-center ${currentStep >= index ? 'text-white' : 'text-gray-500'}`}>{step.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-700 rounded-full h-1.5">
                            <motion.div 
                                className="bg-fann-gold h-1.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentStep / (steps.length -1)) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 50 }}
                            />
                        </div>
                    </div>

                    <div className="bg-black/20 p-8 rounded-lg">
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
                                        className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-3 mb-4"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                                <div className="flex justify-between items-center">
                                    <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-fann-gold disabled:text-gray-500 disabled:cursor-not-allowed" whileHover={{scale: currentStep !== 0 ? 1.05 : 1}} whileTap={{scale: currentStep !== 0 ? 0.95 : 1}}>
                                        <ArrowLeft size={16} /> Back
                                    </motion.button>
                                    
                                    {currentStep < steps.length - 1 ? (
                                        <motion.button type="button" onClick={nextStep} className="bg-fann-gold text-fann-charcoal font-bold py-2 px-6 rounded-full" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                            Next
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