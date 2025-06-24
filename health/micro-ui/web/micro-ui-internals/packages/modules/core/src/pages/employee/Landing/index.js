import React from "react";
import LandingComponent from "./LandingComponent";
import { sandboxConfig } from "./SandboxConfig";

const Landing = () => {
  return (
    <LandingComponent config={sandboxConfig} />
  );
    
};

export default Landing;
