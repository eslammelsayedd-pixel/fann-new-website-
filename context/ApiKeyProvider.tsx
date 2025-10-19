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
        // Re-validate to ensure the key wasn't removed in another tab/window
        if (await window.aistudio.hasSelectedApiKey()) {
            return true;
        }
        isKeyReadyInSession.current = false; // The ref was stale, reset it.
    }

    try {
      if (await window.aistudio.hasSelectedApiKey()) {
        isKeyReadyInSession.current = true;
        return true;
      }
      
      // If no key is present, proactively prompt the user.
      await window.aistudio.openSelectKey();
      
      // Assume success after the prompt. The subsequent API call will fail if the key is bad,
      // which is handled by handleApiError.
      isKeyReadyInSession.current = true; 
      return true;

    } catch (e) {
      // This catch block is for when the user CANCELS the `openSelectKey` dialog.
      // Instead of showing an error, we now fail silently. The user can simply
      // click the action button again to re-trigger the prompt. This creates a smoother flow.
      console.warn("API key selection was cancelled by the user.");
      isKeyReadyInSession.current = false;
      return false;
    }
  }, [clearError]);

  const handleApiError = useCallback((e: any) => {
    console.error("An API error occurred:", e);
    const message = e.message || '';
    // This error handler is for when an API call *fails*, which is different from cancelling the prompt.
    // If the failure is due to a bad key, we MUST inform the user.
    if (message.includes("API Key") || message.includes("Requested entity was not found")) {
      const isInvalidKeyError = message.includes("Requested entity was not found");
      setError(isInvalidKeyError ? "The selected API Key appears to be invalid. Please select another one." : "An API Key is required. Please select one to proceed.");
      setIsKeyError(true);
      // Force re-selection next time an action is attempted.
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
