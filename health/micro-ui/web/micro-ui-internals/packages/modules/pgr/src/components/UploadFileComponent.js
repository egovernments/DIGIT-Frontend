import React, { useState, useEffect } from "react";
import { Card, UploadFile, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { downloadPdfWithCustomName } from "../utils/downloadPDF";

const UploadedFileComponent = ({ config, onSelect }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage("property-upload", file, tenantId);
            if (response?.data?.files?.length > 0) {
              const uploaded = response?.data?.files[0];
              setUploadedFile(uploaded);

              // 🔹 Notify FormComposer
              if (config?.key) {
                const auditDetails = {
                  createdBy: user?.info?.uuid,
                  lastModifiedBy: user?.info?.uuid,
                  createdTime: timestamp,
                  lastModifiedTime: timestamp
                };
                console.log("999 onSelect",config.key,uploaded,response)
                onSelect(config.key, {...uploaded,auditDetails});
              }
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  function selectFile(e) {
    setFile(e.target.files[0]);
  }

  async function downloadFile() {
    if (!uploadedFile?.fileStoreId) return;
    try {
      const { data: { fileStoreIds } = {} } = await Digit.UploadServices.Filefetch([uploadedFile.fileStoreId], tenantId);
      const fileData = fileStoreIds?.[0];
      if (fileData?.url) {
        const fileNameWithoutExtension = (uploadedFile?.name || "downloaded_file").split(/\.(jpg|jpeg|png|pdf|xls|xlsx)/)[0];
        
        downloadPdfWithCustomName({
          fileStoreId: fileData?.id,
          customName: fileNameWithoutExtension,
        });

      }
    } catch (err) {
      setError(t("CS_FILE_DOWNLOAD_ERROR"));
    }
  }

  return (
    <Card>
      <UploadFile
        id={"simple-doc"}
        accept=".jpg,.png,.pdf,.xls,.xlsx"
        onUpload={selectFile}
        onDelete={() => {
          setUploadedFile(null);
          if (config?.key) onSelect(config.key, null); // 🔹 reset in form data
        }}
        message={uploadedFile ? `1 ${t("CS_ACTION_FILEUPLOADED")}` : t("CS_ACTION_NO_FILEUPLOADED")}
      />

      {uploadedFile && (
        <SubmitBar label={t("CS_ACTION_DOWNLOAD")} onSubmit={downloadFile} />
      )}

      {error && <p className="error">{error}</p>}
    </Card>
  );
};

export default UploadedFileComponent;
