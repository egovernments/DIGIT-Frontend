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
const ApproveCommentPopUp = ({ onClose, onSubmit }) => {

    const { t } = useTranslation();

    // state variables
    const [comment, setComment] = useState(null);
    const [showToast, setShowToast] = useState(null);


    const handleTextAreaChange = (e) => {
        const inputValue = e.target.value;
        setComment(inputValue);
    };

    const handleSave = () => {
        if (!comment || comment.trim() === "") {
            // Show toast if comment is empty
            setShowToast({
                key: "error",
                label: t("HCM_AM_COMMENT_REQUIRED_ERROR_TOAST_MESSAGE"),
                transitionTime: 3000
            });
            return;
        }
        // remove the toast if comment is valid
        setShowToast(null);
        // Call the onSubmit function with the valid comment
        onSubmit(comment);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSave();
        }
    };

    return (
        <>
            <PopUp
                style={{ width: "700px" }}
                onClose={onClose}
                heading={t(`HCM_AM_APPROVE_LABEL`)}
                children={[
                    <div key="comment-section">
                        <div className="comment-label">
                            {t(`HCM_AM_APPROVE_COMMENT_LABEL`)}<span className="required"> *</span>
                        </div>
                        <TextArea
                            style={{ maxWidth: "100%" }}
                            value={comment}
                            onChange={handleTextAreaChange}
                            onKeyPress={handleKeyPress}
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

export default ApproveCommentPopUp;
