import React from "react";
import { action } from "@storybook/addon-actions";
import RemoveableTag from "../../atoms/RemoveableTag";

export default {
  title: "Atom-Groups/RemoveableTag",
  component: RemoveableTag,
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
      control: "boolean",
    },
  },
};

const Template = (args) => (
  <div className="digit-tag-container">
    <RemoveableTag {...args} />
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
  text: "RemoveableTag",
};

export const ErrorTag = Template.bind({});
ErrorTag.args = {
  ...commonArgs,
  text: "RemoveableErrorTag",
  isErrorTag:true
};

export const ErrorTagWithError = Template.bind({});
ErrorTagWithError.args = {
  ...commonArgs,
  text: "RemoveableErrorTag",
  isErrorTag:true,
  error:"ErrorMessage"
};

export const DisabledTag = Template.bind({});
DisabledTag.args = {
  ...commonArgs,
  text: "RemoveableTag",
  disabled:true
};