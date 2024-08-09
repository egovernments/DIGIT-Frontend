import React from "react";
import { action } from "@storybook/addon-actions";
import Chip from "../Chip";

export default {
  title: "Atoms/Chip",
  component: Chip,
  argTypes: {
    className: {
      control: "text",
    },
    text: {
      control: "text",
    },
    onClick: {
      control: "function",
    },
    onTagClick: {
      control: "function",
    },
    extraStyles: {
      control: { type: "object" },
    },
    disabled: {
      control: "boolean",
    },
    isErrorTag: {
      control: "boolean",
    },
    error: {
      control: "text",
    },
  },
};

const Template = (args) => (
  <div className="digit-tag-container">
    <Chip {...args} />
  </div>
);

const commonArgs = {
  text: "Button",
  className: "",
  extraStyles: {},
  onClick: () => console.log("Close icon is clicked"),
  onTagClick: () => console.log("Tag is clicked"),
  disabled: false,
  isErrorTag: false,
  error: "",
};

export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  text: "Chips",
};

export const ErrorTag = Template.bind({});
ErrorTag.args = {
  ...commonArgs,
  text: "ErrorChips",
  isErrorTag:true
};

export const ErrorTagWithError = Template.bind({});
ErrorTagWithError.args = {
  ...commonArgs,
  text: "ErrorChipsWithError",
  isErrorTag:true,
  error:"ErrorMessage"
};

export const DisabledTag = Template.bind({});
DisabledTag.args = {
  ...commonArgs,
  text: "DisabledChips",
  disabled:true
};