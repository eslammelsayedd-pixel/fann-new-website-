import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import page from '../../data/abuDhabiStandPage.json';
const path='/exhibition-stands-abu-dhabi';
const breadcrumbs=[{name:'Home',path:'/'},{name:'Services',path:'/services'},{name:'Exhibition Stands Abu Dhabi',path}];
const schema={'@context':'https://schema.org','@graph':[{'@type':'Service',name:page.heading,serviceType:'Exhibition Stand Design and Build',description:page.description,url:'https://fann.ae'+path,provider:{'@type':'Organization',name:'FANN',url:'https://fann.ae'},areaServed:{'@type':'City',name:'Abu Dhabi'}},{'@type':'BreadcrumbList',itemListElement:breadcrumbs.map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:'https://fann.ae'+x.path}))},{'@type':'FAQPage',mainEntity:page.faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}]};
const ExhibitionStandsAbuDhabiPage: React.FC=()=> <AnimatedPage><SEO title={page.title} description={page.description} schema={schema}/><ServicePageLayout heroImage="/images/site/workshop-carpentry.webp" heroAltText="Joinery work in the FANN workshop" pageTitle={page.heading} pageDescription="Dubai office, Umm Al Quwain workshop, and a scope planned for your actual show." heroAction={{label:'Share your stand brief',path:'/exhibition-stand-quote'}} breadcrumbs={breadcrumbs}>
<p className="lead">{page.intro}</p>{page.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2><p>{s.text}</p></section>)}
<h2>Prepare the design brief</h2><p>Explore our <Link to="/exhibition-stand-design-abu-dhabi">Abu Dhabi exhibition stand design guide</Link> for layout choices and documented Dubai references, or browse the <Link to="/portfolio">project portfolio</Link>.</p>
<div className="not-prose my-8"><Link to="/exhibition-stand-quote" className="inline-flex min-h-[48px] items-center rounded-full bg-fann-gold text-black font-bold px-7 py-3">Share your stand brief</Link></div><FaqAccordion faqs={page.faqs}/>
<p>Exhibiting in Dubai? See our <Link to="/services/custom-exhibition-stands-dubai">Dubai stand design and build service</Link>.</p>
</ServicePageLayout></AnimatedPage>;
export default ExhibitionStandsAbuDhabiPage;
