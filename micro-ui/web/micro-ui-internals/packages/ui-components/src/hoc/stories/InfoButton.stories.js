import React from "react";
import { InfoButton } from "../../atoms";

export default {
  title: "Atom-Groups/InfoButton",
  component: InfoButton,
  argTypes: {
    isDisabled: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    infobuttontype: { control: "select", options: ["info", "error", "success", "warning"] },
    size: { control: "select", options: ["large", "medium", "small"] },
    className: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    onClick: {
      control: "function",
    },
    isSuffix: {
      control: "boolean",
    },
  },
};

const Template = (args) => <InfoButton {...args} />;

const commonArgs = {
  label: "Button",
  className: "custom-class",
  style: {},
  onClick: () => console.log("clicked"),
  isDisabled: false,
  infobuttontype: "",
  isSuffix: false,
  size:""
};


export const Infobutton = Template.bind({});
Infobutton.args = {
  ...commonArgs,
  infobuttontype: "info",
};


export const Successbutton = Template.bind({});
Successbutton.args = {
  ...commonArgs,
  infobuttontype: "success",
};


export const Warningbutton = Template.bind({});
Warningbutton.args = {
  ...commonArgs,
  infobuttontype: "warning",
};


export const Errorbutton = Template.bind({});
Errorbutton.args = {
  ...commonArgs,
  infobuttontype: "error",
};
