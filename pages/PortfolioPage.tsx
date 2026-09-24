
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
          
          {projects.length > 0 && (
            <section id="recent-projects" className="max-w-6xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8 text-center">Recent projects</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {projects.map(project => (
                  <Link key={project.id} to={`/portfolio/${project.slug}`} className="group block bg-fann-charcoal-light border border-white/10 rounded-lg overflow-hidden shadow-xl hover:border-fann-gold transition">
                    <div className="relative">
                      <img src={project.image} alt={project.title} loading="lazy" className="w-full h-64 object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                      <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-bold bg-fann-gold text-black px-2 py-1 rounded-sm">{project.category}</span>
                      {project.gallery && <span className="absolute bottom-4 right-4 text-xs bg-black/70 text-white px-2 py-1 rounded">{project.gallery.length} photos</span>}
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-serif font-bold text-white group-hover:text-fann-gold transition-colors">{project.title}</h3>
                      <p className="text-sm text-fann-gold mt-1 mb-3"><MapPin size={14} className="inline mr-1" />{project.location} &middot; {project.year}</p>
                      <p className="text-gray-400 text-sm">{project.description}</p>
                      <span className="inline-flex items-center gap-2 text-fann-gold font-bold text-sm mt-4">View project <ArrowRight size={16} /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {true && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">What we build</h2>
                <p className="text-gray-300">200+ projects over 6+ years, from single-day event builds to full exhibition stands and office fit-outs. We work mostly in Dubai, with regular projects in Abu Dhabi, Sharjah and Al Ain. Our office is in Dubai and our own workshop is in Umm Al Quwain, so design, joinery, fabrication and installation stay in one team.</p>
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



        </div>
      </div>
    </AnimatedPage>
  );
};

export default PortfolioPage;
