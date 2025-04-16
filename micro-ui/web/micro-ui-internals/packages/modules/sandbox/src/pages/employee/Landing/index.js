import React from "react";
import LandingComponent from "./LandingComponent";
import { Loader } from "@egovernments/digit-ui-components";

const Landing = () => {
  const { data: sandboxConfig , isLoading} = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
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
  if (isLoading) return <Loader variant="PageLoader" />;
  return (
    <LandingComponent config={sandboxConfig} />
  );
    
};

export default Landing;
