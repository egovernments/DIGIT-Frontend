import React from "react";
import Divider from "../Divider";

export default {
  title: "Foundations/Typography/Heading",
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

export const HeadingXL = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography heading-xl`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Heading XL / 40pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography heading-xl`}>
      Lorem ipsum dolor sit amet, consectetur adipiscing
    </div>
  </div>
);

export const HeadingL = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography heading-l`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Heading L / 32pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography heading-l`}>
      Lorem ipsum dolor sit amet, consectetur adipiscing
    </div>
  </div>
);

export const HeadingM = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography-story heading-m`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Heading M / 24pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography-story heading-m`}>
      Lorem ipsum dolor sit amet, consectetur adipiscing
    </div>
  </div>
);

export const HeadingS = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography-story heading-s`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Heading S / 16pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography-story heading-s`}>
      Lorem ipsum dolor sit amet, consectetur adipiscing
    </div>
  </div>
);

export const HeadingXS = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography heading-xs`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Heading XS / 14pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography heading-xs`}>
      Lorem ipsum dolor sit amet, consectetur adipiscing
    </div>
  </div>
);