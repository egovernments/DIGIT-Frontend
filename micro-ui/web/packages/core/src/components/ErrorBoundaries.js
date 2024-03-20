import React from "react";
import ErrorComponent from "./ErrorComponent";
import Urls from "../../../ui-libraries/src/services/atoms/urls";

const Redircter = () => {
  const path = Digit.UserService.getType() === "employee" ? `/${window?.contextPath}/employee/user/error` : `/${window?.contextPath}/citizen/error`;
  if (
    window.location.href.includes("employee/user/error") ||
    window.location.href.includes("citizen/error") ||
    process.env.NODE_ENV === "development"
  ) {
    //do nothing
  }else{
    window.location.href = path;
  }
  return <span></span>;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorStack: null, hasError: false };
  }

  static getDerivedStateFromError(error) {
    if (error.url && error.url === Urls.MDMS) {
      return { error: error?.message, hasError: false };
    }
    return { error: error?.message, hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    if (error.url && error.url === Urls.MDMS) {
      this.setState({ error: error?.message, hasError: false });
    } else {
      this.setState({ error: error?.message, hasError: true });
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
          <ErrorComponent initData={this.props.initData} />

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