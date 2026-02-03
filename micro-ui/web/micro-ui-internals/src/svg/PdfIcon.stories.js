import React from "react";
import { PdfIcon } from "./PdfIcon";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "PdfIcon",
  component: PdfIcon,
};

export const Default = () => <PdfIcon />;

const Template = (args) => <PdfIcon {...args} />;

export const Playground = Template.bind({});
Playground.args = {
    style: { border: "3px solid green" }
};
