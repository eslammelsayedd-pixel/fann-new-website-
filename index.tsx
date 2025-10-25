import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

// FIX: Added global type declaration for <model-viewer> to augment React's
// intrinsic elements. Placing it in the application entrypoint ensures it
// correctly merges with the default types, resolving errors where standard HTML
// elements were not being recognized across the entire application.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                alt?: string;
                'camera-controls'?: boolean;
                'auto-rotate'?: boolean;
                ar?: boolean;
                'shadow-intensity'?: string;
            };
        }
    }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);