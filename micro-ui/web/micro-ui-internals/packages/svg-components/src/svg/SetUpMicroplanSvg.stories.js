import React from "react";
import { SetUpMicroplanSvg } from "./SetUpMicroplanSvg";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "SetUpMicroplanSvg",
  component: SetUpMicroplanSvg,
};

export const Default = () => <SetUpMicroplanSvg />;
export const Fill = () => <SetUpMicroplanSvg fill="blue" />;
export const Size = () => <SetUpMicroplanSvg height="50" width="50" />;
export const CustomStyle = () => <SetUpMicroplanSvg style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <SetUpMicroplanSvg className="custom-class" />;
export const Clickable = () => <SetUpMicroplanSvg onClick={() => console.log("clicked")} />;

const Template = (args) => <SetUpMicroplanSvg {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: 'custom-class',
  style: { border: "3px solid green" }
};
