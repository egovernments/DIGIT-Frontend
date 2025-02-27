import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, Toast } from "@egovernments/digit-ui-components";

/**
 * Component to show a pop-up to allow the user to enter a comment before approving an attendance register.
 * The component shows a text area to enter the comment and a button to save the comment.
 * If the comment is empty, it shows a toast message to indicate an error.
 * If the comment is valid, it calls the onSubmit function with the comment as an argument.
 * @param {function} onClose - Function to call when the pop-up should be closed.
 * @param {function} onSubmit - Function to call when the comment is valid and should be submitted.
 * @returns {JSX.Element} - The pop-up component.
 */
const ActionPopUp = ({ onClose, onSubmit, headingMsg }) => {

    const { t } = useTranslation();

    return (
        <>
            <PopUp
                style={{ width: "700px" }}
                onClose={onClose}
                heading={t(headingMsg)}
                children={[
                    <div key="comment-section">
                        <div className="comment-label">
                            {t(`HR_READY_TO_SUBMIT_TEXT`)}
                        </div>
                       
                    </div>
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
                        label={t(`HR_COMMON_BUTTON_SUBMIT`)}
                        title={t(`HR_COMMON_BUTTON_SUBMIT`)}
                        onClick={onSubmit}
                    />,
                ]}
            />
            
        </>

    );
};

export default ActionPopUp;
