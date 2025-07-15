import React, { useState, useEffect, useRef, use, Fragment } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Header, LoaderWithGap } from "@egovernments/digit-ui-react-components";
import { Divider, Button, PopUp, InfoCard, Card, ActionBar, Link, ViewCardFieldPair, Toast, LoaderScreen, LoaderComponent, Tab, NoResultsFound, TooltipWrapper } from "@egovernments/digit-ui-components";
import AttendanceManagementTable from "../../components/attendanceManagementTable";
import AlertPopUp from "../../components/alertPopUp";
import SendForEditPopUp from "../../components/sendForEditPopUp";
import _, { set } from "lodash";
import { defaultRowsPerPage, ScreenTypeEnum } from "../../utils/constants";
import { formatTimestampToDate } from "../../utils";
import CommentPopUp from "../../components/commentPopUp";
import BillDetailsTable from "../../components/BillDetailsTable";
/**
 * @function BillPaymentDetails
 * @description This component is used to view attendance.
 * @param {boolean} editBillDetails - Whether bill is editable or not.
 * @returns {ReactFragment} A React Fragment containing the attendance details.
 */
const BillPaymentDetails = ({ editBillDetails = false }) => {
  const location = useLocation();
  const billID = location.state?.billID;
  console.log("billID", billID);
  const { t } = useTranslation();
  const history = useHistory();
  const [infoDescription, setInfoDescription] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [tableData, setTableData] = useState([]);
  const [billData, setBillData] = useState(null);
  const [paginatedData, setPaginatedData] = useState([]);
  const [openSendForEditPopUp, setOpenSendForEditPopUp] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [openVerifyAlertPopUp, setOpenVerifyAlertPopUp] = useState(false);
  const [openEditAlertPopUp, setOpenEditAlertPopUp] = useState(false);
  const [openApprovePaymentAlertPopUp, setOpenApprovePaymentAlertPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabCounts, setTabCounts] = useState({});
  const [transferPollTimers, setTransferPollTimers] = useState({});
  const [isSelectionDisabled, setIsSelectionDisabled] = useState(false);
  const [showGeneratePaymentAction, setShowGeneratePaymentAction] = useState(false);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [limitAndOffset, setLimitAndOffset] = useState({
    limit: rowsPerPage,
    offset: (currentPage - 1) * rowsPerPage,
  });
  const handlePageChange = (page, totalRows) => {
    setCurrentPage(page);
    setLimitAndOffset({ ...limitAndOffset, offset: (page - 1) * rowsPerPage });
  };

  const handlePerRowsChange = (currentRowsPerPage, currentPage) => {
    setRowsPerPage(currentRowsPerPage);
    setCurrentPage(1);
    setLimitAndOffset({ limit: currentRowsPerPage, offset: (currentPage - 1) * rowsPerPage });
  }
  const [activeLink, setActiveLink] = useState({
    code: editBillDetails ? "PENDING_FOR_EDIT" : "NOT_VERIFIED",
    name: editBillDetails
      ? `${t("HCM_AM_PENDING_FOR_EDIT")} `
      : `${t("HCM_AM_NOT_VERIFIED")} `,
  });

  const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";
  const expenseContextPath = window?.globalConfigs?.getConfig("EXPENSE_CONTEXT_PATH") || "health-expense";
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [individualIds, setIndividualIds] = useState([]);


  const project = Digit?.SessionStorage.get("staffProjects");
  const selectedProject = Digit?.SessionStorage.get("selectedProject");


  const BillSearchCri = {
    url: `/${expenseContextPath}/bill/v1/_search`,
    body: {
      billCriteria: {
        tenantId: tenantId,
        referenceIds: project?.map(p => p?.id) || [],
        ...(billID ? { billNumbers: [billID] } : {}),
        pagination: {
          limit: limitAndOffset.limit,
          offset: limitAndOffset.offset
        }
      }
    },
    config: {
      enabled: project && billID ? true : false,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: isBillLoading, data: BillData, refetch: refetchBill, isFetching } = Digit.Hooks.useCustomAPIHook(BillSearchCri);

  const fetchIndividualIds = (billData) => {
    const billDetails = billData?.billDetails || [];
    if (Array.isArray(billDetails)) {
      const ids = billDetails.map((billDetail) => billDetail?.payee?.identifier).filter(Boolean);
      setIndividualIds(ids);
      console.log("Individual IDs:", ids);
    }
  }


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
      enabled: billData ? true : false,
      select: (mdmsData) => {
        return mdmsData.MdmsRes.HCM.WORKER_RATES.filter((item) => item.campaignId === billData?.referenceId)?.[0]
      },
    }
  };
  const { isLoading1, data: workerRatesData, isFetching1 } = Digit.Hooks.useCustomAPIHook(reqMdmsCriteria);
  console.log("workerRatesData", workerRatesData);

  const allIndividualReqCriteria = {
    url: `/${individualContextPath}/v1/_search`,
    params: {
      tenantId: tenantId,
      limit: individualIds?.length,
      offset: 0,
    },
    body: {
      Individual: {
        id: individualIds
      }
    },
    config: {
      enabled: individualIds.length > 0 ? true : false,
      select: (data) => {
        return data;
      },
    },
    changeQueryName: "allIndividuals"
  };

  const { isLoading: isAllIndividualsLoading, data: AllIndividualsData, refetch: refetchAllIndividuals } = Digit.Hooks.useCustomAPIHook(allIndividualReqCriteria);
  function addIndividualDetailsToBillDetails(billDetails, individualsData, workerRatesData) {
    return billDetails.map((billDetail) => {
      const individual = individualsData?.Individual?.find(
        (ind) => ind.id === billDetail?.payee?.identifier
      );
      const rateObj = workerRatesData?.rates?.find(
        (rate) => rate?.skillCode === individual?.userDetails?.roles?.[0]?.code //TODO: Confirm if user will have one role only, so that wage can be fetched for that role
      );

      const rateBreakup = rateObj?.rateBreakup || {};
      const wage =
        (rateBreakup.FOOD || 0) +
        (rateBreakup.TRAVEL || 0) +
        (rateBreakup.PER_DAY || 0);
      return {
        ...billDetail,
        givenName: individual?.name?.givenName,
        mobileNumber: individual?.mobileNumber,
        userId: individual?.userDetails?.username,
        wage: wage + " " + workerRatesData?.currency,
      };
    });
  }

  const userSearchCri = {
    url: `/egov-hrms/employees/_search`,
    params: {
      tenantId: tenantId,
      roles: "PAYMENT_EDITOR",
    },
    config: {
      enabled: project && !editBillDetails ? true : false,
      select: (data) => {
        return data?.Employees || [];
      },
    },
  };

  const { isLoading: isHrmsSearchLoading, data: hrmsUsersData, refetch: refetchHrmsUsers, isHrmsSearchFetching } = Digit.Hooks.useCustomAPIHook(userSearchCri);

  const updateIndividualMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/individual/v1/bulk/_update`
  });

  const triggerIndividualBulkUpdate = async (individualsData, selectedRows, bill) => {
    console.log("triggerIndividualBulkUpdate called with:", individualsData, selectedRows, bill);
    const selectedIds = selectedRows.map(row => row?.payee?.identifier);
    const updatedIndividualsList = individualsData?.Individual?.filter(individual =>
      selectedIds.includes(individual.id)
    ).map(individual => {
      const matchingRow = selectedRows.find(row => row?.payee?.identifier === individual.id);

      return {
        ...individual,
        name: {
          ...individual.name,
          givenName: matchingRow?.givenName || individual.name?.givenName,
        },
        mobileNumber: matchingRow?.mobileNumber || individual.mobileNumber,
      };
    });

    try {
      await updateIndividualMutation.mutateAsync(
        {
          body: {
            Individuals: updatedIndividualsList
          },
        },
        {
          onSuccess: async () => {
            await updateBillDetailWorkflow(bill, selectedRows, "EDIT");
            setShowToast({
              key: "success",
              label: t("HCM_AM_BILL_DETAIL_UPDATE_SUCCESS"),//TODO UPDATE TOAST MSG
              transitionTime: 6000,
            });

          }
        });
      refetchBill();

    }
    catch (error) {
      setSelectedRows([]);
      setClearSelectedRows(prev => !prev);
            console.error("Error updating individuals:", error);
      setShowToast({
        key: "error",
        label: t(error?.response?.data?.Errors?.[0]?.message || "HCM_AM_BILL_DETAIL_UPDATE_ERROR"),//TODO UPDATE TOAST MSG
        transitionTime: 3000,
      });

    }


  }
  const updateBillDetailMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/${expenseContextPath}/v1/bill/details/status/_update`,
  });
  const updateBillDetailWorkflow = async (bill, selectedRows, wfAction, assignee) => {
    try {
      await updateBillDetailMutation.mutateAsync(
        {
          body: {
            bill: {
              ...bill,
              billDetails: selectedRows,
            },
            workflow: {
              action: wfAction,
              assignes: assignee ? [assignee.value] : null
              //TODO: Add comments too
            },
          },
        },
        {
          onSuccess: async () => {
            setSelectedRows([]);
            setClearSelectedRows(prev => !prev);
                        refetchBill();
            setShowToast({
              key: "success",
              label: t(`HCM_AM_SELECTED_BILL_DETAILS_${wfAction}_SUCCESS`), //TODO UPDATE TOAST MSG
              transitionTime: 2000,
            });
            if (wfAction === "EDIT") { //move to success response page after edit success
              history.push(`/${window.contextPath}/employee/payments/edit-bill-success`, {
                state: "success",
                info: t("HCM_AM_BILL_NUMBER"),
                fileName: BillData?.bills?.[0]?.billNumber || t("NA"),
                description: t(`HCM_AM_BILL_DETAIL_UPDATE_SUCCESS_DESCRIPTION`),
                message: t(`HCM_AM_BILL_DETAIL_UPDATE_SUCCESS`),
                isShowButton: false,
                back: t(`GO_BACK_TO_HOME`),
                backlink: `/${window.contextPath}/employee`
              });
            }
          },
          onError: (error) => {
            setSelectedRows([]);  
            setClearSelectedRows(prev => !prev);      
                console.log("12Error updating bill detail workflow:", error);
            setShowToast({
              key: "error",
              label: error?.response?.data?.Errors?.[0]?.message || t(`HCM_AM_BILL_DETAILS_${wfAction}_ERROR`),//TODO UPDATE TOAST MSG
              transitionTime: 2000,
            });
          },
        },
      )
      
    } catch (error) {
      console.log("Error updating bill detail workflow:", error);
      setSelectedRows([]);
      setClearSelectedRows(prev => !prev);
       setShowToast({
        key: "error",
        label: t(`HCM_AM_BILL_DETAILS_${wfAction}_ERROR`), //TODO UPDATE TOAST MSG
        transitionTime: 3000,
      });
    }
  }

  const getTaskStatusMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/health-expense/v1/task/_status`,
  });
  const verifyBillMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/health-expense/v1/bill/_verify`,
  });
  const triggerVerifyBill = async (bill, billDetails) => {
    console.log("triggerVerifyBill", bill);
    try {
      await verifyBillMutation.mutateAsync(
        {
          body: {
            bill: {
              ...bill,
              billDetails: billDetails,
            }
          },
        },
        {
          onSuccess: async (verifyResponse) => {
            setSelectedRows([]);
            setClearSelectedRows(prev => !prev);
            console.log("Verify Response", verifyResponse);
            const taskId = verifyResponse?.taskId;
            if (!taskId) {
              setIsLoading(false);
              setShowToast({ key: "error", label: t("HCM_AM_TASK_ID_NOT_FOUND"), transitionTime: 2000 }); //TODO UPDATE TOAST MSG 
              return;
            }

            let attempts = 0;
            const POLLING_INTERVAL = 3000;
            const MAX_ATTEMPTS = 5;

            const pollStatus = async () => {
              try {
                const statusResponse = await getTaskStatusMutation.mutateAsync({
                  body: {
                    task: {
                      id: taskId
                    }
                  },
                });

                const status = statusResponse?.task?.status;
                // setTaskStatus?.(status);
                if (status === "DONE") {
                  setIsLoading(false);
                  setShowToast({
                    key: "success",
                    label: t("HCM_AM_BILL_VERIFICATION_DONE"),
                    transitionTime: 5000,
                  });
                  refetchBill();
                } else if (status === "IN_PROGRESS") {
                  setIsLoading(true); // start loader

                  setShowToast({ key: "info", label: t("HCM_AM_BILL_VERIFICATION_IN_PROGRESS"), transitionTime: 2000 });

                  if (attempts < MAX_ATTEMPTS) {
                    attempts++;
                    setTimeout(pollStatus, POLLING_INTERVAL);
                  } else {
                    setIsLoading(false);
                    setShowToast({ key: "error", label: t("HCM_AM_TASK_POLL_TIMEOUT_PLEASE_CHECK_IN_SOME_TIME"), transitionTime: 3000 });
                  }
                } else {
                  setIsLoading(false);
                  setShowToast({ key: "error", label: t(`HCM_AM_UNEXPECTED_STATUS_${status}`), transitionTime: 3000 });
                }
              } catch (err) {
                setIsLoading(false);
                console.error("Polling failed for taskId", taskId, err);
                setShowToast({ key: "error", label: t("HCM_AM_TASK_STATUS_ERROR"), transitionTime: 3000 });//TODO UPDATE TOAST MSG
              }
            };

            pollStatus();
          },
          onError: (error) => {
            setIsLoading(false);
            setSelectedRows([]);
            setClearSelectedRows(prev => !prev);
            setShowToast({
              key: "error",
              label: t(error?.response?.data?.Errors?.[0]?.message || "HCM_AM_BILL_VERIFY_ERROR"),//TODO UPDATE TOAST MSG
              transitionTime: 3000,
            });
          },
        }
      );
    } catch (error) {
      setIsLoading(false);
      setSelectedRows([]);
      setClearSelectedRows(prev => !prev);
      setShowToast({
        key: "error",
        label: t("HCM_AM_BILL_VERIFY_EXCEPTION"),//TODO UPDATE TOAST MSG
        transitionTime: 3000,
      });
    }
  };

  const generatePaymentMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/health-expense/v1/payment/_transfer`,
  });

  const triggerGeneratePayment = async (bill, billDetails) => {
    console.log("triggerGeneratePayment", bill);
    try {
      await generatePaymentMutation.mutateAsync(
        {
          body: {
            bill: {
              ...bill,
              billDetails: billDetails,
            }
          },
        },
        {
          onSuccess: async (paymentResponse) => {
            setSelectedRows([]);
            setClearSelectedRows(prev => !prev);
            console.log("Payment Response", paymentResponse);
            const taskId = paymentResponse?.taskId;
            if (!taskId) {
              setIsLoading(false);
              setShowToast({ key: "error", label: t("HCM_AM_TASK_ID_NOT_FOUND"), transitionTime: 2000 });//TODO UPDATE TOAST MSG
              return;
            }

            let attempts = 0;
            const POLLING_INTERVAL = 2 * 60 * 1000; // 2 minutes
            const MAX_ATTEMPTS = 5;

            const pollStatus = async () => {
              try {
                const statusResponse = await getTaskStatusMutation.mutateAsync({
                  body: {
                    task: {
                      id: taskId
                    }
                  },
                });
                console.log("Status ResponsePayment", statusResponse);

                const status = statusResponse?.task?.status;
                // setTaskStatus?.(status);
                if (status === "DONE") {
                  setIsLoading(false);
                  setIsSelectionDisabled(false);
                  setShowToast({
                    key: "success",
                    label: t("HCM_AM_PAYMENT_GENERATION_DONE"),
                    transitionTime: 5000,
                  });
                  refetchBill();
                } else if (status === "IN_PROGRESS") {
                  setIsSelectionDisabled(true);
                  //TODO UPDATE TOAST MSG
                  setShowToast({ key: "info", label: t("HCM_AM_PAYMENT_GENERATION_IN_PROGRESS"), transitionTime: 2000 });//TODO UPDATE TOAST MSG

                  if (attempts < MAX_ATTEMPTS) {
                    attempts++;
                    setTimeout(pollStatus, POLLING_INTERVAL);
                  } else {
                    setIsLoading(false);
                    setShowToast({ key: "error", label: t("HCM_AM_TASK_POLL_TIMEOUT_PLEASE_CHECK_IN_SOME_TIME"), transitionTime: 3000 });
                  }
                } else {
                  setIsLoading(false);
                  setShowToast({ key: "error", label: t(`HCM_AM_UNEXPECTED_STATUS_${status}`), transitionTime: 3000 });
                }
              } catch (err) {
                setIsLoading(false);
                setShowToast({ key: "error", label: t("HCM_AM_TASK_STATUS_ERROR"), transitionTime: 3000 });
              }
            };

            pollStatus();
          },
          onError: (error) => {
            setSelectedRows([]);
            setClearSelectedRows(prev => !prev);
            setIsLoading(false);
            setShowToast({
              key: "error",
              label: t(error?.response?.data?.Errors?.[0]?.message || "HCM_AM_PAYMENT_GENERATION_ERROR"),
              transitionTime: 3000,
            });
          },
        }
      );
    } catch (error) {
      setIsLoading(false);
      setSelectedRows([]);
      setClearSelectedRows(prev => !prev);
      setShowToast({
        key: "error",
        label: t("HCM_AM_PAYMENT_GENERATION_EXCEPTION"),//TODO UPDATE TOAST MSG
        transitionTime: 3000,
      });
    }
  };
  
   const pollTaskUntilDone = async (billId, type, initialStatusResponse = null) => {
    console.log("Polling...", billId);

    const POLLING_INTERVAL = 1 * 60 * 1000; // 1 minute
   
    let statusResponse = initialStatusResponse;

    if (!statusResponse) {
        try {
            statusResponse = await getTaskStatusMutation.mutateAsync({
                body: { task: { billId, type } },
            });
        } catch (err) {
            console.error("Polling failed for", billId, err);
            setShowToast({ key: "error", label: t("HCM_AM_SOMETHING_WENT_WRONG"), transitionTime: 2000 });
            return;
        }
    }

      const status = statusResponse?.task?.status;
      const res_type = statusResponse?.task?.type;

      if (status === "IN_PROGRESS" && res_type === type) {
        setIsSelectionDisabled(true);
        setTransferPollTimers(prev => {
          if (prev[billId]) clearTimeout(prev[billId]);
          const timer = setTimeout(() => pollTaskUntilDone(billId, type), POLLING_INTERVAL);
          return { ...prev, [billId]: timer };
        });
      } else {
        setIsSelectionDisabled(false);
        setTransferPollTimers(prev => {
          if (prev[billId]) clearTimeout(prev[billId]);
          const newTimers = { ...prev };
          delete newTimers[billId];
          return newTimers;
        });
        refetchBill();
      }
    };

  useEffect(() => {
    return () => {
      Object.values(transferPollTimers).forEach(clearTimeout);
    };
  }, []);

  useEffect(async () => {
    if (BillData) {
      const bill = BillData.bills?.find(b => b.billNumber === billID) || null;
      if (bill === null) {
        console.error("Bill not found for billID:", billID);
        setShowToast({
          key: "error",
          label: t("HCM_AM_BILL_NOT_FOUND"),
          transitionTime: 3000,
        });
        return;
      }
      setBillData(bill);
      fetchIndividualIds(bill);
      const billId = bill?.id;

      try {
        const res = await getTaskStatusMutation.mutateAsync({
          body: {
            task: {
              billId: billId,
              type: "Transfer",
            }
          },
        });
        console.log("Task status response for billId:", billId, res);

        if (res?.task?.status === "IN_PROGRESS") {
          setIsSelectionDisabled(true);
          if (res?.task?.type === "Transfer") {
            console.log("Polling started for billId:", billId);
            pollTaskUntilDone(billId, "Transfer", res);
          }
        } else {
          console.log("inside else 2")
          setIsSelectionDisabled(false);
        }
      } catch (e) {
        console.warn("Task status check failed for", billId, e);
        setShowToast({ key: "error", label: t("HCM_AM_SOMETHING_WENT_WRONG"), transitionTime: 2000 });
      };
    }
  }, [BillData]);
  
  // Cleanup polling timer on unmount
  useEffect(() => {
    return () => {
      Object.values(transferPollTimers).forEach(clearTimeout);
    };
  }, []); 

  const getPaginatedData = (data, currentPage, rowsPerPage) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };
  useEffect(() => {
    const slicedData = getPaginatedData(tableData, currentPage, rowsPerPage);
    setPaginatedData(slicedData);
  }, [tableData, currentPage, rowsPerPage]);
  useEffect(() => {
    setSelectedRows([]);
    setClearSelectedRows(prev => !prev);
  }, [activeLink])
  useEffect(() => {
    if (billData && AllIndividualsData && workerRatesData) {
      const enriched = addIndividualDetailsToBillDetails(
        billData?.billDetails,
        AllIndividualsData,
        workerRatesData
      );
      const statusMap = {
        VERIFICATION_FAILED: ["VERIFICATION_FAILED"], //send for edit action
        PAYMENT_FAILED: ["PAYMENT_FAILED"],
        VERIFIED: ["VERIFIED", "PAYMENT_FAILED"], //generate payment action
        PAYMENT_GENERATED: ["PAID"],
        NOT_VERIFIED: ["PENDING_VERIFICATION", "EDITED","PENDING_EDIT"], //verify action
        PENDING_FOR_EDIT: ["PENDING_EDIT"], //EDIT action
        EDITED: ["EDITED"]
      };
      const filtered = enriched.filter((item) =>
        statusMap[activeLink.code]?.includes(item.status)
      );
      console.log("Filtered Data:", filtered);
      setTableData(filtered || []);
        const counts = {};
    Object.keys(statusMap).forEach((key) => {
      counts[key] = enriched.filter((item) =>
        statusMap[key]?.includes(item.status)
      ).length;
    });

    setTabCounts(counts);
    }
  }, [AllIndividualsData, billData, workerRatesData, activeLink]);

  const renderLabelPair = (heading, text, style) => (
    <div className="label-pair">
      <span className="view-label-heading">{t(heading)}</span>
      <span className="view-label-text" style={style}>{text} </span>
    </div>
  );




  if (isBillLoading || isAllIndividualsLoading || isLoading || isFetching || isHrmsSearchLoading) {
    console.log("Loading bill data or individual data...");
    return <LoaderScreen />
  }

  console.log("Rendering buttons for:", activeLink?.code);
  console.log("mob num:", tableData);

  return (
    <React.Fragment>
      <div style={{ marginBottom: "2.5rem" }}>
        <Header styles={{ marginBottom: "1rem" }} className="pop-inbox-header">
          {editBillDetails ? t('HCM_AM_EDIT_BILL') : t('HCM_AM_VERIFY_BILL_AND_GENERATE_PAYMENT')}
        </Header>
        <Card type="primary" className="bottom-gap-card-payment">
          {isBillLoading || isFetching ? (
            <Loader />
          ) : (
            <>
              {renderLabelPair('HCM_AM_BILL_NUMBER', billData?.billNumber || t("NA"), { color: "#C84C0E" })}
              {renderLabelPair('HCM_AM_BILL_DATE', billData?.billDate ? formatTimestampToDate(billData.billDate) : t("NA"))}
              {renderLabelPair('HCM_AM_NO_OF_REGISTERS', billData?.additionalDetails.noOfRegisters || t("NA"))}
              {renderLabelPair('HCM_AM_NUMBER_OF_WORKERS', billData?.billDetails.length || t("NA"))}
              {renderLabelPair('HCM_AM_BOUNDARY_CODE', billData?.localityCode || t("NA"))}
              {renderLabelPair(
                'HCM_AM_STATUS',
                <span
                  style={{
                    backgroundColor:
                      billData?.status === "FULLY_VERIFIED" || billData?.status === "FULLY_PAID"
                        ? "#00703C" // Green
                        : billData?.status === "PARTIALLY_VERIFIED" || billData?.status === "PARTIALLY_PAID"
                          ? "#9E5F00" // Yellow
                          : "#B91900", // Red fallback
                    color: "#fff",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontWeight: "bold",
                    display: "inline-block",
                    minWidth: "100px",
                    textAlign: "center",
                  }}
                >
                  {t(billData?.status || "NA")}
                </span>
              )}
              {
                <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                  {
                    billData?.billDetails?.some((item) =>
        ["VERIFICATION_FAILED", "PENDING_EDIT", "PAYMENT_FAILED"].includes(item.status)
      ) && (
                    <InfoCard
                      variant="error"
                      style={{ margin: "0rem", width: "100%", maxWidth: "unset", height: "90px" }}
                      label={t(`HCM_AM_BILL_ERROR_CARD_HEADING`)}
                      text={t(`HCM_AM_BILL_ERROR_INFO_TEXT`)}
                    />
                  )}
                </div>
              }
            </>
          )}
        </Card>

        {
          (
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
                  minWidth: "240px"
              }}
              configNavItems={!editBillDetails ? [
                {
        code: "NOT_VERIFIED",
        name: `${t("HCM_AM_NOT_VERIFIED")} (${tabCounts["NOT_VERIFIED"] || 0})`,
      },
      {
        code: "VERIFICATION_FAILED",
        name: `${t("HCM_AM_VERIFICATION_FAILED")} (${tabCounts["VERIFICATION_FAILED"] || 0})`,
      },
      {
        code: "VERIFIED",
        name: `${t("HCM_AM_VERIFIED")} (${tabCounts["VERIFIED"] || 0})`,
      },
      {
        code: "PAYMENT_GENERATED",
        name: `${t("HCM_AM_PAYMENT_GENERATED")} (${tabCounts["PAYMENT_GENERATED"] || 0})`,
      },
      {
        code: "PAYMENT_FAILED",
        name: `${t("HCM_AM_PAYMENT_FAILED")} (${tabCounts["PAYMENT_FAILED"] || 0})`,
      },
    ]
  : [
      {
        code: "PENDING_FOR_EDIT",
        name: `${t("HCM_AM_PENDING_FOR_EDIT")} (${tabCounts["PENDING_FOR_EDIT"] || 0})`,
      },
      {
        code: "EDITED",
        name: `${t("HCM_AM_EDITED")} (${tabCounts["EDITED"] || 0})`,
      },
                ]}
              navStyles={{
                  display: "flex",
                  width: "100%",
                }}
              onTabClick={(e) => {
                setLimitAndOffset((prev) => {
                  return {
                    limit: prev.limit,
                    offset: 0,
                  };
                });
                setCurrentPage(1);
                setActiveLink(e);                
              }}
              setActiveLink={setActiveLink}
              showNav={true}
              style={{ width: "100%" }} 
            />
          )
        }
        <Card style={{ width: "100%", }}>
          {isBillLoading || isFetching ? (
            <Loader />
          ) : tableData.length === 0 ? (
            <NoResultsFound text={t(`HCM_AM_NO_DATA_FOUND_FOR_BILLS`)} />
          ) : (
            <Fragment>
              <BillDetailsTable
                style={{ width: "100%", }}
                data={paginatedData} totalCount={tableData.length}
                selectableRows={!["PAYMENT_GENERATED", "EDITED"].includes(activeLink?.code)}
                status={activeLink?.code}
                editBill={editBillDetails}
                clearSelectedRows={clearSelectedRows}
                onSelectionChange={setSelectedRows}
                selectedBills={selectedRows}
                isSelectionDisabled={isSelectionDisabled}
                rowsPerPage={rowsPerPage} currentPage={currentPage} handlePageChange={handlePageChange}
                handlePerRowsChange={handlePerRowsChange}
              />
            </Fragment>
          )}
        </Card>

      </div>
      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          // error={showToast.key === "error"}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )}


      {openSendForEditPopUp && <SendForEditPopUp
        isEditTrue={editBillDetails}
        dropdownOptions={hrmsUsersData ? hrmsUsersData.map((emp) => ({
          title: emp?.user?.name,
          value: emp?.user?.userServiceUuid,
        })) : []}
        onClose={() => {
          setOpenSendForEditPopUp(false);
        }}
        onSubmit={(comment, selectedUser) => {
          // setComment(comment);
          setOpenSendForEditPopUp(false);
          updateBillDetailWorkflow(billData, selectedRows, "SEND_FOR_EDIT", selectedUser);
          // setOpenApproveAlertPopUp(true);
        }}
      />}
      {/* action bar for bill generation*/}
      {/* {showGenerateBillAction && BillData?.bills?.length === 0 && */}
      {activeLink?.code !== "PAYMENT_GENERATED" && (
        <ActionBar
          actionFields={
            !editBillDetails && activeLink?.code === 'NOT_VERIFIED' ?
              [                
                <Button
                  className="custom-class"
                  iconFill=""
                  label={t(`HCM_AM_VERIFY`)}
                  menuStyles={{
                    bottom: "40px",
                  }}
                  optionsKey="name"
                  onClick={() => {
                    setOpenVerifyAlertPopUp(true);
                  }}
                  size=""
                  style={{ minWidth: "14rem" }}
                  title=""
                  type="button"
                  variation="primary"
                  isDisabled={selectedRows.length === 0}

                />
              ] :
              !editBillDetails && activeLink?.code === 'VERIFICATION_FAILED' ?
                [
                  <Button
                    className="custom-class"
                    icon="Arrow"
                    label={t(`HCM_AM_SEND_FOR_EDIT`)}
                    menuStyles={{
                      bottom: "40px",
                    }}
                    onClick={() => {
                      // triggerSearchHrmsUsers();
                      setOpenSendForEditPopUp(true);
                      // updateBillDetailWorkflow(billData, selectedRows, "SEND_BACK_FOR_EDIT");
                    }}
                    optionsKey="name"
                    size=""
                    style={{ minWidth: "14rem" }}
                    title=""
                    type="button"
                    // variation="secondary"
                    variation="primary"
                    isDisabled={
                      // billData?.status === "PENDING_VERIFICATION" || 
                      selectedRows.length === 0}
                  />
                  // ,
                  //     <Button
                  //   className="custom-class"
                  //   iconFill=""
                  //   label={t(`HCM_AM_VERIFY`)}
                  //   menuStyles={{
                  //     bottom: "40px",
                  //   }}             
                  //   optionsKey="name"
                  //   size=""
                  //   style={{ minWidth: "14rem" }}
                  //   title=""
                  //   type="button"
                  //   variation="primary"
                  //   isDisabled={selectedRows.length === 0}

                  // />
                ] :
                editBillDetails && activeLink?.code === 'PENDING_FOR_EDIT' ?
                  [
                    <Button
                      className="custom-class"
                      icon="Arrow"
                      label={t(`HCM_AM_SAVE_CHANGES_AND_FORWARD`)}
                      menuStyles={{
                        bottom: "40px",
                      }}
                      onClick={() => {
                        //TODO: add alert popup
                        setOpenEditAlertPopUp(true);
                        // triggerIndividualBulkUpdate(AllIndividualsData,selectedRows, billData);
                        // setOpenSendForEditPopUp(true);
                      }}
                      optionsKey="name"
                      size=""
                      style={{ minWidth: "14rem" }}
                      title=""
                      type="button"
                      variation="primary"
                      isDisabled={selectedRows.length === 0}

                    />
                  ]
                  : !editBillDetails && activeLink?.code === 'VERIFIED' ? [
                    <Button
                      label={t(`HCM_AM_GENERATE_PAYMENT`)}
                      title={t(`HCM_AM_GENERATE_PAYMENT`)}
                      onClick={() => {
                        setOpenApprovePaymentAlertPopUp(true);
                      }}
                      style={{ minWidth: "14rem" }}
                      type="button"
                      variation="primary"
                      isDisabled={selectedRows.length === 0}
                    // isDisabled={updateMutation.isLoading || updateDisabled || !isSubmitEnabled}
                    />
                  ]
                   : !editBillDetails && activeLink?.code === 'PAYMENT_FAILED' ? [
                    <Button
                    className="custom-class"
                    icon="Arrowback"
                    label={t(`HCM_AM_SEND_FOR_EDIT`)}
                    menuStyles={{
                      bottom: "40px",
                    }}
                    onClick={() => {
                      setOpenSendForEditPopUp(true);
                    }}
                    optionsKey="name"
                    size=""
                    style={{ minWidth: "14rem" }}
                    title=""
                    type="button"
                    variation="secondary"
                    
                    isDisabled={selectedRows.length === 0}
                  />,
                    <Button
                      label={t(`HCM_AM_GENERATE_PAYMENT`)} //TODO : change to RETRY PAYMENT
                      title={t(`HCM_AM_GENERATE_PAYMENT`)}
                      onClick={() => {
                        setOpenApprovePaymentAlertPopUp(true);
                      }}
                      style={{ minWidth: "14rem" }}
                      type="button"
                      variation="primary"
                      isDisabled={selectedRows.length === 0}
                    // isDisabled={updateMutation.isLoading || updateDisabled || !isSubmitEnabled}
                    />
                  ]
                    : []
          }
          className=""
          maxActionFieldsAllowed={5}
          setactionFieldsToRight
          sortActionFields
          style={{}}
        />
      )}
      {/* /* Alert Pop-Up for approve */}
      {openVerifyAlertPopUp && <AlertPopUp
        onClose={() => {
          setOpenVerifyAlertPopUp(false);
        }}
        alertHeading={t(`HCM_AM_ALERT_VERIFY_HEADING`)}
        alertMessage={t(`HCM_AM_ALERT_VERIFY_DESCRIPTION`)}
        submitLabel={t(`HCM_AM_APPROVE`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          triggerVerifyBill(billData, selectedRows);
          setOpenVerifyAlertPopUp(false);
        }}
      />}
      {openEditAlertPopUp && <AlertPopUp
        onClose={() => {
          setOpenEditAlertPopUp(false);
        }}
        alertHeading={t(`HCM_AM_ALERT_BILL_EDIT_HEADING`)}
        alertMessage={t(`HCM_AM_ALERT_BILL_EDIT_DESCRIPTION`)}
        submitLabel={t(`HCM_AM_APPROVE`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          triggerIndividualBulkUpdate(AllIndividualsData, selectedRows, billData);
          setOpenEditAlertPopUp(false);
        }}
      />}
      {openApprovePaymentAlertPopUp && <AlertPopUp
        onClose={() => {
          setOpenApprovePaymentAlertPopUp(false);
        }}
        alertHeading={t(`HCM_AM_ALERT_PAYMENT_HEADING`)}
        alertMessage={t(`HCM_AM_ALERT_PAYMENT_DESCRIPTION`)}
        submitLabel={t(`HCM_AM_APPROVE`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          triggerGeneratePayment(billData, selectedRows);
          setOpenApprovePaymentAlertPopUp(false);
        }}
      />}
      <div style={{
        display: "flex", flexDirection: "row", gap: "24px",
        // marginBottom: showGenerateBillAction && BillData?.bills?.length === 0 && !isBillLoading && !isFetchingBill && billGenerationStatus == null ? "2.5rem" : "0px" 
      }}>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ width: "100%", display: "flex", flexDirection: "row", height: "74vh", minHeight: "60vh" }}>


            <div>

            </div>
            {/* </Card>} */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default BillPaymentDetails;