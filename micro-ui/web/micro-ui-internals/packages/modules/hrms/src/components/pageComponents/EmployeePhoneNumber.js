import React, { useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectEmployeePhoneNumber = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const [iserror, setError] = useState(false);
  let isMobile = window.Digit.Utils.browser.isMobile();

  const stateLvlTenantId = Digit.Utils.getMultiRootTenant() ? Digit.ULBService.getCurrentTenantId() : window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  const moduleName = Digit.Utils.getMultiRootTenant() ? "common-masters" : "commonUiConfig";

  const { data: validationData, isLoading: isMDMSLoading } = Digit.Hooks.useCustomMDMS(
    stateLvlTenantId,
    moduleName,
    [{ name: "UserValidation" }],
    {
      select: (data) => {
        const allItems = data?.[moduleName]?.UserValidation || [];
        return allItems.filter((x) => x.fieldType?.toLowerCase() === "mobile").map(item => ({
          prefix: item?.attributes?.prefix,
          pattern: item?.rules?.pattern,
          maxLength: item?.rules?.maxLength,
          minLength: item?.rules?.minLength,
          errorMessage: item?.rules?.errorMessage,
          isDefault: item?.default === true,
        }));
      },
      enabled: !!stateLvlTenantId,
    }
  );

  const mobileConfigs = validationData?.length > 0 ? validationData : (window?.Digit?.MDMSValidationPatterns?.mobileNumberValidation?.mobileConfigs || []);

  // Force a default if everything is empty
  const effectiveMobileConfigs = mobileConfigs.length > 0 ? mobileConfigs : [{ prefix: "+91", pattern: "^[6-9][0-9]{9}$", maxLength: 10, minLength: 10, isDefault: true }];

  const defaultConfig = effectiveMobileConfigs.find((x) => x.isDefault) || effectiveMobileConfigs[0];

  const activePrefix =
    formData?.SelectEmployeePhoneNumber?.countryCode ||
    (window?.Digit?.MDMSValidationPatterns?.mobileNumberValidation?.prefix) ||
    defaultConfig?.prefix ||
    "+91";

  const activeMaxLength = defaultConfig?.maxLength || window?.Digit?.MDMSValidationPatterns?.mobileNumberValidation?.maxLength || 10;
  const activeMinLength = defaultConfig?.minLength || window?.Digit?.MDMSValidationPatterns?.mobileNumberValidation?.minLength || 10;
  const activePattern = defaultConfig?.pattern || window?.Digit?.MDMSValidationPatterns?.mobileNumberValidation?.pattern;
  const activeErrorMsg = defaultConfig?.errorMessage || "CORE_COMMON_MOBILE_ERROR";

  const handlePrefixChange = (e) => {
    const chosen = effectiveMobileConfigs.find((c) => c.prefix === e.target.value) || defaultConfig;
    if (window.Digit && window.Digit.MDMSValidationPatterns) {
      window.Digit.MDMSValidationPatterns.mobileNumberValidation = { ...chosen };
    }
    onSelect(config.key, { ...formData[config.key], mobileNumber: "", countryCode: chosen.prefix });
    setError(false);
  };

  const inputValue = formData && formData[config.key] ? formData[config.key]["mobileNumber"] : "";

  function setValue(value) {
    const rawValue = value.replace(/\D/g, "");
    if (rawValue.length > activeMaxLength) return;
    onSelect(config.key, { ...formData[config.key], mobileNumber: rawValue, countryCode: activePrefix });
  }

  function validate(value) {
    if (activePattern && !new RegExp(activePattern).test(value)) {
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
                className={`field-container ${iserror ? "employee-card-input-error" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  border: iserror ? "1px solid #d4351c" : "1px solid #464646",
                  borderRadius: "2px",
                  overflow: "hidden",
                  backgroundColor: "#FFFFFF",
                  height: "40px",
                  width: "100%",
                  marginTop: "8px",
                }}
              >
                <div className="citizen-card-input--front" style={{ position: "relative", display: "flex", alignItems: "center", borderRight: "1px solid #d1d1d1", paddingRight: "0px", marginRight: "0px" }}>
                  <select
                    value={activePrefix}
                    onChange={handlePrefixChange}
                    style={{
                      border: "none",
                      padding: "0 28px 0 12px",
                      fontSize: "16px",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      outline: "none",
                      color: "#333",
                      fontWeight: "600",
                      width: "100%",
                      minWidth: "90px",
                      appearance: "none",
                      zIndex: 1,
                      height: "100%"
                    }}
                  >
                    {effectiveMobileConfigs.map((c) => (
                      <option key={c.prefix} value={c.prefix}>
                        {c.prefix}
                      </option>
                    ))}
                  </select>
                  <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 0 }}>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  className="citizen-card-input"
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
                    padding: "0 15px",
                    fontSize: "16px",
                    outline: "none",
                    color: "#0B0C0C",
                    backgroundColor: "transparent",
                    width: "100%",
                    height: "100%",
                    margin: "0",
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
