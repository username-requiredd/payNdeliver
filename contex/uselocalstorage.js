import { useState, useCallback, useEffect, useRef } from "react";

const useLocalStorage = (key, initialValue, onError = console.error) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      onError(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      // Check for quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        onError('localStorage quota exceeded. Clearing storage might help.', error);
        // Optional: clear some data or oldest entries
        window.localStorage.clear();
      } else {
        onError(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue, onError]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          onError(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key, onError]);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Add basic validation before storing
        if (valueToStore === undefined) {
          throw new Error('Cannot store undefined value');
        }

        setStoredValue(valueToStore);
        
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          onError('localStorage quota exceeded. Clearing storage might help.', error);
          window.localStorage.clear();
        } else {
          onError(`Error setting localStorage key "${key}":`, error);
        }
      }
    },
    [key, storedValue, onError]
  );

  return [storedValue, setValue];
};

export default useLocalStorage;