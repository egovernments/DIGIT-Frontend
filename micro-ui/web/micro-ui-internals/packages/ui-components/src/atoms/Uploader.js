import React, { useEffect, useRef, useState, Fragment } from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";
import StringManipulator from "./StringManipulator";
import RemoveableTag from "./RemoveableTag";
import { SVG } from "./SVG";
import UploadPopup from "./UploadPopup";

const getRandomId = () => {
  return Math.floor((Math.random() || 1) * 139);
};

const Uploader = (props) => {
  const { t } = useTranslation();
  const inpRef = useRef();
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [buttonLabel, setButtonLabel] = useState("Upload");
  const [inputLabel, setInputLabel] = useState("");
  const [previews, setPreviews] = useState([]);
  const user_type = window?.Digit?.SessionStorage.get("userType");
  const [errors, setErrors] = useState([]);

  const handleFileUpload = (e) => {
    const files = props.variant === "uploadFile" ? e.target.files : e;
    const newErrors = [];

    if (files.length > 0) {
      const newFiles = props.multiple
        ? [...uploadedFiles, ...files]
        : [files[0]];

      setUploadedFiles(newFiles);
      setUploadedFilesCount(newFiles.length);
      setErrors([...errors, ...newErrors]);
    }
  };

  const handleButtonClick = () => {
    inpRef.current.click();
  };

  const handleFileRemove = (fileToRemove) => {
    const updatedFiles = uploadedFiles.filter((file) => file !== fileToRemove);
    setUploadedFiles(updatedFiles);
    setUploadedFilesCount(updatedFiles.length);
  };

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
        const preview = await generatePreview(file);
        previewsArray.push(preview);
      }
      setPreviews(previewsArray);
    };

    generatePreviews();

    return () => {
      // Clean up previews
      setPreviews([]);
    };
  }, [uploadedFiles]);

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

  const showHint = props?.showHint || false;

  const showLabel = props?.showLabel || false;

  const renderVariant = () => {
    switch (props.variant) {
      case "uploadPopup":
        return (
          <Fragment>
            <UploadPopup
              onSubmit={handleFileUpload}
              fileData={uploadedFiles}
              fileTypes={props.accept}
              uploadedFiles={uploadedFiles}
              onFileDelete={handleFileRemove}
              errors={errors}
            />
          </Fragment>
        );
      case "uploadFile":
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
                  className="digit-uploader-input"
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
                  return (
                    <RemoveableTag
                      key={index}
                      text={file?.name}
                      onClick={() => handleFileRemove(file)}
                    />
                  );
                })}
              </div>
            )}
            {props?.showAsPreview && (
              <div className="digit-img-container">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className={`preview-container ${
                      uploadedFilesCount > 1 ? " multiple" : ""
                    }`}
                  >
                    <img src={preview} alt={`Preview ${index}`} />
                    <span
                      onClick={() => handleFileRemove(uploadedFiles[index])}
                      className="digit-uploader-close-icon"
                    >
                      <SVG.Close
                        fill="#FFFFFF"
                        width={"16px"}
                        height={"16px"}
                        className="uploader-close"
                      />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Fragment>
        );
    }
  };

  return (
    <Fragment>
      <div className="digit-uploader-wrap">
        {showLabel && <p className="digit-upload-label">{t(props?.label)}</p>}
        {renderVariant()}
        {props.iserror && (
          <ErrorMessage
            message={StringManipulator(
              "toSentenceCase",
              StringManipulator("truncateString", t(props.iserror), {
                maxLength: 256,
              })
            )}
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

Uploader.propTypes = {
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
  onUpload: PropTypes.func.isRequired,
  removeTargetedFile: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  iserror: PropTypes.string,
  disabled: PropTypes.bool,
  inputStyles: PropTypes.object,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  id: PropTypes.string,
};

Uploader.defaultProps = {
  disableButton: false,
};

export default Uploader;
