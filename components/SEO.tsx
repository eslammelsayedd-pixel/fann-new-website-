import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteMetadata } from '../seo-metadata';

// Define a type for our metadata structure
interface PageMetadata {
  seoTitle: string;
  metaDescription: string;
  jsonLdSchema: string;
}

const SEO: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Type assertion for the imported metadata
  const metadataMap: Record<string, PageMetadata> = siteMetadata;

  // Find metadata for the current path, provide fallbacks
  const metadata = metadataMap[path] || {
    seoTitle: 'Exhibition, Events & Interior Design',
    metaDescription: 'FANN is a premier exhibition, events, and interior design company in Dubai, transforming visions into unforgettable experiences.',
    jsonLdSchema: '{}',
  };

  useEffect(() => {
    const fullTitle = `${metadata.seoTitle} | FANN`;
    if (document.title !== fullTitle) {
      document.title = fullTitle;
    }
    
    let metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (!metaDescriptionTag) {
      metaDescriptionTag = document.createElement('meta');
      metaDescriptionTag.setAttribute('name', 'description');
      document.head.appendChild(metaDescriptionTag);
    }
    metaDescriptionTag.setAttribute('content', metadata.metaDescription);

    const scriptId = 'json-ld-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    try {
        const schemaObject = JSON.parse(metadata.jsonLdSchema);
        if (Object.keys(schemaObject).length > 0) {
            if (!scriptTag) {
                scriptTag = document.createElement('script');
                scriptTag.id = scriptId;
                scriptTag.type = 'application/ld+json';
                document.head.appendChild(scriptTag);
            }
            scriptTag.innerHTML = JSON.stringify(schemaObject);
        } else if (scriptTag) {
            scriptTag.remove();
        }
    } catch (e) {
        console.warn(`Could not parse JSON-LD schema for path: ${path}`, e);
        if (scriptTag) {
            scriptTag.remove();
        }
    }
    
  }, [path, metadata]);

  // This component only manages the document head, so it renders nothing.
  return null;
};

export default SEO;