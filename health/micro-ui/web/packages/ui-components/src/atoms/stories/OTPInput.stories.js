import React, { useState } from "react";
import OTPInput from "../OTPInput";
import Iframe from "../Iframe";

export default {
  title: "Atoms/OTP Input",
  component: OTPInput,
  argTypes: {
    className: {
      control: "text",
      table: { disable: true },
    },
    style: {
      control: "object",
      table: { disable: true },
    },
    inline: {
      control: "select",
      name:"Label Alignment",
      options: ["Inline", "Above"],
      mapping: { Inline: true, Above: false },
    },
    label: {
      control: "text", name:"Label"
    },
    Error: {
      control: "boolean",
    },
    type: {
      control: "select",
      name:"Type",
      options: ["Alphanumeric", "Numeric"],
      mapping: { Alphanumeric: "alphanumeric", Numeric: "numeric" },
    },
    length: {
      control: "number",
      table: { disable: true },
    },
    masking: {
      control: "boolean",name:"Masking"
    },
  },
};

const Template = (args) => {
  const {Error,...rest} = args;
  const [otp, setOtp] = useState("");

  const handleOtpChange = (value) => {
    console.log(value,"value")
    setOtp(value);
    if (value.length === args.length) {
      if (!Error) {
        console.log("OTP is correct");
        return null;
      } else {
        console.log("Invalid OTP");
        return "Invalid OTP";
      }
    }
    return null;
  };

  return <OTPInput {...rest} onChange={handleOtpChange}/>;
};

const commonArgs = {
  length: 4,
  type: "Alphanumeric",
  inline: "Above",
  label: "Enter OTP",
  style:{},
  Error:false,
  masking:false
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="OTPInput Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  inline: { table: { disable: true } },
  label: { table: { disable: true }},
  Error: {table:{disable:true}},
  type: { table: { disable: true } },
  masking: { table: { disable: true }},
};

export const SixCharacters = Template.bind({});
SixCharacters.args = {
  ...commonArgs,
  length: 6,
};
SixCharacters.storyName = "6 Characters";

export const FourCharacters = Template.bind({});
FourCharacters.args = {
  ...commonArgs,
};
FourCharacters.storyName = "4 Characters";