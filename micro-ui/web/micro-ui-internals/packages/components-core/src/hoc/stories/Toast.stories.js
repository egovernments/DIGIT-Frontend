import React from "react";
import { Toast } from "../../atoms";

export default {
  title: "Atom-Groups/Toast",
  component: Toast,
};

const Template = (args) => <Toast {...args} />;

const commonArgs = {
    populators: {
      name: "toast",
    },
    label: "",
    error: "",
    warning:"",
    tarnsitionTime: 50000
  };
  
  export const SuccessToast = Template.bind({});
  SuccessToast.args = {
    ...commonArgs,
    label:"Success Toast Message"
  };
  
  export const WarningToast = Template.bind({});
  WarningToast.args = {
    ...commonArgs,
    label: "Warning Toast Message",
    warning:"warning",
  };

  
  export const ErrorToast = Template.bind({});
  ErrorToast.args = {
    ...commonArgs,
    label: "Error Toast Message",
    error:true
  };