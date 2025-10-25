import React from 'react';

// FIX: This file's `declare global` block is a duplicate of the one in the root `types.ts`.
// Such duplication can cause TypeScript to fail to merge JSX type definitions correctly,
// leading to errors where standard HTML elements like 'div' are not recognized.
// The block below is commented out to make the root `types.ts` the single source of truth.
/*
// This `declare global` block augments the existing global `JSX` namespace.
// By defining `IntrinsicElements` as an `interface`, it merges with the
// original definitions from `@types/react`, adding support for `<model-viewer>`
// while preserving all standard HTML and SVG element types. This is now the
// single source of truth for this augmentation.
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
*/
