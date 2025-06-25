import React from "react";
import Timeline from "../Timeline";
import Button from "../Button";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Timeline",
  component: Timeline,
  argTypes: {
    label: { control: "text", name: "Label" },
    className: { control: "text", table: { disable: true } },
    viewDetailsLabel: { control: "text", table: { disable: true } },
    hideDetailsLabel: { control: "text", table: { disable: true } },
    subElements: {
      control: "boolean",
      name: "With Subelements",
    },
    variant: {
      control: {
        type: "select",
        options: ["upcoming", "inprogress", "completed"],
      },
      table: { disable: true },
    },
    additionalElements: {
      control: "boolean",
      name: "With Additional Widgets",
    },
    inline: {
      control: "select",
      name: "Elements Alignment",
      options: ["vertical", "inline"],
      mapping: {
        inline: true,
        vertical: false,
      },
    },
    individualElementStyles: {
      control: { type: "object" },
      table: { disable: true },
    },
    showConnector: {
      control: "boolean",
      name: "With Connector",
    },
    showDefaultValueForDate: {
      control: { type: "boolean" },
      table: { disable: true },
    },
    initialVisibleAdditionalElementsCount: {
      control: { type: "number" },
      table: { disable: true },
    },
    isError:{control:"select",name:"State",options:["Default","Failed"],mapping:{"Default":false,"Failed":true}}
  },
};

const additionalElementsToShow = [
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
  />,
];

const subElementsToShow = [
  "26 / 03 / 2024",
  "11:00 PM",
  "26 / 03 / 2024 11:00 PM",
  "26 / 03 / 2024 11:00 PM Mon",
  "+91 **********",
];

const Template = (args) => {
  const { subElements, additionalElements, ...rest } = args;
  return (
    <Timeline
      {...rest}
      subElements={subElements ? subElementsToShow : []}
      additionalElements={additionalElements ? additionalElementsToShow : []}
    />
  );
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Timeline Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  label: { table: { disable: true } },
  subElements: { table: { disable: true }},
  inline: {table:{disable:true}},
  showConnector: {table:{disable:true}},
  isError: {table:{disable:true}},
  additionalElements: {table:{disable:true}},
};

const commonArgs = {
  label: "Inprogress",
  subElements: false,
  variant: "inprogress",
  inline: "vertical",
  showConnector: false,
  additionalElements: false,
  isError:"Default",
  initialVisibleAdditionalElementsCount: additionalElementsToShow.length - 3,
};

export const InProgress = Template.bind({});
InProgress.args = {
  ...commonArgs,
};

export const Completed = Template.bind({});
Completed.args = {
  ...commonArgs,
  label: "Completed",
  variant: "completed",
};

export const Upcoming = Template.bind({});
Upcoming.args = {
  ...commonArgs,
  label: "Upcoming",
  variant: "upcoming",
};