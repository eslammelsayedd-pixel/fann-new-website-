import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { Building, Crown, PenTool, Video, ArrowRight } from 'lucide-react';

interface StudioCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  image: string;
  comingSoon?: boolean;
}

const StudioCard: React.FC<StudioCardProps> = ({ icon: Icon, title, description, link, image, comingSoon }) => (
  <Link to={link} className={`block relative group overflow-hidden rounded-lg border-2 transition-all duration-300 ${comingSoon ? 'border-fann-border' : 'border-fann-gold/20 hover:border-fann-gold'}`}>
    <img src={image} alt={title} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${comingSoon ? 'grayscale' : ''}`} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
    {comingSoon && (
      <div className="absolute top-4 right-4 bg-fann-light-gray text-fann-charcoal text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
        Coming Soon
      </div>
    )}
    <div className="relative h-full flex flex-col justify-between p-6 text-white min-h-[300px] md:min-h-[400px]">
      <div>
        <Icon size={32} className={comingSoon ? "text-fann-light-gray" : "text-fann-gold"} />
      </div>
      <div>
        <h3 className="text-2xl font-serif font-bold mb-2">{title}</h3>
        <p className={`text-sm mb-4 ${comingSoon ? 'text-fann-light-gray' : 'text-fann-cream'}`}>{description}</p>
        <span className={`font-semibold flex items-center gap-2 ${comingSoon ? 'text-fann-light-gray' : 'text-fann-gold group-hover:underline'}`}>
          {comingSoon ? 'Learn More' : 'Start Designing'} <ArrowRight size={16} />
        </span>
      </div>
    </div>
  </Link>
);

const AIDesignStudioPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-fann-gold mb-4">AI Design Studio</h1>
            <p className="text-xl text-fann-cream max-w-3xl mx-auto">
              Your vision, realized in minutes. Select a studio to begin creating with the power of generative AI.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <StudioCard
                icon={Building}
                title="Exhibition Studio"
                description="Configure and visualize your bespoke exhibition stand. Generate 3D models and 2D concepts instantly."
                link="/ai-design-studio/exhibition"
                image="https://images.unsplash.com/photo-1678393972445-5026e018505e?w=800&q=80"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <StudioCard
                icon={Crown}
                title="Event Studio"
                description="Design the look and feel of your next corporate event. Generate mood boards and concept visuals."
                link="/ai-design-studio/events"
                image="https://images.unsplash.com/photo-1516475429286-465d815a0d72?w=800&q=80"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <StudioCard
                icon={PenTool}
                title="Interior Design Studio"
                description="Craft stunning concepts for commercial and residential spaces. The future of interior design is on its way."
                link="/ai-design-studio/interior-design"
                image="https://images.unsplash.com/photo-1618221195710-dd6b41fa2047?w=800&q=80"
                comingSoon
              />
            </motion.div>
             <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <StudioCard
                icon={Video}
                title="Video Concept Studio"
                description="Generate short, promotional video concepts for your event or brand to use in marketing campaigns."
                link="/ai-design-studio/video"
                image="https://images.unsplash.com/photo-1578171688145-2f5a0e49c32f?w=800&q=80"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AIDesignStudioPage;
