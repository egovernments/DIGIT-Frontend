import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CustomDropdown } from "../../molecules";
import FieldV1 from "../FieldV1";

export default {
  title: "Atom-Groups/DropDownField",
  component: CustomDropdown,
  argTypes: {
    t: { control: false },
    config: { control: "object" },
    inputRef: { control: false },
    label: { control: "text" },
    onChange: { action: "onChange" },
    value: { control: "text" },
    errorStyle: { control: "object" },
    disable: { control: "boolean" },
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

//mock options data
const gendersOptions = [
  { code: "MALE", name: "MALE" },
  { code: "FEMALE", name: "FEMALE" },
  { code: "TRANSGENDER", name: "TRANSGENDER" },
];

export const DropDownStory = Template.bind({});
DropDownStory.args = {
  t,
  config: {
    name: "genders",

    styles: { display: "flex", justifyContent: "space-between" },
    defaultValue: "FEMALE",
    optionsCustomStyle: { color: "blue", fontSize: "14px" },
    optionsKey: "name",
    options: gendersOptions,
  },
  inputRef: null,
  label: "Enter Gender",
  onChange: (e, name) => console.log("Selected value:", e, "Name:", name),
  errorStyle: null,
  disable: false,
  type: "dropdown",
  additionalWrapperClass: "",
  props: {
    isLoading: false,
    data: gendersOptions,
  },
};
