import React from "react";
import { Button } from "../../atoms";

export default {
  title: "Atom-Groups/ButtonField",
  component: Button,
  argTypes: {
    isDisabled: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    variation:{control:"select", options:["primary","secondary","teritiary","link"]},
    className: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    onClick: {
      control: "function",
    },
    isSuffix:{
      control:"boolean"
    }
  },
};

const Template = (args) => <Button {...args} />;

const commonArgs ={
  label: "Button",
  className: "custom-class",
  style: {},
  onClick: () => console.log("clicked"),
  isDisabled:false,
  variation:"primary",
  isSuffix:false
}


export const Primary = Template.bind({});
Primary.args = {
  ...commonArgs,
  variation:"primary"
};

export const PrimaryWithIcon = Template.bind({});
PrimaryWithIcon.args = {
  ...commonArgs,
  variation:"primary",
  icon:"MyLocation"
};

export const PrimaryWithSuffixIcon = Template.bind({});
PrimaryWithSuffixIcon.args = {
  ...commonArgs,
  variation:"primary",
  icon:"ArrowForward",
  isSuffix:true
};

export const PrimarydDisabled = Template.bind({});
PrimarydDisabled.args = {
  ...commonArgs,
  variation:"primary",
  isDisabled:true
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...commonArgs,
  variation:"secondary"
};

export const SecondaryWithIcon = Template.bind({});
SecondaryWithIcon.args = {
  ...commonArgs,
  variation:"secondary",
  icon:"MyLocation"
};

export const SecondaryWithSuffixIcon = Template.bind({});
SecondaryWithSuffixIcon.args = {
  ...commonArgs,
  variation:"secondary",
  icon:"ArrowForward",
  isSuffix:true
};

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  ...commonArgs,
  variation:"secondary",
  isDisabled:true
};

export const Teritiary = Template.bind({});
Teritiary.args = {
  ...commonArgs,
  variation:"teritiary"
};

export const TeritiaryWithIcon = Template.bind({});
TeritiaryWithIcon.args = {
  ...commonArgs,
  variation:"teritiary",
  icon:"MyLocation"
};

export const TeritiaryWithSuffixIcon = Template.bind({});
TeritiaryWithSuffixIcon.args = {
  ...commonArgs,
  variation:"teritiary",
  icon:"ArrowForward",
  isSuffix:true
};

export const TeritiaryDisabled = Template.bind({});
TeritiaryDisabled.args = {
  ...commonArgs,
  variation:"teritiary",
  isDisabled:true
};

export const Link = Template.bind({});
Link.args = {
  ...commonArgs,
  variation:"link",
  label:"Link"
};

export const LinkWithIcon = Template.bind({});
LinkWithIcon.args = {
  ...commonArgs,
  variation:"link",
  label:"Link",
  icon:"MyLocation"
};

export const LinkWithSuffixIcon = Template.bind({});
LinkWithSuffixIcon.args = {
  ...commonArgs,
  variation:"link",
  label:"Link",
  icon:"ArrowForward",
  isSuffix:true
};

export const LinkDisabled = Template.bind({});
LinkDisabled.args = {
  ...commonArgs,
  variation:"link",
  label:"Link",
  isDisabled:true
};