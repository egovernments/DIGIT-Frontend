import React, { useState, useEffect } from "react";
// import Fields from "../Fields";
import FieldV1 from "../FieldV1";

export default {
  title: "Atom-Groups/InputField",
  component: FieldV1,
  argTypes: {
    type: {
      control: {
        type: "select",
        options: [
          "text",
          "date",
          "time",
          "geolocation",
          "numeric",
          "password",
          "search",
          "textarea",
        ],
      },
    },
    disabled: {control: "boolean"},
    nonEditable:{control:"boolean"},
    charCount: { control: "boolean" },
    onChange: { action: "onChange" },
  },
};

const Template = (args) => {

  const [value, setValue] = useState(args.value || "");
  const [type, setType] = useState(args.type || "");

  useEffect(() => {
    setValue(args.value || "");
  }, [args.type]);

  useEffect(() => {
    setType(args.type || "");
  }, [args.type]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    const newType =event.target.type;
    setValue(newValue);
    setType(newType);

    args.onChange({ ...event, target: { ...event.target, value: newValue , type:newType} });
  };

  return <FieldV1 {...args} value={value} onChange={handleInputChange} type={type}/>;
};

const commonArgs ={
  type: "text",
  populators: {
    prefix:"",
    suffix:"",
    customIcon:""
  },
  value:"",
  error:"",
  label:"",
  disabled: false,
  nonEditable:false,
  placeholder:"",
  inline:false,
  required: false,
  description:"",
  charCount:false,
  withoutLabel:false,
  infoMessage:""
}


export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
};

export const Filled = Template.bind({});
Filled.args = {
  ...commonArgs,
  value:"Input Value"
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...commonArgs,
  disabled: true
};
Disabled.argTypes = {
  disabled: { control: { disable: true } },
};

export const NonEditable = Template.bind({});
NonEditable.args = {
  ...commonArgs,
  nonEditable:true,
  value:"Input Value"
};
NonEditable.argTypes = {
  nonEditable: { control: { disable: true } },
};

export const Error = Template.bind({});
Error.args = {
  ...commonArgs,
  error: "Error!"
};
