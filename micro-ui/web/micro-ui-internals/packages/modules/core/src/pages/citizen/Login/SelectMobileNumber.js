import {  ToggleSwitch, InputCard, TextBlock, FieldV1 } from "@egovernments/digit-ui-components";
import React, { useMemo, useState } from "react";

const SelectMobileNumber = ({ t, onSelect, showRegisterLink, mobileNumber, onMobileChange, config, canSubmit }) => {
  const [isEmail, setIsEmail] = useState(false);
  const [email, setEmail] = useState("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email), [email]);

  const handleSubmit = () => {
    if (isEmail) {
      onSelect({ userName: email });
    } else {
      onSelect({ mobileNumber });
    }
  };

  const core_mobile_config = window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS") || {};
  const isMobileValid = useMemo(() => mobileNumber && mobileNumber.length === core_mobile_config?.mobileNumberLength, [mobileNumber]);

  const isDisabled = useMemo(() => {
    return isEmail ? !(isEmailValid && canSubmit) : !(isMobileValid && canSubmit);
  }, [isEmail, isEmailValid, isMobileValid, canSubmit]);

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
        withoutLabel={true}
        charCount={true}
        onChange={isEmail ? (e) => setEmail(e.target.value) : onMobileChange}
        placeholder={isEmail ? t("ENTER_EMAIL_PLACEHOLDER") : t("ENTER_MOBILE_PLACEHOLDER")}
        populators={{
          name : isEmail ? "userName" : "mobileNumber",
          prefix: isEmail ? "" : core_mobile_config?.mobilePrefix,
          validation: {
            maxlength: isEmail ? 256 : (core_mobile_config?.mobileNumberLength || 10)
          }
        }}
        props={{
          fieldStyle: { width: "100%" }
        }}
        required
        type="text"
        value={isEmail ? email : mobileNumber}
      />
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", marginTop:"-24px" }}>
        <TextBlock body={t("CS_MOBILE_OR_EMAIL")}></TextBlock>
        <ToggleSwitch
          name="loginWithEmail"
          style={{ marginTop: "-1rem" }}
          value={isEmail}
          onChange={() => setIsEmail(!isEmail)}
          label={isEmail ? t("CS_USE_MOBILE_INSTEAD") : t("CS_LOGIN_REGISTER_WITH_EMAIL")}
        />
      </div>
    </InputCard>
  );
};

export default SelectMobileNumber;
