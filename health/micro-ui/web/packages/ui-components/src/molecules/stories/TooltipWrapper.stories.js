import React from "react";
import { Colors } from "../../constants/colors/colorconstants";
import { Button } from "../../atoms";
import TooltipWrapper from "../TooltipWrapper";
import { Iframe } from "../../atoms";
import { CustomSVG } from "../../atoms";

export default {
  title: "Molecules/Tooltip Wrapper",
  component: TooltipWrapper,
  argTypes: {
    content: { control: "text", name: "Content" },
    header: { control: "text" ,name:'Header'},
    wrapperClassName: { control: "text",table:{disable:true} },
    ClassName: { control: "text" ,table:{disable:true}},
    arrow: { control: "boolean", name: "Arrow" },
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
      name: "Position",
    },
    enterDelay: { control: "number",table:{disable:true} },
    leaveDelay: { control: "number",table:{disable:true} },
    followCursor: { control: "boolean",table:{disable:true} },
    open: { control: "boolean",table:{disable:true} },
    disableFocusListener: { control: "boolean" ,table:{disable:true}},
    disableHoverListener: { control: "boolean",table:{disable:true} },
    disableInteractive: { control: "boolean" ,table:{disable:true}},
    disableTouchListener: { control: "boolean",table:{disable:true} },
    style: { control: "object",table:{disable:true} },
    children:{table:{disable:true}},
    title:{table:{disable:true}},
    onOpen:{table:{disable:true}},
    onClose:{table:{disable:true}}
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

const Color = Colors.lightTheme.primary[2];

const Template = (args) => {
  const { ...rest } = args;
  return (
    <div style={commonStyles}>
      <TooltipWrapper {...rest} />
    </div>
  );
};

export const Documentation = () => (
  <Iframe
    //Todo:Update the url
    src="https://core.digit.org/guides/developer-guide/ui-developer-guide/digit-ui/ui-components-standardisation/digit-ui-components0.2.0"
    title="TooltipWrapper Documentation"
  />
);

Documentation.storyName = "Docs";
Documentation.argTypes = {
  header:{table:{disable:true}},
  content:{table:{disable:true}},
  arrow:{table:{disable:true}},
  placement:{table:{disable:true}}
}

const htmlTooltip = (
  <React.Fragment>
    {
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt "
    }
    <hr></hr>
    <CustomSVG.PlaceholderSvg width={"200px"} height={"200px"}></CustomSVG.PlaceholderSvg>
  </React.Fragment>
);

const commonArgs = {
  content: htmlTooltip,
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
  children: <Button label={"MaxLabel..."} variation={"primary"}></Button>,
  style: {},
  header: "Tooltip Header",
};

export const Basic = Template.bind({});
Basic.args = {
  ...commonArgs,
};

export const Custom = Template.bind({});
Custom.args = {
  ...commonArgs,
  style: {
    backgroundColor: Color,
    border: "3px solid #C84C0E",
    width: "300px",
    textAlign: "center",
  },
};