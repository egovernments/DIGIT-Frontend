import React from "react";
import Tooltip from "../Tooltip";
import Iframe from "../Iframe";

export default {
  title: "Atoms/Tooltip",
  component: Tooltip,
  argTypes: {
    content: { control: "text" },
    description: { control: "text" },
    placement: {
      control: "select",
      options: [
        "bottom-start",
        "bottom",
        "bottom-end",
        "top-start",
        "top",
        "top-end",
        "left-start",
        "left",
        "left-end",
        "right-start",
        "right",
        "right-end",
      ],
    },
    arrow: { control: "boolean" },
    style: { control: "object" },
    className: { control: "text" },
    header: { control: "text" },
    theme: {
      control: "select",
      options: ["dark", "light"],
    },
  },
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Tooltip Documentation"
  />
);

Documentation.storyName = "Docs";