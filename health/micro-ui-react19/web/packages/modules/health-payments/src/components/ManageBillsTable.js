import React, { useState, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, CustomSVG, Tag, Toast } from "@egovernments/digit-ui-components";
import { downloadFileWithName, getCustomPaginationOptions, formatTimestampToDate } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";
import SendForApprovalPopUp from "./SendForApprovalPopUp"; 
import { I18N_KEYS } from "../utils/i18nKeyConstants";
/**
 * Column builder registry.
 * Each key maps to a function: (t, navigate, props, setShowToast) => react-data-table column definition.
 */


const ManageBillsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const role = props?.role;
    const currencySuffix = props?.workerRatesData?.currency ? ` (${props.workerRatesData.currency})` : "";
    const [showToast, setShowToast] = useState(null);
    const [showApprovalPopup, setShowApprovalPopup] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const handleSelectedRowsChange = ({ selectedRows }) => {
        props?.onSelectionChange?.(selectedRows);
    };

    const navigateToBillDetails = (row) => {
        navigate(`/${window.contextPath}/employee/payments/view-bill-payment-details/${role}`, {
            state: {
                billID: row.billNumber,
                activeTabCode: props.activeTabCode,
                advisoryReport: row?.advisoryReport || null,
            },
        });
    };

    const handleRowClicked = (row, e) => {
        const target = e?.target;
        if (target?.closest) {
            const interactive = target.closest(
                'button, a, input, textarea, select, label, [role="button"], [role="menuitem"], [role="menuitemcheckbox"], .digit-button-primary, .digit-button-secondary, .digit-button-teritiary'
            );
            if (interactive) return;
        }
        navigateToBillDetails(row);
    };

    const buildColumnRegistry = (t, navigate, props, setShowToast, activeTabCode) => {
        const colHeader = (label, textAlign = "start") => (
            <div
                style={{
                    borderRight: "2px solid #787878",
                    width: "100%",
                    textAlign,
                    ...(textAlign === "right" ? { paddingRight: "1rem", boxSizing: "border-box" } : {}),
                }}
            >
                {label}
            </div>
        );
    
        return {
            billId: {
                name: colHeader(t(I18N_KEYS.COMMON.HCM_AM_BILL_ID)),
                selector: (row) => (
                    <div
                        className="ellipsis-cell"
                        style={{ whiteSpace: "normal", wordBreak: "break-word", textAlign: "start", lineHeight: "1.4", color: "#C84C0E", cursor: "pointer", textDecoration: "underline" }}
                        title={row?.billNumber || t(I18N_KEYS.COMMON.NA)}
                        onClick={(ev) => {
                            ev.stopPropagation();
                            navigateToBillDetails(row);
                        }}
                    >
                        {row?.billNumber || t(I18N_KEYS.COMMON.NA)}
                    </div>
                ),
                grow: 1,
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
            },
    
            source: {
                name: colHeader(t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_SOURCE)),
                selector: () => (
                    <div className="ellipsis-cell" title={t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_ATTENDANCE)} style={{ paddingRight: "1rem" }}>
                        {t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_ATTENDANCE)}
                    </div>
                ),
                grow: 1,
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
            },
    
            registers: {
                name: colHeader(t(I18N_KEYS.COMMON.HCM_AM_NO_OF_REGISTERS), "right"),
                selector: (row) => (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {row?.additionalDetails?.noOfRegisters || "0"}
                    </div>
                ),
                grow: 1,
                minWidth: "100px",
                maxWidth: "140px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            payees: {
                name: colHeader(t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_NUMBER_OF_PAYEES), "right"),
                selector: (row) => (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {row?.billDetails?.length || "0"}
                    </div>
                ),
                grow: 1,
                minWidth: "120px",
                maxWidth: "140px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            totalAmount: {
                name: colHeader(`${t(I18N_KEYS.COMMON.HCM_AM_TOTAL_AMOUNT)}${currencySuffix}`),
                selector: (row) => {
                    const total = row?.totalAmount || 0;
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {total}
                        </div>
                    );
                },
                grow: 1,
                minWidth: "140px",
                maxWidth: "170px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            download: {
                name: colHeader(t(I18N_KEYS.COMMON.HCM_AM_DOWNLOAD_BILL)),
                selector: (row, index) => {
                    const reportDetails = row?.additionalDetails?.reportDetails;
                    const billId = row?.billNumber;
                    const isLastRow = index === props.totalCount - 1;
    
                    return reportDetails?.status === "COMPLETED" ? (
                        <Button
                            iconFill=""
                            size="medium"
                            icon="FileDownload"
                            isSuffix
                            label={t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_DOWNLOAD_BILLS)}
                            title={t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_DOWNLOAD_BILLS)}
                            showBottom={!isLastRow}
                            onOptionSelect={(value) => {
                                if (value.code === "HCM_AM_PDF") {
                                    if (reportDetails?.pdfReportId) {
                                        downloadFileWithName({ fileStoreId: reportDetails.pdfReportId, customName: `${billId}`, type: "pdf" });
                                    } else {
                                        setShowToast({ key: "error", label: t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_PDF_GENERATION_FAILED), transitionTime: 3000 });
                                    }
                                } else if (value.code === "HCM_AM_EXCEL") {
                                    if (reportDetails?.excelReportId) {
                                        downloadFileWithName({ fileStoreId: reportDetails.excelReportId, customName: `${billId}`, type: "excel" });
                                    } else {
                                        setShowToast({ key: "error", label: t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_EXCEL_GENERATION_FAILED), transitionTime: 3000 });
                                    }
                                }
                            }}
                            options={[
                                { code: "HCM_AM_EXCEL", name: t(I18N_KEYS.COMMON.HCM_AM_EXCEL) },
                                { code: "HCM_AM_PDF", name: t(I18N_KEYS.COMMON.HCM_AM_PDF) },
                            ]}
                            optionsKey="name"
                            style={{ minWidth: "10rem" }}
                            type="actionButton"
                            variation="secondary"
                        />
                    ) : (
                        <div title={reportDetails?.status === "FAILED" ? t(I18N_KEYS.COMMON.HCM_AM_FAILED_REPORT_GENERATION) : t(I18N_KEYS.COMMON.HCM_AM_PROGRESS_REPORT_GENERATION)}>
                            <Tag
                                {...(reportDetails?.status !== "FAILED" && { icon: "Info" })}
                                label={reportDetails?.status === "FAILED" ? t(I18N_KEYS.COMMON.HCM_AM_FAILED_REPORT_GENERATION) : t(I18N_KEYS.COMMON.HCM_AM_PROGRESS_REPORT_GENERATION)}
                                showIcon={true}
                                {...(reportDetails?.status === "FAILED" && { type: "error" })}
                                style={{ whiteSpace: "normal", wordBreak: "break-word", height: "auto", minHeight: "unset" }}
                            />
                        </div>
                    );
                },
                grow: 1,
                minWidth: "200px",
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px", overflow: "visible" },
            },
    
            sendForApproval: {
                name: t(I18N_KEYS.COMMON.HCM_AM_SEND_FOR_APPROVAL),
                selector: (row) => (
                    <Button
                        variation="secondary"
                        size="medium"
                        label={t(I18N_KEYS.COMMON.HCM_AM_SEND_FOR_APPROVAL)}
                        title={t(I18N_KEYS.COMMON.HCM_AM_SEND_FOR_APPROVAL)}
                        style={{ minWidth: "12.5rem", maxWidth: "none" }}
                        onClick={() => {
                            setSelectedBill(row); // Set the selected bill details
                            setShowApprovalPopup(true); // Show the popup
                        }}
                        isDisabled={row?.status == "REVIEW_IN_PROGRESS"}
                    />
                ),
                grow: 0,
                minWidth: "260px",
                width: "280px",
                style: {
                    display: "flex",
                    alignItems: "flex-start",
                    paddingTop: "15px",
                    overflow: "visible",
                },
            },
    
            downloadAdvisory: {
                name: colHeader(t(I18N_KEYS.COMMON.HCM_AM_DOWNLOAD_ADVISORY)),
                selector: (row, index) => {
                    const advisoryReport = row?.advisoryReport;
                    const billId = row?.billNumber;
                    const isLastRow = index === props.totalCount - 1;
    
                    return advisoryReport?.status === "GENERATED" && advisoryReport?.fileStoreId ? (
                        <Button
                            iconFill=""
                            size="medium"
                            icon="FileDownload"
                            isSuffix
                            label={t(I18N_KEYS.COMMON.HCM_AM_DOWNLOAD_ADVISORY)}
                            title={t(I18N_KEYS.COMMON.HCM_AM_DOWNLOAD_ADVISORY)}
                            onClick={() => {
                                downloadFileWithName({ fileStoreId: advisoryReport.fileStoreId, customName: `Payment_Advisory_${billId}`, type: "excel" });
                            }}
                            style={{ whiteSpace: "nowrap" }}
                            variation="secondary"
                            type="button"
                        />
                    ) : (
                        <div title={advisoryReport?.status === "FAILED" ? t(I18N_KEYS.COMMON.HCM_AM_FAILED_REPORT_GENERATION) : t(I18N_KEYS.COMMON.HCM_AM_PROGRESS_REPORT_GENERATION)}>
                            <Tag
                                {...(advisoryReport?.status !== "FAILED" && { icon: "Info" })}
                                label={advisoryReport?.status === "FAILED" ? t(I18N_KEYS.COMMON.HCM_AM_FAILED_REPORT_GENERATION) : t(I18N_KEYS.COMMON.HCM_AM_PROGRESS_REPORT_GENERATION)}
                                showIcon={true}
                                {...(advisoryReport?.status === "FAILED" && { type: "error" })}
                                style={{ whiteSpace: "normal", wordBreak: "break-word", height: "auto", minHeight: "unset" }}
                            />
                        </div>
                    );
                },
                grow: 1,
                minWidth: "260px",
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px", overflow: "visible" },
            },
    
            // ── Status count columns (verification) ──────────────────────────
            pending: {
                name: colHeader(t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_PENDING), "right"),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => d?.status === "PENDING_VERIFICATION")?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                },
                grow: 1,
                minWidth: "100px",
                maxWidth: "130px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            verificationFailed: {
                name: colHeader(t(I18N_KEYS.COMMON.HCM_AM_VERIFICATION_FAILED), "right"),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => d?.status === "VERIFICATION_FAILED")?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                },
                grow: 1,
                minWidth: "150px",
                maxWidth: "190px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            verified: {
                name: colHeader(t(I18N_KEYS.COMMON.HCM_AM_VERIFIED), "right"),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => ["VERIFIED", "PAYMENT_FAILED"].includes(d?.status))?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#00703C", paddingRight: "1rem" }}>{count}</div>;
                },
                grow: 1,
                minWidth: "100px",
                maxWidth: "130px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            failures: {
                name: colHeader(t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_NUMBER_OF_FAILURES), "right"),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => d?.status === "VERIFICATION_FAILED")?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                },
                grow: 1,
                minWidth: "120px",
                maxWidth: "160px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            editBill: {
                name: t(I18N_KEYS.COMMON.HCM_AM_EDIT_BILL),
                selector: (row) => (
                    <Button
                        variation="secondary"
                        size="medium"
                        label={t(I18N_KEYS.COMMON.HCM_AM_EDIT_BILL)}
                        onClick={() => {
                            navigate(`/${window.contextPath}/employee/payments/view-bill-payment-details/${role}`, {
                                state: {
                                    billID: row.billNumber,
                                    activeTabCode: activeTabCode,
                                },
                            });
                        }}
                    />
                ),
                width: "160px",
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
            },
    
            // ── Payment approver columns ──────────────────────────────────────
            billDate: {
                name: colHeader(t(I18N_KEYS.COMMON.HCM_AM_BILL_DATE)),
                selector: (row) => (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {row?.billDate ? formatTimestampToDate(row.billDate) : t(I18N_KEYS.COMMON.NA)}
                    </div>
                ),
                grow: 1,
                style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
            },
    
            amountPaid: {
                name: colHeader(t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_AMOUNT_PAID), "right"),
                selector: (row) => {
                    const paid = row?.billDetails?.filter((d) => d?.status === "PAID")?.reduce((sum, d) => sum + (d?.totalAmount || 0), 0) || 0;
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {paid}
                        </div>
                    );
                },
                grow: 1,
                minWidth: "130px",
                maxWidth: "170px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            pendingPayment: {
                name: colHeader(t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_PENDING), "right"),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => !["PAID", "PAYMENT_FAILED"].includes(d?.status))?.length || 0;
                    return <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>{count}</div>;
                },
                grow: 1,
                minWidth: "100px",
                maxWidth: "130px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            failedPayment: {
                name: colHeader(t(I18N_KEYS.COMMON.HCM_AM_FAILED), "right"),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => d?.status === "PAYMENT_FAILED")?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                },
                grow: 1,
                minWidth: "100px",
                maxWidth: "130px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
    
            paidCount: {
                name: colHeader(t(I18N_KEYS.COMMON.HCM_AM_PAID), "right"),
                selector: (row) => {
                    const count = row?.billDetails?.filter((d) => d?.status === "PAID")?.length || 0;
                    return <div className="ellipsis-cell" style={{ color: "#00703C", paddingRight: "1rem" }}>{count}</div>;
                },
                grow: 1,
                minWidth: "100px",
                maxWidth: "130px",
                style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
            },
        };
    };

    const columns = useMemo(() => {
        const registry = buildColumnRegistry(t, navigate, props, setShowToast, props.activeTabCode);
        const removeLastHeaderRightBorder = (cols = []) =>
            cols.map((col, index) => {
                const isLast = index === cols.length - 1;
                if (!isLast || !React.isValidElement(col?.name)) return col;
                return {
                    ...col,
                    name: React.cloneElement(col.name, {
                        style: { ...(col.name.props?.style || {}), borderRight: "none" },
                    }),
                };
            });

        // Config-driven: use columnKeys if provided
        if (props.columnKeys && Array.isArray(props.columnKeys)) {
            const selectedColumns = props.columnKeys
                .map((key) => registry[key])
                .filter(Boolean);
            return removeLastHeaderRightBorder(selectedColumns);
        }

        // Fallback: legacy activeTab-based logic (backward compat)
        const activeTab = props?.activeTab || "NOT_VERIFIED";

        if (activeTab === "NOT_VERIFIED") {
            return removeLastHeaderRightBorder([registry.billId, registry.registers, registry.payees, registry.totalAmount, registry.download]);
        }
        if (activeTab === "VERIFICATION_IN_PROGRESS") {
            return removeLastHeaderRightBorder([registry.billId, registry.payees, registry.pending, registry.verificationFailed, registry.verified, registry.download]);
        }
        if (activeTab === "PARTIALLY_VERIFIED") {
            return removeLastHeaderRightBorder([registry.billId, registry.payees, registry.failures, registry.download, registry.editBill]);
        }
        if (activeTab === "FULLY_VERIFIED") {
            return removeLastHeaderRightBorder([registry.billId, registry.totalAmount, registry.payees, registry.download]);
        }
        if (activeTab === "SENT_FOR_REVIEW") {
            return removeLastHeaderRightBorder([registry.billId, registry.registers, registry.payees, registry.totalAmount, registry.download]);
        }

        return removeLastHeaderRightBorder([registry.billId, registry.payees, registry.download]);
    }, [
        props.data,
        props.totalCount,
        props.columnKeys,
        props.activeTab,
        props.activeTabCode,
        props.workerRatesData?.currency,
        t,
    ]);

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
                    setShowApprovalPopup(false);
                    setShowToast({
                      key: "success",
                      label: t(I18N_KEYS.COMPONENTS_BILLS.HCM_AM_SEND_FOR_APPROVAL_SUCCESS),
                      transitionTime: 3000,
                    });
                    props?.onRefetchBills?.();
                    props?.onRefetchBillCount?.();
                  },
                  onError: (err) => {
                    console.error("Send for approval failed:", err);
          
                    setShowToast({
                      key: "error",
                      label: t(I18N_KEYS.COMMON.HCM_AM_SOMETHING_WENT_WRONG),
                      transitionTime: 3000,
                    });
                  },
                }
              );
            } catch (e) {
              console.error("Mutation error:", e);
            }
          };

          const conditionalRowStyles = [
            {
              when: (row) =>
                row.status === "VERIFICATION_IN_PROGRESS" ||
                row.status === "SENDING_FOR_REVIEW" ||
                row.status === "REVIEW_IN_PROGRESS",
              style: {
                opacity: 0.5,
                // pointerEvents: "none",
                backgroundColor: "#f5f5f5",
              },
            },
          ];

    return (
        <>
            <DataTable
                className="search-component-table manage-bills-table"
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
                selectableRowDisabled={(row) =>
                    row.status === "VERIFICATION_IN_PROGRESS" || row.status === "SENDING_FOR_REVIEW" || row.status === "REVIEW_IN_PROGRESS"
                }
                conditionalRowStyles={conditionalRowStyles}
                onSelectedRowsChange={handleSelectedRowsChange}
                onRowClicked={handleRowClicked}
                pointerOnHover
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
            setShowApprovalPopup(false);
        }}
    />
)}
        </>
    );
};

export default ManageBillsTable;
