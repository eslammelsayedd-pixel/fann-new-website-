import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, AlertCircle, Wand2, Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useApiKey } from '../context/ApiKeyProvider';

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

const ImageStudioPage: React.FC = () => {
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
    }

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="text-center mb-12">
                        <Wand2 className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-fann-gold mt-4 mb-4">AI Image Studio</h1>
                        <p className="text-xl text-fann-cream">Transform your images with simple text commands.</p>
                    </div>

                    <div className="bg-fann-charcoal-light p-8 rounded-lg">
                        {!originalImage ? (
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
                        ) : (
                            <div className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold mb-3">Original</h3>
                                        <img src={originalImage.url} alt="Original" className="rounded-lg w-full h-auto object-contain max-h-96" />
                                    </div>
                                    <div className="text-center relative">
                                        <h3 className="text-xl font-bold mb-3">Edited</h3>
                                        <div className="w-full aspect-square bg-fann-charcoal rounded-lg flex items-center justify-center">
                                            {isLoading && <Loader2 className="w-16 h-16 text-fann-gold animate-spin" />}
                                            {!isLoading && !editedImage && <ImageIcon className="w-16 h-16 text-fann-border" />}
                                            {editedImage && <img src={editedImage} alt="Edited" className="rounded-lg w-full h-full object-contain" />}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="prompt-input" className="block text-sm font-medium text-fann-light-gray mb-2">Editing Prompt</label>
                                    <input
                                        id="prompt-input"
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g., Add a retro cinematic filter"
                                        className="w-full bg-fann-charcoal border border-fann-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fann-gold"
                                    />
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
                        )}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ImageStudioPage;
