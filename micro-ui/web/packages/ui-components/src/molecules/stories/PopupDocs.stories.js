import React, { useState } from "react";
import PopUp from "../../atoms/PopUp";
import Iframe from "../../atoms/Iframe";

export default {
  title: "Molecules/PopUp",
  component: PopUp,
  argTypes: {
    className: {
      control: "text",
      table: { disable: true },
    },
    type: {
      control: "select",
      options: ["default", "alert"],
      table: { disable: true },
    },
    overlayClassName: {
      control: "text",
      table: { disable: true },
    },
    onOverlayClick: {
      control: "function",
      table: { disable: true },
    },
    headerclassName: {
      control: "text",
      table: { disable: true },
    },
    footerclassName: {
      control: "text",
      table: { disable: true },
    },
    style: {
      control: "boolean",
      name: "Custom Width And Height",
      table: { disable: true },
    },
    children: {
      control: "object",
      table: { disable: true },
    },
    footerChildren: {
      control: "object",
      table: { disable: true },
    },
    onClose: {
      control: "function",
      table: { disable: true },
    },
    props: {
      control: "object",
      table: { disable: true },
    },
    showIcon: {
      control: "boolean",
      table: { disable: true },
    },
    heading: {
      control: "text",
      table: { disable: true },
      table: { disable: true },
    },
    subheading: {
      control: "text",
      table: { disable: true },
      table: { disable: true },
    },
    description: {
      control: "text",
      table: { disable: true },
    },
    alertHeading: {
      control: "text",
      name: "Heading",
      table: { disable: true },
    },
    alertMessage: {
      control: "text",
      name: "Subheading",
      table: { disable: true },
    },
    iconFill: {
      control: "text",
      table: { disable: true },
    },
    customIcon: {
      control: "text",
      table: { disable: true },
    },
    showChildrenInline: {
      control: "boolean",
      table: { disable: true },
    },
    headerMaxLength: {
      control: "text",
      table: { disable: true },
    },
    subHeaderMaxLength: {
      control: "text",
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
    footerStyles: {
      control: "object",
      table: { disable: true },
    },
    showAlertAsSvg: {
      control: "boolean",
      table: { disable: true },
    },
    equalWidthButtons: {
      control: "boolean",
      table: { disable: true },
    },
    headerChildren: { table: { disable: true } },
    Actions: { control: "boolean", table: { disable: true } },
  },
  parameters: {
    options: {
      storySort: {
        order: ["Docs", "Basic", "Alert"],
      },
    },
  },
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Popup Documentation"
  />
);

Documentation.storyName = "Docs";