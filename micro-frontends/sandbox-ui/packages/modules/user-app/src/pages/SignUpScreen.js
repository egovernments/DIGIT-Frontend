// src/components/JsonSchemaForm.js
import React from "react";
import { Components } from "components";
const {FormComposer} = Components?.organisms;

// Define the schema for the login form with two methods
const schema = {
  title: "Login Form",
  type: "object",
  properties: {
    // login: {
    //   type: "object",
    //   properties: {
    //     username: { type: "string", title: "Username" },
    //     password: { type: "string", title: "Password" },
    //   },
    //   required: ["username", "password"],
    // },
    otpLogin: {
      type: "object",
      properties: {
        username: { type: "string", title: "Email" },
        otp: { type: "number", title: "OTP" },
      },
      required: ["username", "otp"],
    },
  },
};

// Define the uiSchema for the login form with tabs
const uiSchema = {
  "ui:groups": {
    // login: {
    //   fields: ["login"],
    //   "ui:order": ["username", "password"],
    // },
    otpLogin:{
        fields: ["login"],
        "ui:order": ["username", "otp"],
    }
  },
  "ui:layout": {
    layouts: [
      // { label: "Login", fields: ["login"] },
      { label: "Signin via OTP", fields: ["otpLogin"] },
    ],
    type: "TAB" // Use tabs for navigation
  },
  login: {
    password: { "ui:widget": "password" }, // Password input for password
  },
  otpLogin: {
    otp: { "ui:widget": "text" }, // Text input for OTP
  },
}

/**
 * SignUpScreen Screen
 * This component renders a Card with the text "Page One".
 * The Card component is imported from DigitUIComponents.
 * 
 * @returns {JSX.Element} A JSX element representing the page content.
 */
const SignUpScreen = () => {
  return (
    <>
      <h1>SignUp</h1>
      <FormComposer
        schema={schema}
        uiSchema={uiSchema}
      />
    </>
  );
};

export default SignUpScreen;

