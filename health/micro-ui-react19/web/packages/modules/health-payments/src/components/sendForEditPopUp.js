import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, Toast } from "@egovernments/digit-ui-components";
import { Dropdown } from "@egovernments/digit-ui-react-components";

/**
 * Component to show a pop-up to allow the user to enter a comment before approving an attendance register.
 * The component shows a text area to enter the comment and a button to save the comment.
 * If the comment is empty, it shows a toast message to indicate an error.
 * If the comment is valid, it calls the onSubmit function with the comment as an argument.
 * @param {function} onClose - Function to call when the pop-up should be closed.
 * @param {function} onSubmit - Function to call when the comment is valid and should be submitted.
 * @returns {JSX.Element} - The pop-up component.
 */
const SendForEditPopUp = ({ ...props }) => {
    console.log("props", props.isEditTrue);
    const { t } = useTranslation();

    // state variables
    const [comment, setComment] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);


    const handleTextAreaChange = (e) => {
        const inputValue = e.target.value;
        setComment(inputValue);
    };

    const handleSave = () => {

        if (!selectedUser) {
            setShowToast({
                key: "error",
                label: t("HCM_AM_SELECT_USER_REQUIRED"),
                transitionTime: 3000
            });
            return;
        }
        setShowToast(null);

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
        props?.onSubmit(comment, selectedUser);
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
                onClose={props?.onClose}
                heading={props?.isEditTrue ? t(`HCM_AM_FORWARD`) : t(`HCM_AM_SEND_FOR_EDIT`)}
                onOverlayClick={props?.onClose}
                equalWidthButtons={true}
                footerChildren={[
                    <Button
                        key="close-button"
                        className="campaign-type-alert-button"
                        type="button"
                        size="large"
                        style={{ minWidth: "270px" }}
                        variation="secondary"
                        label={t(`HCM_AM_CANCEL`)}
                        title={t(`HCM_AM_CANCEL`)}
                        onClick={props?.onClose}
                    />,
                    <Button
                        key="submit-button"
                        className="campaign-type-alert-button"
                        type="button"
                        size="large"
                        variation="primary"
                        style={{ minWidth: "270px" }}
                        label={props?.isEditTrue ? t(`HCM_AM_FORWARD`) : t(`HCM_AM_SEND`)}
                        title={props?.isEditTrue ? t(`HCM_AM_FORWARD`) : t(`HCM_AM_SEND`)}
                        onClick={() => handleSave()}
                    />,
                ]}
            >
                <div key="comment-section">
                    <div className="comment-label">
                        {props?.isEditTrue ? t(`HCM_AM_FORWARD_TO`) : t(`HCM_AM_SEND_FOR_EDIT`)}<span className="required"> *</span>
                    </div>
                    <Dropdown
                        option={props?.dropdownOptions}
                        optionKey="title"
                        selected={selectedUser}
                        select={(option) => setSelectedUser(option)}
                        placeholder={t("HCM_AM_SELECT_EDITOR")}
                    />
                </div>
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
            </PopUp>
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

export default SendForEditPopUp;
