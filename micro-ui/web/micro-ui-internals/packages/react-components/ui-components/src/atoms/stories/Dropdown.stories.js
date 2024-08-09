import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import FieldV1 from "../../hoc/FieldV1";
import { CustomDropdown } from "../../molecules";

export default {
  title: "Atoms/DropDown",
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
    variant: {
      control: "select",
      options: [
        "nesteddropdown",
        "nestedmultiselect",
        "treedropdown",
        "treemultiselect",
        "nestedtextmultiselect",
        "nestedtextdropdown",
        "profiledropdown",
        "profilenestedtext",
      ],
    },
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
//options with icons
const OptionsWithIcons = [
  { code: "Option1", name: "Option1", icon: "Article" },
  { code: "Option2", name: "Option2", icon: "Article" },
  { code: "Option3", name: "Option3", icon: "Article" },
];
//options with profileIcon
const OptionsWithProfile = [
  {
    code: "Option1",
    name: "Option1",
    profileIcon: "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
  {
    code: "Option2",
    name: "Option2",
    profileIcon: "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
  {
    code: "Option3",
    name: "Option3",
    profileIcon: "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
];
//options with description
const OptionsWithNestedText = [
  {
    code: "Option1",
    name: "Option1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
  {
    code: "Option2",
    name: "Option2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
  {
    code: "Option3",
    name: "Option3",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
];
//options with description and icon
const NestedTextOptionWithIcons = [
  {
    code: "Option1",
    name: "Option1",
    icon: "Article",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
  {
    code: "Option2",
    name: "Option2",
    icon: "Article",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
  {
    code: "Option3",
    name: "Option3",
    icon: "Article",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
];
//options with description and profileIcon 
const NestedTextProfileOptions = [
  {
    code: "Option1",
    name: "Option1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    profileIcon: "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
  {
    code: "Option2",
    name: "Option2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    profileIcon: "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
  {
    code: "Option3",
    name: "Option3",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    profileIcon: "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
];
//nested options
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
//nested options with icons
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
//tree select options
const treeDropdownOptions = [
  {
    name: "Category A",
    options: [
      {
        code: "Category A.Option A",
        name: "Option A",
        options: [
          { code: "Category A.Option A.Option 1", name: "Option 1" },
          { code: "Category A.Option A.Option 2", name: "Option 2" },
        ],
      },
      {
        code: "Category A.Option B",
        name: "Option B",
        options: [
          { code: "Category A.Option B.Option 1", name: "Option 1" },
          { code: "Category A.Option B.Option 2", name: "Option 2" },
        ],
      },
    ],
    code: "Category A",
  },
  {
    name: "Category B",
    options: [
      { code: "Category B.Option A", name: "Option A" },
      {
        code: "Category B.Option B",
        name: "Option B",
        options: [
          { code: "Category B.Option B.Option 1", name: "Option 1" },
          { code: "Category B.Option B.Option 2", name: "Option 2" },
        ],
      },
    ],
    code: "Category B",
  },
  {
    name: "Category C",
    options: [{ code: "Category C.Option A", name: "Option A" },{ code: "Category C.Option B", name: "Option B" }],
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
    isSearchable:true,
    clearLabel:"Clear All",
    addSelectAllCheck:false,
    addCategorySelectAllCheck:false,
    selectAllLabel: "",
    categorySelectAllLabel:""
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
  description: "",
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

export const MultiSelectDropdownWithSelectAllCheck = Template.bind({});
MultiSelectDropdownWithSelectAllCheck.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  populators: {
    ...commonArgs.populators,
    isDropdownWithChip: true,
    addSelectAllCheck:true,
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

export const NestedMultiSelectDropdownWithSelectAllCheck = Template.bind({});
NestedMultiSelectDropdownWithSelectAllCheck.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedmultiselectoptions",
    options: nestedOptions,
    isDropdownWithChip: true,
    addSelectAllCheck:true,
    addCategorySelectAllCheck:true
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
    isDropdownWithChip: true,
  },
  variant: "treemultiselect",
};

export const NestedTextDropDown = Template.bind({});
NestedTextDropDown.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedtextoptions",
    options: OptionsWithNestedText,
  },
  variant: "nestedtextdropdown",
};

export const NestedTextDropDownWithIcon = Template.bind({});
NestedTextDropDownWithIcon.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedtextoptions",
    options: NestedTextOptionWithIcons,
    showIcon: true,
  },
  variant: "nestedtextdropdown",
};

export const NestedTextMultiSelect = Template.bind({});
NestedTextMultiSelect.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedtextltiselect",
    options: OptionsWithNestedText,
    isDropdownWithChip: true,
  },
  variant: "nestedtextmultiselect",
};

export const NestedTextMultiSelectWithSelectAllCheck = Template.bind({});
NestedTextMultiSelectWithSelectAllCheck.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedtextltiselect",
    options: OptionsWithNestedText,
    isDropdownWithChip: true,
    addSelectAllCheck:true
  },
  variant: "nestedtextmultiselect",
};

export const NestedTextMultiSelectWithIcons = Template.bind({});
NestedTextMultiSelectWithIcons.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  populators: {
    ...commonArgs.populators,
    name: "nestedtextltiselect",
    options: NestedTextOptionWithIcons,
    isDropdownWithChip: true,
    showIcon: true,
  },
  variant: "nestedtextmultiselect",
};

export const ProfileDropdown = Template.bind({});
ProfileDropdown.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "profiledropdown",
    options: gendersOptions,
  },
  variant: "profiledropdown",
};

export const ProfileDropdownWithCustomIcon = Template.bind({});
ProfileDropdownWithCustomIcon.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "profiledropdown",
    options: OptionsWithProfile,
  },
  variant: "profiledropdown",
};

export const ProfileWithNestedText = Template.bind({});
ProfileWithNestedText.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "profiledropdown",
    options: OptionsWithNestedText,
  },
  variant: "profilenestedtext",
};

export const ProfileWithNestedTextWithCustomIcon = Template.bind({});
ProfileWithNestedTextWithCustomIcon.args = {
  ...commonArgs,
  type: "dropdown",
  populators: {
    ...commonArgs.populators,
    name: "profiledropdown",
    options: NestedTextProfileOptions,
  },
  variant: "profilenestedtext",
};