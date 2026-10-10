
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { projects } from '../constants';
import SEO from '../components/SEO';
import { ArrowRight } from 'lucide-react';

import fitOutReferences from '../data/fitOutReferences.json';

const portfolioPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "FANN Portfolio | Exhibitions, Events & Interior Design Projects",
    "description": "Explore FANN's diverse portfolio of successful projects in exhibitions, events, and interior design across various industries in Dubai and the GCC.",
    "url": "https://fann.ae/portfolio",
    "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": projects.length + fitOutReferences.length,
        "itemListElement": [...projects.map((project, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "CreativeWork",
                "name": project.title,
                "url": `https://fann.ae/portfolio/${project.slug}`,
                "image": project.image,
                "disambiguatingDescription": `${project.category} for ${project.client} ${project.year ? `(${project.year})` : ''} - ${project.industry} industry.`
            }
        })), ...fitOutReferences.map((item, index) => ({
            "@type": "ListItem",
            "position": projects.length + index + 1,
            "item": {
                "@type": "CreativeWork",
                "name": item.name,
                "url": `https://fann.ae/portfolio/${item.slug}`,
                "description": item.description, "image": item.images[0]
            }
        }))]
    }
};

const PortfolioPage: React.FC = () => {
  const [emirate, setEmirate] = useState('All');
  const [sector, setSector] = useState('All');
  const [projectType, setProjectType] = useState('All');
  const allProjects = [
    ...fitOutReferences.map(item => ({ ...item, projectType: 'Fit-out & renovation', location: item.emirate, photoCount: item.images.length, cover: item.images[0], showDescription: false })),
    ...projects.map(project => ({
      id: `event-${project.id}`, name: project.title, slug: project.slug,
      sector: project.industry, emirate: project.location.includes('Abu Dhabi') ? 'Abu Dhabi' : project.location.includes('Dubai') ? 'Dubai' : 'UAE',
      location: project.location, area: null, year: project.year ? String(project.year) : '',
      description: project.description, projectType: 'Events & exhibitions',
      cover: project.image, photoCount: project.gallery?.length || 1, showDescription: true,
    })),
  ].sort((a, b) => Number(b.year) - Number(a.year));
  const entries = allProjects.filter(item => (emirate === 'All' || item.emirate === emirate) && (sector === 'All' || item.sector === sector) && (projectType === 'All' || item.projectType === projectType));
  const sectors = Array.from(new Set(allProjects.map(item => item.sector))).sort();
  return (
    <AnimatedPage>
      <SEO
        title="FANN Portfolio | UAE Fit-Out, Exhibitions & Events"
        description="Explore real FANN projects across Dubai, Abu Dhabi and Ras Al Khaimah, with project photography, sectors, areas and completion years."
        schema={portfolioPageSchema}
      />
      <div className="portfolio-surface min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section id="fit-out-references" className="max-w-6xl mx-auto mb-20" aria-labelledby="portfolio-title">
            <div className="max-w-3xl mb-8">
              <h1 id="portfolio-title" className="text-4xl md:text-5xl font-serif font-bold text-fann-gold mb-4">Portfolio</h1>
              <p className="portfolio-body">Fit-out, exhibitions and events across the UAE. Explore our project photography and details.</p>
            </div>
            <p className="portfolio-body mb-8">Use completed stands to brief your next design: <Link to="/exhibition-stand-design-abu-dhabi" className="text-fann-gold underline underline-offset-4">exhibition stand design in Abu Dhabi</Link>, with layout choices and the scope to confirm before production.</p>
<p className="portfolio-body mb-8">Preparing a healthcare site brief? See our <Link to="/medical-centre-fit-out-dubai" className="text-fann-gold underline underline-offset-4">medical centre fit-out Dubai guide</Link>, with healthcare gallery references and a room-by-room scope checklist.</p>
            <div className="flex flex-wrap gap-4 mb-8">
              <label className="text-sm portfolio-body">Project type<select value={projectType} onChange={e => setProjectType(e.target.value)} className="block mt-2 bg-fann-charcoal-light border border-white/25 rounded px-3 py-3 text-white"><option>All</option><option>Fit-out &amp; renovation</option><option>Events &amp; exhibitions</option></select></label>
              <label className="text-sm portfolio-body">Emirate<select value={emirate} onChange={e => setEmirate(e.target.value)} className="block mt-2 bg-fann-charcoal-light border border-white/25 rounded px-3 py-3 text-white"><option>All</option>{Array.from(new Set(allProjects.map(item => item.emirate))).map(value => <option key={value}>{value}</option>)}</select></label>
              <label className="text-sm portfolio-body">Sector<select value={sector} onChange={e => setSector(e.target.value)} className="block mt-2 bg-fann-charcoal-light border border-white/25 rounded px-3 py-3 text-white"><option>All</option>{sectors.map(value => <option key={value}>{value}</option>)}</select></label>
            </div>
            <p role="status" className="text-sm portfolio-muted mb-5">{entries.length} projects</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.map(item => <Link key={item.slug} to={`/portfolio/${item.slug}`} className="group block rounded-lg bg-fann-charcoal-light border border-white/10 overflow-hidden hover:border-fann-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-fann-gold transition">
                <div className="aspect-[4/3] relative overflow-hidden"><img src={item.cover} alt={`${item.name}, ${item.emirate}`} loading="lazy" decoding="async" width="800" height="600" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"/><span style={{ color: '#fff', background: 'rgba(0,0,0,0.75)' }} className="absolute bottom-3 right-3 px-2 py-1 text-xs rounded">{item.photoCount} {item.photoCount === 1 ? 'photo' : 'photos'}</span></div>
                <div className="p-5"><p className="text-xs uppercase tracking-wide text-fann-gold mb-2">{item.sector}</p><h3 className="text-xl font-serif text-white font-bold leading-snug">{item.name}</h3><p className="text-sm portfolio-muted mt-3">{item.location}{item.year ? ` · ${item.year}` : ''}</p>{item.projectType === 'Fit-out & renovation' && <p className="text-sm portfolio-muted mt-1">{item.area ? `Approx. ${item.area} sq ft` : 'Area not disclosed'}</p>}{item.showDescription && <p className="text-sm portfolio-muted mt-3">{item.description}</p>}<span className="inline-flex items-center gap-2 text-fann-gold text-sm font-semibold mt-4 group-hover:underline">View project <ArrowRight size={15} aria-hidden="true" /></span></div>
              </Link>)}
            </div>
            {!entries.length && <p className="portfolio-body py-10">No projects match these filters. Choose another emirate or sector.</p>}
          </section>
          <section className="max-w-6xl mx-auto text-center bg-fann-charcoal-light border border-white/10 p-8 md:p-12 rounded-lg">
            <h2 className="text-3xl font-serif text-white mb-4">Planning your next space?</h2><p className="portfolio-muted mb-6">Tell us about your project and we will discuss the scope, design and build.</p><Link to="/contact" className="inline-block bg-fann-gold text-black font-bold px-8 py-3 rounded-full">Discuss your project</Link>
          </section>



        </div>
      </div>
    </AnimatedPage>
  );
};

export default PortfolioPage;
