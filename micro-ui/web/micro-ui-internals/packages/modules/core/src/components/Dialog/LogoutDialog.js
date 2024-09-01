import { CardText, PopUp, Button } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";

const LogoutDialog = ({ onSelect, onCancel, onDismiss, PopupStyles, isDisabled, hideSubmit }) => {
  const { t } = useTranslation();

  const children = [
    <div>
      <CardText>
        {t("CORE_LOGOUT_WEB_CONFIRMATION_MESSAGE") + " "}
        <strong>{t("CORE_LOGOUT_MESSAGE")}</strong>
      </CardText>
    </div>,
  ];

  const footer = [
    <Button
      type={"button"}
      size={"large"}
      variation={"secondary"}
      label={t("CORE_LOGOUT_CANCEL")}
      className={"logout-cancel-button"}
      onClick={onCancel}
    />,
    <Button
      type={"button"}
      size={"large"}
      variation={"primary"}
      label={t("CORE_LOGOUT_WEB_YES")}
      formId={"modal-action"}
      onClick={onSelect}
      isDisabled={isDisabled}
    />
  ];

  const footerWithoutSubmit = [
    <Button
      type={"button"}
      size={"large"}
      variation={"digit-action-cancel"}
      label={t("CORE_LOGOUT_CANCEL")}
      className={"logout-cancel-button"}
      onClick={onCancel}
    />,
  ];

  return (
    <PopUp
      type="default"
      children={children}
      heading={t("CORE_LOGOUT_WEB_HEADER")}
      footerChildren={hideSubmit ? footerWithoutSubmit : footer}
      sortFooterButtons={true}
      onClose={onDismiss}
      className={"digit-logout-popup-wrapper"}
      onOverlayClick={onDismiss}
      equalWidthButtons={true}
      style={PopupStyles}
    ></PopUp>
  );
};
export default LogoutDialog;