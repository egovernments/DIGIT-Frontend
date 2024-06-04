import React from "react";
import InfoCard from "../InfoCard";

export default {
  title: "Atoms/InfoCard",
  component: InfoCard,
};

const Template = (args) => <InfoCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "a default info message",
  text: "",
};

export const PlayGround = Template.bind({});
PlayGround.args = {
  label: "a default info message",
  text: "",
};