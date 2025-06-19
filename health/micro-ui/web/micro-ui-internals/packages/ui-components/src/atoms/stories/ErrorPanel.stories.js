import React from "react";
import Panels from "../Panels";

export default {
  title: "Atoms/Panels/Error",
  component: Panels,
  argTypes: {
    type: {
      control: "select",
      options: ["success", "error"],
      table: { disable: true },
    },
    className: {
      control: "text",
      table: { disable: true },
    },
    message: {
      control: "text",
      table: { disable: true },
    },
    info: {
      control: "text",
      table: { disable: true },
    },
    response: {
      control: "text",
      table: { disable: true },
    },
    customIcon: {
      control: "text",
      table: { disable: true },
    },
    iconFill: {
      control: "text",
      table: { disable: true },
    },
    style: {
      control: { type: "object" },
      table: { disable: true },
    },
    multipleResponses: {
      control: {
        type: "array",
        separator: ",",
      },
      table: { disable: true },
    },
    showAsSvg: {
      control: "boolean",
      name: "With Animation",
      mapping: {
        true: false,
        false: true,
      },
    },
    animationProps: {
      control: { type: "object" },
      table: { disable: true },
    },
  },
};

const Template = (args) => <Panels {...args} />;

const commonArgs = {
  className: "",
  message: "Message",
  type: "success",
  info: "Description ",
  response: "949749795479",
  customIcon:"",
  iconFill:"",
  style: {},
  showAsSvg:true,
  multipleResponses:[],
  animationProps:{
    noAutoplay:false,
    loop :false
  }
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
  type: "error",
  message: "Error Message!",
};

export const WithAnimationProperties = Template.bind({});
WithAnimationProperties.args = {
  ...commonArgs,
  type: "error",
  message: "Error Message!",
  animationProps:{
    loop :true,
    width:100,
    height:100
  }
};

export const WithMultipleResponses = Template.bind({});
WithMultipleResponses.args = {
  ...commonArgs,
  type: "error",
  message: "Success Message!",
  multipleResponses:["949749795469","949749795579","949749795499"]
};