// FIX: By importing 'react', we ensure that React's global JSX type definitions are
// loaded before this file's augmentation of `JSX.IntrinsicElements`. This prevents
// this file's declarations from overwriting React's default HTML element types,
// resolving errors like "Property 'div' does not exist on type 'JSX.IntrinsicElements'"
// throughout the application.
import 'react';

// The `declare global` block allows augmenting global types from within a module.
// By redeclaring the `JSX.IntrinsicElements` interface, we can add custom elements
// like `<model-viewer>` to TypeScript's known JSX elements. This is called
// "declaration merging" and it adds our type to the existing list of elements
// from React, preventing type errors across the application.
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
