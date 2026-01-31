import React from "react";
import { Facilities } from "./Facilities";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "Facilities",
  component: Facilities,
};

export const Default = () => <Facilities />;
export const Fill = () => <Facilities fill="blue" />;
export const Size = () => <Facilities height="50" width="50" />;
export const CustomStyle = () => <Facilities style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <Facilities className="custom-class" />;

export const Clickable = () => <Facilities onClick={()=>console.log("clicked")} />;

const Template = (args) => <Facilities {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: { border: "3px solid green" }
};
