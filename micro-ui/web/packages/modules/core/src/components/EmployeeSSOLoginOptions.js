import React, { useState } from "react";

/**
 * One SSO provider button.
 *
 * Deliberately a plain <button> rather than digit-ui-components' <Button>: that component
 * resolves its `icon` prop by NAME against digit-ui-svg-components and accepts no children,
 * so there is no way to put a provider logo <img> inside one. Passing an element rendered as
 * null and produced blank buttons. The markup below mirrors Button's own DOM, so the existing
 * digit-button-* styles still apply and nothing new is needed in digit-ui-css - which matters,
 * because that package is published separately and pinned by version in index.html.
 *
 * `label` arrives already localised from login.js.
 */
const SSOLoginButton = ({ sso, variation, className }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(sso?.logo) && !logoFailed;

  /* Note the absence of .employee-login-sso-icon: that class is a 48px square which hides the
     label via CSS, so applying it would show the logo alone. Both the single- and
     multiple-provider cases render logo + name, so it is deliberately not used. Spacing
     between the two comes from .icon-label-container (flex, gap 0.5rem). */
  return (
    <button
      type="button"
      className={`digit-button-${variation} large ${className || ""}`}
      onClick={() => sso?.onLogin?.(sso)}
      title={sso?.label}
      aria-label={sso?.label}
      style={{ width: "100%" }}
    >
      <div className={`icon-label-container ${variation} large`}>
        {showLogo && (
          <img
            src={sso.logo}
            alt=""
            className="employee-login-sso-logo"
            onError={() => setLogoFailed(true)}
          />
        )}
        <h2 className="digit-button-label">{sso?.label}</h2>
      </div>
    </button>
  );
};

const EmployeeSSOLoginOptions = ({ t, props }) => {
  const { ssoConfigs = [] } = props || {};

  if (!ssoConfigs?.length) {
    return null;
  }

  const hasMultipleOptions = ssoConfigs.length > 1;

  /* Both cases render logo + provider name; they differ only in emphasis - a single provider
     is the primary action, several are secondary so no one of them looks preferred.
     The wrapper is kept for the multiple case (it supplies the grouping and gap) while a lone
     button stays a direct child of the .employee-login-sso flex column, as before. */
  const buttons = ssoConfigs.map((sso, index) => (
    <SSOLoginButton
      key={sso.id || sso.provider || index}
      sso={sso}
      variation={hasMultipleOptions ? "secondary" : "primary"}
      className={
        hasMultipleOptions
          ? `${sso.provider?.toLowerCase() || "provider"}-login-icon`
          : `employee-login-sso-button ${sso.provider?.toLowerCase() || "provider"}-login-btn`
      }
    />
  ));

  return (
    <div className="employee-login-sso">
      <div className="employee-login-sso-divider">
        <span>{hasMultipleOptions ? t("CORE_COMMON_OR_SIGN_IN_WITH") : t("CORE_COMMON_OR")}</span>
      </div>
      {hasMultipleOptions ? <div className="employee-login-sso-icons">{buttons}</div> : buttons}
    </div>
  );
};

export default EmployeeSSOLoginOptions;
