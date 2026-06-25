import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Button,
  Loader,
  Toast,
  PopUp,
  TextInput,
  CardLabel,
  HeaderComponent,
} from "@egovernments/digit-ui-components";
import TagComponent from "../../../components/TagComponent";
import DataTable from "react-data-table-component";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
import { tableCustomStyle } from "../../../components/tableCustomStyle";

const BLUE = "#0B4B66";
const PRIMARY = "#C84C0E";

const MapUsersToRegistersScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignName = searchParams.get("campaignName");
  const campaignNumber = searchParams.get("campaignNumber");
  const tenantId =
    searchParams.get("tenantId") || Digit.ULBService.getCurrentTenantId();
  const attendanceContextPath =
    window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") ||
    "health-attendance";

  // Fetch campaign data to get id and serviceCode
  const reqCriteria = {
    url: `/project-factory/v1/project-type/search`,
    body: { CampaignDetails: { tenantId, campaignNumber } },
    config: {
      enabled: !!campaignNumber,
      select: (data) => data?.CampaignDetails?.[0],
      staleTime: 0,
      cacheTime: 0,
    },
  };
  const {
    data: campaignData,
    isLoading: isCampaignLoading,
    isFetching: isCampaignFetching,
  } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // Check resource-details status for register creation
  const resourceSearchCriteria = {
    //TODO check api call
    url: `/project-factory/v1/resource-details/_search`,
    body: {
      ResourceDetailsCriteria: {
        tenantId,
        campaignId: campaignData?.id,
        type: ["attendanceRegister"],
        isActive: true,
      },
      // Pagination: {
      //   limit: 50,
      //   offset: 0,
      //   sortBy: "createdTime",
      //   sortOrder: "DESC",
      // },
    },
    config: {
      enabled: !!campaignData?.id,
      select: (data) => data?.ResourceDetails || [],
      staleTime: 0,
      cacheTime: 0,
    },
  };
  const {
    data: resourceDetails = [],
    isLoading: isResourceLoading,
    isFetching: isResourceFetching,
    refetch: refetchResourceDetails,
  } = Digit.Hooks.useCustomAPIHook(resourceSearchCriteria);

  // Derive register creation status from resource details
  const registerCreationStatus =
    resourceDetails.length > 0 ? resourceDetails[0]?.status : null;

  // Poll every 5 seconds while register creation is in progress
  useEffect(() => {
    if (
      registerCreationStatus !== "creating" &&
      registerCreationStatus !== "toCreate"
    )
      return;
    const interval = setInterval(() => {
      refetchResourceDetails();
    }, 10000);
    return () => clearInterval(interval);
  }, [registerCreationStatus]);
  const isRegisterCreationCompleted = registerCreationStatus === "completed";

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Show toast when resource status is not completed
  useEffect(() => {
    if (isResourceLoading || isResourceFetching || resourceDetails.length === 0)
      return;
    if (
      registerCreationStatus === "creating" ||
      registerCreationStatus === "toCreate"
    ) {
      setShowToast({
        key: "warning",
        label: t("HCM_REGISTER_CREATION_IN_PROGRESS"),
      });
    } else if (registerCreationStatus === "failed") {
      setShowToast({ key: "error", label: t("HCM_REGISTER_CREATION_FAILED") });
    }
  }, [registerCreationStatus, isResourceLoading, isResourceFetching]);

  const [registerIdFilter, setRegisterIdFilter] = useState("");
  const [officerFilter, setOfficerFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    registerId: "",
    officer: "",
  });

  const isSearchDisabled =
    registerIdFilter.length === 0 && officerFilter.length === 0;
  // (registerIdFilter.length > 0 && registerIdFilter.length < 3) ||
  // (officerFilter.length > 0 && officerFilter.length < 3);

  // Fetch attendance registers only when register creation is completed
  const attendanceParams = {
    tenantId,
    // campaignId: campaignData?.id,
    campaignNumber: campaignNumber,
    limit: rowsPerPage,
    offset: (currentPage - 1) * rowsPerPage,
  };
  if (appliedFilters.registerId) {
    attendanceParams.serviceCode = appliedFilters.registerId;
    attendanceParams.isServiceCodeExact = false;
  }
  // else if (campaignData?.serviceCode) {
  //   attendanceParams.serviceCode = campaignData.serviceCode;
  // }
  if (appliedFilters.officer) {
    attendanceParams.staffName = appliedFilters.officer;
    attendanceParams.staffTypes = "APPROVER";
  }

  const attendanceReqCriteria = {
    url: `/${attendanceContextPath}/v1/_search`,
    params: attendanceParams,
    body: {},
    config: {
      enabled: !!campaignNumber && isRegisterCreationCompleted,
      select: (data) => ({
        registers: data?.attendanceRegister || [],
        totalCount: data?.totalCount ?? 0,
      }),
      staleTime: 0,
      cacheTime: 0,
      keepPreviousData: true,
    },
    changeQueryName: `registers_${currentPage}_${rowsPerPage}_${appliedFilters.registerId}_${appliedFilters.officer}`,
  };
  const {
    data: registerData = { registers: [], totalCount: 0 },
    isLoading,
    isFetching,
    refetch: refetchRegisters,
  } = Digit.Hooks.useCustomAPIHook(attendanceReqCriteria);
  const registers = registerData.registers;
  const totalRegisters = registerData.totalCount;

  const [showToast, setShowToast] = useState(null);
  const [deletePopup, setDeletePopup] = useState(null);

  // Mutation hook for deleting a register
  const deleteReqCriteria = {
    url: `/${attendanceContextPath}/v1/_delete`,
    params: {},
    body: {},
    config: { enabled: false },
  };
  const deleteMutation = Digit.Hooks.useCustomAPIMutationHook(
    deleteReqCriteria,
  );

  // Helper to get the approver staff name from a register
  const getApproverName = (reg) => {
    const approver = reg?.staff?.find((s) => s.staffType === "APPROVER");
    return approver?.additionalDetails?.staffName || t(I18N_KEYS.COMMON.NA);
  };

  const filteredRegisters = registers;

  const handleSearch = () => {
    setAppliedFilters({ registerId: registerIdFilter, officer: officerFilter });
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setRegisterIdFilter("");
    setOfficerFilter("");
    setAppliedFilters({ registerId: "", officer: "" });
    setCurrentPage(1);
  };

  const handleMapUsers = (register) => {
    navigate(
      `/${
        window.contextPath
      }/employee/campaign/register-details?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}&registerId=${
        register.id
      }&registerNumber=${encodeURIComponent(
        register.registerNumber,
      )}&registerName=${encodeURIComponent(
        register.name,
      )}&boundaryCode=${encodeURIComponent(register.localityCode || "")}`,
    );
  };

  const handleDeleteRegister = (register) => {
    setDeletePopup(register);
  };

  const confirmDelete = () => {
    const register = deletePopup;
    setDeletePopup(null);
    deleteMutation.mutate(
      {
        url: `/${attendanceContextPath}/v1/_delete`,
        body: {
          attendanceRegister: [{ id: register.id, tenantId }],
        },
        config: { enable: true },
      },
      {
        onSuccess: () => {
          setShowToast({
            key: "success",
            label: t("HCM_REGISTER_DELETED_SUCCESSFULLY"),
          });
          setTimeout(() => setShowToast(null), 3000);
          refetchRegisters();
        },
        onError: (error) => {
          setShowToast({
            key: "error",
            label:
              error?.response?.data?.Errors?.[0]?.description ||
              t("HCM_ERROR_DELETING_REGISTER"),
          });
          setTimeout(() => setShowToast(null), 3000);
        },
      },
    );
  };

  const handleBack = () => {
    navigate(
      `/${window.contextPath}/employee/campaign/setup-attendance?campaignName=${campaignName}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
    );
  };

  const columns = [
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_NAME_COLUMN),
      selector: (row) => row.name,
      cell: (row) => (
        <span
          title={row.name}
          onClick={() => handleMapUsers(row)}
          style={{
            color: PRIMARY,
            cursor: "pointer",
            fontWeight: "500",
            textDecoration: "underline",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.name}
        </span>
      ),
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_ID_LABEL),
      selector: (row) => row.serviceCode,
    },
    // {
    //   name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_NUMBER_COLUMN),
    //   selector: (row) => row.registerNumber,
    //   cell: (row) => (
    //     <span
    //       onClick={() => handleMapUsers(row)}
    //       style={{ color: PRIMARY, cursor: "pointer", fontWeight: "500", textDecoration: "underline" }}
    //     >
    //       {row.registerNumber}
    //     </span>
    //   ),
    // },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_ATTENDANCE_OFFICER_COLUMN),
      selector: (row) => getApproverName(row),
    },
    {
      name: t(I18N_KEYS.CAMPAIGN_CREATE.HCM_NO_OF_USERS_COLUMN),
      selector: (row) => row.attendees?.length || 0,
    },
    {
      name: t(I18N_KEYS.COMPONENTS.STATUS),
      cell: (row) => (
        <span
          style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: "12px",
            fontSize: "0.8rem",
            fontWeight: "500",
            background: row.status === "ACTIVE" ? "#e6f4ea" : "#fce8e6",
            color: row.status === "ACTIVE" ? "#137333" : "#c5221f",
          }}
        >
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

  if (
    isCampaignLoading ||
    isCampaignFetching ||
    isResourceLoading ||
    isResourceFetching ||
    isLoading
  )
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          width: "100%",
        }}
      >
        <Loader page={true} />
      </div>
    );

  return (
    <div style={{ paddingBottom: "4.5rem" }}>
      {/* ── Search Card (contains page heading + filters) ── */}
      <Card style={{ marginBottom: "1.5rem" }}>
        {/* Campaign chip + users alert */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {campaignName && <TagComponent campaignName={campaignName} />}
        </div>

        {/* Page heading */}
        <HeaderComponent className="attendance-screen-headers">
          {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_MAP_USERS_TO_REGISTERS_PAGE_HEADING)}
        </HeaderComponent>
        <p className="info-text">
          {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_MAP_USERS_TO_REGISTERS_PAGE_DESC)}
        </p>
        {/* Search filters */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              minWidth: "20rem",
            }}
          >
            <CardLabel style={{ width: "100%" }}>
              {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_REGISTER_ID_LABEL)}
            </CardLabel>
            <div className="digit-field" style={{ width: "100%" }}>
              <TextInput
                type="text"
                value={registerIdFilter}
                onChange={(e) => setRegisterIdFilter(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              minWidth: "20rem",
            }}
          >
            <CardLabel style={{ width: "100%" }}>
              {t(I18N_KEYS.CAMPAIGN_CREATE.HCM_ATTENDANCE_OFFICER_COLUMN)}
            </CardLabel>
            <div className="digit-field" style={{ width: "100%" }}>
              <TextInput
                type="text"
                value={officerFilter}
                onChange={(e) => setOfficerFilter(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.875rem",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            <Button
              label={t(I18N_KEYS.COMMON.CLEAR_ALL)}
              variation="teritiary"
              onClick={handleClearSearch}
              type="button"
              size={"medium"}
            />
            <Button
              label={t(I18N_KEYS.CAMPAIGN_CREATE.HCM_SEARCH)}
              variation="primary"
              icon="Search"
              onClick={handleSearch}
              isDisabled={isSearchDisabled}
              type="submit"
              size={"medium"}
            />
          </div>
        </div>
      </Card>

      {/* ── Registers Table Card ── */}
      <Card style={{ padding: "1.5rem", overflow: "hidden" }}>
        <DataTable
          className="digit-map-users-to-registers-table"
          columns={columns}
          data={filteredRegisters}
          customStyles={tableCustomStyle}
          pagination
          paginationServer
          paginationTotalRows={totalRegisters}
          paginationPerPage={rowsPerPage}
          paginationDefaultPage={currentPage}
          paginationRowsPerPageOptions={[10, 20, 50, 100]}
          onChangePage={(page) => setCurrentPage(page)}
          onChangeRowsPerPage={(newPerPage) => {
            setRowsPerPage(newPerPage);
            setCurrentPage(1);
          }}
          paginationComponentOptions={{
            rowsPerPageText: t("CS_COMMON_ROWS_PER_PAGE"),
          }}
          progressPending={isFetching}
          progressComponent={<Loader />}
          persistTableHead
          noDataComponent={
            <div
              style={{ padding: "2rem", color: "#888", fontSize: "0.875rem" }}
            >
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
          alertHeading={t("HCM_CONFIRM_DELETE_REGISTER")}
          alertMessage={t("HCM_DELETE_REGISTER_CONFIRM_MSG")}
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
              onClick={confirmDelete}
            />,
          ]}
          sortFooterChildren={true}
        />
      )}

      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          type={
            showToast.key === "error"
              ? "error"
              : showToast.key === "warning"
              ? "warning"
              : "success"
          }
          label={showToast.label}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
};

export default MapUsersToRegistersScreen;
