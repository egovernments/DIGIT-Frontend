import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button } from "@egovernments/digit-ui-components";

/*************   Codeium Command   *************/
/**
 * AlertPopUp component is used to display a pop up with a message and
 * provides options to the user to perform primary and secondary actions.
 *
 * @param {Function} props.onClose - To close the pop up.
 * @param {string} props.alertHeading - The heading of the alert message.
 * @param {string} props.alertMessage - The message to be displayed in the alert pop up.
 * @param {string} props.submitLabel - The label of the primary action button.
 * @param {string} props.cancelLabel - The label of the secondary action button.
 * @param {Function} props.onPrimaryAction - The function to be executed when primary action button is clicked.
 *
 * @returns {React.Component} The JSX element for the alert pop up.
 * **/
const AlertPopUp = ({ onClose, alertHeading, alertMessage, submitLabel, cancelLabel, onPrimaryAction }) => {
    const { t } = useTranslation();

    return (
        <>
            <PopUp
                style={{ width: "700px" }}
                type="alert"
                onClose={onClose}
                alertMessage={alertMessage}
                alertHeading={alertHeading}
                onOverlayClick={onClose}
                equalWidthButtons={true}
                footerChildren={[
                    <Button
                        key="submit-button"
                        className="campaign-type-alert-button"
                        type="button"
                        size="large"
                        variation="primary"
                        label={t(submitLabel)}
                        title={t(submitLabel)}
                        onClick={onPrimaryAction}
                    />,
                    <Button
                        key="cancel-button"
                        className="campaign-type-alert-button"
                        type="button"
                        size="large"
                        variation="secondary"
                        label={t(cancelLabel)}
                        title={t(cancelLabel)}
                        onClick={onClose}
                    />,
                ]}
            />
        </>
    );
};

export default AlertPopUp;