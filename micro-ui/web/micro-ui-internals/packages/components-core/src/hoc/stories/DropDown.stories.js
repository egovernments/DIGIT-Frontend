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
    type: { control: "select", options: ["dropdown", "multiselectdropdown"] },
    variant: { control: "select", options: ["nesteddropdown", "nestedmultiselect","treedropdown","treemultiselect"] },
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

const OptionsWithIcons = [
  { code: "Option1", name: "Option1", icon: "Article" },
  { code: "Option2", name: "Option2", icon: "Article" },
  { code: "Option3", name: "Option3", icon: "Article" },
];

const nestedOptions = [
  {
    name: "Category A",
    options: [
      { code: "Category A.Option A", name: "Option A" },
      { code: "Category A.Option B", name: "Option B" },
      { code: "Category A.Option C", name: "Option C" },
    ],
    code: "Category A",
  },
  {
    name: "Category B",
    options: [
      { code: "Category B.Option A", name: "Option A" },
      { code: "Category B.Option 2", name: "Option 2" },
      { code: "Category B.Option 3", name: "Option 3" },
    ],
    code: "Category B",
  },
];

const nestedOptionsWithIcons = [
  {
    name: "Category A",
    options: [
      { code: "Category A.Option A", name: "Option A", icon: "Article" },
      { code: "Category A.Option B", name: "Option B", icon: "Article" },
      { code: "Category A.Option C", name: "Option C", icon: "Article" },
    ],
    code: "Category A",
  },
  {
    name: "Category B",
    options: [
      { code: "Category B.Option 1", name: "Option 1", icon: "Article" },
      { code: "Category B.Option 2", name: "Option 2", icon: "Article" },
      { code: "Category B.Option 3", name: "Option 3", icon: "Article" },
    ],
    code: "Category B",
  },
];

const treeDropdownOptions = [
  {
    name: "Category A",
    options: [
      { code: "Category A.Option A", name: "Option A" ,options:[{code:"Category A.Option A.Option 1",name:"Option 1"},{code:"Category A.Option A.Option 2",name:"Option 2"}]},
      { code: "Category A.Option B", name: "Option B" ,options:[{code:"Category A.Option B.Option 1",name:"Option 1"},{code:"Category A.Option B.Option 2",name:"Option 2"}]}
    ],
    code: "Category A",
  },
  {
    name: "Category B",
    options: [
      { code: "Category B.Option A", name: "Option A" },
      { code: "Category B.Option B", name: "Option B" ,options:[{code:"Category B.Option B.Option 1",name:"Option 1"},{code:"Category B.Option B.Option 2",name:"Option 2"}]}
    ],
    code: "Category B",
  },
  {
    name: "Category C",
    options: [
      { code: "Category C.Option A", name: "Option A" },
    ],
    code: "Category C",
  },
];

const commonArgs = {
  t,
  populators: {
    name: "genders",
    defaultValue: "FEMALE",
    optionsCustomStyle: {},
    optionsKey: "name",
    options: gendersOptions,
    showIcon: false,
  },
  error: "",
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
  description: ""
};

export const Dropdown = Template.bind({});
Dropdown.args = {
  ...commonArgs,
  type: "dropdown",
};

export const DropdownWithIcons = Template.bind({});
DropdownWithIcons.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "iconoptions",
    options: OptionsWithIcons,
    showIcon: true,
  },
};

export const DropdownDisabled = Template.bind({});
DropdownDisabled.args = {
  ...commonArgs,
  type: "dropdown",
  disabled: true,
};

export const MultiSelectDropdown = Template.bind({});
MultiSelectDropdown.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  populators: {
    ...commonArgs.populators,
    isDropdownWithChip: true,
  },
};

export const MultiSelectDropdownWithIcons = Template.bind({});
MultiSelectDropdownWithIcons.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  populators: {
    ...commonArgs.populators,
    name: "iconoptions",
    options: OptionsWithIcons,
    showIcon: true,
    isDropdownWithChip: true,
  },
};

export const MultiSelectDropdownDisabled = Template.bind({});
MultiSelectDropdownDisabled.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  disabled: true,
};

export const NestedDropdown = Template.bind({});
NestedDropdown.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedoptions",
    options: nestedOptions,
  },
  variant: "nesteddropdown",
};

export const NestedDropdownWithIcons = Template.bind({});
NestedDropdownWithIcons.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedoptions",
    options: nestedOptionsWithIcons,
    showIcon: true,
  },
  variant: "nesteddropdown",
};

export const NestedDropdownDisabled = Template.bind({});
NestedDropdownDisabled.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedoptions",
    options: nestedOptions,
  },
  variant: "nesteddropdown",
  disabled: true,
};

export const NestedMultiSelectDropdown = Template.bind({});
NestedMultiSelectDropdown.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedmultiselectoptions",
    options: nestedOptions,
    isDropdownWithChip: true,
  },
  variant: "nestedmultiselect",
};

export const NestedMultiSelectDropdownWithIcons = Template.bind({});
NestedMultiSelectDropdownWithIcons.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedmultiselectoptions",
    options: nestedOptionsWithIcons,
    showIcon: true,
    isDropdownWithChip: true,
  },
  variant: "nestedmultiselect",
};

export const TreeDropdown = Template.bind({});
TreeDropdown.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "treeoptions",
    options: treeDropdownOptions,
  },
  variant: "treedropdown",
};

export const TreeMultiselectDropdown = Template.bind({});
TreeMultiselectDropdown.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  populators: {
    ...commonArgs.populators,
    name: "treeoptions",
    options: treeDropdownOptions,
  },
  variant: "treemultiselect",
};