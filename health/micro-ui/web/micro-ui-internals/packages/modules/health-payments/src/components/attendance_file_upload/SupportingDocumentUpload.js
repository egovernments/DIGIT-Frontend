import React, { useState, useEffect } from "react";
import { UploadFile } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Toast, Button } from "@egovernments/digit-ui-components";

const SupportingDocumentUpload = ({
  multiple = false,
  onUpload,
  value = [],
}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [uploadedFiles, setUploadedFiles] = useState(value);
  const [pendingFile, setPendingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    if (!pendingFile) return;
    const doUpload = async () => {
      try {
        setLoading(true);
        const response = await Digit.UploadServices.Filestorage("health-payments", pendingFile, tenantId);
        const uploaded = response?.data?.files?.[0];
        if (uploaded?.fileStoreId) {
          const newEntry = { fileStoreId: uploaded.fileStoreId, fileName: pendingFile.name };
          const updated = multiple ? [...uploadedFiles, newEntry] : [newEntry];
          setUploadedFiles(updated);
          if (onUpload) onUpload(updated);
        } else {
          setShowToast({ key: "error", label: t("HCM_FILE_UPLOAD_FAILED") });
        }
      } catch (err) {
        console.error("Upload Error:", err);
        setShowToast({ key: "error", label: t("HCM_FILE_UPLOAD_FAILED") });
      } finally {
        setLoading(false);
        setPendingFile(null);
      }
    };
    doUpload();
  }, [pendingFile]);

  const handleSelectFile = (e) => {
    const file = e.target.files[0];
    if (file) setPendingFile(file);
  };

  const handleDelete = (index) => {
    const updated = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updated);
    if (onUpload) onUpload(updated);
  };

  const uploadMessage = loading
    ? `${t("LOADING")}...`
    : uploadedFiles.length > 0 && !multiple
    ? uploadedFiles[0].fileName
    : t("CS_ACTION_NO_FILEUPLOADED");

  return (
    <div className="supporting-doc-upload">
      <UploadFile
        id="supporting-doc-upload"
        accept=".png,.jpg,.jpeg,.pdf,.xls,.xlsx,.csv"
        onUpload={handleSelectFile}
        onDelete={() => {
          if (!multiple) {
            setUploadedFiles([]);
            if (onUpload) onUpload([]);
          }
        }}
        message={uploadMessage}
      />

      {multiple && uploadedFiles.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}
            >
              <span>{file.fileName}</span>
              <Button
                label={t("DELETE")}
                variation="secondary"
                size="small"
                onClick={() => handleDelete(index)}
              />
            </div>
          ))}
        </div>
      )}

      {showToast && (
        <Toast label={showToast.label} type="error" onClose={() => setShowToast(null)} />
      )}
    </div>
  );
};

export default SupportingDocumentUpload;
