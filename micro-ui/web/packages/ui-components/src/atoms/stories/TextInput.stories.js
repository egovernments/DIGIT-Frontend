import React, { useState, useEffect } from "react";
import FieldV1 from "../../hoc/FieldV1";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Text Input",
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
          "mobileNumber",
        ],
      },
      table: { disable: true },
    },
    config: { table: { disable: true } },
    populators: { table: { disable: true } },
    disabled: { control: "boolean", table: { disable: true } },
    nonEditable: { control: "boolean", table: { disable: true } },
    charCount: { control: "boolean", name: "Enable Character Count" },
    onChange: { action: "onChange", table: { disable: true } },
    placeholder: { control: "text", name: "Inner Label" },
    description: { control: "text", name: "Help Text" },
    required: { control: "boolean", name: "Mandatory" },
    label: { control: "text", name: "Label" },
    error: { control: "text", name: "Error" },
    infoMessage: { control: "text", name: "Tooltip" },
    State: {
      control: "select",
      options: ["Default", "Disabled", "NonEditable"],
    },
    withoutLabel: { table: { disable: true } },
    value: { table: { disable: true } },
    inline: { table: { disable: true } },
    props: { table: { disable: true } },
  },
};

const Template = (args) => {
  const { State, ...rest } = args;
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

  return (
    <FieldV1
      {...rest}
      disabled={State === "Disabled"}
      nonEditable={State === "NonEditable"}
      value={State === "NonEditable" ? "Non editable Input" : value}
      onChange={handleInputChange}
      type={type}
      charCount={
        type === "numeric" ||
        type === "date" ||
        type === "time" ||
        type === "geolocation"
          ? false
          : args?.charCount
      }
    />
  );
};

const commonArgs = {
  type: "text",
  config: {
    step: "",
  },
  populators: {
    prefix: "",
    suffix: "",
    allowNegativeValues: true,
    customIcon: "",
    validation: {
      maxlength: "",
      minlength: "",
    },
    resizeSmart: false,
    disableTextField: false,
  },
  error: "",
  label: "Label",
  disabled: false,
  nonEditable: false,
  placeholder: "Inner label",
  required: true,
  description: "Help Text",
  charCount: true,
  withoutLabel: false,
  infoMessage: "Tooltip",
  State: "Default",
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="TextInput Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  label: { table: { disable: true } },
  error: { table: { disable: true }},
  placeholder: {table:{disable:true}},
  description: {table:{disable:true}},
  charCount: {table:{disable:true}},
  required: {table:{disable:true}},
  infoMessage: {table:{disable:true}},
  State: {table:{disable:true}},
};

export const SimpleText = Template.bind({});
SimpleText.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
  },
};

export const TextWithPrefix = Template.bind({});
TextWithPrefix.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    prefix: "$",
  },
};

export const TextWithSuffix = Template.bind({});
TextWithSuffix.args = {
  ...commonArgs,
  populators: {
    ...commonArgs.populators,
    suffix: "Rs",
  },
};

export const TextArea = Template.bind({});
TextArea.args = {
  ...commonArgs,
  type: "textarea",
  populators: {
    ...commonArgs.populators,
  },
};

export const Password = Template.bind({});
Password.args = {
  ...commonArgs,
  type: "password",
  populators: {
    ...commonArgs.populators,
  },
};

export const NumericCounter = Template.bind({});
NumericCounter.args = {
  ...commonArgs,
  type: "numeric",
  populators: {
    ...commonArgs.populators,
  },
};

export const Date = Template.bind({});
Date.args = {
  ...commonArgs,
  type: "date",
  populators: {
    ...commonArgs.populators,
  },
};

export const Time = Template.bind({});
Time.args = {
  ...commonArgs,
  type: "time",
  populators: {
    ...commonArgs.populators,
  },
};

export const Location = Template.bind({});
Location.args = {
  ...commonArgs,
  type: "geolocation",
  populators: {
    ...commonArgs.populators,
  },
};

export const Search = Template.bind({});
Search.args = {
  ...commonArgs,
  type: "search",
  populators: {
    ...commonArgs.populators,
  },
};