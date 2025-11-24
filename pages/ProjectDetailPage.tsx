
import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { projects } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, X, ZoomIn, Calendar, MapPin, Maximize2, Target, Zap, BarChart, Layers, User } from 'lucide-react';

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  // Find project by slug or fallback to ID for older links
  const project = projects.find(p => p.slug === slug || p.id.toString() === slug);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  // Fallback data if detailed info is missing (ensures page doesn't break for older projects)
  const gallery = project.gallery || [{ image: project.image, caption: project.title }];
  const specs = project.specs || { structure: [{ label: 'Category', value: project.category }, { label: 'Year', value: project.year.toString() }] };

  // Lightbox handlers
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = (e: React.MouseEvent) => { e.stopPropagation(); setLightboxIndex((prev) => (prev !== null ? (prev + 1) % gallery.length : 0)); };
  const prevImage = (e: React.MouseEvent) => { e.stopPropagation(); setLightboxIndex((prev) => (prev !== null ? (prev - 1 + gallery.length) % gallery.length : 0)); };

  // Schema.org Data
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.image,
    "creator": { "@type": "Organization", "name": "FANN" },
    "client": { "@type": "Organization", "name": project.client },
    "dateCreated": project.year.toString(),
    "locationCreated": { "@type": "Place", "name": project.location }
  };

  return (
    <div className="bg-fann-charcoal min-h-screen text-white">
      <SEO 
        title={`${project.client} - ${project.title} | FANN Portfolio`} 
        description={project.description}
        schema={schema}
      />

      {/* HERO SECTION */}
      <section className="relative h-[60vh] min-h-[500px] lg:h-[80vh] overflow-hidden bg-black">
        <img 
          src={project.heroImage || project.image} 
          alt={project.title} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fann-charcoal via-transparent to-black/40"></div>
        
        <div className="absolute bottom-10 left-0 w-full px-4 sm:px-8">
          <div className="container mx-auto">
            <Link to="/portfolio" className="inline-flex items-center text-sm text-gray-400 hover:text-fann-gold mb-4 transition-colors">
              <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2 max-w-4xl">{project.title}</h1>
            <p className="text-xl text-gray-300 max-w-2xl">{project.subtitle || project.description}</p>
          </div>
        </div>
      </section>

      {/* DETAILS BAR */}
      <div className="bg-fann-charcoal-light border-b border-white/10 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <DetailItem label="Client" value={project.client} />
            <DetailItem label="Location" value={project.location} />
            <DetailItem label="Year" value={project.year.toString()} />
            <DetailItem label="Category" value={project.category} />
            {project.size && <DetailItem label="Size" value={project.size} />}
            {project.industry && <DetailItem label="Industry" value={project.industry} />}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* CASE STUDY SECTIONS */}
        <div className="max-w-5xl mx-auto">
          
          {/* Challenge */}
          {project.challenge && (
            <div className="case-study-block">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-fann-gold flex items-center justify-center text-black">
                  <Target size={20} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-white">The Challenge</h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">{project.challenge.description}</p>
              {project.challenge.requirements && (
                <ul className="challenge-list">
                  {project.challenge.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Solution */}
          {project.solution && (
            <div className="case-study-block">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-fann-gold flex items-center justify-center text-black">
                  <Zap size={20} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-white">Our Solution</h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">{project.solution.description}</p>
              <div className="grid md:grid-cols-3 gap-6">
                {project.solution.highlights.map((highlight, i) => (
                  <div key={i} className="bg-fann-gold/5 border border-fann-gold/20 p-6 rounded-sm">
                    <h3 className="text-fann-gold font-bold mb-2">{highlight.title}</h3>
                    <p className="text-sm text-gray-400">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {project.results && (
            <div className="case-study-block">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-fann-gold flex items-center justify-center text-black">
                  <BarChart size={20} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-white">The Results</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {project.results.stats.map((stat, i) => (
                  <div key={i} className="text-center p-6 bg-white/5 rounded-sm border border-white/10">
                    <div className="text-3xl md:text-4xl font-bold text-fann-gold mb-2">{stat.number}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-gray-300 italic text-center">{project.results.summary}</p>
            </div>
          )}

        </div>

        {/* TECH SPECS */}
        <div className="my-20 border-t border-white/10 pt-20">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specs.structure && <SpecCard title="Structure & Build" items={specs.structure} />}
            {specs.technology && <SpecCard title="AV & Technology" items={specs.technology} />}
            {specs.materials && <SpecCard title="Materials & Finishes" items={specs.materials} />}
            {specs.timeline && <SpecCard title="Project Timeline" items={specs.timeline} />}
          </div>
        </div>

        {/* GALLERY */}
        <div className="my-20">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Project Gallery</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, i) => (
              <div 
                key={i} 
                className={`gallery-item group aspect-[4/3] ${item.featured ? 'md:col-span-2 aspect-[2/1]' : ''}`}
                onClick={() => openLightbox(i)}
              >
                <img src={item.image} alt={item.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="gallery-overlay">
                  <ZoomIn className="text-white w-10 h-10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TESTIMONIAL */}
        {project.testimonial && (
          <div className="bg-gradient-to-br from-fann-charcoal-light to-black border border-white/10 p-10 md:p-16 rounded-lg text-center max-w-4xl mx-auto my-20 relative overflow-hidden">
            <div className="text-6xl text-fann-gold/20 absolute top-4 left-8 font-serif">"</div>
            <p className="text-xl md:text-2xl text-white font-light italic leading-relaxed mb-8 relative z-10">
              {project.testimonial.quote}
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-fann-gold rounded-full flex items-center justify-center text-black font-bold text-xl">
                {project.testimonial.authorName.charAt(0)}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white">{project.testimonial.authorName}</h4>
                <p className="text-sm text-fann-gold">{project.testimonial.authorTitle}, {project.testimonial.authorCompany}</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-fann-gold rounded-lg p-12 text-center text-black my-20">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Want a Stand Like This?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Create an unforgettable exhibition presence that drives leads and showcases your brand at its best.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/contact?ref=${project.slug}`} className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-lg">
              Request Quote
            </Link>
            <Link to="/portfolio" className="border-2 border-black px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-black/10 transition-all">
              View More Projects
            </Link>
          </div>
        </div>

      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white" onClick={closeLightbox}>
              <X size={32} />
            </button>
            
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4" onClick={prevImage}>
              <ChevronLeft size={40} />
            </button>
            
            <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <motion.img 
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={gallery[lightboxIndex].image}
                alt={gallery[lightboxIndex].caption}
                className="max-w-full max-h-[85vh] object-contain mx-auto"
              />
              <p className="text-center text-gray-400 mt-4">{gallery[lightboxIndex].caption}</p>
            </div>

            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4" onClick={nextImage}>
              <ChevronRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

const DetailItem = ({ label, value }: { label: string, value: string }) => (
  <div className="text-center">
    <div className="text-[10px] font-bold uppercase tracking-widest text-fann-gold mb-1">{label}</div>
    <div className="text-white font-medium">{value}</div>
  </div>
);

const SpecCard = ({ title, items }: { title: string, items: {label: string, value: string}[] }) => (
  <div className="spec-category">
    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">{title}</h3>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="text-sm grid grid-cols-3 gap-2">
          <span className="text-fann-gold font-bold">{item.label}:</span>
          <span className="col-span-2 text-gray-300">{item.value}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ProjectDetailPage;
