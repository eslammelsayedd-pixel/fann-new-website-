import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({ title, description, children }) => {
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
    
  }, [title, description]);

  return <>{children}</>;
};

export default SEO;
