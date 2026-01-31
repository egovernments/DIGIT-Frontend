import React from "react";
import { PngIcon } from "./PngIcon";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "PngIcon",
  component: PngIcon,
};

export const Default = () => <PngIcon />;

const Template = (args) => <PngIcon {...args} />;

export const Playground = Template.bind({});
Playground.args = {
    style: { border: "3px solid green" }
};
