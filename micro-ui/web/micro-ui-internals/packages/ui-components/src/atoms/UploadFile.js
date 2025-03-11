import React, { useEffect, useRef, useState, Fragment } from "react";
import PropTypes from "prop-types";
import ButtonSelector from "./ButtonSelector";
import { useTranslation } from "react-i18next";
import Chip from "./Chip";
import ErrorMessage from "./ErrorMessage";
import { getUserType } from "../utils/digitUtils";

const getRandomId = () => {
  return Math.floor((Math.random() || 1) * 139);
};

const UploadFile = (props) => {
  const { t } = useTranslation();
  const inpRef = useRef();
  const [hasFile, setHasFile] = useState(false);
  const [prevSate, setprevSate] = useState(null);
  const user_type = getUserType();
  const handleChange = () => {
    if (inpRef.current.files[0]) {
      setHasFile(true);
      setprevSate(inpRef.current.files[0]);
    } else setHasFile(false);
  };

  const handleDelete = () => {
    inpRef.current.value = "";
    props.onDelete();
  };

  const handleEmpty = () => {
    if (inpRef.current.files.length <= 0 && prevSate !== null) {
      inpRef.current.value = "";
      props.onDelete();
    }
  };

  if (props.uploadMessage && inpRef.current.value) {
    handleDelete();
    setHasFile(false);
  }

  useEffect(() => handleEmpty(), [inpRef?.current?.files]);

  useEffect(() => handleChange(), [props.message]);

  const showHint = props?.showHint || false;

  return (
    <Fragment>
      {showHint && <p className="digit-cell-text">{t(props?.hintText)}</p>}
      <div
        className={`digit-upload-file ${props?.customClass ? props?.customClass : ""} ${
          user_type === "employee" ? "" : "digit-upload-file-max-width"
        } ${props.disabled ? " disabled" : ""}`}
        style={props?.style}
      >
        <div className="digit-upload-file-button-wrap">
          <ButtonSelector
            theme="border"
            label={t("CS_COMMON_CHOOSE_FILE")}
            style={{ ...(props?.extraStyles ? props?.extraStyles?.buttonStyles : {}), ...(!props?.enableButton ? { opacity: 0.5 } : {}) }}
            textStyles={props?.textStyles}
            type={props.buttonType}
          />
          {props?.uploadedFiles?.map((file, index) => {
            const fileDetailsData = file[1];
            return (
              <div className="digit-tag-container">
                <Chip
                  key={index}
                  hideClose={false}
                  text={file[0].length > 64 ? `${file[0].slice(0, 64)} ...` : file[0]}
                  onClick={(e) => props?.removeTargetedFile(fileDetailsData, e)}
                />
              </div>
            );
          })}
          {props?.uploadedFiles.length === 0 && <h2 className="digit-file-upload-status">{props.message}</h2>}
        </div>
        <input
          className={props.disabled ? "disabled" : "" + "digit-input-mirror-selector-button"}
          ref={inpRef}
          type="file"
          id={props.id || `document-${getRandomId()}`}
          name="file"
          multiple={props.multiple}
          accept={props.accept}
          disabled={props.disabled}
          onChange={(e) => props.onUpload(e)}
          onClick={(event) => {
            if (!props?.enableButton) {
              event.preventDefault();
            } else {
              const { target = {} } = event || {};
              target.value = "";
            }
          }}
        />
      </div>
      {props.iserror && <ErrorMessage message={props.iserror} />}
      {props?.showHintBelow && <p className="digit-cell-text">{t(props?.hintText)}</p>}
    </Fragment>
  );
};
UploadFile.propTypes = {
  hintText: PropTypes.string,
  customClass: PropTypes.string,
  uploadedFiles: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object]))),
  enableButton: PropTypes.bool,
  showHint: PropTypes.bool,
  buttonType: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
  removeTargetedFile: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  iserror: PropTypes.string,
  showHintBelow: PropTypes.bool,
  message: PropTypes.string,
  disabled: PropTypes.bool,
  inputStyles: PropTypes.object,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  id: PropTypes.string,
};

export default UploadFile;
