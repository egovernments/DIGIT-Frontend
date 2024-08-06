import React ,{useLayoutEffect}from "react";
import withNavigator from "./withNavigator";
import { useAuthState } from "../states/useAuthState";
import DigitScreenWrapper from "../components/DigitScreenWrapper";

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
    return <DigitScreenWrapper><WrappedComp {...props} /></DigitScreenWrapper>;
  };
};

export default withAuth;
