import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { portfolioProjects } from '../constants';

const containerVariants = {
  hidden: { },
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


const PortfolioPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

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

          <motion.div 
            layout 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <AnimatePresence>
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <motion.div 
                    key={project.id}
                    layout
                    variants={itemVariants}
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
    </AnimatedPage>
  );
};

export default PortfolioPage;
