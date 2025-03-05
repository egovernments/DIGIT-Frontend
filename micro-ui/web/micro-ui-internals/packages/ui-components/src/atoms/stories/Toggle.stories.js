import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FieldV1 from "../../hoc/FieldV1";
import CustomDropdown from "../../molecules";

export default {
  title: "Atoms/Toggle",
  component: CustomDropdown,
  argTypes: {
    t: { control: false },
    config: { control: "object" },
    inputRef: { control: false },
    label: { control: "text" },
    onChange: { action: "onChange" },
    value: { control: "text" },
    errorStyle: { control: "object" },
    disabled: { control: "boolean" },
    type: { control: "radio", options: ["toggle"] },
    additionalWrapperClass: { control: "text" },
    props: { control: "object" },
  },
};
const queryClient = new QueryClient();

const Template = (args) => {
  const [selectedOption, setSelectedOption] = useState(args.value);

  const handleSelectOption = (e, name) => {
    const selectedValue = e;
    if (selectedValue !== undefined) {
      setSelectedOption(selectedValue);
      args.onChange(e, name);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <FieldV1 {...args} value={selectedOption} onChange={handleSelectOption} />
    </QueryClientProvider>
  );
};

const t = (key) => key;

const Options = [
  { code: "Toggle1", name: "Toggle1" },
  { code: "Toggle2", name: "Toggle2" },
  { code: "Toggle3", name: "Toggle3" },
];

const commonArgs = {
  t: t,
  populators: {
    name: "toggleOptions",
    optionsKey: "name",
    options: Options,
  },
  inputRef: null,
  label: "",
  value: "",
  errorStyle: null,
  disabled: false,
  type: "toggle",
  additionalWrapperClass: "",
  error: "",
  description: "",
};


//Default Toggle 
export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
};