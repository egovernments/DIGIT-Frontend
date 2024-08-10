/**
 * Custom hook to access the global configuration context, restricting the accessible properties
 * to only rootTenant, fallback, baseAppURL, moduleName, and a computed appURL.
 *
 * @author jagankumar-egov
 *
 * @example
 * 
 * // Usage within a React component
 *   const { rootTenant, fallback, baseAppURL, appURL, moduleName } = useGlobalConfig();
 *   
 *
 * @returns {Object} Returns an object containing rootTenant, fallback, baseAppURL, appURL, and moduleName.
 */
import { useContext } from 'react';
import { DigitContext } from '../contexts/DigitContext';

const useGlobalConfig = () => {
  // Access the context using useContext hook
  const context = useContext(DigitContext);

  // Ensure the hook is used within a DigitContextProvider
  if (!context) {
    throw new Error('useGlobalConfig must be used within a DigitContextProvider');
  }

  // Extract the value object from context with a default empty object
  const { value = {} } = context;

  // Destructure the specific properties you want to expose
  const { rootTenant, fallback, baseAppURL, moduleName } = value;

  // Compute a derived property appURL based on baseAppURL and moduleName
  const appURL = `${baseAppURL}/${moduleName}`;

  // Return the restricted set of properties including the derived appURL
  return { rootTenant, fallback, baseAppURL, appURL, moduleName };
};

export default useGlobalConfig;
