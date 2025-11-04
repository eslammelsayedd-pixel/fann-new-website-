import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// It's safe to declare fbq as a global function for type-checking
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

const MetaPixelTracker = (): null => {
  const location = useLocation();

  useEffect(() => {
    // This check is important because window.fbq might not be available
    // immediately or if an ad blocker blocks the script.
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  return null;
};

export default MetaPixelTracker;