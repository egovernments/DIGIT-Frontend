import React from "react";
import LandingPageCard from "../../molecules/LandingPageCard";
import { Iframe } from "../../atoms";

export default {
  title: "Molecules/Landing Page Card",
  component: LandingPageCard,
  argTypes: {
    icon: { control: "object", table: { disable: true } },
    moduleName: { control: "text", name: "Heading" },
    metrics: { control: "boolean", name: "Show Metrics" },
    children: { control: "boolean", name: "Custom Content" },
    links: { control: "boolean", name: "Show Links" },
    className: { control: "text", table: { disable: true } },
    style: { control: "object", table: { disable: true } },
    moduleAlignment: {
      control: "select",
      options: ["Left", "Right"],
      name: "Icon Alignement",
      mapping: {
        Left: "right",
        Right: "left",
      },
    },
    metricAlignment: {
      control: "select",
      options: ["left", "centre"],
      name: "Metric Alignment",
    },
    iconBg: {
      control: "select",
      name: "Icon",
      mapping: {
        Default: false,
        Filled: true,
      },
      options: ["Default", "Filled"],
    },
    onMetricClick: { control: "action", table: { disable: true } },
    hideDivider: { table: { disable: true } },
    buttonSize: {
      control: "select",
      options: ["large", "medium", "small"],
      table: { disable: true },
    },
  },
};

const centreChildrenToShow = [
  <div>{"Here you can add any text content between metrics and links"}</div>,
];

const endChildrenToShow = [
  <div>{"Here you can add any text content below links"}</div>,
];

const metricsToShow = [
  {
    count: 40,
    label: "Lorem Ipsum",
    link:
      "https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary",
  },
  {
    count: 40,
    label: "Lorem Ipsum",
    link:
      "https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary",
  },
];

const linksToShow = [
  {
    label: "Create User",
    link:
      "https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary",
    icon: "Person",
  },
  {
    label: "Edit User",
    link:
      "https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary",
    icon: "Edit",
  },
  {
    label: "View User",
    link:
      "https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary",
    icon: "Preview",
  },
  {
    label: "Delete User",
    link:
      "https://unified-dev.digit.org/storybook/?path=/story/atoms-backlink--primary",
    icon: "Delete",
  },
];

const Template = (args) => {
  const { metrics, links, children, ...rest } = args;
  return (
    <LandingPageCard
      metrics={metrics ? metricsToShow : []}
      links={links ? linksToShow : []}
      endChildren={children ? endChildrenToShow : []}
      centreChildren={children ? centreChildrenToShow : []}
      {...rest}
    />
  );
};

const commonArgs = {
  icon: "SupervisorAccount",
  moduleName: "Heading",
  moduleAlignment: "Left",
  buttonSize: "medium",
  metrics: true,
  links: true,
  className: "",
  metricAlignment: "left",
  style: {},
  iconBg: "Default",
  onMetricClick: (metric, count) => {
    console.log(metric, count);
  },
  children: false,
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="LandingPageCard Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  moduleName: { table: { disable: true } },
  metrics: { table: { disable: true } },
  links: { table: { disable: true } },
  metricAlignment: { table: { disable: true } },
  iconBg: { table: { disable: true } },
  children: { table: { disable: true } },
  moduleAlignment: { table: { disable: true } },
};


export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  style: {
    backgroundColor: "#fafafa",
    padding: "20px",
    borderRadius: "8px",
    border: "2px solid black",
  },
};