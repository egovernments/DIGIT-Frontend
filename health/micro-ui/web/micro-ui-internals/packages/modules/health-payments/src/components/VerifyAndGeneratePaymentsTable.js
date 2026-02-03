import React, { Fragment, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, CustomSVG, Tag, Toast } from "@egovernments/digit-ui-components";
import { downloadFileWithName, formatTimestampToDate, getCustomPaginationOptions } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";
import { useHistory } from "react-router-dom";
import SendForEditPopUp from "../components/sendForEditPopUp";
import AlertPopUp from "../components/alertPopUp";

/**
 * @function VerifyAndGeneratePaymentsTable
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of objects containing bill data
 * @param {Function} props.handlePageChange - Function to handle page change
 * @param {Function} props.handlePerRowsChange - Function to handle per row change
 * @param {Number} props.currentPage - Current page number
 * @param {Number} props.rowsPerPage - Number of rows per page
 * @param {Number} props.totalCount - Total count of bills
 * @returns {React.ReactElement} Returns the component
 */

const VerifyAndGeneratePaymentsTable = ({ 
    setTaskStatus,
    onTaskDone,
    isLoading,
    setIsLoading,
    inProgressBillsVerify = {},
    inProgressBillsTransfer = {},
    setInProgressBillsTransfer,
    setInProgressBillsVerify,
    ...props }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast, setShowToast] = useState(null);
    const project = Digit?.SessionStorage.get("staffProjects");
    const selectedProject = Digit?.SessionStorage.get("selectedProject");
    const [openSendForEditPopUp, setOpenSendForEditPopUp] = useState(false);
    
    const [editPopupState, setEditPopupState] = useState({
            open: false,
            row: null,
            });
    const [verifyPopupState, setVerifyPopupState] = useState({
            open: false,
            row: null,
            });
    const [paymentPopupState, setPaymentPopupState] = useState({
            open: false,
            row: null,
            });


    const updateBillDetailMutation = Digit.Hooks.useCustomAPIMutationHook({
       url: `/health-expense/v1/bill/details/status/_update`,
    });
    const updateBillDetailWorkflow = async(bill,billDetails, wfState) => {
      try{
        await updateBillDetailMutation.mutateAsync(
          {
            body: {
                bill:{
                    ...bill,
                    billDetails: billDetails
                },
                workflow: {
                    action: wfState,                    
                }
            },
        },
        {
            onSuccess: async () => {
                setShowToast({
                    key: "success",
                    label: t(`HCM_AM_SELECTED_BILL_DETAILS_${wfState}_SUCCESS`), //TODO UPDATE TOAST MSG
                    transitionTime: 2000,
                });             
            },
            onError: (error) => {
              console.log("12Error updating bill detail workflow:", error);
                    setShowToast({
                        key: "error",
                        label: error?.response?.data?.Errors?.[0]?.message || t("HCM_AM_BILL_DETAILS_SENT_FOR_EDIT_ERROR"),//TODO UPDATE TOAST MSG
                        transitionTime: 2000,
                    });
                },
        }, 
          )
        }catch (error) {
            console.log("Error updating bill detail workflow:", error);
            setShowToast({
                key: "error",
                label: t("HCM_AM_BILL_DETAILS_SENT_FOR_EDIT_ERROR"), //TODO UPDATE TOAST MSG
                transitionTime: 3000,
            }); 
        }
            }
        const sendBillDetailsForEdit = async (selectedBill) => {
            const detailsToEdit = selectedBill?.billDetails?.filter(
                (detail) => detail?.status === "VERIFICATION_FAILED" || detail?.status === "PAYMENT_FAILED"
            );

            if (!detailsToEdit || detailsToEdit.length === 0){
                setShowToast({
                    key: "info",
                    label: t("HCM_AM_NO_BILL_DETAILS_TO_EDIT"), //TODO UPDATE TOAST MSG
                    transitionTime: 2000,
                });
                return;
            }
          
            setIsLoading(true);
            await updateBillDetailWorkflow(selectedBill, detailsToEdit, "SEND_FOR_EDIT");
            setIsLoading(false);

            setShowToast({
                key: "success",
                label: t("HCM_AM_BILL_DETAILS_SENT_FOR_EDIT_SUCCESS"), //TODO UPDATE TOAST MSG
                transitionTime: 2000,
            });
            onTaskDone?.(); //  trigger bill search in parent

        };

            
     const getTaskStatusMutation = Digit.Hooks.useCustomAPIMutationHook({
        url: `/health-expense/v1/task/_status`,
    });
 const verifyBillMutation = Digit.Hooks.useCustomAPIMutationHook({
        url: `/health-expense/v1/bill/_verify`,
    });

    const triggerVerifyBill = async (bill) => {
        console.log("triggerVerifyBill", bill);
    try {
        await verifyBillMutation.mutateAsync(
            {
                body: { bill },
            },
            {
                onSuccess: async (verifyResponse) => {
                    console.log("Verify Response", verifyResponse);
                    const taskId = verifyResponse?.taskId;
                    if (!taskId) {
                         setIsLoading(false);
                        setShowToast({ key: "error", label: t("HCM_AM_TASK_ID_NOT_FOUND"), transitionTime: 2000 }); //TODO UPDATE TOAST MSG 
                        return;
                    }

                    let attempts = 0;
                    const POLLING_INTERVAL = 3000;
                    const MAX_ATTEMPTS = 10;

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
                            setTaskStatus?.(status);
                             if (status === "DONE") {
                                setIsLoading(false);
                setShowToast({
                  key: "info",
                  label: t("HCM_AM_BILL_VERIFICATION_COMPLETED"),
                  transitionTime: 5000,
                });
                setInProgressBillsVerify(prev => ({ ...prev, [bill?.id]: false }));
                onTaskDone?.(); //  trigger bill search in parent
              }  else if (status === "IN_PROGRESS") {
                        setIsLoading(true); // start loader                        
                        setShowToast({ key: "info", label: t("HCM_AM_BILL_VERIFICATION_IN_PROGRESS"), transitionTime: 2000 });

                                if (attempts < MAX_ATTEMPTS) {
                                    attempts++;
                                    setTimeout(pollStatus, POLLING_INTERVAL);
                                } else {
                                    setIsLoading(false);
                                    setInProgressBillsVerify(prev => ({ ...prev, [bill?.id]: true }));                                     
                                    setShowToast({ key: "info", label: t("HCM_AM_TASK_POLL_TIMEOUT"), transitionTime: 3000 });
                                }
                            } else {
                                 setIsLoading(false);
                                setShowToast({ key: "error", label: t(`HCM_AM_UNEXPECTED_STATUS_${status}`), transitionTime: 3000 });
                            }
                        } catch (err) {
                             setIsLoading(false);
                            setShowToast({ key: "error", label: t("HCM_AM_TASK_STATUS_ERROR"), transitionTime: 3000 });//TODO UPDATE TOAST MSG
                        }
                    };

                    pollStatus();
                },
                onError: (error) => {
                     setIsLoading(false);
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

    const triggerGeneratePayment = async (bill) => {
        console.log("triggerGeneratePayment", bill);
    try {
        await generatePaymentMutation.mutateAsync(
            {
                body: { bill },
            },
            {
                onSuccess: async (paymentResponse) => {
                    console.log("Payment Response", paymentResponse);
                    const taskId = paymentResponse?.taskId;
                    if (!taskId) {
                         setIsLoading(false);
                        setShowToast({ key: "error", label: t("HCM_AM_TASK_ID_NOT_FOUND"), transitionTime: 2000 });//TODO UPDATE TOAST MSG
                        return;
                    }

                    let attempts = 0;
                    const POLLING_INTERVAL = 2 * 60 * 1000; // 2 minutes 
                    const MAX_ATTEMPTS = 20;

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
                            setTaskStatus?.(status);
                             if (status === "DONE") {
                                setIsLoading(false);
                setShowToast({
                  key: "info",
                  label: t("HCM_AM_PAYMENT_GENERATION_COMPLETED"),
                  transitionTime: 5000,
                });
                setInProgressBillsTransfer(prev => ({ ...prev, [bill?.id]: false }));
                onTaskDone?.(); //  trigger bill search in parent
              }  else if (status === "IN_PROGRESS") {
                setInProgressBillsTransfer(prev => ({ ...prev, [bill?.id]: true }));
                        //  setIsLoading(true); // start loader
                        //TODO UPDATE TOAST MSG
                        setShowToast({ key: "info", label: t("HCM_AM_PAYMENT_GENERATION_IN_PROGRESS"), transitionTime: 3000 });//TODO UPDATE TOAST MSG

                                if (attempts < MAX_ATTEMPTS) {
                                    attempts++;
                                    setTimeout(pollStatus, POLLING_INTERVAL);
                                } else {
                                     setIsLoading(false);
                                    setShowToast({ key: "info", label: t("HCM_AM_TASK_POLL_TIMEOUT"), transitionTime: 3000 });
                                }
                            } else {
                                 setIsLoading(false);
                                // setShowToast({ key: "error", label: t(`HCM_AM_UNEXPECTED_STATUS_${status}`), transitionTime: 3000 });
                            }
                        } catch (err) {
                             setIsLoading(false);
                            setShowToast({ key: "error", label: t("HCM_AM_TASK_STATUS_ERROR"), transitionTime: 3000 });
                        }
                    };

                    pollStatus();
                },
                onError: (error) => {
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
        setShowToast({
            key: "error",
            label: t("HCM_AM_PAYMENT_GENERATION_EXCEPTION"),//TODO UPDATE TOAST MSG
            transitionTime: 3000,
        });
    }
};

const getAvailableActions = (status) => {
  switch (status) {
    case "PARTIALLY_VERIFIED":
      return ["HCM_AM_VERIFY", "HCM_AM_EDIT", "HCM_AM_GENERATE_PAYMENT"];
    case "PENDING_VERIFICATION":
      return ["HCM_AM_VERIFY","HCM_AM_EDIT"];
    case "FULLY_VERIFIED":
      return ["HCM_AM_GENERATE_PAYMENT"];
    case "PARTIALLY_PAID":
        return ["HCM_AM_VERIFY", "HCM_AM_EDIT", "HCM_AM_GENERATE_PAYMENT"];
    case "PAYMENT_FAILED":
            return ["HCM_AM_VERIFY", "HCM_AM_EDIT", "HCM_AM_GENERATE_PAYMENT"];
    case "FULLY_PAID":
    default:
      return [];
  }
};

    const columns = useMemo(() => {
        const commonColumns = [
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_BILL_ID")}
                    </div>
                ),
                selector: (row) => (
                    <div
                        className="ellipsis-cell"
                        style={{
                            textAlign: "center",
                            width: "100%",
                            color: "#C84C0E",
                            cursor: "pointer",
                            textDecoration: "underline",
                            whiteSpace: "nowrap",   // prevent line break
                            overflow: "hidden",     // hide overflow
                            textOverflow: "ellipsis",
                        }}
                        title={row?.billNumber}
                        onClick={() => {
                            if (props?.editBill) {
                                history.push(`/${window.contextPath}/employee/payments/edit-bill-payment-details`, {
                                    billID: row.billNumber,
                                });
                            } else {
                                history.push(`/${window.contextPath}/employee/payments/view-bill-payment-details`, {
                                    billID: row.billNumber,
                                });
                            }
                        }}
                    >
                        {row?.billNumber || t("NA")}
                    </div>
                ),
                width: "240px",
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_NUMBER_OF_WORKERS")}
                    </div>
                ),
                selector: (row) => (
                    <div className="ellipsis-cell" style={{ textAlign: "center", width: "100%" }}>
                        {t(row?.billDetails?.length) || t("NA")}
                    </div>
                ),
                width: "140px",
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {props?.editBill ? t("HCM_AM_PENDING_FOR_EDIT") : t("HCM_AM_PENDING_VERIFICATION")}
                    </div>
                ),
                selector: (row) => {
                    const count = props?.editBill
                        ? row?.billDetails?.filter((detail) => detail?.status === "PENDING_EDIT")?.length || 0
                        : row?.billDetails?.filter(
                            (detail) =>
                                detail?.status === "PENDING_VERIFICATION" ||
                                detail?.status === "VERIFICATION_FAILED" ||
                                detail?.status === "PENDING_EDIT" ||
                                detail?.status === "EDITED"
                        )?.length || 0;

                    return (
                        <div className="ellipsis-cell" style={{ color: "#B91900", textAlign: "center", width: "100%" }}>
                            {t(count)}
                        </div>
                    );
                },
                width: "160px",
            },
        ];

        const nonEditColumns = [
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_VERIFIED")}
                    </div>
                ),
                selector: (row) => {
                    const verifiedCount =
                        row?.billDetails?.filter(
                            (detail) => detail?.status === "VERIFIED" || detail?.status === "PAYMENT_FAILED"
                        )?.length || 0;

                    return (
                        <div className="ellipsis-cell" style={{ color: "#9E5F00", textAlign: "center", width: "100%" }}>
                            {verifiedCount}
                        </div>
                    );
                },
                width: "120px",
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_PAID")}
                    </div>
                ),
                selector: (row) => {
                    const paidCount = row?.billDetails?.filter((detail) => detail?.status === "PAID")?.length || 0;
                    return (
                        <div className="ellipsis-cell" style={{ color: "#00703C", textAlign: "center", width: "100%" }}>
                            {t(paidCount)}
                        </div>
                    );
                },
                width: "120px",
            },
        ];

        // Extra column for edit mode
        const editColumns = [
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_EDITED")}
                    </div>
                ),
                selector: (row) => {
                    const editedCount = row?.billDetails?.filter((detail) => detail?.status === "EDITED")?.length || 0;
                    return (
                        <div className="ellipsis-cell" style={{ color: "#00703C", textAlign: "center", width: "100%" }}>
                            {t(editedCount)}
                        </div>
                    );
                },
                width: "120px",
            },
        ];

        const statusColumn = {
            name: (
                <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                    {t("HCM_AM_STATUS")}
                </div>
            ),
            selector: (row) => {
                const status = row?.status || "NA";
                let backgroundColor = "#B91900";

                if (status === "FULLY_VERIFIED") backgroundColor = "#00703C";
                else if (status === "FULLY_PAID") backgroundColor = "#00703C";
                else if (status === "PARTIALLY_VERIFIED") backgroundColor = "#9E5F00";
                else if (status === "PARTIALLY_PAID") backgroundColor = "#9E5F00";

                return (
                    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <span
                            className="ellipsis-cell"
                            style={{
                                backgroundColor,
                                color: "#fff",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "4px",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                                textAlign: "center",
                            }}
                        >
                            {t(status)}
                        </span>
                    </div>
                );
            },
            width: "250px",
        };

        const actionsColumn = {
            name: (
                <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                    {t("HCM_AM_BILL_ACTIONS")}
                </div>
            ),
            selector: (row, index) => {
                const reportDetails = row?.additionalDetails?.reportDetails;
                const billId = row?.billNumber;
                const id = row?.id;
                const isLastRow = index === props.totalCount - 1;
                const status = row?.status || "UNKNOWN";
                const actions = getAvailableActions(status);
                const isInProgress =
                    inProgressBillsTransfer?.[id] === true || inProgressBillsVerify?.[id] === true;
                const options = actions.map((code) => ({
                    code,
                    name: t(code),
                }));

                return (
                    <div style={{ textAlign: "center", width: "100%" }}>
                        {!props?.editBill ? (
                            !isInProgress ? (
                                <Button
                                    className="custom-class"
                                    iconFill=""
                                    icon="ArrowDropDown"
                                    size="medium"
                                    isSuffix
                                    label={t(`HCM_AM_BILL_ACTIONS`)}
                                    title={t(`HCM_AM_BILL_ACTIONS`)}
                                    showBottom={isLastRow ? false : true}
                                    onOptionSelect={(value) => {
                                        if (value.code === "HCM_AM_VERIFY") {
                                            setVerifyPopupState({ open: true, row });
                                        } else if (value.code === "HCM_AM_EDIT") {
                                            setEditPopupState({ open: true, row });
                                        } else if (value.code === "HCM_AM_GENERATE_PAYMENT") {
                                            setPaymentPopupState({ open: true, row });
                                        } else if (value.code === "HCM_AM_DOWNLOAD_REPORT") {
                                            if (reportDetails?.excelReportId) {
                                                try {
                                                    downloadFileWithName({
                                                        fileStoreId: reportDetails?.excelReportId,
                                                        customName: `${billId}`,
                                                        type: "excel",
                                                    });
                                                } catch {
                                                    setShowToast({
                                                        key: "error",
                                                        label: t(`HCM_AM_EXCEL_GENERATION_FAILED`),
                                                        transitionTime: 3000,
                                                    });
                                                }
                                            } else {
                                                setShowToast({
                                                    key: "error",
                                                    label: t(`HCM_AM_EXCEL_GENERATION_FAILED`),
                                                    transitionTime: 3000,
                                                });
                                            }
                                        }
                                    }}
                                    options={options}
                                    optionsKey="name"
                                    style={{ minWidth: "10rem" }}
                                    type="actionButton"
                                    variation="secondary"
                                />
                            ) : (
                                <Tag
                                    icon="Info"
                                    label={
                                        inProgressBillsTransfer?.[id]
                                            ? t("HCM_AM_PAYMENT_IN_PROGRESS")
                                            : t("HCM_AM_VERIFICATION_IN_PROGRESS")
                                    }
                                    showIcon={true}
                                />
                            )
                        ) : (
                            <Button
                                className="custom-class"
                                iconFill=""
                                variation="secondary"
                                icon="Edit"
                                size="small"
                                isSuffix
                                onClick={() => {
                                    history.push(`/${window.contextPath}/employee/payments/edit-bill-payment-details`, {
                                        billID: row.billNumber,
                                    });
                                }}
                                label={t(`HCM_AM_EDIT_BILL`)}
                                title={t(`HCM_AM_EDIT_BILL`)}
                            />
                        )}
                    </div>
                );
            },
            width: "220px",
        };

        // Return final set
        if (props?.editBill) {
            return [...commonColumns, ...editColumns, statusColumn, actionsColumn];
        } else {
            return [...commonColumns, ...nonEditColumns, statusColumn, actionsColumn];
        }
    }, [props.data, t, inProgressBillsTransfer, inProgressBillsVerify, props?.editBill]);

    const handlePageChange = (page, totalRows) => {
        props?.handlePageChange(page, totalRows);
    };

    const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
        props?.handlePerRowsChange(currentRowsPerPage, currentPage);
    };

    return (
        <>
            <DataTable
            className="search-component-table"
                columns={columns}
                data={props?.data}
                pagination
                paginationServer
                customStyles={tableCustomStyle(false)}
                paginationDefaultPage={props?.currentPage}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                paginationTotalRows={props?.totalCount}
                paginationPerPage={props?.rowsPerPage}
                sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                paginationRowsPerPageOptions={defaultPaginationValues}
                fixedHeader={true}
                selectableRows={props?.selectableRows}
                fixedHeaderScrollHeight={"70vh"}
                paginationComponentOptions={getCustomPaginationOptions(t)}
            />
            {verifyPopupState.open && <AlertPopUp
        onClose={() => {
          setVerifyPopupState({ open: false, row: null });
        }}
        alertHeading={t(`HCM_AM_ALERT_VERIFY_HEADING`)}
        alertMessage={t(`HCM_AM_ALERT_VERIFY_DESCRIPTION`)}
        submitLabel={t(`HCM_AM_APPROVE`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          triggerVerifyBill(verifyPopupState.row);
          setVerifyPopupState({ open: false, row: null });
        }}
      />}
      {paymentPopupState.open && <AlertPopUp
        onClose={() => {
          setPaymentPopupState({ open: false, row: null });
        }}
        alertHeading={t(`HCM_AM_ALERT_PAYMENT_HEADING`)}
        alertMessage={t(`HCM_AM_ALERT_PAYMENT_DESCRIPTION`)}
        submitLabel={t(`HCM_AM_APPROVE`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          triggerGeneratePayment(paymentPopupState.row);
          setPaymentPopupState({ open: false, row: null });
        }}
      />}            
      {editPopupState.open && <AlertPopUp
        onClose={() => {
          setEditPopupState({ open: false, row: null });
        }}
        alertHeading={t(`HCM_AM_SEND_FOR_EDIT`)}
        alertMessage={t(`HCM_AM_ALERT_SEND_FOR_EDIT_DESCRIPTION`)}
        submitLabel={t(`HCM_AM_APPROVE`)}
        cancelLabel={t(`HCM_AM_CANCEL`)}
        onPrimaryAction={() => {
          sendBillDetailsForEdit(editPopupState.row);
          setEditPopupState({ open: false, row: null });
        }}        
      />}
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
        </>
    );
};

export default VerifyAndGeneratePaymentsTable;
