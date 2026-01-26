import React from "react";
import PanelCard from "../PanelCard";
import { Iframe } from "../../atoms";

export default {
  title: "Molecules/Panel Card",
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
      table: { disable: true },
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
      table: { disable: true },
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
    additionlWidgets: {
      control: "boolean",
      name: "Additional Widgets",
      table: { disable: true },
    },
    Actions: { control: "boolean", table: { disable: true } },
    showAsSvg: { table: { disable: true } },
  },
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="PanelCard Documentation"
  />
);

Documentation.storyName = "Docs";