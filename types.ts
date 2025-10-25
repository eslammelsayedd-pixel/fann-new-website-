import React from 'react';

// FIX: Corrected the global JSX type augmentation for the 'model-viewer' custom element.
// The previous implementation, while syntactically correct for declaration merging, was overwriting the IntrinsicElements interface in this project's specific TypeScript environment, removing all standard HTML elements.
// This fix explicitly extends React.JSX.IntrinsicElements to ensure all standard HTML/SVG elements are preserved while adding the custom 'model-viewer' element, thus resolving widespread JSX type errors across the application.
declare global {
    namespace JSX {
        interface IntrinsicElements extends React.JSX.IntrinsicElements {
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