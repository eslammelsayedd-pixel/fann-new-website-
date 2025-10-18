import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Calendar, PenTool, ArrowRight, Video } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const designOptions = [
    {
        icon: Layers,
        title: 'Exhibition Stands',
        description: 'Generate bespoke, award-winning exhibition stand concepts for major trade shows like GITEX and Arab Health.',
        link: '/ai-design-studio/exhibition',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&q=80',
        status: 'Ready'
    },
    {
        icon: Calendar,
        title: 'Event Concepts',
        description: 'Visualize stunning concepts for corporate events, from high-profile product launches to elegant gala dinners.',
        link: '/ai-design-studio/events',
        image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1000&q=80',
        status: 'Ready'
    },
    {
        icon: Video,
        title: 'Video Concepts',
        description: 'Generate short, dynamic promotional video concepts for your brand, event, or exhibition.',
        link: '/ai-design-studio/video',
        image: 'https://images.unsplash.com/photo-1574717024633-616de4a233b2?w=1000&q=80',
        status: 'Ready'
    },
    {
        icon: PenTool,
        title: 'Interior Spaces',
        description: 'Design inspiring commercial and residential interiors, from futuristic workspaces to luxurious private villas.',
        link: '/ai-design-studio/interior-design',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
        status: 'Coming Soon'
    }
];

const AIDesignStudioPage: React.FC = () => {
    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-fann-gold mb-4">FANN AI Design Studio</h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Choose your canvas. Let's create something extraordinary together.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {designOptions.map((option, index) => (
                            <motion.div
                                key={option.title}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover="hover"
                                whileTap={option.status === 'Ready' ? "tap" : undefined}
                                variants={{
                                    initial: { scale: 1, y: 0, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)" },
                                    hover: option.status === 'Ready' ? { scale: 1.03, y: -5, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)" } : {},
                                    tap: { scale: 0.98 }
                                }}
                                className="h-full group"
                            >
                                <Link to={option.link} className={`block h-full relative overflow-hidden rounded-lg border-2 transition-colors duration-300 ${option.status === 'Coming Soon' ? 'border-gray-700 pointer-events-none' : 'border-fann-gold/50 group-hover:border-fann-gold'}`}>
                                    <motion.img 
                                        src={option.image} 
                                        alt={option.title} 
                                        className="absolute inset-0 w-full h-full object-cover" 
                                        variants={{ hover: { scale: 1.1 }, initial: { scale: 1 } }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <div className={`absolute inset-0 ${option.status === 'Coming Soon' ? 'bg-black/80' : 'bg-gradient-to-t from-black/90 via-black/60 to-transparent'}`}></div>
                                    
                                    <div className="relative h-full flex flex-col justify-end p-8 text-white">
                                        <div className="mb-4">
                                            <option.icon size={40} className="text-fann-gold" />
                                        </div>
                                        <h2 className="text-3xl font-serif font-bold mb-2">{option.title}</h2>
                                        <p className="text-gray-300 mb-6 flex-grow">{option.description}</p>
                                        
                                        {option.status === 'Ready' ? (
                                             <motion.div className="flex items-center font-bold text-fann-gold" variants={{ hover: { textDecoration: 'underline' }, initial: { textDecoration: 'none' }}}>
                                                Start Designing 
                                                <motion.div variants={{ hover: { x: 4 }, initial: { x: 0 } }}>
                                                    <ArrowRight className="ml-2 h-5 w-5" />
                                                </motion.div>
                                            </motion.div>
                                        ) : (
                                            <div className="bg-fann-teal text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full self-start">
                                                {option.status}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default AIDesignStudioPage;