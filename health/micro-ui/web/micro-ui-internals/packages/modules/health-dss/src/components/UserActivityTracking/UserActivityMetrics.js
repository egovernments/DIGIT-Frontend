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

  const chart = data?.charts?.[0];
  const aggregationRequestDto = {
    visualizationCode: chart?.id || "overallUsersMetrics",
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

  const metrics = useMemo(() => {
    if (!response) return null;
    const rd = response?.responseData;
    const raw = rd?.customData?.rawResponse
      || response?.customData?.rawResponse
      || {};
    return {
      totalFieldWorkers: raw.totalUsersCreated != null ? raw.totalUsersCreated : 0,
      onlineNow: raw.totalUsersActive != null ? raw.totalUsersActive : 0,
      recordsToday: raw.totalRecordsCount != null ? raw.totalRecordsCount : 0,
      syncWarnings: raw.inactiveUsers != null ? raw.inactiveUsers : 0,
    };
  }, [response]);

  if (isLoading) {
    return <Loader />;
  }

  if (!metrics) return null;

  const offlineCount = metrics.totalFieldWorkers - metrics.onlineNow;
  const cards = [
    { label: "TOTAL_FIELD_WORKERS", value: metrics.totalFieldWorkers, description: t("ACTIVE_CAMPAIGN") },
    { label: "ONLINE_NOW", value: metrics.onlineNow, description: offlineCount + " " + t("OFFLINE").toLowerCase() },
    { label: "RECORDS_TODAY", value: metrics.recordsToday, description: t("ACROSS_ALL_CDDS") },
    { label: "SYNC_WARNINGS", value: metrics.syncWarnings, description: t("SYNC_GAP_DETECTED") },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cards.length}, 1fr)`, gap: "24px", width: "100%" }}>
      {cards.map((card, index) => {
        const isWarning = index >= 3;
        return (
          <Card key={card.label} style={{ borderRadius: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#505A5F" }}>{t(card.label)}</div>
            <div style={{ fontSize: "32px", fontWeight: 700, color: isWarning ? "#C84C0E" : "#0B4B66" }}>{card.value}</div>
            <div style={{ fontSize: "12px", color: "#787878" }}>{card.description}</div>
          </Card>
        );
      })}
    </div>
  );
};

export default UserActivityMetrics;
