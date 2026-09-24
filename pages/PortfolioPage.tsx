
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { projects } from '../constants';
import SEO from '../components/SEO';
import { ArrowRight, Maximize2, MapPin, Calendar } from 'lucide-react';

const containerVariants = {
  hidden: { },
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
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
        "numberOfItems": projects.length,
        "itemListElement": projects.map((project, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "CreativeWork",
                "name": project.title,
                "url": `https://fann.ae/portfolio/${project.slug}`,
                "image": project.image,
                "disambiguatingDescription": `${project.category} for ${project.client} (${project.year}) - ${project.industry} industry.`
            }
        }))
    }
};

const industries = [
  'All', 'Technology', 'Healthcare', 'Food & Beverage', 'Banking', 'Luxury', 
  'Retail', 'Corporate', 'Hospitality', 'Energy', 'Fashion', 'Construction',
  'Automotive', 'Telecommunications', 'Consulting', 'Real Estate', 'Fintech'
];

const PortfolioPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedScale, setSelectedScale] = useState('all');
  const [metaInfo, setMetaInfo] = useState({ title: '', description: '' });

  // Categories with dynamic counts
  const categories = useMemo(() => [
    { id: 'all', name: 'All Projects', count: projects.length },
    { id: 'exhibition', name: 'Exhibitions', count: projects.filter(p => p.category === 'exhibition').length },
    { id: 'event', name: 'Events', count: projects.filter(p => p.category === 'event').length },
    { id: 'interior', name: 'Interiors', count: projects.filter(p => p.category === 'interior').length }
  ], []);

  // Scales logic
  const scales = [
    { id: 'all', name: 'All Scales', filter: () => true },
    { 
      id: 'small', 
      name: 'Small (<50 sqm)', 
      filter: (p: any) => p.size && parseInt(p.size) < 50 
    },
    { 
      id: 'medium', 
      name: 'Medium (50-100 sqm)', 
      filter: (p: any) => p.size && parseInt(p.size) >= 50 && parseInt(p.size) <= 100 
    },
    { 
      id: 'large', 
      name: 'Large (100+ sqm)', 
      filter: (p: any) => p.size && parseInt(p.size) > 100 
    }
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
        // Category Filter
        const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;
        
        // Industry Filter - flexible matching
        const industryMatch = selectedIndustry === 'All' || project.industry.includes(selectedIndustry) || (project.tags && project.tags.includes(selectedIndustry));
        
        // Scale Filter
        // Only apply scale filter if the project has a size property (Events might not)
        const scaleFilterObj = scales.find(s => s.id === selectedScale);
        const scaleMatch = (selectedScale === 'all') || (project.size && scaleFilterObj ? scaleFilterObj.filter(project) : true);

        return categoryMatch && industryMatch && scaleMatch;
    });
  }, [selectedCategory, selectedIndustry, selectedScale]);

  useEffect(() => {
    const baseTitle = "FANN Portfolio";
    const parts = [];

    if (selectedCategory !== 'all') parts.push(categories.find(c => c.id === selectedCategory)?.name || '');
    if (selectedIndustry !== 'All') parts.push(`for ${selectedIndustry}`);

    const dynamicTitle = parts.length > 0 
        ? `${baseTitle} | ${parts.join(' ')}` 
        : `${baseTitle} | Exhibitions, Events & Interior Design`;

    let dynamicDescription = `Explore FANN's diverse portfolio of projects${selectedCategory !== 'all' ? ' in ' + selectedCategory : ''}${selectedIndustry !== 'All' ? ' for the ' + selectedIndustry + ' industry' : ''}.`;
    
    setMetaInfo({ title: dynamicTitle, description: dynamicDescription });

  }, [selectedCategory, selectedIndustry, selectedScale, categories]);

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
            <p className="text-xl text-gray-400">Showcasing excellence in design and execution across Dubai.</p>
          </div>
          
          {projects.length === 0 && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">What we build</h2>
                <p className="text-gray-300">200+ projects over 6+ years, from single-day event builds to full exhibition stands and office fit-outs. We work mostly in Dubai, with regular projects in Abu Dhabi, Sharjah and Al Ain. Our own workshop and warehouse in Dubai handle design, joinery, fabrication and installation.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {[
                  { t: 'Custom exhibition stands', img: '/images/site/exhibition-booth-lounge.webp', where: 'DWTC, Dubai Exhibition Centre (Expo City), ADNEC Abu Dhabi, Expo Centre Sharjah', scope: '18 - 150+ sqm, full design & build, AV, furniture, graphics, on-site build and dismantle' },
                  { t: 'Modular & reusable stands', img: '/images/site/exhibition-machinery-stand.webp', where: 'Dubai and Abu Dhabi trade shows', scope: 'Systems that can be reused across several shows, with new graphics each time' },
                  { t: 'Interactive & immersive displays', img: '/images/site/exhibition-tech-expo.webp', where: 'Exhibitions, brand activations and launches', scope: 'LED walls, touchscreens, projection, lighting and product displays built into the stand or set' },
                  { t: 'Event sets & stages', img: '/images/site/event-dramatic-lighting.webp', where: 'Hotels and venues across Dubai and Abu Dhabi', scope: 'Stages, backdrops, photo walls, entrance features, gala and launch sets' },
                  { t: 'Conferences & corporate events', img: '/images/site/event-conference-speaker.webp', where: 'Dubai, Abu Dhabi, Sharjah', scope: 'Stage and set build, branding, registration areas, breakout rooms' },
                  { t: 'Commercial fit-out', img: '/images/site/fitout-executive-office.webp', where: 'Offices, clinics, retail and F&B across the UAE', scope: 'Design, joinery, ceilings, flooring, MEP coordination and handover' },
                ].map(c => (
                  <article key={c.t} className="bg-fann-charcoal-light border border-white/10 rounded-lg overflow-hidden shadow-xl">
                    <img src={c.img} alt={c.t} loading="lazy" className="w-full h-52 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-white mb-3">{c.t}</h3>
                      <p className="text-sm text-gray-300 mb-2"><MapPin size={14} className="inline mr-1 text-fann-gold" />{c.where}</p>
                      <p className="text-sm text-gray-400">{c.scope}</p>
                    </div>
                  </article>
                ))}
              </div>
              <p className="text-center text-xs text-gray-500 mb-10">Images show the type of work. Photos of our own projects similar to yours are available on request.</p>
              <div className="text-center bg-fann-charcoal-light border border-white/10 p-10 rounded-lg">
                <h2 className="text-2xl font-serif font-bold text-white mb-3">Want to see work like yours?</h2>
                <p className="text-gray-400 mb-6">Tell us your event or space and we will send photos and references from similar projects.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact" className="bg-fann-gold text-fann-charcoal font-bold px-8 py-3 rounded-full hover:opacity-90 transition">Request project examples</Link>
                  <a href="https://wa.me/971505667502" target="_blank" rel="noopener noreferrer" className="border border-fann-gold text-fann-gold font-bold px-8 py-3 rounded-full hover:bg-fann-gold/10 transition">WhatsApp us</a>
                </div>
              </div>
            </div>
          )}

          {projects.length > 0 && (<>
          <div className="max-w-6xl mx-auto bg-fann-charcoal-light border border-white/10 p-6 rounded-lg mb-12 shadow-2xl space-y-6">
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 border-b border-white/10 pb-6">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${selectedCategory === cat.id ? 'bg-fann-gold text-fann-charcoal' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        {cat.name} <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat.id ? 'bg-black/20 text-black' : 'bg-black/40 text-gray-500'}`}>{cat.count}</span>
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Industry Filter */}
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Industry</h3>
                    <div className="flex flex-wrap gap-2">
                        {industries.map(ind => (
                            <button
                                key={ind}
                                onClick={() => setSelectedIndustry(ind)}
                                className={`px-3 py-1 text-xs rounded-sm border transition-all ${selectedIndustry === ind ? 'border-fann-gold text-fann-gold bg-fann-gold/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                            >
                                {ind}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scale Filter */}
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Scale / Size</h3>
                    <div className="flex flex-wrap gap-2">
                        {scales.map(scale => (
                            <button
                                key={scale.id}
                                onClick={() => setSelectedScale(scale.id)}
                                className={`px-3 py-1 text-xs rounded-sm border transition-all ${selectedScale === scale.id ? 'border-fann-gold text-fann-gold bg-fann-gold/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                            >
                                {scale.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
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
                  >
                    <Link to={`/portfolio/${project.slug || project.id}`} className="project-card-link" aria-label={`View details for ${project.title}`}>
                      <article class="project-card">
                        <div className="project-image-wrapper">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            loading="lazy"
                          />
                          <div className="project-overlay">
                            <ArrowRight className="view-project-icon w-12 h-12" />
                            <span className="view-project-text">View Project</span>
                          </div>
                        </div>
                        
                        <div className="project-card-content">
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-[10px] uppercase tracking-widest font-bold bg-fann-gold text-black px-2 py-1 rounded-sm">
                              {project.category}
                            </span>
                            {project.featured && (
                              <span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 text-white px-2 py-1 rounded-sm border border-white/20">
                                Featured
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs font-bold text-fann-gold uppercase tracking-widest mb-0">{project.client}</p>
                          <h3 className="text-xl font-serif font-bold text-white leading-tight group-hover:text-fann-gold transition-colors">{project.title}</h3>
                          <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 text-[11px] text-gray-500 border-t border-white/10 pt-3 mt-auto">
                            {project.size && (
                              <span className="flex items-center gap-1">
                                <Maximize2 size={12} /> {project.size}
                              </span>
                            )}
                            {project.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} /> {project.location.split(',')[0]}
                              </span>
                            )}
                            <span className="flex items-center gap-1 ml-auto">
                              <Calendar size={12} /> {project.year}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="md:col-span-2 lg:col-span-3 text-center py-24 bg-fann-charcoal-light rounded-lg border border-white/10"
                >
                  <h3 className="text-2xl font-serif text-fann-gold mb-2">No Projects Found</h3>
                  <p className="text-gray-400">Try adjusting your filters to find a match.</p>
                  <button 
                    onClick={() => { setSelectedCategory('all'); setSelectedIndustry('All'); setSelectedScale('all'); }}
                    className="mt-6 text-sm text-white border-b border-white pb-1 hover:text-fann-gold hover:border-fann-gold transition-colors"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          </>)}

        </div>
      </div>
    </AnimatedPage>
  );
};

export default PortfolioPage;
