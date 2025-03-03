import React from "react";
import BreadCrumb from "../BreadCrumb";
import { BrowserRouter as Router } from "react-router-dom";
import { SVG } from "../SVG";

export default {
  title: "Atoms/BreadCrumb",
  component: BreadCrumb,
  argTypes: {
    className: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    crumbs: {
      control: { type: "object" },
    },
    spanStyle: {
      control: { type: "object" },
    },
    maxItems: {
      control: { type: "number" },
    },
    itemsAfterCollapse: {
      control: { type: "number" },
    },
    itemsBeforeCollapse: {
      control: { type: "number" },
    },
    expandText:{
        control:{type:"text"}
    }
  },
};

const Template = (args) => (
  <Router>
    <BreadCrumb {...args} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {
  crumbs: [
    {
      content: "Home",
      show: true,
    },
    {
      content: "Previous",
      show: true,
    },
    {
      content: "Current",
      show: true,
    },
  ],
};

export const WithIcons = Template.bind({});
WithIcons.args = {
  crumbs: [
    {
      path: "",
      content: "Home",
      show: true,
      icon: <SVG.Home fill={"#C84C0E"} />,
    },
    {
      path: "",
      content: "Previous",
      show: true,
      icon: <SVG.Person fill={"#C84C0E"} />,
    },
    {
      path: "",
      content: "Current",
      show: true,
      icon: <SVG.Edit fill={"#787878"} />,
    },
  ],
};

export const WithCustomSeperator = Template.bind({});
WithCustomSeperator.args = {
  crumbs: [
    {
      content: "Home",
      show: true,
    },
    {
      content: "Previous",
      show: true,
    },
    {
      content: "Current",
      show: true,
    },
  ],
  customSeperator: <SVG.ArrowForward fill={"#C84C0E"} />,
};

export const CollapsedBreadCrumbs = Template.bind({});
CollapsedBreadCrumbs.args = {
  crumbs: [
    {
      content: "Home",
      show: true,
    },
    {
      content: "Previous1",
      show: true,
    },
    {
      content: "Previous2",
      show: true,
    },
    {
      content: "Previous3",
      show: true,
    },
    {
      content: "Current",
      show: true,
    },
  ],
  maxItems: 3,
};

export const CollapsedBreadCrumbsWithCustomValues = Template.bind({});
CollapsedBreadCrumbsWithCustomValues.args = {
  crumbs: [
    {
      content: "Home",
      show: true,
    },
    {
      content: "Previous1",
      show: true,
    },
    {
      content: "Previous2",
      show: true,
    },
    {
      content: "Previous3",
      show: true,
    },
    {
      content: "Current",
      show: true,
    },
  ],
  maxItems: 3,
  itemsBeforeCollapse:1,
  itemsAfterCollapse:2
};

export const CollapsedBreadCrumbsWithExpandText = Template.bind({});
CollapsedBreadCrumbsWithExpandText.args = {
  crumbs: [
    {
      content: "Home",
      show: true,
    },
    {
      content: "Previous1",
      show: true,
    },
    {
      content: "Previous2",
      show: true,
    },
    {
      content: "Previous3",
      show: true,
    },
    {
      content: "Current",
      show: true,
    },
  ],
  maxItems: 3,
  expandText:"{click here to expand}"
};