import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Loader, Toast, PopUp } from "@egovernments/digit-ui-components";
import DataTable from "react-data-table-component";
import TagComponent from "../../../components/TagComponent";
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
  const [deletePopup, setDeletePopup] = useState(null);

  // Mutation hook for de-enrolling an attendee
  const deenrollReqCriteria = {
    url: `/attendance/attendee/v1/_delete`,
    params: {},
    body: {},
    config: { enabled: false },
  };
  const deenrollMutation = Digit.Hooks.useCustomAPIMutationHook(deenrollReqCriteria);

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

  const isCampaignStarted = campaignData?.startDate ? campaignData.startDate <= Date.now() : false;

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
    if (attendeeMappingStatus !== "creating" && attendeeMappingStatus !== "toCreate") return;
    const interval = setInterval(() => {
      refetchAttendeeResource();
    }, 10000);
    return () => clearInterval(interval);
  }, [attendeeMappingStatus]);
  const isAttendeeCreationCompleted = attendeeMappingStatus === "completed";

  // Show toast based on attendee mapping status
  useEffect(() => {
    if (isAttendeeResourceLoading || isAttendeeResourceFetching || attendeeResourceDetails.length === 0) return;
    if (attendeeMappingStatus === "creating" || attendeeMappingStatus === "toCreate") {
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
      enabled: !!registerNumber,
      select: (data) => data?.attendanceRegister?.[0],
      staleTime: 0,
      cacheTime: 0,
    },
  };
  const { data: registerData, isLoading, refetch: refetchRegister } = Digit.Hooks.useCustomAPIHook(attendanceReqCriteria);

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
      status: attendee.denrollmentDate && attendee.denrollmentDate <= Date.now() ? "Inactive" : "Active",
    };
  }), [attendees, individualMap, NA]);

  const getApproverName = () => {
    const approver = staff.find((s) => s.staffType === "APPROVER");
    return approver?.additionalDetails?.staffName || NA;
  };

  const handleDeleteUser = (user) => {
    setDeletePopup(user);
  };

  const confirmDeleteUser = () => {
    const user = deletePopup;
    setDeletePopup(null);
    deenrollMutation.mutate(
      {
        url: `/attendance/attendee/v1/_delete`,
        body: {
          attendees: [
            {
              registerId: registerId,
              individualId: user.individualId,
              enrollmentDate: null,
              denrollmentDate: new Date().getTime(),
              tenantId: String(tenantId),
            },
          ],
        },
        config: { enable: true },
      },
      {
        onSuccess: () => {
          setShowToast({ key: "success", label: t("HCM_ATTENDEE_DE_ENROLL_SUCCESS") });
          setTimeout(() => setShowToast(null), 3000);
          refetchRegister();
        },
        onError: (error) => {
          setShowToast({
            key: "error",
            label: error?.response?.data?.Errors?.[0]?.description || t("HCM_ERROR_DE_ENROLLING_ATTENDEE"),
          });
          setTimeout(() => setShowToast(null), 3000);
        },
      }
    );
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
      cell: () => {
        const code = registerData?.localityCode || boundaryCode || NA;
        return (
          <span title={t(code)} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {t(code)}
          </span>
        );
      },
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
      cell: (row) =>
        row.status === "Inactive" ? (
          <span style={{ color: "#888", fontSize: "0.8rem", fontStyle: "italic" }}>{t("HCM_ALREADY_REMOVED")}</span>
        ) : (
          <span title={!isCampaignStarted ? t("HCM_DELETE_DISABLED_CAMPAIGN_NOT_STARTED") : ""}>
            <Button
              label={t(I18N_KEYS.COMPONENTS.WBH_DELETE)}
              variation="secondary"
              size="small"
              icon="Delete"
              isDisabled={!isCampaignStarted}
              onClick={() => handleDeleteUser(row)}
            />
          </span>
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
    <div style={{ paddingBottom: "4.5rem" }}>
      {/* ── Register Details Card ── */}
      <Card style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        {campaignName && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          {campaignName && (
            <TagComponent campaignName={campaignName} />
          )}
        </div>
        )}

        <div style={{ fontWeight: "700", fontSize: "1.5rem", color: BLUE, marginBottom: "1.25rem", lineHeight: "1.2" }}>
          {t(I18N_KEYS.PAGES.REGISTER_DETAILS)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <div style={detailLabelStyle}>{t("HCM_REGISTER_ID")} :</div>
            <div style={detailValueStyle}>{registerData?.serviceCode || NA}</div>
          </div>
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
            <div style={detailValueStyle}>{getApproverName()}</div>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <div style={detailLabelStyle}>{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_NO_OF_USERS_COLUMN)} :</div>
            <div style={detailValueStyle}>{attendees.length}</div>
          </div>
          {/* <div style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
            <div style={detailLabelStyle}>{t(I18N_KEYS.COMPONENTS.STATUS)} :</div>
            <div style={detailValueStyle}>{registerData?.status || NA}</div>
          </div> */}
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
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          paginationComponentOptions={{
            rowsPerPageText: t("CS_COMMON_ROWS_PER_PAGE"),
          }}
          persistTableHead
          noDataComponent={
            <div style={{ padding: "2rem", color: "#888", fontSize: "0.875rem" }}>
              {t(I18N_KEYS.COMPONENTS.NO_RESULTS_FOUND)}
            </div>
          }
        />
      </Card>

      <div className="map-users-footer">
        <Button
          label={t(I18N_KEYS.COMMON.HCM_BACK)}
          variation="secondary"
          icon="ArrowBack"
          type="button"
          onClick={handleBack}
        />
      </div>

      {deletePopup && (
        <PopUp
          className="custom-popup"
          type="alert"
          alertHeading={t("HCM_CONFIRM_DELETE_ATTENDEE")}
          alertMessage={t("HCM_DELETE_ATTENDEE_CONFIRM_MSG")}
          onClose={() => setDeletePopup(null)}
          onOverlayClick={() => setDeletePopup(null)}
          footerChildren={[
            <Button
              type="button"
              size="large"
              variation="secondary"
              label={t("CANCEL")}
              onClick={() => setDeletePopup(null)}
            />,
            <Button
              type="button"
              size="large"
              variation="primary"
              label={t(I18N_KEYS.COMPONENTS.WBH_DELETE)}
              onClick={confirmDeleteUser}
            />,
          ]}
          sortFooterChildren={true}
        />
      )}

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
  minWidth: "180px",
};

const detailValueStyle = {
  fontSize: "0.9375rem",
  fontWeight: "500",
  color: "#0b0c0c",
};

export default RegisterDetailsScreen;
