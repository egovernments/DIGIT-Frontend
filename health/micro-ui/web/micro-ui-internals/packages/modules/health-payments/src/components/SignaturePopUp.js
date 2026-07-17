import React, { Fragment, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, Toast } from "@egovernments/digit-ui-components";
import SignatureCapture from "./SignatureCapture";

/**
 * Sign-off dialog shown before a bill workflow action completes.
 * Collects the mandatory printed name and a drawn or uploaded signature,
 * uploads the image to filestore and hands {printedName, fileStoreId}
 * back through onSubmit. The action is not performed until both are valid.
 */
const SignaturePopUp = ({ heading, description, submitLabel, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [signatureState, setSignatureState] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStateChange = useCallback((state) => setSignatureState(state), []);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setShowToast(null);

    const printedName = signatureState?.printedName?.trim() || "";
    if (!printedName) {
      setShowToast({ key: "error", label: t("HCM_AM_SIGNATURE_PRINTED_NAME_REQUIRED") });
      return;
    }
    if (!signatureState?.hasSignature) {
      setShowToast({
        key: "error",
        label: t(signatureState?.method === "UPLOAD" ? "HCM_AM_SIGNATURE_UPLOAD_REQUIRED" : "HCM_AM_SIGNATURE_DRAW_REQUIRED"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const file = await signatureState.getSignatureFile();
      if (!file) {
        setShowToast({ key: "error", label: t("HCM_AM_SIGNATURE_DRAW_REQUIRED") });
        return;
      }
      const response = await Digit.UploadServices.Filestorage("health-payments", file, tenantId);
      const fileStoreId = response?.data?.files?.[0]?.fileStoreId;
      if (!fileStoreId) {
        setShowToast({ key: "error", label: t("HCM_AM_FILE_UPLOAD_FAILED") });
        return;
      }
      onSubmit({ printedName, fileStoreId });
    } catch (err) {
      console.error("Signature upload error:", err);
      setShowToast({ key: "error", label: t("HCM_AM_FILE_UPLOAD_FAILED") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PopUp
        style={{ width: "700px" }}
        onClose={onClose}
        heading={heading || t("HCM_AM_SIGNATURE_POPUP_HEADING")}
        onOverlayClick={onClose}
        equalWidthButtons={true}
        children={[
          <div key="signature-popup-description" style={{ marginBottom: "1rem" }}>
            {description || t("HCM_AM_SIGNATURE_POPUP_DESCRIPTION")}
          </div>,
          <SignatureCapture key="signature-capture" onStateChange={handleStateChange} />,
        ]}
        footerChildren={[
          <Button
            key="cancel-button"
            className="campaign-type-alert-button"
            type="button"
            size="large"
            style={{ minWidth: "270px" }}
            variation="secondary"
            label={t("HCM_AM_CANCEL")}
            title={t("HCM_AM_CANCEL")}
            onClick={onClose}
          />,
          <Button
            key="submit-button"
            className="campaign-type-alert-button"
            type="button"
            size="large"
            variation="primary"
            style={{ minWidth: "270px" }}
            label={submitLabel || t("HCM_AM_SIGNATURE_SUBMIT")}
            title={submitLabel || t("HCM_AM_SIGNATURE_SUBMIT")}
            onClick={handleSubmit}
            isDisabled={isSubmitting}
          />,
        ]}
      />
      {showToast && (
        <Toast style={{ zIndex: 10001 }} label={showToast.label} type={showToast.key} onClose={() => setShowToast(null)} />
      )}
    </>
  );
};

export default SignaturePopUp;