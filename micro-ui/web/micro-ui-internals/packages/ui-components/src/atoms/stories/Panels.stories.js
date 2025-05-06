import React from "react";
import Panels from "../Panels";

export default {
  title: "Atoms/Panels",
  component: Panels,
  argTypes: {
    type: { control: "select", options: ["success", "error"] },
    className: {
      control: "text",
    },
    message: {
      control: "text",
    },
    info: {
      control: "text",
    },
    response: {
      control: "text",
    },
    customIcon: {
        control: "text",
      },
      iconFill: {
        control: "text",
      },
    style: {
      control: { type: "object" },
    },
    multipleResponses: {
      control: {
        type: "array",
        separator: ",",
      },
    },
    showAsSvg:{
      control:"boolean"
    },
    animationProps:{
      control: {type :"object"}
    }
  },
};

const Template = (args) => <Panels {...args} />;

const commonArgs = {
  className: "",
  message: "Message",
  type: "success",
  info: "Ref ID ",
  response: "949749795479",
  customIcon:"",
  iconFill:"",
  style: {},
  showAsSvg:false,
  multipleResponses:[],
  animationProps:{
    noAutoplay:false,
    loop :false
  }
};

export const SuccessPanel = Template.bind({});
SuccessPanel.args = {
  ...commonArgs,
  type: "success",
  message: "Success Message!",
};

export const SuccessPanelWithAnimationProperties = Template.bind({});
SuccessPanelWithAnimationProperties.args = {
  ...commonArgs,
  type: "success",
  message: "Success Message!",
  animationProps:{
    ...commonArgs.animationProps,
    loop :true,
    width:100,
    height:100
  }
};

export const SuccessPanelWithoutAnimation = Template.bind({});
SuccessPanelWithoutAnimation.args = {
  ...commonArgs,
  type: "success",
  message: "Success Message!",
  showAsSvg:true
};

export const SuccessPanelWithMultipleResponses = Template.bind({});
SuccessPanelWithMultipleResponses.args = {
  ...commonArgs,
  type: "success",
  message: "Success Message!",
  multipleResponses:["949749795469","949749795579","949749795499"]
};

export const ErrorPanel = Template.bind({});
ErrorPanel.args = {
  ...commonArgs,
  type: "error",
  message: "Error Message!",
};

export const ErrorPanelWithAnimationProperties = Template.bind({});
ErrorPanelWithAnimationProperties.args = {
  ...commonArgs,
  type: "error",
  message: "Error Message!",
  animationProps:{
    loop :true,
    width:100,
    height:100
  }
};


export const ErrorPanelWithoutAnimation = Template.bind({});
ErrorPanelWithoutAnimation.args = {
  ...commonArgs,
  type: "error",
  message: "Error Message!",
  showAsSvg:true
};

export const ErrorPanelWithMultipleResponses = Template.bind({});
ErrorPanelWithMultipleResponses.args = {
  ...commonArgs,
  type: "error",
  message: "Success Message!",
  multipleResponses:["949749795469","949749795579","949749795499"]
};