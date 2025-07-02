import React from "react";
import FileUpload from "../FileUpload";

export default {
  title: "Atoms/FileUpload/Uploader Field",
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
  variant: "uploadField",
};

export const UploadFileWithTags = Template.bind({});
UploadFileWithTags.args = {
  uploadedFiles: [],
  variant: "uploadField",
  showAsTags: true,
  multiple: true,
};

export const WithTagsAndOnUploadLogic = Template.bind({});
WithTagsAndOnUploadLogic.args = {
  uploadedFiles: [],
  variant: "uploadField",
  showAsTags: true,
  multiple: true,
  onUpload: (uploadedFiles) => {
    return uploadedFiles.map((file) => ({
      file,
      error: "Error!",
    }));
  },
};

export const WithTagsValidations = Template.bind({});
WithTagsValidations.args = {
  uploadedFiles: [],
  variant: "uploadField",
  multiple: true,
  showAsTags: true,
  validations: {
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1,
  },
};

export const WithPreview = Template.bind({});
WithPreview.args = {
  uploadedFiles: [],
  variant: "uploadField",
  showAsPreview: true,
  multiple: true,
};

export const WithPreviewAndOnUploadLogic = Template.bind({});
WithPreviewAndOnUploadLogic.args = {
  uploadedFiles: [],
  variant: "uploadField",
  showAsPreview: true,
  multiple: true,
  onUpload: (uploadedFiles) => {
    return uploadedFiles.map((file) => ({
      file,
      error: "Error!",
    }));
  },
};

export const WithPreviewValidations = Template.bind({});
WithPreviewValidations.args = {
  uploadedFiles: [],
  variant: "uploadField",
  showAsPreview: true,
  multiple: true,
  validations: {
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1,
  },
};

export const Error = Template.bind({});
Error.args = {
  uploadedFiles: [],
  variant: "uploadField",
  iserror: "Component Level Error!",
};
