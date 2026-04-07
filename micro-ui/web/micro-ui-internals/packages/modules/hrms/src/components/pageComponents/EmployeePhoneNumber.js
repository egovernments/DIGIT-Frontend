import React, { useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectEmployeePhoneNumber = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const [iserror, setError] = useState(false);
  let isMobile = window.Digit.Utils.browser.isMobile();

  const validationConfig = config?.validationConfig || {};
  const mobileConfigs = validationConfig.mobileConfigs || [];
  const defaultOption = validationConfig.defaultConfig || {};

  const [selectedMobileConfig, setSelectedMobileConfig] = useState(() => {
    return defaultOption;
  });

  const activePrefix = selectedMobileConfig?.prefix || "+91";
  const mobilePatternRaw = selectedMobileConfig?.pattern || "^[6-9][0-9]{9}$";
  const activePatternRaw = new RegExp(mobilePatternRaw);
  const activeMaxLength = selectedMobileConfig?.maxLength || 10;
  const activeMinLength = selectedMobileConfig?.minLength || 10;
  const activeErrorMsg = selectedMobileConfig?.errorMessage || "CORE_COMMON_MOBILE_ERROR";

  const handlePrefixChange = (e) => {
    const chosen = mobileConfigs.find((c) => c.prefix === e.target.value) || defaultOption;
    setSelectedMobileConfig(chosen);

    // Update global state which is used by parent to run regex on submit (as written in createEmployee.js/EditForm.js)
    if (window.Digit && window.Digit.MDMSValidationPatterns) {
      window.Digit.MDMSValidationPatterns.mobileNumberValidation = {
        prefix: chosen.prefix,
        pattern: chosen.pattern,
        maxLength: chosen.maxLength,
        minLength: chosen.minLength,
        errorMessage: chosen.errorMessage
      };
    }

    // Clear out value on prefix change
    onSelect(config.key, { ...formData[config.key], mobileNumber: "", countryCode: chosen.prefix.replace("+", "") });
    setError(false);
  };

  const inputValue = formData && formData[config.key] ? formData[config.key]["mobileNumber"] : "";

  function setValue(value) {
    const rawValue = value.replace(/\D/g, "");
    if (rawValue.length > activeMaxLength) return;
    onSelect(config.key, { ...formData[config.key], mobileNumber: rawValue, countryCode: activePrefix.replace("+", "") });
  }

  function validate(value) {
    if (!activePatternRaw.test(value)) {
      setError(true);
    } else {
      setError(false);
    }
  }

  return (
    <div>
      <React.Fragment>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">
            {t("HR_MOB_NO_LABEL")} *
          </CardLabel>
          <div className="field-container" style={{ width: isMobile ? "100%" : "50%", display: "block" }}>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: iserror ? "2px solid #d4351c" : "1px solid #464646",
                  overflow: "hidden",
                  backgroundColor: "#FFFFFF",
                  boxSizing: "border-box",
                  height: "2.5rem",
                  width: "100%",
                  maxWidth: "100%",
                  marginTop: "8px"
                }}
              >
                {mobileConfigs.length > 1 ? (
                  <select
                    value={activePrefix}
                    onChange={handlePrefixChange}
                    style={{
                      border: "none",
                      borderRight: iserror ? "2px solid #d4351c" : "1px solid #464646",
                      padding: "0 8px",
                      fontSize: "16px",
                      backgroundColor: "#EEEEEE",
                      cursor: "pointer",
                      outline: "none",
                      color: "#0B0C0C",
                      fontWeight: "500",
                      minWidth: "75px",
                      height: "100%",
                      appearance: "auto",
                    }}
                  >
                    {mobileConfigs.map((c) => (
                      <option key={c.prefix} value={c.prefix}>
                        {c.prefix}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    style={{
                      padding: "0 10px",
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#0B0C0C",
                      borderRight: iserror ? "2px solid #d4351c" : "1px solid #464646",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#EEEEEE",
                    }}
                  >
                    {activePrefix}
                  </span>
                )}
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValue || ""}
                  onChange={(e) => {
                    setValue(e.target.value);
                    validate(e.target.value);
                  }}
                  onBlur={(e) => validate(e.target.value)}
                  placeholder=""
                  maxLength={activeMaxLength}
                  minLength={activeMinLength}
                  style={{
                    flex: 1,
                    border: "none",
                    padding: "0 12px",
                    fontSize: "16px",
                    outline: "none",
                    color: "#0B0C0C",
                    backgroundColor: "transparent",
                    height: "100%",
                    width: "100%",
                    minWidth: "0",
                  }}
                />
              </div>
              <div>{iserror ? <CardLabelError style={{ width: "100%" }}>{t(activeErrorMsg)}</CardLabelError> : null}</div>
            </div>
          </div>
        </LabelFieldPair>
      </React.Fragment>
    </div>
  );
};

export default SelectEmployeePhoneNumber;
