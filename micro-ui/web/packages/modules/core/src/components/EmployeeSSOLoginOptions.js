import React from "react";

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
            <button
              key={sso.id || sso.provider || index}
              type="button"
              className={`employee-login-sso-icon ${sso.provider?.toLowerCase() || "provider"}-login-icon`}
              onClick={() => sso.onLogin?.(sso)}
              title={t(sso.label)}
            >
              <span className="employee-login-sso-icon-content">{sso.icon}</span>
            </button>
          ))}
        </div>
      ) : (
        ssoConfigs.map((sso, index) => (
          <button
            key={sso.id || sso.provider || index}
            type="button"
            className={`employee-login-sso-button ${sso.provider?.toLowerCase() || "provider"}-login-btn`}
            onClick={() => sso.onLogin?.(sso)}
          >
            <span className="employee-login-sso-button-icon">{sso.icon}</span>
            {t(sso.label)}
          </button>
        ))
      )}
    </div>
  );
};

export default EmployeeSSOLoginOptions;
