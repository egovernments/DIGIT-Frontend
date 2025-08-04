import React, { useRef, useCallback } from "react";

const useThrottleUnique = (callback, limit) => {
  const lastCallMapRef = useRef(new Map());

  const throttledCallback = useCallback((rowId, ...args) => {
    const now = Date.now();
    const lastCall = lastCallMapRef.current.get(rowId) || 0;

    if (now - lastCall >= limit) {
      lastCallMapRef.current.set(rowId, now);
      callback(...args);
    }
  }, [callback, limit]);

  return throttledCallback;
};

export default useThrottleUnique;
