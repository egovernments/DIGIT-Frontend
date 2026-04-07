import { InputCard, FieldV1, LinkLabel } from "@egovernments/digit-ui-components";
import { CheckBox } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useMemo, useState, useEffect } from "react";

const SelectMobileNumber = ({
  t,
  onSelect,
  mobileNumber,
  emailId,
  onMobileChange,
  onEmailChange,
  config,
  canSubmit,
  validationConfig,
  allValidationConfigs,
  onConsentChange,
  enableUserPreferences,
}) => {
  const [isEmail, setIsEmail] = useState(emailId ? true : false);
  const [error, setError] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  const showWhatsAppConsent = enableUserPreferences;

  // ── mobile-only configs from MDMS ──────────────────────────────────────────
  const mobileConfigs = useMemo(() => {
    const all = Array.isArray(allValidationConfigs) ? allValidationConfigs : [];
    return all.filter((c) => c.fieldType === "mobile");
  }, [allValidationConfigs]);

  const defaultConfig = useMemo(() => {
    return mobileConfigs.find((c) => c.isDefault) || mobileConfigs[0] || validationConfig || {};
  }, [mobileConfigs, validationConfig]);

  const [selectedConfig, setSelectedConfig] = useState(defaultConfig);

  // Sync when MDMS data arrives asynchronously
  useEffect(() => {
    if (defaultConfig && defaultConfig.prefix && !selectedConfig?.prefix) {
      setSelectedConfig(defaultConfig);
    }
  }, [defaultConfig]);

  // ── active rules from selected config ─────────────────────────────────────
  const activeConfig = selectedConfig || validationConfig || {};
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const rawPattern = activeConfig?.pattern || "^[6-9][0-9]{9}$";
  const mobilePattern = useMemo(() => new RegExp(rawPattern), [rawPattern]);
  const maxLength = activeConfig?.maxLength || 10;
  const prefix = activeConfig?.prefix || "+91";
  const activeErrorMsg = activeConfig?.errorMessage || "ERR_INVALID_MOBILE_NUMBER";

  const isEmailValid = useMemo(() => EMAIL_REGEX.test(emailId), [emailId]);
  const isMobileValid = useMemo(() => mobilePattern.test(mobileNumber || ""), [mobileNumber, mobilePattern]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const handleConsentToggle = () => {
    const next = !whatsappConsent;
    setWhatsappConsent(next);
    if (onConsentChange) onConsentChange(next);
  };

  const handleSubmit = () => {
    if (isEmail) {
      if (!isEmailValid) { setError(t("ERR_INVALID_EMAIL")); return; }
      onSelect({ userName: emailId, whatsappConsent });
    } else {
      if (!isMobileValid) { setError(t(activeErrorMsg)); return; }
      const prefixStr = selectedConfig?.prefix || prefix;
      onSelect({ mobileNumber, countryCode: prefixStr, whatsappConsent });
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setError("");
    onEmailChange(e);
    if (value && !EMAIL_REGEX.test(value)) setError(t("ERR_INVALID_EMAIL"));
  };

  const handleMobileInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length > maxLength) return;
    setError("");
    onMobileChange({ target: { value: raw } });
    if (raw && !mobilePattern.test(raw)) setError(t(activeErrorMsg));
  };

  const handlePrefixChange = (e) => {
    const chosen = mobileConfigs.find((c) => c.prefix === e.target.value) || selectedConfig;
    setSelectedConfig(chosen);
    setError("");
    onMobileChange({ target: { value: "" } });
  };

  const switchMode = () => {
    setIsEmail(!isEmail);
    setError("");
    if (isEmail) onEmailChange({ target: { value: "" } });
    else onMobileChange({ target: { value: "" } });
  };

  const isDisabled = useMemo(
    () => (isEmail ? !(isEmailValid && canSubmit) : !(isMobileValid && canSubmit)),
    [isEmail, isEmailValid, isMobileValid, canSubmit]
  );

  const mobileViewStyles = {
    marginLeft: "0px",
    userSelect: "none",
    color: "inherit",
    cursor: "pointer",
    textDecoration: "underline",
  };

  const linkLabel = useMemo(() => {
    if (window.innerWidth <= 768)
      return isEmail ? t("LOGIN_WITH_MOBILE") : t("LOGIN_WITH_EMAIL");
    return isEmail ? t("CS_USE_MOBILE_INSTEAD") : t("CS_LOGIN_REGISTER_WITH_EMAIL");
  }, [isEmail, t]);

  // Show inline prefix select only in mobile mode with > 1 option
  const showPrefixSelect = !isEmail && mobileConfigs.length > 1;

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <InputCard t={t} texts={config?.texts} submit onNext={handleSubmit} isDisable={isDisabled}>

      {/* ── Mobile input with embedded prefix select ─────────────────────── */}
      <div className="input-field-wrapper" style={{ marginBottom: "0" }}>
        {!isEmail ? (
          <>
            {/* Custom combined [prefix select | number input] in one box */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: error ? "2px solid #d4351c" : "1px solid #464646",
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
                boxSizing: "border-box",
                height: "2.5rem",
                width: "100%",
              }}
            >
              {/* Prefix: dropdown when multiple options, static span when only one */}
              {showPrefixSelect ? (
                <select
                  value={selectedConfig?.prefix || prefix}
                  onChange={handlePrefixChange}
                  style={{
                    border: "none",
                    borderRight: error ? "2px solid #d4351c" : "1px solid #464646",
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
                    borderRight: error ? "2px solid #d4351c" : "1px solid #464646",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#EEEEEE",
                    whiteSpace: "nowrap",
                  }}
                >
                  {prefix}
                </span>
              )}

              {/* Number input */}
              <input
                type="text"
                inputMode="numeric"
                value={mobileNumber}
                onChange={handleMobileInput}
                placeholder={t("ENTER_MOBILE_PLACEHOLDER")}
                maxLength={maxLength}
                style={{
                  flex: 1,
                  border: "none",
                  padding: "0 12px",
                  fontSize: "16px",
                  outline: "none",
                  color: "#0B0C0C",
                  backgroundColor: "transparent",
                  height: "100%",
                  minWidth: "0",
                }}
              />

              {/* Character count — mirrors FieldV1 behaviour */}
              <span
                style={{
                  padding: "0 8px",
                  fontSize: "12px",
                  color: "#6f777b",
                  whiteSpace: "nowrap",
                }}
              >
                {(mobileNumber || "").length}/{maxLength}
              </span>
            </div>

            {/* Inline error message */}
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "4px",
                  color: "#d4351c",
                  fontSize: "14px",
                }}
              >
                <span>&#x26A0;</span>
                <span>{error}</span>
              </div>
            )}
          </>
        ) : (
          /* ── Email input — unchanged FieldV1 ─────────────────────────── */
          <FieldV1
            key="email"
            withoutLabel
            charCount
            error={error}
            onChange={handleEmailChange}
            placeholder={t("ENTER_EMAIL_PLACEHOLDER")}
            populators={{
              name: "userName",
              prefix: "",
              validation: {
                maxlength: 256,
                pattern: EMAIL_REGEX,
              },
            }}
            props={{ fieldStyle: { width: "100%" } }}
            type="text"
            value={emailId}
          />
        )}
      </div>

      <div style={{ marginTop: isEmail ? "-3rem" : "0.5rem" }}>
        {showWhatsAppConsent && (
          <CheckBox
            onChange={handleConsentToggle}
            checked={whatsappConsent}
            label={t("CORE_COMMON_WHATSAPP_NOTIFICATIONS")}
            styles={{ display: "flex", alignItems: "center", textTransform: "capitalize" }}
          />
        )}
        <LinkLabel style={{ display: "inline", ...mobileViewStyles }} onClick={switchMode}>
          {linkLabel}
        </LinkLabel>
      </div>
    </InputCard>
  );
};

export default SelectMobileNumber;