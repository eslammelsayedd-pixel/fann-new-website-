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

const portfolioPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "FANN Portfolio | Exhibitions, Events & Interior Design Projects",
    "description": "Explore FANN's diverse portfolio of successful projects in exhibitions, events, and interior design across various industries in Dubai and the GCC.",
    "url": "https://fann.ae/portfolio",
    "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": portfolioProjects.length,
        "itemListElement": portfolioProjects.map((project, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "CreativeWork",
                "name": project.title,
                "url": `https://fann.ae/portfolio#${project.id}`,
                "image": project.image,
                "disambiguatingDescription": `${project.service} for ${project.client} (${project.year}) - ${project.industry} industry.`
            }
        }))
    }
};


const PortfolioPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedScale, setSelectedScale] = useState('All');
  const [metaInfo, setMetaInfo] = useState({ title: '', description: '' });

  const services = ['All', 'Exhibitions', 'Events', 'Interior Design'];
  const scales = ['All', 'Boutique', 'Standard', 'Large', 'Mega'];
  
  const industries = useMemo(() => {
    const uniqueIndustries = new Set(portfolioProjects.map(p => p.industry));
    return ['All', ...Array.from(uniqueIndustries)].sort((a,b) => a.localeCompare(b));
  }, []);

  const filteredProjects = useMemo(() => {
    return portfolioProjects.filter(project => {
        const serviceMatch = selectedService === 'All' || project.service === selectedService;
        const industryMatch = selectedIndustry === 'All' || project.industry === selectedIndustry;
        const scaleMatch = selectedScale === 'All' || project.scale === selectedScale;
        return serviceMatch && industryMatch && scaleMatch;
    });
  }, [selectedService, selectedIndustry, selectedScale]);

  useEffect(() => {
    const baseTitle = "FANN Portfolio";
    const parts = [];

    if (selectedScale !== 'All') parts.push(selectedScale);
    if (selectedService !== 'All') parts.push(selectedService);
    if (selectedIndustry !== 'All') parts.push(`for ${selectedIndustry}`);

    const dynamicTitle = parts.length > 0 
        ? `${baseTitle} | ${parts.join(' ')}` 
        : `${baseTitle} | Exhibitions, Events & Interior Design`;

    let dynamicDescription = `Explore FANN's diverse portfolio of ${selectedScale !== 'All' ? selectedScale.toLowerCase() + ' scale ' : ''}projects${selectedService !== 'All' ? ' in ' + selectedService.toLowerCase() : ''}${selectedIndustry !== 'All' ? ' for the ' + selectedIndustry + ' industry' : ''}.`;
    
    if (filteredProjects.length > 0) {
        const projectTitles = filteredProjects.slice(0, 2).map(p => p.title).join(', ');
        if(projectTitles) {
            dynamicDescription += ` Featuring projects like ${projectTitles}.`;
        }
    }

    setMetaInfo({ title: dynamicTitle, description: dynamicDescription });

  }, [selectedService, selectedIndustry, selectedScale, filteredProjects]);


  const FilterButtons: React.FC<{title: string, options: string[], selected: string, setSelected: (value: string) => void}> = ({ title, options, selected, setSelected }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-400 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${selected === option ? 'bg-fann-gold text-fann-charcoal shadow-md' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white'}`}
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
        schema={portfolioPageSchema}
      />
      <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Our Work</h1>
            <p className="text-xl text-gray-400">Explore a selection of our finest projects.</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-fann-charcoal-light border border-white/10 p-6 rounded-lg mb-12 shadow-2xl">
            <FilterButtons title="Service" options={services} selected={selectedService} setSelected={setSelectedService} />
            <FilterButtons title="Industry" options={industries} selected={selectedIndustry} setSelected={setSelectedIndustry} />
            <FilterButtons title="Project Scale" options={scales} selected={selectedScale} setSelected={setSelectedScale} />
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
                    className="group relative overflow-hidden rounded-sm shadow-lg border border-white/5"
                  >
                    <picture>
                        <source srcSet={`${project.image}&fm=webp`} type="image/webp" />
                        <source srcSet={project.image} type="image/jpeg" />
                        <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" 
                            loading="lazy"
                            width="400"
                            height="320"
                        />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <span className="text-xs bg-fann-gold text-fann-charcoal font-bold py-1 px-2 rounded">{project.service}</span>
                        <span className="text-xs bg-black/50 text-white font-bold py-1 px-2 rounded backdrop-blur-md border border-white/10">{project.scale}</span>
                      </div>
                      <h3 className="text-xl font-bold mt-2 text-white">{project.title}</h3>
                      <p className="text-gray-300">{project.client}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="md:col-span-2 lg:col-span-3 text-center py-16 bg-fann-charcoal-light rounded-lg border border-white/10"
                >
                  <h3 className="text-2xl font-serif text-fann-gold">No Projects Found</h3>
                  <p className="text-gray-400 mt-2">Try adjusting your filters to find a match.</p>
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