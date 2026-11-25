import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import page from '../data/workshopPage.json';

export default function WorkshopPage() {
  return <>
    <SEO title={page.title} description={page.description} image="https://fann.ae/images/workshop/entrance.webp" schema={{'@context':'https://schema.org','@type':'AboutPage',name:page.heading,url:'https://fann.ae/our-workshop',about:{'@type':'Organization','@id':'https://fann.ae',name:'FANN'}}} />
    <main className="bg-fann-charcoal text-white pt-32 pb-24">
      <div className="container mx-auto px-5 sm:px-8 max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-10"><Link to="/">Home</Link><span className="mx-3">/</span><Link to="/about">About FANN</Link><span className="mx-3">/</span><span className="text-fann-gold">Our workshop</span></nav>
        <header className="max-w-4xl mb-12"><p className="uppercase tracking-[0.2em] text-fann-gold text-xs mb-5">Inside FANN</p><h1 className="font-serif text-4xl sm:text-6xl leading-tight mb-7">{page.heading}</h1><p className="text-xl text-gray-200 leading-relaxed">{page.intro}</p></header>
        <figure className="mb-12"><img src="/images/workshop/entrance.webp" alt="FANN-branded workshop entrance with workbenches and materials visible inside" width="1429" height="804" className="w-full h-auto rounded-sm" fetchPriority="high"/><figcaption className="text-sm text-gray-400 mt-3">FANN workshop, Umm Al Quwain.</figcaption></figure>
        <section className="grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-16 py-10 border-t border-white/15"><h2 className="font-serif text-3xl sm:text-4xl">{page.galleryHeading}</h2><div className="space-y-5 text-gray-300 leading-relaxed"><p>{page.evidence}</p><p>{page.galleryIntro}</p></div></section>
        <section aria-label="Workshop photographs" className="grid md:grid-cols-2 gap-7 mb-12">
          <figure><img src="/images/workshop/production.webp" alt="Open FANN workshop entrance with sheet materials and assembly components" width="1429" height="804" loading="lazy" className="w-full h-auto rounded-sm"/><figcaption className="text-sm text-gray-400 mt-3">Production space and materials.</figcaption></figure>
          <figure><img src="/images/workshop/printing.webp" alt="Large-format printing equipment inside the FANN workshop" width="1024" height="576" loading="lazy" className="w-full h-auto rounded-sm"/><figcaption className="text-sm text-gray-400 mt-3">Large-format printing equipment.</figcaption></figure>
        </section>
        <section className="border border-fann-gold/40 bg-white/[0.02] p-7 sm:p-12"><h2 className="font-serif text-3xl sm:text-4xl mb-4">{page.ctaHeading}</h2><p className="text-gray-300 mb-7 leading-relaxed">{page.ctaText}</p><Link className="inline-flex items-center justify-center bg-fann-gold text-fann-charcoal font-semibold px-7 py-4 min-h-[48px] rounded-sm" to="/exhibition-stand-quote">Talk to FANN</Link><div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-sm text-gray-300"><Link className="underline underline-offset-4" to="/services/custom-exhibition-stands-dubai">Stand design and build</Link><Link className="underline underline-offset-4" to="/services/exhibition-stand-fabrication-dubai">Stand fabrication</Link><Link className="underline underline-offset-4" to="/about">About FANN</Link></div></section>
      </div>
    </main>
  </>;
}
