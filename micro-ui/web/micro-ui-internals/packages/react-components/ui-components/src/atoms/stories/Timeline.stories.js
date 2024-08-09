import React from "react";
import Timeline from "../Timeline";
import Button from "../Button";

export default {
  title: "Atoms/Timeline",
  component: Timeline,
  argTypes: {
    label: { control: "text" },
    className: { control: "text" },
    viewDetailsLabel: { control: "text" },
    hideDetailsLabel: { control: "text" },
    subElements: {
      control: {
        type: "array",
        separator: ",",
      },
    },
    variant: {
      control: {
        type: "select",
        options: ["upcoming", "inprogress", "completed"],
      },
    },
    additionalElements: {
      control: {
        type: "array",
        separator: ",",
      },
    },
    inline: { control: "boolean" },
    individualElementStyles: {
      control: { type: "object" },
    },
    showConnector:{
      control:{type:"boolean"}
    },
    showDefaultValueForDate:{
      control:{type:"boolean"}
    }
  },
};

const Template = (args) => <Timeline {...args} />;

const additionalElements = [
  <div key="1">
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's
  </div>,
  <Button variation="link" label={"Click on the link"} type="button" />,
  <img
    key="2"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 2"
  />,
  <img
    key="3"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 3"
  />,
  <img
    key="4"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 4"
  />,
  <img
    key="5"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 5"
  />,
  <img
    key="6"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 6"
  />,
  <img
    key="7"
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGMLufj86aep95KwMzr3U0QShg7oxdAG8gBPJ9ALIFQ&s"
    alt="Additional Element 7"
  />,
  <img
    key="8"
    src="https://digit.org/wp-content/uploads/2023/06/Digit-Logo-1.png"
    alt="Additional Element 8"
  />,
  <Button
    variation="primary"
    label={"Button"}
    type="button"
    icon="MyLocation"
  />,
  <Button
    variation="secondary"
    label={"Button"}
    type="button"
    icon="MyLocation"
    isSuffix={true}
  />
];

const subElements = [
  "26 / 03 / 2024",
  "11:00 PM",
  "26 / 03 / 2024 11:00 PM",
  "26 / 03 / 2024 11:00 PM Mon",
  "+91 **********"
];

const subElementWithDate = [ "26 / 03 / 2024" ];

// Upcoming Timeline Without subElements
export const Upcoming = Template.bind({});
Upcoming.args = {
  label: "Upcoming",
  subElements: [],
  variant: "upcoming"
};

// Upcoming Timeline Without AdditionalElements
export const UpcomingDefault = Template.bind({});
UpcomingDefault.args = {
  label: "Upcoming",
  subElements: subElementWithDate,
  variant: "upcoming"
};

// Upcoming Timeline
export const UpcomingWithAdditionalElements = Template.bind({});
UpcomingWithAdditionalElements.args = {
  label: "Upcoming",
  variant: "upcoming",
  subElements: subElements,
  additionalElements: additionalElements,
};

// Upcoming Timeline
export const UpcomingWithConnector = Template.bind({});
UpcomingWithConnector.args = {
  label: "Upcoming",
  variant: "upcoming",
  subElements: subElements,
  additionalElements: additionalElements,
  showConnector:true
};

// InProgress Timeline Without subElements
export const InProgress = Template.bind({});
InProgress.args = {
  label: "Inprogress",
  subElements: [],
  variant: "inprogress"
};

// InProgress Timeline Without AdditionalElements
export const InProgressDefault = Template.bind({});
InProgressDefault.args = {
  label: "Inprogress",
  subElements: subElementWithDate,
  variant: "inprogress"
};

// InProgress Timeline
export const InProgressWithAdditionalElements = Template.bind({});
InProgressWithAdditionalElements.args = {
  label: "Inprogress",
  subElements: subElements,
  variant: "inprogress",
  additionalElements: additionalElements,
};

// InProgress Timeline
export const InProgressWithConnector = Template.bind({});
InProgressWithConnector.args = {
  label: "Inprogress",
  subElements: subElements,
  variant: "inprogress",
  additionalElements: additionalElements,
  showConnector:true
};

// Completed Timeline Without subElements
export const Completed = Template.bind({});
Completed.args = {
  label: "Completed",
  subElements: [],
  variant: "completed"
};

// Completed Timeline Without AdditionalElements
export const CompletedDefault = Template.bind({});
CompletedDefault.args = {
  label: "Completed",
  subElements: subElementWithDate,
  variant: "completed"
};

// Completed Timeline
export const CompletedWithAdditionalElements = Template.bind({});
CompletedWithAdditionalElements.args = {
  label: "Completed",
  subElements: subElements,
  variant: "completed",
  additionalElements: additionalElements,
};

// Completed Timeline
export const CompletedWithConnector = Template.bind({});
CompletedWithConnector.args = {
  label: "Completed",
  subElements: subElements,
  variant: "completed",
  additionalElements: additionalElements,
  showConnector:true
};