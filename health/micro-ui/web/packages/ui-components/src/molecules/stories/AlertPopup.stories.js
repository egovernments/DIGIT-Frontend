import React, { useState,Fragment } from "react";
import PopUp from "../../atoms/PopUp";
import AlertCard from "../../atoms/AlertCard";
import Button from "../../atoms/Button";

export default {
  title: "Molecules/PopUp/Alert",
  component: PopUp,
  argTypes: {
    className: {
      control: "text",
      table: { disable: true },
    },
    type: {
      control: "select",
      options: ["default", "alert"],
      table: { disable: true },
    },
    overlayClassName: {
      control: "text",
      table: { disable: true },
    },
    onOverlayClick: {
      control: "function",
      table: { disable: true },
    },
    headerclassName: {
      control: "text",
      table: { disable: true },
    },
    footerclassName: {
      control: "text",
      table: { disable: true },
    },
    style: {
      control: "boolean",
      name: "Custom Width And Height",
    },
    children: {
      control: "object",
      table: { disable: true },
    },
    footerChildren: {
      control: "object",
      table: { disable: true },
    },
    onClose: {
      control: "function",
      table: { disable: true },
    },
    props: {
      control: "object",
      table: { disable: true },
    },
    showIcon: {
      control: "boolean",
      table: { disable: true },
    },
    heading: {
      control: "text",
      table: { disable: true },
    },
    subheading: {
      control: "text",
      table: { disable: true },
    },
    description: {
      control: "text",
      table: { disable: true },
    },
    alertHeading: {
      control: "text",
      name: "Heading",
    },
    alertMessage: {
      control: "text",
      name: "Subheading",
    },
    iconFill: {
      control: "text",
      table: { disable: true },
    },
    customIcon: {
      control: "text",
      table: { disable: true },
    },
    showChildrenInline: {
      control: "boolean",
      table: { disable: true },
    },
    headerMaxLength: {
      control: "text",
      table: { disable: true },
    },
    subHeaderMaxLength: {
      control: "text",
      table: { disable: true },
    },
    sortFooterButtons: {
      control: "boolean",
      table: { disable: true },
    },
    maxFooterButtonsAllowed: {
      control: "text",
      table: { disable: true },
    },
    footerStyles: {
      control: "object",
      table: { disable: true },
    },
    showAlertAsSvg: {
      control: "boolean",
      table: { disable: true },
    },
    equalWidthButtons: {
      control: "boolean",
      table: { disable: true },
    },
    headerChildren: { table: { disable: true } },
    Actions: { control: "boolean" },
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
const lessChildren = [
  <div>This is the content of the Popup</div>,
  <AlertCard text={"This is an infocard"} className={"popup-info-card"} />,
];

const moreChildren = [
  <div>This is the content of the Popup</div>,
  <AlertCard text={"This is an infocard"} className={"popup-info-card"} />,
  <AlertCard text={"This is an infocard"} className={"popup-info-card"} />,
  <AlertCard text={"This is an infocard"} className={"popup-info-card"} />,
  <AlertCard text={"This is an infocard"} className={"popup-info-card"} />,
  <AlertCard text={"This is an infocard"} className={"popup-info-card"} />,
  <AlertCard text={"This is an infocard"} className={"popup-info-card"} />,
  <AlertCard text={"This is an infocard"} className={"popup-info-card"} />,
  <AlertCard text={"This is an infocard"} className={"popup-info-card"} />,
  <AlertCard text={"This is an infocard"} className={"popup-info-card"} />,
];

const Template = (args) => {
  const { Actions, style, ...rest } = args;
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
        <PopUp
          {...rest}
          onClose={onClose}
          onOverlayClick={onOverlayClick}
          footerChildren={Actions ? footerChildrenWithTwoButtons : []}
          children={style ? moreChildren : lessChildren}
          style={style ? { width: "620px", height: "500px" } : {}}
        />
      )}
    </>
  );
};

const commonArgs = {
  type: "alert",
  className: "",
  overlayClassName: "",
  headerclassName: "",
  footerclassName: "",
  style: false,
  props: {},
  showIcon: true,
  heading: "",
  subheading: "",
  description: "",
  alertHeading: "Alert!",
  alertMessage:
    "Please contact the administrator if you have forgotten your password.",
  iconFill: "",
  customIcon: "",
  showChildrenInline: false,
  headerMaxLength: "",
  subHeaderMaxLength: "",
  sortFooterButtons: true,
  maxFooterButtonsAllowed: 5,
  footerStyles: {},
  showAlertAsSvg: false,
  equalWidthButtons: false,
  Actions: true,
};

export const Alert = Template.bind({});
Alert.args = {
  ...commonArgs,
};