import React from "react";
import AlertCard from "../AlertCard";
import TextArea from "../TextArea";
import InfoButton from "../InfoButton";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Alert Card",
  component: AlertCard,
  argTypes: {
    label: {
      control: "text",
      table: { disable: true },
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error"],
      table: { disable: true },
    },
    text: { control: "text", table: { disable: true } },
    style: {
      control: "object",
      table: { disable: true },
    },
    textStyle: {
      control: "object",
      table: { disable: true },
    },
    additionalElements: {
      control: "boolean",
      table: { disable: true },
    },
    inline: {
      control: "select",
      options: ["Default", "Inline"],
      name: "Widgets Alignment",
      mapping: {
        Default: false,
        Inline: true,
      },
    },
    WithAction: {
      control: "boolean",
      name:"With Action"
    },
    WithWidgets: {
      control: "boolean",
      name:"With Widgets"
    }
  },
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

const additionalElementsWithAction = [
  ...additionalElements,
  <InfoButton size="large" isDisabled={false} label={"Button"}></InfoButton>,
];

const actionWidget = [
  <InfoButton size="large" isDisabled={false} label={"Button"}></InfoButton>,
];

const Template = ({ WithWidgets, WithAction, ...args }) => (
  <AlertCard
    {...args}
    additionalElements={
      WithWidgets && WithAction
        ? additionalElementsWithAction
        : !WithAction && WithWidgets
        ? additionalElements
        : WithAction && !WithWidgets
        ? actionWidget
        : []
    }
  />
);

const commonArgs = {
  label: "Info",
  text:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  variant: "default",
  WithWidgets: false,
  inline: "Default",
  WithAction:false
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="AlertCard Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  inline: { table: { disable: true } },
  WithAction: { table: { disable: true }},
  WithWidgets: {table:{disable:true}}
};

export const Info = Template.bind({});
Info.args = {
  ...commonArgs,
};

export const Success = Template.bind({});
Success.args = {
  ...commonArgs,
  variant: "success",
  label: "Success",
};

export const Warning = Template.bind({});
Warning.args = {
  ...commonArgs,
  label: "Warning",
  variant: "warning",
};

export const Error = Template.bind({});
Error.args = {
  ...commonArgs,
  label: "Error",
  variant: "error",
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  label: "Custom",
  style:{
    border:"3px solid black",
    backgroundColor:"#ffffff"
  }
};
