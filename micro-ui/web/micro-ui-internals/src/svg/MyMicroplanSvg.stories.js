import React from "react";
import { MyMicroplanSvg } from "./MyMicroplanSvg";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "MyMicroplanSvg",
  component: MyMicroplanSvg,
};

export const Default = () => <MyMicroplanSvg />;
export const Fill = () => <MyMicroplanSvg fill="blue" />;
export const Size = () => <MyMicroplanSvg height="50" width="50" />;
export const CustomStyle = () => <MyMicroplanSvg style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <MyMicroplanSvg className="custom-class" />;
export const Clickable = () => <MyMicroplanSvg onClick={() => console.log("clicked")} />;

const Template = (args) => <MyMicroplanSvg {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: 'custom-class',
  style: { border: "3px solid green" }
};
