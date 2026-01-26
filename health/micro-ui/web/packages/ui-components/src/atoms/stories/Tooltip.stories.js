import React from "react";
import Tooltip from "../Tooltip";
import { Colors } from "../../constants/colors/colorconstants";
import { CustomSVG } from "../CustomSVG";

export default {
  title: "Atoms/Tooltip",
  component: Tooltip,
  argTypes: {
    content: { control: "text",table:{disable:true} },
    description: { control: "text" ,name:"Description"},
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
    arrow: { control: "boolean" ,name:'Arrow'},
    style: { control: "object" ,table:{disable:true}},
    className: { control: "text",table:{disable:true} },
    header: { control: "text" ,name:'Header'},
    theme: {
      control: "select",
      options: [
        "dark",
        "light",
      ],
      table:{disable:true}
    },
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
      <Tooltip {...rest} />
    </div>
  );
};

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
  style: {},
  header: "Tooltip Header",
  description:"Tooltip Description"
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  ...commonArgs,
};

export const LightTheme = Template.bind({});
LightTheme.args = {
  ...commonArgs,
  theme:"light"
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