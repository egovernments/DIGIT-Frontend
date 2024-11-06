import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, ErrorMessage, Toast } from "@egovernments/digit-ui-components";

const WorkflowCommentPopUp = ({ onClose, heading, submitLabel, url, requestPayload, commentPath, onSuccess, onError }) => {

    const { t } = useTranslation();
    const [comment, setComment] = useState("");
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mutation hook for updating via a dynamic URL
    const mutation = Digit.Hooks.useCustomAPIMutationHook({
        url: url,
        body: requestPayload,
        params: {}
    });


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
        const key = Object.keys(payloadObject)?.[0]; // Get the first key in the payloadObject
        const value = payloadObject[key]; // Get the value associated with that key

        // Check if the value is an array or a single object
        if (Array.isArray(value)) {
            // It's an array, so map through each item as before
            return {
                ...payloadObject,
                [key]: value.map(item => {
                    let updatedItem = { ...item };
                    let nestedObject = updatedItem;

                    for (let i = 0; i < keys.length - 1; i++) {
                        nestedObject[keys[i]] = nestedObject[keys[i]] || {};
                        nestedObject = nestedObject[keys[i]];
                    }

                    nestedObject[keys[keys.length - 1]] = comment;

                    return updatedItem;
                })
            };
        } else if (typeof value === 'object' && value !== null) {
            // It's a single object, so update it directly
            let updatedObject = { ...value };
            let nestedObject = updatedObject;

            for (let i = 0; i < keys.length - 1; i++) {
                nestedObject[keys[i]] = nestedObject[keys[i]] || {};
                nestedObject = nestedObject[keys[i]];
            }

            nestedObject[keys[keys.length - 1]] = comment;

            return {
                ...payloadObject,
                [key]: updatedObject
            };
        } else {
            // Handle the case where the structure is unexpected
            console.warn("Unexpected payload structure: expected an array or an object.");
            return payloadObject; // or handle error as needed
        }
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
                    onSuccess && onSuccess(data); // Call the onSuccess callback if provided
                },
                onError: (error) => {
                    onError && onError(error); // Call the onError callback if provided
                }
            }
        );

        setIsSubmitting(false);
    };

    return (
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
                    style={{minWidth:"270px"}}
                    variation="secondary"
                    label={t(`HCM_MICROPLAN_EDIT_POPULATION_CLOSE`)}
                    onClick={onClose}
                    isDisabled={isSubmitting}  // Disable button during submission
                />,
                <Button
                    key="submit-button"
                    className="campaign-type-alert-button"
                    type="button"
                    size="large"
                    variation="primary"
                    style={{minWidth:"270px"}}
                    label={t(submitLabel)}
                    onClick={handleSave}
                    isDisabled={isSubmitting}  // Disable button during submission
                />,
            ]}
        />
    );
};

export default WorkflowCommentPopUp;
