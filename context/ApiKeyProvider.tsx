import React, { createContext, useContext, useState, useCallback } from 'react';

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

  const clearError = useCallback(() => {
    setError(null);
    setIsKeyError(false);
  }, []);

  /**
   * This function no longer performs an interactive check.
   * In a Vercel/production environment, the API key is expected to be in the server-side
   * environment variables. This function now acts as a simple passthrough,
   * allowing the client-side request to proceed to the API endpoint where the
   * actual key validation will occur.
   */
  const ensureApiKey = useCallback(async (): Promise<boolean> => {
    clearError();
    return Promise.resolve(true);
  }, [clearError]);

  const handleApiError = useCallback((e: any) => {
    console.error("An API error occurred:", e);
    const message = e.message || '';
    
    // Check for standard API key error messages from Google or our server wrapper.
    if (message.includes("API Key") || message.includes("API key not valid") || message.includes("Requested entity was not found") || message.includes("API key is not configured")) {
      const detailedKeyError = `Service Connection Error: The API key is missing or invalid.\n\nPlease check your Vercel project's Environment Variables:\n\n1. Ensure you have an environment variable named either API_KEY or GOOGLE_CLOUD_API_KEY.\n2. Confirm the value is a correct and currently active Google API key.\n3. Make sure the key has the "Generative Language API" enabled in your Google Cloud project.\n4. After adding or updating the key, you must create a new Vercel deployment for the changes to take effect.`;
      setError(detailedKeyError);
      setIsKeyError(true); 
    } else {
      setError("An unexpected error occurred. This could be a network issue or a content safety restriction. Please try again.");
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