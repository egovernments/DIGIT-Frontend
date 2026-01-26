import React from "react";
import Divider from "../Divider";

export default {
  title: "Foundations/Typography/Caption",
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

export const CaptionL = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography caption-l`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Caption L / 28pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography caption-l`}>
      Lorem ipsum dolor sit amet, consectetur adipiscing
    </div>
  </div>
);

export const CaptionM = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography caption-m`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Caption M / 24pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography caption-m`}>
      Lorem ipsum dolor sit amet, consectetur adipiscing
    </div>
  </div>
);

export const CaptionS = () => (
  <div
    style={{
      ...style,
      display: "flex",
      justifyContent: "flex-start",
      gap: "0.25rem",
      flexDirection: "column",
    }}
    className={`typography caption-s`}
  >
    <div
      style={{ lineHeight:"normal",display: "flex", justifyContent: "flex-start", gap: "0.25rem" }}
    >
      Caption S / 20pts
    </div>
    <Divider></Divider>
    <div style={{  lineHeight:"normal",color:"#363636"}} className={`typography caption-s`}>
      Lorem ipsum dolor sit amet, consectetur adipiscing
    </div>
  </div>
);