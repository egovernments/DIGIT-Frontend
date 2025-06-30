import React from "react";
import TimelineMolecule from "../TimelineMolecule";
import { Button } from "../../atoms";
import Timeline from "../../atoms";
import { Iframe } from "../../atoms";

export default {
  title: "Molecules/Timeline Molecule",
  component: TimelineMolecule,
  argTypes: {
    initialVisibleCount: { table: { disable: true } },
    additionalWidgets: {
      control: "boolean",
      name: "Additional Widgets",
      defaultValue: false,
    },
  },
};

const subElements = [
  "26 / 03 / 2024",
  "11:00 PM",
  "26 / 03 / 2024 11:00 PM",
  "26 / 03 / 2024 11:00 PM Mon",
  "+91 **********",
];

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
  />,
];

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="TimelineMolecule Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  additionalWidgets:{table:{disable:true}}
}

const Wrapper = (args) => {
  const { additionalWidgets, ...rest } = args;
  const updatedChildren = additionalWidgets
    ? [
        <Timeline
          label="Upcoming Timeline Step2"
          subElements={subElements}
          variant="upcoming"
          showConnector={true}
          additionalElements={additionalElements}
        />,
        <Timeline
          label="Upcoming Timeline Step"
          subElements={subElements}
          variant="upcoming"
          showConnector={true}
          additionalElements={additionalElements}
        />,
        <Timeline
          label="Inprogress Timeline Step"
          subElements={subElements}
          variant="inprogress"
          showConnector={true}
          additionalElements={additionalElements}
        />,
        <Timeline
          label="Completed Timeline Step2"
          subElements={subElements}
          variant="completed"
          showConnector={true}
          additionalElements={additionalElements}
        />,
        <Timeline
          label="Completed Timeline Step"
          subElements={subElements}
          variant="completed"
          showConnector={true}
          additionalElements={additionalElements}
        />,
      ]
    : [
        <Timeline
          label="Upcoming Timeline Step2"
          subElements={subElements}
          variant="upcoming"
          showConnector={true}
        />,
        <Timeline
          label="Upcoming Timeline Step"
          subElements={subElements}
          variant="upcoming"
          showConnector={true}
        />,
        <Timeline
          label="Inprogress Timeline Step"
          subElements={subElements}
          variant="inprogress"
          showConnector={true}
        />,
        <Timeline
          label="Completed Timeline Step2"
          subElements={subElements}
          variant="completed"
          showConnector={true}
        />,
        <Timeline
          label="Completed Timeline Step"
          subElements={subElements}
          variant="completed"
          showConnector={true}
        />,
      ];

  return <TimelineMolecule {...rest} children={updatedChildren} />;
};

const Template = (args) => {
  return <Wrapper {...args} />;
};

export const Basic = Template.bind({});
Basic.args = {};

export const Collapsible = Template.bind({});
Collapsible.args = {
  initialVisibleCount: 3,
};