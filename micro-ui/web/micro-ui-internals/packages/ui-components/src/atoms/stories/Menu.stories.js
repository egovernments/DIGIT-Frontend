import React from "react";
import Menu from "../Menu";

export default {
  title: "Atom/Menu",
  component: Menu,
};

const Template = (args) => <Menu {...args} />;

export const Default = Template.bind({});
Default.args = {
  options: [
    { label: "First" },
    { label: "Second" },
    { label: "Third" }
  ],
  optionsKey: "label",
  onSelect: (val) => alert(`Selected: ${val.label}`)
};

export const Searchable = Template.bind({});
Searchable.args = {
  ...Default.args,
  isSearchable: true,
};

export const EmptyOptions = Template.bind({});
EmptyOptions.args = {
  options: [],
  optionsKey: "label",
  isSearchable: true,
  onSelect: (val) => alert(`Selected: ${val?.label}`)
};

export const WithIcons = Template.bind({});
WithIcons.args = {
  options: [
    { label: "Home", icon: "AiFillHome" },
    { label: "Settings", icon: "AiFillSetting" },
    { label: "Profile", icon: "AiOutlineUser" },
  ],
  optionsKey: "label",
  isSearchable: true,
  onSelect: (val) => alert(`Selected: ${val.label}`)
};

export const FooterDropdown = Template.bind({});
FooterDropdown.args = {
  ...WithIcons.args,
  footerdropdown: true,
  showBottom: true,
};
