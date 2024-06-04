import React from "react";
import { LoaderScreen } from "../LoaderScreen";

export default {
  title: "Atoms/LoaderScreen",
  component: LoaderScreen,
  argTypes: {
    page: {
      control: "boolean",
    },
  },
};

const Template = (args) => <LoaderScreen {...args} />;

export const Primary = Template.bind({});

export const Playground = Template.bind({});
Playground.args = {
  page: true,
};