import React from "react";
import { Church } from "./Church";

export default {
  tags: ["autodocs"],
  argTypes: {
    className: {
      options: ["custom-class"],
      control: { type: "check" },
    },
  },
  title: "Church",
  component: Church,
};

const Template = (args) => <Church {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" },
};

export const Default = () => <Church />;
export const Fill = () => <Church fill="blue" />;
export const Size = () => <Church height="50" width="50" />;
export const CustomStyle = () => <Church style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <Church className="custom-class" />;
export const Clickable = () => <Church onClick={() => console.log("clicked")} />;

