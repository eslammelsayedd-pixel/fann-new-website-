import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeProvider';
// FIX: Import the global types file at the root to ensure type augmentations
// are applied consistently across the application. This resolves issues with
// libraries like framer-motion where component props were not being recognized.
// FIX: Changed import to use the consolidated types file in `src` which correctly loads global definitions.
import './src/types';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);