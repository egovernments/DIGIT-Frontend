import React from "react";
import { useTranslation } from "react-i18next";

const Tabs = ({ numberTabs, onTabChange }) => {
  const { t } = useTranslation();
  return (
    <div className="configure-app-tabs">
      {numberTabs.map((_, index) => (
        <button
          key={index}
          type="button"
          className={`configure-app-tab-head ${_.active === true ? "active" : ""} hover`}
          onClick={() => onTabChange(_, index)}
        >
          <p style={{ margin: 0, position: "relative", top: "-0 .1rem" }}>{t(_.parent)}</p>
        </button>
      ))}
    </div>
  );
};

export default React.memo(Tabs);
