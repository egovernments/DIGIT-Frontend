import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, ErrorMessage, Toast } from "@egovernments/digit-ui-components";

const ApproveCommentPopUp = ({ onClose, onSubmit }) => {

    const { t } = useTranslation();
    const [comment, setComment] = useState(null);


    const handleTextAreaChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length > 140) {
            // Showing toast when input exceeds 140 characters
            setShowToast({ key: "error", label: t("HCM_MICROPLANNING_COMMENT_CHAR_LENGTH_ERROR_TOAST_MESSAGE") });
            // Trimming the comment back to 140 characters
            setComment(inputValue.substring(0, 140));
        } else {
            setComment(inputValue);
        }
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
                            {t(`HCM_AM_APPROVE_COMMENT_LABEL`)}
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
                        onClick={() => onSubmit(comment)}
                    />,
                ]}
            />
        </>

    );
};

export default ApproveCommentPopUp;
