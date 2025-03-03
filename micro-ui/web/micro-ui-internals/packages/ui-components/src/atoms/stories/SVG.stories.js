import React from "react";
import { SVG } from "../SVG";

export default {
  tags: ["autodocs"],
  argTypes: {
    className: {
      options: ["custom-class"],
      control: { type: "check" },
    },
  },
  title: "SVG",
  component: SVG,
  icon:""
};

const Template = (args) => {
  const IconComponent = SVG[args.icon];
  return (
    <div>
      {IconComponent ? <IconComponent {...args} /> : "Icon not found"}
    </div>
  );
};

export const Playground = Template.bind({});
Playground.args = {
  className: "custom-class",
  style: {},
  fill: "#C84C0E",
  height: "50",
  width: "50",
  onClick: () => {},
  icon:"Accessibility"
};