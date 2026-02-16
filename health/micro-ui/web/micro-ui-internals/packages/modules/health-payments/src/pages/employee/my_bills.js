import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import MyBillsSearch from "../../components/MyBillsSearch";
import MyBillsTable from "../../components/MyBillsTable";
import { defaultRowsPerPage } from "../../utils/constants";
import { findAllOverlappingPeriods } from "../../utils/time_conversion";
import { PaymentSetUpService } from "../../services/payment_setup/PaymentSetupServices";
import { formatDate } from "../../utils/time_conversion";
import { set } from "lodash";

const MyBills = (props) => {

  const { t } = useTranslation();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);

    // context path variables
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
  const [selectedCount, setSelectedCount] = useState(0);

  const project = Digit?.SessionStorage.get("staffProjects");
  // TODO: need to send the periodIDs here

  const projectPeriods = Digit.SessionStorage.get("projectPeriods");

  const BillSearchCri = {
    url: `/${expenseContextPath}/bill/v1/_search`,
    body: {
      billCriteria: {
        tenantId: tenantId,
        referenceIds: project?.map(p => p?.id) || [],
//        referenceIds: [project?.[0]?.id],
        ...(billID ? { billNumbers: [billID] } : {}),
         ...(dateRange.startDate && dateRange.endDate
           ? { fromDate: new Date(dateRange.startDate).getTime(), toDate: new Date(dateRange.endDate).getTime() }
           : {}),
        pagination: {
          limit: limitAndOffset.limit,
          offset: limitAndOffset.offset,
        },
        billingPeriodIds:
          periodType && periodType?.code == "FINAL_AGGREGATE"
            ? []
            : periodType && periodType?.code == "INTERMEDIATE" && dateRange.startDate == "" && dateRange.endDate == ""
            ? projectPeriods.map((x) => x?.id)
            : dateRange.startDate == "" && dateRange.endDate == ""
            ? []
            : findAllOverlappingPeriods(
                dateRange?.startDate && dateRange.startDate !== "" ? dateRange.startDate : new Date().getTime(),
                dateRange?.endDate && dateRange.endDate !== "" ? dateRange.endDate : new Date().getTime()
              ).map((x) => x?.id),
        // TODO: need to add here

        ...(periodType && periodType?.code == "FINAL_AGGREGATE"
          ? {
              // isAggregate: periodType != null ? true : false,
              billingType: periodType?.code,
            }
    },
    config: {
      enabled: project ? true : false,
      select: (data) => {
        return data;
      },
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
            "moduleName": "HCM",
            "masterDetails": [
              {
                "name": "WORKER_RATES"
              }
            ]
          }
        ]
      }
    },
    config: {
      enabled: BillData?.bills?.length > 0 ? true : false,
      select: (mdmsData) => {
        const referenceCampaignId = BillData?.bills?.[0]?.referenceId?.split(".")?.[0];
        return mdmsData?.MdmsRes?.HCM?.WORKER_RATES?.find(
    (item) => item.campaignId === referenceCampaignId);
      },
    }
  };
    const { isLoading1, data: workerRatesData, isFetching1 } = Digit.Hooks.useCustomAPIHook(reqMdmsCriteria);
    console.log("workerRatesData", workerRatesData);
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
          // Transform periods into dropdown options
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

          // Sort by period number
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

  // Fetch periods when project is selected
  useEffect(() => {
    const periodsCheck = Digit.SessionStorage.get("projectPeriods") || [];
    if (periodsCheck.length == 0) {
      if (project?.[0]?.referenceID || project?.[0]?.id) {
        fetchBillingPeriods(project?.[0]?.referenceID || project?.[0]?.id);
      }
    }
  }, [fetchBillingPeriods]);

    const getTotalAmount = (selectedBills) => {
        if (!selectedBills || selectedBills.length === 0) return 0;
        return selectedBills.reduce((total, bill) => total + (bill?.totalAmount || 0), 0);
    }

    useEffect(() => {
        if (BillData) {
            if (props?.isSelectableRows) {
                const filteredBills = BillData.bills.filter((bill) => bill.businessService === "PAYMENTS.BILL");
                setTableData(filteredBills);
                setTotalCount(filteredBills?.length);
            } else {
                setTableData(BillData.bills);
                setTotalCount(BillData?.pagination?.totalCount);
            }
        }
    }, [BillData]);

    // Only fetch on filter change
   useEffect(() => {
    refetchBill();
  }, [billID, dateRange, limitAndOffset, periodType]);

  const onSubmit = (billID, dateRange, selectedBillType) => {
    if (dateRange.startDate !== "" && dateRange.endDate !== "") {
      const filteredPeriods = findAllOverlappingPeriods(
        dateRange?.startDate && dateRange.startDate !== "" ? dateRange.startDate : new Date().getTime(),
        dateRange?.endDate && dateRange.endDate !== "" ? dateRange.endDate : new Date().getTime()
      ).map((x) => x?.id);

      if (filteredPeriods.length == 0) {
        // setShowToast(null);
        setTableData([]);
        setTotalCount(0);
        //setShowToast({ key: "error", label: t("HCM_AM_SELECT_PERIODS_EMPTY"), transitionTime: 3000 });

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

  if (isBillLoading) {
    return <Loader variant={"OverlayLoader"} className={"digit-center-loader"} />;
  }

    if (isBillLoading || isFetching1 || isLoading1) {
        return <LoaderScreen />
    }
    const totalAmount = getTotalAmount(props?.selectedBills);
    return (
        <React.Fragment>
            {
                    <Header styles={{ fontSize: "32px" }}>
                      <span style={{ color: "#0B4B66" }}>{t("HCM_AM_MY_BILLS")}</span>
                    </Header>
                  }


            <MyBillsSearch onSubmit={onSubmit} onClear={onClear} />

            <Card>
                {isFetching ? (    const totalAmount = getTotalAmount(props?.selectedBills);
) : tableData.length === 0 ? (<NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND_FOR_BILLS`)} />)
                    :
                    (
                        <React.Fragment>
                            {selectedCount > 0 && (
                                <div style={{ margin: '1rem 0', fontWeight: 'bold', color: '#0B4B66' }}>
                                    {selectedCount} {t("HCM_AM_BILLS_SELECTED")} | {t("PDF_STATIC_LABEL_BILL_TOTAL_AMOUNT_TO_PROCESS")} {totalAmount} {workerRatesData?.currency}
                                </div>
                            )}
                            <MyBillsTable
                                data={tableData.sort((a, b) => (a?.auditDetails?.createdTime || 0) - (b?.auditDetails?.createdTime || 0))}
                                totalCount={totalCount}
                                onSelectionChange={props?.onSelectionChange}
                                onSelectedCountChange={setSelectedCount}
                                isSelectableRows={props?.isSelectableRows}
                                rowsPerPage={rowsPerPage}
                                currentPage={currentPage}
                                handlePageChange={handlePageChange}
                                handlePerRowsChange={handlePerRowsChange} />
                        </React.Fragment>
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

        </React.Fragment>
    );
};

export default MyBills;
