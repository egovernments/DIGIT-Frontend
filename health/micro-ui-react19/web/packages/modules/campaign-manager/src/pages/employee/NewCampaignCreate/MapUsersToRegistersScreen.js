import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

// Mock data — replace with API call when backend is ready
const MOCK_REGISTERS = [
  { id: "BILL-16273673", registerName: "BILL 16273673", attendanceOfficer: "ABCD", noOfUsers: 23, status: "Active", usersYetToMap: 10 },
  { id: "BILL-16273674", registerName: "BILL 16273674", attendanceOfficer: "ABCD", noOfUsers: 32, status: "Active", usersYetToMap: 15 },
  { id: "BILL-16273675", registerName: "BILL 16273675", attendanceOfficer: "ABCD", noOfUsers: 43, status: "Active", usersYetToMap: 8 },
  { id: "BILL-16273676", registerName: "BILL 16273676", attendanceOfficer: "ABCD", noOfUsers: 12, status: "Inactive", usersYetToMap: 12 },
  { id: "BILL-16273677", registerName: "BILL 16273677", attendanceOfficer: "ABCD", noOfUsers: 43, status: "Active", usersYetToMap: 5 },
];

const BLUE = "#0B4B66";
const PRIMARY = "#C84C0E";

// Mirrors the pattern used in attendanceManagementTable — "&:hover" works via
// react-data-table-component's emotion/styled-components injection.
const tableCustomStyle = {
  rows: {
    style: {
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #E0E0E0",
      "&:hover": {
        backgroundColor: "#FBEEE8",
        cursor: "default",
      },
    },
  },
  headRow: {
    style: {
      backgroundColor: "#EEEEEE",
      borderBottom: "2px solid #D6D5D4",
    },
  },
  headCells: {
    style: {
      fontWeight: "700",
      fontSize: "0.875rem",
      color: BLUE,
      padding: "12px 16px",
    },
  },
  cells: {
    style: {
      fontSize: "0.875rem",
      color: "#0b0c0c",
      padding: "10px 16px",
    },
  },
};

const MapUsersToRegistersScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignName = searchParams.get("campaignName");
  const campaignNumber = searchParams.get("campaignNumber");
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();

  const [registerIdFilter, setRegisterIdFilter] = useState("");
  const [officerFilter, setOfficerFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ registerId: "", officer: "" });

  const totalUsersYetToMap = MOCK_REGISTERS.reduce((sum, r) => sum + (r.usersYetToMap || 0), 0);

  const filteredRegisters = MOCK_REGISTERS.filter((reg) => {
    const matchId = !appliedFilters.registerId || reg.id === appliedFilters.registerId;
    const matchOfficer =
      !appliedFilters.officer ||
      reg.attendanceOfficer.toLowerCase().includes(appliedFilters.officer.toLowerCase());
    return matchId && matchOfficer;
  });

  const handleSearch = () => setAppliedFilters({ registerId: registerIdFilter, officer: officerFilter });

  const handleClearSearch = () => {
    setRegisterIdFilter("");
    setOfficerFilter("");
    setAppliedFilters({ registerId: "", officer: "" });
  };

  const handleMapUsers = (register) => {
    navigate(
      `/${window.contextPath}/employee/campaign/register-details?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}&registerId=${register.id}&registerName=${encodeURIComponent(register.registerName)}&attendanceOfficer=${encodeURIComponent(register.attendanceOfficer)}&noOfUsers=${register.noOfUsers}`
    );
  };

  const handleDeleteRegister = (_register) => {
    // TODO: Call delete API for this register
  };

  const handleBack = () => {
    navigate(
      `/${window.contextPath}/employee/campaign/setup-attendance?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
    );
  };

  const columns = [
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_NAME_COLUMN),
      selector: (row) => row.registerName,
      cell: (row) => (
        <span
          onClick={() => handleMapUsers(row)}
          style={{ color: PRIMARY, cursor: "pointer", fontWeight: "500", textDecoration: "underline" }}
        >
          {row.registerName}
        </span>
      ),
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_ATTENDANCE_OFFICER_COLUMN),
      selector: (row) => row.attendanceOfficer,
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_NO_OF_USERS_COLUMN),
      selector: (row) => row.noOfUsers,
    },
    {
      name: t(I18N_KEYS.COMPONENTS.STATUS),
      cell: (row) => (
        <span style={{
          display: "inline-block",
          padding: "2px 10px",
          borderRadius: "12px",
          fontSize: "0.8rem",
          fontWeight: "500",
          background: row.status === "Active" ? "#e6f4ea" : "#fce8e6",
          color: row.status === "Active" ? "#137333" : "#c5221f",
        }}>
          {row.status}
        </span>
      ),
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_MAP_USERS_BUTTON),
      cell: (row) => (
        <Button
          label={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_MAP_USERS_BUTTON)}
          variation="secondary"
          size="small"
          icon="Person"
          onClick={() => handleMapUsers(row)}
        />
      ),
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_DELETE_REGISTER_BUTTON),
      cell: (row) => (
        <Button
          label={t(I18N_KEYS.COMPONENTS.WBH_DELETE)}
          variation="secondary"
          size="small"
          icon="Delete"
          onClick={() => handleDeleteRegister(row)}
        />
      ),
    },
  ];

  return (
    <div>
      {/* ── Search Card (contains page heading + filters) ── */}
      <Card style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Campaign chip + users alert */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          {campaignName && (
            <span style={{ display: "inline-block", border: "1px solid #adb5bd", borderRadius: "4px", padding: "3px 10px", fontSize: "0.75rem", color: "#505a5f", background: "#f3f3f3" }}>
              {campaignName}
            </span>
          )}
          {totalUsersYetToMap > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: "5px", color: PRIMARY, fontSize: "0.8125rem", fontWeight: "500" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={PRIMARY} strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="13" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="1" fill={PRIMARY} />
              </svg>
              {totalUsersYetToMap} {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_USERS_YET_TO_BE_MAPPED)}
            </span>
          )}
        </div>

        {/* Page heading */}
        <div style={{ fontWeight: "700", fontSize: "1.5rem", color: BLUE, marginBottom: "0.25rem", lineHeight: "1.2" }}>
          {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_MAP_USERS_TO_REGISTERS_PAGE_HEADING)}
        </div>
        <p style={{ fontSize: "0.875rem", color: "#505a5f", margin: "0 0 1.25rem 0" }}>
          {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_MAP_USERS_TO_REGISTERS_PAGE_DESC)}
        </p>

        {/* Search filters */}
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "210px" }}>
            <label style={labelStyle}>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_ID_LABEL)}</label>
            <div style={{ position: "relative" }}>
              <select
                value={registerIdFilter}
                onChange={(e) => setRegisterIdFilter(e.target.value)}
                style={{ ...inputStyle, appearance: "none", paddingRight: "2rem", width: "100%" }}
              >
                <option value=""></option>
                {MOCK_REGISTERS.map((r) => (
                  <option key={r.id} value={r.id}>{r.registerName}</option>
                ))}
              </select>
              <svg style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#505a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "210px" }}>
            <label style={labelStyle}>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_ATTENDANCE_OFFICER_COLUMN)}</label>
            <input
              type="text"
              value={officerFilter}
              onChange={(e) => setOfficerFilter(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: "0.875rem", alignItems: "center", marginLeft: "auto" }}>
            <span
              onClick={handleClearSearch}
              style={{ color: PRIMARY, fontSize: "0.875rem", cursor: "pointer", fontWeight: "500", userSelect: "none" }}
            >
              {t(I18N_KEYS.COMMON.CLEAR_ALL)}
            </span>
            <Button
              label={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_SEARCH)}
              variation="secondary"
              icon="Search"
              size="small"
              onClick={handleSearch}
            />
          </div>
        </div>
      </Card>

      {/* ── Registers Table Card ── */}
      <Card style={{ padding: "1.25rem", overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={filteredRegisters}
          customStyles={tableCustomStyle}
          noDataComponent={
            <div style={{ padding: "2rem", color: "#888", fontSize: "0.875rem" }}>
              {t(I18N_KEYS.COMPONENTS.NO_RESULTS_FOUND)}
            </div>
          }
        />
      </Card>

      <div style={{ marginTop: "2rem" }}>
        <Button
          label={t(I18N_KEYS.COMMON.HCM_BACK)}
          variation="secondary"
          icon="ArrowBack"
          onClick={handleBack}
        />
      </div>
    </div>
  );
};

const labelStyle = {
  fontSize: "0.8125rem",
  fontWeight: "600",
  color: "#0b0c0c",
};

const inputStyle = {
  padding: "0.5rem 0.75rem",
  border: "1px solid #adb5bd",
  borderRadius: "4px",
  fontSize: "0.875rem",
  color: "#0b0c0c",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

export default MapUsersToRegistersScreen;
