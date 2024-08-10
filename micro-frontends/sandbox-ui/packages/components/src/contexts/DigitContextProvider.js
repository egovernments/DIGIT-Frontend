import React, { createContext, useContext, useState } from 'react';

/**
 * DigitContext - React context to hold global configuration state.
 */
const DigitContext = createContext();

/**
 * DigitContextProvider - A provider component that wraps its children with 
 * the DigitContext, allowing them to access and update global configuration state.
 *
 * @author jagankumar-egov
 *
 * @param {Object} props - The component props.
 * @param {Object} props.initialValue - The initial value for the context state.
 * @param {React.ReactNode} props.children - The child components that require access to the context.
 *
 * @example
 *
 * // Wrap your application or specific parts of it with the provider
 * const initialConfig = {
 *   rootTenant: "pwc",
 *   fallback: false,
 *   baseAppURL: "/pwc",
 *   moduleName: "@egovernments/user-app"
 * };
 *
 * const App = () => (
 *   <DigitContextProvider initialValue={initialConfig}>
 *     <MyComponent />
 *   </DigitContextProvider>
 * );
 *
 * @returns {React.ReactNode} The provider component that wraps its children with the context.
 */
const DigitContextProvider = ({ children, initialValue }) => {
  // State to manage the context value, initialized with initialValue
  const [value, setValue] = useState(initialValue);

  // The context value that will be provided to consumers of the context
  const contextValue = {
    value,
    setValue, // Optionally allow updating the state through this function
  };

  return (
    <DigitContext.Provider value={contextValue}>
      {children}
    </DigitContext.Provider>
  );
};

export { DigitContext, DigitContextProvider };
