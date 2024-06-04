import React from "react";
import { PaginationPrevious } from "./PaginationPrevious";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "PaginationPrevious",
  component: PaginationPrevious,
};

export const Default = () => <PaginationPrevious />;
export const Fill = () => <PaginationPrevious fill="blue" />;
export const Size = () => <PaginationPrevious height="50" width="50" />;
export const CustomStyle = () => <PaginationPrevious style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <PaginationPrevious className="custom-class" />;

export const Clickable = () => <PaginationPrevious onClick={()=>console.log("clicked")} />;

const Template = (args) => <PaginationPrevious {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" }
};
