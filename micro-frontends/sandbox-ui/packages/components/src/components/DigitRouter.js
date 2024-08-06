import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import withAuth from "../hoc/withAuth";

/**
 * `DigitRouter` Component
 * 
 * This component sets up routing for the application using React Router.
 * It dynamically loads routes based on the provided `routes` array and 
 * applies authentication where specified.
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.routes - Array of route configurations
 * @param {string} props.baseAppURL - Base URL for the application
 * 
 * @returns {JSX.Element} The rendered `DigitRouter` component with routes.
 */
const DigitRouter = ({ routes = [], baseAppURL }) => {
  console.log(routes, 'routes'); // Debugging: Log routes array

  return (
    <div>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routes.map((route, key) => {
              // Determine the component to render based on authentication requirement
              const PageComponent = route.withAuth
                ? withAuth(route.component)
                : route.component;

              return (
                <Route
                  key={key}
                  path={`${baseAppURL}/${route.url}`}
                  element={<PageComponent />}
                />
              );
            })}
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};

export default DigitRouter;
