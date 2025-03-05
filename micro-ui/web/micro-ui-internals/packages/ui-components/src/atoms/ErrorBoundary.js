import Toast from "./Toast";
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this?.state?.hasError) {
      // Render fallback UI
      return (
        <div>
          {this?.state?.error?.toString() && <Toast type={"error"} label={this?.props?.moduleName+" : "+this?.state?.error?.toString()?.slice(0,100)}  />}
          {this?.props?.children}
        </div>
      );
    }
    // Render children normally
    return this?.props?.children;
  }
}

export default ErrorBoundary;