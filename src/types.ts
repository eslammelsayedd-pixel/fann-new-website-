
// FIX: To resolve module resolution conflicts, this file now re-exports all types
// from the single source of truth at the project root: `../types.ts`.
// FIX: Add side-effect imports here to correctly load global JSX types and augmentations.
import 'react';
import 'framer-motion';
// FIX: Add side-effect import for react-router-dom to help TypeScript resolve its modules and types globally.
import 'react-router-dom';

export * from '../types';

// This augmentation adds the 'model-viewer' custom element to React's JSX types.
// By augmenting the global namespace within a module (after importing react), 
// we add to the existing intrinsic elements without losing the standard ones like 'div', 'p', etc.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
        }
    }
}
