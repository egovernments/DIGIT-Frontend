import React, { useEffect, useState } from "react";
import Toggle from "../Toggle";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Toggle",
  component: Toggle,
  argTypes: {
    inputRef: { control: false, table: { disable: true } },
    label: { control: "text", table: { disable: true } },
    onChange: { action: "onChange", table: { disable: true } },
    value: { control: "text", table: { disable: true } },
    errorStyle: { control: "object", table: { disable: true } },
    disabled: { control: "boolean", table: { disable: true } },
    type: { control: "radio", options: ["toggle"], table: { disable: true } },
    additionalWrapperClass: { control: "text", table: { disable: true } },
    props: { control: "object", table: { disable: true } },
    Toggle1Label: { control: "text", name: "Toggle 1 Label" },
    Toggle2Label: { control: "text", name: "Toggle 2 Label" },
    Toggle3Label: { control: "text", name: "Toggle 3 Label" },
    t: { table: { disable: true } },
    options: { table: { disable: true } },
    name: { table: { disable: true } },
    onSelect: { table: { disable: true } },
    selectedOption: { table: { disable: true } },
    innerStyles: { table: { disable: true } },
    optionsKey: { table: { disable: true } },
    style: { table: { disable: true } },
    numberOfToggleItems: { control: "number", name: "No of Toggle items" },
  },
};

const Options = [
  { code: "Toggle1", name: "Toggle1" },
  { code: "Toggle2", name: "Toggle2" },
  { code: "Toggle3", name: "Toggle3" },
];

const Template = (args) => {
  const [selectedOption, setSelectedOption] = useState(args.value);

  const handleSelectOption = (selectedValue) => {
    if (selectedValue !== undefined) {
      setSelectedOption(selectedValue);
    }
  };

  // Generate options dynamically based on numberOfToggleItems
  const options = Array.from(
    { length: args.numberOfToggleItems },
    (_, index) => {
      const toggleLabel =
        args[`Toggle${index + 1}Label`] &&
        args[`Toggle${index + 1}Label`] !== ""
          ? args[`Toggle${index + 1}Label`]
          : `Toggle ${index + 1}`;
      return { code: `Toggle${index + 1}`, name: toggleLabel };
    }
  );

  return (
    <Toggle
      {...args}
      onSelect={(option) => handleSelectOption(option)}
      selectedOption={selectedOption}
      options={options}
    />
  );
};

const t = (key) => key;

const commonArgs = {
  t: t,
  options: Options,
  name: "toggleOptions",
  optionsKey: "name",
  style: {},
  inputRef: null,
  label: "",
  value: "",
  errorStyle: null,
  disabled: false,
  type: "toggle",
  additionalWrapperClass: "",
  innerStyles: {},
  Toggle1Label: "",
  Toggle2Label: "",
  Toggle3Label: "",
  onSelect: () => {},
  numberOfToggleItems: 3,
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
  numberOfToggleItems: { table: { disable: true } },
  Toggle1Label: { table: { disable: true }},
  Toggle2Label: { table: { disable: true }},
  Toggle3Label: {table: { disable: true } },
};

//Default Toggle
export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  style: {
    border: "5px solid #c84c0e",
    backgroundColor: "#fafafa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
  },
};