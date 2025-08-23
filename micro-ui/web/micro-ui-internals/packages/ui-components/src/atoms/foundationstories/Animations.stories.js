import React from "react";
import { Animation } from "../../atoms";
import successAnimation from "../../constants/animations/success.json";
import errorAnimation from "../../constants/animations/error.json";
import warning2Animation from "../../constants/animations/warningOutline2.json";
import warningAnimation from "../../constants/animations/warningOutline.json";
import theLoaderPrimary from '../../constants/animations/theLoaderPrimary.json';
import theLoaderPrimary2 from '../../constants/animations/theLoaderPrimary2.json';
import theLoaderWhite from '../../constants/animations/theLoaderWhite.json';

export default {
  title: "Foundations/Animations",
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
      background: "#D6D5D4",
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

export const Success = Template.bind({});
Success.args = {
  ...commonArgs,
  animationData: successAnimation,
};

export const Error = Template.bind({});
Error.args = {
  ...commonArgs,
  animationData: errorAnimation,
};

export const Warning = Template.bind({});
Warning.args = {
  ...commonArgs,
  animationData: warningAnimation,
};

export const Warning2 = Template.bind({});
Warning2.args = {
  ...commonArgs,
  animationData: warning2Animation,
};

export const LoaderPrimary = Template.bind({});
LoaderPrimary.args = {
  ...commonArgs,
  animationData: theLoaderPrimary,
};

export const LoaderPrimary2 = Template.bind({});
LoaderPrimary2.args = {
  ...commonArgs,
  animationData: theLoaderPrimary2,
};

export const LoaderWhite = Template.bind({});
LoaderWhite.args = {
  ...commonArgs,
  animationData: theLoaderWhite,
};