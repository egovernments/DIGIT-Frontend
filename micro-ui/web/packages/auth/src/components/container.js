import React from "react";

const Container = (props) => {
  const { type } = props;
  switch (type) {
    case "h1":
      return <h1 style={props.style}>{props.children}</h1>;
    default:
      return <div style={props.style}>{props.children}</div>;
  }
};

export default Container;
