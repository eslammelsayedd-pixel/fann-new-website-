import React from 'react';

// This file uses module augmentation to add the 'model-viewer' custom element to React's JSX types.
// This logic is placed here to ensure it's picked up by the TypeScript compiler,
// resolving module resolution issues for the augmentation.
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
