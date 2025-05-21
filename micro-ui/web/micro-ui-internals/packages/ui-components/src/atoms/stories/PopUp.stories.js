import React, { useState } from "react";
import PopUp from "../PopUp";
import Button from "../Button";
import InfoCard from "../InfoCard";

export default {
  title: "Atoms/PopUp",
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
    showAlertAsSvg: {
      control: "boolean",
    },
    equalWidthButtons: {
      control: "boolean",
    },
  },
};

const Template = (args) => {
  const [showPopup, setShowPopup] = useState(false);

  const onClose = () => {
    setShowPopup(false);
  };

  const onOverlayClick = () => {
    setShowPopup(false);
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

  return (
    <>
      <div style={commonStyles}>
        {
          <Button
            label={args.type === "default" ? "Show PopUp" : "Show Alert Popup"}
            variation={"secondary"}
            onClick={() => setShowPopup(true)}
          />
        }
      </div>
      {showPopup && (
        <PopUp {...args} onClose={onClose} onOverlayClick={onOverlayClick} />
      )}
    </>
  );
};

const commonArgs = {
  type: "default",
  className: "",
  overlayClassName: "",
  headerclassName: "",
  footerclassName: "",
  style: {},
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
  showAlertAsSvg:false,
  equalWidthButtons:false
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


const FooterChild = [
  <Button
    type={"button"}
    size={"large"}
    variation={"primary"}
    label="Cancel"
    onClick={() => console.log("Clicked Button")}
  />,
  <Button
    type={"submit"}
    size={"large"}
    variation={"primary"}
    icon={"FileDownload"}
    label="Download Template"
    onClick={() => console.log("Clicked submit")}
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
  <InfoCard text={"This is an infocard"} className={"popup-info-card"} />,
];

const moreChildren = [
  <div>This is the content of the Popup</div>,
  <InfoCard text={"This is an infocard"} className={"popup-info-card"} />,
  <InfoCard text={"This is an infocard"} className={"popup-info-card"} />,
  <InfoCard text={"This is an infocard"} className={"popup-info-card"} />,
  <InfoCard text={"This is an infocard"} className={"popup-info-card"} />,
  <InfoCard text={"This is an infocard"} className={"popup-info-card"} />,
  <InfoCard text={"This is an infocard"} className={"popup-info-card"} />,
  <InfoCard text={"This is an infocard"} className={"popup-info-card"} />,
  <InfoCard text={"This is an infocard"} className={"popup-info-card"} />,
  <InfoCard text={"This is an infocard"} className={"popup-info-card"} />,
];

export const Default = Template.bind({});
Default.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: false,
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
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

export const DefaultWithEqualWidthButtons = Template.bind({});
DefaultWithEqualWidthButtons.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: true,
  children: lessChildren,
  footerChildren: FooterChild,
  equalWidthButtons:true
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

export const SingleButtonWithTotalWidth = Template.bind({});
SingleButtonWithTotalWidth.args = {
  ...commonArgs,
  type: "default",
  heading: "Heading",
  subheading: "Subheading",
  description:
    "Please contact the administrator if you have forgotten your password.",
  showIcon: true,
  children: lessChildren,
  footerChildren: footerChildrenWithOneButton,
  equalWidthButtons:true
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

export const AlertAsSvg = Template.bind({});
AlertAsSvg.args = {
  ...commonArgs,
  type: "alert",
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
  showAlertAsSvg:true
};

export const AlertWithSingleButtonTotalWidth = Template.bind({});
AlertWithSingleButtonTotalWidth.args = {
  ...commonArgs,
  type: "alert",
  children: lessChildren,
  footerChildren: footerChildrenWithOneButton,
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
    equalWidthButtons:true
};

export const AlertWithEqualButtonsWidth = Template.bind({});
AlertWithEqualButtonsWidth.args = {
  ...commonArgs,
  type: "alert",
  children: lessChildren,
  footerChildren: footerChildrenWithTwoButtons,
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
    equalWidthButtons:true
};