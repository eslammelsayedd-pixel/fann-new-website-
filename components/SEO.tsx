import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  schema?: object; // Add schema prop
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({ title, description, schema, children }) => {
  useEffect(() => {
    const fullTitle = `${title} | FANN`;
    if (document.title !== fullTitle) {
      document.title = fullTitle;
    }
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Handle Schema Markup
    const scriptId = 'json-ld-schema';
    // FIX: Add type assertion to ensure TypeScript knows this is an HTMLScriptElement.
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
      // If no schema is provided on a page, remove the old one
      scriptTag.remove();
    }
    
  }, [title, description, schema]);

  // Children are passed through, but this component doesn't render them directly.
  // It's used for injecting script tags into the document head.
  return <>{children}</>; 
};

export default SEO;