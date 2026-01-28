import React from "react";
import { useTranslation } from "react-i18next";
import { CustomSVG } from "@egovernments/digit-ui-components";

const StateComp = ({ onStateClick, type, State, desc, icon, disabled = false }) => {
  const { t } = useTranslation();
  const iconMap = {
    start : <CustomSVG.StartStateIcon width={24} height={24}/>,
    intermediate : <CustomSVG.IntermediateStateIcon width={24} height={24}/>,
    end: <CustomSVG.EndStateIcon width={24} height={24}/>,
  }

  return (
    <div className={`state-card ${disabled ? "state-card-disabled" : ""}`}
      onClick={() => !disabled && onStateClick(type)}
    >
      <div className="state-card-content">
        <div className="text-section">
          <h3 className={`state-title ${disabled ? "state-title-disabled" : ""}`}>
            <div className="state-icon">
              {iconMap[type] || <CustomSVG.EditIcon />}
            </div>{State}</h3>
          <p className={`state-description ${disabled ? "state-description-disabled" : ""}`}>{desc}</p>
          <div className={`state-addtoclick ${disabled ? "state-addtoclick-disabled" : ""}`}>{t("CLICK_TO_ADD")}</div>
        </div>
      </div>
    </div>

  );
};

export default StateComp;