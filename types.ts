// FIX: Replaced the full 'React' namespace import with a type-only import for specific types.
// The previous `import * as React from 'react';` was causing the `IntrinsicElements`
// interface augmentation below to overwrite React's default types, removing all standard HTML elements.
// Importing only the necessary types with `import type` resolves this module scope issue.
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

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

// This global declaration augments React's JSX namespace to add support for the custom
// `<model-viewer>` element, allowing it to be used in TSX files without type errors.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
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