import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // You can also log error info to an error reporting service here
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", color: "#c84c0e", background: "#fff3f0", borderRadius: 8 }}>
          <h2>Something went wrong.</h2>
          {this.state.error && <details style={{ whiteSpace: "pre-wrap" }}>{this.state.error.toString()}</details>}
          {this.state.errorInfo && (
            <details style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{this.state.errorInfo.componentStack}</details>
          )}
          <button
            onClick={this.handleReset}
            style={{ marginTop: 16, padding: "0.5rem 1rem", background: "#c84c0e", color: "#fff", border: "none", borderRadius: 4 }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
