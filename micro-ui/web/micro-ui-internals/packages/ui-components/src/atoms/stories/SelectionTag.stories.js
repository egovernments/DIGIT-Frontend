import React from "react";
import SelectionTag from "../SelectionTag";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Selection Tag",
  component: SelectionTag,
  argTypes: {
    width: {
      control: "select",
      options: ["Fixed-Equal", "Custom"],
      name: "Width",
      mapping: {
        "Fixed-Equal": undefined,
        Custom: 300,
      },
    },
    errorMessage: {
      control: "check",
      name: "Error",
      options: ["Error"],
    },
    options: {
      control: "object",
      table: { disable: true },
    },
    onSelectionChanged: {
      action: "selectionChanged",
      table: { disable: true },
    },
    selected: {
      control: {
        type: "array",
        separator: ",",
      },
      table: { disable: true },
    },
    allowMultipleSelection: {
      control: "boolean",
      table: { disable: true },
    },
    withContainer: {
      control: "select",
      options: ["Enable", "Disable"],
      name: "Container",
      mapping: {
        Enable: true,
        Disable: false,
      },
    },
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

const prefixIconOptions = [
  { name: "Option 1", code: "option1", prefixIcon: "Edit", suffixIcon: "" },
  { name: "Option 2", code: "option2", prefixIcon: "Edit", suffixIcon: "" },
  { name: "Option 3", code: "option3", prefixIcon: "Edit", suffixIcon: "" },
];

const suffixIconOptions = [
  { name: "Option 1", code: "option1", prefixIcon: "", suffixIcon: "Edit" },
  { name: "Option 2", code: "option2", prefixIcon: "", suffixIcon: "Edit" },
  { name: "Option 3", code: "option3", prefixIcon: "", suffixIcon: "Edit" },
];

const Template = (args) => {
  const {errorMessage,WithIcon,isSuffix,...rest} = args;
  return (
    <div style={commonStyles}>
      <SelectionTag {...rest} errorMessage={errorMessage?.length > 0 ? "Error Message" : ''} options={WithIcon ? isSuffix ? suffixIconOptions : prefixIconOptions : args.options}/>
    </div>
  );
};

const commonArgs = {
  width: "Fixed-Equal",
  errorMessage: "",
  selected: [],
  options: [
    { name: "Option 1", code: "option1", prefixIcon: "", suffixIcon: "" },
    { name: "Option 2", code: "option2", prefixIcon: "", suffixIcon: "" },
    { name: "Option 3", code: "option3", prefixIcon: "", suffixIcon: "" },
  ],
  allowMultipleSelection: false,
  onSelectionChanged: (selectedOptions) =>
    console.log("Selected options:", selectedOptions),
  withContainer: "Enable",
  WithIcon:false,
  isSuffix:"Prefix"
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="SelectionTag Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  width: { table: { disable: true } },
  WithIcon: { table: { disable: true }},
  errorMessage: { table: { disable: true }},
  withContainer: {table: { disable: true } },
  isSuffix: { table: { disable: true } },
};

export const SingleSelect = Template.bind({});
SingleSelect.args = {
  ...commonArgs,
};

export const MultiSelect = Template.bind({});
MultiSelect.args = {
  ...commonArgs,
  allowMultipleSelection: true,
};