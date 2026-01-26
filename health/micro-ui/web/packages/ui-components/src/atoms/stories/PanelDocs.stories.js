import React from "react";
import Panels from "../Panels";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Panels",
  component: Panels,
  argTypes: {
    type: { control: "select", options: ["success", "error"], table: { disable: true } },
    className: {
      control: "text", table: { disable: true }
    },
    message: {
      control: "text", table: { disable: true }
    },
    info: {
      control: "text", table: { disable: true }
    },
    response: {
      control: "text", table: { disable: true }
    },
    customIcon: {
      control: "text", table: { disable: true }
    },
    iconFill: {
      control: "text", table: { disable: true }
    },
    style: {
      control: { type: "object" }, table: { disable: true }
    },
    multipleResponses: {
      control: {
        type: "array",
        separator: ",",
      },
      table: { disable: true }
    },
    showAsSvg: {
      control: "boolean", table: { disable: true }
    },
    animationProps: {
      control: { type: "object" }, table: { disable: true }
    },
  },
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Panel Documentation"
  />
);

Documentation.storyName = "Docs";