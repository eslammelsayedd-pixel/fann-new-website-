import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, BrainCircuit, Building2, Globe, Lightbulb, Loader2, Rocket, ServerCrash, Sparkles, Store, TrendingUp } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { useApiKey } from '../context/ApiKeyProvider';

interface InsightTopic {
    title: string;
    prompt: string;
    category: 'Exhibitions' | 'Events' | 'Interior Design';
    icon: React.ElementType;
    image: string;
}

interface Article {
    content: string;
    sources: Array<{ uri: string, title: string }>;
}

const insightTopics: InsightTopic[] = [
    {
        title: "Sustainable Exhibition Design in the GCC",
        prompt: "Write an insightful blog post about the latest trends in sustainable and eco-friendly exhibition stand design, with a specific focus on the UAE and Saudi Arabia for 2024. Cover innovative materials, modularity for events like GITEX and LEAP, and energy efficiency standards at venues like DWTC and Riyadh Front.",
        category: 'Exhibitions',
        icon: Building2,
        image: 'https://images.unsplash.com/photo-1624142411304-9a8f2764c330?w=800&q=80'
    },
    {
        title: "Audience Engagement Tech at Dubai Events",
        prompt: "As an expert event management agency, write a blog post detailing the most innovative audience engagement technologies being used at corporate events in Dubai. Discuss AR, VR, and AI-powered networking tools with examples from recent major UAE events. Focus on ROI for exhibitors.",
        category: 'Events',
        icon: BrainCircuit,
        image: 'https://images.unsplash.com/photo-1558522195-e12713517148?w=800&q=80'
    },
    {
        title: "Biophilic Design in Dubai & Riyadh Workspaces",
        prompt: "For an interior design firm's blog, write an article on the rise of Biophilic Design in modern workspaces and luxury commercial environments in Dubai and Riyadh. Explain the principles and highlight the benefits for employee well-being, citing examples from areas like DIFC and KAFD.",
        category: 'Interior Design',
        icon: Lightbulb,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80'
    },
    {
        title: "Maximizing ROI at DWTC & Riyadh Front",
        prompt: "Write a strategic guide for international exhibitors on maximizing their return on investment at premier Middle East venues: the Dubai World Trade Centre (DWTC) and the Riyadh Exhibition and Convention Center (Riyadh Front). Cover pre-show marketing, stand design strategies for high traffic, and lead capture tactics specific to these locations.",
        category: 'Exhibitions',
        icon: TrendingUp,
        image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80'
    },
    {
        title: "Luxury Retail Design: Dubai Mall vs. Via Riyadh",
        prompt: "Write a comparative analysis for a luxury design blog on the prevailing interior design trends for flagship retail stores in Dubai Mall versus the new luxury destination, Via Riyadh. Discuss customer experience, material palettes, and technology integration in these two distinct luxury hubs.",
        category: 'Interior Design',
        icon: Store,
        image: 'https://images.unsplash.com/photo-1558133552-32b7d420c436?w=800&q=80'
    },
    {
        title: "The Rise of 'Giga-Project' Launch Events in KSA",
        prompt: "Write an article for an event industry magazine about the emerging trend of large-scale, immersive launch events for Saudi Arabia's 'Giga-Projects' (e.g., NEOM, Red Sea Project). Discuss the scale, production complexity, and global impact of these brand experiences.",
        category: 'Events',
        icon: Rocket,
        image: 'https://images.unsplash.com/photo-1674278474510-5300539f1c9a?w=800&q=80'
    },
    {
        title: "Integrating Arabic Culture into Modern Design",
        prompt: "For a design and architecture blog, write a piece on how to tastefully integrate traditional Arabic and Islamic design motifs (like geometry, calligraphy, and mashrabiya patterns) into modern, minimalist exhibition stands and corporate interiors for the Gulf market. Provide examples of successful fusion.",
        category: 'Exhibitions',
        icon: Globe,
        image: 'https://images.unsplash.com/photo-1590214157969-2a91a92e82d7?w=800&q=80'
    },
    {
        title: "The Future of Hybrid Events in the UAE",
        prompt: "Write a thought-leadership article for an events company on the future of hybrid events in the UAE. Discuss strategies for blending physical and virtual experiences for major Dubai-based conferences, and how to create equal value for in-person and remote attendees.",
        category: 'Events',
        icon: Sparkles,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80'
    },
];

// Simple markdown-to-HTML parser
const formatContent = (text: string) => {
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n\s*\n/g, '</p><p>') // Paragraphs
        .replace(/\n\s*-\s/g, '</li><li>') // List items
        .replace(/<li>/g, '<ul><li>')
        .replace(/<\/li><\/ul>/g, '</li></ul>');

    // Close any open tags
    if ((html.match(/<ul>/g) || []).length > (html.match(/<\/ul>/g) || []).length) {
        html += '</ul>';
    }
    
    return `<p>${html}</p>`.replace(/<p><\/p>/g, '');
};

const InsightsPage: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<InsightTopic | null>(null);
    const [generatedArticle, setGeneratedArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { ensureApiKey, handleApiError, error, clearError } = useApiKey();

    const generateArticle = async (topic: InsightTopic) => {
        setSelectedTopic(topic);
        setIsLoading(true);
        setGeneratedArticle(null);
        clearError();

        if (!await ensureApiKey()) {
            setIsLoading(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: topic.prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => chunk.web) || [];
            
            setGeneratedArticle({
                content: response.text,
                sources: sources.filter(source => source && source.uri && source.title)
            });

        } catch (e: any) {
            handleApiError(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleBack = () => {
        setSelectedTopic(null);
        setGeneratedArticle(null);
        clearError();
    };

    const renderTopicSelection = () => (
        <div className="text-center">
            <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">AI Trendspotter</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                Select a topic for a real-time analysis of key industry trends, with a focus on Dubai and Saudi Arabia.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {insightTopics.map((topic, index) => (
                    <motion.div
                        key={topic.title}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        onClick={() => generateArticle(topic)}
                        className="h-96 block relative group overflow-hidden rounded-lg cursor-pointer border-2 border-fann-gold/20 hover:border-fann-gold transition-all duration-300"
                    >
                        <img src={topic.image} alt={topic.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                        <div className="relative h-full flex flex-col justify-between p-6 text-white text-left">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider bg-fann-charcoal/80 px-3 py-1 rounded-full">{topic.category}</span>
                            </div>
                            <div>
                                <topic.icon size={32} className="text-fann-gold mb-3" />
                                <h2 className="text-xl font-serif font-bold mb-4 leading-tight">{topic.title}</h2>
                                <span className="font-semibold text-fann-gold group-hover:underline">Read the Analysis &rarr;</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
    
    const renderArticle = () => (
        <div className="max-w-4xl mx-auto">
             <button onClick={handleBack} className="flex items-center gap-2 text-fann-gold mb-8 font-semibold hover:underline">
                <ArrowLeft size={16} /> Back to Topics
            </button>
            <AnimatePresence>
            {isLoading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex flex-col items-center text-center p-8">
                        <Loader2 className="w-12 h-12 text-fann-gold animate-spin" />
                        <h2 className="text-3xl font-serif text-white mt-6">Generating Analysis...</h2>
                        <p className="text-gray-400 mt-2">Our AI is analyzing real-time data from across the web. This might take a moment.</p>
                    </div>
                </motion.div>
            ) : error ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-red-900/50 border border-red-500 text-red-300 p-8 rounded-lg text-center">
                    <ServerCrash className="w-12 h-12 mx-auto mb-4"/>
                    <h2 className="text-2xl font-serif text-white mb-2">An Error Occurred</h2>
                    <p>{error}</p>
                </motion.div>
            ) : generatedArticle && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-black/20 p-8 sm:p-12 rounded-lg">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-fann-gold mb-6">{selectedTopic?.title}</h1>
                    <div
                        className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{ __html: formatContent(generatedArticle.content) }}
                    />

                    {generatedArticle.sources.length > 0 && (
                        <div className="mt-12 border-t border-gray-700 pt-6">
                            <h3 className="text-xl font-bold text-fann-teal mb-4 flex items-center gap-2"><BookOpen size={20} /> Sources</h3>
                             <ul className="space-y-2 list-disc list-inside">
                                {generatedArticle.sources.map((source, index) => (
                                    <li key={index}>
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-fann-gold hover:underline transition-colors" title={source.title}>
                                            {source.title || new URL(source.uri).hostname}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );


    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                   {selectedTopic ? renderArticle() : renderTopicSelection()}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default InsightsPage;