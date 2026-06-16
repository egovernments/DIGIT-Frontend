import React from "react";
import { useTranslation } from "react-i18next";

const SummaryCard = ({ title, subtitle, items = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="cm-summary-card">
      {(title || subtitle) && (
        <div className="cm-summary-title-block">
          {title && <div className="cm-summary-title">{t(title)}</div>}
          {subtitle && <div className="cm-summary-subtitle">{subtitle}</div>}
        </div>
      )}

      <div className="cm-summary-metrics">
        {items.map((item, index) => (
          <div key={index}>
            <div className="cm-metric-item-label">{t(item.label)}</div>
            <div className="cm-metric-item-value">
              {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;
