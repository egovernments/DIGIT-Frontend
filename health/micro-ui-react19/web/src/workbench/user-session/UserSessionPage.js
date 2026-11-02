import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, HeaderComponent, Loader, PopUp, TextInput, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { ensureUserSessionI18n } from "../../../packages/modules/campaign-manager/src/utils/i18nKeyConstants";
import { tableCustomStyle } from "../../../packages/modules/campaign-manager/src/components/tableCustomStyle";
import { getResolvedTenantId, isRevokeSuccessful, lookupEmployeeUuidByCode, revokeUserSession, searchActiveUsersByCampaignNumber } from "./service";
import { getEmployeeHomeRouteLink, getUserSessionRouteLink, hasUserSessionAccess, USER_SESSION_PAGE_SIZE } from "./config";

const applyLocalFilters = ({ rows, userNameFilter = "" }) => {
  return rows.filter((row) => {
    const normalizedUserNameFilter = String(userNameFilter || "").trim().toLowerCase();
    if (normalizedUserNameFilter) {
      const candidateValues = [row?.userName, row?.sessionUserName, row?.employeeCode]
        .map((value) => String(value || "").toLowerCase())
        .filter(Boolean);
      const matchesUserName = candidateValues.some((value) => value.includes(normalizedUserNameFilter));
      if (!matchesUserName) return false;
    }

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
  const [campaignNameInput, setCampaignNameInput] = useState("");
  const [campaignName, setCampaignName] = useState("");

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
      const effectiveCampaignSearchMode = Boolean(String(effectiveCampaignName || "").trim());

      if (!effectiveCampaignSearchMode) {
        setAllRows([]);
        setRows([]);
        setTotalRows(0);
        return;
      }

      const transformedRows = await searchActiveUsersByCampaignNumber({
        tenantId,
        campaignNumber: effectiveCampaignName,
      });

      const filteredRows = applyLocalFilters({
        rows: transformedRows,
        userNameFilter: effectiveUserName,
      });

      setAllRows(transformedRows);
      setRows(filteredRows.slice(offset, offset + rowsPerPage));
      setTotalRows(filteredRows.length);
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
  }, [pageOffset, rowsPerPage, campaignName]);

  useEffect(() => {
    const filteredRows = applyLocalFilters({
      rows: allRows,
      userNameFilter: userName,
    });

    setRows(filteredRows.slice(pageOffset, pageOffset + rowsPerPage));
    setTotalRows(filteredRows.length);
  }, [allRows, pageOffset, rowsPerPage, userName]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const onCampaignSearch = async (event) => {
    event?.preventDefault();
    const nextCampaignName = String(campaignNameInput || "").trim();
    const hasCampaignChanged = nextCampaignName !== campaignName;
    setCampaignName(nextCampaignName);
    setUserName("");
    setUserNameInput("");

    if (pageOffset !== 0) {
      setPageOffset(0);
      return;
    }

    if (hasCampaignChanged) {
      return;
    }

    await fetchUserSessions(0, {
      campaignName: nextCampaignName,
      userName: "",
    });
  };

  const onUserNameSearch = (event) => {
    event?.preventDefault();
    const nextUserName = String(userNameInput || "").trim();
    setUserName(nextUserName);
    if (pageOffset !== 0) {
      setPageOffset(0);
    }
  };

  const onClear = async () => {
    const hasCampaignSearchApplied = Boolean(campaignName);
    setCampaignNameInput("");
    setCampaignName("");
    setUserNameInput("");
    setUserName("");

    if (pageOffset !== 0) {
      setPageOffset(0);
      return;
    }

    if (hasCampaignSearchApplied) {
      return;
    }

    if (pageOffset === 0) {
      await fetchUserSessions(0, {
        campaignName: "",
        userName: "",
      });
      return;
    }
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
          <div className="user-session-content-column">
            <Card className="user-session-search-card">
              <form onSubmit={onCampaignSearch}>
                <div className="user-session-search-grid">
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, color: "#0B4B66" }}>{t("HCM_CAMPAIGN_NAME")}</label>
                    <TextInput
                      type="text"
                      value={campaignNameInput}
                      onChange={(event) => setCampaignNameInput(event.target.value)}
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

            {isCampaignSearchMode ? (
              <Card className="user-session-search-card" style={{ marginTop: "1rem" }}>
                <form onSubmit={onUserNameSearch}>
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
                  </div>

                  <div className="user-session-search-actions">
                    <Button type="submit" variation="primary" label={t("ES_COMMON_SEARCH")} isDisabled={isLoading} />
                  </div>
                </form>
              </Card>
            ) : null}

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
                noDataComponent={
                  <div style={{ padding: "0.75rem 0", color: "#505A5F" }}>
                    {isCampaignSearchMode ? t("ES_COMMON_NO_DATA") : t("USER_SESSION_SEARCH_BY_CAMPAIGN_PROMPT")}
                  </div>
                }
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
