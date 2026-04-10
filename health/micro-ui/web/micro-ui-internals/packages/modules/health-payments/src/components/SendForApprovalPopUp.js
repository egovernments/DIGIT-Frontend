import React, { useState,Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextArea, Toast } from "@egovernments/digit-ui-components";
import BulkUpload from "./BulkUpload";
import { downloadFileWithName } from "../utils";

const SendForApprovalPopUp = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [comment, setComment] = useState("");
  const [uploadedFile, setUploadedFile] = useState([]);
  const [showToast, setShowToast] = useState(null);

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

  const handleSave = () => {
    setShowToast(null);
    onSubmit({
      comment: comment.trim() || null,
      supportingDocs: uploadedFile,
    });
  };

  return (
    <>
      <PopUp
        style={{ width: "700px" }}
        onClose={onClose}
        heading={t("HCM_AM_ADD_JUSTIFICATION_AND_COMMENTS")}
        onOverlayClick={onClose}
        equalWidthButtons={true}
        children={[
          <div key="upload-section">
            <div className="comment-label">
              {t("HCM_AM_UPLOAD_JUSTIFICATION")}
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
            </div>
            <TextArea
              style={{ maxWidth: "100%" }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
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
            onClick={onClose}
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
