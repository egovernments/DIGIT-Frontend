import { FormStep, CardLabelError, CardLabel } from "@egovernments/digit-ui-components";
import React, { useState, useEffect, useMemo } from "react";

const SelectMobileNumber = ({ t, onSelect, showRegisterLink, mobileNumber, onMobileChange, config, canSubmit }) => {
  const stateId = Digit.Utils.getMultiRootTenant()
    ? Digit.ULBService.getCurrentTenantId()
    : window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  const moduleName = "common-masters";

  // Fetch mobile validation config from MDMS
  const { isLoading, data: mdmsData } = Digit.Hooks.useCustomMDMS(
    stateId,
    moduleName,
    [{ name: "UserValidation" }],
    {
      select: (data) => {
        const allValidations = data?.[moduleName]?.UserValidation || [];

        const allConfigs = allValidations.map((item) => ({
          fieldType: item.fieldType,
          prefix: item.attributes?.prefix || "+91",
          pattern: item.rules?.pattern || "^[6-9][0-9]{9}$",
          maxLength: item.rules?.maxLength || 10,
          minLength: item.rules?.minLength || 10,
          errorMessage: item.rules?.errorMessage || "CS_COMMON_MOBILE_ERROR",
          allowedStartingCharacters: item.rules?.allowedStartingCharacters,
          isActive: item.isActive,
        }));

        const defaultConfig = allConfigs[0] || {
          prefix: "+91",
          pattern: "^[6-9][0-9]{9}$",
          maxLength: 10,
          minLength: 10,
          errorMessage: "CS_COMMON_MOBILE_ERROR",
          allowedStartingCharacters: ["6", "7", "8", "9"],
        };

        return { defaultConfig, allConfigs };
      },
      staleTime: 300000,
      enabled: !!stateId,
    }
  );

  const globalConfig = window?.globalConfigs?.getConfig?.("CORE_MOBILE_CONFIGS") || {};

  const validationRules = useMemo(() => {
    const mdmsDefault = mdmsData?.defaultConfig || {};
    return {
      allowedStartingCharacters:
        globalConfig?.mobileNumberAllowedStartingCharacters || mdmsDefault?.allowedStartingCharacters || ["6", "7", "8", "9"],
      prefix: globalConfig?.mobilePrefix || mdmsDefault?.prefix || "+91",
      pattern: globalConfig?.mobileNumberPattern || mdmsDefault?.pattern || "^[6-9][0-9]{9}$",
      minLength: globalConfig?.mobileNumberLength || mdmsDefault?.minLength || 10,
      maxLength: globalConfig?.mobileNumberLength || mdmsDefault?.maxLength || 10,
      errorMessage: globalConfig?.mobileNumberErrorMessage || mdmsDefault?.errorMessage || "CS_COMMON_MOBILE_ERROR",
    };
  }, [mdmsData, globalConfig]);

  const allValidationConfigs = mdmsData?.allConfigs || [];

  const [selectedPrefix, setSelectedPrefix] = useState(validationRules.prefix);
  const [error, setError] = useState("");

  // Get active config based on selected prefix
  const activeConfig = useMemo(() => {
    return allValidationConfigs.find((c) => c.prefix === selectedPrefix) || validationRules;
  }, [selectedPrefix, allValidationConfigs, validationRules]);

  const maxLength = activeConfig?.maxLength || 10;
  const minLength = activeConfig?.minLength || 10;

  const allPrefixes = useMemo(() => {
    if (allValidationConfigs?.length > 0) {
      return allValidationConfigs.map((c) => c.prefix);
    }
    return [validationRules.prefix];
  }, [allValidationConfigs, validationRules]);

  useEffect(() => {
    if (validationRules?.prefix) {
      setSelectedPrefix(validationRules.prefix);
    }
  }, [validationRules?.prefix]);

  const handlePrefixChange = (e) => {
    setSelectedPrefix(e.target.value);
    setError("");
    onMobileChange({ target: { value: "" } });
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= maxLength) {
      setError("");
      onMobileChange({ target: { value: val } });
    }
  };

  const handleSubmit = (data) => {
    const errorMessage = activeConfig?.errorMessage || validationRules?.errorMessage || "CS_COMMON_MOBILE_ERROR";

    if (!mobileNumber) {
      setError(t("CS_COMMON_MOBILE_REQUIRED"));
      return;
    }
    if (mobileNumber.length < minLength || mobileNumber.length > maxLength) {
      setError(t(errorMessage));
      return;
    }
    const allowedChars = activeConfig?.allowedStartingCharacters || validationRules?.allowedStartingCharacters;
    if (allowedChars?.length > 0 && !allowedChars.includes(mobileNumber[0])) {
      setError(t(errorMessage));
      return;
    }
    const pattern = activeConfig?.pattern || validationRules?.pattern || `^[6-9][0-9]{${minLength - 1}}$`;
    const regex = new RegExp(pattern);
    if (!regex.test(mobileNumber)) {
      setError(t(errorMessage));
      return;
    }

    setError("");
    onSelect({ mobileNumber, prefix: selectedPrefix });
  };

  const isMobileValid = mobileNumber.length >= minLength && mobileNumber.length <= maxLength;

  // Strip inputs from config so FormStep doesn't render its own TextInput
  const modifiedConfig = useMemo(() => {
    return { ...config, inputs: [] };
  }, [config]);

  return (
    <FormStep
      isDisabled={!(isMobileValid && canSubmit) || isLoading}
      onSelect={handleSubmit}
      config={modifiedConfig}
      t={t}
      childrenAtTheBottom={false}
    >
      <CardLabel>{t("CORE_COMMON_MOBILE_NUMBER")}</CardLabel>
      <div
        className="field-container"
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #000000",
          borderRadius: "4px",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
        }}
      >
        <select
          value={selectedPrefix}
          onChange={handlePrefixChange}
          style={{
            border: "none",
            borderRight: "1px solid #000000",
            padding: "10px 8px",
            fontSize: "16px",
            backgroundColor: "#EEEEEE",
            cursor: "pointer",
            outline: "none",
            color: "#0B0C0C",
            fontWeight: "500",
            minWidth: "75px",
            appearance: "auto",
          }}
        >
          {allPrefixes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input
          type="text"
          value={mobileNumber}
          onChange={(e) => handleMobileChange(e)}
          placeholder={t("CS_COMMON_MOBILE_PLACEHOLDER")}
          maxLength={maxLength}
          style={{
            flex: 1,
            border: "none",
            padding: "10px 12px",
            fontSize: "16px",
            outline: "none",
            color: "#0B0C0C",
            backgroundColor: "transparent",
          }}
        />
      </div>
      {error && <CardLabelError style={{ fontSize: "14px", marginTop: "8px" }}>{error}</CardLabelError>}
    </FormStep>
  );
};

export default SelectMobileNumber;
