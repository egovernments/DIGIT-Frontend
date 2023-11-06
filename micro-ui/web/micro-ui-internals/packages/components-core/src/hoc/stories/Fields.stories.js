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
          "textarea"
        ],
      },
    },
    disable: {control: "boolean"},
    noneditable:{control:"boolean"},
    focused:{control:"focused"},
    charCount: { control: "boolean" }
  },
};

const Template = (args) => {
  return <FieldComposer {...args} />;
};

const commonArgs ={
  type: "text",
  populators: {
    name: "Label",
    error: "Custom Error Message",
    validation: {
      pattern: {},
    },
    prefix:"",
    suffix:"",
    customIcon:""
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
    description:"",
    withoutLabel:true,
    withoutInfo:true
  },
  sectionFormCategory: undefined,
  formData: {},
  value:"",
  placeholder:"",
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
            description:"",
            withoutLabel:true,
            withoutInfo:true,
          },
        ],
      },
    ],
    defaultValues: {},
    fieldStyle: {
      marginRight: 0,
    },
  },
  errors: {
    errorMessage:"",
  },
}


export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  variant: "default",
};
Default.argTypes = {
  variant: { control: { disable: true } }, 
};

export const Filled = Template.bind({});
Filled.args = {
  ...commonArgs,
  variant: "filled",
  value:"Input Value"
};
Filled.argTypes = {
  variant: { control: { disable: true } }, 
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...commonArgs,
  variant: "disabled",
  disable: true
};
Disabled.argTypes = {
  variant: { control: { disable: true } }, 
  disable: { control: { disable: true } }, 
};

export const NonEditable = Template.bind({});
NonEditable.args = {
  ...commonArgs,
  variant: "noneditable",
  noneditable:true,
  value:"Input Value"
};
NonEditable.argTypes = {
  variant: { control: { disable: true } }, 
  noneditable: { control: { disable: true } }, 
};

export const Focused = Template.bind({});
Focused.args = {
  ...commonArgs,
  variant: "focused",
  focused:true
};
Focused.argTypes = {
  variant: { control: { disable: true } }, 
  focused: { control: { disable: true } },
};

export const Error = Template.bind({});
Error.args = {
  ...commonArgs,
  variant: "error",
  errors:{
    errorMessage:"Error!"
  }
};
Error.argTypes = {
  variant: { control: { disable: true } }, 
};
