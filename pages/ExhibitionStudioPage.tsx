import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality } from "@google/genai";
import { Loader2, Sparkles, Upload, ArrowLeft, Building, Scaling, Palette, ListChecks, Crown, User, CheckCircle, PartyPopper, AlertCircle } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

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
    style: string;
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
    style: '',
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
    { name: 'Style', icon: Crown },
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
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        
        setFormData(prev => {
            const newFormData = { ...prev, [name]: checked };

            // Automatically adjust height for double decker
            if (name === 'doubleDecker' && checked) {
                // If a height is selected and it's too low, upgrade it.
                if (newFormData.standHeight === '4m' || newFormData.standHeight === '5m') {
                    newFormData.standHeight = '6m';
                }
            }
            return newFormData;
        });
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
        setIsExtractingColors(true);
        setSuggestedColors([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Data = await blobToBase64(file);
            const imagePart = {
                inlineData: { mimeType: file.type, data: base64Data },
            };
            const textPart = {
                text: "Analyze the attached logo. Identify the 3-5 primary brand colors. List them as a simple, comma-separated string. For example: 'Deep Navy Blue, Metallic Gold, Off-White'. Only return the color names, nothing else."
            };
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
            });

            const colorsText = response.text;
            if (colorsText) {
                const colorsArray = colorsText.split(',').map(c => c.trim()).filter(c => c);
                setSuggestedColors(colorsArray);
            }

        } catch (e) {
            console.error("Error extracting colors:", e);
            // Don't show an error to the user, just fail silently.
        } finally {
            setIsExtractingColors(false);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const logoPreview = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, logo: file, logoPreview, brandColors: '' })); // Reset brand colors
            extractColorsFromLogo(file);
        }
    };

    const addSuggestedColor = (color: string) => {
        setFormData(prev => {
            const currentColors = prev.brandColors.trim();
            const colorSet = new Set(currentColors.split(',').map(c => c.trim().toLowerCase()).filter(Boolean));
            
            if (colorSet.has(color.toLowerCase())) {
                return prev; // Color already exists
            }

            const newColors = currentColors ? `${currentColors}, ${color}` : color;
            return { ...prev, brandColors: newColors };
        });
    };

    const validateStep = (step: number): boolean => {
        switch(step) {
            case 0: // Foundation
                if (!formData.standWidth || formData.standWidth <= 0 || !formData.standLength || formData.standLength <= 0) {
                    setError("Please provide valid, positive stand dimensions.");
                    return false;
                }
                 if (!formData.industry) {
                    setError("Please select your industry.");
                    return false;
                }
                if (!formData.standLayout) {
                    setError("Please select the stand layout.");
                    return false;
                }
                return true;
            case 1: // Structure
                if (!formData.standType) {
                    setError("Please select the stand type.");
                    return false;
                }
                if (!formData.standHeight) {
                    setError("Please select the stand height.");
                    return false;
                }
                if (formData.doubleDecker && (formData.standHeight === '4m' || formData.standHeight === '5m')) {
                    setError("A double-decker stand requires a minimum height of 6m. Please select '6m' or 'Max Height Permitted'.");
                    return false;
                }
                return true;
            case 2: // Style
                if (formData.style === '') {
                    setError("Please choose a style for your stand.");
                    return false;
                }
                return true;
            case 3: // Functionality
                if (formData.functionality.length === 0) {
                    setError("Please select at least one feature or service.");
                    return false;
                }
                return true;
            case 4: // Branding
                if (!formData.logo) {
                    setError("Please upload your company logo.");
                    return false;
                }
                if (formData.brandColors.trim() === '') {
                    setError("Please provide your brand colors. You can use the suggestions or type them manually.");
                    return false;
                }
                return true;
            case 5: // User Details (before final submit)
                if (formData.userName.trim() === '' || formData.userEmail.trim() === '' || formData.userMobile.trim() === '') {
                    setError("Please fill in all your contact details to receive your design.");
                    return false;
                }
                // Basic email validation
                if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
                    setError("Please enter a valid email address.");
                    return false;
                }
                return true;
            default:
                return true; // No validation for other steps
        }
    }
    
    const nextStep = () => {
        setError(null);
        if (!validateStep(currentStep)) {
            return;
        }
        setCurrentStep(prev => Math.min(prev + 1, steps.length));
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
            setError("Logo is missing. Please go back and upload your logo.");
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const logoBase64 = await blobToBase64(formData.logo);
            const logoMimeType = formData.logo.type;

            const logoPart = {
                inlineData: {
                    data: logoBase64,
                    mimeType: logoMimeType,
                },
            };
            
            const textPrompt = `
                Create a photorealistic 3D render of a bespoke exhibition stand concept for a '${formData.industry}' company.
                The stand size is ${formData.standWidth}m x ${formData.standLength}m.
                The stand layout is '${formData.standLayout}'. This is a critical design constraint that dictates how many sides are open to visitor traffic.
                The stand type is '${formData.standType}'.
                The style must be '${formData.style}'.
                Structural features: Stand height is '${formData.standHeight}'. ${formData.doubleDecker ? 'It MUST be a double-decker stand. ' : ''}${formData.hangingStructure ? 'It MUST include a prominent hanging structure from the ceiling. ' : ''}
                The primary brand colors are '${formData.brandColors || 'neutral tones'}'.
                The stand must include the following features: ${formData.functionality.join(', ')}.
                ${formData.hostess ? 'Include a hostess at the reception desk.' : ''}
                The design must be innovative, high-end, and award-winning quality, suitable for a major international expo like GITEX in Dubai.
                Focus on premium materials, dynamic architectural lines, and sophisticated lighting.
                IMPORTANT: You MUST incorporate the provided company logo image prominently and naturally into the design, for example on the main reception desk, a feature wall, or the hanging structure. The logo should be clearly visible and integrated into the stand's architecture.
            `;

            console.log("Generating designs with gemini-2.5-flash-image and user logo...");

            const imagePromises = Array(4).fill(0).map((_, i) => 
                ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [logoPart, { text: `${textPrompt}\n\nVariation ${i + 1} of 4.` }] },
                    config: {
                        responseModalities: [Modality.IMAGE, Modality.TEXT],
                    },
                })
            );

            const responses = await Promise.all(imagePromises);

            const imageUrls = responses.map(response => {
                const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
                if (imagePart?.inlineData) {
                    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
                }
                return null;
            }).filter((url): url is string => url !== null);

            if (imageUrls.length < 4) {
                 // Even if some fail, show what we have, but log an error.
                console.warn(`Could only generate ${imageUrls.length} out of 4 images.`);
                if (imageUrls.length === 0) {
                    throw new Error("The AI model failed to generate any images. This might be due to a strict safety policy or temporary issue.");
                }
            }
            
            setGeneratedImages(imageUrls);
            setIsFinished(true);
            
        } catch (e) {
            console.error("Design generation failed:", e);
            setError('An error occurred while generating the design. This could be due to a temporary issue or strict safety filters on the logo or prompt. Please try again in a few moments.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!validateStep(currentStep)) {
            return;
        }
        nextStep(); // This moves to loading screen state
        generateDesign();
    };

    const sendProposalRequest = async () => {
        if (selectedImage === null) return;

        setIsSending(true);

        // In a real application, this would be a fetch/axios call to a backend API.
        // We are simulating the network request here with a timeout.
        const proposalData = {
            ...formData,
            logo: formData.logo?.name, // just send the name, not the file object
            logoPreview: undefined, // Don't send the preview URL
            selectedConceptImage: generatedImages[selectedImage],
        };

        console.log("--- PROPOSAL REQUEST SENT (SIMULATED) ---");
        console.log(JSON.stringify(proposalData, null, 2));
        console.log("------------------------------------------");

        // Simulate network delay
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
                        <div className="space-y-4">
                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <label htmlFor="standWidth" className="block text-sm font-medium text-gray-400 mb-1">Width (m)</label>
                                    <input id="standWidth" type="number" name="standWidth" value={formData.standWidth} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" required min="1" />
                                </div>
                                <span className="text-gray-400 pb-2.5">x</span>
                                <div className="flex-1">
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
                            <div>
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
            case 2: // Style
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Step 3: Style & Vibe</h3>
                        <p className="text-gray-400 mb-6">Choose one style that best represents your brand's aesthetic.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {styles.map(s => (
                                <div key={s.name} onClick={() => setFormData(prev => ({...prev, style: s.name}))} className={`relative rounded-lg overflow-hidden cursor-pointer border-4 transition-all duration-300 ${formData.style === s.name ? 'border-fann-gold' : 'border-transparent'}`}>
                                    <img src={s.image} alt={s.name} className="h-40 w-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <h4 className="text-white font-bold text-lg">{s.name}</h4>
                                    </div>
                                    {formData.style === s.name && <CheckCircle className="absolute top-2 right-2 text-fann-gold bg-fann-charcoal rounded-full" />}
                                </div>
                            ))}
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
                        Your selection has been received. Our team is now preparing a detailed proposal which includes:
                    </p>
                    <ul className="text-left max-w-md mx-auto space-y-2 text-gray-300 list-disc list-inside mb-8">
                        <li>Additional 3D views of your chosen design.</li>
                        <li>A comprehensive quotation and project timeline.</li>
                        <li>Material specifications and options.</li>
                    </ul>
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
                                    <p><strong>Size:</strong> {formData.standWidth}m x {formData.standLength}m ({formData.standWidth * formData.standLength} sqm)</p>
                                    <p><strong>Industry:</strong> {formData.industry}</p>
                                    <p><strong>Layout:</strong> {formData.standLayout}</p>
                                    <p><strong>Style:</strong> {formData.style}</p>
                                    <p><strong>Type:</strong> {formData.standType}, {formData.standHeight} height</p>
                                    {formData.doubleDecker && <p className="text-fann-teal font-bold">✓ Double Decker</p>}
                                    {formData.hangingStructure && <p className="text-fann-teal font-bold">✓ Hanging Structure</p>}
                                    <div>
                                        <strong>Features:</strong>
                                        <ul className="list-disc list-inside text-gray-300">
                                            {formData.functionality.map(f => <li key={f}>{f}</li>)}
                                        </ul>
                                    </div>
                                     <div className="pt-4 mt-4 border-t border-gray-700">
                                        <motion.button
                                            onClick={sendProposalRequest}
                                            disabled={selectedImage === null || isSending}
                                            className="w-full bg-fann-teal text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                            whileHover={{ scale: selectedImage !== null && !isSending ? 1.05 : 1 }}
                                            whileTap={{ scale: selectedImage !== null && !isSending ? 0.95 : 1 }}
                                        >
                                            {isSending ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                "Request Detailed Proposal"
                                            )}
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
                                <div key={step.name} className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= index ? 'bg-fann-gold text-fann-charcoal' : 'bg-gray-700 text-gray-400'}`}>
                                        <step.icon size={16} />
                                    </div>
                                    <span className={`text-xs mt-1 ${currentStep >= index ? 'text-white' : 'text-gray-500'}`}>{step.name}</span>
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
                                        <AlertCircle className="w-5 h-5" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                                <div className="flex justify-between items-center">
                                    <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-fann-gold disabled:text-gray-500 disabled:cursor-not-allowed" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
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