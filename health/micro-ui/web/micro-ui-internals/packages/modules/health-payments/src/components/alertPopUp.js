import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, ErrorMessage, Toast } from "@egovernments/digit-ui-components";
const AlertPopUp = ({ onClose, alertHeading, alertMessage, submitLabel, cancelLabel, onPrimaryAction }) => {
    const { t } = useTranslation();
    return (
        <>
            <PopUp
                type="alert"
                onClose={onClose}
                alertMessage={alertMessage}
                alertHeading={alertHeading}
                onOverlayClick={onClose}
                equalWidthButtons={true}
                footerChildren={[
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
                ]}
            />
        </>
    );
};
export default AlertPopUp;