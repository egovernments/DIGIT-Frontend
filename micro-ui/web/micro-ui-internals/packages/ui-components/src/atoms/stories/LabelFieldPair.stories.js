import React from "react";
import LabelFieldPair from "../LabelFieldPair";
import TextBlock from "../TextBlock";
import TextInput from "../TextInput";

export default {
  title: "Atoms/LabelFieldPair",
  component: LabelFieldPair,
  argTypes: {
    className: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    vertical: {
      control: "boolean",
    },
  },
};


export const Default = () => (
  <LabelFieldPair>
    <TextBlock body={"Name"}></TextBlock>
    <TextInput type="text"></TextInput>
  </LabelFieldPair>
);

export const VerticalAlignment = () => (
  <LabelFieldPair vertical={true}>
    <TextBlock body={"Name"}></TextBlock>
    <TextInput type="text"></TextInput>
  </LabelFieldPair>
);
