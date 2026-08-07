import { CardText, PopUp, Button } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";

const ForgotPasswordDialog = ({ onDismiss, heading, description, buttonLabel, PopupStyles }) => {
  const { t } = useTranslation();

  const children = [
    <div>
      <CardText>{t(description)}</CardText>
    </div>,
  ];

  const footer = [
    <Button
      type={"button"}
      size={"large"}
      variation={"primary"}
      label={t(buttonLabel)}
      onClick={onDismiss}
    />,
  ];

  return (
    <PopUp
      type="default"
      children={children}
      heading={t(heading)}
      footerChildren={footer}
      sortFooterButtons={true}
      onClose={onDismiss}
      className={"digit-forgot-password-popup-wrapper"}
      onOverlayClick={onDismiss}
      equalWidthButtons={true}
      style={PopupStyles}
    ></PopUp>
  );
};
export default ForgotPasswordDialog;
