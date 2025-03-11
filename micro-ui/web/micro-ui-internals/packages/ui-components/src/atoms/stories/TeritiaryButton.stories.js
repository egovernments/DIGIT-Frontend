import React from "react";
import Button from "../Button";

export default {
  title: "Atoms/Button/Teritiary",
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
    size: { control: "select", options: ["large", "medium", "small"],name:"Size" },
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
      control: "boolean",table: { disable: true },
    },
    showBottom: {
      control: "select",
      options: ["DropUp", "DropDown"],
      name: "ActionButton",
      mapping: {
        DropUp: false,
        DropDown: true,
      },
      table: { disable: true },
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
    },
    isSuffix: {
      control: "select",
      options: ["Prefix", "Suffix"],
      name: "Icon",
      mapping: {
        Prefix: false,
        Suffix: true,
      },
      if: { arg: "WithIcon", truthy: true}, 
    },
    Width: {
      control: "select",
      options: ["Hug Content", "Justify"],
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
  const { WithIcon, isSuffix, Width, ...restArgs } = args;

  const widthStyles =
    Width === "Hug Content"
      ? { width: "auto", whiteSpace: "nowrap" }
      : { width: "100%" };

  return (
    <div
      style={{ ...commonStyles, width: Width === "Justify" ? "100%" : "auto" }}
    >
      <Button
        {...restArgs}
        style={{ ...restArgs.style, ...widthStyles }}
        icon={WithIcon ? (isSuffix ? "ArrowForward" : "ArrowBack") : ""}
        isSuffix={WithIcon && isSuffix}
        menuStyles={!args.showBottom ? { bottom: "40px" } : undefined}
      />
    </div>
  );
};

const commonArgs = {
  label: "Button",
  className: "custom-class",
  style: {},
  onClick: () => {
    console.log("clicked");
  },
  isDisabled: "Default",
  variation: "",
  size: "large",
  title: "",
  iconFill: "",
  options: [],
  optionsKey: "",
  WithIcon: false,
  isSuffix: "Prefix",
  isSearchable: false,
  showBottom:"DropDown",
  Width:"Hug Content"
};

// Button with Teritiary variantion
export const Teritiary = Template.bind({});
Teritiary.args = {
  ...commonArgs,
  variation: "teritiary",
};