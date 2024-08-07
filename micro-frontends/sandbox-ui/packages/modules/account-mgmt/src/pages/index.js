import React, { lazy } from "react";
import { DigitRouter } from "components"; // Import the DigitRouter component for routing

/**
 * Define routes for the application.
 * Each route specifies the URL, authentication requirement, and the component to be lazy-loaded.
 */
const routes = [
  {
    url: "page-two",
    withAuth: true,  // Indicates that authentication is required for this route
    component: lazy(() => import("./PageTwo")), // Lazy-load the PageTwo component
  },
  {
    url: "page-one",
    withAuth: true,  // Indicates that authentication is required for this route
    component: lazy(() => import("./PageOne")), // Lazy-load the PageOne component
  },
  {
    url: "page-three",
    withAuth: true, // Indicates that no authentication is required for this route
    component: lazy(() => import("./PageThree")), // Lazy-load the PageThree component
  },
];

/**
 * AccountMgmtApp Component
 * This component initializes the DigitRouter with the specified routes and baseAppURL.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.rootTenant - The root tenant for routing (if needed).
 * @param {string} props.baseAppURL - The base URL for the application.
 * @returns {JSX.Element} The rendered DigitRouter component with the routes.
 */
const AccountMgmtApp = ({ rootTenant, baseAppURL }) => {
  return (
    <DigitRouter baseAppURL={baseAppURL} routes={routes} />
  );
};

export default AccountMgmtApp;
