import React from "react";
import { Add } from "./Add";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "Add",
  component: Add,
};

export const Default = () => <Add />;
export const Fill = () => <Add fill="blue" />;
export const Size = () => <Add height="50" width="50" />;
export const CustomStyle = () => <Add style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <Add className="custom-class" />;
export const Clickable = () => <Add onClick={() => console.log("clicked")} />;

const Template = (args) => <Add {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: 'custom-class',
  style: { border: "3px solid green" }
};
