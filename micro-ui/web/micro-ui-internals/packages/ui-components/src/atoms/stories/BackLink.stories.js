import React from "react";
import BackLink from "../BackLink";
import Iframe from "../Iframe";

export default {
  title: "Atoms/BackLink",
  component: BackLink,
  argTypes: {
    variant: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    label: { table: { disable: true } },
    onClick: { table: { disable: true } },
    hideIcon: { table: { disable: true } },
    hideLabel: { table: { disable: true } },
    iconFill: { table: { disable: true } },
    disabled: {
      control: "select",
      options: ["Default", "Disabled"],
      name:"State",
      mapping: {
        Default: false, 
        Disabled: true, 
      },
    },
  },
};

const Template = (args) => <BackLink {...args} />;

const commonArgs = {
  style: {},
  onClick: () => console.log("clicked"),
  disabled: "Default",
  variant: "",
  hideIcon: false,
  hideLabel: false,
  iconFill: "",
  label: "Back",
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="BackLink Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  disabled: { table: { disable: true } },
};

export const Backlink1 = Template.bind({});
Backlink1.args = {
  ...commonArgs,
  variant: "primary",
};

export const Backlink2 = Template.bind({});
Backlink2.args = {
  ...commonArgs,
  variant: "secondary",
};

export const Backlink3 = Template.bind({});
Backlink3.args = {
  ...commonArgs,
  variant: "teritiary",
};