import React from 'react';
import ErrorBoundary from './ErrorBoundary'; // Import the ErrorBoundary component to handle JavaScript errors in the component tree
import ReactQueryProvider from '../../contexts/ReactQueryProvider'; // Import the ReactQueryWrapper component to provide React Query context to children components
import { DigitContextProvider } from '../../contexts/DigitContextProvider';

/**
 * DigitApp Component
 * 
 * This component serves as a wrapper for other components, providing common functionality and context.
 * 
 * It uses two key providers:
 * - **ErrorBoundary**: Catches JavaScript errors anywhere in the component tree and displays a fallback UI.
 * - **ReactQueryProvider**: Provides React Query context to all child components for data fetching and caching.
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
    <ReactQueryProvider>
      <DigitContextProvider initialValue={props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { ...props }) // Clone each child element and pass additional props to it
      )}
      </DigitContextProvider>
    </ReactQueryProvider>
  </ErrorBoundary>
);

export default DigitApp;
