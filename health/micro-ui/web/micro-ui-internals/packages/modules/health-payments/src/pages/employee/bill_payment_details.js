import React, { useState, useEffect, useRef, use, Fragment } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader, Header, LoaderWithGap } from "@egovernments/digit-ui-react-components";
import { Divider, Button, PopUp,InfoCard, Card, ActionBar, Link, ViewCardFieldPair, Toast, LoaderScreen, LoaderComponent,Tab,NoResultsFound, TooltipWrapper } from "@egovernments/digit-ui-components";
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
const BillPaymentDetails = ({ editBillDetails = false }) => { //TODO : set editBillDetails true or false to toggle actions
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

  const [showGeneratePaymentAction, setShowGeneratePaymentAction] = useState(false);
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
          code: "NOT_VERIFIED",
          name: "HCM_AM_NOT_VERIFIED",
      });
  const billDetails = [
        {
            "id": "123456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "status":"NOT_VERIFIED",
            "totalAmount": "150",
        },
        {
            "id": "223456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "status":"VERIFIED",
            "totalAmount": "150",
        },
        {
            "id": "323456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "status":"PAYMENT_GENERATED",
            "totalAmount": "150",
        },
        {
            "id": "222456",
            "name":"Worker 1",
            "role":"Distrubutor",
            "billDate": 1698307200000,
            "noOfDays": 5,
            "wage": "30",
            "status":"VERIFIED",
            "totalAmount": "150",
        }
    ]

  
  // context path variables
  // const attendanceContextPath = window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") || "health-attendance";
  // const musterRollContextPath = window?.globalConfigs?.getConfig("MUSTER_ROLL_CONTEXT_PATH") || "health-muster-roll";
  const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";
  const expenseContextPath = window?.globalConfigs?.getConfig("EXPENSE_CONTEXT_PATH") || "health-expense";
  const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
  // // State variables
  // const { registerNumber, boundaryCode } = Digit.Hooks.useQueryParams();
  // const { fromCampaignSupervisor } = location.state || false;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // const [attendanceDuration, setAttendanceDuration] = useState(null);
  // const [attendanceSummary, setAttendanceSummary] = useState([]);
  // const [initialAttendanceSummary, setInitialAttendanceSummary] = useState([]);
  // const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  // const paymentConfig = Digit?.SessionStorage.get("paymentsConfig");
  // const [disabledAction, setDisabledAction] = useState(fromCampaignSupervisor);
  // const [openEditAlertPopUp, setOpenEditAlertPopUp] = useState(false);
  // const [openApproveCommentPopUp, setOpenApproveCommentPopUp] = useState(false);
  // const [openApproveAlertPopUp, setOpenApproveAlertPopUp] = useState(false);
  // const [updateDisabled, setUpdateDisabled] = useState(false);
  // const [triggerCreate, setTriggerCreate] = useState(false);
  // const [searchCount, setSearchCount] = useState(1);
  // const [data, setData] = useState([]);
  const [individualIds, setIndividualIds] = useState([]);
  // const [triggerEstimate, setTriggerEstimate] = useState(false);
  // const [comment, setComment] = useState(null);
  // const [showToast, setShowToast] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [showLogs, setShowLogs] = useState(false);
  // const [showCommentLogPopup, setShowCommentLogPopup] = useState(false);

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
            enabled: project ? true : false,
            select: (data) => {
                return data;
            },
        },
    };

  const { isLoading: isBillLoading, data: BillData, refetch: refetchBill, isFetching } = Digit.Hooks.useCustomAPIHook(BillSearchCri);  
  
  const filterDataByStatus = (billData,status) => {
    console.log("here DataByStatus", status);
  setTableData(billData.billDetails.filter(item => item.status === status));
};
  const fetchIndividualIds = (billData) => {
    console.log("here ???0990")
    const billDetails = billData?.billDetails || [];
    if (Array.isArray(billDetails)) {
      const ids = billDetails.map((billDetail) => billDetail?.payee?.identifier).filter(Boolean);
      setIndividualIds(ids);
      console.log("Individual IDs:", ids);
    }
  }

  


  // const AttendancereqCri = {
  //   url: `/${attendanceContextPath}/v1/_search`,
  //   params: {
  //     tenantId: tenantId,
  //     registerNumber: registerNumber
  //   },
  //   config: {
  //     enabled: registerNumber ? true : false,
  //     select: (data) => {
  //       return data;
  //     },
  //   },
  // };

  // const { isLoading: isAttendanceLoading, data: AttendanceData } = Digit.Hooks.useCustomAPIHook(AttendancereqCri);

  // /// ADDED CONDITION THAT IF CAMPAIGN HAS NOT ENDED THEN WE WILL SHOW ESTIMATE DATA ONLY AND DISABLED ALL THE ACTIONS

  // useEffect(() => {
  //   if (AttendanceData) {
  //     setAttendanceDuration(
  //       Math.ceil((AttendanceData?.attendanceRegister[0]?.endDate - AttendanceData?.attendanceRegister[0]?.startDate) / (24 * 60 * 60 * 1000))
  //     );
  //     if (AttendanceData?.attendanceRegister?.[0]?.reviewStatus === "APPROVED") {
  //       setDisabledAction(true);
  //     }
  //     if (!paymentConfig.enableApprovalAnyTime && AttendanceData?.attendanceRegister[0]?.endDate > new Date()) {
  //       setDisabledAction(true);
  //     }
  //   }
  // }, [AttendanceData])

  // const reqCri = {
  //   url: `/${musterRollContextPath}/v1/_estimate`,
  //   body: {
  //     musterRoll: {
  //       tenantId: tenantId,
  //       registerId: AttendanceData?.attendanceRegister[0]?.id,
  //       startDate: AttendanceData?.attendanceRegister[0]?.startDate,
  //       endDate: AttendanceData?.attendanceRegister[0]?.endDate
  //     }
  //   },
  //   config: {
  //     enabled: triggerEstimate,
  //     select: (data) => {
  //       return data;
  //     },
  //   },
  //   changeQueryName: registerNumber,
  // };

  // const { isLoading: isEstimateMusterRollLoading, data: estimateMusterRollData } = Digit.Hooks.useCustomAPIHook(reqCri);

  // /// SEARCH MUSTERROLL TO CHECK IF WE NEED TO SHOW ESTIMATE OR MUSTERROLL SEARCH DATA

  // const searchReqCri = {
  //   url: `/${musterRollContextPath}/v1/_search`,
  //   params: {
  //     tenantId: tenantId,
  //     registerId: AttendanceData?.attendanceRegister?.[0]?.id
  //   },
  //   config: {
  //     enabled: (AttendanceData?.attendanceRegister.length === 1 ? true : false),
  //     select: (data) => {
  //       return data;
  //     },
  //   }
  // };

  // const { isLoading: isMusterRollLoading, isrefetching, data: MusterRollData, refetch: refetchMusterRoll } = Digit.Hooks.useCustomAPIHook(searchReqCri);

  // useEffect(() => {
  //   if (MusterRollData?.count === 0) {
  //     if (disabledAction) {
  //       setTriggerEstimate(true);
  //     } else {
  //       if (triggerCreate) {
  //         if (searchCount > 3) {
  //           setShowToast({ key: "info", label: t(`HCM_AM_MUSTOROLE_GENERATION_INPROGRESS_INFO_MESSAGE`), transitionTime: 3000 });
  //           setTriggerEstimate(true);
  //           setDisabledAction(true);
  //         } else {
  //           setSearchCount((prevKey) => prevKey + 1);
  //           setLoading(true);
  //           setTimeout(() => {
  //             setLoading(false);
  //             refetchMusterRoll();
  //           }, 2000);
  //         }
  //       } else {
  //         setTriggerCreate(true);
  //         triggerMusterRollCreate();
  //       }
  //     }
  //   } else if (triggerEstimate === true) {
  //     setTriggerEstimate(false);
  //   }

  //   if (MusterRollData?.count > 0) {
  //     setData(MusterRollData?.musterRolls);
  //   } else if (estimateMusterRollData) {
  //     setData(estimateMusterRollData?.musterRolls);
  //   }

  // }, [estimateMusterRollData, MusterRollData]);
// useEffect(() => {
//   const billDetails = billData?.billDetails || [];
//   if (Array.isArray(billDetails)) {
//     const ids = billDetails.map((billDetail) => billDetail?.payee?.identifier).filter(Boolean);
//     setIndividualIds(ids);
//     console.log("Individual IDs:", ids);
//   }
// }, []);


  // const mutation = Digit.Hooks.useCustomAPIMutationHook({
  //   url: `/${musterRollContextPath}/v1/_create`,
  // });

  // const updateMutation = Digit.Hooks.useCustomAPIMutationHook({
  //   url: `/${musterRollContextPath}/v1/_update`,
  // });

  // const approveMutation = Digit.Hooks.useCustomAPIMutationHook({
  //   url: `/${musterRollContextPath}/v1/_update`,
  // });

  // const triggerMusterRollApprove = async () => {
  //   try {
  //     await approveMutation.mutateAsync(
  //       {
  //         body: {
  //           musterRoll: data?.[0],
  //           workflow: {
  //             action: "APPROVE",
  //             comments: comment,
  //           }
  //         },
  //       },
  //       {
  //         onSuccess: (data) => {
  //           history.push(`/${window.contextPath}/employee/payments/attendance-approve-success`, {
  //             state: "success",
  //             info: t("HCM_AM_MUSTER_ROLL_ID"),
  //             fileName: data?.musterRolls?.[0]?.musterRollNumber,
  //             description: t(`HCM_AM_ATTENDANCE_SUCCESS_DESCRIPTION`),
  //             message: t(`HCM_AM_ATTENDANCE_APPROVE_SUCCESS`),
  //             back: t(`GO_BACK_TO_HOME`),
  //             backlink: `/${window.contextPath}/employee`
  //           });
  //         },
  //         onError: (error) => {
  //           history.push(`/${window.contextPath}/employee/payments/attendance-approve-failed`, {
  //             state: "error",
  //             message: t(`HCM_AM_ATTENDANCE_APPROVE_FAILED`),
  //             back: t(`GO_BACK_TO_HOME`),
  //             backlink: `/${window.contextPath}/employee`
  //           });
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     /// will show estimate data only
  //   }
  // };

  // const triggerMusterRollUpdate = async () => {
  //   try {
  //     await updateMutation.mutateAsync(
  //       {
  //         body: {
  //           musterRoll: {
  //             ...data[0], // Spread the existing data
  //             individualEntries: data[0].individualEntries.map((entry) => {
  //               const updatedAttendance = attendanceSummary.find(
  //                 ([id,]) => id === entry.individualId
  //               )?.[4]; // Extract the updated actualTotalAttendance
  //               return {
  //                 ...entry,
  //                 modifiedTotalAttendance: updatedAttendance || entry.actualTotalAttendance,
  //               };
  //             }),
  //           },
  //           workflow: {
  //             action: "EDIT",
  //           },
  //         },
  //       },
  //       {
  //         onSuccess: (data) => {
  //           setShowToast({ key: "success", label: t("HCM_AM_ATTENDANCE_UPDATED_SUCCESSFULLY"), transitionTime: 3000 });
  //           // Delay the navigation for 3 seconds
  //           setTimeout(() => {
  //             setUpdateDisabled(false);
  //             history.push(`/${window.contextPath}/employee/payments/view-attendance?registerNumber=${registerNumber}&boundaryCode=${boundaryCode}`);
  //           }, 2000);
  //         },
  //         onError: (error) => {
  //           setUpdateDisabled(false);
  //           setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.message), transitionTime: 3000 });
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     /// will show estimate data only
  //   }
  // };

  // const triggerMusterRollCreate = async () => {

  //   try {
  //     await mutation.mutateAsync(
  //       {
  //         body: {
  //           musterRoll: {
  //             tenantId: tenantId,
  //             registerId: AttendanceData?.attendanceRegister[0]?.id,
  //             startDate: AttendanceData?.attendanceRegister[0]?.startDate,
  //             endDate: AttendanceData?.attendanceRegister[0]?.endDate
  //           },
  //           workflow: {
  //             action: "SUBMIT",
  //           }
  //         },
  //       },
  //       {
  //         onSuccess: (data) => {
  //           setLoading(true);
  //           setTimeout(() => {
  //             setLoading(false);
  //             refetchMusterRoll();
  //           }, 2000);
  //         },
  //         onError: (error) => {
  //           setTriggerEstimate(true);
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     setTriggerEstimate(true);
  //   }

  // };
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
      config:{
        enabled: billData ? true : false,
        select: (mdmsData) => {
                return mdmsData.MdmsRes.HCM.WORKER_RATES.filter((item)=>item.campaignId === billData?.referenceId)?.[0]
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

  const { isLoading: isAllIndividualsLoading, data: AllIndividualsData } = Digit.Hooks.useCustomAPIHook(allIndividualReqCriteria);
  function addIndividualDetailsToBillDetails(billDetails, individualsData, workerRatesData) {
    return billDetails.map((billDetail) => {
      const individual = individualsData?.Individual?.find(
        (ind) => ind.id === billDetail?.payee?.identifier
      );
       const rateObj = workerRatesData?.rates?.find(
      (rate) => rate?.skillCode === individual?.userDetails?.roles?.[0]?.code
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
        wage: wage+" "+workerRatesData?.currency,
      };
    });
  }
  useEffect(() => {
    console.log("AllIndividualsData", AllIndividualsData);
    if (billData && AllIndividualsData) {
      const updatedBillDetails = addIndividualDetailsToBillDetails(billData?.billDetails, AllIndividualsData,workerRatesData);
      setTableData(updatedBillDetails);
    }
  }, [AllIndividualsData, billData, workerRatesData]);

  useEffect(() => {
    if (BillData) {
    console.log("BillData1223", BillData);
    const bill = BillData.bills?.[0] || null;
    setBillData(bill); 
    filterDataByStatus(bill,"ACTIVE");//TODO: change status
    fetchIndividualIds(bill);
    }
  },[BillData])

  const getPaginatedData = (data, currentPage, rowsPerPage) => {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  return data.slice(startIndex, endIndex);
};
  useEffect(() => {
    const slicedData = getPaginatedData(tableData, currentPage, rowsPerPage);
    setPaginatedData(slicedData);
  }, [tableData, currentPage, rowsPerPage]);
  // const individualReqCriteria = {
  //   url: `/${individualContextPath}/v1/_search`,
  //   params: {
  //     tenantId: tenantId,
  //     limit: 100,
  //     offset: 0,
  //   },
  //   body: {
  //     Individual: {
  //       id: [AttendanceData?.attendanceRegister[0]?.staff?.find(
  //         (staff) => staff?.staffType?.includes("OWNER")
  //       )?.userId]
  //     }
  //   },
  //   config: {
  //     enabled: AttendanceData?.attendanceRegister.length === 1 && AttendanceData?.attendanceRegister[0]?.staff?.find(
  //       (staff) => staff?.staffType?.includes("OWNER")
  //     )?.userId ? true : false,
  //     select: (data) => {
  //       return data;
  //     },
  //   },
  // };

  // const { isLoading: isIndividualsLoading, data: individualsData } = Digit.Hooks.useCustomAPIHook(individualReqCriteria);

  // function getUserAttendanceSummary(data, individualsData, t) {
  //   const attendanceLogData = data[0].individualEntries.map((individualEntry) => {
  //     const individualId = individualEntry.individualId;
  //     const matchingIndividual = individualsData?.Individual?.find(
  //       (individual) => individual.id === individualId
  //     );

  //     if (matchingIndividual) {
  //       const userName = matchingIndividual.name?.givenName || t("NA");
  //       const uniqueId = matchingIndividual?.name?.familyName || t("NA");
  //       const userId = matchingIndividual?.userDetails?.username || t("NA");
  //       const userRole =
  //         t(matchingIndividual.skills?.[0]?.type) || t("NA");
  //       const noOfDaysWorked = individualEntry?.modifiedTotalAttendance || individualEntry.actualTotalAttendance || 0;
  //       const id = individualEntry.individualId || 0;
  //       const gender = matchingIndividual?.gender;
  //       const dob = matchingIndividual?.dateOfBirth;
  //       const mobileNumber = matchingIndividual?.mobileNumber;
  //       const userType = matchingIndividual?.additionalFields?.fields?.find(
  //         (detail) => detail.key === "userType"
  //     )?.value || "N/A";
  //       return [id, userName, userId, userRole, noOfDaysWorked, gender, dob, mobileNumber, uniqueId, userType];
  //     } else {
  //       // Handle cases where no match is found in individualsData
  //       return ["N/A", "Unknown", "N/A", "Unassigned", individualEntry?.modifiedTotalAttendance || individualEntry.actualTotalAttendance || 0];
  //     }
  //   });

  //   const sortedData = [...attendanceLogData].sort((a, b) => {
  //     const nameA = a[1].toLowerCase(); // Convert to lowercase for case-insensitive sorting
  //     const nameB = b[1].toLowerCase();
  //     return nameA.localeCompare(nameB);
  //   });

  //   return sortedData;
  // }

  // // Populate attendanceSummary when AttendanceData changes
  // useEffect(() => {

  //   if (data.length > 0 && AllIndividualsData) {
  //     setAttendanceSummary(getUserAttendanceSummary(data, AllIndividualsData, t));
  //   }

  // }, [AllIndividualsData, data]); /// need to update dependency


  // useEffect(() => {
  //   if (attendanceSummary.length > 0 && initialAttendanceSummary.length === 0) {
  //     // Store the initial state of attendanceSummary when data is loaded for the first time
  //     setInitialAttendanceSummary(attendanceSummary);
  //   }
  // }, [attendanceSummary]);

  // useEffect(() => {
  //   if (attendanceSummary.length > 0 && initialAttendanceSummary.length > 0) {

  //     // Compare the current attendanceSummary with the initialAttendanceSummary using Lodash
  //     const hasChanged = !_.isEqual(attendanceSummary, initialAttendanceSummary);

  //     if (hasChanged) {
  //       if (!isSubmitEnabled) {
  //         setIsSubmitEnabled(true);
  //       }
  //     } else {
  //       if (isSubmitEnabled) {
  //         setIsSubmitEnabled(false);
  //       }
  //     }
  //   }

  // }, [attendanceSummary]);

  // const closeActionBarPopUp = () => {
  //   setOpenEditAlertPopUp(false);
  // };
  // const handleCommentLogClick = () => {
  //   setShowCommentLogPopup(true);
  // };

  // const onCommentLogClose = () => {
  //   setShowCommentLogPopup(false);
  // };
  const renderLabelPair = (heading, text,style) => (
    <div className="label-pair">
      <span className="view-label-heading">{t(heading)}</span>
      <span className="view-label-text" style={style}>{text} </span>
    </div>
  );

  // if (updateMutation.isLoading) {
  //   return <LoaderComponent variant={"OverlayLoader"} />
  // }

  // if (loading || isAttendanceLoading || isEstimateMusterRollLoading || isIndividualsLoading || isMusterRollLoading || isAllIndividualsLoading || mutation.isLoading || isrefetching) {
  //   return <LoaderScreen />
  // }
  

  if ( isBillLoading || isAllIndividualsLoading || isFetching) {
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
          {renderLabelPair('HCM_AM_BILL_NUMBER',billData?.billNumber || t("NA"), { color: "#C84C0E" } )}
          {renderLabelPair('HCM_AM_BILL_DATE', billData?.billDate ? formatTimestampToDate(billData.billDate) : t("NA"))}
          {renderLabelPair('HCM_AM_NUMBER_OF_REGISTERS', billData?.additionalDetails.noOfRegisters || t("NA"))}
          {renderLabelPair('HCM_AM_NUMBER_OF_WORKERS', billData?.billDetails.length || t("NA"))}
          {renderLabelPair('HCM_AM_BOUNDARY_CODE', billData?.localityCode || t("NA"))}
          {/* TODO : add Tag conditionally for status */}
          {renderLabelPair('HCM_AM_STATUS', billData?.status || t("NA"))} 
          {
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                {editBillDetails && (
                  <InfoCard
                    variant="error"
                    style={{ margin: "0rem", width: "100%", maxWidth: "unset", height: "90px" }}
                    label={t(`HCM_AM_ERROR`)}
                    text={t("few details are missing lorem ipsum dolor sit amet")}
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
                                        itemStyle={{ width: "400px" }}
                                        configNavItems={[
                                            {
                                                code: "NOT_VERIFIED",
                                                name: `${`${t(`HCM_AM_NOT_VERIFIED`)} `}`,
                                            },
                                            {
                                              code: "VERIFIED",
                                              name: `${`${t(`HCM_AM_VERIFIED`)} `}`,
                                            },
                                            {
                                                code: "PAYMENT_GENERATED",
                                                name: `${`${t(`HCM_AM_PAYMENT_GENERATED`)} `}`,
                                            },
                                        ]}
                                        navStyles={{}}
                                        onTabClick={(e) => {
                                            setLimitAndOffset((prev) => {
                                                return {
                                                    limit: prev.limit,
                                                    offset: 0,
                                                };
                                            });
                                            setCurrentPage(1);
                                            setActiveLink(e);
                                            // filterDataByStatus(e?.code);
                                            //TODO: uncomment this line later
                                        }}
                                        setActiveLink={setActiveLink}
                                        showNav={true}
                                        style={{}}
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
                data={paginatedData} totalCount={tableData.length} selectableRows={true} 
                status={activeLink?.code} editBill={editBillDetails}
                rowsPerPage={rowsPerPage} currentPage={currentPage} handlePageChange={handlePageChange}
                    handlePerRowsChange={handlePerRowsChange} 
                    />
                    </Fragment>
  )}
            </Card>
        {/* <Card className="bottom-gap-card-payment">
          <AttendanceManagementTable data={attendanceSummary} setAttendanceSummary={setAttendanceSummary} duration={attendanceDuration} editAttendance={editAttendance} />
        </Card> */}
        {/* {showLogs && <Card >
          <div className="card-heading">
            <h2 className="card-heading-title">{t(`HCM_AM_COMMENT_LOG_HEADING`)}</h2>
            <Button
              className="custom-class"
              icon="Visibility"
              iconFill=""
              label={t(`HCM_AM_COMMENT_LOG_VIEW_LINK_LABEL`)}
              onClick={handleCommentLogClick}
              options={[]}
              optionsKey=""
              size=""
              style={{}}
              title={t(`HCM_AM_COMMENT_LOG_VIEW_LINK_LABEL`)}
              variation="secondary"
            />
          </div>
        </Card>} */}
        {/* {showCommentLogPopup && (
          <CommentPopUp
            onClose={onCommentLogClose}
            businessId={data?.[0]?.musterRollNumber}
            heading={`${t("HCM_AM_STATUS_LOG_FOR_LABEL")}`}
          />
        )} */}
      </div>

      {/* Alert Pop-Up for edit */}
      {/* {openEditAlertPopUp && <AlertPopUp
        onClose={closeActionBarPopUp}
        alertHeading={t(`HCM_AM_ALERT_HEADING`)}
        alertMessage={t(`HCM_AM_ALERT_EDIT_DESCRIPTION`)}
        submitLabel={t(`HCM_AM_PROCEED`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          history.push(`/${window.contextPath}/employee/payments/edit-attendance?registerNumber=${registerNumber}&boundaryCode=${boundaryCode}`);
        }} */}
      {/* />} */}

      {/* Alert Pop-Up for approve */}
      {/* {openApproveAlertPopUp && <AlertPopUp
        onClose={() => {
          setOpenApproveAlertPopUp(false);
        }}
        alertHeading={t(`HCM_AM_ALERT_APPROVE_HEADING`)}
        alertMessage={t(`HCM_AM_ALERT_APPROVE_DESCRIPTION`)}
        submitLabel={t(`HCM_AM_APPROVE`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          triggerMusterRollApprove();
        }}
      />} */}

      {/* approve comment pop-up*/}
      {/* {openApproveCommentPopUp && <ApproveCommentPopUp
        onClose={() => {
          setOpenApproveCommentPopUp(false);
        }}
        onSubmit={(comment) => {
          setComment(comment);
          setOpenApproveCommentPopUp(false);
          setOpenApproveAlertPopUp(true);
        }}
      />} */}
 {openSendForEditPopUp && <SendForEditPopUp
        isEditTrue={editBillDetails}
        onClose={() => {
          setOpenSendForEditPopUp(false);
        }}
        onSubmit={(comment) => {
          // setComment(comment);
          setOpenSendForEditPopUp(false);
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
              icon="ArrowBack"
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

            />,
                <Button
              className="custom-class"
              iconFill=""
              label={t(`HCM_AM_VERIFY`)}
              menuStyles={{
                bottom: "40px",
              }}             
              optionsKey="name"
              size=""
              style={{ minWidth: "14rem" }}
              title=""
              type="button"
              variation="primary"

            />
            ]:
             editBillDetails && activeLink?.code === 'NOT_VERIFIED' ?
          [          
            <Button
              className="custom-class"
              icon="Arrow"
              label={t(`HCM_AM_SAVE_CHANGES_AND_FORWARD`)}
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
              variation="primary"

            />
            ]
          : 'VERIFIED' ? [
            <Button
              label={t(`HCM_AM_GENERATE_PAYMENT`)}
              title={t(`HCM_AM_GENERATE_PAYMENT`)}
              // onClick={() => {
              //   setUpdateDisabled(true);
              //   triggerMusterRollUpdate();
              // }}
              style={{ minWidth: "14rem" }}
              type="button"
              variation="primary"
              // isDisabled={updateMutation.isLoading || updateDisabled || !isSubmitEnabled}
            />
            ]
            :[]
        }
        className=""
        maxActionFieldsAllowed={5}
        setactionFieldsToRight
        sortActionFields
        style={{}}
      />
      )}
      {/* } */}
      {/* {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          // error={showToast.key === "error"}
          transitionTime={showToast.transitionTime}
          onClose={() => setShowToast(null)}
        />
      )} */}
                  <div style={{ display: "flex", flexDirection: "row", gap: "24px", 
                    // marginBottom: showGenerateBillAction && BillData?.bills?.length === 0 && !isBillLoading && !isFetchingBill && billGenerationStatus == null ? "2.5rem" : "0px" 
                    }}>
            
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>                    
                    <div style={{ width: "100%", display: "flex", flexDirection: "row", height: "74vh", minHeight: "60vh" }}>
                        
                        {/* {
                        tableData && 
                        <Card style={{ width: "100%", }}> */}
                            {/* {tableData != null && <div className="summary-sub-heading">{t(selectedProject?.name)}</div>}
                            {tableData != null && <div style={{ color: "#0b4b66" }}>{t(selectedLevel?.name)}</div>} */}
                            <div>
                                {/* {
                                // (approvalCount !== null && pendingApprovalCount !== null) && 
                                (
                                    <Tab
                                        // activeLink={activeLink?.code}
                                        configItemKey="code"
                                        configDisplayKey="name"
                                        itemStyle={{ width: "400px" }}
                                        configNavItems={[
                                            {
                                                code: "NOT_VERIFIED",
                                                name: `${`${t(`HCM_AM_NOT_VERIFIED`)} `}`,
                                            },
                                            {
                                              code: "VERIFIED",
                                              name: `${`${t(`HCM_AM_VERIFIED`)} `}`,
                                            },
                                            {
                                                code: "PAYMENT_GENERATED",
                                                name: `${`${t(`HCM_AM_PAYMENT_GENERATED`)} `}`,
                                            },
                                        ]}
                                        navStyles={{}}
                                        // onTabClick={(e) => {
                                        //     setLimitAndOffset((prev) => {
                                        //         return {
                                        //             limit: prev.limit,
                                        //             offset: 0,
                                        //         };
                                        //     });
                                        //     setCurrentPage(1);
                                        //     setActiveLink(e);
                                        // }}
                                        // setActiveLink={setActiveLink}
                                        showNav={true}
                                        style={{}}
                                    />
                                )} */}
                                {/* <Card style={{ width: "100%", }}>
                {<VerifyAndGeneratePaymentsTable 
                style={{ width: "100%", }}
                data={tableData} totalCount={totalCount} selectableRows={false} rowsPerPage={rowsPerPage} currentPage={currentPage} handlePageChange={handlePageChange}
                    handlePerRowsChange={handlePerRowsChange} 
                    />}
            </Card> */}
                                {/* {tableData && <div style={{ maxHeight: approvalCount !== null && pendingApprovalCount !== null ? infoDescription ? "60vh" : "74vh" : "30vh" }}> <Card>
                                    <BillInboxTable
                                        isFetching={isFetching}
                                        tableData={tableData}
                                        currentPage={currentPage}
                                        rowsPerPage={rowsPerPage}
                                        handlePageChange={handlePageChange}
                                        handlePerRowsChange={handlePerRowsChange}
                                        totalCount={totalCount}
                                        status={activeLink.code}
                                        infoDescription={infoDescription}
                                    ></BillInboxTable>
                                </Card></div>} */}
                            </div>
                        {/* </Card>} */}
                    </div>
                </div>
            </div>
    </React.Fragment>
  );
};
export default BillPaymentDetails;