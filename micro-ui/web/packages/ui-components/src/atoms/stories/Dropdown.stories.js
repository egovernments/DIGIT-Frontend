import React from "react";
import Dropdown from "../Dropdown";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Single Select Dropdown",
  component: Dropdown,
  argTypes: {
    t: { control: false, table: { disable: true } },
    populators: { control: "object", table: { disable: true } },
    inputRef: { control: false, table: { disable: true } },
    label: { control: "text", table: { disable: true } },
    onChange: { action: "onChange", table: { disable: true } },
    value: { control: "text", table: { disable: true } },
    errorStyle: { control: "object", table: { disable: true } },
    disabled:{
      control: "select",
      options: ["Default", "Disabled"],
      name: "State",
      mapping: {
        Default: false,
        Disabled: true,
      },
    },
    isSearchable: { control: "boolean", name: "Searchable" },
    additionalWrapperClass: { control: "text", table: { disable: true } },
    props: { control: "object", table: { disable: true } },
    type: {
      control: "select",
      options: ["dropdown", "multiselectdropdown"],
      table: { disable: true },
    },
    variant: {
      control: "select",
      options: [
        "nesteddropdown",
        "treedropdown",
        "nestedtextdropdown",
        "profiledropdown",
        "profilenestedtext",
      ],
      table: { disable: true },
    },
    error: { table: { disable: true } },
    description: { table: { disable: true } },
    customSelector: { table: { disable: true } },
    showArrow: { table: { disable: true } },
    selected: { table: { disable: true } },
    style: { table: { disable: true } },
    option: { table: { disable: true } },
    optionKey: { table: { disable: true } },
    select: { table: { disable: true } },
    optionsCustomStyle: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    name: { table: { disable: true } },
    showIcon:{control:"boolean",name:"Icon"}
  },
};

//mock options data
const commonOptions = [
  { code: "Option1", name: "Option1" },
  { code: "Option2", name: "Option2" },
  { code: "Option3", name: "Option3" },
];
//options with icons
const optionsWithIcons = [
  { code: "Option1", name: "Option1", icon: "Article" },
  { code: "Option2", name: "Option2", icon: "Article" },
  { code: "Option3", name: "Option3", icon: "Article" },
];
//options with profileIcon
const optionsWithProfile = [
  {
    code: "Option1",
    name: "Option1",
    profileIcon:
      "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
  {
    code: "Option2",
    name: "Option2",
    profileIcon:
      "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
  {
    code: "Option3",
    name: "Option3",
    profileIcon:
      "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
];
//options with description
const optionsWithNestedText = [
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
const nestedTextOptionWithIcons = [
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
//options with description and profileIcon
const nestedTextProfileOptions = [
  {
    code: "Option1",
    name: "Option1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    profileIcon:
      "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
  {
    code: "Option2",
    name: "Option2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    profileIcon:
      "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
  },
  {
    code: "Option3",
    name: "Option3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
    profileIcon:
      "https://www.freeiconspng.com/uploads/am-a-19-year-old-multimedia-artist-student-from-manila--21.png",
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
      case "nesteddropdown":
        return nestedOptionsWithIcons;
      case "treedropdown":
        return treeDropdownOptions;
      case "nestedtextdropdown":
        return nestedTextOptionWithIcons;
      case "profiledropdown":
        return optionsWithProfile;
      case "profilenestedtext":
        return nestedTextProfileOptions;
      default:
        return optionsWithIcons;
    }
  } else {
    switch (variant) {
      case "nesteddropdown":
        return nestedOptions;
      case "treedropdown":
        return treeDropdownOptions;
      case "nestedtextdropdown":
        return optionsWithNestedText;
      case "profiledropdown":
        return commonOptions;
      case "profilenestedtext":
        return optionsWithNestedText;
      default:
        return commonOptions;
    }
  }
};

const Template = (args) => {
  const { showIcon, variant, ...rest } = args;
  return (
    <Dropdown
      {...rest}
      variant={variant}
      showIcon={showIcon}
      option={getOptions(variant, showIcon)}
      select={(e) => {
        args.onChange(e, "dropdown");
      }}
    />
  );
};

const t = (key) => key;

const commonArgs = {
  t,
  name: "genders",
  defaultValue: "FEMALE",
  optionsCustomStyle: {},
  optionKey: "name",
  showIcon: false,
  isSearchable: true,
  error: "",
  inputRef: null,
  label: "Select Option",
  onChange: (e, name) => console.log("Selected value:", e, "Name:", name),
  errorStyle: null,
  disabled: "Default",
  type: "dropdown",
  additionalWrapperClass: "",
  props: {
    isLoading: false,
    data: commonOptions,
  },
  description: "",
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Dropdown Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  disabled: { table: { disable: true } },
  isSearchable: { table: { disable: true }},
  showIcon:{table:{disable:true}}
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
  type: "dropdown",
};

export const Categorical = Template.bind({});
Categorical.args = {
  ...commonArgs,
  type: "dropdown",
  name: "nestedoptions",
  variant: "nesteddropdown",
};

export const NestedText = Template.bind({});
NestedText.args = {
  ...commonArgs,
  type: "dropdown",
  name: "nestedtextoptions",
  variant: "nestedtextdropdown",
};

export const Profile = Template.bind({});
Profile.args = {
  ...commonArgs,
  type: "dropdown",
  name: "profiledropdown",
  variant: "profiledropdown",
};

export const ProfileWithNestedText = Template.bind({});
ProfileWithNestedText.args = {
  ...commonArgs,
  type: "dropdown",
  name: "profiledropdown",
  variant: "profilenestedtext",
};

export const TreeDropdown = Template.bind({});
TreeDropdown.args = {
  ...commonArgs,
  type: "dropdown",
  name: "treeoptions",
  variant: "treedropdown",
};