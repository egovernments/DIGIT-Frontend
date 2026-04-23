import React from "react";
import { useTranslation } from "react-i18next";
import { SVG } from "@egovernments/digit-ui-components";


const DataSyncCard = ({ items = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="cm-data-sync-card">
      <div className="cm-data-sync-label">
        <div className="cm-data-sync-icon">
          {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="#C84C0E"/>
          </svg> */}
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
