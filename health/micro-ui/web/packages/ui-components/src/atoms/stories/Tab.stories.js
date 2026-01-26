import React, { useState } from "react";
import Tab from "../Tab";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Tab",
  component: Tab,
  argTypes: {
    configNavItems: { control: "object", table: { disable: true } },
    activeLink: { control: "text", table: { disable: true } },
    configItemKey: { control: "text", table: { disable: true } },
    setActiveLink: { action: "setActiveLink", table: { disable: true } },
    showNav: { control: "boolean", table: { disable: true } },
    style: { control: "object", table: { disable: true } },
    className: { control: "text", table: { disable: true } },
    inFormComposer: { control: "boolean", table: { disable: true } },
    navClassName: { control: "text", table: { disable: true } },
    navStyles: { control: "object", table: { disable: true } },
    itemStyle: { control: "object", table: { disable: true } },
    items: { table: { disable: true } },
    onTabClick: { action: "onChange", table: { disable: true } },
    WithIcons: { control: "boolean" },
    Tab1Label: { control: "text", name: "Tab 1 Label" },
    Tab2Label: { control: "text", name: "Tab 2 Label" },
    Tab3Label: { control: "text", name: "Tab 3 Label" },
    Tab4Label: { control: "text", name: "Tab 4 Label" },
  },
};

const commonStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "#363636",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "translate(-50%, -50%)",
};

const exampleItems = [
  { name: "Tab 1", code: "Tab 1" },
  { name: "Tab 2", code: "Tab 2" },
  { name: "Tab 3", code: "Tab 3" },
  { name: "Tab 4", code: "Tab 4" },
];

const exampleItemsWithIcons = [
  { name: "Tab 1", code: "Tab 1", icon: "Home" },
  { name: "Tab 2", code: "Tab 2", icon: "MyLocation" },
  { name: "Tab 3", code: "Tab 3", icon: "Article" },
  { name: "Tab 4", code: "Tab 4", icon: "AccountCircle" },
];

const Template = (args) => {
  const { WithIcons, ...rest } = args;
  const [activeLink, setActiveLink] = useState(args.activeLink);

  // Dynamic configNavItems update
  const configNavItems = WithIcons
    ? [...exampleItemsWithIcons]
    : [...exampleItems];
  configNavItems[0].code = args.Tab1Label && args.Tab1Label !=="" ?  args.Tab1Label : configNavItems[0].code;
  configNavItems[1].code = args.Tab2Label && args.Tab2Label!=="" ?  args.Tab2Label : configNavItems[1].code;
  configNavItems[2].code = args.Tab3Label && args.Tab3Label!=="" ?  args.Tab3Label : configNavItems[2].code;
  configNavItems[3].code = args.Tab4Label && args.Tab4Label!=="" ?  args.Tab4Label : configNavItems[3].code;

  return (
    <div style={commonStyles}>
      <Tab
        {...rest}
        configNavItems={configNavItems}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />
    </div>
  );
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Tab Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  WithIcons: { table: { disable: true } },
  Tab1Label: { table: { disable: true }},
  Tab2Label: { table: { disable: true }},
  Tab3Label: {table: { disable: true } },
  Tab4Label: { table: { disable: true } },
};

const commonArgs = {
  activeLink: "Tab 2",
  showNav: true,
  style: {},
  className: "",
  navClassName: "",
  configItemKey: "code",
  navStyles: {},
  onTabClick: (item) => {
    console.log(item);
  },
  itemStyle: {},
  WithIcons: false,
  Tab1Label: "",
  Tab2Label: "",
  Tab3Label: "",
  Tab4Label: "",
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
};

export const Custom = Template.bind({});
Custom.args = {
  ...Basic.args,
  style: { backgroundColor: "#FFFFFF" },
  itemStyle: { backgroundColor: "#FAFAFA", border: "1px solid black" },
};
