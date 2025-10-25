// FIX: The `declare global` was overwriting React's `JSX.IntrinsicElements`
// because this file is treated as a module (due to the `export` statements).
// To fix this, we now explicitly import React's `JSX` namespace and extend its
// `IntrinsicElements` interface. This merges our custom `<model-viewer>` type
// with all the standard HTML element types, resolving errors across the app.
import type { DetailedHTMLProps, HTMLAttributes, JSX as ReactJSX } from 'react';

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
        interface IntrinsicElements extends ReactJSX.IntrinsicElements {
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
