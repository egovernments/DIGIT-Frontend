import React, { useState, Fragment, useEffect } from "react";
import Toast from "../Toast";
import Button from "../Button";
import Iframe from "../Iframe";

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

const Template = (args) => (
  <div
    style={{
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Toast {...args} />
  </div>
);

const commonArgs = {
  populators: {
    name: "toast",
  },
  label: "",
  type: "success",
  style: { left: "25%" },
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Toast Documentation"
  />
);

Documentation.storyName = "Docs";

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