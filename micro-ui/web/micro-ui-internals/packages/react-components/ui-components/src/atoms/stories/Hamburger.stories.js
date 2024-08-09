import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MobileSidebar from "../MobileSidebar"; // Adjust the import path as needed
import { SVG } from "../SVG"; // Adjust the import path for SVG components

export default {
  title: "Atoms/Hamburger",
  component: MobileSidebar,
  argTypes: {
    items: { control: "object" },
    theme: { control: "select", options: ["dark", "light"] },
    variant: { control: "select", options: ["primary", "secondary"] },
    transitionDuration: { control: "number" },
  },
};

const Template = (args) => (
  <Router>
    <MobileSidebar {...args} />
  </Router>
);

const darkThemeItems = [
  {
    label: "City",
    children: [
      {
        path: "/",
        label: "City 1",
        icon: <SVG.Lightbulb fill={"#ffffff"} />,
      },
      {
        path: "/",
        label: "City 2",
        icon: <SVG.Label fill={"#ffffff"} />,
      },
    ],
  },
  {
    label: "Language",
    children: [
      {
        path: "/",
        label: "Language 1",
        icon: <SVG.DriveFileMove fill={"#ffffff"} />,
      },
      {
        path: "/",
        label: "Language 2",
        icon: <SVG.Delete fill={"#ffffff"} />,
      },
    ],
  },
  {
    label: "SideNav",
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: <SVG.Accessibility fill={"#ffffff"} />,
        children: [
          {
            path: "/",
            label: "InnerModule 1",
            icon: <SVG.Lock fill={"#ffffff"} />,
          },
          {
            path: "/",
            label: "InnerModule 2",
            icon: <SVG.LabelImportant fill={"#ffffff"} />,
          },
        ],
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: <SVG.CheckCircle fill={"#ffffff"} />,
      },
    ],
  },
];

const lightThemeItems = [
  {
    label: "City",
    children: [
      {
        path: "/",
        label: "City 1",
        icon: <SVG.Lightbulb fill={"#0B4B66"} />,
      },
      {
        path: "/",
        label: "City 2",
        icon: <SVG.Label fill={"#0B4B66"} />,
      },
    ],
  },
  {
    label: "Language",
    children: [
      {
        path: "/",
        label: "Language 1",
        icon: <SVG.DriveFileMove fill={"#0B4B66"} />,
      },
      {
        path: "/",
        label: "Language 2",
        icon: <SVG.Delete fill={"#0B4B66"} />,
      },
    ],
  },
  {
    label: "SideNav",
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: <SVG.Accessibility fill={"#0B4B66"} />,
        // children: [
        //   {
        //     path: "/",
        //     label: "InnerModule 1",
        //     icon: <SVG.Lock fill={"#0B4B66"} />,
        //   },
        //   {
        //     path: "/",
        //     label: "InnerModule 2",
        //     icon: <SVG.LabelImportant fill={"#0B4B66"} />,
        //   },
        // ],
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: <SVG.CheckCircle fill={"#0B4B66"} />,
      },
    ],
  },
];

const commonArgs = {
  items: darkThemeItems,
  transitionDuration: 0.3,
  theme: "dark",
  profileName:"ProfileName",
  profileNumber:'+258 6387387'
};

export const LightTheme = Template.bind({});
LightTheme.args = {
  ...commonArgs,
  theme: "light",
  items: lightThemeItems,
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  ...commonArgs,
  theme: "dark",
  items: darkThemeItems,
};
