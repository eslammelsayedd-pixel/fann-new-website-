import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
      scriptTag.innerHTML = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, schema, image, noindex, pathname]);

  return <>{children}</>;
};

export default SEO;
