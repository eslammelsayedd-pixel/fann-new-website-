import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, ArrowLeft, Home, Building, Palette, ListChecks, User, CheckCircle, AlertCircle, FileText, Calendar, Wallet, FileImage, ClipboardList, PenTool } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyProvider';
import { useSearchParams } from 'react-router-dom';
import { countryCodes } from './ExhibitionStudioPage'; // Re-use country codes
import AnimatedPage from '../components/AnimatedPage';

// --- Helper Functions & Types ---
interface MoodboardFile {
    file: File;
    preview: string;
}

interface FormData {
    spaceType: string;
    location: string;
    area: number;
    designObjective: string;
    style: string;
    moodboards: MoodboardFile[];
    colorPreferences: string;
    brandGuidelines: File | null;
    budget: string;
    timeline: string;
    functionalZones: string[];
    customFeatures: string;
    floorPlan: File | null;
    restrictions: string;
    brandKeywords: string;
    specialRequests: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
}

type Angle = 'perspective' | 'topDown' | 'detail';

interface GeneratedConcept {
    title: string;
    description: string;
    images: Record<Angle, string>;
}


const initialFormData: FormData = {
    spaceType: '',
    location: '',
    area: 100,
    designObjective: '',
    style: '',
    moodboards: [],
    colorPreferences: '',
    brandGuidelines: null,
    budget: '',
    timeline: '',
    functionalZones: [],
    customFeatures: '',
    floorPlan: null,
    restrictions: '',
    brandKeywords: '',
    specialRequests: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneCountryCode: '+971',
    phoneNumber: '',
};

const styles = [
    { name: 'Modern', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41fa2047?w=800&q=80' },
    { name: 'Minimalist', image: 'https://images.unsplash.com/photo-1505691938895-1758d7FEB511?w=800&q=80' },
    { name: 'Arabic', image: 'https://images.unsplash.com/photo-1613553474176-1891b3769903?w=800&q=80' },
    { name: 'Contemporary', image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80' },
    { name: 'Scandinavian', image: 'https://images.unsplash.com/photo-151211831-63047271a396?w=800&q=80' },
    { name: 'Industrial', image: 'https://images.unsplash.com/photo-1567699337558-b072a44a1442?w=800&q=80' },
];

const functionalZonesOptions = [
    'Living Area', 'Dining Area', 'Kitchen', 'Master Bedroom', 'Guest Bedroom', 'Kids\' Bedroom', 'Home Office/Workspace', 'Master Bathroom', 'Guest Bathroom', 'Walk-in Closet', 'Reception', 'Prayer/Meditation Room', 'Storage', 'Kids\' Play Area', 'Maid’s Room', 'Laundry', 'Pantry', 'Balcony/Terrace', 'Outdoor Areas', 'Home Cinema', 'Smart Home System', 'Private Gym', 'Hospitality Suite'
];

const steps = [
    { name: 'Space', icon: Home },
    { name: 'Style', icon: Palette },
    { name: 'Function', icon: ListChecks },
    { name: 'Plan', icon: ClipboardList },
    { name: 'Review', icon: User },
];

const blobToBase64 = (blob: Blob): Promise<{base64: string, mimeType: string}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                const [header, data] = reader.result.split(',');
                const mimeType = header.match(/:(.*?);/)?.[1] || blob.type;
                resolve({ base64: data, mimeType });
            } else {
                reject(new Error('Failed to convert blob to base64 string'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const FileInput: React.FC<{label: string; onFileSelect: (file: File | null) => void; acceptedTypes: string; selectedFile: File | null;}> = ({label, onFileSelect, acceptedTypes, selectedFile}) => {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <div>
            <label className="block text-sm font-medium text-fann-light-gray mb-2">{label}</label>
            <div onClick={() => ref.current?.click()} className="w-full bg-fann-charcoal border-2 border-dashed border-fann-border rounded-lg flex items-center justify-center cursor-pointer hover:border-fann-gold transition-colors px-4 py-3">
                <div className="text-center text-fann-light-gray text-sm flex items-center gap-2">
                    <Upload size={16}/>
                    <span>{selectedFile ? selectedFile.name : 'Click or drop file to upload'}</span>
                </div>
            </div>
            <input type="file" ref={ref} onChange={(e) => onFileSelect(e.target.files ? e.target.files[0] : null)} className="hidden" accept={acceptedTypes}/>
        </div>
    );
};

const InteriorStudioPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [currentStep, setCurrentStep] = useState(() => {
        const stepParam = searchParams.get('step');
        const initialStep = stepParam ? parseInt(stepParam, 10) : 0;
        return Math.max(0, Math.min(initialStep, steps.length - 1));
    });
    
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedConcepts, setGeneratedConcepts] = useState<GeneratedConcept[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isProposalSent, setIsProposalSent] = useState(false);
    const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
    const [activeAngles, setActiveAngles] = useState<Record<number, Angle>>({});

    const { ensureApiKey, handleApiError, error: apiKeyError, clearError: clearApiKeyError } = useApiKey();
    const [localError, setLocalError] = useState<string | null>(null);
    const error = apiKeyError || localError;

    // FIX: Moved moodboardRef to the top level of the component to avoid violating Rules of Hooks.
    const moodboardRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSearchParams({ step: currentStep.toString() });
    }, [currentStep, setSearchParams]);

    const setError = (message: string | null) => {
        clearApiKeyError();
        setLocalError(message);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
    };

    const handleFileChange = (name: keyof FormData, file: File | null) => {
        setFormData(p => ({...p, [name]: file}));
    };
    
    const handleMoodboardChange = (files: FileList | null) => {
        if (!files) return;
        const newMoodboards: MoodboardFile[] = Array.from(files).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setFormData(p => ({...p, moodboards: [...p.moodboards, ...newMoodboards].slice(0, 5)})); // Limit to 5
    };

    const handleZoneChange = (zone: string) => {
        setFormData(p => ({
            ...p,
            functionalZones: p.functionalZones.includes(zone)
                ? p.functionalZones.filter(z => z !== zone)
                : [...p.functionalZones, zone]
        }));
    };

    const validateStep = (step: number): boolean => {
        clearApiKeyError();
        setLocalError(null);
        switch(step) {
            case 0:
                if (!formData.spaceType) { setError("Please select your space type."); return false; }
                if (!formData.location) { setError("Please provide the location."); return false; }
                if (!formData.designObjective) { setError("Please state your design objective."); return false; }
                break;
            case 1:
                if (!formData.style) { setError("Please select a preferred style."); return false; }
                if (formData.moodboards.length === 0) { setError("Please upload at least one moodboard/inspiration image."); return false; }
                break;
            case 2:
                if (formData.functionalZones.length === 0) { setError("Please select at least one functional zone."); return false; }
                break;
            case 3:
                if (!formData.budget) { setError("Please specify a budget range."); return false; }
                if (!formData.timeline) { setError("Please select a desired completion date."); return false; }
                if (!formData.floorPlan) { setError("Please upload a floor plan."); return false; }
                break;
            case 4:
                if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
                    setError("Please fill in all contact details.");
                    return false;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                    setError("Please enter a valid email address.");
                    return false;
                }
                break;
        }
        return true;
    };
    
    const nextStep = () => validateStep(currentStep) && setCurrentStep(p => p + 1);
    const prevStep = () => setCurrentStep(p => p - 1);

    const generateConcepts = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;
        
        clearApiKeyError();
        if (!await ensureApiKey()) return;

        setIsLoading(true);
        setGeneratedConcepts([]);

        try {
            const floorPlanData = formData.floorPlan ? await blobToBase64(formData.floorPlan) : null;
            const brandGuidelinesData = formData.brandGuidelines ? await blobToBase64(formData.brandGuidelines) : null;
            const moodboardsData = await Promise.all(
                formData.moodboards.map(mb => blobToBase64(mb.file))
            );

            const promptDataInterior = {
                ...formData,
                floorPlanData,
                brandGuidelinesData,
                moodboardsData,
            };

            const response = await fetch('/api/generate-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ promptDataInterior })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to generate concepts.');
            }

            const data = await response.json();
            if (!data.concepts || data.concepts.length === 0) {
                 throw new Error("The model failed to generate any concepts.");
            }
            
            setGeneratedConcepts(data.concepts);
            setIsFinished(true);

        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSendProposal = () => {
        setIsProposalSent(true);
        // In a real app, this would trigger an email or backend process
    };

    if (isLoading) return (
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
            <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />
            <h2 className="text-3xl font-serif text-white mt-6">Crafting Your Designs...</h2>
            <p className="text-fann-light-gray mt-2 max-w-sm">Our Dubai-based design experts are interpreting your brief and generating bespoke concepts. This may take up to a minute.</p>
        </div>
    );
    
    if (isFinished) return (
        <div className="pb-20 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {isProposalSent ? (
                     <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
                        <CheckCircle className="w-20 h-20 text-fann-teal mb-6" />
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Thank You, {formData.firstName}!</h1>
                        <p className="text-xl text-fann-cream max-w-2xl mx-auto mb-8">Your request has been received. Our design team will be in touch at <strong>{formData.email}</strong> to discuss your project in detail.</p>
                        {selectedConcept !== null && <img src={generatedConcepts[selectedConcept].images.perspective} alt="Selected Concept" className="rounded-lg shadow-2xl w-full max-w-lg mt-8" />}
                    </div>
                ) : (
                <>
                <div className="text-center mb-12">
                    <Sparkles className="mx-auto h-16 w-16 text-fann-gold" />
                    <h1 className="text-4xl font-serif font-bold text-fann-gold mt-4 mb-4">Your Bespoke Concepts</h1>
                    <p className="text-lg text-fann-cream max-w-3xl mx-auto">As your Dubai-based design partner, we've prepared these initial concepts based on your brief. Select your preferred direction to proceed.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {generatedConcepts.map((concept, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            onClick={() => setSelectedConcept(index)}
                            className={`p-4 bg-fann-charcoal-light rounded-lg cursor-pointer border-2 transition-all duration-300 hover:border-fann-gold/50 ${selectedConcept === index ? 'border-fann-gold' : 'border-fann-border'}`}
                        >
                            <div className="relative aspect-video mb-4 rounded-md overflow-hidden bg-fann-charcoal">
                                 <AnimatePresence mode="wait">
                                     <motion.img 
                                        key={`${index}-${activeAngles[index] || 'perspective'}`}
                                        src={concept.images[activeAngles[index] || 'perspective']} 
                                        alt={`${concept.title} - ${activeAngles[index] || 'perspective'}`} 
                                        className="absolute inset-0 w-full h-full object-cover" 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                     />
                                </AnimatePresence>
                            </div>
                            <div className="flex justify-center gap-2 mb-4">
                                {(['perspective', 'topDown', 'detail'] as Angle[]).map(angle => (
                                    <button 
                                        key={angle}
                                        onClick={(e) => { e.stopPropagation(); setActiveAngles(p => ({...p, [index]: angle}))}}
                                        className={`px-3 py-1 text-xs rounded-full transition-colors ${(activeAngles[index] || 'perspective') === angle ? 'bg-fann-teal text-white' : 'bg-fann-charcoal hover:bg-white/10'}`}
                                    >
                                        {angle === 'topDown' ? 'Floor Plan' : angle.charAt(0).toUpperCase() + angle.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <h3 className="text-xl font-serif font-bold text-white">{concept.title}</h3>
                            <p className="text-sm text-fann-light-gray mt-1">{concept.description}</p>
                        </motion.div>
                    ))}
                </div>
                {selectedConcept !== null && (
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 bg-fann-charcoal-light p-8 rounded-lg sticky bottom-6 border-2 border-fann-gold shadow-2xl max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-fann-gold">You've Selected: "{generatedConcepts[selectedConcept].title}"</h3>
                                <p className="text-fann-cream mt-1">Ready to bring this vision to life? Let's start the conversation.</p>
                            </div>
                            <motion.button onClick={handleSendProposal} className="bg-fann-teal text-white font-bold py-3 px-8 rounded-full flex-shrink-0" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                Request Consultation
                            </motion.button>
                        </div>
                    </motion.div>
                )}
                </>
                )}
            </div>
        </div>
    );

    const renderStepContent = () => {
        const isCommercial = ['Office', 'Retail space'].includes(formData.spaceType);
        switch (currentStep) {
            case 0: // Space
                return <>
                    <h2 className="text-2xl font-serif text-white mb-6">Step 1: Define Your Space</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <select name="spaceType" value={formData.spaceType} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"><option value="" disabled>Select Space Type...</option><option>Home</option><option>Office</option><option>Villa</option><option>Apartment</option><option>Retail space</option><option>Other</option></select>
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Location (e.g., Downtown Dubai)" className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        <div><label className="block text-sm font-medium text-fann-light-gray mb-2">Area (sqm): {formData.area}</label><input type="range" name="area" min="20" max="2000" step="10" value={formData.area} onChange={handleInputChange} className="w-full h-2 bg-fann-charcoal-light rounded-lg appearance-none cursor-pointer accent-fann-gold" /></div>
                        <select name="designObjective" value={formData.designObjective} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"><option value="" disabled>Design Objective...</option><option>Luxury Family Home</option><option>Modern Corporate Office</option><option>Contemporary Bachelor Pad</option><option>Chic Retail Boutique</option><option>Cozy Family Apartment</option></select>
                    </div>
                </>;
            case 1: // Style
                return <>
                    <h2 className="text-2xl font-serif text-white mb-6">Step 2: Describe Your Style</h2>
                    <div>
                        <label className="block text-sm font-medium text-fann-light-gray mb-3">Preferred Style</label>
                        <div className="grid grid-cols-3 gap-3">{styles.map(s => <div key={s.name} onClick={() => setFormData(p => ({...p, style: s.name}))} className={`relative h-28 rounded-lg overflow-hidden cursor-pointer border-2 ${formData.style === s.name ? 'border-fann-gold' : 'border-transparent'}`}><img src={s.image} alt={s.name} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-black/50"></div><p className="absolute bottom-2 left-2 text-xs font-bold">{s.name}</p></div>)}</div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div>
                             <label className="block text-sm font-medium text-fann-light-gray mb-2">Moodboard / Inspiration Images (up to 5)</label>
                            <div onClick={() => moodboardRef.current?.click()} className="p-4 bg-fann-charcoal border-2 border-dashed border-fann-border rounded-lg flex items-center justify-center cursor-pointer hover:border-fann-gold transition-colors"><FileImage className="mr-2" size={16}/> Click to upload</div>
                            <input type="file" ref={moodboardRef} onChange={(e) => handleMoodboardChange(e.target.files)} multiple className="hidden" accept="image/*"/>
                            <div className="flex flex-wrap gap-2 mt-2">{formData.moodboards.map((mb, i) => <img key={i} src={mb.preview} className="w-16 h-16 object-cover rounded"/>)}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-2">Color Preferences / Brand Guidelines</label>
                             <input type="text" name="colorPreferences" value={formData.colorPreferences} onChange={handleInputChange} placeholder="e.g., Earthy tones, monochromatic, pastels" className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2 mb-2" />
                             {isCommercial && <FileInput label="Upload Brand Guidelines (PDF)" onFileSelect={(f) => handleFileChange('brandGuidelines', f)} acceptedTypes=".pdf" selectedFile={formData.brandGuidelines}/>}
                        </div>
                    </div>
                </>;
            case 2: // Function
                 return <>
                    <h2 className="text-2xl font-serif text-white mb-6">Step 3: Detail the Functionality</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-3">Functional Zones & Special Features (Multi-select)</label>
                            <div className="max-h-60 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-3 pr-2">{functionalZonesOptions.map(zone => <button type="button" key={zone} onClick={() => handleZoneChange(zone)} className={`p-3 rounded-lg border text-left text-sm transition-colors flex items-center gap-2 ${formData.functionalZones.includes(zone) ? 'border-fann-teal bg-fann-teal/10' : 'border-fann-border hover:border-fann-teal/50'}`}><div className={`w-4 h-4 rounded-sm flex-shrink-0 border flex items-center justify-center ${formData.functionalZones.includes(zone) ? 'bg-fann-teal border-fann-teal' : 'border-fann-light-gray'}`}>{formData.functionalZones.includes(zone) && <CheckCircle size={12} className="text-white"/>}</div><span>{zone}</span></button>)}</div>
                        </div>
                         <textarea name="customFeatures" value={formData.customFeatures} onChange={handleInputChange} placeholder="List any other custom features not mentioned above (e.g., specific smart home integrations, unique joinery)." rows={3} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                    </div>
                 </>;
            case 3: // Plan
                return <>
                    <h2 className="text-2xl font-serif text-white mb-6">Step 4: Provide Your Plans</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-2">Budget Range (USD)</label>
                            <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} placeholder="e.g., $50,000 - $75,000" className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-2">Desired Completion Date</label>
                            <input type="date" name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        </div>
                        <div className="md:col-span-2">
                             <FileInput label="Upload Floor Plans (PDF, JPEG, PNG, CAD)" onFileSelect={(f) => handleFileChange('floorPlan', f)} acceptedTypes=".pdf,.jpeg,.jpg,.png,.dwg" selectedFile={formData.floorPlan}/>
                        </div>
                        <div className="md:col-span-2">
                            <textarea name="restrictions" value={formData.restrictions} onChange={handleInputChange} placeholder="Notes on restrictions or existing items to be reused..." rows={3} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        </div>
                        {isCommercial && <div className="md:col-span-2">
                             <textarea name="brandKeywords" value={formData.brandKeywords} onChange={handleInputChange} placeholder="Keywords about corporate culture, values, must-have brand elements..." rows={3} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        </div>}
                        <div className="md:col-span-2">
                            <textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} placeholder="Special requests or non-negotiables (e.g., must be pet-friendly, eco-friendly materials only)." rows={3} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        </div>
                    </div>
                </>;
            case 4: // Review
                return <>
                     <h2 className="text-2xl font-serif text-white mb-6 text-center">Step 5: Review & Submit</h2>
                     <div className="grid md:grid-cols-2 gap-8 bg-fann-charcoal p-6 rounded-lg border border-fann-border">
                         <div>
                            <h3 className="text-lg font-bold text-fann-gold mb-3">Brief Summary</h3>
                             <div className="space-y-1 text-sm text-fann-cream">
                                <p><strong>Space:</strong> {formData.spaceType} in {formData.location}</p>
                                <p><strong>Style:</strong> {formData.style}</p>
                                <p><strong>Zones:</strong> {formData.functionalZones.length} selected</p>
                                <p><strong>Budget:</strong> {formData.budget}</p>
                             </div>
                         </div>
                         <div className="space-y-3">
                              <h3 className="text-lg font-bold text-fann-gold mb-3">Your Contact Details</h3>
                             <div className="grid grid-cols-2 gap-3">
                                 <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="w-full bg-fann-charcoal-light/50 border border-fann-border rounded-md px-3 py-2" />
                                 <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full bg-fann-charcoal-light/50 border border-fann-border rounded-md px-3 py-2" />
                             </div>
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full bg-fann-charcoal-light/50 border border-fann-border rounded-md px-3 py-2" />
                             <div className="flex gap-2">
                                 <select name="phoneCountryCode" value={formData.phoneCountryCode} onChange={handleInputChange} className="bg-fann-charcoal-light/50 border border-fann-border rounded-md px-2 py-2"><option value="+971">AE (+971)</option>{countryCodes.map(c => <option key={c.code} value={c.dial_code}>{c.code} ({c.dial_code})</option>)}</select>
                                 <input type="tel" name="phoneNumber" placeholder="Mobile Number" value={formData.phoneNumber} onChange={handleInputChange} className="w-full bg-fann-charcoal-light/50 border border-fann-border rounded-md px-3 py-2" />
                             </div>
                         </div>
                     </div>
                </>
        }
        return null;
    }
    
    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                        <PenTool className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Interior Design Studio</h1>
                        <p className="text-xl text-fann-cream max-w-3xl mx-auto">
                           As your Dubai-based design partner, we'll guide you through a detailed brief to ensure we capture your vision perfectly.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">{steps.map((step, index) => <div key={step.name} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}><div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentStep >= index ? 'bg-fann-gold text-fann-charcoal' : 'bg-fann-charcoal-light text-fann-light-gray'}`}><step.icon size={16} /></div><span className={`text-xs mt-1 text-center ${currentStep >= index ? 'text-white' : 'text-fann-light-gray'}`}>{step.name}</span></div>)}</div>
                            <div className="bg-fann-charcoal-light rounded-full h-1.5"><motion.div className="bg-fann-gold h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} transition={{ type: 'spring', stiffness: 50 }}/></div>
                        </div>

                        <div className="bg-fann-charcoal-light p-6 sm:p-8 rounded-lg">
                             <form onSubmit={generateConcepts} noValidate>
                                <AnimatePresence mode="wait"><motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>{renderStepContent()}</motion.div></AnimatePresence>
                                <div className="mt-8">
                                    {error && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 mb-4"><div className="flex-shrink-0 pt-0.5"><AlertCircle className="w-5 h-5" /></div><span className="whitespace-pre-wrap">{error}</span></motion.div>}
                                    <div className="flex justify-between items-center">
                                        <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-fann-gold disabled:text-fann-light-gray" whileHover={{scale: currentStep !== 0 ? 1.05 : 1}}><ArrowLeft size={16} /> Back</motion.button>
                                        {currentStep < steps.length - 1 ? <motion.button type="button" onClick={nextStep} className="bg-fann-gold text-fann-charcoal font-bold py-2 px-6 rounded-full" whileHover={{scale: 1.05}}>Next</motion.button> : <motion.button type="submit" className="bg-fann-teal text-white font-bold py-2 px-6 rounded-full flex items-center gap-2" whileHover={{scale: 1.05}}><Sparkles size={16} /> Generate My Concepts</motion.button>}
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

export default InteriorStudioPage;