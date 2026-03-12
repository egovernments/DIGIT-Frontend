import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

// Mock users — replace with API call when backend is ready
const MOCK_USERS = [
  { id: "USR-001", workerName: "Alice Brown",   role: "Supervisor",    boundary: "Ward 1",  teamCode: "TEAM-A", status: "Active" },
  { id: "USR-002", workerName: "Bob Smith",     role: "Health Worker", boundary: "Ward 2",  teamCode: "TEAM-B", status: "Active" },
  { id: "USR-003", workerName: "Carol Davis",   role: "Health Worker", boundary: "Ward 1",  teamCode: "TEAM-A", status: "Inactive" },
  { id: "USR-004", workerName: "David Lee",     role: "Supervisor",    boundary: "Ward 3",  teamCode: "TEAM-C", status: "Active" },
  { id: "USR-005", workerName: "Eva Martinez",  role: "Health Worker", boundary: "Ward 3",  teamCode: "TEAM-C", status: "Active" },
];

const BLUE = "#0B4B66";

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

const RegisterDetailsScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignName = searchParams.get("campaignName");
  const campaignNumber = searchParams.get("campaignNumber");
  const tenantId = searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();
  const registerId = searchParams.get("registerId");
  const attendanceOfficer = searchParams.get("attendanceOfficer");
  const noOfUsers = searchParams.get("noOfUsers");

  const [users, setUsers] = useState(MOCK_USERS);

  const handleDeleteUser = (user) => {
    // TODO: Call delete API for this user
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleBack = () => {
    navigate(
      `/${window.contextPath}/employee/campaign/map-users-to-registers?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
    );
  };

  const columns = [
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_WORKER_NAME_COLUMN),
      selector: (row) => row.workerName,
      cell: (row) => <span>{row.workerName}</span>,
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_ROLE_COLUMN),
      selector: (row) => row.role,
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_BOUNDARY_COLUMN),
      selector: (row) => row.boundary,
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_TEAM_CODE_COLUMN),
      selector: (row) => row.teamCode,
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
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_DELETE_USER_COLUMN),
      cell: (row) => (
        <Button
          label={t(I18N_KEYS.COMPONENTS.WBH_DELETE)}
          variation="secondary"
          size="small"
          icon="Delete"
          onClick={() => handleDeleteUser(row)}
        />
      ),
    },
  ];

  return (
    <div>
      {/* ── Register Details Card ── */}
      <Card style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        {campaignName && (
          <div style={{ marginBottom: "0.75rem" }}>
            <span style={{ display: "inline-block", border: "1px solid #adb5bd", borderRadius: "4px", padding: "3px 10px", fontSize: "0.75rem", color: "#505a5f", background: "#f3f3f3" }}>
              {campaignName}
            </span>
          </div>
        )}

        <div style={{ fontWeight: "700", fontSize: "1.5rem", color: BLUE, marginBottom: "1.25rem", lineHeight: "1.2" }}>
          {t(I18N_KEYS.PAGES.REGISTER_DETAILS)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <div style={detailLabelStyle}>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_ID_LABEL)} :</div>
            <div style={detailValueStyle}>{registerId || "—"}</div>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <div style={detailLabelStyle}>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_ATTENDANCE_OFFICER_COLUMN)} :</div>
            <div style={detailValueStyle}>{attendanceOfficer || "—"}</div>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <div style={detailLabelStyle}>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_NO_OF_USERS_COLUMN)} :</div>
            <div style={detailValueStyle}>{noOfUsers || users.length}</div>
          </div>
        </div>
      </Card>

      {/* ── Users Table Card ── */}
      <Card style={{ padding: "1.25rem", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ fontWeight: "700", fontSize: "1rem", color: BLUE }}>
            {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_USERS_TABLE_HEADING)}
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              label={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_MAP_USERS_EXCEL_BUTTON)}
              variation="secondary"
              size="small"
              icon="FileUpload"
              onClick={() => {/* TODO: Map users via excel sheet */}}
            />
            <Button
              label={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_MAP_USERS_TO_REGISTER_BUTTON)}
              variation="secondary"
              size="small"
              icon="Person"
              onClick={() => {/* TODO: Map users to register */}}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={users}
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

const detailLabelStyle = {
  fontSize: "0.75rem",
  fontWeight: "600",
  color: "#505a5f",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const detailValueStyle = {
  fontSize: "0.9375rem",
  fontWeight: "500",
  color: "#0b0c0c",
};

export default RegisterDetailsScreen;
