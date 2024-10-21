import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, ErrorMessage } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context"; // Ensure that the translation function `t` is handled here


{/* use this component for comment like this
    <ApprovePopUp
    onClose={() => setShowPopup(false)}
    onSubmit={(comment) => console.log("Submitted comment:", comment)}
    census={censusData}
/> */}

const ApprovePopUp = ({ onClose, onSubmit, census }) => {
    const { state } = useMyContext(); // Extract state from context
    const { t } = useTranslation();

    const [comment, setComment] = useState("");  // Track TextArea input
    const [error, setError] = useState(false);   // Track error state

    // Handle TextArea input change
    const handleTextAreaChange = (e) => {
        setComment(e.target.value);
        if (e.target.value.trim()) {
            setError(false);  // Reset error when input is not empty
        }
    };

    // Handle keypress "Enter" to submit the form
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSave();
        }
    };

    // Handle Save
    const handleSave = () => {
        if (!comment.trim()) {
            setError(true);  // Show error if TextArea is empty
            return;          // Do not proceed further
        }

        // Send the comment to the parent component or handle it here
        if (onSubmit) {
            onSubmit(comment);  // Pass the comment via onSubmit prop
        }

        // Close the popup after submitting the comment
        onClose();
    };

    return (
        <PopUp
            onClose={onClose}
            heading={t(`HCM_MICROPLAN_SEND_FOR_APPROVAL_LABEL`)}
            children={[
                <div>
                    <div key="comment-section" className="comment-label">
                        {t(`HCM_MICROPLAN_ADD_COMMENT_LABEL`)}{" "}
                        <span className="required">*</span>
                    </div>
                    <TextArea
                        style={{ maxWidth: "100%" }}
                        value={comment}
                        onChange={handleTextAreaChange}
                        onKeyPress={handleKeyPress} // Handle "Enter" key to submit
                        error={error ? true : false}  // Show error message if needed
                    />
                    {error && (
                        <ErrorMessage
                            message={t('HCM_MICROPLAN_ADD_COMMENT_REQUIRED')}
                            truncateMessage={true}
                            maxLength={256}
                            showIcon={true}
                        />
                    )}
                </div>
            ]}
            onOverlayClick={onClose}
            footerChildren={[
                <Button
                    key="close-button"
                    className={"campaign-type-alert-button"}
                    type={"button"}
                    size={"large"}
                    variation={"secondary"}
                    label={t(`HCM_MICROPLAN_EDIT_POPULATION_CLOSE`)}
                    onClick={onClose}
                />,
                <Button
                    key="approve-button"
                    className={"campaign-type-alert-button"}
                    type={"button"}
                    size={"large"}
                    variation={"primary"}
                    label={t(`HCM_MICROPLAN_EDIT_POPULATION_SEND_FOR_APPOVAL`)}
                    onClick={handleSave}  // Call the save function
                />,
            ]}
        />
    );
};

export default ApprovePopUp;
