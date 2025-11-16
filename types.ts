// FIX: This file is now the single source of truth for types to resolve
// module resolution issues that were causing global JSX type conflicts.

// This file contains shared type definitions for the application.
// By including an 'export', this file becomes a module, which allows the
// 'declare global' block to correctly augment the global JSX namespace
// instead of overwriting it.

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
  industry: 'Technology' | 'Healthcare' | 'Aviation' | 'Hospitality' | 'Real Estate' | 'Luxury' | 'Corporate' | 'Retail' | 'Residential' | 'Automotive' | 'Energy' | 'Finance' | 'Food & Beverage' | 'Culture' | 'Art & Design' | 'Construction' | 'Entertainment' | 'Security' | 'Manufacturing' | 'Education' | 'Logistics' | 'Defence' | 'Equestrian' | 'Media' | 'Fitness' | 'Beauty';
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

export interface DesignConfiguration {
  companyName: string;
  boothSize: number;
  boothType: string;
  style: string;
  features: string[];
  brandColors: string[];
  logoUrl?: string;
}

export interface GeneratedDesign {
  conceptName: string;
  detailedDescription: string;
  materials: string[];
  lighting: string;
  technologyFeatures: string[];
}


// This augmentation adds the 'model-viewer' custom element to React's JSX types.
// By augmenting the global namespace within a module, we add to the existing
// intrinsic elements without losing the standard ones like 'div', 'p', etc.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
        }
    }
}