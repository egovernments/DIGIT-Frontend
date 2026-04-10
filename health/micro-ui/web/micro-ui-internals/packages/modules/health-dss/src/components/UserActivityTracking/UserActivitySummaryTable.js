import React, { useState, useContext, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, TextInput, Button, HeaderComponent, Tag, SVG, Loader, Dropdown, MultiSelectDropdown, PopUp, Chip,TooltipWrapper } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import XLSX from "xlsx";
import FilterContext from "../FilterContext";
import UserProfilePopup from "./UserProfilePopup";

const roleTagType = {
  CDD: "monochrome",
  DISTRIBUTOR: "monochrome",
  Supervisor: "warning",
  SUPERVISOR: "warning",
  COMMUNITY_DISTRIBUTOR: "monochrome",
  TEAM_SUPERVISOR: "warning",
  WAREHOUSE_MANAGER: "monochrome",
  HEALTH_FACILITY_WORKER: "monochrome",
  DISTRICT_SUPERVISOR: "warning",
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
  const d = new Date(timestamp);
  var date = d.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
  var time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  return date + ", " + time;
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
  const [selectedBoundaries, setSelectedBoundaries] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMoreBoundaries, setViewMoreBoundaries] = useState(null);

  // Extract parent boundary from URL params (e.g. boundaryType=province, boundaryValue=Grand Gedeh)
  const searchParams = new URLSearchParams(window.location.search);
  const parentBoundaryType = searchParams.get("boundaryType") || "";
  const parentBoundaryValue = searchParams.get("boundaryValue") || "";

  // Get hierarchy type and tenantId from session storage
  const tenantId = Digit.ULBService.getCurrentTenantId(); 
  const campaignSelected = Digit.SessionStorage.get("campaignSelected"); 
  const hierarchyType = (campaignSelected && campaignSelected.hierarchyType) || "";

  // Build aggregationRequestDto
  const chart = data?.charts?.[0];
  const aggregationRequestDto = {
    visualizationCode: chart?.id || "usersSummaryTable",
    visualizationType: chart?.chartType || "metric",
    queryType: "",
    requestDate: {
      startDate: value?.range?.startDate?.getTime() || 0,
      endDate: value?.range?.endDate?.getTime() || Date.now(),
      interval: value?.requestDate?.interval || "month",
      title: value?.requestDate?.title || "",
    },
    filters: { ...value?.filters, campaignNumber },
    moduleLevel: value?.moduleLevel,
    aggregationFactors: null,
  };

  const { isLoading, data: response } = Digit.Hooks.DSS.useGetChartV2(aggregationRequestDto);

  // Transform response to table rows
  const usersSummary = useMemo(() => {
    if (!response) return [];
    const rd = response.responseData;
    const raw = rd?.customData?.rawResponse?.mergedUsersSummary
      || response?.customData?.rawResponse?.mergedUsersSummary
      || rd?.data
      || [];
    return raw.map((user) => ({
      syncedUserId: user.userId,
      userName: user.nameOfUser || user.userName || user.userId,
      userId: user.userName || user.userId,
      role: user.role || "Unknown",
      geoBoundary: user.fullLocation || [user.province, user.district].filter(Boolean).join(" - "),
      // TODO: backend fixing latestSyncTime null values
      lastSyncTimestamp: user.latestSyncTime,
      lastSync: formatSyncTime(user.latestSyncTime),
      recordsToday: user.totalRecords != null ? user.totalRecords : 0,
      status: user.active === "ACTIVE" ? "ONLINE" : "OFFLINE",
      province: user.province,
      district: user.district,
      provinceCode: user.provinceCode,
      districtCode: user.districtCode,
      campaign: user.campaignName || "",
    }));
  }, [response]);

  // Derive parent boundary code from response data (provinceCode from first row)
  const parentBoundaryCode = useMemo(() => {
    if (!usersSummary || usersSummary.length === 0) return "";
    return usersSummary[0].provinceCode || "";
  }, [usersSummary]);

  // Fetch child boundaries under the parent boundary from boundary API
  const boundaryReqCriteria = {
    url: "/boundary-service/boundary-relationships/_search",
    changeQueryName: "userActivityChildBoundaries_" + parentBoundaryCode,
    params: {
      tenantId,
      includeChildren: true,
      includeParents: false,
      codes: parentBoundaryCode,
      hierarchyType,
    },
    config: {
      enabled: !!(hierarchyType && parentBoundaryCode),
      select: (resp) => (resp?.TenantBoundary?.[0]?.boundary) || [],
    },
  };
  const { data: boundaryData = [] } = Digit.Hooks.useCustomAPIHook(boundaryReqCriteria);

  // Build nested options for MultiSelectDropdown from boundary API children
  const childBoundaryOptions = useMemo(() => {
    if (!boundaryData.length) return [];
    const parentNode = boundaryData[0];
    const children = (parentNode && parentNode.children) || [];
    if (children.length === 0) return [];
    return [{
      code: parentNode.code,
      name: t(parentNode.code) !== parentNode.code ? t(parentNode.code) : (parentBoundaryValue || parentNode.code),
      options: children.map((child) => ({
        code: child.code,
        name: t(child.code) !== child.code ? t(child.code) : child.code,
      })),
    }];
  }, [boundaryData, t, parentBoundaryValue]);

  // Filter options derived from response data
  const statusOptions = [
    { name: t("HCM_ALL_STATUS"), code: "ALL" },
    { name: t("HCM_ONLINE"), code: "ONLINE" },
    { name: t("HCM_OFFLINE"), code: "OFFLINE" },
  ];

  const roleOptions = useMemo(() => {
    const unique = [...new Set(usersSummary.map((r) => r.role).filter(Boolean))];
    return [{ name: t("HCM_ALL_ROLES"), code: "ALL" }, ...unique.map((r) => ({ name: t("HCM_ROLE_" + r.toUpperCase()), code: r }))];
  }, [usersSummary, t]);

  // Client-side filtering
  const filteredData = useMemo(() => {
    return usersSummary.filter((row) => {
      const matchesSearch = !searchQuery
        || (row.userName && row.userName.toLowerCase().includes(searchQuery.toLowerCase()))
        || (row.userId && row.userId.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === "ALL" || row.status === statusFilter;
      const matchesRole = roleFilter === "ALL" || row.role === roleFilter;
      const matchesBoundary = selectedBoundaries.length === 0 || selectedBoundaries.some((b) => row.district === b.code || row.district === t(b.code));
      return matchesSearch && matchesStatus && matchesRole && matchesBoundary;
    });
  }, [searchQuery, statusFilter, roleFilter, selectedBoundaries, usersSummary]);

  // Export XLSX
  const handleExportCSV = useCallback(() => {
    const headers = ["User", "User ID", "Role", "Geo Boundary", "Last Sync", "Records Today", "Status"];
    const rows = filteredData.map((row) => [row.userName, row.userId, row.role, row.geoBoundary, row.lastSync || "-", row.recordsToday, row.status]);
    const allData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(allData);
    ws["!cols"] = headers.map((_, colIdx) => {
      var maxLen = allData.reduce((max, row) => Math.max(max, String(row[colIdx] || "").length), 0);
      return { wch: maxLen + 2 };
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Activity");
    XLSX.writeFile(wb, `user-activity-tracking-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }, [filteredData]);

  const ellipsisStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "block",
  };

  // Table columns
  const columns = [
    {
      name: t("USER_ACTIVITY_USER"),
      cell: (row) => (
        <div style={{display:"flex",flexDirection:"column",gap:'4px'}}>
          <TooltipWrapper header={row.userName} placement={"top"}>
            <span style={{ ...ellipsisStyle, fontWeight: 600, color: "#0B4B66" }}>{row.userName}</span>
          </TooltipWrapper>
          <TooltipWrapper header={row.userId} placement={"top"}>
            <span style={{ ...ellipsisStyle, fontSize: "12px", color: "#787878" }}>{row.userId}</span>
          </TooltipWrapper>
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
      cell: (row) => (
        <TooltipWrapper header={row.geoBoundary} placement={"top"}>
          <span style={ellipsisStyle}>{row.geoBoundary}</span>
        </TooltipWrapper>
      ),
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
              {isWarning && "\u26A0 "}
              {row.lastSync ? (
                <TooltipWrapper header={row.lastSync || t("NA")}>
                  <span style={ellipsisStyle}>{row.lastSync || t("NA")}</span>
                </TooltipWrapper>
              ) : (
                t("NA")
              )}
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
      cell: (row) => <Tag label={t(row.status)} type={row.status === "ONLINE" ? "success" : "error"} showIcon={true} />,
      sortable: true,
      grow: 0.8,
      minWidth: "120px",
    },
    {
      name: t("USER_ACTIVITY_ACTION"),
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
          <Button label={t("EXPORT_XLSX")} variation="secondary" icon="FileDownload" onClick={handleExportCSV} size="medium" />
        </div>
        {/* Filters Row */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ minWidth: "250px" }}>
            <TextInput
              type="text"
              placeholder={t("SEARCH_PLACEHOLDER")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ minWidth: "200px" }}>
            <Dropdown
              t={t}
              option={statusOptions}
              optionKey="name"
              selected={statusOptions.find((o) => o.code === statusFilter)}
              select={(val) => setStatusFilter(val.code)}
              showToolTip={true}
            />
          </div>
          <div style={{ minWidth: "250px" }}>
            <Dropdown
              t={t}
              option={roleOptions}
              optionKey="name"
              selected={roleOptions.find((o) => o.code === roleFilter)}
              select={(val) => setRoleFilter(val.code)}
              showToolTip={true}
            />
          </div>
          {/* Parent boundary shown as non-editable text field */}
          {parentBoundaryValue && (
            <div style={{ minWidth: "180px" }}>
              <TextInput
                type="text"
                value={parentBoundaryType.charAt(0).toUpperCase() + parentBoundaryType.slice(1) + ": " + parentBoundaryValue}
                disabled={true}
                variant={"nonEditable"}
                // style={{ backgroundColor: "#EEEEEE", color: "#505A5F", cursor: "default" }}
              />
            </div>
          )}
          {/* Child boundary nested multi-select dropdown from boundary API */}
          {childBoundaryOptions.length > 0 && (
            <div style={{ width: "100%",maxWidth:"37.5rem"}} className="digit-field digit-user-tracking-boundary-filter">
              <MultiSelectDropdown
                options={childBoundaryOptions}
                optionsKey="name"
                selected={selectedBoundaries}
                onSelect={(selected) => {
                  const selectedItems = (selected || [])
                    .filter((item) => item && item[1] && !item[1].options)
                    .map((item) => item[1]);
                  setSelectedBoundaries(selectedItems);
                }}
                defaultLabel={t("HCM_SELECT_BOUNDARIES")}
                defaultUnit={t("HCM_BOUNDARIES")}
                variant="nestedmultiselect"
                addCategorySelectAllCheck={true}
                config={{ isDropdownWithChip: selectedBoundaries.length > 0 ? true : false, numberOfChips: 3 }}
                handleViewMore={(allSelected) => setViewMoreBoundaries(allSelected)}
              />
            </div>
          )}
        </div>
        {
          /* SHOWING ROWS DETAILS */ 
          <div style={{ marginLeft: "auto", fontSize: "12px", color: "#787878" }}>
            {t("SHOWING")} {filteredData.length} {t("OF")} {usersSummary.length} {t("USERS")}
          </div>
        }

        {/* Data Table */}
        <div className="user-tracking-inbox-table-wrapper">
          <DataTable
            key={`${searchQuery}-${statusFilter}-${roleFilter}-${selectedBoundaries.length}-${filteredData.length}`}
            columns={columns}
            data={[...filteredData]}
            customStyles={tableCustomStyles}
            pagination
            paginationPerPage={10}
            progressComponent={<Loader />}
            noDataComponent={<div style={{ padding: "24px", color: "#787878" }}>{t("NO_DATA")}</div>}
            className="data-table user-tracking-inbox-table"
            sortIcon={<SVG.ArrowUpward width="16px" height="16px" fill="#0b4b66" />}
            persistTableHead
            fixedHeader={true}
            paginationComponentOptions={{ rowsPerPageText: t("CS_COMMON_ROWS_PER_PAGE") }}
            onRowClicked={(row) => setSelectedUser(row)}
            pointerOnHover
          />
        </div>
      </Card>

      {selectedUser && (
        <UserProfilePopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          dateRange={value?.range}
        />
      )}
      {viewMoreBoundaries && (
        <PopUp
          onClose={() => setViewMoreBoundaries(null)}
          onOverlayClick={() => setViewMoreBoundaries(null)}
          heading={t("HCM_SELECTED_BOUNDARIES")}
          footerChildren={[
            <Button
              key="close"
              label={t("HCM_CLOSE")}
              onClick={() => setViewMoreBoundaries(null)}
              variation="primary"
            />
          ]}
          className="view-more-popup-user-activity"
        >
          <div className="digit-tag-container" style={{marginBottom:"0rem"}}>
            {viewMoreBoundaries
              ?.filter((item) => !item?.propsData?.[1]?.options)
              ?.map((item, index) => (
                <Chip key={index} text={t(item?.name || item?.code)} hideClose={true} />
              ))}
          </div>
        </PopUp>
      )}
    </div>
  );
};

export default UserActivitySummaryTable;
