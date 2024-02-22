import React from "react";
import FieldV1 from "../FieldV1";
import { Stepper } from "../..";

export default {
  title: "Atom-Groups/Stepper",
  component: Stepper,
  argTypes: {
    config: { control: "object" },
    inputRef: { control: false },
    label: { control: "text" },
    onChange: { action: "onChange" },
    value: { control: "text" },
    errorStyle: { control: "object" },
    disabled: { control: "boolean" },
    type: { control: "text" },
    props: { control: "object" },
    populators: { control: "object" },
    formData: { control: "object" },
    currentStep:{control:"text"},
    onStepClick:{action:"onChange"},
    flow:{control:"text"}
  },
};

const Template = (args) => <Stepper {...args} />;

const t = (key) => key;

const commonArgs = {
  populators: {
    name: "stepper",
  },
  type: "stepper",
  currentStep:1,
  flow:"",
  onStepClick: () => {console.log("step clicked")},
};

//Default checkbox
export const Default = Template.bind({});
Default.args = {
  ...commonArgs
};
