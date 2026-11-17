import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import page from '../../data/exhibitionFitOutPage.json';
const path='/services/interior-fitout-exhibition-spaces-dubai';
const breadcrumbs=[{name:'Home',path:'/'},{name:'Services',path:'/services'},{name:page.heading,path}];
const schema={'@context':'https://schema.org','@graph':[
 {'@type':'Service',name:page.heading,description:page.intro,provider:{'@type':'Organization',name:'FANN'},areaServed:{'@type':'City',name:'Dubai'}},
 {'@type':'BreadcrumbList',itemListElement:breadcrumbs.map((b,i)=>({'@type':'ListItem',position:i+1,name:b.name,item:'https://fann.ae'+b.path}))},
 {'@type':'FAQPage',mainEntity:page.faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}
]};
const FitOutPage:React.FC=()=> <AnimatedPage><SEO title={page.title} description={page.description} schema={schema}/><ServicePageLayout heroImage={page.hero} heroAltText={page.heroAlt} pageTitle={page.heading} pageDescription={page.intro} breadcrumbs={breadcrumbs} heroAction={{label:'Discuss your finishing brief',path:'/exhibition-stand-quote'}}>
<p className="text-sm">{page.caption}</p>
{page.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2><p>{s.text}</p></section>)}
<h2>Send the allocation and finish references</h2><p>Add the approved drawings, current venue manual, available installation dates, artwork and any contractor handover information. Ask for the included work, exclusions and unresolved items to be recorded in the proposal.</p>
<div className="not-prose my-8"><Link to="/exhibition-stand-quote" className="inline-flex min-h-[48px] items-center rounded-full bg-fann-gold text-black font-bold px-7 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Discuss your finishing brief</Link></div>
<FaqAccordion faqs={page.faqs}/><h2>Related project planning</h2><ul>{page.related.map(l=><li key={l.path}><Link to={l.path}>{l.label}</Link></li>)}</ul>
</ServicePageLayout></AnimatedPage>;
export default FitOutPage;
