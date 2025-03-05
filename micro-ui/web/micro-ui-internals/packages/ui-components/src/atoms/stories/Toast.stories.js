import React, {useState,Fragment, useEffect} from "react";
import Toast from "../Toast";
import Button from "../Button";

export default {
  title: "Atoms/Toast",
  component: Toast,
  argTypes: {
    populators: { control: "object" },
    label: { control: "text" },
    type: {
      control: "select",
      options: ["success", "warning", "error", "info"],
    },
  },
};


const Template = (args) => <Toast {...args} />;

const commonArgs = {
  populators: {
    name: "toast",
  },
  label: "",
  type: "success",
};

export const SuccessToast = Template.bind({});
SuccessToast.args = {
  ...commonArgs,
  label: "Success Toast Message",
  type: "success",
};

export const WarningToast = Template.bind({});
WarningToast.args = {
  ...commonArgs,
  label: "Warning Toast Message",
  type: "warning",
};

export const ErrorToast = Template.bind({});
ErrorToast.args = {
  ...commonArgs,
  label: "Error Toast Message",
  type: "error",
};

export const InfoToast = Template.bind({});
InfoToast.args = {
  ...commonArgs,
  label: "Info Toast Message",
  type: "info",
};

export const SuccessToastWithTransitionTime = Template.bind({});
SuccessToastWithTransitionTime.args = {
  ...commonArgs,
  label: "Success Toast Message",
  type: "success",
  transitionTime: 600000,
};

export const WarningToastWithTransitionTime = Template.bind({});
WarningToastWithTransitionTime.args = {
  ...commonArgs,
  label: "Warning Toast Message",
  type: "warning",
  transitionTime: 600000,
};

export const ErrorToastWithTrnasitionTime = Template.bind({});
ErrorToastWithTrnasitionTime.args = {
  ...commonArgs,
  label: "Error Toast Message",
  type: "error",
  transitionTime: 600000,
};

export const InfoToastWithTrnasitionTime = Template.bind({});
InfoToastWithTrnasitionTime.args = {
  ...commonArgs,
  label: "Info Toast Message",
  type: "info",
  transitionTime: 600000,
};
