import React from "react";
import { SchoolBuilding } from "./SchoolBuilding";

export default {
  tags: ["autodocs"],
  argTypes: {
    className: {
      options: ["custom-class"],
      control: { type: "check" },
    },
  },
  title: "SchoolBuilding",
  component: SchoolBuilding,
};

const Template = (args) => <SchoolBuilding {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" },
};

export const Default = () => <SchoolBuilding />;
export const Fill = () => <SchoolBuilding fill="blue" />;
export const Size = () => <SchoolBuilding height="50" width="50" />;
export const CustomStyle = () => <SchoolBuilding style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <SchoolBuilding className="custom-class" />;
export const Clickable = () => <SchoolBuilding onClick={() => console.log("clicked")} />;

