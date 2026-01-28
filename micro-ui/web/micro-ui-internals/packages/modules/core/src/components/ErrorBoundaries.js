import React from "react";
import ErrorComponent from "./ErrorComponent";

const Redircter = () => {
  // Add safety checks for window object
  if (typeof window === 'undefined') {
    return <span></span>;
  }

  try {
    const contextPath = window?.contextPath || '';
    const userType = Digit.UserService.getType();
    const path = userType === "employee" 
      ? `/${contextPath}/employee/user/error` 
      : `/${contextPath}/citizen/error`;
    
    const currentHref = window.location.href;
    
    // Check if we're already on an error page or in development
    if (
      currentHref.includes("employee/user/error") ||
      currentHref.includes("citizen/error") ||
      process.env.NODE_ENV === "development"
    ) {
      // Do nothing - already on error page or in development
      return <span></span>;
    }
    
    // Safe navigation with error handling
    try {
      window.location.href = path;
    } catch (navigationError) {
      console.warn('Navigation failed in error boundary:', navigationError);
      // Fallback: try using replace instead
      try {
        window.location.replace(path);
      } catch (replaceError) {
        console.error('Both href and replace failed:', replaceError);
      }
    }
  } catch (error) {
    console.error('Error in Redircter component:', error);
  }

  return <span></span>;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorStack: null, hasError: false, module: null, action: null, info: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error: error?.message, hasError: true, errorStack: error?.stack, module: error?.module, action: error?.action, info: error?.info };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({ 
      error: error?.message, 
      hasError: true, 
      errorStack: error?.stack,
      module: error?.module,
      action: error?.action,
      info: errorInfo
    });
    
    // Enhanced error logging with safety checks
    try {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Error Boundary Caught Error');
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.error('Component Stack:', errorInfo?.componentStack);
        console.groupEnd();
      }
      
      // You can also log error messages to an error reporting service here
      // Example: errorReportingService.captureException(error, { extra: errorInfo });
      
    } catch (loggingError) {
      console.warn('Failed to log error in ErrorBoundary:', loggingError);
    }
  }

  render() {
    if (this.state.hasError) {
      // ("UI-errorInfo", this.state?.errorStack);
      // ("UI-component-details", this.props);
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <Redircter />
          <ErrorComponent initData={this.props.initData} errorData={this.state}  goToHome={() => {
                window.location.href = `/${window?.contextPath}/${Digit?.UserService?.getType?.()}`; // Use navigate
              }}/>

          {/* <summary>Something went wrong</summary>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state?.errorStack && this.state.errorStack.toString().substring(0, 600)}
            {this.state?.error}
          </details> */}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
