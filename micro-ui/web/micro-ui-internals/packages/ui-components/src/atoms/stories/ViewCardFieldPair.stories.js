import React from "react";
import ViewCardFieldPair from "../ViewCardFieldPair";

export default {
  title: "Atoms/ViewCardFieldPair",
  component: ViewCardFieldPair,
  argTypes: {
    label: {
      control: "text",
    },
    value: {
      control: "text",
    },
    inline: {
      control: "boolean",
    },
    className: {
      control: "boolean",
    },
    style: {
      control: { type: "object" },
    },
  },
};

const Template = (args) => (
  <div>
    <ViewCardFieldPair {...args}></ViewCardFieldPair>
  </div>
);

const commonArgs = {
  label: "",
  value: "",
  inline: false,
  className: "",
  style: {},
};

export const DefaultPair = Template.bind({});
DefaultPair.args = {
  ...commonArgs,
  label: "Label",
  value: "Value",
};

export const InlinePair = Template.bind({});
InlinePair.args = {
  ...commonArgs,
  label: "Label",
  value: "Value",
  inline: true,
};

export const DefaultPairLargeValues = Template.bind({});
DefaultPairLargeValues.args = {
  ...commonArgs,
  label:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  value:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
};

export const InlinePairLargeValues = Template.bind({});
InlinePairLargeValues.args = {
  ...commonArgs,
  label:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  value:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  inline: true,
};
