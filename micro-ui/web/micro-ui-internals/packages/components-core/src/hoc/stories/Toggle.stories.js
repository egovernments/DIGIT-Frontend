import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import FieldV1 from "../FieldV1";
import { ToggleSwitch } from "../../atoms";

export default {
  title: "Atom-Groups/ToggleField",
  component: ToggleSwitch,
  argTypes: {
    t: { control: false },
    config: { control: "object" },
    inputRef: { control: false },
    label: { control: "text" },
    onChange: { action: "onChange" },
    value: { control: "boolean" },
    disabled: { control: "boolean" },
    type: { control: "select", options: ["toggle"] },
    props: { control: "object" },
  },
};
const queryClient = new QueryClient();

const Template = (args) => {

  const [value, setValue] = useState(args.value);

  const handleToggleChange = () => {
    setValue((prevValue) => {
      const newValue = !prevValue;
      return newValue;
    });
  };
  return (
    <QueryClientProvider client={queryClient}>
      <FieldV1
        {...args}
        value={value}
        onChange={handleToggleChange}
      />
    </QueryClientProvider>
  );
};

const t = (key) => key;

const commonArgs = {
  t: t,
  config: {
    name: "toggle",
  },
  inputRef: null,
  label: "",
  value: false,
  errorStyle: null,
  disabled: false,
  type: "toggle",
  error:""
}


export const Default = Template.bind({});
Default.args = {
  ...commonArgs
};


export const Filled = Template.bind({});
Filled.args = {
  ...commonArgs,
  value: true
};
Filled.argTypes = {
  value: { control: { disable: true } },
};
