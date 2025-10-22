import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { portfolioProjects } from '../constants';
import { Cube, X } from 'lucide-react';
// FIX: Add a type-only import from 'types.ts' to ensure the TypeScript
// compiler includes the global JSX augmentations defined in that file, resolving
// the error for the custom <model-viewer> element.
import type {} from '../types';

const PortfolioPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const services = ['All', 'Exhibitions', 'Events', 'Interior Design'];
  const industries = useMemo(() => {
    const uniqueIndustries = new Set(portfolioProjects.map(p => p.industry));
    return ['All', ...Array.from(uniqueIndustries)].sort((a,b) => a.localeCompare(b));
  }, []);

  const filteredProjects = useMemo(() => {
    return portfolioProjects.filter(project => {
        const serviceMatch = selectedService === 'All' || project.service === selectedService;
        const industryMatch = selectedIndustry === 'All' || project.industry === selectedIndustry;
        return serviceMatch && industryMatch;
    });
  }, [selectedService, selectedIndustry]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedModel(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const FilterButtons: React.FC<{title: string, options: string[], selected: string, setSelected: (value: string) => void}> = ({ title, options, selected, setSelected }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-fann-light-gray mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors duration-200 ${selected === option ? 'bg-fann-teal text-white font-bold' : 'bg-fann-charcoal hover:bg-white/10'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Our Work</h1>
            <p className="text-xl text-fann-cream">Explore a selection of our finest projects.</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-fann-charcoal-light p-6 rounded-lg mb-12">
            <FilterButtons title="Service" options={services} selected={selectedService} setSelected={setSelectedService} />
            <FilterButtons title="Industry" options={industries} selected={selectedIndustry} setSelected={setSelectedIndustry} />
          </div>

          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <motion.div 
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-lg"
                  >
                    <img src={project.image} alt={project.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <span className="text-sm bg-fann-gold text-fann-charcoal font-bold py-1 px-2 rounded">{project.service}</span>
                      <h3 className="text-xl font-bold mt-2 text-white">{project.title}</h3>
                      <p className="text-fann-cream">{project.client}</p>
                    </div>
                    {project.model3d && (
                      <button 
                        onClick={() => setSelectedModel(project.model3d as string)}
                        className="absolute top-4 right-4 bg-fann-charcoal/70 backdrop-blur-sm text-white px-3 py-2 rounded-full text-xs font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-fann-teal"
                      >
                        <Cube size={14} />
                        View 3D Model
                      </button>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="md:col-span-2 lg:col-span-3 text-center py-16 bg-fann-charcoal-light rounded-lg"
                >
                  <h3 className="text-2xl font-serif text-fann-gold">No Projects Found</h3>
                  <p className="text-fann-light-gray mt-2">Try adjusting your filters to find a match.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedModel(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl h-full max-h-[80vh] bg-fann-charcoal-light rounded-lg shadow-2xl"
            >
              <button
                onClick={() => setSelectedModel(null)}
                className="absolute top-2 right-2 z-10 bg-fann-charcoal p-2 rounded-full text-white hover:bg-fann-teal transition-colors"
                aria-label="Close 3D viewer"
              >
                <X size={24} />
              </button>
              <model-viewer
                src={selectedModel}
                alt="A 3D model of the project"
                camera-controls
                auto-rotate
                ar
                shadow-intensity="1"
                style={{ width: '100%', height: '100%', borderRadius: '8px' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedPage>
  );
};

export default PortfolioPage;