import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, Video, Download } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useApiKey } from '../context/ApiKeyProvider';

const videoStyles = [
    "A high-energy, fast-cut promotional video for a major tech conference like GITEX.",
    "An elegant and luxurious video showcasing a new high-end product launch.",
    "A corporate and professional video for a global leadership summit.",
    "A dynamic and exciting video for a brand activation at a music festival.",
    "A cinematic and dramatic reveal trailer for a new luxury car.",
    "A clean and minimalist video focusing on architectural design for a real estate project.",
];

const VideoStudioPage: React.FC = () => {
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

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                    <div className="text-center mb-12">
                        <Video className="mx-auto h-16 w-16 text-fann-gold" />
                        <h1 className="text-5xl font-serif font-bold text-white mt-4 mb-4">FANN Video Concept Studio</h1>
                        <p className="text-xl text-gray-400">
                            Generate short promotional video concepts for your event or brand.
                        </p>
                    </div>

                    {!isLoading && !videoUrl && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-fann-charcoal-light border border-white/10 p-8 rounded-lg"
                        >
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="style-select" className="block text-sm font-medium text-gray-300 mb-2">
                                        Base Style
                                    </label>
                                    <select
                                        id="style-select"
                                        value={selectedStyle}
                                        onChange={(e) => setSelectedStyle(e.target.value)}
                                        className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fann-gold"
                                    >
                                        {videoStyles.map((style, index) => (
                                            <option key={index} value={style} className="bg-black">{style.split(' for ')[0]}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-2">
                                        Describe Your Vision (Optional)
                                    </label>
                                    <textarea
                                        id="prompt-input"
                                        rows={3}
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g., featuring a futuristic city skyline, with neon holograms of our logo."
                                        className="w-full bg-black/50 border border-white/20 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-fann-gold"
                                    />
                                </div>
                            </div>
                             {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3 my-4"
                                >
                                     <div className="flex-shrink-0 pt-0.5"><AlertCircle className="w-5 h-5" /></div>
                                     <div className="flex-grow">
                                        <span className="whitespace-pre-wrap">{error}</span>
                                     </div>
                                </motion.div>
                            )}
                            <div className="mt-8">
                                <motion.button
                                    onClick={handleGenerateVideo}
                                    className="w-full btn-gold flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Sparkles size={20} /> Generate Video
                                </motion.button>
                                <p className="text-xs text-gray-500 text-center mt-3">Video generation can take several minutes. Please be patient.</p>
                            </div>
                        </motion.div>
                    )}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center p-8"
                        >
                            <Loader2 className="w-16 h-16 text-fann-gold animate-spin mx-auto" />
                            <h2 className="text-3xl font-serif text-white mt-6">Generating Video...</h2>
                            <p className="text-gray-400 mt-2">{statusMessage}</p>
                        </motion.div>
                    )}

                    {videoUrl && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <video controls autoPlay loop src={videoUrl} className="w-full rounded-lg shadow-2xl border border-white/10" />
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                                <a href={videoUrl} download="fann-video-concept.mp4" className="btn-gold flex items-center justify-center gap-2">
                                    <Download size={20} /> Download Video
                                </a>
                                <button onClick={() => { setVideoUrl(null); setPrompt(''); clearError(); }} className="btn-outline rounded-full">
                                    Generate Another
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default VideoStudioPage;