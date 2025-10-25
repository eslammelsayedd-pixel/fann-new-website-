import React from 'react';

// Augment the global JSX namespace to include the 'model-viewer' custom element.
// This is done within a module, so `declare global` is required. Using an
// interface for IntrinsicElements ensures it merges with React's base types
// instead of overwriting them, which fixes errors like "Property 'div' does not exist".
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & {
                src?: string;
                alt?: string;
                'camera-controls'?: boolean;
                'auto-rotate'?: boolean;
                ar?: boolean;
                'shadow-intensity'?: string;
                exposure?: string;
                'environment-image'?: string;
            };
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
