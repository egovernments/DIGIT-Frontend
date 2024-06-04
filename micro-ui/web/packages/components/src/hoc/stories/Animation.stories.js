import React from "react";
import { Animation } from "../../atoms";
import successAnimation from "../../animations/success.json";
import errorAnimation from "../../animations/error.json";

export default {
  title: "Atom-Groups/Animation",
  component: Animation,
  argTypes: {
    loop: {
      control: "boolean",
    },
    autoplay: {
      control: "boolean",
    },
    animationData: {
      control: { type: "object" },
    },
    width: {
      control: "number",
    },
    height: {
      control: "number",
    },
  },
};

const Template = (args) => (
  <div
    style={{
      background: "#00703C",
      width: "100%",
      height: "100px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {" "}
    <Animation {...args} />{" "}
  </div>
);

const commonArgs = {
  animationData: {},
  loop: true,
  autoplay: true,
  width: 74,
  height: 74,
};

export const SuccessAnimation = Template.bind({});
SuccessAnimation.args = {
  ...commonArgs,
  animationData: successAnimation,
};

export const ErrorAnimation = Template.bind({});
ErrorAnimation.args = {
  ...commonArgs,
  animationData: errorAnimation,
};
