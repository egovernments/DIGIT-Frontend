import { Button, Card, Loader, NoResultsFound, Tab, Toast } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { CustomSVG } from "@egovernments/digit-ui-components";
import { tableCustomStyle } from "../table_inbox_custom_style";
import { defaultPaginationValues } from "../../utils/constants";
import { getCustomPaginationOptions } from "../../utils";
import CommentPopUp from "../commentPopUp";
import { renderProjectPeriod } from "../../utils/time_conversion";

const CustomInboxTable = ({
  handleTabChange,
  rowsPerPage,
  isLoading,
  tableData,
  customHandleRowsPerPageChange,
  customHandlePaginationChange,
  totalCount,
  statusCount,
  selectedProject,
  selectedPeriod,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [commentLogs, setCommentLogs] = useState(false);
  const [activeLink, setActiveLink] = useState({
    code: "PENDING",
    name: "HCM_AM_PENDING_FOR_APPROVAL",
  });
  const [showToast, setShowToast] = useState(null);
  const [data, setData] = useState(null);

  const musterRollContextPath = window?.globalConfigs?.getConfig("MUSTER_ROLL_CONTEXT_PATH") || "health-muster-roll";

  const searchMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/${musterRollContextPath}/v1/_search`,
  });

  const triggerMusterRollSearch = async (attendanceId) => {
    try {
      await searchMutation.mutateAsync(
        {
          params: {
            tenantId: tenantId,
            registerId: attendanceId,
            billingPeriodId: selectedPeriod?.id,
          },
        },
        {
          onSuccess: (data) => {
            setData(data?.musterRolls?.[0]);
          },
          onError: (error) => {
            setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
          },
        }
      );
    } catch (error) {
      setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
    }
  };

  const handlePaginationChange = (page) => {
    customHandlePaginationChange(page);
  };
  const handleRowsPerPageChange = (newPerPage, page) => {
    customHandleRowsPerPageChange(newPerPage, page);
  };

  const onCommentLogClose = () => {
    setCommentLogs(false);
  };

  const columns = [
    {
      name: <div className="custom-inbox-table-row">{t("HCM_AM_ATTENDANCE_ID")}</div>,
      selector: (row) => (
        <span className="link">
          <Button
            label={t(`${row.id}`)}
            onClick={() => {
              // const existingPaymentInbox = Digit.SessionStorage.get("paymentInbox");
              // const endDate = existingPaymentInbox?.selectedProject?.endDate;

              const selectedP = Digit.SessionStorage.get("selectedPeriod");
              const endDate = selectedP?.periodEndDate;

              if (endDate) {
                const currentDate = Date.now();
                if (!(currentDate <= endDate)) {
                  history.push(
                    `/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}&periodDurationInDays=${selectedPeriod?.periodDurationInDays}`
                  );
                } else {
                  history.push(
                    `/${window?.contextPath}/employee/payments/edit-register?registerNumber=${row?.id}&boundaryCode=${row?.boundary}&registerId=${row?.registerId}`
                  );
                }
              } else {
                console.warn("No endDate found in session storage");
                history.push(
                  `/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}&periodDurationInDays=${selectedPeriod?.periodDurationInDays}`
                );
              }
            }}
            title={t(`${row.id}`)}
            variation="link"
            size={"medium"}
            style={{ minWidth: "unset" }}
          />
        </span>
      ),
    },
    {
      name: (
        <div className="custom-inbox-table-row">
          {activeLink?.code === "PENDING" ? t("HCM_AM_ATTENDANCE_MARKED_BY") : t("HCM_AM_ATTENDANCE_APPROVED_BY")}
        </div>
      ),
      selector: (row) => (
        <div className="ellipsis-cell" title={activeLink?.code === "PENDING" ? row?.markby : row?.approvedBy || t("NA")}>
          {activeLink?.code === "PENDING" ? row?.markby : row?.approvedBy || t("NA")}
        </div>
      ),
    },
    {
      name: <div className="custom-inbox-table-row">{t("HCM_AM_ATTENDANCE_BOUNDARY")}</div>,
      selector: (row) => (
        <div className="ellipsis-cell" title={t(row?.boundary) || t("NA")}>
          {t(row.boundary) || t("NA")}
        </div>
      ),
    },
    {
      name: <div className="custom-inbox-table-row">{t("HCM_AM_ATTENDANCE_ATTENDEES")}</div>,
      selector: (row) => (
        <div className="ellipsis-cell" title={t(row?.status || "0")}>
          {t(row?.status || "0")}
        </div>
      ),
      style: { justifyContent: "flex-end" },
    },
  ];

  if (activeLink?.code === "APPROVED") {
    columns.push({
      name: t("HCM_AM_COMMENT_LOGS"),
      selector: (row) => (
        <Button
          label={t("HCM_AM_VIEW_COMMENT_LOGS")}
          onClick={() => {
            triggerMusterRollSearch(row?.registerId);
          }}
          variation="link"
          size={"medium"}
        />
      ),
    });
  }

  const handleRowClick = (row) => {
    // const existingPaymentInbox = Digit.SessionStorage.get("paymentInbox");
    // const endDate = existingPaymentInbox?.selectedProject?.endDate;

    const selectedP = Digit.SessionStorage.get("selectedPeriod");
    const endDate = selectedP?.periodEndDate;

    if (endDate) {
      const currentDate = Date.now();
      if (!(currentDate <= endDate)) {
        history.push(
          `/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}&periodDurationInDays=${selectedPeriod?.periodDurationInDays}`
        );
      } else {
        history.push(
          `/${window?.contextPath}/employee/payments/edit-register?registerNumber=${row?.id}&boundaryCode=${row?.boundary}&registerId=${row?.registerId}`
        );
      }
    } else {
      console.warn("No endDate found in session storage");
      history.push(
        `/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}&periodDurationInDays=${selectedPeriod?.periodDurationInDays}`
      );
    }

    // history.push(
    //   `/${window?.contextPath}/employee/payments/view-attendance?registerNumber=${row?.id}&boundaryCode=${row?.boundary}`
    // );
  };

  useEffect(() => {
    if (data) {
      setCommentLogs(true);
    }
  }, [data]);

  return (
    <React.Fragment>
      <Card style={{ gap: "0.8rem", height: "90vh", display: "flex", flexDirection: "column" }}>
        <div className="summary-sub-heading" style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
          {renderProjectPeriod(t, selectedProject, selectedPeriod)?.[0]}
          <div style={{ fontSize: "14px" }}>{renderProjectPeriod(t, selectedProject, selectedPeriod)?.[1] || ""}</div>
        </div>
        <div>{t(`ATTENDANCE_${Digit.SessionStorage.get("selectedProject")?.address?.boundaryType}`)}</div>

        {!tableData ? (
          <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND`)} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
            {/* Fixed Tab Section */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: "#fff",
                paddingBottom: "0.5rem",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Tab
                activeLink={activeLink?.code}
                configItemKey="code"
                configDisplayKey="name"
                itemStyle={{ width: "290px" }}
                configNavItems={[
                  {
                    code: "PENDING",
                    name: `${t(`HCM_AM_PENDING_FOR_APPROVAL`)} (${statusCount?.PENDINGFORAPPROVAL})`,
                  },
                  {
                    code: "APPROVED",
                    name: `${t(`HCM_AM_APPROVED`)} (${statusCount?.APPROVED})`,
                  },
                ]}
                onTabClick={(e) => {
                  setActiveLink(e);
                  handleTabChange(e);
                }}
                setActiveLink={setActiveLink}
                showNav={true}
              />
            </div>

            {/* Scrollable Table Section */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                maxHeight: "70vh",
                paddingRight: "0.5rem",
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Loader />
                </div>
              ) : tableData && tableData.length === 0 ? (
                <NoResultsFound style={{ height: "40vh" }} text={t(`HCM_AM_NO_DATA_FOUND`)} />
              ) : (
                <DataTable
                  columns={columns}
                  className="search-component-table"
                  data={tableData}
                  progressPending={isLoading}
                  progressComponent={<Loader />}
                  pagination
                  paginationServer
                  customStyles={tableCustomStyle(true)}
                  onRowClicked={handleRowClick}
                  pointerOnHover
                  paginationTotalRows={totalCount}
                  onChangePage={handlePaginationChange}
                  onChangeRowsPerPage={handleRowsPerPageChange}
                  paginationPerPage={rowsPerPage}
                  sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                  paginationRowsPerPageOptions={defaultPaginationValues}
                  fixedHeader
                  fixedHeaderScrollHeight="60vh"
                  paginationComponentOptions={getCustomPaginationOptions(t)}
                />
              )}
            </div>
          </div>
        )}
      </Card>

      {commentLogs && (
        <CommentPopUp onClose={onCommentLogClose} businessId={data?.musterRollNumber} heading={`${t("HCM_AM_STATUS_LOG_FOR_LABEL")}`} />
      )}
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}
    </React.Fragment>
  );
};

export default CustomInboxTable;
