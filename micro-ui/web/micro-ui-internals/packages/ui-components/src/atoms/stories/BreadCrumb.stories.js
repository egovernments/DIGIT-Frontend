import React from "react";
import BreadCrumb from "../BreadCrumb";
import { BrowserRouter as Router } from "react-router-dom";
import { SVG } from "../SVG";
import Iframe from "../Iframe";

export default {
  title: "Atoms/BreadCrumb",
  component: BreadCrumb,
  argTypes: {
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    crumbs: { table: { disable: true } },
    spanStyle: { table: { disable: true } },
    maxItems: { table: { disable: true } },
    itemsAfterCollapse: { table: { disable: true } },
    itemsBeforeCollapse: { table: { disable: true } },
    expandText: { table: { disable: true } },
    customSeparator: { table: { disable: true } },
    WithIcons: {
      control: "boolean",
      name:"With Icons"
    },
    WithCustomSeparator: {
      control: "boolean",
      name:"With Custom Seperator"
    },
  },
};

// Updated crumbs with icons
const iconCrumbs = [
  {
    content: "Home",
    show: true,
    internalLink: "/home",
    icon: <SVG.Home fill={"#C84C0E"} />,
  },
  {
    content: "Previous1",
    show: true,
    internalLink: "/previous1",
    icon: <SVG.Person fill={"#C84C0E"} />,
  },
  {
    content: "Previous2",
    show: true,
    internalLink: "/previous2",
    icon: <SVG.Edit fill={"#C84C0E"} />,
  },
  {
    content: "Previous3",
    show: true,
    internalLink: "/previous3",
    icon: <SVG.Person fill={"#C84C0E"} />,
  },
  {
    content: "Current",
    show: true,
    internalLink: "/current",
    icon: <SVG.Edit fill={"#787878"} />,
  },
];
const crumbs = [
  {
    content: "Home",
    show: true,
    internalLink: "/home",
  },
  {
    content: "Previous1",
    show: true,
    internalLink: "/previous1",
  },
  {
    content: "Previous2",
    show: true,
    internalLink: "/previous2",
  },
  {
    content: "Previous3",
    show: true,
    internalLink: "/previous3",
  },
  {
    content: "Current",
    show: true,
    internalLink: "/current",
  },
];


const commonArgs = {
  WithCustomSeparator: false,
  WithIcons:false
};

const Template = (args) => {
  const { WithIcons, WithCustomSeparator, ...rest } = args;
  const customSeparator = WithCustomSeparator ? (
    <SVG.ArrowForward fill={"#C84C0E"} />
  ) : undefined;
  const finalCrumbs = WithIcons ? iconCrumbs : crumbs || [];
  return (
    <Router>
      <BreadCrumb
        {...rest}
        crumbs={finalCrumbs}
        customSeparator={customSeparator}
      />
    </Router>
  );
};

export const Documentation = () => (
  <Iframe
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Breadcrumb Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  WithCustomSeparator: { table: { disable: true } },
  WithIcons: { table: { disable: true }},
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs
};

export const Collapsed = Template.bind({});
Collapsed.args = {
  ...commonArgs,
  maxItems: 3,
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  maxItems: 3,
  itemsBeforeCollapse: 1,
  itemsAfterCollapse: 2,
  spanStyle: {
    color: "#0B4B66",
  },
};
