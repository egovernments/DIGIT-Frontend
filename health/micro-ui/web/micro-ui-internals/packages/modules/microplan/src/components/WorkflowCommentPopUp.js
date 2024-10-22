import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, ErrorMessage, Toast } from "@egovernments/digit-ui-components";

const WorkflowCommentPopUp = ({ onClose, heading, submitLabel, url, requestPayload, commentPath, onSuccess, onError }) => {

    const { t } = useTranslation();

    const [comment, setComment] = useState("");
    const [error, setError] = useState(false);
    const [showToast, setShowToast] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mutation hook for updating via a dynamic URL
    const mutation = Digit.Hooks.useCustomAPIMutationHook({
        url: url,
        body: requestPayload,
        params: {}
    });

    // Close the toast after 5 seconds
    useEffect(() => {
        if (showToast) {
            setTimeout(() => setShowToast(null), 5000);
        }
    }, [showToast]);


    const handleTextAreaChange = (e) => {
        setComment(e.target.value);
        if (e.target.value.trim()) {
            setError(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSave();
        }
    };

    const setCommentInPayloadForList = (payloadObject, path, comment) => {
        const keys = path.split(".");

        // Access the array inside the payloadObject
        const key = Object.keys(payloadObject)?.[0];

        const censusList = payloadObject[key];

        // Map through each item in the censusList
        return {
            ...payloadObject,
            Census: censusList.map(item => {
                // Create a shallow copy of the current item
                let updatedItem = { ...item };

                // Create a reference to the part of the object we are going to modify
                let nestedObject = updatedItem;

                // Iterate through all keys except the last one to maintain the reference
                for (let i = 0; i < keys.length - 1; i++) {
                    // Ensure we are referencing existing nested objects, and not creating new ones
                    nestedObject[keys[i]] = nestedObject[keys[i]] || {};  // Retain existing object structure
                    nestedObject = nestedObject[keys[i]];
                }

                // Modify the final key (e.g., comment) within the nested structure
                nestedObject[keys[keys.length - 1]] = comment;

                return updatedItem;
            })
        };
    };

    const handleSave = async () => {
        if (!comment.trim()) {
            setError(true);
            return;
        }

        setIsSubmitting(true);

        // Inject the comment into the requestPayload at the given commentPath
        const updatedPayload = setCommentInPayloadForList({ ...requestPayload }, commentPath, comment);

        // Call the API using the mutation hook
        await mutation.mutate(
            {
                body: updatedPayload
            },
            {
                onSuccess: (data) => {
                    setShowToast({ key: "success", label: t("WORKFLOW_UPDATE_SUCCESS") });
                    onSuccess && onSuccess(data); // Call the onSuccess callback if provided
                    onClose();  // Close popup after success
                },
                onError: (error) => {
                    setShowToast({ key: "error", label: t("ERROR_WHILE_UPDATING_WORKFLOW") });
                    onError && onError(error); // Call the onError callback if provided
                }
            }
        );

        setIsSubmitting(false);
    };

    return (
        <>
            <PopUp
                onClose={onClose}
                heading={t(heading)}
                children={[
                    <div key="comment-section">
                        <div className="comment-label">
                            {t(`HCM_MICROPLAN_ADD_COMMENT_LABEL`)} <span className="required">*</span>
                        </div>
                        <TextArea
                            style={{ maxWidth: "100%" }}
                            value={comment}
                            onChange={handleTextAreaChange}
                            onKeyPress={handleKeyPress}
                            error={error}
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
                        className="campaign-type-alert-button"
                        type="button"
                        size="large"
                        variation="secondary"
                        label={t(`HCM_MICROPLAN_EDIT_POPULATION_CLOSE`)}
                        onClick={onClose}
                    />,
                    <Button
                        key="submit-button"
                        className="campaign-type-alert-button"
                        type="button"
                        size="large"
                        variation="primary"
                        label={t(submitLabel)}
                        onClick={handleSave}
                        isDisabled={isSubmitting}  // Disable button during submission
                    />,
                ]}
            />

            {showToast && (
                <Toast style={{ zIndex: 10001 }}
                    label={showToast.label}
                    type={showToast.key}
                    error={showToast.key === "error"}
                    onClose={() => setShowToast(null)}
                />
            )}
        </>
    );
};

export default WorkflowCommentPopUp;
