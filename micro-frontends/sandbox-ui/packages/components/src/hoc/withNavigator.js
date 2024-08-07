import React, { useLayoutEffect } from "react";
import { useNavigatorState } from "../states/useNavigatorState";

/**
 * Higher-Order Component (HOC) for navigation tracking.
 * 
 * This HOC wraps a component to provide navigation tracking functionality.
 * It updates the navigation state whenever the URL changes and keeps track
 * of the current and previous screens.
 * 
 * @param {React.ComponentType} WrappedComponent - The component to be enhanced.
 * 
 * @returns {React.FC} - The component wrapped with navigation tracking.
 * 
 * @example
 * const EnhancedComponent = withNavigator(MyComponent);
 * 
 * @author jagankumar-egov
 */
const withNavigator = (WrappedComponent) => {
  // Use navigation state hook
  const { setData, data } = useNavigatorState();

  // Return a functional component
  return (props) => {
    useLayoutEffect(() => {
      // Update navigation state if the screen has changed
      if (data?.currentScreen !== window.location.pathname) {
        setData({
          ...data,
          currentScreen: window.location.pathname,
          history: data?.history
            ? [...data?.history, window.location.pathname]
            : [window.location.pathname],
          previousScreen: data?.currentScreen,
        });
      }

      // Cleanup function to log when the component unmounts
      return () => {
        console.log("Component unmounted withNavigator");
      };
    }, [data, setData]); // Dependencies to ensure effect runs when data or setData changes

    // Render the wrapped component with passed props
    return <WrappedComponent {...props} />;
  };
};

export default withNavigator;
