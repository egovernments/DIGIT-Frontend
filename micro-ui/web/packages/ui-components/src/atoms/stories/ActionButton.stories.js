import React from "react";
import Button from "../Button";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Action Button",
  component: Button,
  argTypes: {
    label: {
      control: "text",
      name:"Label"
    },
    variation: {
      control: "select",
      options: ["primary", "secondary", "teritiary", "link"],
      table: { disable: true },
    },
    size: {
      control: "select",
      options: ["large", "medium", "small"],
      table: { disable: true },
    },
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
      name:"Searchable"
    },
    showBottom: {
      control: "select",
      options: ["DropUp", "DropDown"],
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
      name: "State",
      mapping: {
        Default: false,
        Disabled: true,
      },
    },
    textStyles: { table: { disable: true } },
    iconFill: { table: { disable: true } },
    icon: { table: { disable: true } },
    onOptionSelect: { table: { disable: true } },
    type: { table: { disable: true } },
    WithIcon: {
      control: "boolean",
      table: { disable: true },
    },
    isSuffix: {
      control: "select",
      options: ["Prefix", "Suffix"],
      name: "Icon",
      mapping: {
        Prefix: false,
        Suffix: true,
      },
      table: { disable: true },
      if: { arg: "WithIcon", truthy: true },
    },
  },
};

const commonStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "#363636",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "translate(-50%, -50%)",
};

const Template = (args) => {
  const { ...restArgs } = args;

  return (
    <div style={{ ...commonStyles }}>
      <Button
        {...restArgs}
        style={{ ...restArgs.style }}
        menuStyles={!args.showBottom ? { bottom: "40px" } : undefined}
      />
    </div>
  );
};

const commonArgs = {
  label: "ActionButton",
  className: "custom-class",
  style: {},
  onClick: () => {
    console.log("clicked");
  },
  isDisabled: "Default",
  variation: "primary",
  size: "large",
  title: "",
  iconFill: "",
  showBottom: "DropDown",
  type: "actionButton",
  optionsKey: "name",
  isSearchable: true,
  options: [
    { name: "Action A", code: "Actiona" },
    { name: "Action B", code: "Actionb" },
    { name: "Action C", code: "Actionc" },
  ],
  onOptionSelect: (e) => {
    console.log(e, "option selected");
  },
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Toggle Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  isDisabled: { table: { disable: true } },
  label: { table: { disable: true }},
  isSearchable: { table: { disable: true }},
  showBottom: {table: { disable: true } },
};

export const Primary = Template.bind({});
Primary.args = {
  ...commonArgs,
};

export const Secondary = Template.bind({});
Secondary.args = {
  ...commonArgs,
  variation:"secondary"
};

export const Teritiary = Template.bind({});
Teritiary.args = {
  ...commonArgs,
  variation: "teritiary",
};

export const Link = Template.bind({});
Link.args = {
  ...commonArgs,
  variation: "link",
};