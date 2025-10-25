import React from 'react';

// FIX: Corrected the global type declaration for the custom `<model-viewer>` element.
// The previous declaration was overwriting React's default JSX element types instead of augmenting them,
// which caused TypeScript errors for all standard HTML tags (e.g., `div`, `p`).
// By explicitly extending `React.JSX.IntrinsicElements`, we ensure that all built-in
// element types are preserved while adding our custom `model-viewer` type,
// resolving the widespread JSX errors across the application.
declare global {
    namespace JSX {
        interface IntrinsicElements extends React.JSX.IntrinsicElements {
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