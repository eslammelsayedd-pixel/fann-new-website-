import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Sparkles, Upload, ArrowLeft, Building, Users, Palette, ListChecks, Crown, User, CheckCircle, PartyPopper, AlertCircle, Popcorn } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

// --- Helper Functions & Types ---
interface FormData {
    eventType: string;
    theme: string;
    venueType: string;
    guestCount: number;
    eventElements: string[];
    logo: File | null;
    logoPreview: string;
    brandColors: string;
    userName: string;
    userEmail: string;
    userMobile: string;
}

const initialFormData: FormData = {
    eventType: '',
    theme: '',
    venueType: '',
    guestCount: 200,
    eventElements: [],
    logo: null,
    logoPreview: '',
    brandColors: '',
    userName: '',
    userEmail: '',
    userMobile: '',
};

const eventTypes = [
    { name: 'Gala Dinner', image: 'https://images.unsplash.com/photo-1516475429286-465d815a0d72?w=800&q=80' },
    { name: 'Product Launch', image: 'https://images.unsplash.com/photo-1555529124-7625a3c0e35e?w=800&q=80' },
    { name: 'Conference', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80' },
    { name: 'Awards Ceremony', image: 'https://images.unsplash.com/photo-1594125334482-192662e4d24c?w=800&q=80' },
    { name: 'Brand Activation', image: 'https://images.unsplash.com/photo-1511578191439-6490dd523708?w=800&q=80' },
    { name: 'Corporate Summit', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80' },
];

const eventElementsOptions = [
    'Main Stage & Backdrop', 'DJ Booth / Live Band Area', 'Photo Wall / Installation', 'Custom Bar', 'Registration & Welcome Desk', 'Lounge Seating Areas', 'Catering Stations', 'Interactive Displays', 'Projection Mapping', 'Branded Podiums', 'Red Carpet Entrance', 'Thematic Lighting'
];

const steps = [
    { name: 'Concept', icon: Crown },
    { name: 'Scale', icon: Users },
    { name: 'Elements', icon: ListChecks },
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


const EventStudioPage: React.FC = () => {
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

    const handleElementsChange = (item: string) => {
        setFormData(prev => {
            const newElements = prev.eventElements.includes(item)
                ? prev.eventElements.filter(i => i !== item)
                : [...prev.eventElements, item];
            return { ...prev, eventElements: newElements };
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
        } finally {
            setIsExtractingColors(false);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
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

            const newColors = currentColors ? `${currentColors}, ${color}` : color;
            return { ...prev, brandColors: newColors };
        });
    };

    const validateStep = (step: number): boolean => {
        switch(step) {
            case 0:
                if (formData.eventType === '') {
                    setError("Please select an event type.");
                    return false;
                }
                if (formData.theme.trim() === '') {
                    setError("Please provide a theme for your event.");
                    return false;
                }
                return true;
            case 1:
                if (formData.venueType === '') {
                    setError("Please select a venue type.");
                    return false;
                }
                if (formData.guestCount <= 0) {
                    setError("Please enter a valid number of guests.");
                    return false;
                }
                return true;
            case 2:
                if (formData.eventElements.length === 0) {
                    setError("Please select at least one key element for your event.");
                    return false;
                }
                return true;
            case 3:
                if (!formData.logo) {
                    setError("Please upload your company logo.");
                    return false;
                }
                if (formData.brandColors.trim() === '') {
                    setError("Please provide your brand colors.");
                    return false;
                }
                return true;
            case 4:
                if (!formData.userName.trim() || !formData.userEmail.trim() || !formData.userMobile.trim()) {
                    setError("Please fill in all your contact details.");
                    return false;
                }
                if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
                    setError("Please enter a valid email address.");
                    return false;
                }
                return true;
            default:
                return true;
        }
    }
    
    const nextStep = () => {
        setError(null);
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
            setError("Logo is missing. Please go back and upload it.");
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const logoBase64 = await blobToBase64(formData.logo);

            const logoPart = {
                inlineData: { data: logoBase64, mimeType: formData.logo.type },
            };
            
            const textPrompt = `
Objective: Create a photorealistic 3D concept render for an immersive and luxurious corporate event for a major brand in Dubai. The aesthetic should be high-end and highly "Instagrammable".

**Event Brief:**
- Event Type: ${formData.eventType}
- Core Theme: "${formData.theme}" (This is the central creative driver).
- Venue Style: The event is set in a ${formData.venueType}.
- Scale: The space should be designed to comfortably host approximately ${formData.guestCount} guests.

**Key Design Elements (Must be visible):**
- The setup MUST include distinct areas for: ${formData.eventElements.join(', ')}.

**Branding & Atmosphere:**
- **Primary Colors:** The event's color palette MUST be dominated by: ${formData.brandColors}.
- **Logo Integration:** The provided company logo is the hero brand element. It MUST be integrated prominently and elegantly into a key feature like the main stage backdrop, a dedicated photo wall, or the welcome desk.
- **Lighting & Materials:** Emphasize dramatic, creative lighting and premium materials (e.g., marble, metallics, lush fabrics) to create a luxurious atmosphere.
- **Cohesion:** All elements must cohesively reflect the core theme.

Generate a single, captivating wide shot that showcases the overall ambiance and key design features of the event space.
`;
            
            const imagePromises = Array(4).fill(0).map((_, i) => 
                ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [logoPart, { text: `${textPrompt}\\n\\nVariation ${i + 1} of 4.` }] },
                    config: {
                        responseModalities: ['IMAGE'],
                    },
                })
            );

            const responses = await Promise.all(imagePromises);
            const imageUrls = responses.map(res => res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData)
                                        .filter(Boolean)
                                        .map(data => `data:${data.mimeType};base64,${data.data}`);

            if (imageUrls.length < 4) {
                console.warn(`Could only generate ${imageUrls.length} out of 4 images.`);
                if (imageUrls.length === 0) throw new Error("AI failed to generate any images.");
            }
            
            setGeneratedImages(imageUrls);
            setIsFinished(true);
            
        } catch (e) {
            console.error("Design generation failed:", e);
            setError('An error occurred while generating the design. Please try again.');
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

        const proposalData = { ...formData, logo: formData.logo?.name, logoPreview: undefined, selectedConceptImage: generatedImages[selectedImage] };
        console.log("--- EVENT PROPOSAL REQUEST (SIMULATED) ---", JSON.stringify(proposalData, null, 2));
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSending(false);
        setIsProposalRequested(true);
    };

    const renderStepContent = () => {
        switch(currentStep) {
            case 0: // Concept
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Step 1: The Concept</h3>
                        <p className="text-gray-400 mb-6">What is the vision for your event?</p>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Event Type</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {eventTypes.map(e => (
                                        <div key={e.name} onClick={() => setFormData(prev => ({...prev, eventType: e.name}))} className={`relative rounded-lg overflow-hidden cursor-pointer border-4 ${formData.eventType === e.name ? 'border-fann-gold' : 'border-transparent'}`}>
                                            <img src={e.image} alt={e.name} className="h-32 w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-2">
                                                <h4 className="text-white font-bold text-center text-md">{e.name}</h4>
                                            </div>
                                            {formData.eventType === e.name && <CheckCircle className="absolute top-2 right-2 text-fann-gold bg-fann-charcoal rounded-full" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="theme" className="block text-sm font-medium text-gray-400 mb-1">Event Theme</label>
                                <input id="theme" type="text" name="theme" value={formData.theme} onChange={handleInputChange} placeholder="e.g., 'Futuristic Neon City', 'Enchanted Forest Gala'" className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" required />
                            </div>
                        </div>
                    </div>
                );
            case 1: // Scale
                return (
                    <div>
                        <h3 className="text-2xl font-semibold mb-2">Step 2: Scale & Venue</h3>
                        <p className="text-gray-400 mb-6">Define the setting and size of your event.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Venue Type</label>
                                <select name="venueType" value={formData.venueType} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-gray-700 rounded px-3 py-2" required>
                                    <option value="" disabled>Select a venue type</option>
                                    <option>Hotel Ballroom</option><option>Industrial Warehouse</option><option>Outdoor Garden/Terrace</option><option>Modern Conference Hall</option><option>Luxury Villa</option><option>Art Gallery</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-400 mb-1">Number of Guests</label>
                                <input id="guestCount" type="number" name="guestCount" value={formData.guestCount} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" required min="1" step="10" />
                            </div>
                        </div>
                    </div>
                );
            case 2: // Elements
                return (
                     <div>
                        <h3 className="text-2xl font-semibold mb-2">Step 3: Key Elements</h3>
                        <p className="text-gray-400 mb-6">Select the features your event must include.</p>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {eventElementsOptions.map(opt => (
                                <label key={opt} className={`flex items-center p-3 text-sm rounded-lg cursor-pointer ${formData.eventElements.includes(opt) ? 'bg-fann-teal text-white' : 'bg-fann-charcoal border border-gray-700'}`}>
                                    <input type="checkbox" checked={formData.eventElements.includes(opt)} onChange={() => handleElementsChange(opt)} className="hidden" />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            case 3: // Branding
                return (
                    <div>
                         <h3 className="text-2xl font-semibold mb-2">Step 4: Branding</h3>
                         <p className="text-gray-400 mb-6">Provide your brand assets to guide the design.</p>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Upload Your Logo</label>
                                <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer">
                                    <div className="space-y-1 text-center">
                                        {formData.logoPreview ? <img src={formData.logoPreview} alt="Logo" className="mx-auto h-24 w-auto" /> : <><Upload className="mx-auto h-12 w-12 text-gray-500" /><p>Click to upload</p></>}
                                    </div>
                                </div>
                                <input ref={fileInputRef} type="file" className="sr-only" onChange={handleLogoChange} accept="image/*"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Brand Colors</label>
                                <input type="text" name="brandColors" value={formData.brandColors} onChange={handleInputChange} placeholder="e.g., Navy Blue, Gold, White" className="w-full bg-fann-charcoal border border-gray-700 rounded px-4 py-2" required />
                                {isExtractingColors && <div className="flex items-center gap-2 mt-2 text-sm text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /><span>Extracting colors...</span></div>}
                                {!isExtractingColors && suggestedColors.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-400 mb-2">Suggestions (click to add):</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedColors.map(color => (<button type="button" key={color} onClick={() => addSuggestedColor(color)} className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full hover:bg-fann-teal">{color}</button>))}
                                        </div>
                                    </div>
                                )}
                            </div>
                         </div>
                    </div>
                );
            case 4: // User Details
                return (
                     <div>
                         <h3 className="text-2xl font-semibold mb-2">Step 5: Almost There!</h3>
                         <p className="text-gray-400 mb-6">Enter your details to generate your design concept.</p>
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
    
    if (isLoading) return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
            <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />
            <h2 className="text-3xl font-serif text-white mt-6">Imagining Your Event...</h2>
            <p className="text-gray-400 mt-2 max-w-sm">Our AI is designing the decor, arranging the layout, and setting the mood. This may take a few moments.</p>
        </div>
    );
    
    if (isFinished && isProposalRequested) return (
        <AnimatedPage>
            <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
                <CheckCircle className="w-20 h-20 text-fann-teal mb-6" />
                <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Thank You!</h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">Our team has received your concept selection and will prepare a detailed proposal, which will be sent to <strong>{formData.userEmail}</strong> shortly.</p>
                {selectedImage !== null && <img src={generatedImages[selectedImage]} alt="Selected" className="rounded-lg shadow-2xl w-full max-w-lg mt-8" />}
            </div>
        </AnimatedPage>
    );

    if (isFinished) return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Sparkles className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Select Your Favorite Concept</h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">Click your preferred design. Our team will then prepare a detailed proposal and quotation for you.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {generatedImages.map((img, index) => (
                                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => setSelectedImage(index)} className={`rounded-lg overflow-hidden cursor-pointer border-4 ${selectedImage === index ? 'border-fann-gold' : 'border-transparent'}`}>
                                    <img src={img} alt={`AI Concept ${index + 1}`} className="w-full h-auto object-cover" />
                                </motion.div>
                            ))}
                        </div>
                        <div className="lg:col-span-1 bg-black/20 p-6 rounded-lg self-start sticky top-24">
                            <h3 className="text-2xl font-serif text-fann-gold mb-4">Event Summary</h3>
                            <div className="space-y-3 text-sm">
                                <p><strong>Type:</strong> {formData.eventType}</p>
                                <p><strong>Theme:</strong> {formData.theme}</p>
                                <p><strong>Venue:</strong> {formData.venueType}</p>
                                <p><strong>Guests:</strong> ~{formData.guestCount}</p>
                                <button onClick={sendProposalRequest} disabled={selectedImage === null || isSending} className="w-full bg-fann-teal text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 disabled:bg-gray-600 mt-4">
                                    {isSending ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : "Request Detailed Proposal"}
                                </button>
                                {selectedImage === null && <p className="text-xs text-center text-gray-400 mt-2">Please select a design.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white flex items-center justify-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Event Concept Studio</h1>
                        <p className="text-xl text-gray-300">Follow the steps to create a bespoke event concept.</p>
                    </div>
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {steps.map((step, index) => (
                                <div key={step.name} className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= index ? 'bg-fann-gold text-fann-charcoal' : 'bg-gray-700 text-gray-400'}`}><step.icon size={16} /></div>
                                    <span className={`text-xs mt-1 ${currentStep >= index ? 'text-white' : 'text-gray-500'}`}>{step.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-700 rounded-full h-1.5"><motion.div className="bg-fann-gold h-1.5 rounded-full" animate={{ width: `${(currentStep / (steps.length -1)) * 100}%` }}/></div>
                    </div>
                    <div className="bg-black/20 p-8 rounded-lg">
                        <form onSubmit={handleSubmit}>
                            <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                                {renderStepContent()}
                            </motion.div>
                            <div className="mt-8">
                                {error && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-3 mb-4"><AlertCircle className="w-5 h-5" /><span>{error}</span></motion.div>}
                                <div className="flex justify-between items-center">
                                    <button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-fann-gold disabled:text-gray-500">
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    {currentStep < steps.length - 1 ? (
                                        <button type="button" onClick={nextStep} className="bg-fann-gold text-fann-charcoal font-bold py-2 px-6 rounded-full">Next</button>
                                    ) : (
                                        <button type="submit" className="bg-fann-teal text-white font-bold py-2 px-6 rounded-full flex items-center gap-2">
                                            <Sparkles size={16} /> Generate My Concept
                                        </button>
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

export default EventStudioPage;