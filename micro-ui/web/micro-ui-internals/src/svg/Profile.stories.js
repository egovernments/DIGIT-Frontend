import React from "react";
import { Profile } from "./Profile";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "Profile",
  component: Profile,
};

export const Default = () => <Profile />;

const Template = (args) => <Profile {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  style: { border: "3px solid green" }
};
