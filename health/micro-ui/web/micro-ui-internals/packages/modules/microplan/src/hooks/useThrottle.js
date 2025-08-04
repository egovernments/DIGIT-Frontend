import React,{useRef,useCallback} from "react";

const useThrottle = (callback, limit) => {
  const lastCallRef = useRef(0);
  const throttledCallback = useCallback((...args) => {
    const now = Date.now();
    if (now - lastCallRef.current >= limit) {
      lastCallRef.current = now;
      callback(...args);
    }
  }, [callback, limit]);
  return throttledCallback;
};
export default useThrottle;