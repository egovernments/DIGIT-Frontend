import React, { useState, useEffect } from "react";
import FieldV1 from "../../hoc/FieldV1";

export default {
  title: "Atoms/TextInput",
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
          "number",
        ],
      },
    },
    disabled: { control: "boolean" },
    nonEditable: { control: "boolean" },
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
    if (event?.target) {
      const newValue = event?.target?.value;
      setValue(newValue);
      args.onChange({ ...event, target: { ...event.target, value: newValue } });
    } else {
      const newValue = event;
      setValue(newValue);
    }
  };


  return <FieldV1 {...args} value={value} onChange={handleInputChange} type={type} />;
};

const commonArgs = {
  type: "text",
  config: {
    step: "",
  },
  populators: {
    prefix: "",
    suffix: "",
    customIcon: "",
    validation: {
      maxlength: "",
      minlength: "",
    },
    onIconSelection: () => {
      console.log("Icon Clicked");
    },
    resizeSmart: false,
    disableTextField:false
  },
  error: "",
  label: "",
  disabled: false,
  nonEditable: false,
  placeholder: "",
  required: false,
  description: "",
  charCount: false,
  withoutLabel: false,
  infoMessage: "",
};

export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
  },
};

export const Filled = Template.bind({});
Filled.args = {
  ...commonArgs,
  value: "Input Value",
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...commonArgs,
  disabled: true,
};
Disabled.argTypes = {
  disabled: { control: { disable: true } },
};

export const NonEditable = Template.bind({});
NonEditable.args = {
  ...commonArgs,
  nonEditable: true,
  value: "Input Value",
};
NonEditable.argTypes = {
  nonEditable: { control: { disable: true } },
};

export const Error = Template.bind({});
Error.args = {
  ...commonArgs,
  error: "Error!",
};

export const WithCustomIcon = Template.bind({});
WithCustomIcon.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    customIcon: "Article",
    onIconSelection: () => {
      console.log("Icon Clicked");
    },
  },
};