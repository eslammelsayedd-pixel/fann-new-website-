import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, Video, Download, Upload, RefreshCw, Image as ImageIcon, Clapperboard } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useApiKey } from '../context/ApiKeyProvider';

type StudioMode = 'video' | 'image';

// --- Video Generator Component ---
const videoStyles = [
    "A high-energy, fast-cut promotional video for a major tech conference like GITEX.",
    "An elegant and luxurious video showcasing a new high-end product launch.",
    "A corporate and professional video for a global leadership summit.",
    "A dynamic and exciting video for a brand activation at a music festival.",
    "A cinematic and dramatic reveal trailer for a new luxury car.",
    "A clean and minimalist video focusing on architectural design for a real estate project.",
];

const VideoGenerator = () => {
    const [selectedStyle, setSelectedStyle] = useState<string>(videoStyles[0]);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const { ensureApiKey, handleApiError, error, clearError } = useApiKey();
    
    const handleGenerateVideo = async () => {
        clearError();
        if (!await ensureApiKey()) return;
        
        setIsLoading(true);
        setVideoUrl(null);
        setStatusMessage("Initiating video generation... This can take several minutes.");

        try {
            const fullPrompt = `${selectedStyle} ${prompt}`;
            
            const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: fullPrompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to generate video (status: ${response.status}).`);
            }
            
            setStatusMessage("Video generated. Preparing for playback...");
            const videoBlob = await response.blob();
            const objectUrl = URL.createObjectURL(videoBlob);
            setVideoUrl(objectUrl);

        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
            setStatusMessage('');
        }
    };

    if (isLoading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8">
                <Loader2 className="w-16 h-16 text-fann-gold animate-spin mx-auto" />
                <h2 className="text-3xl font-serif text-white mt-6">Generating Video...</h2>
                <p className="text-fann-light-gray mt-2">{statusMessage}</p>
            </motion.div>
        );
    }
    
    if (videoUrl) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <video controls autoPlay loop src={videoUrl} className="w-full rounded-lg shadow-2xl" />
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <a href={videoUrl} download="fann-ai-video-concept.mp4" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2">
                        <Download size={20} /> Download Video
                    </a>
                    <button onClick={() => { setVideoUrl(null); setPrompt(''); clearError(); }} className="border-2 border-fann-gold text-fann-gold font-bold py-3 px-8 rounded-full">
                        Generate Another
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="style-select" className="block text-sm font-medium text-fann-light-gray mb-2">Base Style</label>
                    <select id="style-select" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fann-gold">
                        {videoStyles.map((style, index) => ( <option key={index} value={style}>{style.split(' for ')[0]}</option>))}
                    </select>
                </div>
                <div>
                    <label htmlFor="prompt-input" className="block text-sm font-medium text-fann-light-gray mb-2">Describe Your Vision (Optional)</label>
                    <textarea id="prompt-input" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., featuring a futuristic city skyline, with neon holograms of our logo." className="w-full bg-fann-charcoal border border-fann-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fann-gold"/>
                </div>
            </div>
            {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 my-4">
                    <div className="flex-shrink-0 pt-0.5"><AlertCircle className="w-5 h-5" /></div>
                    <div className="flex-grow"><span className="whitespace-pre-wrap">{error}</span></div>
                </motion.div>
            )}
            <div className="mt-8">
                <motion.button onClick={handleGenerateVideo} className="w-full bg-fann-teal text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Sparkles size={20} /> Generate Video
                </motion.button>
                <p className="text-xs text-fann-light-gray text-center mt-3">Video generation can take several minutes. Please be patient.</p>
            </div>
        </motion.div>
    );
};

// --- Image Editor Component ---
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

const ImageEditor = () => {
    const [originalImage, setOriginalImage] = useState<{file: File, url: string} | null>(null);
    const [prompt, setPrompt] = useState('');
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { ensureApiKey, handleApiError, error, clearError } = useApiKey();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (file: File) => {
        clearError();
        if (file && file.type.startsWith('image/')) {
            setOriginalImage({ file, url: URL.createObjectURL(file) });
            setEditedImage(null);
        } else {
            handleApiError({ message: 'Please upload a valid image file.' });
        }
    };

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            handleImageUpload(event.dataTransfer.files[0]);
        }
    }, []);

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            handleImageUpload(event.target.files[0]);
        }
    };
    
    const handleGenerate = async () => {
        if (!originalImage || !prompt.trim()) {
            handleApiError({ message: 'Please upload an image and provide an editing prompt.' });
            return;
        }
        clearError();
        if (!await ensureApiKey()) return;
        
        setIsLoading(true);
        setEditedImage(null);

        try {
            const { base64, mimeType } = await blobToBase64(originalImage.file);

            const response = await fetch('/api/edit-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64, mimeType, prompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to edit image.');
            }

            const data = await response.json();
            setEditedImage(data.imageUrl);

        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetStudio = () => {
        setOriginalImage(null);
        setEditedImage(null);
        setPrompt('');
        clearError();
    };
    
    if (!originalImage) {
        return (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                <input type="file" ref={fileInputRef} onChange={onFileInputChange} accept="image/*" className="hidden" />
                <div 
                    onDrop={onDrop} 
                    onDragOver={onDragOver} 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-fann-border rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-fann-gold transition-colors"
                >
                    <Upload className="w-12 h-12 text-fann-light-gray mb-4" />
                    <p className="font-bold text-lg">Drop your image here or click to browse</p>
                    <p className="text-fann-light-gray">PNG, JPG, WEBP supported</p>
                </div>
            </motion.div>
        );
    }
    
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-3">Original</h3>
                    <img src={originalImage.url} alt="Original user-uploaded image ready for editing." className="rounded-lg w-full h-auto object-contain max-h-96" />
                </div>
                <div className="text-center relative">
                    <h3 className="text-xl font-bold mb-3">Edited</h3>
                    <div className="w-full aspect-square bg-fann-charcoal rounded-lg flex items-center justify-center">
                        {isLoading && <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />}
                        {!isLoading && !editedImage && <ImageIcon className="w-16 h-16 text-fann-border" />}
                        {editedImage && <img src={editedImage} alt={`AI-edited image based on the prompt: "${prompt}"`} className="rounded-lg w-full h-full object-contain" />}
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="image-prompt-input" className="block text-sm font-medium text-fann-light-gray mb-2">Editing Prompt</label>
                <input id="image-prompt-input" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Add a retro cinematic filter" className="w-full bg-fann-charcoal border border-fann-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fann-gold"/>
            </div>
            {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                    <div className="flex-shrink-0 pt-0.5"><AlertCircle className="w-5 h-5" /></div>
                    <div><span className="whitespace-pre-wrap">{error}</span></div>
                </motion.div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                 <motion.button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto bg-fann-teal text-white font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2 disabled:opacity-50" whileHover={{ scale: !isLoading ? 1.05 : 1 }} whileTap={{ scale: !isLoading ? 0.95 : 1 }}>
                    {isLoading ? <><Loader2 className="w-5 h-5 animate-spin"/> Working...</> : <><Sparkles size={20} /> Generate</>}
                </motion.button>
                {editedImage && (
                    <a href={editedImage} download="fann-ai-edited-image.png" className="w-full sm:w-auto text-center bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2">
                        <Download size={20} /> Download
                    </a>
                )}
                 <motion.button onClick={resetStudio} className="w-full sm:w-auto border-2 border-fann-gold text-fann-gold font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <RefreshCw size={20} /> Start Over
                </motion.button>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const MediaStudioPage: React.FC = () => {
    const [mode, setMode] = useState<StudioMode>('video');

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <Clapperboard className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">FANN Media Studio</h1>
                        <p className="text-xl text-fann-cream max-w-3xl mx-auto">
                            Your all-in-one suite for AI-powered video generation and image editing.
                        </p>
                    </div>

                    <div className="flex justify-center mb-8">
                        <div className="bg-fann-charcoal p-1 rounded-full flex items-center space-x-2">
                             <button onClick={() => setMode('video')} className={`px-6 py-2 text-sm font-bold rounded-full transition-colors ${mode === 'video' ? 'bg-fann-teal text-white' : 'text-fann-light-gray hover:bg-white/5'}`}>
                                Generate Video
                            </button>
                             <button onClick={() => setMode('image')} className={`px-6 py-2 text-sm font-bold rounded-full transition-colors ${mode === 'image' ? 'bg-fann-teal text-white' : 'text-fann-light-gray hover:bg-white/5'}`}>
                                Edit Image
                            </button>
                        </div>
                    </div>

                    <div className="bg-fann-charcoal-light p-8 rounded-lg">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {mode === 'video' ? <VideoGenerator /> : <ImageEditor />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default MediaStudioPage;