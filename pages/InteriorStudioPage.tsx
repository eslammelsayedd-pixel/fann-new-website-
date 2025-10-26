import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, ArrowLeft, Home, Palette, ListChecks, User, CheckCircle, AlertCircle, MapPin, Square, PenLine, FileImage, FileText, Wallet, CalendarDays } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyProvider';
import { useSearchParams } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';

// --- Helper Functions & Types ---
interface MoodboardFile {
    file: File;
    preview: string;
}

interface FormData {
    spaceType: 'Residential' | 'Commercial' | '';
    spaceSubType: string;
    location: string;
    area: number;
    designObjective: string;
    style: string;
    moodboards: MoodboardFile[];
    colorPreferences: string;
    budget: string;
    timeline: string;
    functionalZones: string[];
    customFeatures: string;
    floorPlan: File | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

type Angle = 'perspective' | 'topDown' | 'detail';

interface GeneratedConcept {
    title: string;
    description: string;
    images: Record<Angle, string>;
}


const initialFormData: FormData = {
    spaceType: '',
    spaceSubType: '',
    location: '',
    area: 150,
    designObjective: '',
    style: '',
    moodboards: [],
    colorPreferences: '',
    budget: '',
    timeline: '',
    functionalZones: [],
    customFeatures: '',
    floorPlan: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
};

const styles = [
    { name: 'Modern Luxury', image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Minimalist Zen', image: 'https://images.pexels.com/photos/2128043/pexels-photo-2128043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Contemporary Arabic', image: 'https://images.pexels.com/photos/8089255/pexels-photo-8089255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Scandinavian Comfort', image: 'https://images.pexels.com/photos/4203100/pexels-photo-4203100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Industrial Loft', image: 'https://images.pexels.com/photos/3753644/pexels-photo-3753644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Biophilic & Natural', image: 'https://images.pexels.com/photos/2280927/pexels-photo-2280927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

const residentialZones = ['Living Area', 'Dining Area', 'Kitchen', 'Master Bedroom', 'Guest Bedroom', 'Home Office', 'Master Bathroom', 'Walk-in Closet', 'Prayer Room', 'Kids\' Play Area', 'Home Cinema', 'Private Gym', 'Majlis'];
const commercialZones = ['Reception', 'Open-plan Workspace', 'Executive Offices', 'Meeting Rooms', 'Boardroom', 'Breakout Area', 'Pantry / Kitchenette', 'Collaboration Zones', 'Lounge Area', 'Showroom Space'];

const budgetRanges = ['$25,000 - $50,000', '$50,000 - $100,000', '$100,000 - $250,000', '$250,000 - $500,000', '$500,000+'];
const timelines = ['Under 3 Months', '3-6 Months', '6-9 Months', '9-12 Months', '12+ Months'];

const steps = [
    { name: 'Space', icon: Home },
    { name: 'Style', icon: Palette },
    { name: 'Function', icon: ListChecks },
    { name: 'Details', icon: FileText },
    { name: 'Generate', icon: User },
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

const CustomFileInput: React.FC<{label: string; onFileSelect: (file: File | null) => void; acceptedTypes: string; selectedFileName: string | null;}> = ({label, onFileSelect, acceptedTypes, selectedFileName}) => {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <div>
            <label className="block text-sm font-medium text-fann-light-gray mb-2">{label}</label>
            <div onClick={() => ref.current?.click()} className="w-full bg-fann-charcoal border border-fann-border rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors px-4 py-3 text-center">
                <div className="text-fann-light-gray text-sm flex items-center gap-2">
                    <Upload size={16}/>
                    <span>{selectedFileName || 'Click to upload'}</span>
                </div>
            </div>
            <input type="file" ref={ref} onChange={(e) => onFileSelect(e.target.files ? e.target.files[0] : null)} className="hidden" accept={acceptedTypes}/>
        </div>
    );
};

const InteriorStudioPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentStep, setCurrentStep] = useState(() => parseInt(searchParams.get('step') || '0', 10));
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedConcepts, setGeneratedConcepts] = useState<GeneratedConcept[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isProposalSent, setIsProposalSent] = useState(false);
    const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [activeAngles, setActiveAngles] = useState<Record<number, Angle>>({});
    const { ensureApiKey, handleApiError, error: apiKeyError, clearError } = useApiKey();
    const [localError, setLocalError] = useState<string | null>(null);
    const error = apiKeyError || localError;
    const moodboardRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSearchParams({ step: currentStep.toString() });
    }, [currentStep, setSearchParams]);

    const setError = (message: string | null) => {
        clearError();
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
        const newMoodboards: MoodboardFile[] = Array.from(files).map(file => ({ file, preview: URL.createObjectURL(file) }));
        setFormData(p => ({...p, moodboards: [...p.moodboards, ...newMoodboards].slice(0, 5)}));
    };

    const handleZoneChange = (zone: string) => {
        setFormData(p => ({
            ...p,
            functionalZones: p.functionalZones.includes(zone) ? p.functionalZones.filter(z => z !== zone) : [...p.functionalZones, zone]
        }));
    };

    const validateStep = (step: number): boolean => {
        clearError();
        setLocalError(null);
        switch(step) {
            case 0:
                if (!formData.spaceType) { setError("Please select your space type (Residential or Commercial)."); return false; }
                if (!formData.spaceSubType) { setError("Please select a specific space type."); return false; }
                if (!formData.location) { setError("Please provide the location."); return false; }
                if (!formData.designObjective) { setError("Please state your primary goal for this space."); return false; }
                break;
            case 1:
                if (!formData.style) { setError("Please select a preferred style."); return false; }
                if (formData.moodboards.length === 0) { setError("Please upload at least one inspiration image."); return false; }
                break;
            case 2:
                if (formData.functionalZones.length === 0) { setError("Please select at least one required zone."); return false; }
                break;
            case 3:
                if (!formData.budget) { setError("Please specify a budget range."); return false; }
                if (!formData.timeline) { setError("Please select a desired completion date."); return false; }
                if (!formData.floorPlan) { setError("A floor plan is required to generate accurate concepts."); return false; }
                break;
            case 4:
                if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) { setError("Please fill in all contact details."); return false; }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError("Please enter a valid email address."); return false; }
                break;
        }
        return true;
    };
    
    const nextStep = () => validateStep(currentStep) && setCurrentStep(p => p + 1);
    const prevStep = () => setCurrentStep(p => p - 1);

    const generateConcepts = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;
        
        clearError();
        if (!await ensureApiKey()) return;

        setIsLoading(true);
        setGeneratedConcepts([]);

        try {
            const floorPlanData = formData.floorPlan ? await blobToBase64(formData.floorPlan) : null;
            const moodboardsData = await Promise.all(formData.moodboards.map(mb => blobToBase64(mb.file)));

            const promptDataInterior = {
              spaceType: `${formData.spaceType} ${formData.spaceSubType}`,
              location: formData.location, area: formData.area, designObjective: formData.designObjective,
              style: formData.style, colorPreferences: formData.colorPreferences,
              functionalZones: formData.functionalZones, customFeatures: formData.customFeatures,
              budget: formData.budget, timeline: formData.timeline,
              floorPlanData, moodboardsData
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
            if (!data.concepts || data.concepts.length === 0) throw new Error("The model failed to generate any concepts.");
            
            setGeneratedConcepts(data.concepts);
            setIsFinished(true);

        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSendProposal = async () => {
        if (selectedConcept === null) return;
        setIsSending(true);
        clearError();
        setLocalError(null);
    
        try {
            const response = await fetch('/api/send-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studioType: 'Interior Design',
                    formData: { ...formData, userEmail: formData.email }, // Pass email for reply_to
                    selectedConcept: generatedConcepts[selectedConcept]
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
    
            setIsProposalSent(true);
        } catch (e: any) {
            setError(`Failed to send email. Error: ${e.message}`);
        } finally {
            setIsSending(false);
        }
    };

    const renderLiveBrief = () => (
        <div className="w-full lg:w-2/5 lg:pl-8">
            <div className="sticky top-32 bg-fann-charcoal-light p-6 rounded-lg border border-fann-border">
                <h3 className="text-xl font-serif font-bold text-fann-gold mb-4 border-b border-fann-border pb-3">Your Design Brief</h3>
                <AnimatePresence>
                <div className="space-y-4 text-sm">
                    {(formData.spaceType || currentStep > 0) && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-2">
                             <h4 className="font-bold text-white flex items-center gap-2"><Home size={16}/> Space</h4>
                            {formData.spaceSubType && <p className="text-fann-cream pl-4">A {formData.area}sqm {formData.spaceSubType} in {formData.location}.</p>}
                            {formData.designObjective && <p className="text-fann-cream pl-4"><strong>Goal:</strong> {formData.designObjective}.</p>}
                        </motion.div>
                    )}
                     {(formData.style || currentStep > 1) && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-2 pt-3 border-t border-fann-border">
                             <h4 className="font-bold text-white flex items-center gap-2"><Palette size={16}/> Style</h4>
                            {formData.style && <p className="text-fann-cream pl-4"><strong>Aesthetic:</strong> {formData.style}.</p>}
                            {formData.moodboards.length > 0 && <div className="pl-4 flex flex-wrap gap-2">{formData.moodboards.map((mb, i) => <img key={i} src={mb.preview} alt={`Moodboard thumbnail ${i + 1}`} className="w-12 h-12 object-cover rounded-md"/>)}</div>}
                        </motion.div>
                    )}
                     {(formData.functionalZones.length > 0 || currentStep > 2) && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-2 pt-3 border-t border-fann-border">
                             <h4 className="font-bold text-white flex items-center gap-2"><ListChecks size={16}/> Function</h4>
                            {formData.functionalZones.length > 0 && <div className="pl-4 flex flex-wrap gap-2">{formData.functionalZones.map(z => <span key={z} className="bg-fann-charcoal text-fann-light-gray text-xs px-2 py-1 rounded-full">{z}</span>)}</div>}
                        </motion.div>
                    )}
                     {(formData.budget || currentStep > 3) && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-2 pt-3 border-t border-fann-border">
                             <h4 className="font-bold text-white flex items-center gap-2"><FileText size={16}/> Details</h4>
                            {formData.budget && <p className="text-fann-cream pl-4"><strong>Budget:</strong> {formData.budget}.</p>}
                            {formData.timeline && <p className="text-fann-cream pl-4"><strong>Timeline:</strong> {formData.timeline}.</p>}
                        </motion.div>
                    )}
                </div>
                </AnimatePresence>
            </div>
        </div>
    );

    const renderStepContent = () => {
        const spaceSubTypes = formData.spaceType === 'Residential' ? ['Villa', 'Apartment', 'Townhouse'] : ['Office', 'Retail', 'Restaurant', 'Clinic'];
        const functionalZones = formData.spaceType === 'Residential' ? residentialZones : commercialZones;
        switch (currentStep) {
            case 0: // Space
                return <>
                    <h2 className="text-3xl font-serif text-white mb-6">Let's Define Your Space</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-2">Space Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => setFormData(p => ({...p, spaceType: 'Residential', spaceSubType: '', functionalZones: []}))} className={`p-4 rounded-lg border-2 text-center transition-colors ${formData.spaceType === 'Residential' ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border hover:border-fann-gold/50'}`}>Residential</button>
                                <button type="button" onClick={() => setFormData(p => ({...p, spaceType: 'Commercial', spaceSubType: '', functionalZones: []}))} className={`p-4 rounded-lg border-2 text-center transition-colors ${formData.spaceType === 'Commercial' ? 'border-fann-gold bg-fann-gold/10' : 'border-fann-border hover:border-fann-gold/50'}`}>Commercial</button>
                            </div>
                        </div>
                        {formData.spaceType && 
                        <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} className="space-y-6 overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-4">
                                <select name="spaceSubType" value={formData.spaceSubType} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"><option value="" disabled>Select {formData.spaceType} Type...</option>{spaceSubTypes.map(t => <option key={t} value={t}>{t}</option>)}</select>
                                <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Location (e.g., Downtown Dubai)" className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">Approximate Area (sqm): {formData.area}</label>
                                <input type="range" name="area" min="20" max="2000" step="10" value={formData.area} onChange={handleInputChange} className="w-full h-2 bg-fann-charcoal-light rounded-lg appearance-none cursor-pointer accent-fann-gold" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-fann-light-gray mb-2">What is the primary goal for this space?</label>
                                <input type="text" name="designObjective" value={formData.designObjective} onChange={handleInputChange} placeholder="e.g., A luxurious and comfortable family home" className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                            </div>
                        </motion.div>
                        }
                    </div>
                </>;
            case 1: // Style
                return <>
                    <h2 className="text-3xl font-serif text-white mb-6">What's Your Preferred Style?</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-3">Select a base style to guide our designers.</label>
                            <div className="grid grid-cols-3 gap-3">{styles.map(s => <div key={s.name} onClick={() => setFormData(p => ({...p, style: s.name}))} className={`relative h-28 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${formData.style === s.name ? 'border-fann-gold shadow-lg' : 'border-transparent'}`}><img src={s.image} alt={`An example of the ${s.name} interior design style.`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/><div className="absolute inset-0 bg-black/50"></div><p className="absolute bottom-2 left-2 text-sm font-bold">{s.name}</p>{formData.style === s.name && <div className="absolute top-2 right-2 bg-fann-gold rounded-full p-1"><CheckCircle size={14} className="text-fann-charcoal"/></div>}</div>)}</div>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-fann-light-gray mb-2">Upload inspiration images (moodboard)</label>
                            <div onClick={() => moodboardRef.current?.click()} className="p-4 bg-fann-charcoal border-2 border-dashed border-fann-border rounded-lg flex items-center justify-center cursor-pointer hover:border-fann-gold transition-colors"><FileImage className="mr-2" size={16}/> Click to upload up to 5 images</div>
                            <input type="file" ref={moodboardRef} onChange={(e) => handleMoodboardChange(e.target.files)} multiple className="hidden" accept="image/*"/>
                            {formData.moodboards.length > 0 && <div className="flex flex-wrap gap-2 mt-3">{formData.moodboards.map((mb, i) => <img key={i} src={mb.preview} alt={`Uploaded moodboard image ${i + 1}`} className="w-20 h-20 object-cover rounded-md"/>)}</div>}
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-fann-light-gray mb-2">Describe your color preferences</label>
                             <input type="text" name="colorPreferences" value={formData.colorPreferences} onChange={handleInputChange} placeholder="e.g., Earthy tones, monochromatic, warm pastels" className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        </div>
                    </div>
                </>;
            case 2: // Function
                 return <>
                    <h2 className="text-3xl font-serif text-white mb-6">How Will You Use the Space?</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-fann-light-gray mb-3">Select all required functional zones.</label>
                            <div className="max-h-80 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-3 pr-2">{functionalZones.map(zone => <button type="button" key={zone} onClick={() => handleZoneChange(zone)} className={`p-3 rounded-lg border text-left text-sm transition-colors flex items-center gap-2 ${formData.functionalZones.includes(zone) ? 'border-fann-teal bg-fann-teal/10' : 'border-fann-border hover:border-fann-teal/50'}`}><div className={`w-4 h-4 rounded-sm flex-shrink-0 border flex items-center justify-center ${formData.functionalZones.includes(zone) ? 'bg-fann-teal border-fann-teal' : 'border-fann-light-gray'}`}>{formData.functionalZones.includes(zone) && <CheckCircle size={12} className="text-white"/>}</div><span>{zone}</span></button>)}</div>
                        </div>
                         <textarea name="customFeatures" value={formData.customFeatures} onChange={handleInputChange} placeholder="List any other custom features (e.g., specific smart home tech, unique joinery)." rows={3} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                    </div>
                 </>;
            case 3: // Details
                return <>
                    <h2 className="text-3xl font-serif text-white mb-6">Project Details</h2>
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"><option value="" disabled>Select Budget Range (USD)...</option>{budgetRanges.map(r => <option key={r} value={r}>{r}</option>)}</select>
                            <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2"><option value="" disabled>Select Desired Timeline...</option>{timelines.map(t => <option key={t} value={t}>{t}</option>)}</select>
                        </div>
                        <CustomFileInput label="Upload Floor Plan (PDF, JPG, PNG)" onFileSelect={(f) => handleFileChange('floorPlan', f)} acceptedTypes=".pdf,.jpeg,.jpg,.png" selectedFileName={formData.floorPlan?.name || null}/>
                    </div>
                </>;
            case 4: // Generate
                return <>
                     <h2 className="text-3xl font-serif text-white mb-6 text-center">Final Step: Your Details</h2>
                     <div className="max-w-md mx-auto space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                             <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                             <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                         </div>
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" />
                     </div>
                </>
        }
        return null;
    }
    
    // --- Main Render Logic ---
    if (isLoading) return <div className="min-h-screen flex flex-col justify-center items-center text-center p-4"><Loader2 className="w-16 h-16 text-fann-gold animate-spin" /><h2 className="text-3xl font-serif text-white mt-6">Crafting Your Designs...</h2><p className="text-fann-light-gray mt-2 max-w-sm">Our AI is interpreting your brief and generating bespoke concepts. This may take up to a minute.</p></div>;
    
    if (isFinished) return <AnimatedPage><div className="min-h-screen pt-32 pb-20 text-white"><div className="container mx-auto px-4 sm:px-6 lg:px-8">{isProposalSent ? <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4"><CheckCircle className="w-20 h-20 text-fann-teal mb-6" /><h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">Thank You, {formData.firstName}!</h1><p className="text-xl text-fann-cream max-w-2xl mx-auto">Your request has been received. Our design team will contact you at <strong>{formData.email}</strong> shortly.</p></div> : <> <div className="text-center mb-12"><Sparkles className="mx-auto h-16 w-16 text-fann-gold" /><h1 className="text-4xl font-serif font-bold text-fann-gold mt-4 mb-4">Your Bespoke Concepts</h1><p className="text-lg text-fann-cream max-w-3xl mx-auto">We've prepared these concepts based on your brief. Select your preferred direction to proceed.</p></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-8">{generatedConcepts.map((concept, index) => (<motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }} onClick={() => setSelectedConcept(index)} className={`p-4 bg-fann-charcoal-light rounded-lg cursor-pointer border-2 transition-all duration-300 hover:border-fann-gold/50 ${selectedConcept === index ? 'border-fann-gold' : 'border-fann-border'}`}><div className="relative aspect-video mb-4 rounded-md overflow-hidden bg-fann-charcoal"><AnimatePresence mode="wait"><motion.img key={`${index}-${activeAngles[index] || 'perspective'}`} src={concept.images[activeAngles[index] || 'perspective']} alt={`${concept.title} - ${activeAngles[index] || 'perspective'} view`} className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} /></AnimatePresence></div><div className="flex justify-center gap-2 mb-4">{(['perspective', 'topDown', 'detail'] as Angle[]).map(angle => (<button key={angle} onClick={(e) => { e.stopPropagation(); setActiveAngles(p => ({...p, [index]: angle}))}} className={`px-3 py-1 text-xs rounded-full transition-colors ${(activeAngles[index] || 'perspective') === angle ? 'bg-fann-teal text-white' : 'bg-fann-charcoal hover:bg-white/10'}`}>{angle === 'topDown' ? 'Floor Plan' : angle.charAt(0).toUpperCase() + angle.slice(1)}</button>))}</div><h3 className="text-xl font-serif font-bold text-white">{concept.title}</h3><p className="text-sm text-fann-light-gray mt-1">{concept.description}</p></motion.div>))}</div>{selectedConcept !== null && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 bg-fann-charcoal-light p-8 rounded-lg sticky bottom-6 border-2 border-fann-gold shadow-2xl max-w-4xl mx-auto"><div className="flex flex-col md:flex-row items-center justify-between gap-6"><div><h3 className="text-2xl font-serif font-bold text-fann-gold">You've Selected: "{generatedConcepts[selectedConcept].title}"</h3><p className="text-fann-cream mt-1">Ready to bring this vision to life? Let's start the conversation.</p></div><motion.button onClick={handleSendProposal} disabled={isSending} className="bg-fann-teal text-white font-bold py-3 px-8 rounded-full flex-shrink-0 flex items-center gap-2" whileHover={{ scale: !isSending ? 1.05 : 1 }} whileTap={{ scale: !isSending ? 0.95 : 1 }}>{isSending ? <><Loader2 className="w-5 h-5 animate-spin"/> Sending...</> : 'Request Consultation'}</motion.button></div>{error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}</motion.div>)}</>}</div></div></AnimatedPage>;
    
    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Interior Design Studio</h1>
                        <p className="text-xl text-fann-cream max-w-3xl mx-auto">
                           As your Dubai-based design partner, we'll guide you through a detailed brief to capture your vision perfectly.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-3/5">
                            <div className="mb-8">
                                <div className="flex justify-between mb-2">{steps.map((step, index) => <div key={step.name} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}><div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${currentStep >= index ? 'bg-fann-gold border-fann-gold text-fann-charcoal' : 'bg-fann-charcoal-light border-fann-border text-fann-light-gray'}`}><step.icon size={20} /></div><span className={`text-xs mt-2 text-center font-semibold ${currentStep >= index ? 'text-white' : 'text-fann-light-gray'}`}>{step.name}</span></div>)}</div>
                                <div className="bg-fann-charcoal-light rounded-full h-1 mt-2"><motion.div className="bg-fann-gold h-1 rounded-full" initial={{ width: 0 }} animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} transition={{ type: 'spring', stiffness: 50 }}/></div>
                            </div>

                            <div className="bg-fann-charcoal-light p-6 sm:p-8 rounded-lg min-h-[500px]">
                                <form onSubmit={generateConcepts} noValidate>
                                    <AnimatePresence mode="wait"><motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>{renderStepContent()}</motion.div></AnimatePresence>
                                    <div className="mt-8 pt-6 border-t border-fann-border">
                                        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 mb-4"><AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /><span className="whitespace-pre-wrap">{error}</span></motion.div>}
                                        <div className="flex justify-between items-center">
                                            <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-fann-gold disabled:text-fann-light-gray disabled:cursor-not-allowed font-semibold" whileHover={{scale: currentStep !== 0 ? 1.05 : 1}}><ArrowLeft size={16} /> Back</motion.button>
                                            {currentStep < steps.length - 1 ? <motion.button type="button" onClick={nextStep} className="bg-fann-gold text-fann-charcoal font-bold py-2 px-8 rounded-full" whileHover={{scale: 1.05}}>Next</motion.button> : <motion.button type="submit" className="bg-fann-teal text-white font-bold py-3 px-8 rounded-full flex items-center gap-2" whileHover={{scale: 1.05}}><Sparkles size={16} /> Generate My Concepts</motion.button>}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {renderLiveBrief()}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default InteriorStudioPage;