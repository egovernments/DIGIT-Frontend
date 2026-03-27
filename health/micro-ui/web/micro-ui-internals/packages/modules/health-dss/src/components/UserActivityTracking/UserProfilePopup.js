import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, Tag, Button, TextInput, Dropdown, SVG, Loader, PopUp } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
// import { MAX_SYNC_GAP_HOURS } from "./dummyData";

// const getSyncGapHours = (timestamp) => (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60);
// const isOnline = (timestamp) => getSyncGapHours(timestamp) <= MAX_SYNC_GAP_HOURS;
var formatTime = function (timestamp) {
  if (!timestamp) return "-";
  var d = new Date(timestamp);
  var date = d.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
  var time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  return date + ", " + time;
};

const tableCustomStyles = {
  tableWrapper: {
    style: {
      overflow: "visible",

      // overflow: "scroll",
    },
  },
  table: {
    style: {
      overflow: "visible",
      width: "100%",
    },
  },
  responsiveWrapper: {
    style: {
      overflow: "visible",
    },
  },
  contextMenu: {
    style: {
      overflow: "visible",
    },
  },
  header: {
    style: {
      minHeight: "56px",
    },
  },
  rows: {
    style: {
      backgroundColor: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#FBEEE8",
      },
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: "#D6D5D4",
      backgroundColor: "#EEEEEE",
    },
  },
  headCells: {
    style: {
      "&:first-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "#D6D5D4",
        borderTopLeftRadius: "0.25rem",
      },
      "&:last-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "#D6D5D4",
        borderTopRightRadius: "0.25rem",
      },
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: "#D6D5D4",
      fontFamily: "Roboto",
      fontWeight: "700",
      fontStyle: "normal",
      fontSize: "16px",
      color: "#0B4B66",
      padding: "16px",
      lineHeight: "1.14rem",
      zIndex: 10,
    },
  },
  cells: {
    style: {
      "&:first-of-type": {
        borderLeftStyle: "solid",
        borderLeftWidth: "1px",
        borderLeftColor: "#D6D5D4",
      },
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: "#D6D5D4",
      color: "#363636",
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "1.37rem",
      textAlign: "left",
      fontSize: "16px",
      padding: "16px",
    },
    pagination: {
      style: {
        marginTop: "-60px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#D6D5D4",
        borderTopWidth: "0px",
      },
    },
  },
  pagination: {
    style: {
      width: "95%",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#D6D5D4",
      borderTopWidth: "0px",
    },
  },
  paginationWrapper: {
    style: {
      width: "95%", // Set pagination wrapper width to 80%
      marginLeft: "auto", // Center pagination wrapper horizontally
      marginRight: "auto", // Center pagination wrapper horizontally
      display: "flex", // Use flexbox to make sure pagination aligns properly
      justifyContent: "center", // Center the pagination bar horizontally
    },
  },
};

const UserProfilePopup = ({ user, onClose, dateRange }) => {
  const { t } = useTranslation();
  const [actionTypeFilter, setActionTypeFilter] = useState("ALL");
  const [outcomeFilter, setOutcomeFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("TODAY");
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Fetch individualUsersMetrics for this user ───
  var individualMetricsDto = useMemo(function () {
    return {
      visualizationType: "METRIC",
      visualizationCode: "individualUsersMetrics",
      queryType: "",
      filters: { userId: user.syncedUserId },
      moduleLevel: "",
      aggregationFactors: null,
      requestDate: { startDate: dateRange?.startDate?.getTime() || 0, endDate: dateRange?.endDate?.getTime() || Date.now(), interval: "month", title: "" },
    };
  }, [user.syncedUserId, dateRange?.startDate, dateRange?.endDate]);

  var individualResult = Digit.Hooks.DSS.useGetChartV2(individualMetricsDto);
  var individualMetricsRaw = individualResult.data;

  var individualMetrics = useMemo(function () {
    if (!individualMetricsRaw) return null;
    var rd = individualMetricsRaw.responseData;
    var raw = (rd && rd.customData && rd.customData.rawResponse)
      || (individualMetricsRaw.customData && individualMetricsRaw.customData.rawResponse)
      || {};
    return {
      totalRecords: raw.totalRecordsCount != null ? raw.totalRecordsCount : 0,
      latestGps: raw.latestGps || null,
      // TODO: backend will send failedRecordCount
      failedRecords: raw.failedRecordCount != null ? raw.failedRecordCount : 0,
      lastSyncTime: raw.lastSyncTime || null,
      // TODO: totalSyncs not available — mobile app does not capture this info
      totalSyncs: null,
    };
  }, [individualMetricsRaw]);

  // ─── Fetch usersRecordsSummaryTable for this user ───
  var userRecordsDto = useMemo(function () {
    return {
      visualizationType: "METRIC",
      visualizationCode: "usersRecordsSummaryTable",
      queryType: "",
      filters: { userId: user.syncedUserId },
      moduleLevel: "",
      aggregationFactors: null,
      requestDate: { startDate: dateRange?.startDate?.getTime() || 0, endDate: dateRange?.endDate?.getTime() || Date.now(), interval: "month", title: "" },
    };
  }, [user.syncedUserId, dateRange?.startDate, dateRange?.endDate]);

  var recordsResult = Digit.Hooks.DSS.useGetChartV2(userRecordsDto);
  var userRecordsRaw = recordsResult.data;

  var activityLog = useMemo(function () {
    if (!userRecordsRaw) return [];
    var rd = userRecordsRaw.responseData;
    var raw = (rd && rd.customData && rd.customData.rawResponse && rd.customData.rawResponse.mergedUsersRecordSummary)
      || (userRecordsRaw.customData && userRecordsRaw.customData.rawResponse && userRecordsRaw.customData.rawResponse.mergedUsersRecordSummary)
      || (rd && rd.data)
      || [];
    return raw.map(function (record) {
      return {
        id: record.id,
        timestamp: record.timestamp,
        actionType: record.actionType || "Record Submitted",
        detail: record.detail || "",
        outcome: record.outcome || "Success",
        gps: record.gps || "-",
      };
    });
  }, [userRecordsRaw]);

  var online = user.status === "ONLINE";
  var lastSyncFormatted = individualMetrics && individualMetrics.lastSyncTime
    ? formatTime(individualMetrics.lastSyncTime)
    : formatTime(user.lastSyncTimestamp);

  // Summary card values from individualUsersMetrics API
  var recordsToday = individualMetrics ? individualMetrics.totalRecords : user.recordsToday;
  var failedActions = individualMetrics ? individualMetrics.failedRecords : activityLog.filter(function (a) { return a.outcome && a.outcome.toUpperCase() === "FAILED"; }).length;
  // TODO: totalSyncs should be taken from API (individualUsersMetrics) — mobile app doesn't capture this currently
  var totalSyncs = activityLog.filter(function (a) { return a.actionType && a.actionType.toUpperCase() === "SYNC COMPLETED"; }).length || "-";
  var latestGps = individualMetrics && individualMetrics.latestGps ? individualMetrics.latestGps : (user.gpsCoordinates || "N/A");

  var initials = (user.userName || "")
    .split(" ")
    .map(function (n) { return n[0]; })
    .join("")
    .toUpperCase();

  var summaryCards = [
    { label: "RECORDS_TODAY", value: recordsToday, description: t("RECORDS_TODAY_DESC"), color: "#0B4B66" },
    {
      label: "LAST_SYNC",
      value: lastSyncFormatted,
      description: online ? t("WITHIN_THRESHOLD") : t("SYNC_GAP"),
      color: "#0B4B66",
    },
    // TODO: totalSyncs — mobile app doesn't capture sync count per user, showing fallback
    { label: "TOTAL_SYNCS", value: totalSyncs, description: t("TODAY"), color: "#0B4B66" },
    {
      label: "FAILED_ACTIONS",
      value: failedActions,
      description: failedActions > 0 ? t("NEEDS_REVIEW") : t("NONE"),
      color: failedActions > 0 ? "#C84C0E" : "#0B4B66",
    }
  ];

  // Derive unique filter options from activity log data
  const actionTypeOptions = useMemo(() => {
    const unique = [...new Set(activityLog.map((a) => a.actionType).filter(Boolean))];
    return [{ name: t("ALL_ACTION_TYPES"), code: "ALL" }, ...unique.map((a) => ({ name: a, code: a }))];
  }, [activityLog, t]);

  const outcomeOptions = useMemo(() => {
    const unique = [...new Set(activityLog.map((a) => a.outcome).filter(Boolean))];
    return [{ name: t("ALL_OUTCOMES"), code: "ALL" }, ...unique.map((o) => ({ name: o, code: o.toUpperCase() }))];
  }, [activityLog, t]);

  const filteredLog = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return activityLog.filter((entry) => {
      const matchesAction = actionTypeFilter === "ALL" || entry.actionType === actionTypeFilter;
      const matchesOutcome = outcomeFilter === "ALL" || (entry.outcome && entry.outcome.toUpperCase()) === outcomeFilter;
      const matchesSearch = !searchQuery || entry.detail.toLowerCase().includes(searchQuery.toLowerCase());
      var matchesTime = true;
      if (timeFilter === "TODAY") {
        matchesTime = entry.timestamp && new Date(entry.timestamp) >= startOfToday;
      } else if (timeFilter === "LAST_7_DAYS") {
        var sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        matchesTime = entry.timestamp && new Date(entry.timestamp) >= sevenDaysAgo;
      } else if (timeFilter === "LAST_30_DAYS") {
        var thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchesTime = entry.timestamp && new Date(entry.timestamp) >= thirtyDaysAgo;
      }
      return matchesAction && matchesOutcome && matchesSearch && matchesTime;
    });
  }, [activityLog, actionTypeFilter, outcomeFilter, searchQuery, timeFilter]);

  const handleExportCSV = useCallback(() => {
    const headers = ["Timestamp", "Action Type", "Detail", "Outcome", "GPS"];
    const rows = filteredLog.map((entry) => [formatTime(entry.timestamp), entry.actionType, entry.detail, entry.outcome, entry.gps]);
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-log-${user.userId}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredLog, user.userId]);

  const columns = useMemo(() => [
    {
      name: t("TIMESTAMP"),
      selector: (row) => formatTime(row.timestamp),
      sortable: true,
      sortFunction: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      minWidth: "180px",
      grow: 1.0,
    },
    {
      name: t("ACTION_TYPE"),
      selector: (row) => row.actionType,
      sortable: true,
      minWidth: "140px",
      grow: 1,
    },
    {
      name: t("DETAIL"),
      cell: (row) => (
        <span style={{ color: row.outcome.toUpperCase() === "FAILED" ? "#D4351C" : "#363636", fontWeight: row.outcome.toUpperCase() === "FAILED" ? 600 : 400 }}>
          {row.detail}
        </span>
      ),
      grow: 1.75,
      minWidth: "180px",
    },
    {
      name: t("OUTCOME"),
      cell: (row) => <Tag label={row.outcome} type={row.outcome.toUpperCase() === "SUCCESS" ? "success" : row.outcome.toUpperCase() !== "FAILURE" ? "warning" : "error"} showIcon={true} />,
      sortable: true,
      minWidth: "190px",
      grow: 1.25,
    },
    {
      name: t("GPS"),
      selector: (row) => row.gps,
      minWidth: "140px",
      grow: 1,
      style: { color: "#787878" },
    },
  ], [t]);

  return (
    <PopUp
      onClose={onClose}
      onOverlayClick={onClose}
      heading={
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#0B4B66",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 700,
              color: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start",justifyContent:"center" }}>
            <span style={{ color: "#0b4b66" }}>{user.userName}</span>
            <span style={{ color: "#787878", fontSize: "14px" }}>{`${user.userId} · ${t("HCM_ROLE_" + (user.role || "").toUpperCase())} · ${user.geoBoundary}`}</span>
          </div>
          <Tag label={online ? "ONLINE" : "OFFLINE"} type={online ? "success" : "error"} showIcon={true} className={"user-profile-popup-tag"} stroke={true}/>
        </div>
      }
      style={{ width: "75vw", maxWidth: "75vw", maxHeight: "90vh" }}
      className="user-profile-popup"
    >
      {/* Info Tags */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Tag label={`${t("ROLE_LABEL")}: ${t("HCM_ROLE_" + (user.role || "").toUpperCase())}`} type="monochrome" showIcon={false} stroke={true} />
        <Tag label={user.geoBoundary} type="monochrome" showIcon={false} stroke={true} />
        <Tag label={`${t("CAMPAIGN_LABEL")}: ${user.campaign || Digit.SessionStorage.get("campaignSelected")?.campaignName || Digit.SessionStorage.get("projectSelected")?.project?.name || t("NA")}`} type="monochrome" showIcon={false} stroke={true} />
        <Tag label={`${t("LAST_SYNC_LABEL")}: ${lastSyncFormatted}`} type="monochrome" showIcon={false} stroke={true} />
        <Tag label={`${t("GPS_LABEL")}: ${latestGps}`} type="monochrome" showIcon={false} stroke={true} />
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${summaryCards.length}, 1fr)`, gap: "24px" }}>
        {summaryCards.map((card) => (
          <Card key={card.label} style={{ borderRadius: "12px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#505A5F" }}>{t(card.label)}</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: "12px", color: "#787878" }}>{card.description}</div>
          </Card>
        ))}
      </div>

      {/* Activity Log Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#0B4B66" }}>{t("ACTIVITY_LOG")}</span>
          <Tag label={`${filteredLog.length} ${t("ENTRIES")}`} type="monochrome" showIcon={false} />
        </div>
        <Button label={t("EXPORT_CSV")} variation="secondary" icon="FileDownload" size="small" onClick={handleExportCSV} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ minWidth: "180px" }}>
          <Dropdown
            t={t}
            option={actionTypeOptions}
            optionKey="name"
            selected={actionTypeOptions.find((o) => o.code === actionTypeFilter)}
            select={(val) => setActionTypeFilter(val.code)}
          />
        </div>
        <div style={{ minWidth: "180px" }}>
          <Dropdown
            t={t}
            option={outcomeOptions}
            optionKey="name"
            selected={outcomeOptions.find((o) => o.code === outcomeFilter)}
            select={(val) => setOutcomeFilter(val.code)}
          />
        </div>
        <div style={{ minWidth: "160px" }}>
          <Dropdown
            t={t}
            option={[
              { name: t("FILTER_TODAY"), code: "TODAY" },
              { name: t("FILTER_LAST_7_DAYS"), code: "LAST_7_DAYS" },
              { name: t("FILTER_LAST_30_DAYS"), code: "LAST_30_DAYS" },
            ]}
            optionKey="name"
            selected={{ name: t("FILTER_" + timeFilter), code: timeFilter }}
            select={(val) => setTimeFilter(val.code)}
          />
        </div>
        <div style={{ minWidth: "200px" }}>
          <TextInput type="text" placeholder={t("SEARCH_RECORD_ID")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className={`user-tracking-inbox-table-wrapper`}>
        <DataTable
          key={`${actionTypeFilter}-${outcomeFilter}-${timeFilter}-${searchQuery}-${filteredLog.length}`}
          columns={columns}
          data={[...filteredLog]}
          customStyles={tableCustomStyles}
          pagination
          paginationPerPage={10}
          progressComponent={<Loader />}
          noDataComponent={<div style={{ padding: "24px", color: "#787878" }}>{t("NO_DATA")}</div>}
          sortIcon={<SVG.ArrowUpward width={"14px"} height={"14px"} fill={"#0b4b66"} />}
          persistTableHead
          paginationComponentOptions={{ rowsPerPageText: t("CS_COMMON_ROWS_PER_PAGE") }}
          className={`data-table user-tracking-inbox-table`}
          noHeader={false}
          fixedHeader={true}
        />
      </div>
    </PopUp>
  );
};

export default UserProfilePopup;
