import React from "react";
import { PopUp } from "../../atoms";
import { Button } from "../../atoms";
import { InfoCard } from "../../atoms";
import { ButtonsGroup } from "../../atoms";

export default {
  title: "Atom-Groups/PopUp",
  component: PopUp,
  argTypes: {
    className: {
      control: "text",
    },
    type: { control: "select", options: ["default", "alert"] },
    overlayClassName: {
      control: "text",
    },
    onOverlayClick: {
      control: "function",
    },
    headerclassName: {
      control: "text",
    },
    footerclassName: {
      control: "text",
    },
    style: {
      control: { type: "object" },
    },
    children: {
      control: "object",
    },
    footerChildren: {
      control: "object",
    },
    onClose: {
      control: "function",
    },
    props: {
      control: "object",
    },
    showIcon: {
      control: "boolean",
    },
    heading: {
      control: "text",
    },
    subheading: {
      control: "text",
    },
    description: {
      control: "text",
    },
    alertHeading: {
      control: "text",
    },
    alertMessage: {
      control: "text",
    },
    iconFill: {
      control: "text",
    },
    customIcon: {
      control: "text",
    },
    showChildrenInline: {
      control: "boolean",
    },
    headerMaxLength: {
      control: "text",
    },
    subHeaderMaxLength: {
      control: "text",
    },
    sortFooterButtons: {
      control: "boolean",
    },
    maxFooterButtonsAllowed: {
      control: "text",
    },
    footerStyles: {
      control: "object",
    },
  },
};

const Template = (args) => <PopUp {...args} />;

const commonArgs = {
  type: "default",
  className: "",
  overlayClassName: "",
  headerclassName: "",
  footerclassName: "",
  style: {},
  onClose: () => {
    console.log("Popup closed");
  },
  props: {},
  showIcon: true,
  heading: "",
  subheading: "",
  description: "",
  alertHeading: "",
  alertMessage: "",
  iconFill: "",
  customIcon: "",
  showChildrenInline: false,
  headerMaxLength: "",
  subHeaderMaxLength: "",
  sortFooterButtons: true,
  maxFooterButtonsAllowed: 5,
  footerStyles: {},
  onOverlayClick: () => {
    console.log("Popup overlay is clicked");
  },
};

const footerChildrenWithTwoButtons = [
  <Button
    type={"button"}
    size={"large"}
    variation={"secondary"}
    label="Button"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"primary"}
    label="Button"
    onClick={() => console.log("Clicked Button 2")}
  />,
];

const footerChildrenWithOneButton = [
  <Button
    type={"button"}
    size={"large"}
    variation={"primary"}
    label="OK"
    onClick={() => console.log("Clicked Button")}
  />,
];

const footerChildrenSix = [
  <Button
    type={"button"}
    size={"large"}
    variation={"secondary"}
    label="Button"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"primary"}
    label="Button"
    onClick={() => console.log("Clicked Button 2")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"secondary"}
    label="Button"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"primary"}
    label="Button"
    onClick={() => console.log("Clicked Button 2")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"secondary"}
    label="Button"
    onClick={() => console.log("Clicked Button 1")}
  />,
  <Button
    type={"button"}
    size={"large"}
    variation={"primary"}
    label="Button"
    onClick={() => console.log("Clicked Button 2")}
  />,
];

const lessChildren = [
  <div>This is the content of the Popup</div>,
  <InfoCard
    variant={"error"}
    text={"This is an error"}
    className={"popup-info-card"}
  />,
];

const moreChildren = [
  <div>This is the content of the Popup</div>,
  <InfoCard
    variant={"error"}
    text={"This is an error"}
    className={"popup-info-card"}
  />,
  <InfoCard
    variant={"error"}
    text={"This is an error"}
    className={"popup-info-card"}
  />,
  <InfoCard
    variant={"error"}
    text={"This is an error"}
    className={"popup-info-card"}
  />,
  <InfoCard
    variant={"error"}
    text={"This is an error"}
    className={"popup-info-card"}
  />,
  <InfoCard
    variant={"error"}
    text={"This is an error"}
    className={"popup-info-card"}
  />,
  <InfoCard
    variant={"error"}
    text={"This is an error"}
    className={"popup-info-card"}
  />,
  <InfoCard
    variant={"error"}
    text={"This is an error"}
    className={"popup-info-card"}
  />,
  <InfoCard
    variant={"error"}
    text={"This is an error"}
    className={"popup-info-card"}
  />,
  <InfoCard
    variant={"error"}
    text={"This is an error"}
    className={"popup-info-card"}
  />,
];

export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: true,
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
};

export const DefaultWithSingleButton = Template.bind({});
DefaultWithSingleButton.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: true,
  children: lessChildren,
  footerChildren: footerChildrenWithOneButton,
};

export const DefaultWithCustomIcon = Template.bind({});
DefaultWithCustomIcon.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: true,
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
  customIcon: "CheckCircle",
  iconFill: "green",
};

export const DefaultWithCustomStylesAndLessChildren = Template.bind({});
DefaultWithCustomStylesAndLessChildren.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: true,
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
  style: { width: "620px", height: "500px" },
};

export const DefaultWithCustomStylesAndMoreChildren = Template.bind({});
DefaultWithCustomStylesAndMoreChildren.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: true,
  children: moreChildren,
  footerChildren: footerChildrenWithTwoButtons,
  style: { width: "620px", height: "500px" },
};

export const DefaultWithMoreFooterButtons = Template.bind({});
DefaultWithMoreFooterButtons.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: true,
  children: lessChildren,
  footerChildren: footerChildrenSix,
};

export const DefaultWithFooterStyles = Template.bind({});
DefaultWithFooterStyles.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: true,
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
  footerStyles: {
    marginLeft: "unset",
  },
};

export const DefaultWithOutFooter = Template.bind({});
DefaultWithOutFooter.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: true,
  children: lessChildren,
};

export const Alert = Template.bind({});
Alert.args = {
  ...commonArgs,
  type: "alert",
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
};

export const AlertWithSingleButton = Template.bind({});
AlertWithSingleButton.args = {
  ...commonArgs,
  type: "alert",
  children: lessChildren,
  footerChildren: footerChildrenWithOneButton,
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
};

export const AlertWithCustomIcon = Template.bind({});
AlertWithCustomIcon.args = {
  ...commonArgs,
  type: "alert",
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
  customIcon: "CheckCircle",
  iconFill: "green",
};

export const AlertWithCustomStyles = Template.bind({});
AlertWithCustomStyles.args = {
  ...commonArgs,
  type: "alert",
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
  style: { width: "620px", height: "500px" },
};

export const AlertWithCustomStylesAndMoreChildren = Template.bind({});
AlertWithCustomStylesAndMoreChildren.args = {
  ...commonArgs,
  type: "alert",
  children: moreChildren,
  footerChildren: footerChildrenWithTwoButtons,
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
  style: { width: "620px", height: "500px" },
};

export const AlertWithFooterStyles = Template.bind({});
AlertWithFooterStyles.args = {
  ...commonArgs,
  type: "alert",
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
  footerStyles: {
    marginLeft: "unset",
  },
};

export const AlertWithOutFooter = Template.bind({});
AlertWithOutFooter.args = {
  ...commonArgs,
  type: "alert",
  children: lessChildren,
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
};
