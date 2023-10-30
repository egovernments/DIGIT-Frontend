import React from "react";
// import Fields from "../Fields";
import FieldComposer from "../FieldComposer";

export default {
  title: "Atom-Groups/InputField",
  component: FieldComposer,
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
          "prefix",
          "suffix",
          "password",
          "search",
          "textarea",
          // "mobileNumber",
          // "amount",
          // "number",
          // "paragraph",
          // "custom",
          // "checkbox",
          // "multiupload",
          // "select",
          // "radio",
          // "dropdown",
          // "radioordropdown",
          // "component",
          // "documentUpload",
          // "form",
          // "locationdropdown",
          // "apidropdown",
          // "multiselectdropdown",
        ],
      },
    },
    state: {
      control: {
        type: "select",
        options: ["default", "filled","disabled","noneditable", "focused", "error", "disabled"],
      },
    },
    label: { control: "boolean" },
    info: { control: "boolean" },
    charCount: { control: "boolean" },
    innerLabel: { control: "boolean" },
    helpText: { control: "boolean" },
  },
};

const Template = (args) => {
  return <FieldComposer {...args} />;
};

export const Playground = Template.bind({});
Playground.args = {
  type: "date",
  state: "default",
  populators: {
    name: "Label",
    error: "Required",
    validation: {
      pattern: {},
    },
  },
  isMandatory: false,
  disable: false,
  component: undefined,
  config: {
    inline: true,
    label: "Label",
    isMandatory: false,
    type: "text",
    disable: false,
    populators: {
      name: "label",
      error: "Required",
      validation: {
        pattern: {},
      },
    },
  },
  sectionFormCategory: undefined,
  formData: {},
  selectedFormCategory: undefined,
  props: {
    label: "Submit Bar",
    config: [
      {
        head: "Heading",
        body: [
          {
            inline: true,
            label: "Label",
            isMandatory: false,
            type: "text",
            disable: false,
            populators: {
              name: "label",
              error: "Required",
              validation: {
                pattern: {},
              },
            },
          },
        ],
      },
    ],
    defaultValues: {},
    fieldStyle: {
      marginRight: 0,
    },
  },
  errors: {},
};
