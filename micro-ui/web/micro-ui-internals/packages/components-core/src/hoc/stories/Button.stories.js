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
    variation: {
      control: "text",
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
  },
};

const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Button",
  className: "custom-class",
  style: {},
  onClick: () => console.log("clicked"),
  isDisabled:false,
  variation:"primary"
};

