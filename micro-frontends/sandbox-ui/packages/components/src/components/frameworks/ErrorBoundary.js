import React, { useState, useEffect } from 'react';

/**
 * ErrorBoundary Component
 * 
 * This component catches JavaScript errors anywhere in the component tree,
 * logs the error details, and displays a fallback UI when an error occurs.
 * 
 * It handles both synchronous errors and unhandled promise rejections.
 * 
 * @param {object} props - The props object.
 * @param {ReactNode} props.children - The child components to be rendered if no error occurs.
 * 
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * @returns {React.Element} The rendered ErrorBoundary component.
 * @author jagankumar-egov
 */
const ErrorBoundary = ({ children }) => {
  // State to track if an error has occurred
  const [hasError, setHasError] = useState(false);
  
  // State to store the error object
  const [error, setError] = useState(null);
  
  // State to store additional error information
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    /**
     * Handle errors and update state.
     * 
     * @param {Error} error - The error object.
     * @param {object} errorInfo - Additional information about the error.
     */
    const handleErrors = (error, errorInfo) => {
      setHasError(true); // Set error state to true
      setError(error); // Store the error object
      setErrorInfo(errorInfo); // Store additional error info
      console.error("Error caught by ErrorBoundary: ", error, errorInfo); // Log error details
    };

    /**
     * Reset error state.
     */
    const resetError = () => {
      setHasError(false); // Reset error state
      setError(null); // Clear error object
      setErrorInfo(null); // Clear additional error info
    };

    // Add event listeners for error and unhandled promise rejection events
    window.addEventListener('error', handleErrors);
    window.addEventListener('unhandledrejection', handleErrors);

    // Cleanup event listeners and reset error state on component unmount
    return () => {
      window.removeEventListener('error', handleErrors);
      window.removeEventListener('unhandledrejection', handleErrors);
      resetError();
    };
  }, []);

  // Render fallback UI if an error has occurred
  if (hasError) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()} {/* Display error message */}
          <br />
          {errorInfo?.componentStack} {/* Display component stack trace */}
        </details>
      </div>
    );
  }

  // Render children if no error has occurred
  return children;
};

export default ErrorBoundary;
