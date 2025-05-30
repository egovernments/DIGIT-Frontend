import React from "react";
import CollapseAndExpandGroups from "../CollapseAndExpandGroups";

export default {
  title: "Atoms/CollapseAndExpandGroups",
  component: CollapseAndExpandGroups,
  argTypes: {
    showHelper: {
      control: "boolean",
    },
    groupHeader: {
      control: "text",
    },
    groupElements: {
      control: "boolean",
    },
  },
};

const Template = (args) => (
  <CollapseAndExpandGroups {...args}>
    <div style={{ padding: "1rem", background: "#f0f0f0" }}>Group Content Here</div>
  </CollapseAndExpandGroups>
);

export const Default = Template.bind({});
Default.args = {
  showHelper: true,
  groupHeader: "Sample Group Header",
  groupElements: true,
};
