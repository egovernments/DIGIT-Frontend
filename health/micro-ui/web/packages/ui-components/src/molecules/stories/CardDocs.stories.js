import React from "react";
import { Card } from "../../atoms";
import {Iframe} from "../../atoms";

export default {
  title: "Molecules/Card",
  component: Card,
  argTypes: {},
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="Card Documentation"
  />
  );

  Documentation.storyName = "Docs";
  Documentation.argTypes = {
    type: { table: { disable: true } },
    variant: { table: { disable: true } },
    onClick: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
  };