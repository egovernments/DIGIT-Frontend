import React from "react";
import Button from "../Button";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Button",
  component: Button,
  argTypes: {
    label: {
      control: "text",
      table: { disable: true }
    },
    variation: {
      control: "select",
      options: ["primary", "secondary", "teritiary", "link"],
      table: { disable: true },
    },
    size: { control: "select", options: ["large", "medium", "small"] ,table: { disable: true }},
    className: {
      control: "text",
      table: { disable: true },
    },
    style: {
      control: { type: "object" },
      table: { disable: true },
    },
    onClick: {
      control: "function",
      table: { disable: true },
    },
    title: {
      control: "text",
      table: { disable: true },
    },
    isSearchable: {
      control: "boolean",
      table: { disable: true }
    },
    showBottom: {
      control: "select",
      options: ["DropUp", "DropDown"],
      table: { disable: true },
      name: "ActionButton",
      mapping: {
        DropUp: false,
        DropDown: true,
      },
    },
    optionsKey: {
      control: "text",
      table: { disable: true },
    },
    options: {
      control: {
        type: "array",
        separator: ",",
      },
      table: { disable: true },
    },
    isDisabled: {
      control: "select",
      options: ["Default", "Disabled"],
      name: "state",
      mapping: {
        Default: false,
        Disabled: true,
      },
      table: { disable: true }
    },
    textStyles: { table: { disable: true } },
    iconFill: { table: { disable: true } },
    icon: { table: { disable: true } },
    onOptionSelect: { table: { disable: true } },
    type: { table: { disable: true } },
    WithIcon: {
      control: "boolean",table: { disable: true }
    },
    isSuffix: {
      control: "select",
      options: ["Prefix", "Suffix"],
      name: "Icon",
      mapping: {
        Prefix: false,
        Suffix: true,
      },
      if: { arg: "WithIcon", truthy: true },
      table: { disable: true }
    },
    Width: {
      control: "select",
      options: ["Hug Content", "Justify"],
      table: { disable: true }
    },
  },
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Button Documentation"
  />
);

Documentation.storyName = "Docs";
