import React from "react";
import { JpgIcon } from "./JpgIcon";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "JpgIcon",
  component: JpgIcon,
};

export const Default = () => <JpgIcon />;

const Template = (args) => <JpgIcon {...args} />;

export const Playground = Template.bind({});
Playground.args = {
    style: { border: "3px solid green" }
};
