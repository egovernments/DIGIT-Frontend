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
    type: { control: "text"},
    props: { control: "object" },
    populators: { control: "object" },
    formData: { control: "object" },
  },
};


const Template = (args) => (
  <FieldV1 {...args} />
);

const t = (key) => key;


const commonArgs ={
  t: t,
  populators:{
    title:"Value",
    name:"checked"
  },
  formData:{
    checked:true
  },
  inputRef: null,
  onChange: () => { },
  value: " ",
  errorStyle: null,
  disabled: false,
  type: "checkbox",
  description:""
}

export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  populators:{
    ...commonArgs.populators,
    title:""
  },
  formData:{
    ...commonArgs.formData,
    checked:false
  },
};

export const DefaultLabelled = Template.bind({});
DefaultLabelled.args = {
  ...commonArgs,
  populators:{
    ...commonArgs.populators,
    title:"Value"
  },
  formData:{
    ...commonArgs.formData,
    checked:false
  },
};

export const DefaultDisabled = Template.bind({});
DefaultDisabled.args = {
  ...commonArgs,
  populators:{
    ...commonArgs.populators,
    title:"Value"
  },
  formData:{
    ...commonArgs.formData,
    checked:false
  },
  disabled:true
};

export const Checked = Template.bind({});
Checked.args = {
  ...commonArgs,
  populators:{
    ...commonArgs.populators,
    title:""
  },
  formData:{
    ...commonArgs.formData,
    checked:true
  },
};

export const CheckedLabelled = Template.bind({});
CheckedLabelled.args = {
  ...commonArgs,
  populators:{
    ...commonArgs.populators,
    title:"Value"
  },
  formData:{
    ...commonArgs.formData,
    checked:true
  },
};

export const CheckedDisabled = Template.bind({});
CheckedDisabled.args = {
  ...commonArgs,
  populators:{
    ...commonArgs.populators,
    title:"Value"
  },
  formData:{
    ...commonArgs.formData,
    checked:true
  },
  disabled:true
};