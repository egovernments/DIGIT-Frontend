import React from "react";
import Button from "../Button";

export default {
  title: "Atoms/Button",
  component: Button,
  argTypes: {
    isDisabled: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    variation: {
      control: "select",
      options: ["primary", "secondary", "teritiary", "link"],
    },
    size: { control: "select", options: ["large", "medium", "small"] },
    className: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    onClick: {
      control: "function",
    },
    isSuffix: {
      control: "boolean",
    },
    title: {
      control: "text",
    },
    options: {
      control: {
        type: "array",
        separator: ",",
      },
    },
    isSearchable: {
      control: "boolean",
    },
    showBottom: {
      control: "boolean",
    },
    optionsKey: {
      control: "text",
    },
  },
};

const commonStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "#363636",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "translate(-50%, -50%)",
};

const Template = (args) => (
  <div style={commonStyles}>
    <Button {...args} />
  </div>
);

const commonArgs = {
  label: "Button",
  className: "custom-class",
  style: {},
  onClick: () => {console.log("clicked"); } ,
  isDisabled: false,
  variation: "",
  isSuffix: false,
  size: "",
  title:"",
  iconFill:"",
  options:[],
  optionsKey:"",
  isSearchable:false
};

// Button default
export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  variation: "",
};

// Button with primary variantion
export const Primary = Template.bind({});
Primary.args = {
  ...commonArgs,
  variation: "primary",
};

// Button with primary variantion and with icon
export const PrimaryWithIcon = Template.bind({});
PrimaryWithIcon.args = {
  ...commonArgs,
  variation: "primary",
  icon: "MyLocation",
};

// Button with primary variantion and with icon as a suffix
export const PrimaryWithSuffixIcon = Template.bind({});
PrimaryWithSuffixIcon.args = {
  ...commonArgs,
  variation: "primary",
  icon: "ArrowForward",
  isSuffix: true,
};

// Button with primary variantion and disabled
export const PrimarydDisabled = Template.bind({});
PrimarydDisabled.args = {
  ...commonArgs,
  variation: "primary",
  isDisabled: true,
};

// Button with primary variation and label with maxchars
export const PrimaryLabelWithMaxLength = Template.bind({});
PrimaryLabelWithMaxLength.args = {
  ...commonArgs,
  variation: "primary",
  label: "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopas",
};

// Button with secondary variantion
export const Secondary = Template.bind({});
Secondary.args = {
  ...commonArgs,
  variation: "secondary",
};

// Button with secondary variantion and with icon
export const SecondaryWithIcon = Template.bind({});
SecondaryWithIcon.args = {
  ...commonArgs,
  variation: "secondary",
  icon: "MyLocation",
};

// Button with secondary variantion and with icon as a suffix
export const SecondaryWithSuffixIcon = Template.bind({});
SecondaryWithSuffixIcon.args = {
  ...commonArgs,
  variation: "secondary",
  icon: "ArrowForward",
  isSuffix: true,
};

// Button with secondary variantion and disabled
export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
  ...commonArgs,
  variation: "secondary",
  isDisabled: true,
};

// Button with secondary variation and label with maxchars
export const SecondaryLabelWithMaxLength = Template.bind({});
SecondaryLabelWithMaxLength.args = {
  ...commonArgs,
  variation: "secondary",
  label: "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopas",
};

// Button with Teritiary variantion
export const Teritiary = Template.bind({});
Teritiary.args = {
  ...commonArgs,
  variation: "teritiary",
};

// Button with Teritiary variantion and with icon
export const TeritiaryWithIcon = Template.bind({});
TeritiaryWithIcon.args = {
  ...commonArgs,
  variation: "teritiary",
  icon: "MyLocation",
};

// Button with Teritiary variantion and with icon as a suffix
export const TeritiaryWithSuffixIcon = Template.bind({});
TeritiaryWithSuffixIcon.args = {
  ...commonArgs,
  variation: "teritiary",
  icon: "ArrowForward",
  isSuffix: true,
};

// Button with Teritiary variantion and disabled
export const TeritiaryDisabled = Template.bind({});
TeritiaryDisabled.args = {
  ...commonArgs,
  variation: "teritiary",
  isDisabled: true,
};

// Button with Teritiary variation and label with maxchars
export const TeritiaryLabelWithMaxLength = Template.bind({});
TeritiaryLabelWithMaxLength.args = {
  ...commonArgs,
  variation: "teritiary",
  label: "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopas",
};

// Button with link variantion
export const Link = Template.bind({});
Link.args = {
  ...commonArgs,
  variation: "link",
  label: "Link",
};

// Button with link variantion and with icon
export const LinkWithIcon = Template.bind({});
LinkWithIcon.args = {
  ...commonArgs,
  variation: "link",
  label: "Link",
  icon: "MyLocation",
};

// Button with link variantion and with icon as a suffix
export const LinkWithSuffixIcon = Template.bind({});
LinkWithSuffixIcon.args = {
  ...commonArgs,
  variation: "link",
  label: "Link",
  icon: "ArrowForward",
  isSuffix: true,
};

// Button with link variantion and disabled
export const LinkDisabled = Template.bind({});
LinkDisabled.args = {
  ...commonArgs,
  variation: "link",
  label: "Link",
  isDisabled: true,
};

// Button with link variation and label with maxchars
export const LinkLabelWithMaxLength = Template.bind({});
LinkLabelWithMaxLength.args = {
  ...commonArgs,
  variation: "link",
  label: "qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwertyuiopas",
};

export const ActionButtonOnBottom = Template.bind({});
ActionButtonOnBottom.args = {
  ...commonArgs,
  label:"ActionButton",
  variation: "primary",
  type:"actionButton",
  optionsKey:"name",
  isSearchable:true,
    options:[
      { name: "Action A", code: "Actiona" },
      { name: "Action B", code: "Actionb" },
      { name: "Action C", code: "Actionc" },
    ],
  showBottom:true,
  onOptionSelect:(e)=>{console.log(e,"option selected")}
};

export const UnsearchableActionButtonOnBottom = Template.bind({});
UnsearchableActionButtonOnBottom.args = {
  ...commonArgs,
  label:"ActionButton",
  variation: "primary",
  type:"actionButton",
  optionsKey:"name",
  isSearchable:false,
    options:[
      { name: "Action A", code: "Actiona" },
      { name: "Action B", code: "Actionb" },
      { name: "Action C", code: "Actionc" },
    ],
  showBottom:true,
  onOptionSelect:(e)=>{console.log(e,"option selected")}
  
};

export const ActionButtonOnTop = Template.bind({});
ActionButtonOnTop.args = {
  ...commonArgs,
  label:"ActionButton",
  variation: "primary",
  type:"actionButton",
  optionsKey:"name",
  isSearchable:true,
    options:[
      { name: "Action A", code: "Actiona" },
      { name: "Action B", code: "Actionb" },
      { name: "Action C", code: "Actionc" },
    ],
  showBottom:false,
  menuStyles:{
    bottom:"40px"
  },
  onOptionSelect:(e)=>{console.log(e,"option selected")}
};

export const UnsearchableActionButtonOnTop = Template.bind({});
UnsearchableActionButtonOnTop.args = {
  ...commonArgs,
  label:"ActionButton",
  variation: "primary",
  type:"actionButton",
  optionsKey:"name",
  isSearchable:false,
    options:[
      { name: "Action A", code: "Actiona" },
      { name: "Action B", code: "Actionb" },
      { name: "Action C", code: "Actionc" },
    ],
  showBottom:false,
  menuStyles:{
    bottom:"40px"
  },
  onOptionSelect:(e)=>{console.log(e,"option selected")}
};