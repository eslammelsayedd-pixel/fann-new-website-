import React from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import articles from '../data/articles.json';
export default function InsightsPage(){
 const [params]=useSearchParams();
 if(params.get('article')==='how-to-choose-exhibition-stand-builder-dubai') return <Navigate to="/how-to-choose-exhibition-stand-builder-dubai" replace/>;
 if(params.has('topic')) return <Navigate to="/insights" replace/>;
 const guides=articles.filter(a=>a.lang!=='ar');
 return <><SEO title="Exhibition & Event Guides for Dubai" description="Practical guides on exhibition stands, event setup and fit-out in Dubai and Abu Dhabi: scope, venues and choosing a contractor." noindex/><main className="bg-fann-charcoal text-white pt-32 pb-24"><div className="max-w-5xl mx-auto px-6"><h1 className="font-serif text-4xl sm:text-5xl text-fann-gold mb-6">Insights &amp; Guides</h1><p className="text-gray-300 text-lg mb-10">Practical exhibition planning guides. Confirm the scope and current exhibitor manual for your show.</p><div className="grid md:grid-cols-2 gap-8">{guides.map(g=><Link key={g.path} to={g.path} className="block border border-white/15 rounded-lg overflow-hidden hover:border-fann-gold"><img src={g.hero.src} alt={g.hero.alt} className="w-full h-56 object-cover"/><div className="p-6"><h2 className="text-xl font-semibold text-fann-gold mb-3">{g.title}</h2><p className="text-gray-300 leading-relaxed">{g.description}</p></div></Link>)}</div></div></main></>;
}
