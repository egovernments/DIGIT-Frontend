import React from "react";
import { AddCircle } from "./AddCircle";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "AddCircle",
  component: AddCircle,
};

export const Default = () => <AddCircle />;
export const Fill = () => <AddCircle fill="blue" />;
export const Size = () => <AddCircle height="50" width="50" />;
export const CustomStyle = () => <AddCircle style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <AddCircle className="custom-class" />;
export const Clickable = () => <AddCircle onClick={() => console.log("clicked")} />;

const Template = (args) => <AddCircle {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: 'custom-class',
  style: { border: "3px solid green" }
};
