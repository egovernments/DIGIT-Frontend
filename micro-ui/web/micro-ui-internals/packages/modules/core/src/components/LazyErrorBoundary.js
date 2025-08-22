import React from "react";
import { ErrorScreen } from "@egovernments/digit-ui-components";

class LazyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log lazy loading errors for debugging
    console.error('Lazy loading failed:', error, errorInfo);
    
    // Optional: Send error to monitoring service
    if (window.Digit?.Telemetry?.error) {
      window.Digit.Telemetry.error({
        message: 'Lazy loading failed',
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for lazy loading failures
      return (
        <ErrorScreen
          initData={{}}
          onRetry={() => {
            this.setState({ hasError: false, error: null });
            // Force reload the page as fallback
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }}
        />
      );
    }

    return this.props.children;
  }
}

export default LazyErrorBoundary;