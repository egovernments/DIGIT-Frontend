import React from "react";
import Divider from "../Divider";

export default {
  title: "Foundations/Typography/Body",
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

export const BodyL = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography body-l`}
  >
    <div
      style={{
        lineHeight: "normal",
        display: "flex",
        justifyContent: "flex-start",
        gap: "0.25rem",
      }}
    >
      Body L / 20pts
    </div>
    <Divider></Divider>
    <div
      style={{ lineHeight: "normal", color: "#363636" }}
      className={`typography body-l`}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore
    </div>
  </div>
);

export const BodyS = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography-story body-s`}
  >
    <div
      style={{
        lineHeight: "normal",
        display: "flex",
        justifyContent: "flex-start",
        gap: "0.25rem",
      }}
    >
      Body S / 16pts
    </div>
    <Divider></Divider>
    <div
      style={{ lineHeight: "normal", color: "#363636" }}
      className={`typography-story body-s`}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore
    </div>
  </div>
);

export const BodyXS = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography body-xs`}
  >
    <div
      style={{
        lineHeight: "normal",
        display: "flex",
        justifyContent: "flex-start",
        gap: "0.25rem",
      }}
    >
      Body XS / 14pts
    </div>
    <Divider></Divider>
    <div
      style={{ lineHeight: "normal", color: "#363636" }}
      className={`typography body-xs`}
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore
    </div>
  </div>
);
