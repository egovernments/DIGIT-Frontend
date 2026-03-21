import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, Tag, Button, TextInput, Dropdown, SVG, Loader, PopUp } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { MAX_SYNC_GAP_HOURS } from "./dummyData";

const getSyncGapHours = (timestamp) => (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60);
const isOnline = (timestamp) => getSyncGapHours(timestamp) <= MAX_SYNC_GAP_HOURS;
const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

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

const UserProfilePopup = ({ user, onClose }) => {
  const { t } = useTranslation();
  const [actionTypeFilter, setActionTypeFilter] = useState("All Action Types");
  const [outcomeFilter, setOutcomeFilter] = useState("All Outcomes");
  const [timeFilter, setTimeFilter] = useState("Today");
  const [searchQuery, setSearchQuery] = useState("");

  const online = isOnline(user.lastSyncTimestamp);
  const lastSyncFormatted = formatTime(user.lastSyncTimestamp);
  const syncGap = getSyncGapHours(user.lastSyncTimestamp);
  const syncWithinThreshold = syncGap <= MAX_SYNC_GAP_HOURS;

  const activityLog = useMemo(() => user.activityLog || [], [user.activityLog]);
  const totalSyncs = activityLog.filter((a) => a.actionType === "Sync Completed").length;
  const failedActions = activityLog.filter((a) => a.outcome === "Failed").length;

  const initials = user.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const summaryCards = [
    { label: "RECORDS_TODAY", value: user.recordsToday, description: "SMC Day 3", color: "#0B4B66" },
    {
      label: "LAST_SYNC",
      value: lastSyncFormatted,
      description: syncWithinThreshold ? `Within ${MAX_SYNC_GAP_HOURS}h` : `>${MAX_SYNC_GAP_HOURS}h gap`,
      color: "#0B4B66",
    },
    { label: "TOTAL_SYNCS", value: totalSyncs, description: "Today", color: "#0B4B66" },
    {
      label: "FAILED_ACTIONS",
      value: failedActions,
      description: failedActions > 0 ? "Needs review" : "None",
      color: failedActions > 0 ? "#C84C0E" : "#0B4B66",
    }
  ];

  const filteredLog = useMemo(() => {
    return activityLog.filter((entry) => {
      const matchesAction = actionTypeFilter === "All Action Types" || entry.actionType === actionTypeFilter;
      const matchesOutcome = outcomeFilter === "All Outcomes" || entry.outcome === outcomeFilter;
      const matchesSearch = !searchQuery || entry.detail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAction && matchesOutcome && matchesSearch;
    });
  }, [activityLog, actionTypeFilter, outcomeFilter, searchQuery]);

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

  const columns = [
    {
      name: t("TIMESTAMP"),
      selector: (row) => formatTime(row.timestamp),
      sortable: true,
      sortFunction: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      minWidth: "150px",
      grow: 0.8,
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
        <span style={{ color: row.outcome === "Failed" ? "#D4351C" : "#363636", fontWeight: row.outcome === "Failed" ? 600 : 400 }}>
          {row.detail}
        </span>
      ),
      grow: 2,
      minWidth: "200px",
    },
    {
      name: t("OUTCOME"),
      cell: (row) => <Tag label={row.outcome} type={row.outcome === "Success" ? "success" : "error"} showIcon={true} />,
      sortable: true,
      minWidth: "150px",
      grow: 0.8,
    },
    {
      name: t("GPS"),
      selector: (row) => row.gps,
      minWidth: "140px",
      grow: 1,
      style: { color: "#787878" },
    },
  ];

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
            <span style={{ color: "#787878", fontSize: "14px" }}>{`${user.userId} · ${user.role} · ${user.geoBoundary}`}</span>
          </div>
          <Tag label={online ? "ONLINE" : "OFFLINE"} type={online ? "success" : "error"} showIcon={true} className={"user-profile-popup-tag"} stroke={true}/>
        </div>
      }
      style={{ width: "95vh", maxWidth: "95vh", maxHeight: "90vh" }}
      className="user-profile-popup"
    >
      {/* Info Tags */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Tag label={`Role: ${user.role}`} type="monochrome" showIcon={false} stroke={true} />
        <Tag label={user.geoBoundary} type="monochrome" showIcon={false} stroke={true} />
        <Tag label={`Campaign: ${user.campaign || "N/A"}`} type="monochrome" showIcon={false} stroke={true} />
        <Tag label={`Last Sync: ${lastSyncFormatted}`} type="monochrome" showIcon={false} stroke={true} />
        <Tag label={`GPS: ${user.gpsCoordinates || "N/A"}`} type="monochrome" showIcon={false} stroke={true} />
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
          <Tag label={`${filteredLog.length} entries`} type="monochrome" showIcon={false} />
        </div>
        <Button label={t("EXPORT_CSV")} variation="secondary" icon="FileDownload" size="small" onClick={handleExportCSV} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ minWidth: "160px" }}>
          <Dropdown
            t={t}
            option={[
              { name: "All Action Types" },
              { name: "Sync Completed" },
              { name: "Record Submitted" },
              { name: "Stock Action" },
              { name: "Login" },
            ]}
            optionKey="name"
            selected={{ name: actionTypeFilter }}
            select={(val) => setActionTypeFilter(val.name)}
          />
        </div>
        <div style={{ minWidth: "150px" }}>
          <Dropdown
            t={t}
            option={[{ name: "All Outcomes" }, { name: "Success" }, { name: "Failed" }]}
            optionKey="name"
            selected={{ name: outcomeFilter }}
            select={(val) => setOutcomeFilter(val.name)}
          />
        </div>
        <div style={{ minWidth: "120px" }}>
          <Dropdown
            t={t}
            option={[{ name: "Today" }, { name: "Last 7 days" }, { name: "Last 30 days" }]}
            optionKey="name"
            selected={{ name: timeFilter }}
            select={(val) => setTimeFilter(val.name)}
          />
        </div>
        <div style={{ minWidth: "200px" }}>
          <TextInput type="text" placeholder={t("Search record ID...")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className={`user-tracking-inbox-table-wrapper`}>
        <DataTable
          columns={columns}
          data={filteredLog}
          customStyles={tableCustomStyles}
          pagination
          paginationPerPage={5}
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
