import React from "react";
import { PaginationLast } from "./PaginationLast";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'text' },
    }
  },
  title: "PaginationLast",
  component: PaginationLast,
};

export const Default = () => <PaginationLast />;
export const Fill = () => <PaginationLast fill="blue" />;
export const Size = () => <PaginationLast height="50" width="50" />;
export const CustomStyle = () => <PaginationLast style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <PaginationLast className="custom-class" />;

export const Clickable = () => <PaginationLast onClick={()=>console.log("clicked")} />;

const Template = (args) => <PaginationLast {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" }
};
