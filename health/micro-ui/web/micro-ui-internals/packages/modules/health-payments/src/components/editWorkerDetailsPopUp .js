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
const EditWorkerDetailsPopUp = ({ onClose, onSubmit, editFieldName, fieldKey, initialValue }) => {

    const { t } = useTranslation();

    // state variables
    const [comment, setComment] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [inputValue, setInputValue] = useState(initialValue || "");



    const handleSave = () => {
        const trimmedInput = inputValue?.trim();
        // Mobile number validation
        if (fieldKey === "mobileNumber") {
            const mobileRegex = /^[0-9]{8}$/;

            if (!trimmedInput) {
                setShowToast({
                    key: "error",
                    label: t("HCM_AM_INVALID_MOBILE_NUMBER_ERROR_TOAST_MESSAGE") || "Please enter a valid 8-digit mobile number.",
                    transitionTime: 3000
                });
                return;
            }
            else if (!mobileRegex.test(trimmedInput)) {
                setShowToast({
                    key: "error",
                    label: t("HCM_AM_INVALID_MOBILE_NUMBER_ERROR_TOAST_MESSAGE") || "Please enter a valid 8-digit mobile number.",
                    transitionTime: 3000
                });
                return;
            }
        }
        else if (fieldKey === "givenName") {
            if (!trimmedInput) {
                setShowToast({
                    key: "error",
                    label: t("HCM_AM_INVALID_NAME_ERROR_TOAST_MESSAGE") || "Please enter a valid name.",
                    transitionTime: 3000
                });
                return;
            }
        }
        setShowToast(null);
        onSubmit(fieldKey, trimmedInput); // send back key and value
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSave();
        }
    };

    return (
        <>
            {/*TODO: ADD LOGIC TO CLEAR SAVED FIELDS NAMES */}
            <PopUp
                style={{ width: "700px" }}
                onClose={onClose}
                heading={t(`HCM_AM_EDIT_WORKER_DETAILS_LABEL`)}
                children={[
                    <div key="comment-section">
                        <div className="comment-label">
                            {editFieldName}<span className="required"> *</span>
                        </div>
                        <TextArea
                            style={{ maxWidth: "100%" }}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}

                        />
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
                        label={t(`HCM_AM_CLOSE`)}
                        title={t(`HCM_AM_CLOSE`)}
                        onClick={onClose}
                    />,
                    <Button
                        key="submit-button"
                        className="campaign-type-alert-button"
                        type="button"
                        size="large"
                        variation="primary"
                        style={{ minWidth: "270px" }}
                        label={t(`HCM_AM_APPROVE`)}
                        title={t(`HCM_AM_APPROVE`)}
                        onClick={() => handleSave()}
                    />,
                ]}
            />
            {showToast && (
                <Toast
                    style={{ zIndex: 10001 }}
                    label={showToast.label}
                    type={showToast.key}
                    onClose={() => setShowToast(null)}
                />
            )}
        </>

    );
};

export default EditWorkerDetailsPopUp;
