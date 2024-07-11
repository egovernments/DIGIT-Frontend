// src/components/JsonSchemaForm.js
import React from "react";
import { useUserState } from "../state/useUserState";
import FormComposer from "./utils/FormComposer";
import CustomDatePicker from "./CustomCheck"; // Import the custom component

const schema = {
  title: "Complex Form",
  type: "object",
  properties: {
    personalInfo: {
      type: "object",
      properties: {
        firstName: { type: "string", title: "First Name" },
        lastName: { type: "string", title: "Last Name" },
        dob: { type: "string", format: "date", title: "Date of Birth" },
      },
      required: ["firstName", "lastName"],
    },
    address: {
      type: "object",
      properties: {
        street: { type: "string", title: "Street" },
        city: { type: "string", title: "City" },
        state: { type: "string", title: "State" },
        zipCode: { type: "string", title: "Zip Code" },
      },
    },
    test: {
      type: "array",
      items: {
        type: "string",
      },
    },
    phones: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            title: "Type",
            enum: ["Home", "Work", "Mobile"],
          },
          number: { type: "string", title: "Number" },
          otherPhones: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  title: "Type",
                  enum: ["Home", "Work", "Mobile"],
                },
                number: { type: "string", title: "Number" },
              },
            },
          },
        },
      },
    },
    newsletter: {
      type: "boolean",
      title: "Subscribe to Newsletter",
    },
    subscriptionFrequency: {
      type: "string",
      title: "Subscription Frequency",
      enum: ["Daily", "Weekly", "Monthly"],
    },
  },
  required: ["personalInfo", "address"],
};
// src/uiSchema.json
const uiSchema = {
  "ui:groups": {
    personalInfo: {
      fields: ["personalInfo"],
      "ui:order": ["firstName", "lastName", "dob"],
    },
    address: {
      fields: ["address"],
      "ui:order": ["street", "city", "state", "zipCode"],
    },
    phones: {
      fields: ["phones"],
      "ui:order": ["phones"],
    },
    test: {
      fields: ["test"],
      "ui:order": ["test"],
    },
    subscription: {
      fields: ["newsletter", "subscriptionFrequency"],
      "ui:order": ["newsletter", "subscriptionFrequency"],
    },
  },
  "ui:layout": {
    layouts: [
      { label: "Personal Info", fields: ["personalInfo"] },
      { label: "Address", fields: ["address"] },
      { label: "Phones", fields: ["phones"] },
      { label: "Preferences", fields: ["preferences"] },
    ],

    conditionalLayout: {
      3: {
        fields: ["preferences.newsletter"],
        rule: (values) => values["preferences.newsletter"],
      },
    },
    type: "TAB", //"TAB||STEPPER"
  },
  personalInfo: {
    firstName: { "ui:widget": "text" },
    lastName: { "ui:widget": "text" },
    dob: { "ui:widget": "date" },
  },
  address: {
    street: { "ui:widget": "text" },
    city: { "ui:widget": "text" },
    state: { "ui:widget": "text" },
    zipCode: { "ui:widget": "text" },
  },
  phones: {
    items: {
      type: { "ui:widget": "select" },
      number: { "ui:widget": "text" },

      mobileNumber: {
        "ui:widget": "text",
        "ui:dependencies": {
          dependentField: "phones[0].type",
          expectedValue: "Mobile",
        },
      },
      otherPhones: {
        items: {
          type: { "ui:widget": "select" },
          number: { "ui:widget": "text" },
        },
      },
    },
  },
  newsletter: {
    "ui:widget": "checkbox",
  },
  subscriptionFrequency: {
    "ui:dependencies": {
      dependentField: "newsletter",
      expectedValue: true,
      "ui:widget": "select",
    },
  },
};
const customWidgets = {
  date: CustomDatePicker,
};

const TabForm = () => {
  const { setData, resetData, data } = useUserState();
  return (
    <>
      <h1>Hi {data?.name}</h1>
      <FormComposer
        schema={schema}
        uiSchema={uiSchema}
        customWidgets={customWidgets}
      ></FormComposer>
    </>
  );
};
export default TabForm;
