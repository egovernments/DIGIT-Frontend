import React from "react";
import Tag from "../Tag";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Tag",
  component: Tag,
  argTypes: {
    className: {
      control: "text",
      table: { disable: true },
    },
    iconClassName: {
      control: "text",
      table: { disable: true },
    },
    label: {
      control: "text",
      name: "Label",
    },
    style: {
      control: { type: "object" },
      table: { disable: true },
    },
    labelStyle: {
      control: { type: "object" },
      table: { disable: true },
    },
    stroke: {
      control: "check",
      name: "Stroke",
      options: ["Enable"],
    },
    type: {
      control: "select",
      options: ["monochrome", "success", "warning", "error"],
      table: { disable: true },
    },
    alignment: {
      control: "select",
      options: ["center", "left", "right"],
      table: { disable: true },
    },
    icon: {
      control: "text",
      table: { disable: true },
    },
    showIcon: {
      control: "check",
      name: "Icon",
      options: ["Enable"],
    },
    iconColor: {
      table: { disable: true },
    },
    onClick: {
      control: "check",
      name: "Clickable",
      options: ["Enable"],
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

const Template = (args) => {
  const { stroke, showIcon, onClick, ...rest } = args;
  return (
    <div style={commonStyles}>
      <Tag
        {...rest}
        stroke={stroke?.length > 0 ? true : false}
        showIcon={showIcon?.length > 0 ? true : false}
        onClick={
          onClick?.length > 0
            ? (e) => {
                console.log(e);
              }
            : undefined
        }
      />
    </div>
  );
};

const commonArgs = {
  label: "Tag",
  className: "",
  style: {},
  stroke: "",
  type: "monochrome",
  icon: "",
  showIcon: "",
  labelStyle: {},
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Tag Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  label: { table: { disable: true } },
  stroke: { table: { disable: true }},
  onClick: { table: { disable: true }},
  showIcon: {table: { disable: true } },
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
  type: "monochrome",
};

export const Success = Template.bind({});
Success.args = {
  ...commonArgs,
  type: "success",
};

export const Error = Template.bind({});
Error.args = {
  ...commonArgs,
  type: "error",
};
export const Warning = Template.bind({});
Warning.args = {
  ...commonArgs,
  type: "warning",
};
export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  style: {
    width: "600px",
  },
  labelStyle: {
    color: "#0B4B66",
  },
  icon: "ArrowLeft",
};