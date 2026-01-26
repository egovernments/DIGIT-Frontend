import React from "react";
import { AlertCard } from "../../atoms";
import { Button } from "../../atoms";
import PanelCard from "../PanelCard";

export default {
  title: "Molecules/Panel Card/Success",
  component: PanelCard,
  argTypes: {
    cardClassName: {
      control: "text",
      table: { disable: true },
    },
    footerChildren: { table: { disable: true } },
    cardStyles: {
      control: { type: "object" },
      table: { disable: true },
    },
    children: {
      control: "object",
      table: { disable: true },
    },
    props: {
      control: "object",
      table: { disable: true },
    },
    description: {
      control: "text",
      name: "Description",
    },
    showChildrenInline: {
      control: "boolean",
      table: { disable: true },
    },
    sortFooterButtons: {
      control: "boolean",
      table: { disable: true },
    },
    maxFooterButtonsAllowed: {
      control: "text",
      table: { disable: true },
    },
    type: {
      control: "select",
      options: ["success", "error"],
      table: { disable: true },
    },
    message: {
      control: "text",
      name: "Heading",
    },
    info: {
      control: "text",
      table: { disable: true },
    },
    response: {
      control: "text",
      table: { disable: true },
    },
    customIcon: {
      control: "text",
      table: { disable: true },
    },
    iconFill: {
      control: "text",
      table: { disable: true },
    },
    multipleResponses: {
      control: {
        type: "array",
        separator: ",",
      },
      table: { disable: true },
    },
    className: {
      control: "text",
      table: { disable: true },
    },
    style: {
      control: "object",
      table: { disable: true },
    },
    animationProps: {
      control: "object",
      table: { disable: true },
    },
    footerStyles: {
      control: "object",
      table: { disable: true },
    },
    additionlWidgets: { control: "boolean", name: "Additional Widgets" },
    Actions: { control: "boolean" },
    showAsSvg:{table:{disable:true}}
  },
};

const footerChildrenWithTwoButtons = [
  <Button
    type={"button"}
    size={"large"}
    variation={"secondary"}
    label="Button"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"primary"}
    label="Button"
    onClick={() => console.log("Clicked Button 2")}
  />,
];

const children = [
  <AlertCard
    variant={"success"}
    className={"panelcard-infocard"}
    text={"This is success"}
  />,
];

const Template = (args) => {
  const { additionlWidgets, Actions, ...rest } = args;
  return (
    <PanelCard
      {...rest}
      children={additionlWidgets ? children : []}
      footerChildren={Actions ? footerChildrenWithTwoButtons : []}
    />
  );
};

const commonArgs = {
  cardClassName: "",
  cardStyles: {},
  className: "",
  style: {},
  props: {},
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  showChildrenInline: false,
  sortFooterButtons: true,
  maxFooterButtonsAllowed: 5,
  message: "Success Message",
  type: "success",
  info: "Description",
  response: "949749795479",
  customIcon: "",
  iconFill: "",
  multipleResponses: [],
  animationProps: {
    loop: false,
    noAutoplay: false,
  },
  footerStyles: {},
  Actions: false,
  additionlWidgets:false
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  showAsSvg: true,
  cardStyles: { width: "620px", height: "590px" },
};