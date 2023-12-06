import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CustomDropdown } from "../../molecules";
import FieldV1 from "../FieldV1";

export default {
  title: "Atom-Groups/DropDownField",
  component: CustomDropdown,
  argTypes: {
    t: { control: false },
    populators: { control: "object" },
    inputRef: { control: false },
    label: { control: "text" },
    onChange: { action: "onChange" },
    value: { control: "text" },
    errorStyle: { control: "object" },
    disabled: { control: "boolean" },
    additionalWrapperClass: { control: "text" },
    props: { control: "object" },
    type:{control:"select", options:["dropdown","multiselectdropdown"]},
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

export const Default = Template.bind({});
Default.args = {
  t,
  populators: {
    name: "genders",
    defaultValue: "FEMALE",
    optionsCustomStyle: {},
    optionsKey: "name",
    options: gendersOptions,
  },
  error:"",
  inputRef: null,
  label: "Enter Gender",
  onChange: (e, name) => console.log("Selected value:", e, "Name:", name),
  errorStyle: null,
  disabled: false,
  type: "dropdown",
  additionalWrapperClass: "",
  props: {
    isLoading: false,
    data: gendersOptions,
  },
  description:""
};