import React, { useLayoutEffect } from "react";
import withNavigator from "./withNavigator";
import { useAuthState } from "../state/useAuthState";

const withAuth = (WrappedComponent) => {
  const { data } = useAuthState();
  return (props) => {
    useLayoutEffect(() => {
      if (data?.isSignedIn) {
        console.log("user is signed in");
      } else {
        console.log("user is not signedin");
      }
      return () => {
        console.log("Component unmounted");
      };
    }, []);
    const WrappedComp = withNavigator(WrappedComponent);
    return <WrappedComp {...props} />;
  };
};

export default withAuth;
