import React from "react";
import SimpleComponent from "./SimpleComponent";
import SvgTestComponent from "./SvgTest";

const TestComponent = (props, ref) => {
  return (
   <div>
    Test Component
    <SimpleComponent></SimpleComponent>
    <SvgTestComponent></SvgTestComponent>
   </div>
  );
};

export default TestComponent;
