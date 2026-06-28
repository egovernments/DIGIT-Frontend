import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, TextInput, Button, HeaderComponent, Tag, SVG, Loader, Dropdown } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import useUserActivityData from "../../hooks/useUserActivityData";
import UserProfilePopup from "./UserProfilePopup";

const roleTagType = {
  CDD: "monochrome",
  DISTRIBUTOR: "monochrome",
  Supervisor: "warning",
  SUPERVISOR: "warning",
};

const SummaryCard = ({ card, index }) => {
  const { t } = useTranslation();
  const isWarning = index >= 3;
  return (
    <Card style={{ borderRadius: "12px" }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "#505A5F" }}>{t(card.label)}</div>
      <div style={{ fontSize: "32px", fontWeight: 700, color: isWarning ? "#C84C0E" : "#0B4B66" }}>{card.value}</div>
      <div style={{ fontSize: "12px", color: "#787878" }}>{t(card.description)}</div>
    </Card>
  );
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
      width: "95%",
      // overflow: "scroll",
    },
  },
  responsiveWrapper: {
    style: {
      overflow: "visible",
      // overflow: "scroll",
    },
  },
  contextMenu: {
    style: {
      overflow: "visible",
      // overflow: "scroll",
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

const formatSyncTime = (lastSyncTimestamp) => {
  if (!lastSyncTimestamp) return "-";
  var date = new Date(lastSyncTimestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
};

const UserActivity = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [boundaryFilter, setBoundaryFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch data from dashboard-analytics getChartV2 API
  const { overallMetrics, usersSummary, isLoading } = useUserActivityData({
    enabled: true,
  });

  // Enrich table data with formatted lastSync
  const enrichedData = useMemo(() => {
    return (usersSummary || []).map(function (row) {
      return {
        ...row,
        lastSync: formatSyncTime(row.lastSyncTimestamp),
      };
    });
  }, [usersSummary]);

  // Summary cards from overallUsersMetrics API
  var offlineCount = overallMetrics.totalFieldWorkers - overallMetrics.onlineNow;
  var summaryCards = [
    { label: "TOTAL_FIELD_WORKERS", value: overallMetrics.totalFieldWorkers, description: t("ACTIVE_CAMPAIGN") },
    { label: "ONLINE_NOW", value: overallMetrics.onlineNow, description: offlineCount + " " + t("OFFLINE").toLowerCase() },
    { label: "RECORDS_TODAY", value: overallMetrics.recordsToday, description: t("ACROSS_ALL_CDDS") },
    { label: "SYNC_WARNINGS", value: overallMetrics.syncWarnings, description: t("SYNC_GAP_DETECTED") },
  ];

  // Derive unique filter options from data
  const statusOptions = [
    { name: t("HCM_ALL_STATUS"), code: "ALL" },
    { name: t("HCM_ONLINE"), code: "ONLINE" },
    { name: t("HCM_OFFLINE"), code: "OFFLINE" },
  ];

  const roleOptions = useMemo(() => {
    const unique = [...new Set(enrichedData.map((r) => r.role).filter(Boolean))];
    return [{ name: t("HCM_ALL_ROLES"), code: "ALL" }, ...unique.map((r) => ({ name: t(`HCM_ROLE_${r.toUpperCase()}`), code: r }))];
  }, [enrichedData, t]);

  const boundaryOptions = useMemo(() => {
    const unique = [...new Set(enrichedData.map((r) => r.geoBoundary).filter(Boolean))];
    return [{ name: t("HCM_ALL_BOUNDARIES"), code: "ALL" }, ...unique.map((b) => ({ name: b, code: b }))];
  }, [enrichedData, t]);

  const filteredData = useMemo(() => {
    return enrichedData.filter((row) => {
      const matchesSearch =
        !searchQuery ||
        row.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.userId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || row.status === statusFilter;
      const matchesRole = roleFilter === "ALL" || row.role === roleFilter;
      const matchesBoundary = boundaryFilter === "ALL" || row.geoBoundary === boundaryFilter;
      return matchesSearch && matchesStatus && matchesRole && matchesBoundary;
    });
  }, [searchQuery, statusFilter, roleFilter, boundaryFilter, enrichedData]);

  const handleExportCSV = useCallback(() => {
    const headers = ["User", "User ID", "Role", "Geo Boundary", "Last Sync", "Records Today", "Status"];
    const rows = enrichedData.map((row) => [row.userName, row.userId, row.role, row.geoBoundary, row.lastSync, row.recordsToday, row.status]);
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `user-activity-tracking-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [enrichedData]);

  const columns = [
    {
      name: t("USER_ACTIVITY_USER"),
      cell: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0B4B66" }}>{row.userName}</div>
          <div style={{ fontSize: "12px", color: "#787878" }}>{row.userId}</div>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.userName.localeCompare(b.userName),
      grow: 1.25,
      minWidth: "150px",
    },
    {
      name: t("USER_ACTIVITY_ROLE"),
      cell: (row) => <Tag label={t(row.role)} type={roleTagType[row.role] || "monochrome"} showIcon={false} stroke={true} />,
      sortable: true,
      grow: 1,
      minWidth: "120px",
    },
    {
      name: t("USER_ACTIVITY_GEO_BOUNDARY"),
      selector: (row) => row.geoBoundary,
      sortable: true,
      grow: 1.5,
      minWidth: "160px",
    },
    {
      name: t("USER_ACTIVITY_LAST_SYNC"),
      cell: (row) => (
        <div>
          <div style={{ color: row.syncWarning ? "#D4351C" : "#363636", fontWeight: row.syncWarning ? 600 : 400 }}>
            {row.syncWarning && "\u26A0 "}
            {row.lastSync}
          </div>
          {row.syncWarning && <div style={{ fontSize: "11px", color: "#D4351C" }}>{row.syncWarningText}</div>}
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => a.lastSync.localeCompare(b.lastSync),
      grow: 1,
      minWidth: "120px",
    },
    {
      name: t("USER_ACTIVITY_RECORDS_TODAY"),
      cell: (row) => <span style={{ fontWeight: 600, color: row.recordsToday === 0 ? "#D4351C" : "#363636" }}>{row.recordsToday}</span>,
      sortable: true,
      sortFunction: (a, b) => a.recordsToday - b.recordsToday,
      grow: 0.8,
      minWidth: "120px",
    },
    {
      name: t("USER_ACTIVITY_STATUS"),
      cell: (row) => <Tag label={row.status} type={row.status === "ONLINE" ? "success" : "error"} showIcon={true} />,
      sortable: true,
      grow: 0.8,
      minWidth: "120px",
    },
    {
      name: "",
      cell: (row) => (
        <Button
          label={t("VIEW_PROFILE")}
          variation="teritiary"
          onClick={() => {
            setSelectedUser(row);
          }}
          icon={"ArrowForward"}
          isSuffix={true}
          size={"medium"}
        />
      ),
      grow: 0.8,
      minWidth: "130px",
      center: true,
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div style={{ padding: "0" }}>
      {/* Page Header */}
      <HeaderComponent className={"digit-dss-user-tracking-header-text"}>{t("USER_ACTIVITY_TRACKING")}</HeaderComponent>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${summaryCards.length}, 1fr)`, gap: "24px", marginBottom: "24px" }}>
        {summaryCards.map((card, index) => (
          <SummaryCard key={card.label} card={card} index={index} />
        ))}
      </div>

      {/* Device Management Section */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <HeaderComponent>
              <span className={`digit-generic-chart-header`} style={{ color: "#0B4B66" }}>
                {t("DEVICE_MANAGEMENT")}
              </span>
            </HeaderComponent>

            <div style={{ fontSize: "14px", color: "#787878", marginTop: "8px" }}>
              {t("DEVICE_MANAGEMENT_DESC")}
            </div>
          </div>
          <Button
            label={t("EXPORT_CSV")}
            variation="secondary"
            icon="FileDownload"
            style={{ fontSize: "14px" }}
            onClick={handleExportCSV}
            size={"medium"}
          />
        </div>

        {/* Filters Row */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ minWidth: "240px" }}>
            <TextInput
              type="text"
              placeholder={t("SEARCH_PLACEHOLDER")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: "40px" }}
            />
          </div>
          <div style={{ minWidth: "160px" }}>
            <Dropdown
              t={t}
              option={statusOptions}
              optionKey="name"
              selected={statusOptions.find((o) => o.code === statusFilter)}
              select={(val) => setStatusFilter(val.code)}
            />
          </div>
          <div style={{ minWidth: "160px" }}>
            <Dropdown
              t={t}
              option={roleOptions}
              optionKey="name"
              selected={roleOptions.find((o) => o.code === roleFilter)}
              select={(val) => setRoleFilter(val.code)}
            />
          </div>
          <div style={{ minWidth: "180px" }}>
            <Dropdown
              t={t}
              option={boundaryOptions}
              optionKey="name"
              selected={boundaryOptions.find((o) => o.code === boundaryFilter)}
              select={(val) => setBoundaryFilter(val.code)}
            />
          </div>
          <div style={{ marginLeft: "auto", fontSize: "13px", color: "#787878" }}>
            Showing {filteredData.length} of {enrichedData.length} users
          </div>
        </div>
        <div className={`user-tracking-inbox-table-wrapper`}>
          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredData}
            customStyles={tableCustomStyles}
            pagination
            paginationPerPage={5}
            progressComponent={<Loader />}
            noDataComponent={<div style={{ padding: "24px", color: "#787878" }}>{t("NO_DATA")}</div>}
            className={`data-table user-tracking-inbox-table`}
            sortIcon={<SVG.ArrowUpward width={"16px"} height={"16px"} fill={"#0b4b66"} />}
            persistTableHead
            noHeader={false}
            fixedHeader={true}
            paginationComponentOptions={{
              rowsPerPageText: t("CS_COMMON_ROWS_PER_PAGE"),
            }}
          />
        </div>
      </Card>
      {selectedUser && (
        <UserProfilePopup
          user={enrichedData.find((d) => d.userId === selectedUser.userId)}
          onClose={() => {
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserActivity;
