import React, { useState } from "react";
import Stepper from "../Stepper";

export default {
  title: "Atoms/Stepper",
  component: Stepper,
  argTypes: {
    config: { control: "object" },
    inputRef: { control: false },
    onChange: { action: "onChange" },
    props: { control: "object" },
    populators: { control: "object" },
    formData: { control: "object" },
    onStepClick: { action: "onChange" },
    totalSteps: { action: "number" },
    customSteps: { control: "object" },
    direction: {
      control: {
        type: "select",
        options: ["vertical", "horizontal"],
      },
    },
    style: { control: "object" },
    props: { control: "object" },
    activeSteps: { action: "number" },
  },
};

const Template = (args) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onStepClick = (step) => {
    console.log("step", step);
    setCurrentStep(step);
  };

  return (
    <Stepper
      {...args}
      currentStep={currentStep + 1}
      onStepClick={onStepClick}
    />
  );
};

const t = (key) => key;

const commonArgs = {
  populators: {
    name: "stepper",
  },
  customSteps: {},
  totalSteps: 5,
  direction: "horizontal",
  onStepClick: () => {},
  style: {},
  props: {
    labelStyles: {},
  },
  activeSteps:""
};

//Default stepper
export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
};

//Default stepper
export const WithIsActive = Template.bind({});
WithIsActive.args = {
  ...commonArgs,
  activeSteps:3
};
