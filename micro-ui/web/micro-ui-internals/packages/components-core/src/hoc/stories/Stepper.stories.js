import React from "react";
import FieldV1 from "../FieldV1";
import { Stepper } from "../..";

export default {
  title: "Atom-Groups/Stepper",
  component: Stepper,
  argTypes: {
    config: { control: "object" },
    inputRef: { control: false },
    onChange: { action: "onChange" },
    value: { control: "text" },
    type: { control: "text" },
    props: { control: "object" },
    populators: { control: "object" },
    formData: { control: "object" },
    currentStep:{control:"number"},
    onStepClick:{action:"onChange"},
    totalSteps:{action:"number"},
    customSteps:{control:"object"},
    direction: {
      control: {
        type: "select",
        options: ["vertical", "horizontal"],
      },
    },
  },
};

const Template = (args) => <Stepper {...args} />;

const t = (key) => key;

const commonArgs = {
  populators: {
    name: "stepper",
  },
  type: "stepper",
  currentStep: 1,
  customSteps: {},
  totalSteps: 5,
  direction:"horizontal",
  onStepClick: () => { console.log("step clicked") },
};

//Default stepper
export const Default = Template.bind({});
Default.args = {
  ...commonArgs
};
