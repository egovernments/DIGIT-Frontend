import React from "react";
import { NorthArrow } from "./NorthArrow";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "NorthArrow",
  component: NorthArrow,
};

export const Default = () => <NorthArrow />;
export const Fill = () => <NorthArrow fill="blue" />;
export const Size = () => <NorthArrow height="50" width="50" />;
export const CustomStyle = () => <NorthArrow style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <NorthArrow className="custom-class" />;

export const Clickable = () => <NorthArrow onClick={()=>console.log("clicked")} />;

const Template = (args) => <NorthArrow {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" }
};
