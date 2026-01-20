import React, { useState, useEffect } from "react";
import { UploadFile, SubmitBar, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Button, ActionBar } from "@egovernments/digit-ui-components";
import { set } from "lodash";

const UploadedFileComponent = ({ config, onSelect, value, isMandatory = false, mockFile }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const uploadedFiles = value || [];
  const [selectedFiles, setSelectedFiles] = useState([]); // pending
  const [isUploading, setIsUploading] = useState(false);

  const hasFiles =
    selectedFiles.length > 0 || uploadedFiles.length > 0;

  const [error, setError] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser();
  const timestamp = new Date().getTime();

  const MAX_FILES = 10; // Maximum number of files allowed
  const maxFileSize = 5242880; // Default to 5MB (5242880 bytes)
  const maxFileSizeMB = (maxFileSize / 1048576).toFixed(0); // Convert bytes to MB for display

  useEffect(() => {
    console.log("UploadFile mounted");
  }, []);
  const handleConfirmUpload = async () => {
    if (!selectedFiles.length) return;
    setIsUploading(true);
    setError(null);

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    for (const file of selectedFiles) {
      if (!validTypes.includes(file.type)) {
        setError(t("HCM_INVALID_FILE_TYPE"));
        setIsUploading(false);
        return;
      }

      if (file.size > maxFileSize) {
        setError(
          `${t("HCM_MAXIMUM_UPLOAD_SIZE_EXCEEDED")} (${maxFileSizeMB} MB)`
        );
        setIsUploading(false);
        return;
      }
    }

    try {
      const response = await Digit.UploadServices.MultipleFilesStorage(
        "mozhealthprod",
        selectedFiles,
        tenantId
      );

      const uploadedFilesResponse = response?.data?.files || [];
      const uploadedResults = uploadedFilesResponse.map((uploaded, index) => {
        const originalFile = selectedFiles[index];

        return {
          fileStoreId: uploaded.fileStoreId,
          tenantId: uploaded.tenantId,
          name: originalFile.name,
          mimeType: originalFile.type,
          size: originalFile.size,
          auditDetails: {
            createdBy: user?.info?.uuid,
            lastModifiedBy: user?.info?.uuid,
            createdTime: Date.now(),
            lastModifiedTime: Date.now(),
          },
        };
      });

      if (uploadedResults.length) {
        onSelect(config?.key, [...uploadedFiles, ...uploadedResults]);
      }

      setSelectedFiles([]);
    } catch (err) {
      setError(t("HCM_FILE_UPLOAD_ERROR"));
    } finally {
      setIsUploading(false);
    }
  };


  const onFileSelect = (e) => {
    const newSelectedFiles = Array.from(e.target.files);

    // clear the input immediately
    e.target.value = "";

    // Total file count validation
    const totalFilesCount =
      uploadedFiles.length + selectedFiles.length + newSelectedFiles.length;

    if (totalFilesCount > MAX_FILES) {
      setError(
        `${t("HCM_MAXIMUM_FILES_EXCEEDED")} (${MAX_FILES})`
      );
      return;
    }

    setError(null);
    setSelectedFiles(prev => [...prev, ...newSelectedFiles]);
  };


  const uploadFileTags = [
    // pending files
    ...selectedFiles.map(file => [
      file.name,
      { __pending: true, file }
    ]),

    // already uploaded files
    ...uploadedFiles.map(file => [
      file.name,
      file
    ])
  ];

  const removeTargetedFile = (fileObj) => {
    if (fileObj?.__pending) {
      setSelectedFiles(prev =>
        prev.filter(f => f !== fileObj.file)
      );
      return;
    }

    const updated = uploadedFiles.filter(
      f => f.fileStoreId !== fileObj.fileStoreId
    );
    onSelect(config?.key, updated);
  };
  const handleDelete1 = () => {
    // UploadFile internally calls this to reset input
    // Do NOT clear uploadedFiles here unless you want "clear all"
  };
  const handleClearAll = () => {
    // clear pending (not yet uploaded)
    setSelectedFiles([]);

    // clear uploaded files shown as tags
    onSelect(config?.key, []);

    setError(null);
  };
  return (
    <div className="pgr-upload-file-wrapper" style={{ maxWidth: "37.5rem" }}>
      <UploadFile
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        onUpload={onFileSelect}
        onDelete={handleDelete1}
        uploadedFiles={uploadFileTags}
        removeTargetedFile={removeTargetedFile}
      />


      <div style={{ paddingBottom: "3rem" }}>
        <p className="file-upload-status">
          {uploadedFiles.length === 0
            ? t("HCM_ACTION_NO_FILEUPLOADED")
            : `${uploadedFiles.length} ${t("HCM_ACTION_FILEUPLOADED")}`}
        </p>

        {error && (
          <p
            className="pgr-upload-error"
            style={{ marginTop: "0.5rem" }}
          >
            {error}
          </p>
        )}
        {isUploading && (

          <div className="label-pair" style={{ marginBottom: "0.5rem" }}>
            <span
              style={{
                backgroundColor: "#EFF8FF",
                color: "#0B4B66",
                padding: "0rem 0.5rem",
                borderRadius: "4px",
                fontWeight: "bold",
                display: "inline-flex",
                alignItems: "center",
                minWidth: "100px",
                height: "2.4rem",
                textAlign: "left",           //  aligns text to left
                justifyContent: "flex-start",//  aligns content to left
                gap: "0.3rem",               //  spacing between loader and text
              }}
            > <div className="small-loader-wrapper">
                <div className="scaled-loader">
                  <div style={{ transform: "scale(0.7)" }}>
                    <Loader />
                  </div>
                </div>
              </div>
              <span className="file-upload-status">
                {t("HCM_FILE_UPLOADING")}
              </span>
            </span>
          </div>
        )}
      </div>

      <ActionBar
        actionFields={[
          <Button
            label={t("HCM_CONFIRM_UPLOAD")}
            title={t("HCM_CONFIRM_UPLOAD")}
            onClick={handleConfirmUpload}
            type="button"
            variation="primary"
            style={{ minWidth: "14rem" }}
            isDisabled={!selectedFiles.length || isUploading}
          />,
          <Button
            label={t("HCM_CLEAR_UPLOADED_FILES")}
            title={t("HCM_CLEAR_UPLOADED_FILES")}
            onClick={handleClearAll}
            type="button"
            variation="secondary"
            style={{ minWidth: "14rem" }}
            isDisabled={
              isUploading ||
              (selectedFiles.length === 0 && uploadedFiles.length === 0)
            }
          />
        ]}
      />
    </div>
  );
};

export default UploadedFileComponent;