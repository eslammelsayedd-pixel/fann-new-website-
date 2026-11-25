import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoLanguage } from '../utils/seoLanguage';

interface SEOProps {
  title: string;
  description: string;
  schema?: object;
  image?: string;
  noindex?: boolean;
  children?: React.ReactNode;
}

const SITE = 'https://fann.ae';
const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

const SEO: React.FC<SEOProps> = ({ title, description, schema, image, noindex, children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const base = title.replace(/(\s*\|\s*FANN)+\s*$/i, '').trim();
    const fullTitle = base.toUpperCase() === 'FANN' ? 'FANN' : `${base} | FANN`;
    if (document.title !== fullTitle) document.title = fullTitle;

    const url = `${SITE}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;
    const language = getSeoLanguage(pathname);
    document.documentElement.lang = language.lang;
    document.head.querySelectorAll('link[data-fann-language-alternate]').forEach(el => el.remove());
    for (const [lang, path] of language.alternates) {
      const alternate = document.createElement('link');
      alternate.rel = 'alternate'; alternate.hreflang = lang; alternate.href = SITE + path;
      alternate.setAttribute('data-fann-language-alternate', 'true'); document.head.appendChild(alternate);
    }

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image || DEFAULT_IMAGE);
    document.head.querySelectorAll('meta[property^="twitter:"]').forEach(el => el.remove());
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:url', url);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image || DEFAULT_IMAGE);

    const scriptId = 'json-ld-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      let output:any=schema;
      if (['/about','/exhibition-stand-builders-dubai','/how-to-choose-exhibition-stand-builder-dubai'].includes(pathname)) {
        output=JSON.parse(JSON.stringify(schema));
        if (!output['@graph']) output={'@context':'https://schema.org','@graph':[output]};
        let faq=output['@graph'].find((x:any)=>x['@type']==='FAQPage');
        if(!faq){faq={'@type':'FAQPage',mainEntity:[]};output['@graph'].push(faq)}
        faq.mainEntity.push({'@type':'Question',name:'Is FANN certified?',acceptedAnswer:{'@type':'Answer',text: "Yes. FANN holds ISO 20121 certification for event sustainability management and is a member of IFES, the International Federation of Exhibition and Event Services, alongside its own workshop in Umm Al Quwain, Dubai licence 993770 and stand design and build work across the UAE."}});
      }
      scriptTag.innerHTML = JSON.stringify(output);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, schema, image, noindex, pathname]);

  return <>{children}</>;
};

export default SEO;

export const FannCredentials = () => (<section aria-labelledby="fann-credentials-title" className="my-10 border border-fann-gold/40 p-6 text-white"><h2 id="fann-credentials-title" className="font-serif text-2xl text-fann-gold mb-5">Certification and membership</h2><p className="text-gray-300 leading-relaxed mb-6">FANN is ISO 20121 certified for event sustainability management and a member of IFES, the International Federation of Exhibition and Event Services.</p><table className="w-full text-left text-sm"><caption className="sr-only">FANN certification and membership facts</caption><tbody><tr className="border-t border-white/15"><th scope="row" className="py-4 pr-4 align-top">Certification</th><td className="py-4">ISO 20121 (event sustainability management)</td></tr><tr className="border-t border-white/15"><th scope="row" className="py-4 pr-4 align-top">Industry membership</th><td className="py-4">IFES (International Federation of Exhibition and Event Services)</td></tr></tbody></table><details className="mt-6 border-t border-white/15 pt-5"><summary className="cursor-pointer text-lg">Is FANN certified?</summary><p className="text-gray-300 leading-relaxed mt-4">Yes. FANN holds ISO 20121 certification for event sustainability management and is a member of IFES, the International Federation of Exhibition and Event Services, alongside its own workshop in Umm Al Quwain, Dubai licence 993770 and stand design and build work across the UAE.</p></details></section>);
