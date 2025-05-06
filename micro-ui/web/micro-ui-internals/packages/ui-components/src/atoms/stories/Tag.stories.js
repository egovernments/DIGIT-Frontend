import React from "react";
import Tag from "../Tag";

export default {
  title: "Atoms/Tag",
  component: Tag,
  argTypes: {
    className: {
      control: "text",
    },
    iconClassName:{
      control: "text",
    },
    label: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    labelStyle: {
      control: { type: "object" },
    },
    stroke: {
      control: "boolean",
    },
    type: {
      control: "select",
      options: ["monochrome", "success", "warning", "error"],
    },
    alignment: {
      control: "select",
      options: ["center", "left", "right"],
    },
    icon: {
      control: "text",
    },
    showIcon: {
      control: "boolean",
    },
  },
};

const Template = (args) => (
    <Tag {...args} />
);

const commonArgs = {
  label: "Tag",
  className: "",
  style: {},  
  stroke: false,
  type:"success",
  icon:"",
  showIcon:false,
  labelStyle:{}
};

export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  ...commonArgs,
  label:"Tag With Icon",
  showIcon:true,
};

export const WithStroke = Template.bind({});
WithStroke.args = {
  ...commonArgs,
  label:"Tag With Stroke",
  stroke:true
};

export const WithIconAndStroke = Template.bind({});
WithIconAndStroke.args = {
  ...commonArgs,
  label:"Tag With icon & stroke",
  stroke:true,
  showIcon:true
};

export const WithCustomIconAndStyles = Template.bind({});
WithCustomIconAndStyles.args = {
  ...commonArgs,
  label:"Tag With custom icons & colors",
  stroke:true,
  showIcon:true,
  icon:"MyLocation",
  style:{
    backgroundColor:"#FCF2E4",
  },
  labelStyle:{
    color:"#0B4B66"
  }
};

export const WithOnClick = Template.bind({});
WithOnClick.args = {
  ...commonArgs,
  label:"Tag With OnClick Function",
  onClick:()=>{console.log("clicked")}
};

export const WithAlignment = Template.bind({});
WithAlignment.args = {
  ...commonArgs,
  label:"Tag With custom icons & colors",
  stroke:true,
  showIcon:true,
  icon:"MyLocation",
  style:{
    width:"600px",
  },
  labelStyle:{
    color:"#0B4B66"
  }
};