import React, { useState,Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, Toast } from "@egovernments/digit-ui-components";
import BulkUpload from "./BulkUpload";
import SignatureCapture from "./SignatureCapture";
import { downloadFileWithName } from "../utils";

const sanitizeComment = (value) =>
  value
    .replace(/\p{Emoji_Presentation}/gu, "")
    .replace(/[<>&"]/g, "")
    .replace(/\s{2,}/g, " ");

const SendForApprovalPopUp = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [comment, setComment] = useState("");
  const [uploadedFile, setUploadedFile] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [signatureState, setSignatureState] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignatureStateChange = useCallback((state) => setSignatureState(state), []);

  const handleUpload = useCallback(
    async (filesArray) => {
      if (!filesArray || filesArray.length === 0) return;
      const file = filesArray[0];
      try {
        const response = await Digit.UploadServices.Filestorage("health-payments", file, tenantId);
        const fileStoreId = response?.data?.files?.[0]?.fileStoreId;
        if (fileStoreId) {
          setUploadedFile([{ filestoreId: fileStoreId, filename: file.name }]);
        } else {
          setShowToast({ key: "error", label: t("HCM_AM_FILE_UPLOAD_FAILED") });
        }
      } catch (err) {
        console.error("Upload Error:", err);
        setShowToast({ key: "error", label: t("HCM_AM_FILE_UPLOAD_FAILED") });
      }
    },
    [tenantId, t]
  );

  const handleFileDelete = useCallback(() => {
    setUploadedFile([]);
  }, []);

  const handleFileDownload = useCallback((file) => {
    if (file?.filestoreId) {
      downloadFileWithName({ fileStoreId: file.filestoreId, customName: file.filename || "justification", type: "excel" });
    }
  }, []);

  const handleCancel = useCallback(() => {
    setUploadedFile([]);
    setComment("");
    setShowToast(null);
    onClose();
  }, [onClose]);

  const handleSave = async () => {
    if (isSubmitting) return;
    setShowToast(null);
    const trimmedComment = comment.trim();
    if (!uploadedFile?.length || !trimmedComment) {
      setShowToast({ key: "error", label: t("HCM_AM_PLEASE_SELECT_MANDATORY_FIELDS") });
      return;
    }
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
      const signatureFile = await signatureState.getSignatureFile();
      if (!signatureFile) {
        setShowToast({ key: "error", label: t("HCM_AM_SIGNATURE_DRAW_REQUIRED") });
        return;
      }
      const response = await Digit.UploadServices.Filestorage("health-payments", signatureFile, tenantId);
      const signatureFileStoreId = response?.data?.files?.[0]?.fileStoreId;
      if (!signatureFileStoreId) {
        setShowToast({ key: "error", label: t("HCM_AM_FILE_UPLOAD_FAILED") });
        return;
      }
      onSubmit({
        comment: trimmedComment,
        supportingDocs: uploadedFile,
        signature: { printedName, fileStoreId: signatureFileStoreId },
      });
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
        onClose={handleCancel}
        heading={t("HCM_AM_ADD_JUSTIFICATION_AND_COMMENTS")}
        onOverlayClick={handleCancel}
        equalWidthButtons={true}
        children={[
          <div key="upload-section">
            {/* <div className="comment-label">
              {t("HCM_AM_UPLOAD_JUSTIFICATION")}
            </div> */}
            <div className="comment-label">
              {t("HCM_AM_UPLOAD_BILL_OR_DOC")}
              <span style={{ color: "red", marginLeft: "4px" }}>*</span>
            </div>
            <BulkUpload
              onSubmit={handleUpload}
              fileData={uploadedFile}
              onFileDelete={handleFileDelete}
              onFileDownload={handleFileDownload}
            />
          </div>,
          <div key="comment-section" style={{ marginTop: "1rem" }}>
            <div className="comment-label">
              {t("HCM_AM_COMMENTS")}
              <span style={{ color: "red", marginLeft: "4px" }}>*</span>
            </div>
            <TextArea
              style={{ maxWidth: "100%" }}
              value={comment}
              onChange={(e) => setComment(sanitizeComment(e.target.value))}
            />
          </div>,
          <div key="signature-section" style={{ marginTop: "1rem" }}>
            <SignatureCapture onStateChange={handleSignatureStateChange} />
          </div>,
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
            onClick={handleCancel}
          />,
          <Button
            key="submit-button"
            className="campaign-type-alert-button"
            type="button"
            size="large"
            variation="primary"
            style={{ minWidth: "270px" }}
            label={t("HCM_AM_SEND_FOR_APPROVAL")}
            title={t("HCM_AM_SEND_FOR_APPROVAL")}
            onClick={handleSave}
            isDisabled={isSubmitting}
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

export default SendForApprovalPopUp;