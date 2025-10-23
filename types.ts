import type React from 'react';

// By defining custom element types in a global declaration, we can use them in JSX
// without TypeScript errors.

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

declare global {
  namespace JSX {
    // FIX: This declaration augments the global JSX namespace to include the custom <model-viewer> element.
    // The previous implementation was overwriting the default HTML element types, causing compilation errors.
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        ar?: boolean;
        'shadow-intensity'?: string;
      };
    }
  }
}
