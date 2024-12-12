import React from "react";
import { OpenMicroplanSvg } from "./OpenMicroplanSvg";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "OpenMicroplanSvg",
  component: OpenMicroplanSvg,
};

export const Default = () => <OpenMicroplanSvg />;
export const Fill = () => <OpenMicroplanSvg fill="blue" />;
export const Size = () => <OpenMicroplanSvg height="50" width="50" />;
export const CustomStyle = () => <OpenMicroplanSvg style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <OpenMicroplanSvg className="custom-class" />;
export const Clickable = () => <OpenMicroplanSvg onClick={() => console.log("clicked")} />;

const Template = (args) => <OpenMicroplanSvg {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: 'custom-class',
  style: { border: "3px solid green" }
};
