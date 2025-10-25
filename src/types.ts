import React from 'react';

// This `declare global` block augments the existing global `JSX` namespace.
// By defining `IntrinsicElements` as an `interface`, it merges with the
// original definitions from `@types/react`, adding support for `<model-viewer>`
// while preserving all standard HTML and SVG element types. This resolves the
// widespread "Property 'div' does not exist" errors that occur when the
// global JSX namespace is accidentally overwritten instead of augmented.
// FIX: The global declaration and duplicated interfaces have been removed from this file.
// The single source of truth for these types is now in the root `types.ts` file to resolve type conflicts.
