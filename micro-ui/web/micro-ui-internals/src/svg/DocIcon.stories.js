import React from "react";
import { DocIcon } from "./DocIcon";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "DocIcon",
  component: DocIcon,
};

export const Default = () => <DocIcon />;

const Template = (args) => <DocIcon {...args} />;

export const Playground = Template.bind({});
Playground.args = {
    style: { border: "3px solid green" }
};
