import React, { useState, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, CustomSVG, Tag, Toast } from "@egovernments/digit-ui-components";
import { downloadFileWithName, getCustomPaginationOptions, formatTimestampToDate } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";
import SendForApprovalPopUp from "./SendForApprovalPopUp"; 
/**
 * Column builder registry.
 * Each key maps to a function: (t, history, props, setShowToast) => react-data-table column definition.
 */


const ManageBillsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast, setShowToast] = useState(null);
    const [showApprovalPopup, setShowApprovalPopup] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const handleSelectedRowsChange = ({ selectedRows }) => {
        props?.onSelectionChange?.(selectedRows);
    };

    const buildColumnRegistry = (t, history, props, setShowToast, activeTabCode) => {
        const colHeader = (label) => (
            <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{label}</div>
        );
    
        return {
            billId: {
                name: colHeader(t("HCM_AM_BILL_ID")),
                selector: (row) => (
                    <div
                        className="ellipsis-cell"
                        style={{ whiteSpace: "normal", wordBreak: "break-word", textAlign: "start", lineHeight: "1.4", color: "#F47738", cursor: "pointer", textDecoration: "underline" }}
                        title={row?.billNumber || t("NA")}
                        onClick={() => {
                            history.push(`/${window.contextPath}/employee/payments/view-bill-payment-details`, {
                                billID: row.billNumber,
                                activeTabCode: activeTabCode,
                                advisoryReport: row?.advisoryReport || null,
                            });
                        }}
                    >
                        {row?.billNumber || t("NA")}
                    </div>
                ),
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
            },
    
            source: {
                name: colHeader(t("HCM_AM_SOURCE")),
                selector: () => (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {t("HCM_AM_ATTENDANCE")}
                    </div>
                ),
                style: { justifyContent: "flex-start", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            registers: {
                name: colHeader(t("HCM_AM_NO_OF_REGISTERS")),
                selector: (row) => (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {row?.additionalDetails?.noOfRegisters || "0"}
                    </div>
                ),
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            payees: {
                name: colHeader(t("HCM_AM_NUMBER_OF_PAYEES")),
                selector: (row) => (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {row?.billDetails?.length || "0"}
                    </div>
                ),
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            totalAmount: {
                name: colHeader(t("HCM_AM_TOTAL_AMOUNT")),
                selector: (row) => {
                    const total = row?.billDetails?.reduce((sum, d) => sum + (d?.totalAmount || 0), 0) || 0;
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {total}
                        </div>
                    );
                },
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            download: {
                name: t("HCM_AM_DOWNLOAD_BILL"),
                selector: (row, index) => {
                    const reportDetails = row?.additionalDetails?.reportDetails;
                    const billId = row?.billNumber;
                    const isLastRow = index === props.totalCount - 1;
    
                    return reportDetails?.status === "COMPLETED" ? (
                        <Button
                            className="custom-class"
                            iconFill=""
                            size="medium"
                            icon="FileDownload"
                            isSuffix
                            label={t("HCM_AM_DOWNLOAD_BILLS")}
                            title={t("HCM_AM_DOWNLOAD_BILLS")}
                            showBottom={isLastRow && props.data.length !== 1 ? false : true}
                            onOptionSelect={(value) => {
                                if (value.code === "HCM_AM_PDF") {
                                    if (reportDetails?.pdfReportId) {
                                        downloadFileWithName({ fileStoreId: reportDetails.pdfReportId, customName: `${billId}`, type: "pdf" });
                                    } else {
                                        setShowToast({ key: "error", label: t("HCM_AM_PDF_GENERATION_FAILED"), transitionTime: 3000 });
                                    }
                                } else if (value.code === "HCM_AM_EXCEL") {
                                    if (reportDetails?.excelReportId) {
                                        downloadFileWithName({ fileStoreId: reportDetails.excelReportId, customName: `${billId}`, type: "excel" });
                                    } else {
                                        setShowToast({ key: "error", label: t("HCM_AM_EXCEL_GENERATION_FAILED"), transitionTime: 3000 });
                                    }
                                }
                            }}
                            options={[
                                { code: "HCM_AM_EXCEL", name: t("HCM_AM_EXCEL") },
                                { code: "HCM_AM_PDF", name: t("HCM_AM_PDF") },
                            ]}
                            optionsKey="name"
                            style={{ minWidth: "13rem" }}
                            type="actionButton"
                            variation="secondary"
                        />
                    ) : (
                        <div>
                            <Tag
                                {...(reportDetails?.status !== "FAILED" && { icon: "Info" })}
                                label={reportDetails?.status === "FAILED" ? t("HCM_AM_FAILED_REPORT_GENERATION") : t("HCM_AM_PROGRESS_REPORT_GENERATION")}
                                showIcon={true}
                                {...(reportDetails?.status === "FAILED" && { type: "error" })}
                            />
                        </div>
                    );
                },
                width: "200px",
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
            },
    
            sendForApproval: {
                name: t("HCM_AM_SEND_FOR_APPROVAL"),
                selector: (row) => (
                    <Button
                        variation="secondary"
                        size="medium"
                        label={t("HCM_AM_SEND_FOR_APPROVAL")}
                        onClick={() => {
                            setSelectedBill(row); // Set the selected bill details
                            setShowApprovalPopup(true); // Show the popup
                        }}
                    />
                ),
                width: "200px",
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
            },
    
            downloadAdvisory: {
                name: t("HCM_AM_DOWNLOAD_ADVISORY"),
                selector: (row, index) => {
                    const advisoryReport = row?.advisoryReport;
                    const billId = row?.billNumber;
                    const isLastRow = index === props.totalCount - 1;
    
                    return advisoryReport?.status === "GENERATED" && advisoryReport?.fileStoreId ? (
                        <Button
                            className="custom-class"
                            iconFill=""
                            size="medium"
                            icon="FileDownload"
                            isSuffix
                            label={t("HCM_AM_DOWNLOAD_ADVISORY")}
                            title={t("HCM_AM_DOWNLOAD_ADVISORY")}
                            onClick={() => {
                                downloadFileWithName({ fileStoreId: advisoryReport.fileStoreId, customName: `Payment_Advisory_${billId}`, type: "excel" });
                            }}
                            // showBottom={isLas    tRow && props.data.length !== 1 ? false : true}                            
                            style={{ minWidth: "13rem" }}
                            // type="actionButton"
                            variation="secondary"
                        />
                    ) : (
                        <div>
                            <Tag
                                {...(advisoryReport?.status !== "FAILED" && { icon: "Info" })}
                                label={advisoryReport?.status === "FAILED" ? t("HCM_AM_FAILED_REPORT_GENERATION") : t("HCM_AM_PROGRESS_REPORT_GENERATION")}
                                showIcon={true}
                                {...(advisoryReport?.status === "FAILED" && { type: "error" })}
                            />
                        </div>
                    );
                },
                width: "300px",
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
            },
    
            // ── Status count columns (verification) ──────────────────────────
            pending: {
                name: colHeader(t("HCM_AM_PENDING")),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => d?.status === "PENDING_VERIFICATION")?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                },
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            verificationFailed: {
                name: colHeader(t("HCM_AM_VERIFICATION_FAILED")),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => d?.status === "VERIFICATION_FAILED")?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                },
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            verified: {
                name: colHeader(t("HCM_AM_VERIFIED")),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => ["VERIFIED", "PAYMENT_FAILED"].includes(d?.status))?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#00703C", paddingRight: "1rem" }}>{count}</div>;
                },
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            failures: {
                name: colHeader(t("HCM_AM_NUMBER_OF_FAILURES")),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => d?.status === "VERIFICATION_FAILED")?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                },
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            editBill: {
                name: t("HCM_AM_EDIT_BILL"),
                selector: (row) => (
                    <Button
                        variation="secondary"
                        size="medium"
                        label={t("HCM_AM_EDIT_BILL")}
                        onClick={() => {
                            history.push(`/${window.contextPath}/employee/payments/view-bill-payment-details`, {
                                billID: row.billNumber,
                                activeTabCode: activeTabCode,
                            });
                        }}
                    />
                ),
                width: "160px",
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
            },
    
            // ── Payment approver columns ──────────────────────────────────────
            billDate: {
                name: colHeader(t("HCM_AM_BILL_DATE")),
                selector: (row) => (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {row?.billDate ? formatTimestampToDate(row.billDate) : t("NA")}
                    </div>
                ),
                style: { justifyContent: "flex-start", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            amountPaid: {
                name: colHeader(t("HCM_AM_AMOUNT_PAID")),
                selector: (row) => {
                    const paid = row?.billDetails?.filter((d) => d?.status === "PAID")?.reduce((sum, d) => sum + (d?.totalAmount || 0), 0) || 0;
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {paid}
                        </div>
                    );
                },
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            pendingPayment: {
                name: colHeader(t("HCM_AM_PENDING")),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => !["PAID", "PAYMENT_FAILED"].includes(d?.status))?.length || 0;
                    return <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>{count}</div>;
                },
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            failedPayment: {
                name: colHeader(t("HCM_AM_FAILED")),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => d?.status === "PAYMENT_FAILED")?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                },
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            paidCount: {
                name: colHeader(t("HCM_AM_PAID")),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => d?.status === "PAID")?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#00703C", paddingRight: "1rem" }}>{count}</div>;
                },
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
        };
    };

    const columns = useMemo(() => {
        const registry = buildColumnRegistry(t, history, props, setShowToast, props.activeTabCode);

        // Config-driven: use columnKeys if provided
        if (props.columnKeys && Array.isArray(props.columnKeys)) {
            return props.columnKeys
                .map((key) => registry[key])
                .filter(Boolean);
        }

        // Fallback: legacy activeTab-based logic (backward compat)
        const activeTab = props?.activeTab || "NOT_VERIFIED";

        if (activeTab === "NOT_VERIFIED") {
            return [registry.billId, registry.registers, registry.payees, registry.totalAmount, registry.download];
        }
        if (activeTab === "VERIFICATION_IN_PROGRESS") {
            return [registry.billId, registry.payees, registry.pending, registry.verificationFailed, registry.verified, registry.download];
        }
        if (activeTab === "PARTIALLY_VERIFIED") {
            return [registry.billId, registry.payees, registry.failures, registry.download, registry.editBill];
        }
        if (activeTab === "FULLY_VERIFIED") {
            return [registry.billId, registry.totalAmount, registry.payees, registry.download];
        }
        if (activeTab === "SENT_FOR_REVIEW") {
            return [registry.billId, registry.registers, registry.payees, registry.totalAmount, registry.download];
        }

        return [registry.billId, registry.payees, registry.download];
    }, [props.data, props.totalCount, props.columnKeys, props.activeTab, t]);

    // Determine if rows are selectable
    const isSelectable = props.isSelectable !== undefined
        ? props.isSelectable
        : ["NOT_VERIFIED", "PARTIALLY_VERIFIED", "FULLY_VERIFIED"].includes(props?.activeTab || "NOT_VERIFIED");

    
        const expenseContextPath = window?.globalConfigs?.getConfig("EXPENSE_CONTEXT_PATH") || "health-expense";
        const sendForApprovalMutation = Digit.Hooks.useCustomAPIMutationHook({
            url: `/${expenseContextPath}/bill/v1/_update`,
          });  
        
          const triggerSendForApproval = async (bill, data) => {
            try {
              const updatedBill = {
                ...bill,
          
                // merge into additionalDetails
                additionalDetails: {
                  ...(bill?.additionalDetails || {}),
                  justificationDetails: {
                    comment: data?.comment || null,
                    justificationDoc: data?.supportingDocs || [],
                  },
                },
              };
          
              await sendForApprovalMutation.mutateAsync(
                {
                  body: {
                    bill: updatedBill,
                    workflow: {
                      action: "SEND_FOR_APPROVAL",
                      comments: "Sent for approval",
                      assignes: [],
                    },
                  },
                },
                {
                  onSuccess: () => {
                    setShowToast({
                      key: "success",
                      label: t("HCM_AM_SEND_FOR_APPROVAL_SUCCESS"),
                      transitionTime: 3000,
                    });//TODO show success screen
          
                    setShowApprovalPopup(false);
                  },
                  onError: (err) => {
                    console.error("Send for approval failed:", err);
          
                    setShowToast({
                      key: "error",
                      label: t("HCM_AM_SOMETHING_WENT_WRONG"),
                      transitionTime: 3000,
                    });
                  },
                }
              );
            } catch (e) {
              console.error("Mutation error:", e);
            }
          };
    return (
        <>
            <DataTable
                className="search-component-table"
                columns={columns}
                data={props.data}
                pagination
                paginationServer
                customStyles={tableCustomStyle(false)}
                paginationDefaultPage={props?.currentPage}
                onChangePage={(page, totalRows) => props?.handlePageChange(page, totalRows)}
                onChangeRowsPerPage={(currentRowsPerPage, currentPage) => props?.handlePerRowsChange(currentRowsPerPage, currentPage)}
                clearSelectedRows={props?.clearSelectedRows}
                paginationTotalRows={props?.totalCount}
                paginationPerPage={props?.rowsPerPage}
                sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                paginationRowsPerPageOptions={defaultPaginationValues}
                fixedHeader={true}
                fixedHeaderScrollHeight={"70vh"}
                selectableRows={isSelectable}
                onSelectedRowsChange={handleSelectedRowsChange}
                paginationComponentOptions={getCustomPaginationOptions(t)}
            />
            {showToast && (
                <Toast
                    style={{ zIndex: 10001 }}
                    label={showToast.label}
                    type={showToast.key}
                    transitionTime={showToast.transitionTime}
                    onClose={() => setShowToast(null)}
                />
            )}

{showApprovalPopup && (
    <SendForApprovalPopUp
        billDetails={selectedBill} // Pass the selected bill details
        onClose={() => setShowApprovalPopup(false)} // Close the popup
        onSubmit={async (data) => {
            await triggerSendForApproval(selectedBill, data);
            console.log("Submitted data:", data);
            setShowApprovalPopup(false);
        }}
    />
)}
        </>
    );
};

export default ManageBillsTable;
