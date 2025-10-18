import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface ApiKeyContextType {
  ensureApiKey: () => Promise<boolean>;
  handleApiError: (e: any) => void;
  error: string | null;
  clearError: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  // Use a ref to track session readiness to avoid re-renders just for this flag
  const isKeyReadyInSession = useRef(false);

  const clearError = useCallback(() => setError(null), []);

  const ensureApiKey = useCallback(async (): Promise<boolean> => {
    clearError();
    if (isKeyReadyInSession.current) {
      return true;
    }

    try {
      if (await window.aistudio.hasSelectedApiKey()) {
        isKeyReadyInSession.current = true;
        return true;
      }
      
      await window.aistudio.openSelectKey();
      // Assume success after prompt, as there's no direct success callback from openSelectKey.
      // The subsequent API call will fail if the key is bad, which handleApiError will catch.
      isKeyReadyInSession.current = true; 
      return true;

    } catch (e) {
      console.error("API key selection process was cancelled or failed.", e);
      setError("An API Key is required to use AI features. Please select one to proceed.");
      isKeyReadyInSession.current = false;
      return false;
    }
  }, [clearError]);

  const handleApiError = useCallback((e: any) => {
    console.error("An API error occurred:", e);
    if (e.message?.includes("API Key")) {
      setError("An API Key is required. Please select one to proceed.");
      isKeyReadyInSession.current = false;
    } else if (e.message?.includes("Requested entity was not found")) {
      setError("The selected API Key appears to be invalid. Please select another one.");
      // Force re-selection next time
      isKeyReadyInSession.current = false; 
    } else {
      setError("An unexpected error occurred. This could be a network issue or content safety restriction. Please try again.");
    }
  }, []);

  return (
    <ApiKeyContext.Provider value={{ ensureApiKey, handleApiError, error, clearError }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
