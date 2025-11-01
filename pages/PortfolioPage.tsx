import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import { portfolioProjects } from '../constants';
import SEO from '../components/SEO';

const containerVariants = {
  hidden: { },
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};


const PortfolioPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [metaInfo, setMetaInfo] = useState({ title: '', description: '' });

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
    const baseTitle = "FANN Portfolio";
    let dynamicTitle = baseTitle;
    let dynamicDescription = "";

    const serviceText = selectedService !== 'All' ? selectedService : '';
    const industryText = selectedIndustry !== 'All' ? selectedIndustry : '';

    if (serviceText && industryText) {
      dynamicTitle = `${baseTitle} | ${serviceText} for ${industryText}`;
      dynamicDescription = `Explore FANN's portfolio of ${serviceText.toLowerCase()} projects for the ${industryText} industry. Discover our work with leading brands in the GCC.`;
    } else if (serviceText) {
      dynamicTitle = `${baseTitle} | ${serviceText} Projects`;
      dynamicDescription = `Browse our portfolio of exceptional ${serviceText.toLowerCase()} projects. See how FANN creates unforgettable experiences for clients across various industries.`;
    } else if (industryText) {
      dynamicTitle = `${baseTitle} | ${industryText} Industry Projects`;
      dynamicDescription = `View FANN's specialized projects for the ${industryText} industry. Discover our expertise in creating bespoke exhibitions, events, and interiors.`;
    } else {
      dynamicTitle = `Our Work | FANN Portfolio`;
      dynamicDescription = 'Explore the diverse portfolio of FANN. View our successful projects in exhibitions, events, and interior design across various industries in Dubai and the GCC.';
    }
    
    if (filteredProjects.length > 0) {
        const projectTitles = filteredProjects.slice(0, 2).map(p => p.title).join(', ');
        if(projectTitles) {
            dynamicDescription += ` Featuring projects like ${projectTitles}.`;
        }
    }

    setMetaInfo({ title: dynamicTitle, description: dynamicDescription });

  }, [selectedService, selectedIndustry, filteredProjects]);


  const FilterButtons: React.FC<{title: string, options: string[], selected: string, setSelected: (value: string) => void}> = ({ title, options, selected, setSelected }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-fann-light-gray mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${selected === option ? 'bg-fann-gold text-fann-charcoal shadow-md' : 'bg-fann-peach/50 text-fann-teal dark:bg-fann-accent-teal/50 dark:text-fann-peach hover:bg-fann-peach/80 dark:hover:bg-fann-accent-teal'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AnimatedPage>
      <SEO
        title={metaInfo.title}
        description={metaInfo.description}
      />
      <div className="min-h-screen bg-fann-peach dark:bg-fann-teal pt-32 pb-20 text-fann-teal dark:text-fann-peach">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-bold text-fann-accent-teal dark:text-fann-gold mb-4">Our Work</h1>
            <p className="text-xl text-fann-teal/90 dark:text-fann-peach/90">Explore a selection of our finest projects.</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-fann-accent-teal p-6 rounded-lg mb-12 shadow-md">
            <FilterButtons title="Service" options={services} selected={selectedService} setSelected={setSelectedService} />
            <FilterButtons title="Industry" options={industries} selected={selectedIndustry} setSelected={setSelectedIndustry} />
          </div>

          <motion.div 
            layout 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
                  <motion.div 
                    key={project.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-lg shadow-lg"
                  >
                    <img src={project.image} alt={project.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <span className="text-sm bg-fann-gold text-fann-charcoal font-bold py-1 px-2 rounded">{project.service}</span>
                      <h3 className="text-xl font-bold mt-2 text-white">{project.title}</h3>
                      <p className="text-fann-peach">{project.client}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="md:col-span-2 lg:col-span-3 text-center py-16 bg-white dark:bg-fann-accent-teal rounded-lg"
                >
                  <h3 className="text-2xl font-serif text-fann-accent-teal dark:text-fann-gold">No Projects Found</h3>
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
