import React from "react";
import MetricCard from "../MetricCard";
import { Iframe } from "../../atoms";

export default {
  title: "Molecules/Metric Card",
  component: MetricCard,
  argTypes: {
    metrics: { control: "array", table: { disable: true } },
    layout: { control: "text", table: { disable: true } },
    withDivider: { control: "boolean", table: { disable: true } },
    className: { control: "text", table: { disable: true } },
    styles: { control: "object", table: { disable: true } },
    statusmessage: { control: "text", table: { disable: true } },
    withBottomDivider: { control: "boolean", table: { disable: true } },
    Dividers: {
      control: "select",
      options: ["Vertical", "Horizontal", "Both"],
    },
  },
};

const Template = (args) => {
  const { Dividers, ...rest } = args;
  return (
    <MetricCard
      {...rest}
      withDivider={Dividers === "Vertical" || Dividers === "Both"}
      withBottomDivider={Dividers === "Horizontal" || Dividers === "Both"}
    />
  );
};

const commonArgs = {
  metrics: [],
  className: "",
  styles: {},
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="MetricCard Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  Dividers: { table: { disable: true } },
};

export const HorizontallyStacked = Template.bind({});
HorizontallyStacked.args = {
  ...commonArgs,
  layout: "",
  metrics: [
    {
      value: "3%",
      description: "Test Compilance",
      statusmessage: "10% than state average",
      status: "Decreased",
    },
    {
      value: "60%",
      description: "Quality Tests Passed",
      statusmessage: "80% than state average",
      status: "Increased",
    },
    {
      value: "90%",
      description: "description",
      statusmessage: "15% than state average",
      status: "Nochange",
    },
    {
      value: "26%",
      description: "description",
      statusmessage: "6% than state average",
      status: "Increased",
    },
  ],
};

export const VerticallyStacked = Template.bind({});
VerticallyStacked.args = {
  ...commonArgs,
  metrics: [
    {
      value: "3%",
      description: "Test Compilance",
      statusmessage: "10% than state average",
      status: "Decreased",
    },
    {
      value: "60%",
      description: "Quality Tests Passed",
      statusmessage: "80% than state average",
      status: "Increased",
    },
    {
      value: "90%",
      description: "description",
      statusmessage: "15% than state average",
      status: "Nochange",
    },
    {
      value: "26%",
      description: "description",
      statusmessage: "6% than state average",
      status: "Increased",
    },
  ],
};

export const Mixed = Template.bind({});
Mixed.args = {
  ...commonArgs,
  layout: "2*2",
  metrics: [
    {
      value: "3%",
      description: "Test Compilance",
      statusmessage: "10% than state average",
      status: "Decreased",
    },
    {
      value: "60%",
      description: "Quality Tests Passed",
      statusmessage: "80% than state average",
      status: "Increased",
    },
    {
      value: "90%",
      description: "description",
      statusmessage: "15% than state average",
      status: "Nochange",
    },
    {
      value: "26%",
      description: "description",
      statusmessage: "6% than state average",
      status: "Increased",
    },
  ],
};

// MetricCard with custom styles
export const Custom = Template.bind({});
Custom.args = {
  className: "",
  layout: "2*2",
  metrics: [
    {
      value: "3%",
      description: "Test Compilance",
      statusmessage: "10% than state average",
      status: "Decreased",
    },
    {
      value: "60%",
      description: "Quality Tests Passed",
      statusmessage: "80% than state average",
      status: "Increased",
    },
    {
      value: "90%",
      description: "description",
      statusmessage: "15% than state average",
      status: "Nochange",
    },
    {
      value: "26%",
      description: "description",
      statusmessage: "6% than state average",
      status: "Increased",
    },
  ],
  styles: {
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    border: "2px solid #333",
  },
};