import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, Loader } from "@egovernments/digit-ui-components";
import FilterContext from "../FilterContext";

/**
 * Renders the User Activity summary cards (Total Field Workers, Online Now, Records Today, Sync Warnings).
 * Follows the same pattern as MetricChart — receives visualizer config, calls useGetChartV2, renders data.
 *
 * @param {Object} props.data - The visualizer config object from dashboard config (contains charts[])
 */
const UserActivityMetrics = ({ data }) => {
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const { campaignNumber } = Digit.Hooks.useQueryParams();
  
  const getValueFromPath = (obj, path) => {
    if (!obj || !path || typeof path !== "string") return undefined;
    const parts = path.split(".").map((p) => p.trim()).filter(Boolean);
    let cur = obj;
    for (let i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  };

  const formatCardValue = (raw, valueType) => {
    const type = (valueType || "").toString().toUpperCase();
    const rawStr = raw === undefined || raw === null ? "" : raw;
    const baseNum = typeof raw === "number" ? raw : Number(String(rawStr).replace(/,/g, ""));
    const safeNum = Number.isFinite(baseNum) ? baseNum : 0;

    if (type === "PERCENTAGE") {
      const fixed = Number(safeNum.toFixed(2));
      const formatted = Digit.Utils.dss.formatter(fixed, "number", "Unit", true, t);
      return `${formatted}%`;
    }

    return String(Digit.Utils.dss.formatter(safeNum, "number", "Unit", true, t));
  };

  const chart = data?.charts?.[0];
  const aggregationRequestDto = {
    visualizationCode: chart?.id ,
    visualizationType: chart?.chartType || "metric",
    queryType: "",
    requestDate: {
      ...value?.requestDate,
      startDate: value?.range?.startDate?.getTime(),
      endDate: value?.range?.endDate?.getTime(),
    },
    filters: { ...value?.filters, campaignNumber },
    moduleLevel: value?.moduleLevel,
    aggregationFactors: null,
  };

  const { isLoading, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);

  const cards = useMemo(() => {
    if (!response) return null;
    const rd = response?.responseData;
    const custom = rd?.customData || response?.customData || {};

    if (Array.isArray(custom?.cardsList) && custom.cardsList.length) {
      const rawResponse = (custom?.rawResponse || {});
      return custom.cardsList.map((c) => {
        if (!c) return c;
        if (c.value !== undefined && c.value !== null) return c;
        const v = getValueFromPath(rawResponse, c.valuePath);
        return { ...c, value: v };
      });
    }

    return [];
  }, [response]);

  if (isLoading) {
    return <Loader />;
  }

  if (!cards) return null;

  const columnsCount = Math.min(Array.isArray(cards) ? cards.length : 0, 5);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columnsCount > 0 ? `repeat(${columnsCount}, minmax(0, 1fr))` : "1fr",
        gap: "16px",
        width: "100%",
        alignItems: "stretch",
      }}
    >
      {cards.map((card, index) => {
        const labelKey = card?.labelKey || card?.label;
        const descKey = labelKey ? `${labelKey}_DESCRIPTION` : "";
        const descriptionParams = card?.descriptionParams || {};
        const translated = descKey ? t(descKey, descriptionParams) : "";
        const description = translated === descKey ? "" : translated;
        const valueColor = card?.color || (index >= 3 ? "#C84C0E" : "#0B4B66");
        const value = formatCardValue(card?.value, card?.valueType);

        return (
          <Card key={card?.id || labelKey || index} style={{ borderRadius: "12px", minWidth: 0 }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#505A5F",
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                lineHeight: "18px",
              }}
            >
              {labelKey ? t(labelKey) : ""}
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700, color: valueColor }}>{value}</div>
            <div style={{ fontSize: "12px", color: "#787878" }}>{description}</div>
          </Card>
        );
      })}
    </div>
  );
};

export default UserActivityMetrics;
