import React from "react";
import BackLink from "../BackLink";

export default {
  title: "Atoms/BackLink",
  component: BackLink,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "teritiary"],
    },
    className: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    onClick: {
      control: "function",
    },
    disabled: {
      control: "boolean",
    },
    hideLabel:{
        control:"boolean"
    },
    hideIcon:{
        control:"boolean"
    },
    iconFill: {
      control: "text",
    },
  },
};

const Template = (args) => <BackLink {...args} />;

const commonArgs = {
  className: "",
  style: {},
  onClick: () => console.log("clicked"),
  disabled: false,
  variant: "",
  hideIcon:false,
  hideLabel:false,
  iconFill:""
};

export const Primary = Template.bind({});
Primary.args = {
  ...commonArgs,
  variant: "primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...commonArgs,
  variant: "secondary",
};

export const Teritiary = Template.bind({});
Teritiary.args = {
  ...commonArgs,
  variant: "teritiary",
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...commonArgs,
  variant: "primary",
  disabled:true
};
