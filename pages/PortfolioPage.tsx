
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { projects } from '../constants';
import portfolioGallery from '../data/portfolioGallery.json';
import SEO from '../components/SEO';
import { ArrowRight } from 'lucide-react';

import fitOutReferences from '../data/fitOutReferences.json';

const adipecBuildUpPhotos = [{"src": "/images/1-adipec-2026-falcor-build-up.webp", "caption": "FALCOR - ADIPEC 2026 build-up", "width": 1200, "height": 1600}, {"src": "/images/2-adipec-2026-oilserv-build-up-front.webp", "caption": "OILSERV - ADIPEC 2026 build-up, front view", "width": 1600, "height": 1200}, {"src": "/images/3-adipec-2026-oilserv-build-up-fins.webp", "caption": "OILSERV - ADIPEC 2026 build-up, illuminated fins", "width": 1200, "height": 1600}, {"src": "/images/4-adipec-2026-mitsubishi-build-up-installation.webp", "caption": "Mitsubishi Heavy Industries - ADIPEC 2026 build-up, installation view", "width": 1200, "height": 1600}, {"src": "/images/5-adipec-2026-mitsubishi-build-up-led.webp", "caption": "Mitsubishi Heavy Industries - ADIPEC 2026 build-up, LED column", "width": 1200, "height": 1600}];

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
  const [galleryCategory, setGalleryCategory] = useState('All');
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
  const galleryCategories = Array.from(new Set(portfolioGallery.map(photo => photo.category)));
  const galleryPhotos = portfolioGallery.filter(photo => galleryCategory === 'All' || photo.category === galleryCategory);
  return (
    <AnimatedPage>
      <SEO
        title="FANN Portfolio | UAE Fit-Out, Exhibitions & Events"
        description="Explore real FANN projects across Dubai, Abu Dhabi and Ras Al Khaimah, with project photography, sectors, areas and completion years."
        schema={portfolioPageSchema}
      />
      <div className="portfolio-surface min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section id="adipec-2026" className="max-w-6xl mx-auto mb-16" aria-labelledby="adipec-2026-title">
            <h2 id="adipec-2026-title" className="text-3xl md:text-4xl font-serif font-bold text-fann-gold mb-4">ADIPEC 2026 - stand build-up</h2>
            <p className="portfolio-body mb-6">FANN stand builds for FALCOR, OILSERV and Mitsubishi Heavy Industries at ADIPEC 2026. These five photographs show installation in progress, not finished stands or handover.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{adipecBuildUpPhotos.map(photo => <figure key={photo.src} className="rounded-lg bg-fann-charcoal-light border border-white/10 overflow-hidden">
              <a href={photo.src} target="_blank" rel="noopener noreferrer" className="block p-2"><img src={photo.src} alt={photo.caption} width={photo.width} height={photo.height} loading="lazy" decoding="async" className="w-full h-auto"/></a>
              <figcaption className="p-4 text-sm portfolio-body">{photo.caption}<span className="block mt-2 text-xs portfolio-muted">Installation in progress. Open photo for full size.</span></figcaption>
            </figure>)}</div>
          </section>
          <section id="fit-out-references" className="max-w-6xl mx-auto mb-20" aria-labelledby="portfolio-title">
            <div className="max-w-3xl mb-8">
              <h1 id="portfolio-title" className="text-4xl md:text-5xl font-serif font-bold text-fann-gold mb-4">Portfolio</h1>
              <p className="portfolio-body">Fit-out, exhibitions and events across the UAE. Explore our project photography and details.</p>
            </div>
            
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
          <section id="project-photo-gallery" className="max-w-6xl mx-auto mb-20" aria-labelledby="gallery-title">
            <h2 id="gallery-title" className="text-3xl md:text-4xl font-serif font-bold text-fann-gold mb-4">Project photo gallery</h2>
            <p className="portfolio-body mb-3">Photographs from the FANN project archive, grouped by type of work. These are individual photographs of delivered work, not separate projects: several photographs can show the same installation.</p>
            <p className="portfolio-body mb-8">Signage and branding visible in some photographs belongs to the clients and events shown.</p>
            <div className="flex flex-wrap gap-3 mb-8" role="group" aria-label="Filter gallery by type of work">
              {['All', ...galleryCategories].map(category => <button key={category} type="button" onClick={() => setGalleryCategory(category)} aria-pressed={galleryCategory === category} className={`px-4 py-2 rounded-full text-sm border transition ${galleryCategory === category ? 'bg-fann-gold text-black border-fann-gold font-semibold' : 'bg-fann-charcoal-light text-white border-white/25 hover:border-fann-gold'}`}>{category} {category === 'All' ? portfolioGallery.length : portfolioGallery.filter(photo => photo.category === category).length}</button>)}
            </div>
            <p role="status" className="text-sm portfolio-muted mb-5">{galleryPhotos.length} photographs</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryPhotos.map(photo => <figure key={photo.src} className="rounded-lg bg-fann-charcoal-light border border-white/10 overflow-hidden">
                <div className="p-2 flex items-center justify-center"><img src={photo.src} alt={`${photo.caption} - ${photo.category}, FANN project archive photograph`} loading="lazy" decoding="async" width={photo.width} height={photo.height} className="max-w-full h-auto mx-auto"/></div>
                <figcaption className="px-3 pb-3"><span className="block text-xs text-white leading-snug">{photo.caption}</span><span className="block text-xs portfolio-muted mt-1">{photo.category}</span></figcaption>
              </figure>)}
            </div>
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
