import React, { Children } from "react";
import ErrorMessage from "../ErrorMessage";
import { truncate } from "lodash";

export default {
  title: "Atoms/ErrorMessage",
  component: ErrorMessage,
  argTypes: {
    wrapperClassName: {
      control: "text",
    },
    wrapperStyles: {
      control: { type: "object" },
    },
    showIcon: {
      control: "boolean",
    },
    iconStyles: {
      control: { type: "object" },
    },
    message: {
      control: "text",
    },
    className: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    truncateMessage: {
      control: "boolean",
    },
    maxLength:{
      control:"text"
    }
  },
};

const Template = (args) => <ErrorMessage {...args} />;

const commonArgs = {
  wrapperClassName: "",
  wrapperStyles: {},
  showIcon: false,
  iconStyles: {},
  message: "",
  className: "",
  style: {},
  truncateMessage:false,
  maxLength:""
};

// Default ErrorMessage
export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  message: "Error Message",
};

// ErrorMessage with icon
export const WithIcon = Template.bind({});
WithIcon.args = {
  ...commonArgs,
  message: "Error Message With Icon",
  showIcon: true,
};

// ErrorMessage with icon
export const WithTruncateMessage = Template.bind({});
WithTruncateMessage.args = {
  ...commonArgs,
  message: "Error with truncateMessage as true",
  showIcon: true,
  truncateMessage:true,
  maxLength:10
};