import React, { useLayoutEffect } from "react";
import withNavigator from "./withNavigator";
import { useAuthState } from "../state/useAuthState";

const withAuth = (WrappedComponent) => {
  const { data } = useAuthState();
  return (props) => {
    useLayoutEffect(() => {
      if (data?.isSignedIn) {
        console.debug("user is signed in");
      } else {
        console.debug("user is not signedin");
      }
      return () => {
        console.debug("Component unmounted");
      };
    }, []);
    const WrappedComp = withNavigator(WrappedComponent);
    return <WrappedComp {...props} />;
  };
};

export default withAuth;
