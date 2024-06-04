import React from "react";
import { TextBlock } from "../../atoms";

export default {
  title: "Atom-Groups/TextBlock",
  component: TextBlock,
};

const Template = (args) => <TextBlock {...args} />;
export const Default = Template.bind({});
Default.args = {
  headerContentClassName:"",
  caption: "Caption",
  captionClassName: "",
  header: "Heading",
  headerClasName: "",
  subHeader: "Subheading",
  subHeaderClasName: "",
  body:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  bodyClasName: "",
};
