import React from "react";
import LandingComponent from "./LandingComponent";

const Landing = () => {
  const { data: sandboxConfig , isLoading} = Digit.Hooks.useCustomMDMS(
    "default",
    "sandbox",
    [
      {
        name: "config",
      },
    ],
    {
      select: (data) => {
        return data?.["sandbox"]?.["config"];
      },
    }
  );

  return (
    <LandingComponent config={sandboxConfig} />
  );
    
};

export default Landing;
