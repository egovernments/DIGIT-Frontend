import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const PGRBreadCrumbs = ({ location, crumbs: originalCrumbs }) => {
  const { t } = useTranslation();
  const isFromSandbox = window.Digit.Utils.getMultiRootTenant();

  // Modify the Home crumb to include sandbox params when in sandbox mode
  const crumbs = originalCrumbs.map((crumb, index) => {
    if (index === 0 && isFromSandbox) {
      const moduleName = window.location.pathname.split("/employee/")?.[1]?.split("/")?.[0];
      return {
        ...crumb,
        internalLink: `/${window?.contextPath}/employee?from=sandbox&module=${moduleName}&userType=employee`,
      };
    }
    return crumb;
  });

  const visibleCrumbs = crumbs.filter((crumb) => crumb.show !== false);

  return (
    <div className="digit-breadcrumb" style={{ marginBottom: "8px" }}>
      {visibleCrumbs.map((crumb, index) => {
        const isLast = index === visibleCrumbs.length - 1;
        return (
          <span key={index}>
            {!isLast && crumb.internalLink ? (
              <Link to={crumb.internalLink} style={{ color: "#C84C0E", textDecoration: "none" }}>
                {crumb.content}
              </Link>
            ) : (
              <span className="digit-breadcrumb-text">{crumb.content}</span>
            )}
            {!isLast && <span className="digit-breadcrumb-arrow"> / </span>}
          </span>
        );
      })}
    </div>
  );
};

const pgrCustomizations = {};

const overrideComponents = {
  PGRBreadCrumbs,
};

export { pgrCustomizations, overrideComponents };
