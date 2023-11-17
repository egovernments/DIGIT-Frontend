import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CustomDropdown } from "../../molecules";
import FieldV1 from "../FieldV1";

export default {
  title: "Atom-Groups/RadioField",
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
    type: { control: "radio", options: ["radio","toggle"] },
    additionalWrapperClass: { control: "text" },
    props: { control: "object" },
  },
};
const queryClient = new QueryClient();

const Template = (args) => (
  <QueryClientProvider client={queryClient}>
    <FieldV1 {...args} />
  </QueryClientProvider>
);


const t = (key) => key;


const gendersOptions = [
  { code: "MALE", name: "MALE" },
  { code: "FEMALE", name: "FEMALE" },
  { code: "TRANSGENDER", name: "TRANSGENDER" },
];

export const RadioStory = Template.bind({});
RadioStory.args = {
  t: t,
  config: {
    name: "gender",
    optionsKey: "name",
    options: gendersOptions,
  },
  inputRef: null,
  label: "Enter Gender",
  onChange: (e, name) => console.log("Selected value:", e, "Name:", name),
  value: "MALE",
  errorStyle: null,
  disabled: false,
  type: "radio",
  additionalWrapperClass: "",
};

export const ToggleStory = Template.bind({});
ToggleStory.args = {
  t: t,
  config: {
    name: "gender",
    optionsKey: "name",
    options: gendersOptions,
  },
  inputRef: null,
  label: "Enter Gender",
  onChange: (e, name) => console.log("Selected value:", e, "Name:", name),
  value: "",
  errorStyle: null,
  disabled: false,
  type: "toggle",
  additionalWrapperClass: "",
};

