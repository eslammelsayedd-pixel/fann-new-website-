import React from 'react';

// This file holds the global JSX augmentation for 'model-viewer'.
// Isolating global augmentations in their own module file can resolve
// complex TypeScript module resolution issues that cause IntrinsicElements
// to be overwritten instead of merged.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & {
                src?: string;
                alt?: string;
                'camera-controls'?: boolean;
                'auto-rotate'?: boolean;
                ar?: boolean;
                'shadow-intensity'?: string;
                exposure?: string;
                'environment-image'?: string;
            };
        }
    }
}

// This export statement is necessary to ensure this file is treated as a module.
export {};
