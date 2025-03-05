import React from "react";

const Label = (props) => {
  return <h4 className={`h4 ${props?.className}`}>{props.children}</h4>;
};

export default Label;
