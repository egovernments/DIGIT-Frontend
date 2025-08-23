import React from "react";
import { Accordion } from "../../atoms";
import { AccordionList } from "../../atoms";
import {Iframe} from "../../atoms";

export default {
  title: "Molecules/Accordion List",
  component: AccordionList,
  argTypes: {
    allowMultipleOpen: { control: "boolean" },
    addDivider: { control: "boolean" ,name:"With Divider"},
    children: { table: { disable: true } },
    customClassName: { table: { disable: true } },
    customStyles: { table: { disable: true } },
    styles:{table:{disable:true}}
  },
};

const Template = (args) => <AccordionList {...args} />;

const children = [
  <Accordion
    number={1}
    isOpenInitially={false}
    title={"Accordion 1"}
    children={
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
    }
  ></Accordion>,
  <Accordion
    number={2}
    isOpenInitially={false}
    title={"Accordion 2"}
    children={
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
    }
  ></Accordion>,
  <Accordion
    number={3}
    isOpenInitially={false}
    title={"Accordion 3"}
    children={
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
    }
  ></Accordion>,
  <Accordion
    number={4}
    isOpenInitially={false}
    title={"Accordion 4"}
    children={
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
    }
  ></Accordion>,
];

const commonArgs = {
  allowMultipleOpen: true,
  addDivider: false,
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="AccordionList Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  allowMultipleOpen: { table: { disable: true } },
  addDivider: { table: { disable: true }},
};

export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  children: children,
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  children: children,
  styles: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #d6d5d4",
    borderRadius: "4px",
    padding: "24px",
  },
};
