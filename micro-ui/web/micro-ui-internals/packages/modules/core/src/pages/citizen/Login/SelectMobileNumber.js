import { InputCard, TextBlock, FieldV1, LinkLabel, LabelFieldPair, CardLabel } from "@egovernments/digit-ui-components";
import { ToggleSwitch } from "@egovernments/digit-ui-react-components";
import React, { useMemo, useState } from "react";

const SelectMobileNumber = ({ t, onSelect, mobileNumber, emailId, onMobileChange, onEmailChange, config, canSubmit, validationConfig, onConsentChange, enableUserPreferences, isWhatsAppEnabled }) => {
  const [isEmail, setIsEmail] = useState(emailId ? true : false);
  const [error, setError] = useState("");

  // WhatsApp consent state (only WhatsApp required)
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  // Show consent toggle only if both configs are enabled
  const showWhatsAppConsent = enableUserPreferences && isWhatsAppEnabled;

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const rawPattern = validationConfig?.pattern || "^[6-9][0-9]{9}$";
  const mobileNumberPattern = new RegExp(rawPattern);
  const maxLength = validationConfig?.maxLength || 10;
  const prefix = validationConfig?.prefix || "+91";

  const isEmailValid = useMemo(() => EMAIL_REGEX.test(emailId), [emailId]);
  const isMobileValid = useMemo(() => mobileNumberPattern.test(mobileNumber || ""), [mobileNumber, mobileNumberPattern]);

  const handleConsentToggle = () => {
    const newValue = !whatsappConsent;
    setWhatsappConsent(newValue);
    // Notify parent component of consent change
    if (onConsentChange) {
      onConsentChange(newValue);
    }
  };

  const handleSubmit = () => {
    if (isEmail) {
      if (!isEmailValid) {
        setError(t("ERR_INVALID_EMAIL"));
        return;
      }
      onSelect({ userName: emailId, whatsappConsent });
    } else {
      if (!isMobileValid) {
        setError(t("ERR_INVALID_MOBILE_NUMBER"));
        return;
      }
      onSelect({ mobileNumber, whatsappConsent });
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setError("");
    if (isEmail) {
      onEmailChange(e)
      if (value && !EMAIL_REGEX.test(value)) setError(t("ERR_INVALID_EMAIL"));
    } else {
      onMobileChange(e);
      if (value && !mobileNumberPattern.test(value)) setError(t("ERR_INVALID_MOBILE_NUMBER"));
    }
  };

  const switchMode = () => {
    setIsEmail(!isEmail);
    setError("");
    if (isEmail)
      onEmailChange({ target: { value: "" } });
    else
      onMobileChange({ target: { value: "" } }); // clear mobile input
  };

  const isDisabled = useMemo(() => {
    return isEmail ? !(isEmailValid && canSubmit) : !(isMobileValid && canSubmit);
  }, [isEmail, isEmailValid, isMobileValid, canSubmit]);

  const mobileViewStyles = {
    marginLeft: "0px",
    userSelect: "none",
    color: "inherit",
    cursor: "pointer",      // keeps it clickable
    textDecoration: "underline",
  };

  // Responsive label
  const linkLabel = useMemo(() => {
    if (window.innerWidth <= 768) {
      return isEmail ? t("LOGIN_WITH_MOBILE") : t("LOGIN_WITH_EMAIL");
    }
    return isEmail ? t("CS_USE_MOBILE_INSTEAD") : t("CS_LOGIN_REGISTER_WITH_EMAIL");
  }, [isEmail, t]);

  return (
    <InputCard
      t={t}
      texts={config?.texts}
      submit
      onNext={handleSubmit}
      isDisable={isDisabled}
    >
      <div>
        <FieldV1
          key={isEmail ? "email" : "mobile"}
          withoutLabel
          charCount
          error={error}
          onChange={handleChange}
          placeholder={isEmail ? t("ENTER_EMAIL_PLACEHOLDER") : t("ENTER_MOBILE_PLACEHOLDER")}
          populators={{
            name: isEmail ? "userName" : "mobileNumber",
            prefix: isEmail ? "" : prefix,
            validation: {
              maxlength: isEmail ? 256 : maxLength,
              pattern: isEmail ? EMAIL_REGEX : mobileNumberPattern,
            },
          }}
          props={{ fieldStyle: { width: "100%" } }}
          type="text"
          value={isEmail ? emailId : mobileNumber}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", marginTop: "-24px" }}>
        <LinkLabel style={{ display: "inline", ...mobileViewStyles }} onClick={switchMode}>
          {linkLabel}
        </LinkLabel>
      </div>

      {/* WhatsApp Consent Section - Only show if enabled */}
      {showWhatsAppConsent && (
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <LabelFieldPair style={{ marginBottom: "0.75rem" }}>
            <CardLabel className="user-profile" style={{ width: "60%", fontSize: "14px" }}>
              {t("CORE_COMMON_WHATSAPP_NOTIFICATIONS")}
            </CardLabel>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ToggleSwitch
                value={whatsappConsent}
                onChange={handleConsentToggle}
                name="whatsapp-consent"
                style={{ margin: "0px" }}
              />
              <span style={{ fontSize: "14px", color: "#505A5F" }}>
                {whatsappConsent ? t("CORE_COMMON_ENABLED") : t("CORE_COMMON_DISABLED")}
              </span>
            </div>
          </LabelFieldPair>
        </div>
      )}
    </InputCard>
  );
};

export default SelectMobileNumber;