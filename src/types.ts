import React from 'react';

// FIX: The project was missing React's JSX type definitions for standard HTML elements.
// Explicitly importing 'react' and extending its JSX types to make them available globally.

// This file contains shared type definitions for the application.

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


// FIX: This augmentation adds the 'model-viewer' custom element to React's JSX types.
// By simply augmenting the global namespace (and not using `extends`), we allow the
// standard HTML element types loaded via import React to be correctly recognized.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
        }
    }
}