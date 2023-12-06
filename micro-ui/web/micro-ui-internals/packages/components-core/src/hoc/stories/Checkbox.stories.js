import React from "react";
import FieldV1 from "../FieldV1";
import { CheckBox } from "../../atoms";

export default {
  title: "Atom-Groups/CheckBoxField",
  component: CheckBox,
  argTypes: {
    config: { control: "object" },
    inputRef: { control: false },
    label: { control: "text" },
    onChange: { action: "onChange" },
    value: { control: "text" },
    errorStyle: { control: "object" },
    disabled: { control: "boolean" },
    type: { control: "select", options: ["checkbox"] },
    props: { control: "object" },
  },
};


const Template = (args) => (
  <FieldV1 {...args} />
);

const t = (key) => key;


export const CheckBoxStory = Template.bind({});
CheckBoxStory.args = {
  t: t,
  config: {
    checked: true
  },
  inputRef: null,
  label: "Label",
  onChange: () => { },
  value: " ",
  errorStyle: null,
  disabled: false,
  type: "checkbox",
  description:""
};

