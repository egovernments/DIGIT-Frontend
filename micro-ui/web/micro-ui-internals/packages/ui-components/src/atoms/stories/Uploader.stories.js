import React from "react";
import Uploader from "../Uploader";

export default {
  title: "Atoms/Uploader",
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
        options: ["uploadFile", "uploadPopup", "uploadImage"],
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

const Template = (args) => <Uploader {...args} />;

export const UploadFile = Template.bind({});
UploadFile.args = {
  uploadedFiles: [],
  variant: "uploadFile",
};

export const UploadFileWithTags = Template.bind({});
UploadFileWithTags.args = {
  uploadedFiles: [],
  variant: "uploadFile",
  showAsTags: true,
  multiple: true,
};

export const UploadFileWithTagsAndOnUploadLogic = Template.bind({});
UploadFileWithTagsAndOnUploadLogic.args = {
  uploadedFiles: [],
  variant: "uploadFile",
  showAsTags: true,
  multiple: true,
  onUpload: (uploadedFiles) => {
    return uploadedFiles.map((file) => ({
      file,
      error: "Error!",
    }));
  },
};

export const UploadFileWithTagsValidations = Template.bind({});
UploadFileWithTagsValidations.args = {
  uploadedFiles: [],
  variant: "uploadFile",
  multiple: true,
  showAsTags: true,
  validations: {
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1,
  },
};

export const UploadFileWithPreview = Template.bind({});
UploadFileWithPreview.args = {
  uploadedFiles: [],
  variant: "uploadFile",
  showAsPreview: true,
  multiple: true,
};

export const UploadFileWithPreviewAndonUploadLogic = Template.bind({});
UploadFileWithPreviewAndonUploadLogic.args = {
  uploadedFiles: [],
  variant: "uploadFile",
  showAsPreview: true,
  multiple: true,
  onUpload: (uploadedFiles) => {
    return uploadedFiles.map((file) => ({
      file,
      error: "Error!",
    }));
  },
};

export const UploadFileWithPreviewValidations = Template.bind({});
UploadFileWithPreviewValidations.args = {
  uploadedFiles: [],
  variant: "uploadFile",
  showAsPreview: true,
  multiple: true,
  validations: {
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1,
  },
};



export const UploadFileWithError = Template.bind({});
UploadFileWithError.args = {
  uploadedFiles: [],
  variant: "uploadFile",
  iserror: "Component Level Error!",
};

export const UploadPopup = Template.bind({});
UploadPopup.args = {
  uploadedFiles: [],
  variant: "uploadPopup",
  showDownloadButton: true,
  showReUploadButton: true,
  multiple: false,
};

export const UploadPopupWithValidations = Template.bind({});
UploadPopupWithValidations.args = {
  uploadedFiles: [],
  variant: "uploadPopup",
  multiple: true,
  validations: {
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1,
  },
  showDownloadButton: true,
  showReUploadButton: true,
};

export const UploadPopupWithValidationsWithErrorCard = Template.bind({});
UploadPopupWithValidationsWithErrorCard.args = {
  uploadedFiles: [],
  variant: "uploadPopup",
  multiple: true,
  validations: {
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1,
  },
  showErrorCard: true,
  showDownloadButton: true,
  showReUploadButton: true,
};

export const UploadPopupWithError = Template.bind({});
UploadPopupWithError.args = {
  uploadedFiles: [],
  variant: "uploadPopup",
  showDownloadButton: true,
  showReUploadButton: true,
  multiple: false,
  iserror:"Component level error!"
};

export const UploadImage = Template.bind({});
UploadImage.args = {
  uploadedFiles: [],
  variant: "uploadImage",
};

export const UploadMultipleImages = Template.bind({});
UploadMultipleImages.args = {
  uploadedFiles: [],
  variant: "uploadImage",
  multiple: true,
};

export const UploadMultipleImagesWithValidations = Template.bind({});
UploadMultipleImagesWithValidations.args = {
  uploadedFiles: [],
  variant: "uploadImage",
  multiple: true,
  validations: {
    maxSizeAllowedInMB: 5,
    minSizeRequiredInMB: 1,
  },
};