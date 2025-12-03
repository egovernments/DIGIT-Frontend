import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, Toast } from "@egovernments/digit-ui-components";

/**
 * Component to show a pop-up to allow the user to close or confirm the edit user.
 * The component shows a text compkent where it shows the message and close and submit button.
 * @param {function} onClose -If the close button  is hit, it closes the Pop-Up screen.
 * @param {function} onSubmit- If the submit button is hit, it triggers the user Edit service to sendn the data to server  .
 * @returns {JSX.Element} - The pop-up component.
 */
const ActionPopUp = ({ onClose, onSubmit, headingMsg, description }) => {
  const { t } = useTranslation();

  return (
    <>
      <PopUp
        style={{ width: "700px" }}
        onClose={onClose}
        heading={t(headingMsg)}
        children={[
          <div key="comment-section">
            <div className="comment-label">{t(description)}</div>
          </div>,
        ]}
        onOverlayClick={onClose}
        equalWidthButtons={true}
        footerChildren={[
          <Button
            key="close-button"
            className="campaign-type-alert-button"
            type="button"
            size="large"
            style={{ minWidth: "270px" }}
            variation="secondary"
            label={t(`CORE_COMMON_CLOSE`)}
            title={t(`CORE_COMMON_CLOSE`)}
            onClick={onClose}
          />,
          <Button
            key="submit-button"
            className="campaign-type-alert-button"
            type="button"
            size="large"
            variation="primary"
            style={{ minWidth: "270px" }}
            label={t(`HCM_AM_BUTTON_CONFIRM`)}
            title={t(`HCM_AM_BUTTON_CONFIRM`)}
            onClick={onSubmit}
          />,
        ]}
      />
    </>
  );
};

export default ActionPopUp;
