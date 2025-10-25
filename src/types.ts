import React from 'react';

// This `declare global` block augments the existing global `JSX` namespace.
// By defining `IntrinsicElements` as an `interface`, it merges with the
// original definitions from `@types/react`, adding support for `<model-viewer>`
// while preserving all standard HTML and SVG element types. This resolves the
// widespread "Property 'div' does not exist" errors that occur when the
// global JSX namespace is accidentally overwritten instead of augmented.
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
