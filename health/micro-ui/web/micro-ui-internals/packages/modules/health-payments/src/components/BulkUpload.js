import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { UploadIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Toast, CustomSVG, Button as ButtonNew } from "@egovernments/digit-ui-components";

const ACCEPTED_EXTENSIONS = [".xls", ".xlsx", ".csv"];

const BulkUpload = ({ multiple = false, onSubmit, fileData, onFileDelete, onFileDownload }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [fileUrl, setFileUrl] = useState(fileData?.[0]);
  const [showToast, setShowToast] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { XlsxFile } = CustomSVG;

  useEffect(() => {
    const fetchUrl = async () => {
      if (fileData?.[0]?.filestoreId) {
        const { data: { fileStoreIds: urls } = {} } = await Digit.UploadServices.Filefetch(
          [fileData[0].filestoreId],
          tenantId
        );
        setFileUrl({ ...fileData[0], url: urls?.[0]?.url });
      }
    };
    fetchUrl();
  }, [fileData]);

  const isValidFile = (file) => {
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    return ACCEPTED_EXTENSIONS.includes(ext);
  };

  const handleFiles = useCallback(
    (fileList) => {
      const filesArray = Array.from(fileList);
      const invalid = filesArray.find((f) => !isValidFile(f));
      if (invalid) {
        setShowToast({ key: "error", label: t("HCM_ERROR_INVALID_FILE_TYPE") });
        return;
      }
      onSubmit(filesArray);
    },
    [onSubmit, t]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const renderFileCards = useMemo(() => {
    return fileData?.map((file, index) => (
      <div className="uploaded-file-container" key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div className="uploaded-file-container-sub" style={{ cursor: "default", minWidth: 0, flex: 1 }}>
          <XlsxFile styles={{ width: "3rem", height: "3rem", flexShrink: 0 }} />
          <div style={{ marginLeft: "0.5rem", color: "#505A5F", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.filename}</div>
        </div>
        <div className="delete-and-download-button" style={{ flexShrink: 0 }}>
          <ButtonNew
            label={t("WBH_DOWNLOAD")}
            variation="secondary"
            type="button"
            size="medium"
            icon="DownloadIcon"
            onClick={(e) => {
              e.stopPropagation();
              onFileDownload(fileUrl || file);
            }}
          />
          <ButtonNew
            label={t("WBH_DELETE")}
            variation="secondary"
            size="medium"
            type="button"
            icon="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onFileDelete(file, index);
            }}
          />
        </div>
      </div>
    ));
  }, [fileData, fileUrl, t, onFileDelete, onFileDownload]);

  return (
    <React.Fragment>
      {(!fileData || fileData?.length === 0) && (
        <div
          className={`upload-drag-drop-container${isDragging ? " dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: "pointer" }}
        >
          <UploadIcon />
          <p className="drag-drop-text">
            <span className="drag-drop">{t("WBH_DRAG_DROP")}</span>{" "}
            <span className="browse-text">{t("WBH_BULK_BROWSE_FILES")}</span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            multiple={multiple}
            style={{ display: "none" }}
            onChange={handleInputChange}
          />
        </div>
      )}
      {fileData?.length > 0 && renderFileCards}
      {showToast && (
        <Toast
          label={showToast.label}
          type={showToast.key === "error" ? "error" : showToast.key === "info" ? "info" : "success"}
          isDleteBtn={true}
          onClose={() => setShowToast(null)}
        />
      )}
    </React.Fragment>
  );
};

export default BulkUpload;
