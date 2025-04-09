import React from "react";
import LandingComponent from "./LandingComponent";
import { Loader } from "@egovernments/digit-ui-components";

const Landing = () => {
  const { data: sandboxConfig , isLoading} = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCitizenCurrentTenant(),
    "sandbox",
    [
      {
        name: "config",
      },
    ],
    {
      select: (data) => {
        return data?.["sandbox"]?.["config"]?.[0];
      },
    }
  );
  if(isLoading) return <Loader/>;
  return (
    <LandingComponent config={sandboxConfig} />
  );
    
};

export default Landing;
