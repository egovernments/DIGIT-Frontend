import React, { useState, useEffect } from "react";
import { FileUpload } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { downloadFileWithCustomName } from "../utils/downloadFileWithCustomName";
import { Button } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const UploadedFileComponent = ({ config, onSelect }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser();
  const timestamp = new Date().getTime();

  const { isLoading: isMaxFileSizeLoading, data: maxFileSizeData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "PGR",
    [{ name: "MaxFileSize" }],
    {
      select: (data) => {
        const maxFileSize = data?.PGR?.MaxFileSize?.[0]?.maxFileSize;
        return maxFileSize ? parseInt(maxFileSize) : 5242880;
      },
    },
    {
      schemaCode: "PGR.MaxFileSize",
      limit: 10,
      offset: 0,
    }
  );

  const maxFileSize = maxFileSizeData || 5242880;
  const maxFileSizeMB = (maxFileSize / 1048576).toFixed(0);

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        const validTypes = ["application/pdf", "image/jpeg", "image/jpg"];
        if (!validTypes.includes(file.type)) {
          setError(t(I18N_KEYS.COMPONENTS.CS_INVALID_FILE_TYPE));
          return;
        }

        if (file.size >= maxFileSize) {
          setError(`${t(I18N_KEYS.COMPONENTS.CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED)} (${t(I18N_KEYS.COMPONENTS.MAX_FILE_SIZE)}: ${maxFileSizeMB} MB)`);
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage("property-upload", file, tenantId);
            if (response?.data?.files?.length > 0) {
              const uploaded = response?.data?.files[0];
              setUploadedFile(uploaded);
              if (config?.key) {
                const auditDetails = {
                  createdBy: user?.info?.uuid,
                  lastModifiedBy: user?.info?.uuid,
                  createdTime: timestamp,
                  lastModifiedTime: timestamp,
                };
                onSelect(config.key, { ...uploaded, auditDetails });
              }
            } else {
              setError(t(I18N_KEYS.COMPONENTS.CS_FILE_UPLOAD_ERROR));
            }
          } catch (err) {
            if (err.message && err.message.includes("corrupt")) {
              setError(t(I18N_KEYS.COMPONENTS.CS_FILE_CORRUPTED_ERROR));
            } else {
              setError(t(I18N_KEYS.COMPONENTS.CS_FILE_UPLOAD_ERROR));
            }
          }
        }
      }
    })();
  }, [file, maxFileSize]);

  function selectFile(files) {
    if (files && files.length > 0) setFile(files[0]);
  }

  async function downloadFile() {
    if (!uploadedFile?.fileStoreId) return;

    try {
      const { data: { fileStoreIds } = {} } = await Digit.UploadServices.Filefetch([uploadedFile.fileStoreId], tenantId);
      const fileData = fileStoreIds?.[0];

      if (fileData?.url) {
        const originalName = uploadedFile?.name || "downloaded_file";
        const fileExtension = originalName.split(".").pop();
        const fileNameWithoutExtension = originalName.replace(`.${fileExtension}`, "");

        downloadFileWithCustomName({
          fileStoreId: fileData?.id,
          customName: fileNameWithoutExtension,
          fileUrl: fileData?.url,
          mimeType: uploadedFile?.mimeType || fileData?.mimeType,
        });
      }
    } catch (err) {
      console.error("Download error:", err);
      setError(t(I18N_KEYS.COMPONENTS.CS_FILE_DOWNLOAD_ERROR));
    }
  }

  return (
    <div className="pgr-upload-file-wrapper" style={{ maxWidth: "37.5rem" ,gap:"1.5rem",display:"flex",flexDirection:"column"}}>
      <FileUpload
        id={config?.key ? `upload-${config.key}` : "upload-doc"}
        variant="uploadField"
        accept=".pdf,.jpg,.jpeg"
        onUpload={selectFile}
        iserror={error || ""}
        removeTargetedFile={() => {
          setUploadedFile(null);
          setFile(null);
          setError(null);
          if (config?.key) onSelect(config.key, null);
        }}
      />
      {uploadedFile && (
        <Button
          label={t(I18N_KEYS.COMPONENTS.WBH_DOWNLOAD)}
          variation="secondary"
          type="button"
          size={"medium"}
          icon={"DownloadIcon"}
          onClick={downloadFile}
        />
      )}
    </div>
  );
};

export default UploadedFileComponent;
