import React from "react";
import FileUpload from "../FileUpload";

export default {
  title: "Atoms/FileUpload/Uploader Widget",
  component: FileUpload,
  argTypes: {
    uploadedFiles: {
      control: {
        type: "object",
      },
    },
    variant: {
      control: {
        type: "select",
        options: ["uploadField", "uploadWidget", "uploadImage"],
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
    showAsTags: {
      control: "boolean",
    },
    showAsPreview: {
      control: "boolean",
    },
    additionalElements: {
      control: "array",
    },
    validations: {
      control: "object",
    },
    showErrorCard: {
      control: "boolean",
    },
    showReUploadButton: {
      control: "boolean",
    },
    showDownloadButton: {
      control: "boolean",
    },
    onUpload: {
      control: "function",
    },
  },
};

const Template = (args) => <FileUpload {...args} />;


export const SingleUpload = Template.bind({});
SingleUpload.args = {
  uploadedFiles: [],
  variant: "uploadWidget",
  showDownloadButton: true,
  showReUploadButton: true,
  multiple: false,
};

export const WithValidations = Template.bind({});
WithValidations.args = {
  uploadedFiles: [],
  variant: "uploadWidget",
  multiple: true,
  validations: {
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1,
  },
  showDownloadButton: true,
  showReUploadButton: true,
};

export const WithValidationsWithErrorCard = Template.bind({});
WithValidationsWithErrorCard.args = {
  uploadedFiles: [],
  variant: "uploadWidget",
  multiple: true,
  validations: {
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1,
  },
  showErrorCard: true,
  showDownloadButton: true,
  showReUploadButton: true,
};

export const Error = Template.bind({});
Error.args = {
  uploadedFiles: [],
  variant: "uploadWidget",
  showDownloadButton: true,
  showReUploadButton: true,
  multiple: false,
  iserror:"Component level error!"
};