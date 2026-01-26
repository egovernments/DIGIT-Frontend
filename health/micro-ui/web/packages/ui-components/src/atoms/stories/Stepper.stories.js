import React, { useState } from "react";
import Stepper from "../Stepper";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Stepper",
  component: Stepper,
  argTypes: {
    config: { control: "object" ,table:{disable:true}},
    inputRef: { control: false,table:{disable:true} },
    onChange: { action: "onChange",table:{disable:true} },
    props: { control: "object" ,table:{disable:true}},
    populators: { control: "object",table:{disable:true} },
    formData: { control: "object",table:{disable:true} },
    onStepClick: { action: "onChange" ,table:{disable:true}},
    totalSteps: { action: "number",name:"Number of steps" },
    currentStep:{table:{disable:true}},
    customSteps: { control: "object",table:{disable:true} },
    direction: {
      control: {
        type: "select",
        options: ["vertical", "horizontal"],
      },
      table:{disable:true}
    },
    style: { control: "object",table:{disable:true} },
    activeSteps: { action: "number",name:"Number of active steps" },
    hideDivider: { control: "boolean" ,name:'With Divider',mapping:{
      true:false,
      false:true
    }},
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
  activeSteps: 0,
  hideDivider: true,
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Stepper Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  totalSteps: { table: { disable: true } },
  hideDivider: { table: { disable: true }},
  activeSteps: {table:{disable:true}},
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  ...commonArgs,
};

export const Vertical = Template.bind({});
Vertical.args = {
  ...commonArgs,
  direction: "vertical",
};

// //With Active Steps stepper
// export const WithIsActive = Template.bind({});
// WithIsActive.args = {
//   ...commonArgs,
//   activeSteps: 3,
// };