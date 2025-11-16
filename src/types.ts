// FIX: To resolve module resolution conflicts, this file now re-exports all types
// from the single source of truth at the project root: `../types.ts`.
// FIX: Add side-effect imports here to correctly load global JSX types and augmentations.
import 'react';
import 'framer-motion';
// FIX: Add side-effect import for react-router-dom to help TypeScript resolve its modules and types globally.
import 'react-router-dom';

export * from '../types';