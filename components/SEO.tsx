import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoMetadata } from '../seo-metadata';

const SEO: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    // Fallback to the homepage SEO data if the current path is not found
    const metadata = seoMetadata[currentPath] || seoMetadata['/'];

    if (metadata) {
      // Update Title
      document.title = metadata.title;

      // Update Meta Description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', metadata.description);

      // Update or create JSON-LD Schema
      const scriptId = 'json-ld-schema';
      let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.innerHTML = JSON.stringify(metadata.schema);
    }
    
  }, [location.pathname]);

  return null; // This component does not render anything to the DOM
};

export default SEO;
