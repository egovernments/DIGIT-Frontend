import React from "react";
import { UserManagementSvg } from "./UserManagementSvg";

export default {
  tags: ['autodocs'],
  argTypes: {
    className: {
        options: ['custom-class'],
        control: { type: 'check' },
    }
  },
  title: "UserManagementSvg",
  component: UserManagementSvg,
};

export const Default = () => <UserManagementSvg />;
export const Fill = () => <UserManagementSvg fill="blue" />;
export const Size = () => <UserManagementSvg height="50" width="50" />;
export const CustomStyle = () => <UserManagementSvg style={{ border: "1px solid red" }} />;
export const CustomClassName = () => <UserManagementSvg className="custom-class" />;
export const Clickable = () => <UserManagementSvg onClick={() => console.log("clicked")} />;

const Template = (args) => <UserManagementSvg {...args} />;

export const Playground = Template.bind({});
Playground.args = {
  className: 'custom-class',
  style: { border: "3px solid green" }
};
