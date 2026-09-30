import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import fitOutReferences from '../data/fitOutReferences.json';

const FitOutReferencePage: React.FC = () => {
  const { referenceSlug } = useParams<{ referenceSlug: string }>();
  const item = fitOutReferences.find(reference => reference.slug === `fit-out/${referenceSlug}`);
  if (!item) return <Navigate to="/portfolio" replace />;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.name,
    description: item.description,
    url: `https://fann.ae/portfolio/${item.slug}`,
    image: item.images,
    about: item.sector,
    dateCreated: item.year,
    contentLocation: { '@type': 'Place', name: item.emirate },
  };

  return <main className="min-h-screen bg-fann-charcoal text-white pt-32 pb-48 md:pb-24">
    <SEO title={`${item.name} | ${item.emirate} Fit-Out Project`} description={item.description} schema={schema} />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      <Link to="/portfolio#fit-out-references" className="inline-flex items-center gap-2 text-fann-gold hover:underline mb-10"><ArrowLeft size={17} /> Back to portfolio</Link>
      <p className="text-fann-gold uppercase tracking-[0.18em] text-xs font-bold mb-4">Interior fit-out & renovation · Completed project</p>
      <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8">{item.name}</h1>
      <img src={item.images[0]} alt={`${item.name}, ${item.emirate}`} width="1440" height="960" className="w-full max-h-[70vh] object-contain bg-black/20 rounded-lg mb-8" fetchPriority="high" />
      <div className="grid sm:grid-cols-3 gap-4 border-y border-white/15 py-7 mb-12">
        <div><p className="text-gray-400 text-sm mb-1">Location</p><p className="font-medium">{item.emirate}, UAE</p></div>
        <div><p className="text-gray-400 text-sm mb-1">Sector</p><p className="font-medium">{item.sector}</p></div>
        <div><p className="text-gray-400 text-sm mb-1">Year</p><p className="font-medium">{item.year}</p></div>
      </div>
      <section className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-serif font-bold mb-5">Project overview</h2>
        <p className="text-lg text-gray-300 leading-relaxed">{item.description}</p>
        {item.area && <p className="text-gray-400 mt-5">Area: {item.area} sq ft.</p>}
      </section>
      <section aria-labelledby="gallery-title" className="mt-12"><h2 id="gallery-title" className="text-2xl md:text-3xl font-serif mb-6">Project photography</h2><div className="grid md:grid-cols-2 gap-4">{item.images.map((image, index) => <a href={image} target="_blank" rel="noopener noreferrer" key={`${image}-${index}`} className="block bg-black/20 rounded-lg overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-fann-gold" aria-label={`Open ${item.name} photo ${index + 1}`}><img src={image} alt={`${item.name}, ${item.emirate} - photo ${index + 1}`} loading="lazy" decoding="async" width="1200" height="900" className="w-full h-auto" /></a>)}</div></section>
      <div className="border-t border-white/15 mt-16 pt-10 flex flex-wrap gap-5 items-center">
        <Link to="/portfolio#fit-out-references" className="inline-flex items-center gap-2 text-fann-gold hover:underline">Explore more projects <ArrowRight size={17} /></Link>
        <Link to="/contact" className="inline-flex items-center rounded-full bg-fann-gold text-black font-bold px-6 py-3 hover:opacity-90">Discuss a fit-out project</Link>
      </div>
    </div>
  </main>;
};

export default FitOutReferencePage;
