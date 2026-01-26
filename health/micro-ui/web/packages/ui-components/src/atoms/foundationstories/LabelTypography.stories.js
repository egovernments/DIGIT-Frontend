import React from "react";
import Divider from "../Divider";

export default {
  title: "Foundations/Typography/Label",
  argTypes: {
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "#363636",
  display: "flex",
  justifyContent: "center",
  transform: "translate(-50%, -50%)",
  lineHeight: "normal",
};

export const Label = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography label`}
  >
    <div
      style={{
        lineHeight: "normal",
        display: "flex",
        justifyContent: "flex-start",
        gap: "0.25rem",
      }}
    >
      Label / 16pts
    </div>
    <Divider></Divider>
    <div
      style={{ lineHeight: "normal", color: "#363636" }}
      className={`typography label`}
    >
      Label
    </div>
  </div>
);
