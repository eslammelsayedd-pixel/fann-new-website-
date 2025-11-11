// All type definitions have been consolidated into /types.ts to simplify
// module resolution and fix global type augmentation issues. This file
// now re-exports from the root types file to ensure consistent type
// resolution across the project, regardless of which file is imported.
export * from '../types';
