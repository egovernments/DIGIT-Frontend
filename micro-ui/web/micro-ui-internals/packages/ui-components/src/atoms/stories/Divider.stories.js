import React from "react";
import Divider from "../Divider";

export default {
  title: "Atoms/Divider",
  component: Divider,
  argTypes: {
    className: {
      control: "boolean",
    },
    style: {
      control: { type: "object" },
    },
    variant: {
        control: "select",
        options: ["small", "medium", "large"],
      },
  },
};

const Template = (args) => (
  <div>
    <Divider {...args}></Divider>
</div>
);

const commonArgs = {
    variant:"",
  className: "",
  style: {},
};

export const Small = Template.bind({});
Small.args = {
  ...commonArgs,
  variant:"small"
};

export const Medium = Template.bind({});
Medium.args = {
  ...commonArgs,
  variant:"medium"
};

export const Large = Template.bind({});
Large.args = {
  ...commonArgs,
  variant:"large"
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  variant:"large",
  style:{
    border:"10px solid #0B4B66"
  }
};