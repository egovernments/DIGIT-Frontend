import React from 'react';
import ErrorBoundary from './ErrorBoundary'; // Import the ErrorBoundary component to handle JavaScript errors in the component tree
import ReactQueryWrapper from '../providers/QueryProvider'; // Import the ReactQueryWrapper component to provide React Query context to children components

/**
 * DigitApp Component
 * 
 * This component serves as a wrapper for other components, providing common functionality and context.
 * 
 * It uses two key providers:
 * - **ErrorBoundary**: Catches JavaScript errors anywhere in the component tree and displays a fallback UI.
 * - **ReactQueryWrapper**: Provides React Query context to all child components for data fetching and caching.
 * 
 * The component also passes down any additional props to its children.
 * 
 * @param {object} props - The props to pass to the children components.
 * @param {ReactNode} props.children - The child components to be rendered inside the wrappers.
 * 
 * @example
 * <DigitApp someProp="value">
 *   <SomeChildComponent />
 * </DigitApp>
 * 
 * @returns {React.Element} The rendered DigitApp component.
 * 
 * @author jagankumar-egov
 */
const DigitApp = ({ children, ...props }) => (
  <ErrorBoundary>
    <ReactQueryWrapper>
      {React.Children.map(children, child =>
        React.cloneElement(child, { ...props }) // Clone each child element and pass additional props to it
      )}
    </ReactQueryWrapper>
  </ErrorBoundary>
);

export default DigitApp;
