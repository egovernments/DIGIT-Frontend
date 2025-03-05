import React from "react";
import { Animation } from "../../atoms";
import successAnimation from "../../constants/animations/success.json";
import errorAnimation from "../../constants/animations/error.json";
import newSceneAnimation from "../../constants/animations/newScene.json";
import warningOutlineAnimation from "../../constants/animations/warningOutline.json";

export default {
  title: "Animations",
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
      background: "black",
      width: "100%",
      height: "300px",
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
  loop: false,
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

export const NewSceneAnimation = Template.bind({});
NewSceneAnimation.args = {
  ...commonArgs,
  animationData: newSceneAnimation,
};

export const WarningOutlineAnimation = Template.bind({});
WarningOutlineAnimation.args = {
  ...commonArgs,
  animationData: warningOutlineAnimation,
};