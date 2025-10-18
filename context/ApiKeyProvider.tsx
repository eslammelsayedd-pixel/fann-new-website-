import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface ApiKeyContextType {
  ensureApiKey: () => Promise<boolean>;
  handleApiError: (e: any) => void;
  error: string | null;
  isKeyError: boolean;
  clearError: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const [isKeyError, setIsKeyError] = useState(false);
  const isKeyReadyInSession = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
    setIsKeyError(false);
  }, []);

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
      setIsKeyError(true);
      isKeyReadyInSession.current = false;
      return false;
    }
  }, [clearError]);

  const handleApiError = useCallback((e: any) => {
    console.error("An API error occurred:", e);
    const message = e.message || '';
    if (message.includes("API Key") || message.includes("Requested entity was not found")) {
      const isInvalidKeyError = message.includes("Requested entity was not found");
      setError(isInvalidKeyError ? "The selected API Key appears to be invalid. Please select another one." : "An API Key is required. Please select one to proceed.");
      setIsKeyError(true);
      // Force re-selection next time
      isKeyReadyInSession.current = false; 
    } else {
      setError("An unexpected error occurred. This could be a network issue or content safety restriction. Please try again.");
      setIsKeyError(false);
    }
  }, []);

  return (
    <ApiKeyContext.Provider value={{ ensureApiKey, handleApiError, error, isKeyError, clearError }}>
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