import React, { Fragment } from "react";
import { SVG } from "./SVG";
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
  return (
    <div className={`digit-checkbox-wrap ${!isLabelFirst ? "checkboxFirst" : "labelFirst"} ${disabled ? "disabled" : " "}`}>
      {isLabelFirst ? (
        <p className="label" style={{ maxWidth: "100%", width: "auto" }}>
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
            label
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
          <p className={`digit-custom-checkbox ${userType === "employee" ? "digit-custom-checkbox-emp" : ""}`}>
            <SVG.Check fill={disabled ? "#B1B4B6" : "#F47738"} />
          </p>
      </div>
      {!isLabelFirst ? (
        <p className="label" style={{ maxWidth: "100%", width: "100%" }}>
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
            label
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
