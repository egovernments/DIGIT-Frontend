import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Loader, Toast } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

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
  const registerNumber = searchParams.get("registerNumber");
  const registerName = searchParams.get("registerName");
  const boundaryCode = searchParams.get("boundaryCode");

  const [showToast, setShowToast] = useState(null);

  // Fetch campaign data to get campaignId
  const campaignReqCriteria = {//TODO check api call
    url: `/project-factory/v1/project-type/search`,
    body: { CampaignDetails: { tenantId, campaignNumber } },
    config: {
      enabled: !!campaignNumber,
      select: (data) => data?.CampaignDetails?.[0],
      staleTime: 0,
      cacheTime: 0,
    },
  };
  const { data: campaignData, isLoading: isCampaignLoading } = Digit.Hooks.useCustomAPIHook(campaignReqCriteria);

  // Check resource-details status for attendee mapping on this register
  const attendeeResourceCriteria = {
    url: `/project-factory/v1/resource-details/_search`,
    body: {
      ResourceDetailsCriteria: {
        tenantId,
        campaignId: campaignData?.id,
        type: ["attendanceRegisterAttendee"],
        parentResourceId: registerId,
        isActive: true,
      },
    },
    config: {
      enabled: !!campaignData?.id && !!registerId,
      select: (data) => data?.ResourceDetails || [],
      staleTime: 0,
      cacheTime: 0,
    },
  };
  const { data: attendeeResourceDetails = [], isLoading: isAttendeeResourceLoading, isFetching: isAttendeeResourceFetching, refetch: refetchAttendeeResource } = Digit.Hooks.useCustomAPIHook(attendeeResourceCriteria);

  const attendeeMappingStatus = attendeeResourceDetails.length > 0 ? attendeeResourceDetails[0]?.status : null;

  // Poll every 5 seconds while attendee mapping is in progress
  useEffect(() => {
    if (attendeeMappingStatus !== "creating") return;
    const interval = setInterval(() => {
      refetchAttendeeResource();
    }, 3000);
    return () => clearInterval(interval);
  }, [attendeeMappingStatus]);
  const isAttendeeCreationCompleted = attendeeMappingStatus === "completed";

  // Show toast based on attendee mapping status
  useEffect(() => {
    if (isAttendeeResourceLoading || isAttendeeResourceFetching || attendeeResourceDetails.length === 0) return;
    if (attendeeMappingStatus === "creating") {
      setShowToast({ key: "warning", label: t("HCM_ATTENDEE_MAPPING_IN_PROGRESS") });
    } else if (attendeeMappingStatus === "failed") {
      setShowToast({ key: "error", label: t("HCM_ATTENDEE_MAPPING_FAILED") });
    } 
    // else if (attendeeMappingStatus === "completed") {
    //   setShowToast({ key: "success", label: t("HCM_ATTENDEE_MAPPING_COMPLETED") });
    // }
  }, [attendeeMappingStatus, isAttendeeResourceLoading, isAttendeeResourceFetching]);

  // Fetch register details using registerNumber
  const attendanceReqCriteria = {
    url: `/attendance/v1/_search`,
    params: { tenantId, registerNumber },
    body: {},
    config: {
      enabled: !!registerNumber && isAttendeeCreationCompleted,
      select: (data) => data?.attendanceRegister?.[0],
      staleTime: 0,
      cacheTime: 0,
    },
  };
  const { data: registerData, isLoading } = Digit.Hooks.useCustomAPIHook(attendanceReqCriteria);

  const attendees = registerData?.attendees || [];
  const staff = registerData?.staff || [];

  // Extract individualIds from attendees to fetch worker details
  const individualIds = useMemo(() => attendees.map((a) => a.individualId).filter(Boolean), [attendees]);

  // Fetch individual details (name, username, role, etc.)
  const individualReqCriteria = {
    url: `/individual/v1/_search`,
    params: { tenantId, limit: individualIds.length + 1, offset: 0 },
    body: { Individual: { id: individualIds } },
    config: {
      enabled: individualIds.length > 0,
      select: (data) => data?.Individual || [],
      staleTime: 0,
      cacheTime: 0,
    },
    changeQueryName: `individuals_${registerNumber}`,
  };
  const { data: individuals = [], isLoading: isIndividualsLoading } = Digit.Hooks.useCustomAPIHook(individualReqCriteria);

  // Build a map of individualId -> Individual for quick lookup
  const individualMap = useMemo(() => {
    const map = {};
    individuals.forEach((ind) => { map[ind.id] = ind; });
    return map;
  }, [individuals]);

  // Merge attendee data with individual details for the table
  const NA = t(I18N_KEYS.COMMON.NA);

  const tableData = useMemo(() => attendees.map((attendee) => {
    const ind = individualMap[attendee.individualId] || {};
    return {
      ...attendee,
      workerName: ind.name?.givenName || NA,
      username: ind.userDetails?.username || NA,
      role: ind.skills?.[0]?.type || NA,
      team: attendee.tag || NA,
      status: attendee.denrollmentDate ? "Inactive" : "Active",
    };
  }), [attendees, individualMap, NA]);

  const getOwnerName = () => {
    const owner = staff.find((s) => s.staffType === "OWNER");
    return owner?.additionalDetails?.staffName || owner?.additionalDetails?.ownerName || NA;
  };

  const handleDeleteUser = (_user) => {
    // TODO: Call delete API for this user
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
    },
    {
      name: t("HCM_USERNAME"),
      selector: (row) => row.username,
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_ROLE_COLUMN),
      selector: (row) => row.role,
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_BOUNDARY_COLUMN),
      selector: () => boundaryCode || registerData?.localityCode || NA,
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_TEAM_CODE_COLUMN),
      selector: (row) => row.team,
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

  if (isCampaignLoading || isAttendeeResourceLoading || isLoading || isIndividualsLoading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh", width: "100%" }}>
        <Loader page={true} />
      </div>
    );

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
            <div style={detailLabelStyle}>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_NUMBER_COLUMN)} :</div>
            <div style={detailValueStyle}>{registerData?.registerNumber || registerNumber || NA}</div>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <div style={detailLabelStyle}>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_NAME_COLUMN)} :</div>
            <div style={detailValueStyle}>{registerData?.name || registerName || NA}</div>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <div style={detailLabelStyle}>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_ATTENDANCE_OFFICER_COLUMN)} :</div>
            <div style={detailValueStyle}>{getOwnerName()}</div>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <div style={detailLabelStyle}>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_NO_OF_USERS_COLUMN)} :</div>
            <div style={detailValueStyle}>{attendees.length}</div>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <div style={detailLabelStyle}>{t(I18N_KEYS.COMPONENTS.STATUS)} :</div>
            <div style={detailValueStyle}>{registerData?.status || NA}</div>
          </div>
        </div>
      </Card>

      {/* ── Attendees Table Card ── */}
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
              onClick={() => navigate(
                `/${window.contextPath}/employee/campaign/map-attendees-screen?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}&registerId=${registerId}&registerNumber=${registerNumber}&registerName=${encodeURIComponent(registerName || "")}`
              )}
            />
            
          </div>
        </div>
        <DataTable
          columns={columns}
          data={tableData}
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

      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          type={showToast.key === "error" ? "error" : showToast.key === "warning" ? "warning" : "success"}
          label={showToast.label}
          onClose={() => setShowToast(null)}
        />
      )}
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
