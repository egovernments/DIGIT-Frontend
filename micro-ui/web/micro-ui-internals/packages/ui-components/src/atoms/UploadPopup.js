import React, { useState, useMemo, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useTranslation } from "react-i18next";
import DocPreview from "./DocPreview";
import Button from "./Button";
import Toast from "./Toast";
import { SVG } from "./SVG";
import { PngFile, JpgFile, PdfFile, DocFile, XlsxFile } from "./svgindex";
import ErrorMessage from "./ErrorMessage";

const UploadPopup = ({
  multiple = true,
  onSubmit,
  fileData,
  onFileDelete,
  onFileDownload,
  fileTypes,
  errors
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [fileUrl, setFileUrl] = useState(fileData?.[0]);
  const [fileName, setFileName] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const types = fileTypes?.split(',');


  const [isMobileView, setIsMobileView] = React.useState(
    window.innerWidth / window.innerHeight <= 9 / 16
  );
  const onResize = () => {
    if (window.innerWidth / window.innerHeight <= 9 / 16) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      onResize();
    });
    return () => {
      window.addEventListener("resize", () => {
        onResize();
      });
    };
  });

  useEffect(() => {
    setFileUrl(fileData?.[0]);
  }, [fileData]);

  const documents = fileUrl
    ? [
        {
          fileType: "xlsx",
          fileName: "fileData?.fileName",
          uri: fileUrl?.url,
        },
      ]
    : null;

  const dragDropJSX = (
    <div className="digit-uploader-content-uploadpopup">
      {
        <SVG.FileUpload
          width={isMobileView ? "48px" : "64px"}
          height={isMobileView ? "48px" : "64px"}
          fill="#C5C5C5"
        ></SVG.FileUpload>
      }
      <p className="drag-drop-text" style={{ margin: "0px", display: "flex" }}>
        {"Drag and drop your file or"}
        <Button label={"Browse in my files"} variation={"link"} />
      </p>
    </div>
  );

  const handleFileDelete = (file) => {
    onFileDelete(file);
  };

  const handleFileDownload = async (file) => {
    onFileDownload(file);
  };

  const handleReUpload = () => {
    console.log("reupload");
  };

  const handleChange = async (newFiles) => {
    try {
      onSubmit([...newFiles]);
    } catch (error) {
      // Handle the validation error, you can display a message or take appropriate actions.
      setShowToast({ isError: true, label: error });
    }
  };

  const renderFileIcon = (fileType) => {
    switch (fileType) {
      case "application/pdf":
        return <PdfFile className="icon" />;
      case "image/png":
        return <PngFile className="icon" />;
      case "image/jpeg":
      case "image/pjpeg":
        return <JpgFile className="icon" />;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/excel":
      case "application/x-excel":
      case "application/x-msexcel":
        return <XlsxFile className="icon" />;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        return <DocFile className="icon" />;
      default:
        return <SVG.File className="icon" fill={"#505a5f"} />;
    }
  };

  const renderFileCards = useMemo(() => {
    return fileData?.map((file, index) => {
      const fileError = errors.find(error => error.file === file);
      return (
        <div className="digit-uploaded-file-container" key={index}>
          <span
            className="digit-uploadpopup-close-icon"
            style={{display:"flex"}}
            onClick={() => handleFileDelete(file)}
          >
            <SVG.Close
              fill="#0B4B66"
              width={"14px"}
              height={"14px"}
              className="uploader-close"
            />
          </span>
          <div
            className="uploaded-file-container-sub"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowPreview(true);
            }}
          >
            {renderFileIcon(file.type)}
            <div className="uploaded-file-details">{file.name}</div>
          </div>
          <div>
          {fileError ? (
            <ErrorMessage message={fileError.message} />
          ) : (
            null
          )}
          </div>
          <div
            className="digit-upload-and-download-button"
            style={{ display: "flex" }}
          >
            <Button
              label={"Re-Upload"}
              variation="secondary"
              icon={"FileUpload"}
              type="button"
              onClick={handleReUpload}
            />
            <Button
              label={"Download"}
              variation="secondary"
              icon={"FileDownload"}
              type="button"
              onButtonClick={() => handleFileDownload(file)}
            />
          </div>
        </div>
      );
    });
  }, [fileData, errors]);

  return (
    <React.Fragment>
      {(!fileData || fileData?.length === 0) && (
        <FileUploader
          multiple={multiple}
          handleChange={handleChange}
          name="file"
          types={types}
          children={dragDropJSX}
        />
      )}
      {fileData?.length > 0 && renderFileCards}
      {showPreview && <DocPreview file={fileUrl} />}
      {showToast && (
        <Toast
          label={showToast.label}
          error={showToast?.isError}
          isDleteBtn={true}
          onClose={() => setShowToast(null)}
        ></Toast>
      )}
    </React.Fragment>
  );
};

export default UploadPopup;
