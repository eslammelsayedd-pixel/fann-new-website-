// FIX: Re-exporting from src/types.ts to create a single source of truth
// for all type definitions and augmentations, resolving module resolution
// conflicts that were causing loss of global JSX types.
export * from './src/types';
