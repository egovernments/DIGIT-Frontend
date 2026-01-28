import React from "react";
import Switch from "../Switch";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Switch",
  component: Switch,
  argTypes: {
    isLabelFirst: {
      control: "select",
      name: "Label Alignment",
      options: ["Left", "Right"],
      mapping: {
        Left: true,
        Right: false,
      },
    },
    label: {
      control: "boolean",
      name: "Label",
      mapping: {
        true: "Label",
        false: "",
      },
    },
    shapeOnOff: { control: "boolean", table: { disable: true } },
    isCheckedInitially: { control: "boolean", table: { disable: true } },
    onToggle: { action: "onToggle", table: { disable: true } },
    className: { control: "text", table: { disable: true } },
    style: { control: "object", table: { disable: true } },
    switchStyle: { control: "object", table: { disable: true } },
    disable: {
      control: "select",
      name: "State",
      options: ["Default", "Disabled"],
    },
  },
};

const Template = (args) => {
  const {disable,...rest} = args;

  return <Switch {...rest} disable={disable === "Disabled"} />;
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Switch Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  disable: { table: { disable: true } },
  label: { table: { disable: true }},
  isLabelFirst: { table: { disable: true }},
};

const commonArgs = {
  isLabelFirst: "Right",
  shapeOnOff: false,
  label: false,
  isCheckedInitially: false,
  disable:"Default"
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
};

export const WithSymbol = Template.bind({});
WithSymbol.args = {
  ...commonArgs,
  shapeOnOff: true,
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  switchStyle: {
    backgroundColor: "green",
  },
};