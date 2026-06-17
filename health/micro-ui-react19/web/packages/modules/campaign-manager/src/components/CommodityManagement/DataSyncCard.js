import React from "react";
import { useTranslation } from "react-i18next";
import { SVG } from "@egovernments/digit-ui-components";


const DataSyncCard = ({ items = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="cm-data-sync-card">
      <div className="cm-data-sync-label">
        <div className="cm-data-sync-icon">
          <SVG.Restore width={"48px"} height={"48px"}/>
        </div>
        <span className="cm-data-sync-title">{t("HCM_DATA_SYNC")}</span>
      </div>

      <div className="cm-data-sync-metrics">
        {items.map((item, index) => (
          <div key={index}>
            <div className="cm-metric-item-label">{t(item.label)}</div>
            <div className="cm-metric-item-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataSyncCard;
