// FIX: Changed `import 'react';` to `import React from 'react';` to resolve module augmentation errors
// and bring the 'React' namespace into scope for type definitions.
import React from 'react';

// FIX: Switched from module augmentation of 'react' to augmenting the global JSX namespace.
// This is a more stable approach for adding custom elements and resolves the
// "module 'react' cannot be found" compilation error.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                src?: string;
                alt?: string;
                'camera-controls'?: boolean;
                'auto-rotate'?: boolean;
                ar?: boolean;
                'shadow-intensity'?: string;
                exposure?: string;
                'environment-image'?: string;
            }, HTMLElement>;
        }
    }
}

export interface NavLink {
  name: string;
  path?: string;
  children?: {
    name: string;
    path: string;
  }[];
}

export interface Project {
  id: number;
  title: string;
  client: string;
  service: 'Exhibitions' | 'Events' | 'Interior Design';
  industry: 'Technology' | 'Healthcare' | 'Aviation' | 'Hospitality' | 'Real Estate' | 'Luxury' | 'Corporate' | 'Retail' | 'Residential' | 'Automotive' | 'Energy' | 'Finance';
  scale: 'Boutique' | 'Standard' | 'Large' | 'Mega';
  year: number;
  image: string;
  sqm: number;
  location: string;
  timeline: string;
  challenge: string;
  result: string;
}

export interface Event {
  name: string;
  date: string;
  venue: string;
  country: 'UAE' | 'KSA';
  industry: string;
}

export interface Testimonial {
  quote: string;
  client: string;
  company: string;
  projectType: string;
}