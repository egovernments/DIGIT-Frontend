import React from "react";
import { PaginationFirst } from "./PaginationFirst";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "PaginationFirst",
  component: PaginationFirst,
};

export const Default = () => <PaginationFirst />;
export const Fill = () => <PaginationFirst fill="blue" />;
export const Size = () => <PaginationFirst height="50" width="50" />;
export const CustomStyle = () => <PaginationFirst style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <PaginationFirst className="custom-class" />;

export const Clickable = () => <PaginationFirst onClick={()=>console.log("clicked")} />;

const Template = (args) => <PaginationFirst {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" }
};
