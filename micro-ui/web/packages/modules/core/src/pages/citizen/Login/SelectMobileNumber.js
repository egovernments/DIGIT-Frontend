import { InputCard, TextBlock, FieldV1, LinkLabel } from "@egovernments/digit-ui-components";
import React, { useMemo, useState } from "react";

const SelectMobileNumber = ({ t, onSelect, mobileNumber,emailId, onMobileChange,onEmailChange, config, canSubmit }) => {
  const [isEmail, setIsEmail] = useState(emailId? true : false);
  const [error, setError] = useState("");

  const core_mobile_config = window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS") || {};
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const rawPattern = core_mobile_config?.mobileNumberPattern || "^\\d+$";
  const mobileNumberPattern = new RegExp(rawPattern);

  const isEmailValid = useMemo(() => EMAIL_REGEX.test(emailId), [emailId]);
  const isMobileValid = useMemo(() => mobileNumberPattern.test(mobileNumber || ""), [mobileNumber, mobileNumberPattern]);

  const handleSubmit = () => {
    if (isEmail) {
      if (!isEmailValid) {
        setError(t("ERR_INVALID_EMAIL"));
        return;
      }
      onSelect({ userName: emailId });
    } else {
      if (!isMobileValid) {
        setError(t("ERR_INVALID_MOBILE_NUMBER"));
        return;
      }
      onSelect({ mobileNumber });
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
    if(isEmail)
      onEmailChange({ target: { value: "" } });
    else
      onMobileChange({ target: { value: "" } }); // clear mobile input
  };

  const isDisabled = useMemo(() => {
    return isEmail ? !(isEmailValid && canSubmit) : !(isMobileValid && canSubmit);
  }, [isEmail, isEmailValid, isMobileValid, canSubmit]);

  const mobileViewStyles = {
    marginLeft:"0px",
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
            prefix: isEmail ? "" : core_mobile_config?.mobilePrefix,
            validation: {
              maxlength: isEmail ? 256 : (core_mobile_config?.mobileNumberLength || 10),
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
    </InputCard>
  );
};

export default SelectMobileNumber;