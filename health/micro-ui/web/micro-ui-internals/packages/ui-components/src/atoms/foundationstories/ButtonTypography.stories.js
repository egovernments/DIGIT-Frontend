import React from "react";
import Divider from "../Divider";

export default {
  title: "Foundations/Typography/Button",
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
  lineHeight:"normal"
};

export const ButtonL = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography button large`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      button large / 20pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography button large`}>
      ButtonL
    </div>
  </div>
);

export const ButtonM = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography button medium`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      button medium / 16pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography button medium`}>
      ButtonM
    </div>
  </div>
);

export const ButtonS = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography button small`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      button small / 14pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography button small`}>
      ButtonS
    </div>
  </div>
);