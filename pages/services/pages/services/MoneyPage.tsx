import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import HeardAboutField from '../../components/HeardAboutField';
import AttributionFields from '../../components/AttributionFields';
import PhoneInput from '../../components/PhoneInput';
import { submitLead } from '../../lib/submitLead';
import { validateLeadPhone, isWorkEmail, WORK_EMAIL_ERROR } from '../../lib/leadValidation';
import pages from '../../data/moneyPages26Nov.json';
const field='mt-2 w-full rounded-md border border-white/20 bg-black/20 p-3 text-inherit';
function Enquiry({heading}:{heading:string}) {
 const [busy,setBusy]=useState(false),[sent,setSent]=useState(false),[error,setError]=useState('');
 async function send(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();const data=new FormData(e.currentTarget);setError('');
  const value=(key:string)=>String(data.get(key)||'');
  const phoneError=validateLeadPhone(value('phone'),value('phoneCountry')||'AE');
  if(phoneError){setError(phoneError);return;}if(!isWorkEmail(value('email'))){setError(WORK_EMAIL_ERROR);return;}
  setBusy(true);try{await submitLead({formType:'Service page enquiry',name:value('name'),email:value('email'),phone:value('phone'),phoneCountry:value('phoneCountry')||'AE',message:value('message'),website:value('website'),details:{service:heading,heardAbout:value('heardAbout'),heardAboutOther:value('heardAbout')==='Other'?value('heardAboutOther'):''}});setSent(true);}catch(e:any){setError(e.message||'Your enquiry could not be sent. Please try again.');}finally{setBusy(false);}
 }
 return <section id="project-enquiry" className="not-prose my-12 rounded-xl border border-fann-gold/40 p-5 md:p-8 scroll-mt-28" aria-labelledby="project-enquiry-title"><h2 id="project-enquiry-title" className="font-serif text-3xl text-fann-gold mb-4">Tell us about your project</h2>{sent?<p role="status">Thank you. Your enquiry has been sent to FANN.</p>:<form onSubmit={send} className="space-y-4"><AttributionFields/><label className="block">Your name<input className={field} name="name" autoComplete="name" required/></label><label className="block">Work email<input className={field} name="email" type="email" autoComplete="email" required/></label><div><label htmlFor="money-phone">Phone</label><PhoneInput name="phone" required className={field}/></div><HeardAboutField inputClass={field}/><label className="block">Project brief<textarea className={field} name="message" rows={5} required placeholder="Location, size, work needed and target date"/></label><div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>{error&&<p role="alert" className="text-red-500">{error}</p>}<button disabled={busy} className="min-h-[48px] rounded-full bg-fann-gold px-7 py-3 font-bold text-black disabled:opacity-60" type="submit">{busy?'Sending...':'Send project enquiry'}</button><p className="text-sm opacity-80">By sending, you agree to FANN's <Link to="/privacy" className="underline">privacy policy</Link>.</p></form>}</section>;
}
export default function MoneyPage(){
 const path=useLocation().pathname.replace(/\/$/,'');const page:any=pages[path as keyof typeof pages];if(!page)return null;
 const schema={'@context':'https://schema.org','@graph':[{'@type':path.includes('-vs-')?'WebPage':'Service',name:page.heading,description:page.description,url:'https://fann.ae'+path,provider:{'@type':'Organization',name:'FANN',url:'https://fann.ae'}},{'@type':'FAQPage',mainEntity:page.faqs.map((x:any)=>({'@type':'Question',name:x.question,acceptedAnswer:{'@type':'Answer',text:x.answer}}))}]};
 return <AnimatedPage><SEO title={page.title} description={page.description} schema={schema} image={'https://fann.ae'+page.hero}/><ServicePageLayout heroImage={page.hero} heroAltText={page.heroAlt||page.heading} pageTitle={page.heading} pageDescription={page.subheading} heroAction={{label:page.action,path:'#project-enquiry'}} breadcrumbs={[{name:'Home',path:'/'},{name:'Services',path:'/services'},{name:page.heading,path}]}>
 {page.heroCaption&&<p className="text-sm">{page.heroCaption}</p>}
 {page.sections.map((x:any)=><section key={x.heading}><h2>{x.heading}</h2><p>{x.text}</p>{x.items&&<ul>{x.items.map((i:string)=><li key={i}>{i}</li>)}</ul>}</section>)}
 {!!page.proof.length&&<><h2>{page.proofHeading||'From our project portfolio'}</h2>{page.proofNote&&<p>{page.proofNote}</p>}<div className="not-prose grid md:grid-cols-2 gap-6 my-8">{page.proof.map((x:any)=><figure key={x.path} className="overflow-hidden rounded-lg border border-white/15"><Link to={x.path}><img src={x.image} alt={x.name+', '+x.location} loading="lazy" width="1200" height="800" className="aspect-[3/2] w-full object-cover"/><figcaption className="p-5"><h3 className="font-serif text-xl text-fann-gold">{x.name}</h3><p className="text-sm mt-2">{x.location}</p><p className="text-sm mt-3">{x.text}</p><span className="inline-block mt-4 underline text-fann-gold">View project photographs</span></figcaption></Link></figure>)}</div></>}
 <FaqAccordion faqs={page.faqs}/><Enquiry heading={page.heading}/><h2>Continue planning</h2><ul>{page.related.map((x:any)=><li key={x.path}><Link to={x.path}>{x.label}</Link></li>)}</ul>
 </ServicePageLayout></AnimatedPage>;
}
