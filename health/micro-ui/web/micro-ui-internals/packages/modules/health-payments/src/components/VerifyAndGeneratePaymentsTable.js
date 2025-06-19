import React, { Fragment, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, CustomSVG, Tag, Toast } from "@egovernments/digit-ui-components";
import { downloadFileWithName, formatTimestampToDate, getCustomPaginationOptions } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";
import { useHistory } from "react-router-dom";

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
    ...props }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast, setShowToast] = useState(null);
    const project = Digit?.SessionStorage.get("staffProjects");
    const selectedProject = Digit?.SessionStorage.get("selectedProject");

    const bills = [
        {
            "billNumber": "123456",
            "billDate": 1698307200000,
            "additionalDetails": {
                "noOfRegisters": 5,
                "reportDetails": {
                    "status": "COMPLETED", 
                }
            },
            "localityCode": "Locality 1",
        },
        {
            "billNumber": "123456",
            "billDate": 1698307200000,
            "additionalDetails": {
                "noOfRegisters": 5,
            },
            "localityCode": "Locality 1",
        },
        {
            "billNumber": "123456",
            "billDate": 1698307200000,
            "additionalDetails": {
                "noOfRegisters": 5,
            },
            "localityCode": "Locality 1",
        },
        {
            "billNumber": "123456",
            "billDate": 1698307200000,
            "additionalDetails": {
                "noOfRegisters": 5,
            },
            "localityCode": "Locality 1",
        }
    ]
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
                    const taskId = verifyResponse?.taskId;
                    if (!taskId) {
                         setIsLoading(false);
                        setShowToast({ key: "error", label: t("HCM_AM_TASK_ID_NOT_FOUND"), transitionTime: 2000 });
                        return;
                    }

                    let attempts = 0;
                    const POLLING_INTERVAL = 3000;
                    const MAX_ATTEMPTS = 20;

                    const pollStatus = async () => {
                        try {
                            const statusResponse = await getTaskStatusMutation.mutateAsync({
                                body: { taskId: taskId },
                            });

                            const status = statusResponse?.status;
                            setTaskStatus?.(status);
                             if (status === "DONE") {
                                setIsLoading(false);
                setShowToast({
                  key: "success",
                  label: t("HCM_AM_BILL_VERIFICATION_DONE"),
                  transitionTime: 5000,
                });

                onTaskDone?.(); //  trigger bill search in parent
              }  else if (status === "IN_PROGRESS") {
                         setIsLoading(true); // start loader

                        setShowToast({ key: "info", label: t("HCM_AM_BILL_VERIFICATION_IN_PROGRESS"), transitionTime: 2000 });

                                if (attempts < MAX_ATTEMPTS) {
                                    attempts++;
                                    setTimeout(pollStatus, POLLING_INTERVAL);
                                } else {
                                     setIsLoading(false);
                                    setShowToast({ key: "error", label: t("HCM_AM_TASK_POLL_TIMEOUT"), transitionTime: 3000 });
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
                     setIsLoading(false);
                    setShowToast({
                        key: "error",
                        label: t(error?.response?.data?.Errors?.[0]?.message || "HCM_AM_BILL_VERIFY_ERROR"),
                        transitionTime: 3000,
                    });
                },
            }
        );
    } catch (error) {
         setIsLoading(false);
        setShowToast({
            key: "error",
            label: t("HCM_AM_BILL_VERIFY_EXCEPTION"),
            transitionTime: 3000,
        });
    }
};
const getAvailableActions = (status) => {
  switch (status) {
    case "PARTIALLY_VERIFIED":
      return ["HCM_AM_VERIFY", "HCM_AM_EDIT", "HCM_AM_GENERATE_PAYMENT","HCM_AM_DOWNLOAD_REPORT"];
case "PENDING_VERIFICATION":
      return ["HCM_AM_VERIFY", "HCM_AM_EDIT","HCM_AM_DOWNLOAD_REPORT"];
    case "FULLY_VERIFIED":
      return ["HCM_AM_GENERATE_PAYMENT","HCM_AM_DOWNLOAD_REPORT"];
    case "PARTIALLY_PAID":
        return ["HCM_AM_GENERATE_PAYMENT","HCM_AM_DOWNLOAD_REPORT"];
    case "FULLY_PAID":
    case "SENT_BACK":
    default:
      return ["HCM_AM_DOWNLOAD_REPORT"]; // No actions allowed except download
  }
};
    const columns = useMemo(() => {
        const baseColumns = [
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_BILL_ID")}
                    </div>
                ),
                selector: (row) => {
                    return (
                        <div className="ellipsis-cell" title={t(row?.billNumber) || t("NA")}
                        onClick={() => {
                            //view bill/edit bill
                           if (props?.editBill) {
                                history.push(`/${window.contextPath}/employee/payments/edit-bill-payment-details`,{ billID: row.billNumber });
                            } else {
                                history.push(`/${window.contextPath}/employee/payments/view-bill-payment-details`,{ billID: row.billNumber });
                            }
                        }}
                        style={{ color: "#C84C0E", cursor: "pointer", textDecoration: "underline" }}>
                            {t(row?.billNumber) || t("NA")}
                        </div>
                    );
                },
            },
            // {
            //     name: (
            //         <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
            //             {t("HCM_AM_BILL_DATE")}
            //         </div>
            //     ),
            //     selector: (row) => {
            //         return (
            //             <div className="ellipsis-cell" >
            //                 {formatTimestampToDate(row.billDate) || t("NA")}
            //             </div>
            //         );
            //     },
            // },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_NUMBER_OF_WORKERS")}
                    </div>
                ),
                selector: (row) => {
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {t(row?.billDetails?.length) || t("0")}
                        </div>
                    );
                },
                style: {
                    justifyContent: "flex-end",
                },
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_PENDING_COUNT")}
                    </div>
                ),
                selector: (row) => {
                    const pendingCount = row?.billDetails?.filter((detail) => detail?.status === "PENDING_VERIFICATION" || detail?.status ==="VERIFICATION_FAILED")?.length || 0;
                    return (
                        <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>
                             {t(pendingCount)}
                        </div>
                    );
                },
                style: {
                            justifyContent: "flex-end",
                        },
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_VERIFIED_COUNT")}
                    </div>
                ),
                 selector: (row) => {
                    const verifiedCount = row?.billDetails?.filter((detail) => detail?.status === "VERIFIED" || detail?.status ==="PAYMENT_FAILED")?.length || 0;
     
                    return (
                        <div className="ellipsis-cell" style={{ color: "#9E5F00", paddingRight: "1rem" }}>
                             {(verifiedCount)}
                        </div>
                    );
                },
                style: {
                            justifyContent: "flex-end",
                        },
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_PAID_COUNT")}
                    </div>
                ),
               selector: (row) => {
                    const paidCount = row?.billDetails?.filter((detail) => detail?.status === "PAID")?.length || 0;
                    return (
                        <div className="ellipsis-cell" style={{ color: "#00703C", paddingRight: "1rem" }}>
                             {t(paidCount)}
                        </div>
                    );
                },
                style: {
                            justifyContent: "flex-end",
                        },
            },
            {
                name: (
                    <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
                        {t("HCM_AM_STATUS")}
                    </div>
                ),
                selector: (row) => {
    const status = row?.status || "NA";
    let backgroundColor = "#B91900"; // Default: red

    if (status === "FULLY_VERIFIED") backgroundColor = "#00703C"; // Green
    else if (status === "PARTIALLY_VERIFIED") backgroundColor = "#9E5F00"; // Yellow

    return (
      <span
        className="ellipsis-cell"
        style={{
          backgroundColor,
          color: "#fff",
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          fontWeight: "bold",
          display: "inline-block",
          minWidth: "100px",
          textAlign: "center",
        }}
      >
        {t(status)}
      </span>
    );
  }
            },
            {
                name: t("HCM_AM_BILL_ACTIONS"),
                selector: (row, index) => {
                    const reportDetails = row?.additionalDetails?.reportDetails;
                    const billId = row?.billNumber;
                    const isLastRow = index === props.totalCount - 1;
                    const status = row?.status || "UNKNOWN";
                    const actions = getAvailableActions(status);

                    const options = actions.map((code) => ({
                        code,
                        name: t(code),
                    }));

                    return (!props?.editBill?(
                        // reportDetails?.status === "COMPLETED" ? 
                        <Button
                            className="custom-class"
                            iconFill=""
                            icon="ArrowDropDown"
                            size="medium"
                            isSuffix
                            label={t(`HCM_AM_TAKE_ACTION`)}
                            title={t(`HCM_AM_TAKE_ACTION`)}
                            showBottom={isLastRow && props.data.length !== 1? false : true}
                            // showBottom={!(props?.data?.length === 1 || isLastRow)}
                            onOptionSelect={(value) => {
                                // if (value.code === "HCM_AM_PDF") {
                                //     if (reportDetails?.pdfReportId) {
                                //         downloadFileWithName({ fileStoreId: reportDetails?.pdfReportId, customName: `${billId}`, type: "pdf" })
                                //     } else {
                                //         setShowToast({ key: "error", label: t(`HCM_AM_PDF_GENERATION_FAILED`), transitionTime: 3000 });
                                //     }
                                // } else if (value.code === "HCM_AM_EXCEL") {
                                //     if (reportDetails?.excelReportId) {
                                //         downloadFileWithName({ fileStoreId: reportDetails?.excelReportId, customName: `${billId}`, type: "excel" });
                                //     } else {
                                //         setShowToast({ key: "error", label: t(`HCM_AM_EXCEL_GENERATION_FAILED`), transitionTime: 3000 });
                                //     }

                                // }
                                if (value.code === "HCM_AM_VERIFY") {
                                    triggerVerifyBill(row);                                   
                                } else if (value.code === "HCM_AM_EDIT") {                                    
                                setShowToast({ key: "error", label: t(`HCM_AM_EDIT_FAILED`), transitionTime: 3000 });
                                }
                                else if (value.code === "HCM_AM_GENERATE_PAYMENT") {                                   
                                    setShowToast({ key: "error", label: t(`HCM_AM_PAYMENT_GENERATION_FAILED`), transitionTime: 3000 });
                                }
                                else if (value.code === "HCM_AM_DOWNLOAD_REPORT") {
                                    if (reportDetails?.excelReportId) {
                                        downloadFileWithName({ fileStoreId: reportDetails?.excelReportId, customName: `${billId}`, type: "excel" });
                                    } else {
                                        setShowToast({ key: "error", label: t(`HCM_AM_EXCEL_GENERATION_FAILED`), transitionTime: 3000 });
                                    }
                            }}}
                            options={options}
                            optionsKey="name"
                        
                            style={{ minWidth: "14rem" }}
                            type="actionButton"
                            variation="secondary"
                        /> 
                        // :
                            // <div>
                            //     <Tag
                            //         {...(reportDetails?.status !== "FAILED" && { icon: "Info" })}
                            //         label={reportDetails?.status === "FAILED" ? t("HCM_AM_FAILED_REPORT_GENERATION") : t("HCM_AM_PROGRESS_REPORT_GENERATION")}
                            //         labelStyle={{}}
                            //         showIcon={true}
                            //         style={{}}
                            //         {...(reportDetails?.status === "FAILED" && { type: "error" })}
                            //     />
                            // </div>
                            )
                            :(
                                <Button
                            className="custom-class"
                            iconFill=""
                            variation="secondary"
                            icon="Edit"
                            size="small"
                            isSuffix
                            onClick={() => {//edit bill                           
                                history.push(`/${window.contextPath}/employee/payments/edit-bill-payment-details`,{ billID: row.billNumber });
                            }}
                            label={t(`HCM_AM_EDIT_BILL`)}
                            title={t(`HCM_AM_EDIT_BILL`)}/>
                            )
                    );
                },
                width: "300px",
            },
        ];

        return baseColumns;
    }, [props.data, t]);

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
