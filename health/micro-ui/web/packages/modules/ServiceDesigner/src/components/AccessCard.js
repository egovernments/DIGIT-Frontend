import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckBox, HeaderComponent, SVG, CustomSVG } from "@egovernments/digit-ui-components";

const AccessCard = ({ onChange, data, isRequired }) => {
    const { t } = useTranslation();
    const [showAccessTooltip, setShowAccessTooltip] = useState(false);

    return (
        <div className={`state-card-popup`} style={{margin: "10px"}}>
            <div className="state-card-content" style={{ justifyContent: "center", flexDirection: "column", alignItems: "normal", overflow:"visible" }}>
        <HeaderComponent className={`label`}>
          <div className={`label-container`}>
            <label className={`label-styles`}>{t("ACCESS")}
            </label>
            {isRequired && (<span style={{ color: "rgb(185, 25, 0)" }}>*</span>)}
              <div
                style={{ position: "relative", display: "inline-block", cursor: "pointer" }}
                onMouseEnter={() => setShowAccessTooltip(true)}
                onMouseLeave={() => setShowAccessTooltip(false)}
              >
                <CustomSVG.InfoIcon
                  height="16"
                  width="16"
                  fill="#666"
                />
                {showAccessTooltip && (
                  <span class="tooltiptextrm">
                    {t("ACCESS_INFO_TEXT")}
                  </span>
                )}
              </div>
          </div>
        </HeaderComponent>
                <CheckBox
                    onChange={(e) => onChange(["editor", e])}
                    value={data.editor}
                    checked={data.editor}
                    label={t("EDITOR")}
                    mainClassName={"access-checkbox"}
                />
                <CheckBox
                    onChange={(e) => onChange(["viewer", e])}
                    value={data.viewer}
                    checked={data.viewer}
                    label={t("VIEWER")}
                    mainClassName={"access-checkbox"}
                />
                <CheckBox
                    onChange={(e) => onChange(["creater", e])}
                    checked={data.creater}
                    value={data.creater}
                    label={t("CREATER")}
                    mainClassName={"access-checkbox"}
                />
            </div>
        </div>
    );
};

export default AccessCard;