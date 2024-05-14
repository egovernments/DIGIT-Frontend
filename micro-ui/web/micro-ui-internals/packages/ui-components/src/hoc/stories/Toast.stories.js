import React from "react";
import { Toast } from "../../atoms";

export default {
  title: "Atom-Groups/Toast",
  component: Toast,
  argTypes: {
    populators: { control: "object" },
    label: { control: "text" },
    error: { control: "boolean" },
  },
};

const Template = (args) => <Toast {...args} />;

const commonArgs = {
  populators: {
    name: "toast",
  },
  label: "",
  error: false,
  warning: "",
  info: false,
};

export const SuccessToast = Template.bind({});
SuccessToast.args = {
  ...commonArgs,
  label: "Success Toast Message",
};

export const WarningToast = Template.bind({});
WarningToast.args = {
  ...commonArgs,
  label: "Warning Toast Message",
  warning: "warning",
};

export const ErrorToast = Template.bind({});
ErrorToast.args = {
  ...commonArgs,
  label: "Error Toast Message",
  error: true,
};

export const InfoToast = Template.bind({});
InfoToast.args = {
  ...commonArgs,
  label: "Info Toast Message",
  info: true,
};

export const SuccessToastWithTransitionTime = Template.bind({});
SuccessToastWithTransitionTime.args = {
  ...commonArgs,
  label: "Success Toast Message",
  transitionTime: 600000,
};

export const WarningToastWithTransitionTime = Template.bind({});
WarningToastWithTransitionTime.args = {
  ...commonArgs,
  label: "Warning Toast Message",
  warning: "warning",
  transitionTime: 600000,
};

export const ErrorToastWithTrnasitionTime = Template.bind({});
ErrorToastWithTrnasitionTime.args = {
  ...commonArgs,
  label: "Error Toast Message",
  error: true,
  transitionTime: 600000,
};

export const InfoToastWithTrnasitionTime = Template.bind({});
InfoToastWithTrnasitionTime.args = {
  ...commonArgs,
  label: "Info Toast Message",
  info: true,
  transitionTime: 600000,
};
