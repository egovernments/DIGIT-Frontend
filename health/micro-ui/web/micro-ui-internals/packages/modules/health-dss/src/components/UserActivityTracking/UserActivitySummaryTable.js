import React, { useState, useContext, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, TextInput, Button, HeaderComponent, Tag, SVG, Loader, Dropdown } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import FilterContext from "../FilterContext";
import UserProfilePopup from "./UserProfilePopup";

const roleTagType = {
  CDD: "monochrome",
  DISTRIBUTOR: "monochrome",
  Supervisor: "warning",
  SUPERVISOR: "warning",
  COMMUNITY_DISTRIBUTOR: "monochrome",
  TEAM_SUPERVISOR: "warning",
};

const tableCustomStyles = {
  tableWrapper: { style: { overflow: "visible" } },
  table: { style: { overflow: "visible", width: "95%" } },
  responsiveWrapper: { style: { overflow: "visible" } },
  contextMenu: { style: { overflow: "visible" } },
  header: { style: { minHeight: "56px" } },
  rows: { style: { backgroundColor: "#FFFFFF", "&:hover": { backgroundColor: "#FBEEE8" } } },
  headRow: { style: { borderTopStyle: "solid", borderTopWidth: "1px", borderTopColor: "#D6D5D4", backgroundColor: "#EEEEEE" } },
  headCells: {
    style: {
      "&:first-of-type": { borderLeftStyle: "solid", borderLeftWidth: "1px", borderLeftColor: "#D6D5D4", borderTopLeftRadius: "0.25rem" },
      "&:last-of-type": { borderLeftStyle: "solid", borderLeftWidth: "1px", borderLeftColor: "#D6D5D4", borderTopRightRadius: "0.25rem" },
      borderRightStyle: "solid", borderRightWidth: "1px", borderRightColor: "#D6D5D4",
      fontFamily: "Roboto", fontWeight: "700", fontSize: "16px", color: "#0B4B66", padding: "16px", lineHeight: "1.14rem", zIndex: 10,
    },
  },
  cells: {
    style: {
      "&:first-of-type": { borderLeftStyle: "solid", borderLeftWidth: "1px", borderLeftColor: "#D6D5D4" },
      borderRightStyle: "solid", borderRightWidth: "1px", borderRightColor: "#D6D5D4",
      color: "#363636", fontFamily: "Roboto", fontWeight: 400, lineHeight: "1.37rem", fontSize: "16px", padding: "16px",
    },
  },
  pagination: { style: { width: "95%", borderStyle: "solid", borderWidth: "1px", borderColor: "#D6D5D4", borderTopWidth: "0px" } },
};

const formatSyncTime = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
};

/**
 * Renders the User Activity summary table (Device Management).
 * Follows the same pattern as CustomTable — receives visualizer config from dashboard config,
 * calls useGetChartV2 with chart id, and renders data.
 */
const UserActivitySummaryTable = ({ data }) => {
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const { campaignNumber } = Digit.Hooks.useQueryParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [boundaryFilter, setBoundaryFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);

  // Build aggregationRequestDto following the same pattern as CustomTable
  const chart = data?.charts?.[0];
  const aggregationRequestDto = {
    visualizationCode: chart?.id || "usersSummaryTable",
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

  // Transform response to table rows
  const usersSummary = useMemo(() => {
    if (!response) return [];
    const rd = response?.responseData;
    const raw = rd?.customData?.rawResponse?.mergedUsersSummary
      || response?.customData?.rawResponse?.mergedUsersSummary
      || rd?.data
      || [];
    return raw.map((user) => ({
      syncedUserId: user.userId,
      // TODO: backend will add nameOfUser to response
      userName: user.nameOfUser || user.userName || user.userId,
      userId: user.userName || user.userId,
      role: user.role || "Unknown",
      geoBoundary: user.fullLocation || [user.province, user.district].filter(Boolean).join(" - "),
      // TODO: backend fixing latestSyncTime null values
      lastSyncTimestamp: user.latestSyncTime,
      lastSync: formatSyncTime(user.latestSyncTime),
      recordsToday: user.totalRecords != null ? user.totalRecords : 0,
      // TODO: backend will send inactive status explicitly when active is null
      status: user.active === true ? "ONLINE" : "OFFLINE",
      province: user.province,
      district: user.district,
      campaign: user.campaignName || "",
    }));
  }, [response]);

  // Filter options derived from data
  const statusOptions = [
    { name: t("HCM_ALL_STATUS"), code: "ALL" },
    { name: t("HCM_ONLINE"), code: "ONLINE" },
    { name: t("HCM_OFFLINE"), code: "OFFLINE" },
  ];

  const roleOptions = useMemo(() => {
    const unique = [...new Set(usersSummary.map((r) => r.role).filter(Boolean))];
    return [{ name: t("HCM_ALL_ROLES"), code: "ALL" }, ...unique.map((r) => ({ name: t("HCM_ROLE_" + r.toUpperCase()), code: r }))];
  }, [usersSummary, t]);

  const boundaryOptions = useMemo(() => {
    const unique = [...new Set(usersSummary.map((r) => r.geoBoundary).filter(Boolean))];
    return [{ name: t("HCM_ALL_BOUNDARIES"), code: "ALL" }, ...unique.map((b) => ({ name: b, code: b }))];
  }, [usersSummary, t]);

  const filteredData = useMemo(() => {
    return usersSummary.filter((row) => {
      const matchesSearch = !searchQuery
        || row.userName.toLowerCase().includes(searchQuery.toLowerCase())
        || row.userId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || row.status === statusFilter;
      const matchesRole = roleFilter === "ALL" || row.role === roleFilter;
      const matchesBoundary = boundaryFilter === "ALL" || row.geoBoundary === boundaryFilter;
      return matchesSearch && matchesStatus && matchesRole && matchesBoundary;
    });
  }, [searchQuery, statusFilter, roleFilter, boundaryFilter, usersSummary]);

  const handleExportCSV = useCallback(() => {
    const headers = ["User", "User ID", "Role", "Geo Boundary", "Last Sync", "Records Today", "Status"];
    const rows = usersSummary.map((row) => [row.userName, row.userId, row.role, row.geoBoundary, row.lastSync, row.recordsToday, row.status]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `user-activity-tracking-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [usersSummary]);

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
      cell: (row) => {
        const isWarning = row.status === "OFFLINE";
        return (
          <div>
            <div style={{ color: isWarning ? "#D4351C" : "#363636", fontWeight: isWarning ? 600 : 400 }}>
              {isWarning && "\u26A0 "}{row.lastSync ? row.lastSync : t("NA")}
            </div>
            {isWarning && <div style={{ fontSize: "11px", color: "#D4351C" }}>{t("SYNC_GAP")}</div>}
          </div>
        );
      },
      sortable: true,
      grow: 1,
      minWidth: "120px",
    },
    {
      name: t("USER_ACTIVITY_RECORDS_TODAY"),
      cell: (row) => (
        <span style={{ fontWeight: 600, color: row.recordsToday === 0 ? "#D4351C" : "#363636" }}>{row.recordsToday}</span>
      ),
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
          onClick={() => setSelectedUser(row)}
          icon="ArrowForward"
          isSuffix={true}
          size="medium"
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
    <div style={{width:"100%"}}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <HeaderComponent>
              <span className="digit-generic-chart-header" style={{ color: "#0B4B66" }}>
                {t("DEVICE_MANAGEMENT")}
              </span>
            </HeaderComponent>
            <div style={{ fontSize: "14px", color: "#787878", marginTop: "8px" }}>
              {t("DEVICE_MANAGEMENT_DESC")}
            </div>
          </div>
          <Button label={t("EXPORT_CSV")} variation="secondary" icon="FileDownload" onClick={handleExportCSV} size="medium" />
        </div>

        {/* Filters Row */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ minWidth: "240px" }}>
            <TextInput
              type="text"
              placeholder={t("SEARCH_PLACEHOLDER")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            Showing {filteredData.length} of {usersSummary.length} users
          </div>
        </div>

        {/* Data Table */}
        <div className="user-tracking-inbox-table-wrapper">
          <DataTable
            columns={columns}
            data={filteredData}
            customStyles={tableCustomStyles}
            pagination
            paginationPerPage={5}
            progressComponent={<Loader />}
            noDataComponent={<div style={{ padding: "24px", color: "#787878" }}>{t("NO_DATA")}</div>}
            className="data-table user-tracking-inbox-table"
            sortIcon={<SVG.ArrowUpward width="16px" height="16px" fill="#0b4b66" />}
            persistTableHead
            fixedHeader={true}
            paginationComponentOptions={{ rowsPerPageText: t("CS_COMMON_ROWS_PER_PAGE") }}
          />
        </div>
      </Card>

      {selectedUser && (
        <UserProfilePopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserActivitySummaryTable;
