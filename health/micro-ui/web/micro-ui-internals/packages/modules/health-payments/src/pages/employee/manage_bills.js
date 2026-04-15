import React, { Fragment, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import MyBillsSearch from "../../components/MyBillsSearch";
import ManageBillsTable from "../../components/ManageBillsTable";
import { defaultRowsPerPage } from "../../utils/constants";
import { findAllOverlappingPeriods } from "../../utils/time_conversion";
import { PaymentSetUpService } from "../../services/payment_setup/PaymentSetupServices";
import { formatDate } from "../../utils/time_conversion";
import { Card, NoResultsFound, Loader, Toast, Tab, Tag } from "@egovernments/digit-ui-components";
import { Header, ActionBar } from "@egovernments/digit-ui-react-components";
import { Button } from "@egovernments/digit-ui-components";
import _ from "lodash";
import { getManageBillsRole, getManageBillsConfig } from "../../utils/roleUtils";
import AlertPopUp from "../../components/alertPopUp";

const ManageBills = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [selectedBills, setSelectedBills] = useState([]);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [activePopUpAction, setActivePopUpAction] = useState(null);

  // Role-based config
  const activeRole = getManageBillsRole();
  const roleConfig = getManageBillsConfig();

  const expenseContextPath = window?.globalConfigs?.getConfig("EXPENSE_CONTEXT_PATH") || "health-expense";
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  // State Variables
  const [periodType, setPeriodType] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [billID, setBillID] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
    title: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [totalCount, setTotalCount] = useState(0);
  const [limitAndOffset, setLimitAndOffset] = useState({ limit: rowsPerPage, offset: (currentPage - 1) * rowsPerPage });

  // Tab state — initialize from role config
  const firstTab = roleConfig?.tabs?.[0];
  const [activeLink, setActiveLink] = useState({
    code: firstTab?.code || "NOT_VERIFIED",
    name: t(firstTab?.name || "HCM_AM_NOT_VERIFIED"),
  });

  const project = Digit?.SessionStorage.get("staffProjects");
  const projectPeriods = Digit.SessionStorage.get("projectPeriods");

  const BillSearchCri = {
    url: `/${expenseContextPath}/bill/v1/_search`,
    body: {
      billCriteria: {
        tenantId: tenantId,
        referenceIds: project?.map((p) => p?.id) || [],
        // TODO: Re-enable status filter after testing
        // status: roleConfig?.tabStatusMap?.[activeLink.code]?.[0] || null,
        ...(billID ? { billNumbers: [billID] } : {}),
        ...(dateRange.startDate && dateRange.endDate
          ? {
              fromDate: new Date(dateRange.startDate).getTime(),
              toDate: new Date(dateRange.endDate).getTime(),
            }
          : {}),
        pagination: {
          limit: limitAndOffset.limit,
          offset: limitAndOffset.offset,
        },
        billingPeriodIds:
          periodType && periodType?.code === "FINAL_AGGREGATE"
            ? []
            : periodType &&
              periodType?.code === "INTERMEDIATE" &&
              dateRange.startDate === "" &&
              dateRange.endDate === ""
            ? (projectPeriods || []).map((x) => x?.id)
            : dateRange.startDate === "" && dateRange.endDate === ""
            ? []
            : findAllOverlappingPeriods(
                dateRange?.startDate && dateRange.startDate !== "" ? dateRange.startDate : new Date().getTime(),
                dateRange?.endDate && dateRange.endDate !== "" ? dateRange.endDate : new Date().getTime()
              ).map((x) => x?.id),
        ...(periodType && periodType?.code === "FINAL_AGGREGATE"
          ? { billingType: periodType?.code }
          : {}),
      },
    },
    config: {
      enabled: project ? true : false,
      select: (data) => data,
    },
  };

  const { isLoading: isBillLoading, data: BillData, refetch: refetchBill, isFetching } = Digit.Hooks.useCustomAPIHook(BillSearchCri);

  const reqMdmsCriteria = {
    url: `/${mdms_context_path}/v1/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "HCM",
            masterDetails: [{ name: "WORKER_RATES" }],
          },
        ],
      },
    },
    config: {
      enabled: BillData?.bills?.length > 0 ? true : false,
      select: (mdmsData) => {
        const referenceCampaignId = BillData?.bills?.[0]?.referenceId?.split(".")?.[0];
        return mdmsData?.MdmsRes?.HCM?.WORKER_RATES?.find((item) => item.campaignId === referenceCampaignId);
      },
    },
  };
  const { data: workerRatesData } = Digit.Hooks.useCustomAPIHook(reqMdmsCriteria);
  Digit.SessionStorage.set("workerRatesData", workerRatesData);

  const handlePageChange = (page, totalRows) => {
    setCurrentPage(page);
    setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage });
  };

  const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
    setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * rowsPerPage });
  };

  const bulkUpdateMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/${expenseContextPath}/bill/v1/_bulkupdate`,
  });

  const triggerBulkUpdateBills = async (bills, action) => {
    try {
      await bulkUpdateMutation.mutateAsync(
        {
          body: {
            bills: bills,
            workflow: {
              action: action, // VERIFY / SEND_FOR_REVIEW / etc
              comments: `Bulk ${action} triggered`,
              assignes: [],
            },
          },
        },
        {
          onSuccess: async () => {
            setShowToast({
              key: "success",
              label: t(`HCM_AM_${action}_SUCCESS`),
              transitionTime: 3000,
            });
  
            // Refresh table
            refetchBill();
  
            // Clear selection
            setSelectedBills([]);
            setClearSelectedRows((prev) => !prev);
          },
          onError: (error) => {
            console.error("Bulk update failed:", error);
            setShowToast({
              key: "error",
              label: t("HCM_AM_ACTION_FAILED"),
              transitionTime: 3000,
            });
          },
        }
      );
    } catch (err) {
      console.error("Mutation error:", err);
    }
  };

  // Fetch billing config and periods
  const fetchBillingPeriods = useCallback(
    async (projectId) => {
      try {
        const body = {
          searchCriteria: {
            tenantId: tenantId,
            campaignNumber: projectId,
            includePeriods: true,
          },
        };

        const response = await PaymentSetUpService.billingConfigSearchByProjectId({ body });

        if (response && response.periods && response.periods.length > 0) {
          const periodOptions = response.periods.map((period) => ({
            code: period.id,
            name: `Period ${period.periodNumber} (${formatDate(period.periodStartDate)} - ${formatDate(period.periodEndDate)})`,
            periodNumber: period.periodNumber,
            periodStartDate: period.periodStartDate,
            periodEndDate: period.periodEndDate,
            status: period.status,
            billingFrequency: period.billingFrequency,
            ...period,
          }));

          periodOptions.sort((a, b) => a.periodNumber - b.periodNumber);
          Digit.SessionStorage.set("projectPeriods", periodOptions);
        } else {
          Digit.SessionStorage.del("projectPeriods");
        }
      } catch (error) {
        console.error("Error fetching billing periods:", error);
        Digit.SessionStorage.del("projectPeriods");
      }
    },
    [tenantId]
  );

  useEffect(() => {
    const periodsCheck = Digit.SessionStorage.get("projectPeriods") || [];
    if (periodsCheck.length == 0) {
      if (project?.[0]?.referenceID || project?.[0]?.id) {
        fetchBillingPeriods(project?.[0]?.referenceID || project?.[0]?.id);
      }
    }
  }, [fetchBillingPeriods]);

  // When BillData changes, update table data
  useEffect(() => {
    if (BillData) {
      const bills = BillData.bills || [];
      setTableData(bills);
      setTotalCount(BillData?.pagination?.totalCount || bills.length);
    }
  }, [BillData]);

  // Refetch on filter change
  useEffect(() => {
    refetchBill();
  }, [billID, dateRange, limitAndOffset, periodType, activeLink.code]);

  const onSubmit = (billID, dateRange, selectedBillType) => {
    if (dateRange.startDate !== "" && dateRange.endDate !== "") {
      const filteredPeriods = findAllOverlappingPeriods(
        dateRange?.startDate && dateRange.startDate !== "" ? dateRange.startDate : new Date().getTime(),
        dateRange?.endDate && dateRange.endDate !== "" ? dateRange.endDate : new Date().getTime()
      ).map((x) => x?.id);

      if (filteredPeriods.length == 0) {
        setTableData([]);
        setTotalCount(0);
        return;
      }
    }
    setBillID(billID);
    setDateRange(dateRange);
    setPeriodType(selectedBillType);
  };

  const onClear = () => {
    setDateRange({ startDate: "", endDate: "", title: "" });
    setBillID("");
    setPeriodType(null);
  };

  // Handle CTA action (mock for now — real implementation later)
  const handleCTAAction = (action) => {
    if (!selectedBills || selectedBills.length === 0) return;

    switch (action) {
      case "VERIFY":
      case "SEND_FOR_REVIEW":
      case "SEND_FOR_APPROVAL":
        setActivePopUpAction(action);
        break;
      case "INITIATE_PAYMENT":
      case "RETRY_PAYMENT":
        // Mock — placeholder for future implementation
        setShowToast({ key: "info", label: t(`HCM_AM_${action}_PLACEHOLDER`), transitionTime: 3000 });
        break;
      case "DOWNLOAD_TXN_HISTORY":
        // Mock — placeholder for future implementation
        setShowToast({ key: "info", label: t("HCM_AM_DOWNLOAD_TXN_HISTORY_PLACEHOLDER"), transitionTime: 3000 });
        break;
      case "GENERATE_ADVISORY":
        // Mock — placeholder for future implementation
        setShowToast({ key: "info", label: t("HCM_AM_GENERATE_ADVISORY_PLACEHOLDER"), transitionTime: 3000 });
        break;
      case "DOWNLOAD_ADVISORY":
        // Mock — placeholder for future implementation
        setShowToast({ key: "info", label: t("HCM_AM_DOWNLOAD_ADVISORY_PLACEHOLDER"), transitionTime: 3000 });
        break;
      default:
        break;
    }
  };

  if (!roleConfig) {
    return (
      <React.Fragment>
        <Header styles={{ fontSize: "32px" }}>
          <span style={{ color: "#0B4B66" }}>{t("HCM_AM_MANAGE_BILLS")}</span>
        </Header>
        <Card>
          <NoResultsFound text={t("HCM_AM_NO_ACCESS")} />
        </Card>
      </React.Fragment>
    );
  }

  if (isBillLoading) {
    return <Loader variant={"OverlayLoader"} className={"digit-center-loader"} />;
  }

  const currentCTA = roleConfig.tabCTAs?.[activeLink.code];

  const projectName = project?.[0]?.name || "";

  return (
    <React.Fragment>
      <MyBillsSearch
        onSubmit={onSubmit}
        onClear={onClear}
        headerContent={
          <>
            {projectName && (
              <Tag label={t(projectName)} type="monochrome" showIcon={false} className="campaign-tag" style={{ marginBottom: "0.5rem" }} />
            )}
            <Header styles={{ fontSize: "32px", marginBottom: "0.5rem" }}>
              <span style={{ color: "#0B4B66" }}>{t("HCM_AM_MANAGE_BILLS")}</span>
            </Header>
            <p style={{ color: "#505A5F", fontSize: "16px", lineHeight: "1.5", marginBottom: "0.5rem" }}>
              {t("HCM_AM_MANAGE_BILLS_DESCRIPTION")}
            </p>
          </>
        }
      />

      <Card>
        <Tab
          activeLink={activeLink?.code}
          configItemKey="code"
          configDisplayKey="name"
          itemStyle={{
            flex: "1 1 auto",
            textAlign: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            minWidth: "200px",
          }}
          configNavItems={roleConfig.tabs.map((tab) => ({
            code: tab.code,
            name: t(tab.name),
          }))}
          navStyles={{
            display: "flex",
            width: "100%",
          }}
          onTabClick={(e) => {
            setCurrentPage(1);
            setLimitAndOffset({ limit: rowsPerPage, offset: 0 });
            setSelectedBills([]);
            setClearSelectedRows((prev) => !prev);
            setActiveLink(e);
          }}
          setActiveLink={setActiveLink}
          showNav={true}
          style={{ width: "100%" }}
        />

        {isFetching ? (
          <Loader variant={"OverlayLoader"} className={"digit-center-loader"} />
        ) : tableData.length === 0 ? (
          <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND_FOR_BILLS`)} />
        ) : (
          <ManageBillsTable
            data={tableData.sort((a, b) => (a?.auditDetails?.createdTime || 0) - (b?.auditDetails?.createdTime || 0))}
            totalCount={totalCount}
            rowsPerPage={rowsPerPage}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            handlePerRowsChange={handlePerRowsChange}
            onSelectionChange={setSelectedBills}
            clearSelectedRows={clearSelectedRows}
            columnKeys={roleConfig?.tabColumns[activeLink.code]}
            isSelectable={roleConfig?.selectableTabs?.includes(activeLink.code)}
            activeTabCode={activeLink.code}
          />
        )}
      </Card>

      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}

      <ActionBar style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
        <Button
          variation="secondary"
          label={t("HCM_AM_BACK")}
          icon="ArrowBack"
          onClick={() => history.goBack()}
          style={{
            width: "15%",
            whiteSpace: "normal",
            marginLeft: "2rem", 
          }}
        />
        {currentCTA && (
          <Button
            variation="primary"
            label={t(currentCTA.label)}
            isDisabled={selectedBills.length === 0}
            onClick={() => handleCTAAction(currentCTA.action)}
            style={{
              width: "15%",
              whiteSpace: "normal",
              marginRight: "2rem", 
            }}
          />
        )}
      </ActionBar>

      {activePopUpAction && (() => {
        const popUpConfig = {
          VERIFY: {
            heading: "HCM_AM_CONFIRM_BILL_VERIFICATION",
            message: "HCM_AM_CONFIRM_VERIFY_MESSAGE",
            success: "HCM_AM_BILLS_VERIFIED_SUCCESS",
          },
          SEND_FOR_REVIEW: {
            heading: "HCM_AM_CONFIRM_SEND_FOR_REVIEW",
            message: "HCM_AM_CONFIRM_SEND_FOR_REVIEW_MESSAGE",
            success: "HCM_AM_SEND_FOR_REVIEW_SUCCESS",
          },
          SEND_FOR_APPROVAL: {
            heading: "HCM_AM_CONFIRM_SEND_FOR_APPROVAL",
            message: "HCM_AM_CONFIRM_SEND_FOR_APPROVAL_MESSAGE",
            success: "HCM_AM_SEND_FOR_APPROVAL_SUCCESS",
          },
        };
        const config = popUpConfig[activePopUpAction];
        if (!config) return null;
        return (
          <AlertPopUp
            onClose={() => setActivePopUpAction(null)}
            alertHeading={t(config.heading)}
            alertMessage={t(config.message, { count: selectedBills.length })}
            submitLabel={t("HCM_AM_CONFIRM")}
            cancelLabel={t("HCM_AM_CANCEL")}
            onPrimaryAction={async () => {
              const validBills = selectedBills.filter((bill) =>
                bill?.billDetails?.some((d) => d.status === "PENDING_VERIFICATION")
              );
            
              if (validBills.length === 0) {
                setShowToast({
                  key: "error",
                  label: t("HCM_AM_NO_VALID_BILLS"),
                  transitionTime: 3000,
                });
                return;
              }

              setActivePopUpAction(null);
              await triggerBulkUpdateBills(validBills, activePopUpAction);
              // TODO: API integration
              setShowToast({ key: "success", label: t(config.success), transitionTime: 3000 });
            }}
          />
        );
      })()}
    </React.Fragment>
  );
};

export default ManageBills;
