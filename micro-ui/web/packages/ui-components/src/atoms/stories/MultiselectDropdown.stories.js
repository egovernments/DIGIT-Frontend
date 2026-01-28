import React from "react";
import MultiSelectDropdown from "../MultiSelectDropdown";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Multi Select DropDown",
  component: MultiSelectDropdown,
  argTypes: {
    t: { control: false, table: { disable: true } },
    populators: { control: "object", table: { disable: true } },
    inputRef: { control: false, table: { disable: true } },
    label: { control: "text", table: { disable: true } },
    onSelect: { action: "onChange", table: { disable: true } },
    onChange: { action: "onChange", table: { disable: true } },
    value: { control: "text" },
    errorStyle: { control: "object", table: { disable: true } },
    disabled: {
      control: "select",
      options: ["Default", "Disabled"],
      name: "State",
      mapping: {
        Default: false,
        Disabled: true,
      },
    },
    isSearchable: { control: "boolean", name: "Searchable" },
    additionalWrapperClass: { control: "text" },
    props: { control: "object" },
    type: {
      control: "select",
      options: ["dropdown", "multiselectdropdown"],
      table: { disable: true },
      table: { disable: true },
    },
    variant: {
      control: "select",
      options: [
        "nestedmultiselect",
        "treemultiselect",
        "nestedtextmultiselect",
      ],
      table: { disable: true },
    },
    value: { table: { disable: true } },
    ServerStyle: { table: { disable: true } },
    isPropsNeeded: { table: { disable: true } },
    isOBPSMultiple: { table: { disable: true } },
    BlockNumber: { table: { disable: true } },
    defaultUnit: { table: { disable: true } },
    defaultLabel: { table: { disable: true } },
    selected: { table: { disable: true } },
    options: { table: { disable: true } },
    config: { table: { disable: true } },
    description: { table: { disable: true } },
    props: { table: { disable: true } },
    additionalWrapperClass: { table: { disable: true } },
    name: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    optionsKey: { table: { disable: true } },
    error: { table: { disable: true } },
    optionsCustomStyle: { table: { disable: true } },
    addSelectAllCheck: { control: "boolean", name: "Select all" },
    addCategorySelectAllCheck: {
      control: "boolean",
      name: "Category level select all",
    },
    selectAllLabel: { table: { disable: true } },
    categorySelectAllLabel: { table: { disable: true } },
    showIcon: { control: "boolean", name: "Icon" },
    isDropdownWithChip: { control: "boolean", name: "With chips" },
    chipsKey: { table: { disable: true } },
    clearLabel: { table: { disable: true } },
  },
};

//mock options data
const commonOptions = [
  { code: "Option1", name: "Option1" },
  { code: "Option2", name: "Option2" },
  { code: "Option3", name: "Option3" },
];
//options with icons
const OptionsWithIcons = [
  { code: "Option1", name: "Option1", icon: "Article" },
  { code: "Option2", name: "Option2", icon: "Article" },
  { code: "Option3", name: "Option3", icon: "Article" },
];
//options with description
const OptionsWithNestedText = [
  {
    code: "Option1",
    name: "Option1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
  {
    code: "Option2",
    name: "Option2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
  {
    code: "Option3",
    name: "Option3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
];
//options with description and icon
const NestedTextOptionWithIcons = [
  {
    code: "Option1",
    name: "Option1",
    icon: "Article",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
  {
    code: "Option2",
    name: "Option2",
    icon: "Article",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
  },
  {
    code: "Option3",
    name: "Option3",
    icon: "Article",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
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
    options: [
      { code: "Category C.Option A", name: "Option A" },
      { code: "Category C.Option B", name: "Option B" },
    ],
    code: "Category C",
  },
];

const getOptions = (variant, showIcon) => {
  if (showIcon) {
    switch (variant) {
      case "nestedmultiselect":
        return nestedOptionsWithIcons;
      case "treemultiselect":
        return treeDropdownOptions;
      case "nestedtextmultiselect":
        return NestedTextOptionWithIcons;
      default:
        return OptionsWithIcons;
    }
  } else {
    switch (variant) {
      case "nestedmultiselect":
        return nestedOptions;
      case "treemultiselect":
        return treeDropdownOptions;
      case "nestedtextmultiselect":
        return OptionsWithNestedText;
      default:
        return commonOptions;
    }
  }
};

const Template = (args) => {
  const { showIcon, variant, isDropdownWithChip, ...rest } = args;
  console.log(isDropdownWithChip, "isDropdownWithChip");
  let config = isDropdownWithChip
    ? showIcon
      ? { isDropdownWithChip: true, showIcon: true }
      : { isDropdownWithChip: true }
    : showIcon
    ? { showIcon: true }
    : {};
  console.log(config, "config");
  return (
    <MultiSelectDropdown
      {...rest}
      variant={variant}
      showIcon={showIcon}
      options={getOptions(variant, showIcon)}
      onSelect={(e) => {
        args.onChange(e, "dropdown");
      }}
      config={config}
    />
  );
};

const t = (key) => key;

const commonArgs = {
  clearLabel: "Clear All",
  addSelectAllCheck: false,
  addCategorySelectAllCheck: false,
  selectAllLabel: "",
  categorySelectAllLabel: "",
  chipsKey: "",
  t,
  name: "genders",
  defaultValue: "FEMALE",
  optionsCustomStyle: {},
  optionsKey: "name",
  showIcon: false,
  isSearchable: true,
  error: "",
  inputRef: null,
  label: "Select Option",
  onChange: (e, name) => console.log("Selected value:", e, "Name:", name),
  errorStyle: null,
  disabled: "Default",
  type: "multiselectdropdown",
  additionalWrapperClass: "",
  props: {
    isLoading: false,
    data: commonOptions,
  },
  description: "",
  isDropdownWithChip: true,
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Multiselectdropdown Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  disabled: { table: { disable: true } },
  isSearchable: { table: { disable: true } },
  showIcon: { table: { disable: true } },
  addSelectAllCheck: { table: { disable: true } },
  addCategorySelectAllCheck: { table: { disable: true } },
  isDropdownWithChip: { table: { disable: true } },
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
  type: "multiselectdropdown",
};

export const Categorical = Template.bind({});
Categorical.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  name: "nestedmultiselectoptions",
  options: nestedOptions,
  isDropdownWithChip: true,
  variant: "nestedmultiselect",
};

export const NestedText = Template.bind({});
NestedText.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  name: "nestedtextltiselect",
  options: OptionsWithNestedText,
  isDropdownWithChip: true,
  variant: "nestedtextmultiselect",
};

export const TreeMultiselect = Template.bind({});
TreeMultiselect.args = {
  ...commonArgs,
  type: "multiselectdropdown",
  name: "treeoptions",
  options: treeDropdownOptions,
  isDropdownWithChip: true,
  variant: "treemultiselect",
};