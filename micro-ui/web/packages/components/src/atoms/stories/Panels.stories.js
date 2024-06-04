import React from "react";
import Panels from "../Panels";

export default {
  title: "Atoms/Panels",
  component: Panels,
  argTypes: {},
};

const Template = (args) => <Panels {...args} />;


export const Primary = Template.bind({});
Primary.args = {};

export const Playground = Template.bind({});
Playground.args = {
  successful: true,
  message: "Application Submitted",
  whichSvg: "tick",
  complaintNumber: "20230725-001",
};
