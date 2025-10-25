import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { Building, Crown, PenTool } from 'lucide-react';

const studioOptions = [
    { 
        id: 'exhibition', 
        name: 'Exhibition Studio', 
        icon: Building, 
        description: 'Generate photorealistic 3D concepts for your exhibition stand. Define your size, style, and features to visualize your presence.',
        link: '/fann-studio/exhibition',
        isComingSoon: false
    },
    { 
        id: 'events', 
        name: 'Event Studio', 
        icon: Crown, 
        description: 'Create stunning mood boards and concept visuals for your next corporate event. From galas to launches, bring your theme to life.',
        link: '/fann-studio/event',
        isComingSoon: false
    },
    { 
        id: 'interior-design', 
        name: 'Interior Design Studio', 
        icon: PenTool, 
        description: 'Visualize commercial or residential interiors. Experiment with styles, materials, and layouts for your unique space.',
        link: '/fann-studio/interior',
        isComingSoon: false 
    },
];

interface StudioCardProps {
  studio: typeof studioOptions[0];
  index: number;
}

const StudioCard: React.FC<StudioCardProps> = ({ studio, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.15 }}
        className="h-full"
    >
        <Link 
            to={studio.isComingSoon ? '#' : studio.link} 
            className={`
                h-full flex flex-col justify-between p-8 bg-fann-charcoal-light rounded-lg 
                border-2 border-fann-border group transition-all duration-300
                ${studio.isComingSoon 
                    ? 'cursor-not-allowed opacity-60' 
                    : 'hover:border-fann-gold hover:bg-fann-gold/5'
                }
            `}
        >
            <div>
                <div className="flex items-center justify-between">
                    <studio.icon className="w-12 h-12 text-fann-gold" />
                    {studio.isComingSoon && <span className="text-xs bg-fann-light-gray text-fann-charcoal font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Soon</span>}
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mt-6">{studio.name}</h3>
                <p className="text-fann-light-gray mt-3 text-base">{studio.description}</p>
            </div>
            {!studio.isComingSoon && (
                <span className="font-semibold text-fann-gold mt-8 inline-block group-hover:underline">
                    Start Designing &rarr;
                </span>
            )}
        </Link>
    </motion.div>
);

const AIDesignStudioPage: React.FC = () => {
    return (
        <AnimatedPage>
            <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-fann-gold mb-4">FANN Studio</h1>
                        <p className="text-xl text-fann-cream max-w-3xl mx-auto">
                            Your vision, realized in minutes. Select a studio to begin creating with the power of FANN's generative technology.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {studioOptions.map((studio, index) => (
                           <StudioCard key={studio.id} studio={studio} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default AIDesignStudioPage;
