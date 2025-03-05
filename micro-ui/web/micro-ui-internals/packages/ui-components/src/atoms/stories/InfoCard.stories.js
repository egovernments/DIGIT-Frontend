import React from "react";
import InfoCard from "../InfoCard";
import TextArea from "../TextArea";
import InfoButton from "../InfoButton";

export default {
  title: "Atoms/InfoCard",
  component: InfoCard,
  argTypes: {
    label: {
      control: "text",
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error"],
    },
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
    inline: {
      control: "boolean",
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

const additionalElements = [
  <p key="1">Additional Element 1</p>,
  <img
    key="2"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 2"
  />,
  <img
    key="3"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 3"
  />,
  <img
    key="4"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 4"
  />,
  <img
    key="5"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 5"
  />,
  <img
    key="6"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 6"
  />,
  <img
    key="7"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 7"
  />,
  <img
    key="8"
    src="https://digit.org/wp-content/uploads/2023/06/Digit-Logo-1.png"
    alt="Additional Element 8"
  />,
  <TextArea
    type="textarea"
    disabled={false}
    populators={{ resizeSmart: true }}
  ></TextArea>,
];

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
    ...additionalElements,
    <InfoButton label={"Button"} size="large" isDisabled={false}></InfoButton>,
  ],
};

// Info Success
export const InfoSuccess = Template.bind({});
InfoSuccess.args = {
  ...commonArgs,
  label: "Success",
  variant: "success",
};
InfoSuccess.argTypes = {
  variant: { control: { disable: true } },
};

// InfoSuccess with additional elements
export const InfoSuccessWithAdditionalElements = Template.bind({});
InfoSuccessWithAdditionalElements.args = {
  ...commonArgs,
  additionalElements: [
    ...additionalElements,
    <InfoButton
      size="large"
      isDisabled={false}
      infobuttontype={"success"}
      label={"Button"}
    ></InfoButton>,
  ],
  label: "Success",
  variant: "success",
};
InfoSuccessWithAdditionalElements.argTypes = {
  variant: { control: { disable: true } },
};

// Info Warning
export const InfoWarning = Template.bind({});
InfoWarning.args = {
  ...commonArgs,
  label: "Warning",
  variant: "warning",
};
InfoWarning.argTypes = {
  variant: { control: { disable: true } },
};

// InfoWarning with additional elements
export const InfoWarningWithAdditionalElements = Template.bind({});
InfoWarningWithAdditionalElements.args = {
  ...commonArgs,
  additionalElements: [
    ...additionalElements,
    <InfoButton
      size="large"
      isDisabled={false}
      infobuttontype={"warning"}
      label={"Button"}
    ></InfoButton>,
  ],
  label: "Warning",
  variant: "warning",
};
InfoWarningWithAdditionalElements.argTypes = {
  variant: { control: { disable: true } },
};

// Info Error
export const InfoError = Template.bind({});
InfoError.args = {
  ...commonArgs,
  label: "Error",
  variant: "error",
};
InfoError.argTypes = {
  variant: { control: { disable: true } },
};

// InfoError with additional elements
export const InfoErrorWithAdditionalElements = Template.bind({});
InfoErrorWithAdditionalElements.args = {
  ...commonArgs,
  additionalElements: [
    ...additionalElements,
    <InfoButton
      size="large"
      isDisabled={false}
      infobuttontype={"error"}
      label={"Button"}
    ></InfoButton>,
  ],
  label: "Error",
  variant: "error",
};
InfoErrorWithAdditionalElements.argTypes = {
  variant: { control: { disable: true } },
};
