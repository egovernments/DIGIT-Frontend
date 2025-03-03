import React, { Children } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SVG } from "../SVG";
import Sidebar from "../Sidebar";

export default {
  title: "Atoms/Sidebar",
  component: Sidebar,
  argTypes: {
    items: { control: "object" },
    collapsedWidth: { control: "text" },
    expandedWidth: { control: "text" },
    transitionDuration: { control: "number" },
    theme: { control: "select", options: ["dark", "light"] },
    variant: { control: "select", options: ["primary", "secondary"] },
  },
};

const Template = (args) => (
  <Router>
    <Sidebar {...args} />
  </Router>
);

const darkThemeitems = [
  {
    label: "Home",
    icon: <SVG.Home fill={"#FFFFFF"} />,
  },
  {
    label: "Module 1",
    icon: <SVG.ChatBubble fill={"#FFFFFF"} />,
    children: [
      { path: "/", label: "SubModule 1", icon: <SVG.Work fill={"#FFFFFF"} /> },
      {
        path: "/",
        label: "SubModule 2",
        icon: <SVG.Person fill={"#FFFFFF"} />,
      },
    ],
  },
  {
    label: "Module 2",
    icon: <SVG.CheckCircle fill={"#FFFFFF"} />,
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: <SVG.Info fill={"#FFFFFF"} />,
        children: [
          {
            path: "/",
            label: "InnerModule 1",
            icon: <SVG.LabelImportant fill={"#FFFFFF"} />,
          },
          {
            path: "/",
            label: "InnerModule 2",
            icon: <SVG.Lock fill={"#FFFFFF"} />,
          },
        ],
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: <SVG.Accessibility fill={"#FFFFFF"} />,
      },
    ],
  },
  {
    label: "Module 3",
    icon: <SVG.Delete fill={"#FFFFFF"} />,
  },
  { label: "Module 4", icon: <SVG.DriveFileMove fill={"#FFFFFF"} /> },
  { label: "Module 5", icon: <SVG.Label fill={"#FFFFFF"} /> },
  { label: "Module 6", icon: <SVG.Lightbulb fill={"#FFFFFF"} /> },
];

const lightThemeprimaryitems = [
  {
    label: "Home",
    icon: <SVG.Home fill={"#0B4B66"} />,
    selectedIcon: <SVG.Home fill={"#ffffff"} />,
  },
  {
    label: "Module 1",
    icon: <SVG.ChatBubble fill={"#0B4B66"} />,
    selectedIcon: <SVG.ChatBubble fill={"#ffffff"} />,
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: <SVG.Work fill={"#0B4B66"} />,
        selectedIcon: <SVG.Work fill={"#ffffff"} />,
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: <SVG.Person fill={"#0B4B66"} />,
        selectedIcon: <SVG.Person fill={"#ffffff"} />,
      },
    ],
  },
  {
    label: "Module 2",
    icon: <SVG.CheckCircle fill={"#0B4B66"} />,
    selectedIcon: <SVG.CheckCircle fill={"#ffffff"} />,
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: <SVG.Info fill={"#0B4B66"} />,
        selectedIcon: <SVG.Info fill={"#ffffff"} />,
        children: [
          {
            path: "/",
            label: "InnerModule 1",
            icon: <SVG.LabelImportant fill={"#0B4B66"} />,
            selectedIcon: <SVG.LabelImportant fill={"#ffffff"} />,
          },
          {
            path: "/",
            label: "InnerModule 2",
            icon: <SVG.Lock fill={"#0B4B66"} />,
            selectedIcon: <SVG.Lock fill={"#ffffff"} />,
          },
        ],
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: <SVG.Accessibility fill={"#0B4B66"} />,
        selectedIcon: <SVG.Accessibility fill={"#ffffff"} />,
      },
    ],
  },
  {
    label: "Module 3",
    icon: <SVG.Delete fill={"#0B4B66"} />,
    selectedIcon: <SVG.Delete fill={"#ffffff"} />,
  },
  {
    label: "Module 4",
    icon: <SVG.DriveFileMove fill={"#0B4B66"} />,
    selectedIcon: <SVG.DriveFileMove fill={"#ffffff"} />,
  },
  {
    label: "Module 5",
    icon: <SVG.Label fill={"#0B4B66"} />,
    selectedIcon: <SVG.Label fill={"#ffffff"} />,
  },
  {
    label: "Module 6",
    icon: <SVG.Lightbulb fill={"#0B4B66"} />,
    selectedIcon: <SVG.Lightbulb fill={"#ffffff"} />,
  },
];

const lightThemesecondaryitems = [
  {
    label: "Home",
    icon: <SVG.Home fill={"#0B4B66"} />,
  },
  {
    label: "Module 1",
    icon: <SVG.ChatBubble fill={"#0B4B66"} />,
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: <SVG.Work fill={"#0B4B66"} />,
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: <SVG.Person fill={"#0B4B66"} />,
      },
    ],
  },
  {
    label: "Module 2",
    icon: <SVG.CheckCircle fill={"#0B4B66"} />,
    children: [
      {
        path: "/",
        label: "SubModule 1",
        icon: <SVG.Info fill={"#0B4B66"} />,
        children: [
          {
            path: "/",
            label: "InnerModule 1",
            icon: <SVG.LabelImportant fill={"#0B4B66"} />,
          },
          {
            path: "/",
            label: "InnerModule 2",
            icon: <SVG.Lock fill={"#0B4B66"} />,
          },
        ],
      },
      {
        path: "/",
        label: "SubModule 2",
        icon: <SVG.Accessibility fill={"#0B4B66"} />,
      },
    ],
  },
  {
    label: "Module 3",
    icon: <SVG.Delete fill={"#0B4B66"} />,
  },
  {
    label: "Module 4",
    icon: <SVG.DriveFileMove fill={"#0B4B66"} />,
  },
  {
    label: "Module 5",
    icon: <SVG.Label fill={"#0B4B66"} />,
  },
  {
    label: "Module 6",
    icon: <SVG.Lightbulb fill={"#0B4B66"} />,
  },
];


const commonArgs = {
  items: darkThemeitems,
  expandedWidth: "200px",
  transitionDuration: 0.3,
  theme: "dark",
};

// Default Sidebar
export const DarkThemePrimarySideBar = Template.bind({});
DarkThemePrimarySideBar.args = {
  ...commonArgs,
};

// Default Sidebar
export const DarkThemeSecondarySideBar = Template.bind({});
DarkThemeSecondarySideBar.args = {
  ...commonArgs,
  variant: "secondary",
};

// Default Sidebar
export const LightThemePrimarySideBar = Template.bind({});
LightThemePrimarySideBar.args = {
  ...commonArgs,
  theme: "light",
  items: lightThemeprimaryitems,
};

// Default Sidebar
export const LightThemeSecondarySideBar = Template.bind({});
LightThemeSecondarySideBar.args = {
  ...commonArgs,
  theme: "light",
  variant: "secondary",
  items: lightThemesecondaryitems,
};

// Custom Sidebar with different widths
// export const CustomWidth = Template.bind({});
// CustomWidth.args = {
//   ...commonArgs,
//   collapsedWidth: "80px",
//   expandedWidth: "250px",
// };

// // Custom Sidebar with a longer transition duration
// export const LongTransition = Template.bind({});
// LongTransition.args = {
//   ...commonArgs,
//   transitionDuration: 1.0,
// };
