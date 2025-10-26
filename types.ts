// FIX: Removed the triple-slash directive for react. It can cause issues in module files (files with imports/exports)
// and was throwing a "Cannot find type definition file" error.

// FIX: Changed `import React from 'react'` to `import * as React from 'react'`.
// The latter is the correct way to import the React namespace and can resolve
// module augmentation errors like "module 'react' cannot be found".
import * as React from 'react';

// By augmenting the 'react' module, we can extend React's built-in JSX types
// without overwriting them, which avoids issues with standard HTML elements.
declare module 'react' {
    // Allow 'class' property on intrinsic elements to support custom element conventions and the existing codebase.
    interface HTMLAttributes<T> {
        class?: string;
    }

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