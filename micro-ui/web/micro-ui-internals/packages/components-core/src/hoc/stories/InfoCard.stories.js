import React from "react";
import { InfoCard } from "../../atoms";

export default {
  title: "Atom-Groups/InfoCard",
  component: InfoCard,
  argTypes: {
    label: {
      control: "text",
    },
    variant: { control: "select", options: ["default", "success", "warning", "error"] },
    text: { control: "text" },
    style: {
        control: "object",
    },
  },
};

const Template = (args) => <InfoCard {...args} />;

const commonArgs = {
  label: "Info",
  text:
    "Application process will take a minute to complete. It might cost around Rs.500/- to Rs.1000/- to clean your septic tank and you can expect theservice to get completed in 24 hrs from the time of payment.",
    variant: "default",
};

// Info default
export const Info = Template.bind({});
Info.args = {
  ...commonArgs,
};

// Info Success
export const InfoSuccess = Template.bind({});
InfoSuccess.args = {
  ...commonArgs,
  label: "Success",
  variant: "success",
};

// Info Warning
export const InfoWarning = Template.bind({});
InfoWarning.args = {
  ...commonArgs,
  label: "Warning",
  variant: "warning",
};

// Info Error
export const InfoError = Template.bind({});
InfoError.args = {
  ...commonArgs,
  label: "Error",
  variant: "error",
};
