import React from "react";
import Divider from "../Divider";

export default {
  title: "Foundations/Typography/Link",
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

export const LinkL = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography link-L`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Link L / 20pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography link-L`}>
      LinkL
    </div>
  </div>
);

export const LinkS = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography link-S`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Link S / 16pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography link-S`}>
      LinkS
    </div>
  </div>
);

export const linkXS = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography link-XS`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Link XS / 14pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography link-XS`}>
      LinkXS
    </div>
  </div>
);