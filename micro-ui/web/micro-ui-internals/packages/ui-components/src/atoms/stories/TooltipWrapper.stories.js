import React from "react";
import Tooltip from "../Tooltip";
import { Colors } from "../../constants/colors/colorconstants";

export default {
  title: "Atoms/Tooltip",
  component: Tooltip,
  argTypes: {
    title: { control: "text" },
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

const Template = (args) => (
  <div style={commonStyles}>
    <Tooltip {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  title: "Tooltip",
  arrow: false,
  placement: "bottom",
  style: {},
  className: "",
};

export const MaxLabel = Template.bind({});
MaxLabel.args = {
  title: "Tooltip Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ",
  arrow: false,
  placement: "bottom",
  style: {},
  className: "",
};

export const WithArrow = Template.bind({});
WithArrow.args = {
  title: "Tooltip",
  arrow: true,
  placement: "bottom",
  style: {},
  className: "",
};

export const MaxLabelWithArrow = Template.bind({});
MaxLabelWithArrow.args = {
  title: "Tooltip Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ",
  arrow: true,
  placement: "bottom",
  style: {},
  className: "",
};

export const CustomStyles = Template.bind({});
CustomStyles.args = {
  title: "Tooltip",
  arrow: false,
  placement: "bottom",
  style: {
    backgroundColor: Color,
    border: "3px solid #C84C0E",
    width: "200px",
    textAlign: "center",
  },
  className: "",
};

const htmlTooltip = (
    <React.Fragment>
      <em>{"And here's"}</em> <b>{"some"}</b> <u>{"amazing content"}</u>.{" "}
      {"It's very engaging. Right?"}{" "}
      <img
        alt="here is your logo"
        src="https://cdn.prod.website-files.com/5c7d318eeaea1d6e1198d906/628d4fa7695fe641bef4c60a_CTA-Tooltip.png"
      ></img>
    </React.Fragment>
  );

  export const HtmlTooltip = Template.bind({});
  HtmlTooltip.args = {
    title: htmlTooltip,
    arrow: false,
    placement: "bottom",
    style: {},
    className: "",
  };
  
  export const HtmlTooltipWithArrow = Template.bind({});
  HtmlTooltipWithArrow.args = {
    title: htmlTooltip,
    arrow: true,
    placement: "bottom",
    style: {},
    className: "",
  };