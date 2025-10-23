// By defining custom element types in a global declaration, we can use them in JSX
// without TypeScript errors. Using inline `import('react')` for types allows TypeScript
// to correctly merge (augment) the global JSX definitions instead of overwriting them,
// which would cause errors for standard HTML elements like `div`.

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

declare global {
  namespace JSX {
    // FIX: Corrected augmentation of JSX.IntrinsicElements. The `extends` keyword is not needed for declaration merging
    // and was causing the original intrinsic elements to be overwritten.
    interface IntrinsicElements {
      'model-viewer': import('react').DetailedHTMLProps<import('react').HTMLAttributes<HTMLElement>, HTMLElement> & {
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
