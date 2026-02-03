import React from "react";
import { PaginationNext } from "./PaginationNext";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "PaginationNext",
  component: PaginationNext,
};

export const Default = () => <PaginationNext />;
export const Fill = () => <PaginationNext fill="blue" />;
export const Size = () => <PaginationNext height="50" width="50" />;
export const CustomStyle = () => <PaginationNext style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <PaginationNext className="custom-class" />;

export const Clickable = () => <PaginationNext onClick={()=>console.log("clicked")} />;

const Template = (args) => <PaginationNext {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" }
};
