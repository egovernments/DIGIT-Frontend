import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, ErrorMessage, Toast } from "@egovernments/digit-ui-components";

const ConfirmationPopUp = ({ onClose, alertHeading, alertMessage, submitLabel, url, requestPayload, onSuccess, onError, cancelLabel }) => {

    const { t } = useTranslation();
    const [comment, setComment] = useState(null);
    const [showToast, setShowToast] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mutation hook for updating via a dynamic URL
    const mutation = Digit.Hooks.useCustomAPIMutationHook({
        url: url,
        body: requestPayload,
        params: {}
    });

    const handleSave = async () => {

        setIsSubmitting(true);

        // Call the API using the mutation hook
        await mutation.mutate(
            {
                body: requestPayload
            },
            {
                onSuccess: (data) => {
                    onSuccess && onSuccess(data); // Call the onSuccess callback if provided
                },
                onError: (error) => {
                    setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
                    onError && onError(error); // Call the onError callback if provided
                }
            }
        );

        setIsSubmitting(false);
    };


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
                        key="submit-button"
                        className="campaign-type-alert-button"
                        type="button"
                        size="large"
                        variation="secondary" 
                        label={t(submitLabel)}
                        title={t(submitLabel)}
                        onClick={handleSave}
                        isDisabled={isSubmitting || mutation.isLoading}  // Disable button during submission
                    />,
                    <Button
                        key="close-button"
                        className="campaign-type-alert-button"
                        type="button"
                        size="large"
                        variation="primary"
                        label={t(cancelLabel)}
                        title={t(cancelLabel)}
                        onClick={onClose}
                        isDisabled={isSubmitting || mutation.isLoading}  // Disable button during submission
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

export default ConfirmationPopUp;
