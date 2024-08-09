import React from "react";
import TooltipWrapper from "../ToolTipWrapper";
import Button from "../Button";

export default {
  title: "Atoms/TooltipWrapper",
  component: TooltipWrapper,
  argTypes: {
    title: { control: "text" },
    arrow: { control: "boolean" },
    placement: {
      control: "select",
      options: [
        "bottom",
        "bottom-end",
        "bottom-start",
        "left",
        "left-end",
        "left-start",
        "right",
        "right-end",
        "right-start",
        "top",
        "top-end",
        "top-start",
      ],
    },
    enterDelay: { control: "number" },
    leaveDelay: { control: "number" },
    followCursor: { control: "boolean" },
    open: { control: "boolean" },
    disableFocusListener: { control: "boolean" },
    disableHoverListener: { control: "boolean" },
    disableInteractive: { control: "boolean" },
    disableTouchListener: { control: "boolean" },
  },
};

const commonStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "#363636",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "translate(-50%, -50%)",
};

const Template = (args) => (
  <div style={commonStyles}>
    <TooltipWrapper {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  title: "Tooltip",
  arrow: false,
  placement: "bottom",
  enterDelay: 100,
  leaveDelay: 0,
  followCursor: false,
  open: false,
  disableFocusListener: false,
  disableHoverListener: false,
  disableInteractive: false,
  disableTouchListener: false,
  children: <Button label={"Button..."} variation={"primary"}></Button>
};

export const MaxLabel = Template.bind({});
MaxLabel.args = {
  title: "Tooltip Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ",
  arrow: false,
  placement: "bottom",
  enterDelay: 100,
  leaveDelay: 0,
  followCursor: false,
  open: false,
  disableFocusListener: false,
  disableHoverListener: false,
  disableInteractive: false,
  disableTouchListener: false,
  children: <Button label={"Button..."} variation={"primary"}></Button>
};

export const Positioned = Template.bind({});
Positioned.args = {
  title: "Tooltip",
  arrow: false,
  placement: "top",
  enterDelay: 100,
  leaveDelay: 0,
  followCursor: false,
  open: false,
  disableFocusListener: false,
  disableHoverListener: false,
  disableInteractive: false,
  disableTouchListener: false,
  children: <Button label={"Button..."} variation={"primary"}></Button>
};


export const Arrow = Template.bind({});
Arrow.args = {
  title: "Tooltip",
  arrow: true,
  placement: "bottom",
  enterDelay: 100,
  leaveDelay: 0,
  followCursor: false,
  open: false,
  disableFocusListener: false,
  disableHoverListener: false,
  disableInteractive: false,
  disableTouchListener: false,
  children: <Button label={"Button..."} variation={"primary"}></Button>
};


export const VariableWidth = Template.bind({});
VariableWidth.args = {
  title: "Tooltip",
  arrow: true,
  placement: "bottom",
  enterDelay: 100,
  leaveDelay: 0,
  followCursor: false,
  open: false,
  disableFocusListener: false,
  disableHoverListener: false,
  disableInteractive: false,
  disableTouchListener: false,
  children: <Button label={"Button..."} variation={"primary"}></Button>
};