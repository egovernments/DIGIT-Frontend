import React from "react";
import { action } from "@storybook/addon-actions";
import Uploader from "../../atoms/Uploader";

export default {
  title: "Atom-Groups/Uploader",
  component: Uploader,
  argTypes: {
    uploadedFiles: {
      control: {
        type: "object",
      },
    },
    variant: {
        control: {
          type: "select",
          options: ["uploadFile","uploadPopup"],
        },
      },
      showLabel: {
        control: "boolean",
      },
    showHint: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    hintText: {
      control: "text",
    },
    iserror: {
      control: "text",
    },
    customClass: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
    disableButton: {
      control: "boolean",
    },
    buttonType: {
      control: {
        type: "select",
        options: ["button", "submit", "reset"],
      },
    },
    inputStyles: {
      control: "object",
    },
    extraStyles: {
      control: "object",
    },
    id: {
      control: "text",
    },
    multiple: {
      control: "boolean",
    },
    accept: {
      control: "text",
    },
    showAsTags:{
      control:"boolean"
    },
    showAsPreview:{
      control:"boolean"
    }
  },
};

const Template = (args) => <Uploader {...args} />;


export const Default = Template.bind({});
Default.args = {
  uploadedFiles: [],
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  uploadedFiles: [],
  showLabel: true,
  label: "Upload Documents",
};

export const WithCustomHint = Template.bind({});
WithCustomHint.args = {
  uploadedFiles: [],
  showHint: true,
  hintText: "Hint Text",
};

export const WithError = Template.bind({});
WithError.args = {
  uploadedFiles: [],
  iserror: "File size exceeded the limit",
};
