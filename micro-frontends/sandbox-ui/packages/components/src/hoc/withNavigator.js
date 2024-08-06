import React, { useLayoutEffect } from "react";
import { useNavigatorState } from "../states/useNavigatorState";

const withNavigator = (WrappedComponent) => {
  const { setData, data } = useNavigatorState();

  return (props) => {
    useLayoutEffect(() => {
      data?.currentScreen != window.location.pathname &&
        setData({
          ...data,
          currentScreen: window.location.pathname,
          history: data?.history
            ? [...data?.history, window.location.pathname]
            : [window.location.pathname],
          previousScreen: data?.currentScreen,
        });

      return () => {
        console.log("Component unmounted withNavigator");
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withNavigator;
