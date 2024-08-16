// src/components/JsonSchemaForm.js
import React from "react";
import { Components } from "components";
import { Hooks } from "components";
import useAppToast from "../../../../components/src/hooks/useAppToast";
import userAppUser from "../../../../components/src/hooks/useAppUser";
import useNavigate from "../../../../components/src/hooks/useNavigate";
const { FormComposer } = Components?.organisms;

// Define the schema for the login form with two methods
const schema = {
  title: "Login Form",
  type: "object",
  properties: {
    login: {
      type: "object",
      properties: {
        username: { type: "string", title: "Username" },
        password: { type: "string", title: "Password" },
      },
      required: ["username", "password"],
    },
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
    login: {
      fields: ["login"],
      "ui:order": ["username", "password"],
    },
    otpLogin: {
      fields: ["login"],
      "ui:order": ["username", "otp"],
    },
  },
  "ui:layout": {
    layouts: [
      { label: "Login", fields: ["login"] },
      { label: "Login via OTP", fields: ["otpLogin"] },
    ],
    type: "TAB", // Use tabs for navigation
    hideTabNavigateButtons: true,
  },
  login: {
    password: { "ui:widget": "password" }, // Password input for password
  },
  otpLogin: {
    otp: { "ui:widget": "text" }, // Text input for OTP
  },
};

const defaultAttributes = {
  grant_type: "password",
  scope: "read",
  tenantId: "pg",
  userType: "EMPLOYEE",
};
const formDataToRequestData = (formData) => {
  const { username = "", password = "" } = formData;

  return {
    ...defaultAttributes,
    username,
    password,
  };
};

/**
 * SignInScreen Screen
 * This component renders a Card with the text "Page One".
 * The Card component is imported from DigitUIComponents.
 *
 * @returns {JSX.Element} A JSX element representing the page content.
 */
const SignInScreen = () => {
  const {showToast}=useAppToast();
  const {navigateTo}=useNavigate();
  const {loggedIn }=userAppUser();
  const { mutation, revalidate } = Hooks?.useCustomAPIMutationHook({
    url: "/user/oauth/token",
    params: {},
    body: {},
    headers: { "Content-Type": "application/x-www-form-urlencoded","authorization":"Basic ZWdvdi11c2VyLWNsaWVudDo=" },
    options: { method: "POST" },
  });

  const handleSubmit = (formData) => {
    mutation.mutate(
      {
        body: { ...formDataToRequestData(formData) }, // Override specific fields if needed
      },
      {
        onSuccess: (data) => {
          // Handle the success case
          console.log('Mutation was successful:', data);
          showToast('Mutation was successful:')
          loggedIn(data?.["access_token"],data?.["UserRequest"]?.tenantId)
          navigateTo("home");
          // Perform any additional actions like showing a success message
          // or updating the UI based on the response
        },
        onError: (error) => {
          // Handle the error case
          console.error('Mutation failed:', error);
          showToast('Mutation was successful:',"error")

          // Perform any additional actions like showing an error message
          // or handling specific error cases
        },
      }
    );
    
  };
  return (
    <>
      <h1>SignIn</h1>
      <FormComposer
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        submitHandler={
          <>
            <button type="submit">Login</button>
          </>
        }
      />
    </>
  );
};

export default SignInScreen;
