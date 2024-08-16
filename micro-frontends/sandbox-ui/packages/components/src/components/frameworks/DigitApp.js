import React from "react";
import ErrorBoundary from "./ErrorBoundary"; // Handles JavaScript errors in the component tree and displays a fallback UI.
import ReactQueryProvider from "../../contexts/ReactQueryProvider"; // Provides React Query context for data fetching and caching.
import { DigitContextProvider } from "../../contexts/DigitContextProvider"; // Provides Digit-specific context to child components.
import DigitUIComponents from "../../DigitUIComponents"; // Imports the UI components from the DigitUI library.
import { useToastState } from "../../states/useToastState";

const { Toast } = DigitUIComponents;

/**
 * DigitApp Component
 *
 * This component serves as a wrapper for other components, providing common functionality and context.
 * It uses key providers such as ErrorBoundary, ReactQueryProvider, and DigitContextProvider.
 *
 * @param {object} props - The props to pass to the children components.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the wrappers.
 *
 * @returns {React.Element} The rendered DigitApp component.
 *
 * @author jagankumar-egov
 */
const DigitApp = ({ children, ...props }) => {
  return (
    <ErrorBoundary>
      <ReactQueryProvider>
        <DigitContextProvider initialValue={props}>
          {/* Wrapping children with DigitModuleWrapper to provide additional props */}
          <DigitModuleWrapper children={children} {...props} />
          {/* Example Toast component, currently commented out */}
          {/* <Toast type={"error"} label={"Test"} onClose={() => {}} /> */}
        </DigitContextProvider>
      </ReactQueryProvider>
    </ErrorBoundary>
  );
};

/**
 * DigitModuleWrapper Component
 *
 * This component wraps the children components to pass down additional props.
 * It also checks the state from useToastState and renders a Toast notification if necessary.
 *
 * @param {object} props - The props to pass to the children components.
 * @param {React.ReactNode} props.children - The child components to be wrapped.
 *
 * @returns {React.Element} The wrapped children components with additional props.
 */
const DigitModuleWrapper = ({ children, ...props }) => {
  const { data ={} } = useToastState();
  const { label="", type, transitionTime, showToast=false } = data;

  return (
    <>
      {/* Clone each child element and pass additional props */}
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { ...props })
      )}

      {/* Display Toast notification if showToast is true */}
      {showToast && (
        <Toast
          label={label}
          type={type}
          transitionTime={transitionTime} // Example transition time, adjust as needed
        />
      )}
    </>
  );
};

export default DigitApp;
