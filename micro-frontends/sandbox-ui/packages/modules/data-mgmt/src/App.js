import React from "react";
import DataMgmtApp from "./pages";
import { Hooks } from "components";

/**
 * Main application component that initializes the UserApp with provided props.
 *
 * This component is responsible for rendering the `UserApp` component and passing
 * the necessary props to it, including the `baseAppURL` and `rootTenant`. It constructs
 * the `baseAppURL` by appending `/user` to the provided `baseAppURL`, ensuring that
 * the `UserApp` component receives the correct URL structure.
 *
 * @param {Object} props - The properties passed to the App component.
 * @param {string} props.baseAppURL - The base URL for the application. This is used
 *                                     to set up the base path for the `UserApp`.
 * @param {string} props.rootTenant - The root tenant identifier used in the application.
 *
 * @example
 * // Example usage of the App component
 * <App baseAppURL="http://example.com" rootTenant="tenant1" />
 *
 * @returns {JSX.Element} The rendered `UserApp` component with the given props.
 */
export default function App() {
  const { appURL, rootTenant ,moduleName} = Hooks?.useGlobalConfig();
  return (
    <>
      <h2>Data Management</h2>
      <DataMgmtApp
        baseAppURL={appURL}
        rootTenant={rootTenant}
      />
    </>
  );
}
