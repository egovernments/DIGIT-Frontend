import React from "react";
import { HealthFacility } from "./HealthFacility";

export default {
  tags: ["autodocs"],
  argTypes: {
    className: {
      options: ["custom-class"],
      control: { type: "check" },
    },
  },
  title: "HealthFacility",
  component: HealthFacility,
};

const Template = (args) => <HealthFacility {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" },
};

export const Default = () => <HealthFacility />;
export const Fill = () => <HealthFacility fill="blue" />;
export const Size = () => <HealthFacility height="50" width="50" />;
export const CustomStyle = () => <HealthFacility style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <HealthFacility className="custom-class" />;
export const Clickable = () => <HealthFacility onClick={() => console.log("clicked")} />;

