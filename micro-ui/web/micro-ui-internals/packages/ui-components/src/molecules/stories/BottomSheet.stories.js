import React from "react";
import BottomSheet from "../BottomSheet";
import { Button } from "../../atoms";
import { IMAGES } from "../../constants/images/images";
import { Iframe } from "../../atoms";

export default {
  title: "Molecules/Bottom Sheet",
  component: BottomSheet,
  argTypes: {
    initialState: {
      control: "select",
      options: ["closed", "fixed", "quarter", "intermediate", "full"],
      table: { disable: true },
    },
    enableActions: {
      control: "boolean",
      table: { disable: true },
    },
    equalWidthButtons: {
      control: "boolean",
      table: { disable: true },
    },
    className: {
      control: "text",
      table: { disable: true },
    },
    style: {
      control: { type: "object" },
      table: { disable: true },
    },
    children: { table: { disable: true } },
    actions: { table: { disable: true } },
  },
};

const Template = (args) => {
  return <BottomSheet {...args}>{args.children}</BottomSheet>;
};

const commonArgs = {
  initialState: "closed",
  enableActions: false,
  className: "",
  style: {},
  equalWidthButtons: false,
};

const getImageUrl = (imageKey) => {
  return IMAGES[imageKey];
};

const digitImg = getImageUrl("DIGIT_LIGHT");

const additionalElements = [
  <div key="1" className="typography heading-l" style={{ color: "#363636" }}>
    BottomSheet
  </div>,
  <div key="1" className="typography body-xs" style={{ color: "#363636" }}>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book. It has survived not only five centuries, but also
    the leap into electronic typesetting, remaining essentially unchanged.
  </div>,
  <img key="2" alt="Powered by DIGIT" src={digitImg} />,
];

const actions = [
  <Button
    key="2"
    label={"Action 1"}
    size="large"
    variation={"primary"}
    isDisabled={false}
  />,
];

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="BottomSheet Documentation"
  />
);

Documentation.storyName = "Docs";

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
  children: additionalElements,
};

export const WithActions = Template.bind({});
WithActions.args = {
  ...commonArgs,
  enableActions: true,
  actions: actions,
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  enableActions: true,
  actions: actions,
  equalWidthButtons: true,
};