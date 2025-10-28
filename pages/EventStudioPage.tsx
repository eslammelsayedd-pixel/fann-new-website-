import React, { useState, useRef, useEffect } from 'react';
// FIX: Import `AnimatePresence` from `framer-motion` to resolve 'Cannot find name' errors.
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, ArrowLeft, Users, Palette, ListChecks, Crown, User, CheckCircle, AlertCircle, RefreshCw, Camera, BarChart2, BookOpen } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyProvider';
import { useSearchParams, Link } from 'react-router-dom';
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
    brandColors: string[];
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
    brandColors: [],
    userName: '',
    userEmail: '',
    userMobile: '',
};

const eventTypes = [
    { name: 'Gala Dinner', image: 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Product Launch', image: 'https://images.pexels.com/photos/14297491/pexels-photo-14297491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Conference', image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Awards Ceremony', image: 'https://images.pexels.com/photos/13354563/pexels-photo-13354563.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Brand Activation', image: 'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Corporate Summit', image: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
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
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [currentStep, setCurrentStep] = useState(() => {
        const stepParam = searchParams.get('step');
        const initialStep = stepParam ? parseInt(stepParam, 10) : 0;
        return Math.max(0, Math.min(initialStep, steps.length - 1));
    });

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isExtractingColors, setIsExtractingColors] = useState(false);
    const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isProposalRequested, setIsProposalRequested] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [generationStatus, setGenerationStatus] = useState<string | null>(null);
    const [generationCount, setGenerationCount] = useState(0);
    
    const { ensureApiKey, handleApiError, error: apiKeyError, clearError: clearApiKeyError } = useApiKey();
    const [localError, setLocalError] = useState<string | null>(null);

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
                setFormData(prev => ({ ...prev, brandColors: extracted }));
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
                if (formData.eventType === '') errorMessage = "Please select an event type.";
                else if (formData.theme.trim() === '') errorMessage = "Please provide a theme for your event.";
                break;
            case 1:
                if (formData.venueType === '') errorMessage = "Please select a venue type.";
                else if (formData.guestCount <= 0) errorMessage = "Please enter a valid number of guests.";
                break;
            case 2:
                if (formData.eventElements.length === 0) errorMessage = "Please select at least one key element for your event.";
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
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
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
        setIsFinished(false);

        if (!formData.logo) {
            setError("Logo is missing. Please go back and upload it.");
            setIsLoading(false);
            return;
        }

        try {
            const logoBase64 = await blobToBase64(formData.logo);
            
            const textPrompt = `Generate 4 photorealistic concept images for a corporate event.
- **Event Type:** ${formData.eventType}
- **Theme:** ${formData.theme}
- **Venue Type:** A luxurious ${formData.venueType} in Dubai.
- **Guest Count:** Approximately ${formData.guestCount} people.
- **Key Elements to feature:** ${formData.eventElements.join(', ')}.
- **Branding:** The event is for a company whose logo is attached. The brand colors are **${formData.brandColors.join(', ')}**. The logo should be integrated tastefully into the design on backdrops, podiums, or screens.
- **Atmosphere:** The images should look high-end, professionally produced, and create a 'wow' factor. Use dramatic lighting and realistic textures. The setting should feel grand and impressive. Do not include people.`;
            
            const response = await fetch('/api/generate-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logo: logoBase64,
                    mimeType: formData.logo.type,
                    prompt: textPrompt,
                    formData: formData,
                })
            });

            if (!response.ok) {
                 if (response.status === 429) {
                     const err = await response.json();
                     throw new Error(err.error);
                }
                const err = await response.json();
                throw new Error(err.error || 'Failed to generate images.');
            }

            const data = await response.json();
            
            if (!data.imageUrls || data.imageUrls.length === 0) {
                 throw new Error("The model failed to generate any images.");
            }
            
            setGeneratedImages(data.imageUrls);
            setGenerationCount(data.newCount || 0);
            
            if (data.newCount === 1) {
                setGenerationStatus("Design set 1 of 2 generated. You can generate one more set.");
            } else if (data.newCount >= 2) {
                setGenerationStatus("Design set 2 of 2 generated. You’ve used all free attempts. Contact our agent for more options.");
            }
            
            setIsFinished(true);
            
        } catch (e: any) {
            handleApiError(e);
            setError(e.message);
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
        clearAllErrors();
    
        try {
            const { logo, logoPreview, ...restOfFormData } = formData;
            const response = await fetch('/api/send-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studioType: 'Event',
                    formData: { ...restOfFormData, userEmail: formData.userEmail, theme: formData.theme },
                    selectedConcept: {
                        title: `Event Concept Moodboard`,
                        description: `A visual concept for the ${formData.eventType} with the theme: "${formData.theme}".`
                    }
                })
            });
            
            if (!response.ok) {
                let errorText = `Server responded with status ${response.status}`;
                const responseText = await response.text(); // Read body ONCE
                try {
                    const errorData = JSON.parse(responseText);
                    errorText = errorData.error || responseText;
                } catch (e) {
                    errorText = responseText;
                }
                throw new Error(errorText);
            }
    
            setIsProposalRequested(true);
    
        } catch (e: any) {
            setError(`Failed to send email. Please try again or contact us directly. Error: ${e.message}`);
        } finally {
            setIsSending(false);
        }
    };

    const handleSelectImage = (image: string) => {
        setSelectedImage(image);
    }

    useEffect(() => {
        if(selectedImage && !isProposalRequested) {
            sendProposalRequest();
        }
    }, [selectedImage]);

    const error = apiKeyError || localError;
    const isNextButtonDisabled = currentStep === 3 && isExtractingColors;

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Concept
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-fann-charcoal dark:text-white mb-4">Step 1: The Concept</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-fann-light-gray mb-2">Event Type</label>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {eventTypes.map(type => (
                                    <div key={type.name} onClick={() => setFormData(p => ({...p, eventType: type.name}))} className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 ${formData.eventType === type.name ? 'border-fann-gold' : 'border-transparent'}`}>
                                        <img src={type.image} alt={`An example of a ${type.name} event setup.`} className="w-full h-full object-cover"/>
                                        <div className="absolute inset-0 bg-black/50"></div>
                                        <p className="absolute bottom-2 left-2 text-xs font-bold text-white">{type.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                             <label htmlFor="theme" className="block text-sm font-medium text-gray-600 dark:text-fann-light-gray mb-2">Event Theme or Core Message</label>
                            <input id="theme" name="theme" type="text" value={formData.theme} onChange={handleInputChange} className="w-full bg-fann-cream dark:bg-fann-charcoal border border-gray-300 dark:border-fann-border rounded-md px-3 py-2" placeholder="e.g., 'Future Horizons', 'A Night of Stars', 'Innovate & Elevate'" />
                        </div>
                    </div>
                );
            case 1: // Scale
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-fann-charcoal dark:text-white mb-4">Step 2: The Scale</h2>
                        <div>
                            <label htmlFor="venueType" className="block text-sm font-medium text-gray-600 dark:text-fann-light-gray mb-2">Venue Type</label>
                            <select id="venueType" name="venueType" value={formData.venueType} onChange={handleInputChange} className="w-full bg-fann-cream dark:bg-fann-charcoal border border-gray-300 dark:border-fann-border rounded-md px-3 py-2">
                                <option value="" disabled>Select a venue type...</option>
                                <option>Hotel Ballroom</option>
                                <option>Conference Center Hall</option>
                                <option>Outdoor Space (e.g., Burj Park)</option>
                                <option>Unique Venue (e.g., Museum, Warehouse)</option>
                                <option>Luxury Rooftop</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="guestCount" className="block text-sm font-medium text-gray-600 dark:text-fann-light-gray mb-2">Expected Number of Guests: {formData.guestCount}</label>
                            <input id="guestCount" name="guestCount" type="range" min="50" max="2000" step="50" value={formData.guestCount} onChange={handleInputChange} className="w-full h-2 bg-gray-200 dark:bg-fann-charcoal-light rounded-lg appearance-none cursor-pointer accent-fann-gold" />
                        </div>
                    </div>
                );
            case 2: // Elements
                return (
                     <div className="space-y-6">
                        <h2 className="text-2xl font-serif text-fann-charcoal dark:text-white mb-4">Step 3: Key Elements</h2>
                        <p className="text-gray-600 dark:text-fann-light-gray text-sm">Select all the features you require for your event.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {eventElementsOptions.map(item => (
                                <button type="button" key={item} onClick={() => handleElementsChange(item)} className={`p-3 rounded-lg border-2 text-left text-sm transition-colors flex items-center gap-2 ${formData.eventElements.includes(item) ? 'border-fann-teal bg-fann-teal/10' : 'border-gray-300 dark:border-fann-border hover:border-fann-teal/50'}`}>
                                    <div className={`w-4 h-4 rounded-sm flex-shrink-0 border-2 ${formData.eventElements.includes(item) ? 'bg-fann-teal border-fann-teal' : 'border-gray-500 dark:border-fann-light-gray'}`}/>
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
                        <h2 className="text-2xl font-serif text-fann-charcoal dark:text-white mb-4">Step 4: Branding</h2>
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 dark:text-fann-light-gray mb-2">Upload Your Logo (Vector Preferred)</label>
                                <div onClick={() => fileInputRef.current?.click()} className="h-48 w-full bg-fann-cream dark:bg-fann-charcoal border-2 border-dashed border-gray-300 dark:border-fann-border rounded-lg flex items-center justify-center cursor-pointer hover:border-fann-gold transition-colors">
                                    {formData.logoPreview ? <img src={formData.logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain p-4" /> : <div className="text-center text-gray-500 dark:text-fann-light-gray"><Upload className="mx-auto w-8 h-8 mb-2" /><p>Click to upload</p></div>}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif, .svg" />
                            </div>
                            <div>
                                <label htmlFor="brandColors" className="block text-sm font-medium text-gray-600 dark:text-fann-light-gray mb-2">Primary Brand Colors</label>
                                <input 
                                    type="text" 
                                    id="brandColors" 
                                    name="brandColors" 
                                    value={formData.brandColors.join(', ')} 
                                    onChange={(e) => setFormData(p => ({...p, brandColors: e.target.value.split(',').map(c => c.trim()).filter(c => c)}))}
                                    className="w-full bg-fann-cream dark:bg-fann-charcoal border border-gray-300 dark:border-fann-border rounded-md px-3 py-2" 
                                    placeholder="e.g., #0A192F, Fann Gold, White" 
                                />
                                <div className="mt-2 min-h-[4rem]">
                                    {isExtractingColors ? <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-fann-light-gray"><Loader2 className="w-4 h-4 animate-spin"/>Analyzing...</div> : suggestedColors.length > 0 && suggestedColors[0] !== 'ERROR' ? (
                                        <div>
                                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 mb-2 text-sm">
                                                <CheckCircle className="w-4 h-4"/>Suggestions are ready. Click to select/deselect.
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {suggestedColors.map(color => {
                                                    const isSelected = formData.brandColors.includes(color);
                                                    return (
                                                        <button
                                                          type="button"
                                                          key={color}
                                                          onClick={() => handleColorToggle(color)}
                                                          className={`flex items-center text-xs gap-1.5 p-1.5 rounded-md transition-all border ${isSelected ? 'border-fann-gold bg-fann-gold/10' : 'border-gray-300 dark:border-fann-border bg-white dark:bg-fann-charcoal hover:border-fann-gold/50'}`}
                                                        >
                                                            <div className="w-5 h-5 rounded border border-black/20 dark:border-white/20" style={{ backgroundColor: color }}></div>
                                                            <span className="font-mono text-gray-500 dark:text-fann-light-gray">{color}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : suggestedColors[0] === 'ERROR' ? (
                                         <span className="flex items-center gap-1 text-red-500 dark:text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4"/>Could not extract colors. Please enter them manually.
                                        </span>
                                    ) : <p className="text-sm text-gray-600 dark:text-fann-light-gray">Upload a logo to see suggestions.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Your Details
                 return (
                    <div className="space-y-6 max-w-md mx-auto">
                        <h2 className="text-2xl font-serif text-fann-charcoal dark:text-white text-center">Step 5: Your Details</h2>
                        <p className="text-center text-gray-600 dark:text-fann-light-gray text-sm">We'll use this to send you the generated concepts and proposal.</p>
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-600 dark:text-fann-light-gray mb-1">Full Name</label>
                            <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleInputChange} className="w-full bg-fann-cream dark:bg-fann-charcoal border border-gray-300 dark:border-fann-border rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-600 dark:text-fann-light-gray mb-1">Email Address</label>
                            <input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleInputChange} className="w-full bg-fann-cream dark:bg-fann-charcoal border border-gray-300 dark:border-fann-border rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label htmlFor="userMobile" className="block text-sm font-medium text-gray-600 dark:text-fann-light-gray mb-1">Mobile Number</label>
                            <input type="tel" id="userMobile" name="userMobile" value={formData.userMobile} onChange={handleInputChange} className="w-full bg-fann-cream dark:bg-fann-charcoal border border-gray-300 dark:border-fann-border rounded-md px-3 py-2" />
                        </div>
                    </div>
                );
            default: return null;
        }
    };
    
    if (isLoading) return (
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
            <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />
            <h2 className="text-3xl font-serif text-fann-charcoal dark:text-white mt-6">Imagining Your Event...</h2>
            <p className="text-gray-600 dark:text-fann-light-gray mt-2 max-w-sm">Our design tools are arranging the layout and setting the mood. This may take a few moments.</p>
        </div>
    );
    
    if (isProposalRequested) return (
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
            <CheckCircle className="w-20 h-20 text-fann-teal mb-6" />
            <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Thank You!</h1>
            <p className="text-xl text-gray-700 dark:text-fann-cream max-w-2xl mx-auto mb-8">Our team has received your concept selection and will prepare a detailed proposal, which will be sent to <strong>{formData.userEmail}</strong> shortly.</p>
             <div className="space-y-4">
                <p className="font-semibold text-white">While you wait, why not explore more?</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/portfolio" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2"><Camera size={18}/> View Portfolio</Link>
                    <Link to="/roi-calculator" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2"><BarChart2 size={18}/> Calculate Your ROI</Link>
                    <Link to="/insights" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2"><BookOpen size={18}/> Read Our Insights</Link>
                </div>
            </div>
        </div>
    );

    if (isFinished) return (
        <AnimatedPage>
            <div className="pt-32 pb-20 bg-fann-cream dark:bg-fann-charcoal text-fann-charcoal dark:text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Sparkles className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-4xl font-serif font-bold text-fann-gold mt-4 mb-4">Select Your Favorite Concept</h1>
                        <p className="text-lg text-gray-700 dark:text-fann-cream max-w-3xl mx-auto">Click your preferred design. Our team will then prepare a detailed proposal and quotation for you.</p>
                        {generationStatus && <p className="text-lg font-semibold text-fann-teal mt-4 bg-fann-teal/10 px-4 py-2 rounded-md inline-block">{generationStatus}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {generatedImages.map((img, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => handleSelectImage(img)} className="rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:border-fann-gold/50 border-gray-200 dark:border-fann-border">
                                <img src={img} alt={`Generated concept number ${index + 1} for an event.`} className="w-full h-auto object-cover" />
                                <button className="w-full mt-2 bg-fann-teal text-white font-bold py-2 rounded-b-lg">Select & Request Proposal</button>
                            </motion.div>
                        ))}
                    </div>
                    {generationCount < 2 && !isLoading && (
                        <div className="mt-8 text-center">
                            <button 
                                onClick={generateDesign} 
                                className="border-2 border-fann-gold text-fann-gold font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-fann-gold/10 transition-colors mx-auto"
                            >
                                <RefreshCw size={18}/>
                                Generate More
                            </button>
                        </div>
                    )}
                     {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center mt-4 bg-red-900/50 p-3 rounded-lg max-w-2xl mx-auto">
                            {error}
                        </motion.div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-cream dark:bg-fann-charcoal pt-32 pb-20 text-fann-charcoal dark:text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                {steps.map((step, index) => (
                                    <div key={step.name} onClick={() => setCurrentStep(index)} className="flex flex-col items-center cursor-pointer" style={{ width: `${100 / steps.length}%` }}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${currentStep >= index ? 'bg-fann-gold border-fann-gold text-fann-charcoal' : 'bg-gray-200 dark:bg-fann-charcoal-light border-gray-300 dark:border-fann-border text-gray-500 dark:text-fann-light-gray'}`}>
                                            <step.icon size={20} />
                                        </div>
                                        <span className={`text-xs mt-2 text-center font-semibold ${currentStep >= index ? 'text-fann-charcoal dark:text-white' : 'text-gray-500 dark:text-fann-light-gray'}`}>{step.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-200 dark:bg-fann-charcoal-light rounded-full h-1 mt-2">
                                <motion.div className="bg-fann-gold h-1 rounded-full" initial={{ width: 0 }} animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} transition={{ type: 'spring', stiffness: 50 }}/>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-fann-charcoal-light p-6 sm:p-8 rounded-lg min-h-[500px]">
                             <form onSubmit={handleSubmit} noValidate>
                                <AnimatePresence mode="wait">
                                    <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                                        {renderStepContent()}
                                    </motion.div>
                                </AnimatePresence>
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-fann-border">
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 mb-4">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                            <span className="whitespace-pre-wrap">{error}</span>
                                            {error.includes("limit") && (
                                                <a href={`https://wa.me/971505667502?text=${encodeURIComponent("Hello FANN, I've reached my design limit on the FANN Studio and would like to discuss my project further.")}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold px-4 py-2 rounded-md ml-auto">
                                                    Chat on WhatsApp
                                                </a>
                                            )}
                                        </motion.div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-fann-gold disabled:text-gray-400 dark:disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: currentStep !== 0 ? 1.05 : 1}} whileTap={{scale: currentStep !== 0 ? 0.95 : 1}}>
                                            <ArrowLeft size={16} /> Back
                                        </motion.button>
                                        
                                        {currentStep < steps.length - 1 ? (
                                            <motion.button type="button" onClick={nextStep} disabled={isNextButtonDisabled} className="bg-fann-gold text-fann-charcoal font-bold py-2 px-6 rounded-full w-32 disabled:bg-gray-200 dark:disabled:bg-fann-charcoal-light disabled:text-gray-500 dark:disabled:text-fann-light-gray disabled:cursor-not-allowed" whileHover={{scale: !isNextButtonDisabled ? 1.05 : 1}} whileTap={{scale: !isNextButtonDisabled ? 0.95 : 1}}>
                                                {isNextButtonDisabled ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Next'}
                                            </motion.button>
                                        ) : (
                                            <motion.button type="submit" className="bg-fann-teal text-white font-bold py-3 px-8 rounded-full flex items-center gap-2" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                                <Sparkles size={16} /> Generate My Concepts
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default EventStudioPage;
