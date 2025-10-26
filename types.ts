// FIX: Removed the triple-slash directive for react. It can cause issues in module files (files with imports/exports)
// and was throwing a "Cannot find type definition file" error.

// FIX: Changed `import React from 'react'` to `import * as React from 'react'`.
// The `declare module 'react'` augmentation requires the module to be resolved.
// In some TypeScript configurations, especially for `.ts` files that are not transpiled as JSX,
// the namespace import (`* as React`) is required for the compiler to find the module for augmentation.
// This resolves the "module 'react' cannot be found" error.
import * as React from 'react';

// By augmenting the 'react' module, we can extend React's built-in JSX types
// without overwriting them, which avoids issues with standard HTML elements.
// FIX: Removed the `HTMLAttributes` augmentation for the `class` property.
// Standard React practice is to use `className` for styling, which correctly
// translates to the `class` attribute in the DOM for both standard and custom elements.
// The custom `class` property might interfere with React's rendering logic.
// FIX: Changed `declare module 'react'` to `declare global` to fix module augmentation error. The `JSX` namespace is often available globally in modern React setups, and augmenting it directly is more robust.
declare global {
    namespace JSX {
        // FIX: Augment the existing IntrinsicElements interface to add 'model-viewer'.
        // By redeclaring the interface within a `declare global` block, TypeScript's
        // "declaration merging" feature adds our custom element type without overwriting
        // the standard HTML element types. The `extends` clause was removed as it was
        // incorrectly causing TypeScript to replace the interface instead of merging with it,
        // which was the root cause of the widespread "Property does not exist" errors.
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