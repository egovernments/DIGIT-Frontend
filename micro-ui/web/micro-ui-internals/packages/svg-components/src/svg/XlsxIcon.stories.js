import React from "react";
import { XlsxIcon } from "./XlsxIcon";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "XlsxIcon",
  component: XlsxIcon,
};

export const Default = () => <XlsxIcon />;

const Template = (args) => <XlsxIcon {...args} />;

export const Playground = Template.bind({});
Playground.args = {
    style: { border: "3px solid green" }
};
