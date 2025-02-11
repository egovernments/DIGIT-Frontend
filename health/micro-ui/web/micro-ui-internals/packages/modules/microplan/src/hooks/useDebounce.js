import React, { useEffect, useCallback, useRef } from 'react';

const useDebounce = (callback, delay) => {
  const handlerRef = useRef();
  const debouncedCallback = useCallback((...args) => {
    if (handlerRef.current) {
      clearTimeout(handlerRef.current);
    }
    handlerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
  // Cleanup
  useEffect(() => {
    return () => {
      if (handlerRef.current) {
        clearTimeout(handlerRef.current);
      }
    };
  }, []);
  return debouncedCallback;
};
export default useDebounce;
