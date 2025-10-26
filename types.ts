// FIX: Removed the triple-slash directive for react. It can cause issues in module files (files with imports/exports)
// and was throwing a "Cannot find type definition file" error.

// FIX: Changed `import React from 'react'` to `import * as React from 'react'`.
// The `declare module 'react'` augmentation requires the module to be resolved.
// In some TypeScript configurations, especially for `.ts` files that are not transpiled as JSX,
// the namespace import (`* as React`) is required for the compiler to find the module for augmentation.
// This resolves the "module 'react' cannot be found" error.
import * as React from 'react';

// FIX: Reverting to `declare module 'react'` for module augmentation.
// The `declare global` approach was overwriting the global JSX types instead of merging with them,
// causing all standard HTML elements to be unrecognized. Augmenting the 'react' module directly
// is a more reliable way to add custom elements while preserving the standard ones.
declare module 'react' {
    namespace JSX {
        // This augmentation adds 'model-viewer' to the list of known JSX elements.
        // It merges with React's existing IntrinsicElements definition, preserving all standard HTML tags.
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
                // Add missing properties used in HomePage.tsx to prevent type errors.
                'interaction-prompt'?: string;
                'camera-orbit'?: string;
                'min-camera-orbit'?: string;
                'max-camera-orbit'?: string;
                'field-of-view'?: string;
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
