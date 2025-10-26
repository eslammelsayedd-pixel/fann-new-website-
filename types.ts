// FIX: Add a triple-slash directive to ensure React's types are loaded before module augmentation occurs.
// This resolves the "module 'react' cannot be found" error.
/// <reference types="react" />

// FIX: Changed `import 'react';` to `import React from 'react';` to resolve module augmentation errors
// and bring the 'React' namespace into scope for type definitions.
import React from 'react';

// FIX: Switched from `declare global` to module augmentation of 'react'.
// This correctly extends React's built-in JSX types instead of overwriting them,
// which resolves the widespread "Property 'div' does not exist on type 'JSX.IntrinsicElements'" errors.
declare module 'react' {
    // FIX: Allow 'class' property on intrinsic elements to support custom element conventions and the existing codebase.
    // This resolves potential type errors from using 'class' instead of 'className'.
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
                // FIX: Add missing properties used in HomePage.tsx to prevent type errors.
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
