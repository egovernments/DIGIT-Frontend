import React, { useEffect, useRef, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";
import StringManipulator from "./StringManipulator";
import Chip from "./Chip";
import { SVG } from "./SVG";
import UploadWidget from "./UploadWidget";
import UploadImage from "./UploadImage";
import Button from "./Button";
import { Colors} from "../constants/colors/colorconstants";
import { CustomSVG } from "./CustomSVG";
import { getUserType } from "../utils/digitUtils";

const getRandomId = () => {
  return Math.floor((Math.random() || 1) * 139);
};

const FileUpload = (props) => {
  const { t } = useTranslation();
  const inpRef = useRef();
  const user_type = getUserType();
  const [buttonLabel, setButtonLabel] = useState("Upload");
  const [inputLabel, setInputLabel] = useState("");
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleFileUpload = async (e) => {
    const files = props.variant === "uploadField" ? e.target.files : e;
    const newErrors = [];
    if (files.length > 0) {
      const acceptedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { isValid, error } = validateFile(file, props);
        if (isValid) {
          acceptedFiles.push(file);
        } else {
          newErrors.push({ file, error });
        }
      }
      let newFiles;
      if (props.variant === "uploadImage" || props.variant === "uploadWidget") {
        newFiles = files;
      } else {
        newFiles = props?.multiple ? [...uploadedFiles, ...files] : [files[0]];
      }
      setUploadedFiles(newFiles);
      setUploadedFilesCount(newFiles.length);
      setErrors([...errors, ...newErrors]);
    }

    if (props?.onUpload) {
      const uploadResult = await props?.onUpload(uploadedFiles);
      if (uploadResult && uploadResult.length !== 0) {
        for (const { file, error } of uploadResult) {
          const fileIndex = newErrors.findIndex((item) => item.file === file);
          if (fileIndex !== -1) {
            newErrors[fileIndex].error = error;
          } else {
            newErrors.push({ file, error });
          }
        }
      }
    }
  };

  const validateFile = (file, props) => {
    let isValid = true;
    let error = "";
    const maxFileSize = props.validations?.maxSizeAllowedInMB;
    const minFileSize = props.validations?.minSizeRequiredInMB;
    const acceptedImageTypes = [
      "image/png",
      ".png",
      ".jpeg",
      ".jpg",
      "image/jpeg",
      "image/jpg",
    ];

    if (maxFileSize && Math.round(file?.size / 1024 / 1024) > maxFileSize) {
      isValid = false;
      error = "File size exceeds the maximum allowed size";
    } else if (
      minFileSize &&
      Math.round(file?.size / 1024 / 1024) < minFileSize
    ) {
      isValid = false;
      error = "File size is below the minimum required size";
    }

    if (
      props.variant === "uploadImage" &&
      !acceptedImageTypes.includes(file.type)
    ) {
      isValid = false;
      error = "File type is not accepted";
    }

    return { isValid, error };
  };

  const handleButtonClick = () => {
    inpRef.current.click();
  };

  const handleFileRemove = (fileToRemove) => {
    if (!Array.isArray(uploadedFiles)) {
      setUploadedFiles([]);
      setUploadedFilesCount(0);
      setErrors([]);
    } else {
      const updatedFiles = uploadedFiles.filter(
        (file) => file !== fileToRemove
      );
      const updatedErrors = errors.filter(
        (error) => error.file !== fileToRemove
      );
      setUploadedFiles(updatedFiles);
      setUploadedFilesCount(updatedFiles.length);
      setErrors(updatedErrors);
    }
    props?.removeTargetedFile && props?.removeTargetedFile(fileToRemove);
  };

  const handleFileDownload = (file) => {
    if (file && file?.url) {
      window.location.href = file?.url;
    }
  };

  const generatePreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        resolve(result);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const uploadFiles = async () => {
      if (props?.onUpload) {
        const uploadResult = await props?.onUpload(uploadedFiles);
        if (uploadResult && uploadResult.length !== 0) {
          setErrors((prevErrors) => {
            const newErrors = [];
            uploadResult.forEach(({ file, error }) => {
              const existingErrorIndex = prevErrors.findIndex((item) => item.file === file);
              if (existingErrorIndex !== -1) {
                prevErrors[existingErrorIndex].error = error; 
              } else {
                newErrors.push({ file, error }); 
              }
            });
            return [...prevErrors, ...newErrors];
          });
        }
      }
    };
    if (uploadedFiles.length > 0) {
      uploadFiles();
    }
  }, [uploadedFiles,props?.onUpload]);

  useEffect(() => {
    setButtonLabel(
      !props.multiple && uploadedFilesCount > 0 ? "Re-Upload" : "Upload"
    );
  }, [uploadedFilesCount, props.multiple]);

  useEffect(() => {
    setInputLabel(
      uploadedFilesCount !== 0 ? `${uploadedFilesCount} Uploaded` : ""
    );
  }, [uploadedFilesCount]);

  useEffect(() => {
    const generatePreviews = async () => {
      const previewsArray = [];
      for (const file of uploadedFiles) {
        if (file instanceof Blob) {
          const preview = await generatePreview(file);
          if (preview) {
            const fileErrors = errors.filter((error) => error.file === file);
            previewsArray.push({
              file,
              preview,
              error: fileErrors.length > 0 ? fileErrors[0].error : null,
            });
          } else {
            console.error("Failed to generate preview for:", file);
          }
        } else {
          const blob = new Blob([file], { type: file?.type });
          const preview = await generatePreview(blob);
          if (preview) {
            const fileErrors = errors.filter((error) => error.file === file);
            previewsArray.push({
              file,
              preview,
              error: fileErrors.length > 0 ? fileErrors[0].error : null,
            });
          } else {
            console.error("Failed to generate preview for:", file);
          }
          console.error("Invalid file object:", file);
        }
      }
      setPreviews(previewsArray);
    };

    generatePreviews();

    return () => {
      setPreviews([]);
    };
  }, [uploadedFiles]);

  const showHint = props?.showHint || false;

  const showLabel = props?.showLabel || false;

  const { fileUrl, fileName = "Unknown File" } = Digit.Hooks.useQueryParams();

  const changeToBlobAndCreateUrl = (file) => {
    if (!file) return null;
    const blob = new Blob([file], { type: file?.type });
    return URL.createObjectURL(blob);
  };

  const documents = fileUrl
    ? [{ uri: fileUrl, fileName }]
    : uploadedFiles.map((file) => ({
        uri: changeToBlobAndCreateUrl(file),
        fileName: file?.name || fileName,
      }));

  const handleFileClick = (index, file) => {
    const url = changeToBlobAndCreateUrl(file);
    window.open(url, "_blank");
  };

  const primaryColor = Colors.lightTheme.paper.primary;
  const errorColor = Colors.lightTheme.alert.error;

  const getFileUploadIcon = (fileType, isError) => {
    switch (fileType) {
      case "application/pdf":
        return (
          <CustomSVG.DocPdfUpload
            className={`digit-docupload-icon ${isError ? "error" : ""}`}
            styles={isError ? { border: "1px solid #B91900" } : {}}
            fill={isError ? errorColor : ""}
          />
        );
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/excel":
      case "application/x-excel":
      case "application/x-msexcel":
        return (
          <CustomSVG.DocXlsxUpload
            className={`digit-docupload-icon ${isError ? "error" : ""}`}
            styles={isError ? { border: "1px solid #B91900" } : {}}
            fill={isError ? errorColor : ""}
          />
        );
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        return (
          <CustomSVG.DocdocUpload
            className={`digit-docupload-icon ${isError ? "error" : ""}`}
            styles={isError ? { border: "1px solid #B91900" } : {}}
            fill={isError ? errorColor : ""}
          />
        );
      default:
        return (
          <CustomSVG.DocUpload
            className={`digit-docupload-icon ${isError ? "error" : ""}`}
            styles={isError ? { border: "1px solid #B91900" } : {}}
            fill={isError ? errorColor : ""}
          />
        );
    }
  };

  const renderVariant = () => {
    switch (props.variant) {
      case "uploadWidget":
        return (
          <Fragment>
            <UploadWidget
              onSubmit={handleFileUpload}
              fileData={uploadedFiles}
              fileTypes={props.accept}
              onFileDelete={handleFileRemove}
              errors={errors}
              additionalElements={props?.additionalElements}
              onFileDownload={handleFileDownload}
              documents={documents}
              handleFileClick={handleFileClick}
              showErrorCard={props?.showErrorCard}
              iserror={props?.iserror}
              showDownloadButton={props?.showDownloadButton}
              showReUploadButton={props?.showReUploadButton}
              multiple={props?.multiple}
            />
          </Fragment>
        );
      case "uploadImage":
        return (
          <Fragment>
            <UploadImage
              onSubmit={handleFileUpload}
              fileData={uploadedFiles}
              onFileDelete={handleFileRemove}
              errors={errors}
              multiple={props?.multiple}
              userType={user_type}
              previews={previews}
              uploadedFilesCount={uploadedFilesCount}
              documents={documents}
              handleFileClick={handleFileClick}
            />
          </Fragment>
        );
      case "uploadField":
      default:
        return (
          <Fragment>
            <div className="digit-uploader-content">
              <div
                className={`digit-upload ${
                  props?.customClass ? props?.customClass : ""
                } ${user_type === "employee" ? "" : "digit-upload-employee"} ${
                  props.disabled ? " disabled" : ""
                }`}
                style={props?.style}
              >
                <input
                  className={`digit-uploader-input ${
                    props.disabled ? " disabled" : ""
                  }`}
                  ref={inpRef}
                  type="file"
                  id={props.id || `document-${getRandomId()}`}
                  name="file"
                  multiple={props.multiple}
                  accept={props.accept}
                  disabled={props.disabled}
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <input
                  className={`digit-uploader-input ${
                    props?.iserror ? "error" : ""
                  }`}
                  type="text"
                  placeholder={"No File Selected"}
                  value={inputLabel}
                  readOnly
                />
              </div>
              <Button
                label={buttonLabel}
                style={{
                  height: "40px",
                  flexShrink: 0,
                  ...(props?.extraStyles ? props.extraStyles.buttonStyles : {}),
                  ...(props?.disableButton
                    ? {
                        opacity: 0.5,
                        cursor: "not-allowed",
                        pointerEvents: "none",
                      }
                    : {}),
                }}
                textStyles={props?.textStyles}
                type={props.buttonType}
                icon={"FileUpload"}
                variation={"secondary"}
                onClick={handleButtonClick}
              />
            </div>
            {props?.showAsTags && (
              <div className="digit-tag-container" style={{ marginTop: "0px" }}>
                {uploadedFiles?.map((file, index) => {
                  const fileErrors = errors.filter(
                    (error) => error.file === file
                  );
                  const isError = fileErrors.length > 0;
                  return (
                    <Chip
                      key={index}
                      hideClose={false}
                      text={file?.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileRemove(file);
                      }}
                      isErrorTag={isError}
                      error={fileErrors[0]?.error}
                      onTagClick={() => handleFileClick(index, file)}
                      onErrorClick={(e) => e.stopPropagation()}
                    />
                  );
                })}
              </div>
            )}
            {props?.showAsPreview && (
              <div className="digit-img-container">
                {uploadedFiles.map((file, index) => {
                  const fileErrors = errors.filter(
                    (error) => error.file === file
                  );
                  const isError = fileErrors.length > 0;

                  return (
                    <Fragment key={index}>
                      <div
                        className={`preview-container ${
                          uploadedFilesCount > 1 ? " multiple" : "single"
                        } ${file?.type.startsWith("image/") ? "imageFile" : ""} ${isError ? "error" : ""}`}
                      >
                        <div
                          onClick={() => {
                            handleFileClick(index, file);
                          }}
                        >
                          {file?.type.startsWith("image/") ? (
                            <img
                              src={previews[index]?.preview}
                              alt={`Preview ${index}`}
                            />
                          ) : (
                            getFileUploadIcon(file?.type, isError)
                          )}
                        </div>
                        <div
                          className={`overlay ${isError ? "error" : ""} ${props?.multiple ? "multiple" : "single"}`}
                          onClick={() => {
                            handleFileClick(index, file);
                          }}
                        ></div>
                        <div className="preview-file-name">
                          {file?.name && !isError ? file?.name : ""}
                        </div>
                        <span
                          onClick={(e) => {
                            handleFileRemove(file);
                          }}
                          className={`digit-uploader-close-icon ${
                            isError ? "error" : ""
                          }`}
                        >
                          <SVG.Close
                            fill={primaryColor}
                            width={"16px"}
                            height={"16px"}
                            className={`uploader-close ${
                              isError ? "error" : ""
                            }`}
                          />
                        </span>
                        {fileErrors[0]?.error && (
                          <ErrorMessage
                            message={fileErrors[0]?.error}
                            truncateMessage={true}
                            maxLength={256}
                            className="digit-tag-error-message"
                            wrapperClassName="digit-tag-error"
                            showIcon={true}
                          />
                        )}
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            )}
          </Fragment>
        );
    }
  };

  return (
    <Fragment>
      <div className={`digit-uploader-wrap ${props?.inline ? "inline" : ""} ${props?.iserror ? "error" : ""}`}>
        {showLabel && <p className="digit-upload-label">{t(props?.label)}</p>}
        {renderVariant()}
        {props?.iserror && (
          <ErrorMessage
            message={t(props?.iserror)}
            truncateMessage={true}
            maxLength={256}
            className="digit-tag-error-message"
            wrapperClassName="digit-tag-error"
            showIcon={true}
          />
        )}
        {showHint && (
          <p className="digit-upload-helptext">
            {StringManipulator(
              "toSentenceCase",
              StringManipulator("truncateString", t(props?.hintText), {
                maxLength: 256,
              })
            )}
          </p>
        )}
      </div>
    </Fragment>
  );
};

FileUpload.propTypes = {
  hintText: PropTypes.string,
  showHint: PropTypes.bool,
  label: PropTypes.string,
  showLabel: PropTypes.bool,
  showAsTags: PropTypes.bool,
  showAsPreview: PropTypes.bool,
  customClass: PropTypes.string,
  uploadedFiles: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object]))
  ),
  disableButton: PropTypes.bool,
  buttonType: PropTypes.string,
  onUpload: PropTypes.func,
  removeTargetedFile: PropTypes.func,
  onDelete: PropTypes.func,
  iserror: PropTypes.string,
  disabled: PropTypes.bool,
  inputStyles: PropTypes.object,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  id: PropTypes.string,
  showDownloadButton: PropTypes.bool,
  showReUploadButton: PropTypes.bool,
};

FileUpload.defaultProps = {
  disableButton: false,
};

export default FileUpload;
