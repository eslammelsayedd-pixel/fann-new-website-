import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import page from '../../data/turnkeyPage.json';

const path = '/services/turnkey-exhibition-services-uae';
const breadcrumbs = [{name:'Home',path:'/'},{name:'Services',path:'/services'},{name:page.heading,path}];
const schema = {'@context':'https://schema.org','@graph':[
 {'@type':'Service',name:page.heading,description:page.intro,serviceType:'Turnkey exhibition services',provider:{'@type':'Organization',name:'FANN'},areaServed:{'@type':'Country',name:'United Arab Emirates'}},
 {'@type':'BreadcrumbList',itemListElement:breadcrumbs.map((b,i)=>({'@type':'ListItem',position:i+1,name:b.name,item:'https://fann.ae'+b.path}))},
 {'@type':'FAQPage',mainEntity:page.faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}
]};
const TurnkeyServicesPage: React.FC = () => <AnimatedPage>
 <SEO title={page.title} description={page.description} schema={schema}/>
 <ServicePageLayout heroImage="/images/stands/7-dubai-properties-cityscape.webp" heroAltText="Existing exhibition stand photograph from FANN's portfolio, not a project-management or workshop photograph." pageTitle={page.heading} pageDescription={page.intro} breadcrumbs={breadcrumbs} heroAction={{label:'Request a scoped proposal',path:'/exhibition-stand-quote'}}>
  <h2>Agree the responsibilities before the build</h2>
  <p>Use the same scope checklist for every proposal. One coordinated project still needs clear decisions about who designs, supplies, orders, approves and hands over each part.</p>
  {page.sections.map(s=><section key={s.heading}><h2>{s.heading}</h2><p>{s.text}</p>{s.items && <ul>{s.items.map(item=><li key={item}>{item}</li>)}</ul>}</section>)}
  <div className="not-prose border border-fann-gold/40 p-6 my-10 rounded-lg"><h2 className="text-2xl font-serif text-fann-gold mb-4">Send the allocation and current manual</h2><p className="mb-5">Add your products, visitor activities, brand files and actual submission and installation dates. Ask for an itemised proposal with responsibilities and exclusions.</p><Link to="/exhibition-stand-quote" className="inline-flex min-h-[48px] items-center rounded-full bg-fann-gold px-6 py-3 font-bold text-black">Request a scoped proposal</Link></div>
  <FaqAccordion faqs={page.faqs}/>
  <h2>Related stand planning</h2><ul><li><Link to="/services/custom-exhibition-stands-dubai">Custom stand design and build</Link></li><li><Link to="/services/exhibition-stand-fabrication-dubai">Fabrication and production release</Link></li><li><Link to="/services/modular-exhibition-systems-dubai">Discuss a modular approach</Link></li><li><Link to="/insights/exhibition-stand-brief-checklist">Stand brief checklist</Link></li></ul>
 </ServicePageLayout>
</AnimatedPage>;
export default TurnkeyServicesPage;
