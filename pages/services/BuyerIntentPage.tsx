import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import buyerPages from '../../data/buyerPages.json';
import { buyerPageSchema } from '../../data/buyerPageSchema.js';

const BuyerIntentPage: React.FC = () => {
 const path=useLocation().pathname.replace(/\/$/, "");
 const page=buyerPages[path as keyof typeof buyerPages];
 if(!page) return null;
 return <AnimatedPage><div className="buyer-intent-page"><style>{`.buyer-intent-page h2, .buyer-intent-page button[aria-expanded] { scroll-margin-top: 112px; }`}</style><SEO title={page.title} description={page.description} schema={buyerPageSchema(path,page)} image={'https://fann.ae'+page.hero}/>
 <ServicePageLayout heroImage={page.hero} heroAltText={page.heroAlt} pageTitle={page.heading} pageDescription="A design brief built around your products, visitor journey and actual venue allocation." heroAction={{label:page.action,path:'/exhibition-stand-quote'}} breadcrumbs={[{name:'Home',path:'/'},{name:'Services',path:'/services'},{name:'Stand design Abu Dhabi',path}]}>
 <p className="text-sm">{page.heroCaption}</p><p className="lead">{page.intro}</p>
 {page.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p>{'items' in section && section.items && <ul>{section.items.map(item=><li key={item}>{item}</li>)}</ul>}</section>)}
 <h2>Completed stands to inform your design brief</h2><p>{page.proofNote}</p>
 <div className="not-prose grid md:grid-cols-2 gap-6 my-8">{page.proof.map(proof=><article key={proof.path} className="border border-white/20 rounded-lg overflow-hidden"><Link to={proof.path}><img src={proof.image} alt={proof.name+', '+proof.location} className="w-full aspect-[4/3] object-cover" loading="lazy" width="800" height="600"/><div className="p-5"><h3 className="font-serif text-xl text-fann-gold">{proof.name}</h3><p className="text-sm mt-2">{proof.location}</p><p className="mt-3 text-base">{proof.text}</p><span className="inline-block mt-4 text-fann-gold underline">View completed stand</span></div></Link></article>)}</div>
 <div className="not-prose border border-fann-gold/40 p-6 my-10 rounded-lg"><h2 className="font-serif text-2xl text-fann-gold mb-4">Turn the design brief into a scoped proposal</h2><p className="mb-5">Share the show, dimensions, open sides, products and deadlines. Add your floor plan if available.</p><Link to="/exhibition-stand-quote" className="inline-flex min-h-[48px] items-center rounded-full bg-fann-gold text-black font-bold px-6 py-3">{page.action}</Link></div>
 <FaqAccordion faqs={page.faqs}/>
 <h2>Continue planning your exhibition stand</h2><ul>{page.related.map(link=><li key={link.path}><Link to={link.path}>{link.label}</Link></li>)}</ul>
 <h2>Venue planning source</h2>{page.sources.map(source=><p key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a><br/>{source.note}</p>)}
 </ServicePageLayout></div></AnimatedPage>;
};
export default BuyerIntentPage;
