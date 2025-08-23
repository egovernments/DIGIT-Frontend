import React, { useState, useMemo, useEffect, useRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import { SVG } from "./SVG";
import { CustomSVG } from "./CustomSVG";
import ErrorMessage from "./ErrorMessage";
import AlertCard from "./AlertCard";
import { Colors} from "../constants/colors/colorconstants";

const UploadWidget = ({
  onSubmit,
  fileData,
  onFileDelete,
  errors,
  additionalElements,
  multiple,
  handleFileClick,
  showErrorCard,
  iserror,
  showDownloadButton,
  showReUploadButton,
  fileTypes,
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const types = fileTypes?.split(",");
  const [isMobileView, setIsMobileView] = React.useState(
    window.innerWidth <= 480
  );
  const onResize = () => {
    if (window.innerWidth <= 480) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("resize", onResize);
  
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const errorColor = Colors.lightTheme.alert.error;
  const primaryColor = Colors.lightTheme.paper.primary;
  const inputBorderColor = Colors.lightTheme.generic.inputBorder;
  const primaryTwo = Colors.lightTheme.primary[2];
  const disabledColor = Colors.lightTheme.text.disabled;


  const dragDropJSX = (
    <div
      className={`digit-uploader-content-uploadWidget ${iserror ? "error" : ""}`}
    >
      {
        <SVG.FileUpload
          width={isMobileView ? "48px" : "64px"}
          height={isMobileView ? "48px" : "64px"}
          fill={disabledColor}
        ></SVG.FileUpload>
      }
      <p className="drag-drop-text" style={{ margin: "0px", display: "flex" }}>
        {t("Drag and drop your file or ")}
        <div className="drag-drop-link">{t("Browse in my files")}</div>
      </p>
    </div>
  );

  const handleFileDelete = (fileToRemove) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
    onFileDelete(fileToRemove);
  };

  const handleFileDownload = async (file) => {
    try {
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(file);
      downloadLink.download = file.name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleReUpload = (fileToReupload) => {
    const filesAfterRemoval = files.filter((file) => file !== fileToReupload);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = fileTypes;
    fileInput.multiple = multiple;
    fileInput.style.display = "none";
    fileInput.addEventListener("change", (event) => {
      setFiles(filesAfterRemoval);
    });
    fileInput.addEventListener("change", (event) => {
      const newFiles = event?.target?.files;
      setFiles([...filesAfterRemoval, newFiles[0]]);
    });
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const handleChange = async (newFiles) => {
    const newlyUploadedFiles = multiple ? [...files, ...newFiles] : [newFiles];
    setFiles(newlyUploadedFiles);
  };

  useEffect(() => {
    onSubmit(files);
  }, [files,onSubmit]);

  const renderFileIcon = (fileType, fileErrors) => {
    switch (fileType) {
      case "application/pdf":
        return <CustomSVG.PdfFile className="uploadWidget-icon" />;
      case "image/png":
        return <CustomSVG.PngFile className="uploadWidget-icon" />;
      case "image/jpeg":
      case "image/pjpeg":
        return <CustomSVG.JpgFile className="uploadWidget-icon" />;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/excel":
      case "application/x-excel":
      case "application/x-msexcel":
        return <CustomSVG.XlsxFile className="uploadWidget-icon" />;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        return <CustomSVG.DocFile className="uploadWidget-icon" />;
      default:
        return (
          <SVG.File
            className="uploadWidget-icon"
            fill={fileErrors ? errorColor : inputBorderColor}
          />
        );
    }
  };

  const renderFileCards = useMemo(() => {
    return fileData?.map((file, index) => {
      const fileErrors = errors?.find((error) => error.file === file);

      return (
        <div
          className={`digit-uploaded-file-container ${
            fileErrors ? "error" : ""
          }`}
          style={{ display: "flex" }}
          key={index}
          role="listitem"
          aria-label={`Uploaded file: ${file?.name}`}
        >
          <div
            className="uploaded-file-container-sub"
            style={{ cursor: "pointer", display: "flex" }}
            onClick={() => {
              handleFileClick(index, file);
            }}
            role="button"
            tabIndex={0}
            aria-label={`View file: ${file?.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFileClick(index, file);
              }
            }}
          >
            {renderFileIcon(file?.type, fileErrors)}
            <div
              className={`uploaded-file-details ${fileErrors ? "error" : ""}`}
            >
              {file?.name}
              {fileErrors && !showErrorCard && (
                <ErrorMessage
                  message={fileErrors?.error}
                  truncateMessage={true}
                  maxLength={256}
                  className="digit-tag-error-message"
                  wrapperClassName="digit-tag-error"
                  showIcon={true}
                />
              )}
            </div>
          </div>
          {fileErrors && showErrorCard && (
            <AlertCard
              variant={"error"}
              text={fileErrors?.error}
              className={"uploadWidget-error-card"}
            />
          )}
          <div
            className={`digit-upload-and-download-button ${fileErrors?.error && showErrorCard ? "error-card" : "" }`}
            style={{ display: "flex" }}
            role="toolbar"
            aria-label={`Actions for file: ${file?.name}`}
          >
            {showReUploadButton && (
              <Button
                label={"Re-Upload"}
                variation="secondary"
                icon={"FileUpload"}
                type="button"
                onClick={() => handleReUpload(file)}
                size={isMobileView ? "small" : "medium"}
              />
            )}

            {showDownloadButton && (
              <Button
                label={"Download"}
                variation="secondary"
                icon={"FileDownload"}
                type="button"
                onClick={() => handleFileDownload(file)}
                size={isMobileView ? "small" : "medium"}
              />
            )}

            {additionalElements?.map((element, index) => (
              <div key={index}>{element}</div>
            ))}
          </div>
          <span
            className="digit-uploadWidget-close-icon"
            style={{ display: "flex" }}
            onClick={() => handleFileDelete(file)}
            role="button"
            tabIndex={0}
            aria-label={`Delete file: ${file?.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFileDelete(file);
              }
            }}
          >
            <SVG.Close
              fill={fileErrors ? primaryColor : primaryTwo}
              width={"24px"}
              height={"24px"}
              className="uploader-close"
            />
          </span>
        </div>
      );
    });
  }, [fileData, errors]);

  return (
    <React.Fragment>
      {((multiple === false && (!fileData || fileData?.length === 0)) ||
        multiple === true) && (
        <FileUploader
          multiple={multiple}
          handleChange={handleChange}
          name="file"
          types={types}
          children={dragDropJSX}
        />
      )}
      {fileData?.length > 0 && renderFileCards}
    </React.Fragment>
  );
};

export default UploadWidget;
