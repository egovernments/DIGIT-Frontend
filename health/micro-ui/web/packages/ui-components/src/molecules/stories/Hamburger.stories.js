import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Hamburger from "../../atoms/Hamburger";
import { Iframe } from "../../atoms";

export default {
  title: "Molecules/Hamburger",
  component: Hamburger,
  argTypes: {
    items: { control: "object", table: { disable: true } },
    usermanuals: { control: "object", table: { disable: true } },
    theme: {
      control: "select",
      options: ["dark", "light"],
      table: { disable: true },
    },
    transitionDuration: { control: "number", table: { disable: true } },
    isSearchable: { control: "boolean", name: "Enable Search" },
    hideUserManuals: {
      control: "boolean",
      name: "Universal actions",
      mapping: { true: false, false: true },
    },
    userManualLabel: { control: "text", table: { disable: true } },
    profile: { control: "boolean", name: "Profile" },
    onSelect: { action: "onChange", table: { disable: true } },
    onLogout: { action: "onChange", table: { disable: true } },
    reopenOnLogout: { control: "boolean", table: { disable: true } },
    closeOnClickOutside: { control: "boolean", table: { disable: true } },
    onOutsideClick: { action: "onChange", table: { disable: true } },
    profileNumber: { table: { disable: true } },
    profileName: { table: { disable: true } },
  },
};

const Items = [
  {
    label: "City",
    isSearchable: false,
    icon: "Home",
    children: [
      {
        path: "/",
        label: "City 1",
        icon: "",
      },
      {
        path: "/",
        label: "City 2",
        icon: "",
      },
    ],
  },
  {
    label: "Language",
    isSearchable: false,
    icon: "DriveFileMove",
    children: [
      {
        path: "/",
        label: "Language 1",
        icon: "",
      },
      {
        path: "/",
        label: "Language 2",
        icon: "",
      },
    ],
  },
  {
    label: "SideNav",
    isSearchable: false,
    icon: "Accessibility",
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: "",
        children: [
          {
            path: "/",
            label: "InnerModule 1",
            icon: "",
          },
          {
            path: "/",
            label: "InnerModule 2",
            icon: "",
          },
        ],
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: "",
      },
    ],
  },
];

const ItemsWithSearch = [
  {
    label: "City",
    isSearchable: true,
    icon: "Home",
    children: [
      {
        path: "/",
        label: "City 1",
        icon: "",
      },
      {
        path: "/",
        label: "City 2",
        icon: "",
      },
    ],
  },
  {
    label: "Language",
    isSearchable: true,
    icon: "DriveFileMove",
    children: [
      {
        path: "/",
        label: "Language 1",
        icon: "",
      },
      {
        path: "/",
        label: "Language 2",
        icon: "",
      },
    ],
  },
  {
    label: "SideNav",
    isSearchable: true,
    icon: "Accessibility",
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: "",
        children: [
          {
            path: "/",
            label: "InnerModule 1",
            icon: "",
          },
          {
            path: "/",
            label: "InnerModule 2",
            icon: "",
          },
        ],
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: "",
      },
    ],
  },
];

const Template = (args) => {
  const { isSearchable, profile, ...rest } = args;
  return (
    <Router>
      <Hamburger
        {...rest}
        items={isSearchable ? ItemsWithSearch : Items}
        profile={
          profile
            ? "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png"
            : ""
        }
      />
    </Router>
  );
};

const onSelect = (e) => {
  console.log(e, "event");
};

const onLogout = () => {
  console.log("clicked on Logout");
};

const commonArgs = {
  transitionDuration: 0.3,
  theme: "dark",
  profileName: "ProfileName",
  profileNumber: "+258 6387387",
  isSearchable: true,
  hideUserManuals: true,
  userManualLabel: "UserManual",
  profile: false,
  usermanuals: [],
  onSelect: onSelect,
  onLogout: onLogout,
  reopenOnLogout: false,
  closeOnClickOutside: false,
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Hamburger Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  isSearchable: { table: { disable: true } },
  hideUserManuals: { table: { disable: true } },
  profile: { table: { disable: true } },
};

export const Dark = Template.bind({});
Dark.args = {
  ...commonArgs,
  theme: "dark",
};

export const Light = Template.bind({});
Light.args = {
  ...commonArgs,
  theme: "light",
};