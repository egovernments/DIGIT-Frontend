import React from "react";
import Rating from "../Rating"; // Adjust the import path as needed

export default {
  title: "Atom/Rating",
  component: Rating,
  argTypes: {
    maxRating: { control: "number" },
    currentRating: { control: "number" },
    text: { control: "text" },
    withText: { control: "boolean" },
  },
};

const Template = (args) => <Rating {...args} />;

export const Default = Template.bind({});
Default.args = {
  maxRating: 5,
  currentRating: 3.5,
  id: "rating1",
  withText: true,
  text: "Rated:",
  onFeedback: (e, ref, index) => {
    console.log(`Star clicked: ${index}`);
  },
  styles: { gap: "0.5rem" },
  starStyles: { fill: "#FFD700", cursor: "pointer" },
};
