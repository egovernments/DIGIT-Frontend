import React from "react";
import { Button } from "@egovernments/digit-ui-components";

const EmployeeSSOLoginOptions = ({ t, props }) => {
  const { ssoConfigs = [] } = props || {};

  if (!ssoConfigs?.length) {
    return null;
  }

  const hasMultipleOptions = ssoConfigs.length > 1;

  return (
    <div className="employee-login-sso">
      <div className="employee-login-sso-divider">
        <span>{hasMultipleOptions ? t("CORE_COMMON_OR_SIGN_IN_WITH") : t("CORE_COMMON_OR")}</span>
      </div>
      {hasMultipleOptions ? (
        <div className="employee-login-sso-icons">
          {ssoConfigs.map((sso, index) => (
            <Button
              key={sso.id || sso.provider || index}
              label=""
              variation="secondary"
              size="large"
              icon={sso.icon}
              className={`employee-login-sso-icon ${sso.provider?.toLowerCase() || "provider"}-login-icon`}
              onClick={() => sso.onLogin?.(sso)}
              title={t(sso.label)}
              ariaLabel={t(sso.label)}
              style={{width:"100%"}}
            />
          ))}
        </div>
      ) : (
        ssoConfigs.map((sso, index) => (
          <Button
            key={sso.id || sso.provider || index}
            label={t(sso.label)}
            variation="primary"
            size="large"
            icon={sso.icon}
            className={`employee-login-sso-button ${sso.provider?.toLowerCase() || "provider"}-login-btn`}
            onClick={() => sso.onLogin?.(sso)}
            style={{width:"100%"}}
          />
        ))
      )}
    </div>
  );
};

export default EmployeeSSOLoginOptions;
