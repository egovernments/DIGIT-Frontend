import React, { useState, useEffect } from 'react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const handleErrors = (error, errorInfo) => {
      setHasError(true);
      setError(error);
      setErrorInfo(errorInfo);
      console.error("Error caught by ErrorBoundary: ", error, errorInfo);
    };

    const resetError = () => {
      setHasError(false);
      setError(null);
      setErrorInfo(null);
    };

    window.addEventListener('error', handleErrors);
    window.addEventListener('unhandledrejection', handleErrors);

    return () => {
      window.removeEventListener('error', handleErrors);
      window.removeEventListener('unhandledrejection', handleErrors);
      resetError();
    };
  }, []);

  if (hasError) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()}
          <br />
          {errorInfo?.componentStack}
        </details>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
