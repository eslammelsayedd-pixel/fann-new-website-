
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

const fitOutReferences = [
  {
    "name": "School interior",
    "sector": "Education",
    "emirate": "Abu Dhabi",
    "area": "6,664",
    "year": "2024"
  },
  {
    "name": "Event hospitality interior",
    "sector": "Entertainment & Civic",
    "emirate": "Abu Dhabi",
    "area": "3,230",
    "year": "2023"
  },
  {
    "name": "Itch Cafe",
    "sector": "F&B",
    "emirate": "Abu Dhabi",
    "area": "1,938",
    "year": "2021"
  },
  {
    "name": "Break Al Qana Restaurant",
    "sector": "F&B",
    "emirate": "Abu Dhabi",
    "area": "3,850",
    "year": "2024"
  },
  {
    "name": "Salmontini Le Bistro",
    "sector": "F&B",
    "emirate": "Abu Dhabi",
    "area": "2,000",
    "year": "2024"
  },
  {
    "name": "Fitness club interior",
    "sector": "Fitness & Leisure",
    "emirate": "Abu Dhabi",
    "area": "6,673",
    "year": "2025"
  },
  {
    "name": "Corporate office interior",
    "sector": "Office",
    "emirate": "Abu Dhabi",
    "area": "13,562",
    "year": "2022"
  },
  {
    "name": "Cloud Spaces Co-working Space - ADGM",
    "sector": "Office",
    "emirate": "Abu Dhabi",
    "area": "19,964",
    "year": "2023"
  },
  {
    "name": "Corporate office interior",
    "sector": "Office",
    "emirate": "Abu Dhabi",
    "area": "19,267",
    "year": "2024"
  },
  {
    "name": "Corporate headquarters interior",
    "sector": "Office",
    "emirate": "Abu Dhabi",
    "area": "15,000",
    "year": "2025"
  },
  {
    "name": "Technology office interior",
    "sector": "Office",
    "emirate": "Abu Dhabi",
    "area": "5,885",
    "year": "2026"
  },
  {
    "name": "Villa Isola",
    "sector": "Residential",
    "emirate": "Abu Dhabi",
    "area": "4,000",
    "year": "2022"
  },
  {
    "name": "Mushrif Villa",
    "sector": "Residential",
    "emirate": "Abu Dhabi",
    "area": "10,940",
    "year": "2024"
  },
  {
    "name": "Villa Amavita - Saadiyat Island",
    "sector": "Residential",
    "emirate": "Abu Dhabi",
    "area": "5,381",
    "year": "2025"
  },
  {
    "name": "Fern Flower Shop",
    "sector": "Retail",
    "emirate": "Abu Dhabi",
    "area": "1,152",
    "year": "2024"
  },
  {
    "name": "Century Bank Brokers Office",
    "sector": "Banking & Finance",
    "emirate": "Dubai",
    "area": "6,000",
    "year": "2021"
  },
  {
    "name": "University interior",
    "sector": "Education",
    "emirate": "Dubai",
    "area": "12,777",
    "year": "2022"
  },
  {
    "name": "School interior",
    "sector": "Education",
    "emirate": "Dubai",
    "area": "24,880",
    "year": "2024"
  },
  {
    "name": "ATTIKO Restaurant",
    "sector": "F&B",
    "emirate": "Dubai",
    "area": "6,458",
    "year": "2022"
  },
  {
    "name": "Hotel restaurant interior",
    "sector": "F&B",
    "emirate": "Dubai",
    "area": "10,495",
    "year": "2022"
  },
  {
    "name": "Hotel restaurant interior",
    "sector": "F&B",
    "emirate": "Dubai",
    "area": "6,673",
    "year": "2022"
  },
  {
    "name": "Atrangi Restaurant",
    "sector": "F&B",
    "emirate": "Dubai",
    "area": "5,275",
    "year": "2023"
  },
  {
    "name": "City Social Restaurant",
    "sector": "F&B",
    "emirate": "Dubai",
    "area": "9,310",
    "year": "2023"
  },
  {
    "name": "Adaline Restaurant",
    "sector": "F&B",
    "emirate": "Dubai",
    "area": "6,000",
    "year": "2024"
  },
  {
    "name": "Alba Restaurant",
    "sector": "F&B",
    "emirate": "Dubai",
    "area": "5,000",
    "year": "2024"
  },
  {
    "name": "Fitness studio interior",
    "sector": "Fitness & Leisure",
    "emirate": "Dubai",
    "area": "10,000",
    "year": "2022"
  },
  {
    "name": "Banya Forrest Spa and Health Club",
    "sector": "Fitness & Leisure",
    "emirate": "Dubai",
    "area": "11,000",
    "year": "2024"
  },
  {
    "name": "Healthcare clinic interior",
    "sector": "Healthcare",
    "emirate": "Dubai",
    "area": "6,867",
    "year": "2022"
  },
  {
    "name": "Fayy Health Polyclinic",
    "sector": "Healthcare",
    "emirate": "Dubai",
    "area": "13,000",
    "year": "2023"
  },
  {
    "name": "Aspris Clinic - City Walk",
    "sector": "Healthcare",
    "emirate": "Dubai",
    "area": "5,490",
    "year": "2024"
  },
  {
    "name": "Hotel restaurant interior",
    "sector": "Hospitality",
    "emirate": "Dubai",
    "area": "6,361",
    "year": "2021"
  },
  {
    "name": "Hotel suite interior",
    "sector": "Hospitality",
    "emirate": "Dubai",
    "area": "1,722",
    "year": "2022"
  },
  {
    "name": "Resort interior",
    "sector": "Hospitality",
    "emirate": "Dubai",
    "area": "4,284",
    "year": "2023"
  },
  {
    "name": "ORO24 Real Estate Developments Head Office, Sheikh Zayed Rd",
    "sector": "Office",
    "emirate": "Dubai",
    "area": "12,000",
    "year": "2021"
  },
  {
    "name": "Corporate headquarters interior",
    "sector": "Office",
    "emirate": "Dubai",
    "area": "19,692",
    "year": "2022"
  },
  {
    "name": "Corporate office interior",
    "sector": "Office",
    "emirate": "Dubai",
    "area": "12,492",
    "year": "2022"
  },
  {
    "name": "Augustus Media Office",
    "sector": "Office",
    "emirate": "Dubai",
    "area": "12,000",
    "year": "2022"
  },
  {
    "name": "Echo Project Development Office",
    "sector": "Office",
    "emirate": "Dubai",
    "area": "6,740",
    "year": "2023"
  },
  {
    "name": "Corporate headquarters interior",
    "sector": "Office",
    "emirate": "Dubai",
    "area": "7,535",
    "year": "2023"
  },
  {
    "name": "Corporate office interior",
    "sector": "Office",
    "emirate": "Dubai",
    "area": "7,596",
    "year": "2023"
  },
  {
    "name": "Technology office interior",
    "sector": "Office",
    "emirate": "Dubai",
    "area": "9,331",
    "year": "2023"
  },
  {
    "name": "AB Prime Realty Office",
    "sector": "Office",
    "emirate": "Dubai",
    "area": "10,118",
    "year": "2025"
  },
  {
    "name": "Private villa interior",
    "sector": "Residential",
    "emirate": "Dubai",
    "area": "26,910",
    "year": "2021"
  },
  {
    "name": "EA183 Private Residence",
    "sector": "Residential",
    "emirate": "Dubai",
    "area": "18,000",
    "year": "2023"
  },
  {
    "name": "Alto Villa",
    "sector": "Residential",
    "emirate": "Dubai",
    "area": "12,970",
    "year": "2024"
  },
  {
    "name": "Emirates Hills Villa - Elegance & Luxury",
    "sector": "Residential",
    "emirate": "Dubai",
    "area": "17,765",
    "year": "2024"
  },
  {
    "name": "Private penthouse interior",
    "sector": "Residential",
    "emirate": "Dubai",
    "area": "4,494",
    "year": "2024"
  },
  {
    "name": "A Sanctuary in the City Home",
    "sector": "Residential",
    "emirate": "Dubai",
    "area": "2,500",
    "year": "2025"
  },
  {
    "name": "Retail store interior",
    "sector": "Retail",
    "emirate": "Dubai",
    "area": "1,937",
    "year": "2022"
  },
  {
    "name": "Luxury boutique interior",
    "sector": "Retail",
    "emirate": "Dubai",
    "area": "2,000",
    "year": "2022"
  },
  {
    "name": "Retail showroom interior",
    "sector": "Retail",
    "emirate": "Dubai",
    "area": "2,917",
    "year": "2023"
  },
  {
    "name": "Global Furniture Showroom",
    "sector": "Retail",
    "emirate": "Dubai",
    "area": "1,600",
    "year": "2025"
  },
  {
    "name": "Kibba Wa Tabbola Restaurant",
    "sector": "F&B",
    "emirate": "Ras Al Khaimah",
    "area": "4,306",
    "year": "2022"
  },
  {
    "name": "Hotel restaurant interior",
    "sector": "F&B",
    "emirate": "Ras Al Khaimah",
    "area": null,
    "year": "2022"
  },
  {
    "name": "Resort interior",
    "sector": "Hospitality",
    "emirate": "Ras Al Khaimah",
    "area": null,
    "year": "2025"
  },
  {
    "name": "Hotel interior",
    "sector": "Hospitality",
    "emirate": "Ras Al Khaimah",
    "area": null,
    "year": "2025"
  },
  {
    "name": "RAK Julphar Avenue and Towers - Public Areas",
    "sector": "Mixed-Use",
    "emirate": "Ras Al Khaimah",
    "area": "33,000",
    "year": "2025"
  },
  {
    "name": "Seaside Serenity Villa",
    "sector": "Residential",
    "emirate": "Ras Al Khaimah",
    "area": "3,900",
    "year": "2023"
  },
  {
    "name": "Private villa interiors",
    "sector": "Residential",
    "emirate": "Ras Al Khaimah",
    "area": "25,000",
    "year": "2024"
  },
  {
    "name": "Al Hamra Village Home",
    "sector": "Residential",
    "emirate": "Ras Al Khaimah",
    "area": "3,900",
    "year": "2025"
  },
  {
    "name": "Retail store interior",
    "sector": "Retail",
    "emirate": "Ras Al Khaimah",
    "area": "1,857",
    "year": "2024"
  },
  {
    "name": "African + Eastern Store",
    "sector": "Retail",
    "emirate": "Ras Al Khaimah",
    "area": "9,000",
    "year": "2025"
  }
] as const;

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
                "disambiguatingDescription": `${project.category} for ${project.client} ${project.year ? `(${project.year})` : ''} - ${project.industry} industry.`
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
                      <p className="text-sm text-fann-gold mt-1 mb-3"><MapPin size={14} className="inline mr-1" />{project.location}{project.year ? <> &middot; {project.year}</> : null}</p>
                      <p className="text-gray-400 text-sm">{project.description}</p>
                      <span className="inline-flex items-center gap-2 text-fann-gold font-bold text-sm mt-4">View project <ArrowRight size={16} /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section id="fit-out-references" className="max-w-6xl mx-auto mb-20" aria-labelledby="fitout-title">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <p className="text-fann-gold uppercase tracking-[0.18em] text-xs font-bold mb-3">Interior fit-out & renovation</p>
              <h2 id="fitout-title" className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Fit-out project references</h2>
              <p className="text-gray-300">Selected references from our company profile, 2021–2026. Areas are approximate.</p>
            </div>
            {(['Dubai', 'Abu Dhabi', 'Ras Al Khaimah'] as const).map(emirate => {
              const entries = fitOutReferences.filter(item => item.emirate === emirate);
              return <div key={emirate} className="mb-10">
                <h3 className="text-2xl font-serif font-bold text-fann-gold mb-5 border-b border-white/15 pb-3">{emirate} <span className="text-sm text-gray-400 font-sans font-normal">({entries.length})</span></h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entries.map((item, index) => <article key={`${emirate}-${index}`} className="rounded-lg bg-fann-charcoal-light border border-white/10 p-5">
                    <p className="text-xs uppercase tracking-wide text-fann-gold mb-2">{item.sector}</p>
                    <h4 className="text-lg font-serif text-white font-bold leading-snug">{item.name}</h4>
                    <p className="text-sm text-gray-400 mt-3">{item.year}{item.area ? ` · Approx. ${item.area} sq ft` : ''}</p>
                  </article>)}
                </div>
              </div>;
            })}
          </section>

          {true && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">What we build</h2>
                <p className="text-gray-300">200+ projects, from single-day event builds to full exhibition stands and office fit-outs. We work mostly in Dubai, with regular projects in Abu Dhabi, Sharjah and Al Ain. Our office is in Dubai and our own workshop is in Umm Al Quwain, so design, joinery, fabrication and installation stay in one team.</p>
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
              <p className="text-center text-xs text-gray-500 mb-10">Images illustrate the types of work we build.</p>
              <div className="text-center bg-fann-charcoal-light border border-white/10 p-10 rounded-lg">
                <h2 className="text-2xl font-serif font-bold text-white mb-3">Planning a project?</h2>
                <p className="text-gray-400 mb-6">Tell us about your event or space and we will discuss the right approach.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact" className="bg-fann-gold text-black font-bold px-8 py-3 rounded-full hover:opacity-90 transition">Start a conversation</Link>
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
