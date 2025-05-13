import React from "react";
import { Warehouse } from "./Warehouse";

export default {
  tags: ["autodocs"],
  argTypes: {
    className: {
      options: ["custom-class"],
      control: { type: "check" },
    },
  },
  title: "Warehouse",
  component: Warehouse,
};

const Template = (args) => <Warehouse {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" },
};

export const Default = () => <Warehouse />;
export const Fill = () => <Warehouse fill="blue" />;
export const Size = () => <Warehouse height="50" width="50" />;
export const CustomStyle = () => <Warehouse style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <Warehouse className="custom-class" />;
export const Clickable = () => <Warehouse onClick={() => console.log("clicked")} />;

