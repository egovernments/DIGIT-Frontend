import React from "react";
import { InfoCard } from "../../atoms";
import {Button} from "../../atoms";

export default {
  title: "Atom-Groups/InfoCard",
  component: InfoCard,
  argTypes: {
    label: {
      control: "text",
    },
    variant: { control: "select", options: ["default", "success", "warning", "error"] },
    text: { control: "text" },
    style: {
        control: "object",
    },
    textStyle: {
      control: "object",
  },
    additionalElements: {
      control: {
        type: "array",
        separator: ",",
      },
    },
  },
};

const Template = (args) => <InfoCard {...args} />;

const commonArgs = {
  label: "Info",
  text:
    "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment.",
    variant: "default",
};

// Info default
export const Info = Template.bind({});
Info.args = {
  ...commonArgs,
};

// Info with additional elements
export const InfoWithAdditionalElements = Template.bind({});
InfoWithAdditionalElements.args = {
  ...commonArgs,
  additionalElements: [
    <p key="1">Additional Element 1</p>,
    <img key="2" src="https://digit.org/wp-content/uploads/2023/06/Digit-Logo-1.png" alt="Additional Element 2" />,
    // <img key="2" src="https://egov-website-content.s3.ap-south-1.amazonaws.com/wp-content/uploads/2022/08/29093012/core-digit-web.png" alt="Additional Element 2" />,
    <img key="2" src="https://store-images.s-microsoft.com/image/apps.65390.de79d184-f01a-4f7f-86a0-973923703d85.587613a3-c0da-45fe-a245-2564e595eba1.ae394e50-d730-453a-8a16-4e8d263b326b" alt="Additional Element 2" />,
    // <img key="2" src="https://2650579244-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-Mj5Rt0VXmfqKdJwsrck%2Fuploads%2FrBdhHqYV0NWliG3H3CEf%2Fimage.png?alt=media&token=a7d39f47-52e0-41e8-b70e-4db172963a28" alt="Additional Element 2" />,
    <Button variation="default" label ="Button" />,
    // Add more elements as needed
  ],
};

// Info Success
export const InfoSuccess = Template.bind({});
InfoSuccess.args = {
  ...commonArgs,
  label: "Success",
  variant: "success",
};

// Info Warning
export const InfoWarning = Template.bind({});
InfoWarning.args = {
  ...commonArgs,
  label: "Warning",
  variant: "warning",
};

// Info Error
export const InfoError = Template.bind({});
InfoError.args = {
  ...commonArgs,
  label: "Error",
  variant: "error",
};
