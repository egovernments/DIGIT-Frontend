import React, { Fragment } from "react";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const CheckBox = ({
  onChange,
  label,
  value,
  disabled,
  ref,
  checked,
  inputRef,
  pageType,
  style,
  index,
  isLabelFirst,
  customLabelMarkup,
  ...props
}) => {
  const { t } = useTranslation();
  const userType = pageType || window?.Digit?.SessionStorage.get("userType");
  let styles = props.styles;

  const sentenceCaseLabel = StringManipulator("TOSENTENCECASE", label);

  return (
    <div
      className={`digit-checkbox-container ${
        !isLabelFirst ? "checkboxFirst" : "labelFirst"
      } ${disabled ? "disabled" : " "}`}
    >
      {isLabelFirst ? (
        <p className="label" style={{ maxWidth: "100%", width: "auto" ,marginRight:"0rem"}}>
          {customLabelMarkup ? (
            <>
              <span>{t("COMMON_CERTIFY_ONE")}</span>
              <br />
              <span>
                <b> {t("ES_COMMON_NOTE")}</b>
                {t("COMMON_CERTIFY_TWO")}
              </span>
            </>
          ) : (
            sentenceCaseLabel
          )}
        </p>
      ) : null}
      <div style={{ cursor: "pointer", display: "flex", position: "relative" }}>
        <input
          type="checkbox"
          className={`input ${userType === "employee" ? "input-emp" : ""}`}
          onChange={onChange}
          value={value || label}
          {...props}
          ref={inputRef}
          disabled={disabled}
          checked={checked}
        />
        <p
          className={`digit-custom-checkbox ${
            userType === "employee" ? "digit-custom-checkbox-emp" : ""
          }`}
        >
          <SVG.Check fill={disabled ? "#C5C5C5" : "#C84C0E"} />
        </p>
      </div>
      {!isLabelFirst ? (
        <p className="label" style={{ maxWidth: "100%", width: "100%",marginRight:"0rem" }}>
          {customLabelMarkup ? (
            <>
              <span>{t("COMMON_CERTIFY_ONE")}</span>
              <br />
              <span>
                <b> {t("ES_COMMON_NOTE")}</b>
                {t("COMMON_CERTIFY_TWO")}
              </span>
            </>
          ) : (
            sentenceCaseLabel
          )}
        </p>
      ) : null}
    </div>
  );
};

CheckBox.propTypes = {
  /**
   * CheckBox content
   */
  label: PropTypes.string.isRequired,
  /**
   * onChange func
   */
  onChange: PropTypes.func,
  /**
   * input ref
   */
  ref: PropTypes.func,
  userType: PropTypes.string,
};

CheckBox.defaultProps = {
  label: "Default",
  isLabelFirst: false,
  onChange: () => console.log("CLICK"),
  value: "",
  checked: false,
  ref: "ww",
  // pageType: "EMPLOYEE",
  index: 0,
};

export default CheckBox;
