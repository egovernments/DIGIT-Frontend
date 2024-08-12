import React, { useLayoutEffect } from "react";
import withNavigator from "./withNavigator";
import { useAuthState } from "../states/useAuthState";
import DigitScreenWrapper from "../components/frameworks/DigitScreenWrapper";

/**
 * Higher-Order Component (HOC) for authentication.
 * 
 * This HOC wraps a component with authentication logic and additional
 * functionality. It checks if the user is signed in and logs appropriate
 * messages. It also integrates navigation functionality and wraps the 
 * component with a screen wrapper.
 * 
 * @param {React.ComponentType} WrappedComponent - The component to be wrapped.
 * 
 * @returns {React.FC} - The enhanced component with authentication and navigation.
 * 
 * @example
 * const EnhancedComponent = withAuth(MyComponent);
 * 
 * @author jagankumar-egov
 */
const withAuth = (WrappedComponent) => {
  // Use authentication state hook
  const { data } = useAuthState();

  // Return a functional component
  return (props) => {
    useLayoutEffect(() => {
      // Log user sign-in status
      if (data?.isSignedIn) {
        console.debug("User is signed in");
      } else {
        console.debug("User is not signed in");
      }

      // Cleanup function on component unmount
      return () => {
        console.debug("Component unmounted");
      };
    }, [data?.isSignedIn]);

    // Enhance the wrapped component with navigation functionality
    const WrappedComp = withNavigator(WrappedComponent);

    // Wrap the enhanced component with a screen wrapper
    return (
      <DigitScreenWrapper>
        <WrappedComp {...props} />
      </DigitScreenWrapper>
    );
  };
};

export default withAuth;
