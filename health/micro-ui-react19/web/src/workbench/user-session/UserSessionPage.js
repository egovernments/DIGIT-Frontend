import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, HeaderComponent, Loader, MultiSelectDropdown, PopUp, TextInput, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { ensureUserSessionI18n } from "../../../packages/modules/campaign-manager/src/utils/i18nKeyConstants";
import { tableCustomStyle } from "../../../packages/modules/campaign-manager/src/components/tableCustomStyle";
import { getResolvedTenantId, isRevokeSuccessful, lookupEmployeeUuidByCode, revokeUserSession, searchActiveUsersByCampaignNumber, searchUserSessions } from "./service";
import { getEmployeeHomeRouteLink, getUserSessionRouteLink, hasUserSessionAccess, USER_SESSION_PAGE_SIZE } from "./config";

const applyLocalFilters = ({ rows, selectedRoles, statusFilter, userNameFilter = "" }) => {
  return rows.filter((row) => {
    const normalizedUserNameFilter = String(userNameFilter || "").trim().toLowerCase();
    if (normalizedUserNameFilter) {
      const candidateValues = [row?.userName, row?.sessionUserName, row?.employeeCode]
        .map((value) => String(value || "").toLowerCase())
        .filter(Boolean);
      const matchesUserName = candidateValues.some((value) => value.includes(normalizedUserNameFilter));
      if (!matchesUserName) return false;
    }

    if (selectedRoles.length > 0) {
      const rowRoleSet = new Set((row?.roles || []).map((role) => String(role).toUpperCase()));
      const hasAnyRole = selectedRoles.some((role) => rowRoleSet.has(String(role).toUpperCase()));
      if (!hasAnyRole) return false;
    }

    if (statusFilter === "ACTIVE" && row?.status !== "ACTIVE") return false;
    if (statusFilter === "INACTIVE" && row?.status !== "INACTIVE") return false;

    return true;
  });
};

const UserSessionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const BreadCrumbs = Digit?.ComponentRegistryService?.getComponent("BreadCrumbs");
  const resolveLabel = (key, fallbackKey) => {
    const value = t(key);
    if (value !== key) return value;
    if (fallbackKey) return t(fallbackKey);
    return value;
  };

  const [userName, setUserName] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(USER_SESSION_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);

  useEffect(() => {
    ensureUserSessionI18n();
  }, []);

  const tenantId = getResolvedTenantId();
  const currentPage = Math.floor(pageOffset / rowsPerPage) + 1;
  const isCampaignSearchMode = Boolean(campaignName?.trim());

  const fetchUserSessions = async (offset = 0, criteria = {}) => {
    setError("");
    setIsLoading(true);

    try {
      const effectiveCampaignName = criteria?.campaignName ?? campaignName;
      const effectiveUserName = criteria?.userName ?? userName;
      const effectiveSelectedRoles = criteria?.selectedRoles ?? selectedRoles;
      const effectiveStatusFilter = criteria?.statusFilter ?? statusFilter;
      const effectiveCampaignSearchMode = Boolean(String(effectiveCampaignName || "").trim());

      if (effectiveCampaignSearchMode) {
        const transformedRows = await searchActiveUsersByCampaignNumber({
          tenantId,
          campaignNumber: effectiveCampaignName,
        });

        const filteredRows = applyLocalFilters({
          rows: transformedRows,
          selectedRoles: effectiveSelectedRoles,
          statusFilter: effectiveStatusFilter,
          userNameFilter: effectiveUserName,
        });

        setAllRows(transformedRows);
        setRows(filteredRows.slice(offset, offset + rowsPerPage));
        setTotalRows(filteredRows.length);
        return;
      }

      const searchResult = await searchUserSessions({
        tenantId,
        userName: effectiveUserName,
        limit: rowsPerPage,
        offset,
      });

      const transformedRows = searchResult?.rows || [];

      const filteredRows = applyLocalFilters({
        rows: transformedRows,
        selectedRoles: effectiveSelectedRoles,
        statusFilter: effectiveStatusFilter,
        userNameFilter: effectiveUserName,
      });

      setAllRows(transformedRows);
      setRows(filteredRows);
      setTotalRows(searchResult?.totalCount ?? transformedRows.length);
    } catch (searchError) {
      setError(searchError?.message || t("USER_SESSION_FETCH_FAILED"));
      setAllRows([]);
      setRows([]);
      setTotalRows(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSessions(pageOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageOffset, rowsPerPage]);

  useEffect(() => {
    const filteredRows = applyLocalFilters({
      rows: allRows,
      selectedRoles,
      statusFilter,
      userNameFilter: userName,
    });

    if (isCampaignSearchMode) {
      setRows(filteredRows.slice(pageOffset, pageOffset + rowsPerPage));
      setTotalRows(filteredRows.length);
      return;
    }

    setRows(filteredRows);
  }, [allRows, selectedRoles, statusFilter, isCampaignSearchMode, pageOffset, rowsPerPage, userName]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const roleOptions = useMemo(() => {
    const roleSet = new Set();
    allRows.forEach((row) => {
      (row?.roles || []).forEach((role) => roleSet.add(role));
    });
    return Array.from(roleSet).sort((a, b) => a.localeCompare(b));
  }, [allRows]);

  const roleDropdownOptions = useMemo(() => roleOptions.map((role) => ({ code: role, name: role })), [roleOptions]);

  const selectedRoleOptions = useMemo(() => {
    const selectedSet = new Set(selectedRoles.map((role) => String(role).toUpperCase()));
    return roleDropdownOptions.filter((option) => selectedSet.has(String(option?.code || "").toUpperCase()));
  }, [roleDropdownOptions, selectedRoles]);

  const updateSelectedRolesFromDropdown = (value) => {
    if (!Array.isArray(value)) {
      setSelectedRoles([]);
      return;
    }

    const nextRoles = value
      .map((item) => {
        if (Array.isArray(item)) {
          return item?.[1]?.code || item?.[1]?.name || null;
        }
        return item?.code || item?.name || null;
      })
      .filter(Boolean);

    setSelectedRoles(nextRoles);
  };

  const onSearch = async (event) => {
    event?.preventDefault();

    const nextUserName = userNameInput;
    setUserName(nextUserName);

    if (pageOffset === 0) {
      await fetchUserSessions(0, {
        userName: nextUserName,
      });
      return;
    }

    setPageOffset(0);
  };

  const onClearFilters = () => {
    setSelectedRoles([]);
    setStatusFilter("");

    if (pageOffset !== 0) {
      setPageOffset(0);
    }
  };

  const onApplyFilters = async () => {
    if (pageOffset === 0) {
      await fetchUserSessions(0);
      return;
    }

    setPageOffset(0);
  };

  const onClear = async () => {
    setUserNameInput("");
    setUserName("");
    setCampaignName("");
    setSelectedRoles([]);
    setStatusFilter("");

    if (pageOffset === 0) {
      await fetchUserSessions(0, {
        userName: "",
        campaignName: "",
        selectedRoles: [],
        statusFilter: "",
      });
      return;
    }

    setPageOffset(0);
  };

  const onOpenRevoke = (row) => {
    if (!row?.userUuid && !row?.employeeCode && !row?.userName) {
      setToast({ key: "error", label: t("USER_SESSION_EMPLOYEE_LOOKUP_NOT_FOUND"), type: "error" });
      return;
    }
    setSelectedRow(row);
    setShowRevokeModal(true);
  };

  const onCloseRevoke = () => {
    setShowRevokeModal(false);
    setSelectedRow(null);
  };

  const onConfirmRevoke = async () => {
    if (!selectedRow) {
      return;
    }

    setIsRevoking(true);
    try {
      let resolvedUserUuid = selectedRow?.userUuid || null;

      if (!resolvedUserUuid) {
        const lookupResult = await lookupEmployeeUuidByCode({
          tenantId,
          employeeCode: selectedRow?.employeeCode || selectedRow?.sessionUserName || selectedRow?.userName,
        });

        if (lookupResult?.status === "ambiguous") {
          setToast({ key: "error", label: t("USER_SESSION_EMPLOYEE_LOOKUP_AMBIGUOUS"), type: "error" });
          return;
        }

        if (lookupResult?.status !== "resolved" || !lookupResult?.userUuid) {
          setToast({ key: "error", label: t("USER_SESSION_EMPLOYEE_LOOKUP_NOT_FOUND"), type: "error" });
          return;
        }

        resolvedUserUuid = lookupResult.userUuid;
      }

      const revokeResponse = await revokeUserSession({
        userUuid: resolvedUserUuid,
        tenantId: selectedRow?.tenantId || tenantId,
      });

      if (!isRevokeSuccessful(revokeResponse)) {
        throw new Error(t("USER_SESSION_REVOKE_FAILED"));
      }

      setToast({ key: "success", label: t("USER_SESSION_REVOKE_SUCCESS"), type: "success" });
      onCloseRevoke();
      await fetchUserSessions(pageOffset);
    } catch (revokeError) {
      setToast({
        key: "error",
        label: revokeError?.message || t("USER_SESSION_REVOKE_FAILED"),
        type: "error",
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const tableColumns = useMemo(
    () => [
      {
        name: t("HR_USERNAME_LABEL"),
        selector: (row) => row.userName,
      },
      {
        name: t("HR_EMP_NAME_LABEL"),
        selector: (row) => row.name,
      },
      {
        name: t("HR_EMP_STATUS_LABEL"),
        selector: (row) => row.status,
      },
      {
        name: t("DEVICE_ID"),
        selector: (row) => row.deviceId,
      },
      {
        name: t("CS_COMMON_ACTION"),
        cell: (row) => (
          <Button
            type="button"
            variation="secondary"
            label={t("USER_SESSION_REVOKE")}
            isDisabled={isRevoking || (!row?.userUuid && !row?.employeeCode && !row?.userName)}
            onClick={() => onOpenRevoke(row)}
          />
        ),
      },
    ],
    [isRevoking, t]
  );

  const userSessionLink = getUserSessionRouteLink();
  const employeeHomeLink = getEmployeeHomeRouteLink();
  const isAuthorizedForUserSession = hasUserSessionAccess();
  const pageTitle = t("USER_SESSION");
  const homeLabel = resolveLabel("HR_COMMON_BUTTON_HOME", "CS_COMMON_HOME");

  useEffect(() => {
    if (!isAuthorizedForUserSession) {
      window.location.replace(employeeHomeLink);
    }
  }, [isAuthorizedForUserSession, employeeHomeLink]);

  if (!isAuthorizedForUserSession) {
    return null;
  }

  return (
    <div className="ground-container" style={{ marginBottom: "80px" }}>
      {BreadCrumbs ? (
        <BreadCrumbs
          crumbs={[
            {
              content: homeLabel,
              internalLink: employeeHomeLink,
              show: true,
            },
            {
              content: pageTitle,
              internalLink: userSessionLink,
              show: true,
            },
          ]}
        />
      ) : (
        <nav className="digit-bread-crumb user-session-breadcrumb-fallback" aria-label="breadcrumb">
          <div className="digit-bread-crumb--item">
            <button type="button" className="digit-bread-crumb-content user-session-breadcrumb-link" onClick={() => navigate(employeeHomeLink)}>
              {homeLabel}
            </button>
            <span className="digit-bread-crumb-seperator">/</span>
          </div>
          <div className="digit-bread-crumb--item">
            <span className="digit-bread-crumb-content current">{pageTitle}</span>
          </div>
        </nav>
      )}

      <div className="user-session-page-header">
        <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
          {pageTitle}
        </HeaderComponent>
      </div>

      <div className="digit-inbox-search-wrapper user-session-page">
        <div className="user-session-layout">
          <Card className="user-session-filter-card user-session-filter-column">
            <div style={{ fontWeight: 700, marginBottom: "1rem", color: "#0B4B66" }}>{t("ES_COMMON_FILTERS")}</div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, color: "#0B4B66" }}>{t("HR_COMMON_TABLE_COL_ROLE")}</label>
              <div className="user-session-role-dropdown-wrap">
                <MultiSelectDropdown
                  t={t}
                  options={roleDropdownOptions}
                  optionsKey="name"
                  selected={selectedRoleOptions}
                  onSelect={updateSelectedRolesFromDropdown}
                  onClose={updateSelectedRolesFromDropdown}
                  isSearchable={true}
                  addSelectAllCheck={true}
                  config={{ isDropdownWithChip: false, chipKey: "code" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, color: "#0B4B66" }}>{t("HR_EMP_STATUS_LABEL")}</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="radio" name="status-filter" value="ACTIVE" checked={statusFilter === "ACTIVE"} onChange={(event) => setStatusFilter(event.target.value)} />
                  {t("HR_ACTIVATE_HEAD")}
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="radio" name="status-filter" value="INACTIVE" checked={statusFilter === "INACTIVE"} onChange={(event) => setStatusFilter(event.target.value)} />
                  {t("HR_DEACTIVATE_HEAD")}
                </label>
              </div>
            </div>

            <div className="user-session-filter-actions">
              <Button type="button" variation="primary" label={t("HRMS_APPLY_FILTERS")} onClick={onApplyFilters} isDisabled={isLoading} />
              <button type="button" className="user-session-clear-filter-link" onClick={onClearFilters} disabled={isLoading}>
                {t("HRMS_CLEAR_FILTER")}
              </button>
            </div>
          </Card>

          <div className="user-session-content-column">
            <Card className="user-session-search-card">
              <form onSubmit={onSearch}>
                <div className="user-session-search-grid">
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, color: "#0B4B66" }}>{t("HR_USERNAME_LABEL")}</label>
                    <TextInput
                      type="text"
                      value={userNameInput}
                      onChange={(event) => setUserNameInput(event.target.value)}
                      placeholder={t("HR_USERNAME_LABEL")}
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, color: "#0B4B66" }}>{t("HCM_CAMPAIGN_NAME")}</label>
                    <TextInput
                      type="text"
                      value={campaignName}
                      onChange={(event) => setCampaignName(event.target.value)}
                      placeholder={t("HCM_CAMPAIGN_NAME")}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div className="user-session-search-actions">
                  <Button
                    type="submit"
                    variation="primary"
                    label={isLoading ? t("CS_COMMON_SEARCHING") : t("ES_COMMON_SEARCH")}
                    isDisabled={isLoading}
                  />
                  <Button type="button" variation="secondary" label={t("ES_COMMON_CLEAR_SEARCH")} onClick={onClear} />
                </div>
              </form>

              {error ? <div style={{ color: "#B91900", marginTop: "0.75rem" }}>{error}</div> : null}
            </Card>

            <Card className="user-session-table-card">
              <DataTable
                columns={tableColumns}
                data={rows}
                customStyles={tableCustomStyle}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={rowsPerPage}
                paginationDefaultPage={currentPage}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                onChangePage={(page) => setPageOffset((page - 1) * rowsPerPage)}
                onChangeRowsPerPage={(newPerPage, page) => {
                  setRowsPerPage(newPerPage);
                  setPageOffset((page - 1) * newPerPage);
                }}
                paginationComponentOptions={{
                  rowsPerPageText: t("CS_COMMON_ROWS_PER_PAGE"),
                }}
                progressPending={isLoading}
                progressComponent={<Loader />}
                persistTableHead
                noDataComponent={<div style={{ padding: "0.75rem 0", color: "#505A5F" }}>{t("ES_COMMON_NO_DATA")}</div>}
              />
            </Card>
          </div>
        </div>
      </div>

      {showRevokeModal ? (
        <PopUp
          className="boundaries-pop-module"
          type="default"
          heading={t("USER_SESSION_REVOKE")}
          onOverlayClick={onCloseRevoke}
          onClose={onCloseRevoke}
          sortFooterChildren={true}
          footerChildren={[
            <Button type="button" size="large" variation="secondary" label={t("CS_COMMON_CANCEL")} onClick={onCloseRevoke} />,
            <Button
              type="button"
              size="large"
              variation="primary"
              label={isRevoking ? t("CS_COMMON_SUBMITTING") : t("USER_SESSION_REVOKE")}
              onClick={onConfirmRevoke}
              isDisabled={isRevoking}
            />,
          ]}
        >
          <div style={{ marginTop: "0.5rem" }}>
            {t("USER_SESSION_REVOKE_CONFIRMATION", { userName: selectedRow?.userName || "-" })}
          </div>
        </PopUp>
      ) : null}

      {toast ? <Toast error={toast.key === "error"} label={toast.label} type={toast.type} onClose={() => setToast(null)} isDleteBtn={true} /> : null}
    </div>
  );
};

export default UserSessionPage;
