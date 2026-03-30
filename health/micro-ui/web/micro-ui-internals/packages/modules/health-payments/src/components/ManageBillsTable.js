import React, { useState, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, CustomSVG, Tag, Toast } from "@egovernments/digit-ui-components";
import { downloadFileWithName, getCustomPaginationOptions } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";

// Tabs that support row selection (show checkboxes)
const SELECTABLE_TABS = ["NOT_VERIFIED", "PARTIALLY_VERIFIED", "FULLY_VERIFIED"];

const ManageBillsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast, setShowToast] = useState(null);
    const activeTab = props?.activeTab || "NOT_VERIFIED";

    const handleSelectedRowsChange = ({ selectedRows }) => {
        props?.onSelectionChange?.(selectedRows);
    };

    const columns = useMemo(() => {
        // ── Shared column definitions ────────────────────────────────────────

        const billIdCol = {
            name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_BILL_ID")}</div>,
            selector: (row) => (
                <div
                    className="ellipsis-cell"
                    style={{ whiteSpace: "normal", wordBreak: "break-word", textAlign: "start", lineHeight: "1.4", color: "#F47738", cursor: "pointer", textDecoration: "underline" }}
                    title={row?.billNumber || t("NA")}
                    onClick={() => {
                        history.push(`/${window.contextPath}/employee/payments/view-bill-payment-details`, {
                            billID: row.billNumber,
                        });
                    }}
                >
                    {row?.billNumber || t("NA")}
                </div>
            ),
            style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
        };

        const registersCol = {
            name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_NO_OF_REGISTERS")}</div>,
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {row?.additionalDetails?.noOfRegisters || "0"}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const payeesCol = {
            name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_NUMBER_OF_PAYEES")}</div>,
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {row?.billDetails?.length || "0"}
                </div>
            ),
            style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
        };

        const totalAmountCol = {
            name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_TOTAL_AMOUNT")}</div>,
            selector: (row) => {
                const total = row?.billDetails?.reduce((sum, d) => sum + (d?.totalAmount || 0), 0) || 0;
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {total}
                    </div>
                );
            },
            style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
        };

        const downloadCol = {
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
            width: "300px",
            style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
        };

        // ── Per-tab column sets ──────────────────────────────────────────────

        if (activeTab === "NOT_VERIFIED") {
            return [billIdCol, registersCol, payeesCol, totalAmountCol, downloadCol];
        }

        if (activeTab === "VERIFICATION_IN_PROGRESS") {
            return [
                billIdCol,
                payeesCol,
                {
                    name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_PENDING")}</div>,
                    selector: (row) => {
                        const count = row?.billDetails?.filter((d) => d?.status === "PENDING_VERIFICATION")?.length || 0;
                        return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                    },
                    style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
                },
                {
                    name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_VERIFICATION_FAILED")}</div>,
                    selector: (row) => {
                        const count = row?.billDetails?.filter((d) => d?.status === "VERIFICATION_FAILED")?.length || 0;
                        return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                    },
                    style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
                },
                {
                    name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_VERIFIED")}</div>,
                    selector: (row) => {
                        const count = row?.billDetails?.filter((d) => ["VERIFIED", "PAYMENT_FAILED"].includes(d?.status))?.length || 0;
                        return <div className="ellipsis-cell" style={{ color: "#00703C", paddingRight: "1rem" }}>{count}</div>;
                    },
                    style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
                },
                downloadCol,
            ];
        }

        if (activeTab === "PARTIALLY_VERIFIED") {
            return [
                billIdCol,
                payeesCol,
                {
                    name: <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>{t("HCM_AM_NUMBER_OF_FAILURES")}</div>,
                    selector: (row) => {
                        const count = row?.billDetails?.filter((d) => d?.status === "VERIFICATION_FAILED")?.length || 0;
                        return <div className="ellipsis-cell" style={{ color: "#B91900", paddingRight: "1rem" }}>{count}</div>;
                    },
                    style: { justifyContent: "flex-end", paddingTop: "15px", alignItems: "flex-start" },
                },
                downloadCol,
                {
                    name: t("HCM_AM_EDIT_BILL"),
                    selector: (row) => (
                        <Button
                            variation="secondary"
                            size="medium"
                            label={t("HCM_AM_EDIT_BILL")}
                            onClick={() => {
                                history.push(`/${window.contextPath}/employee/payments/edit-bill-payment-details`, {
                                    billID: row.billNumber,
                                });
                            }}
                        />
                    ),
                    width: "160px",
                    style: { display: "flex", alignItems: "flex-start", paddingTop: "15px" },
                },
            ];
        }

        if (activeTab === "FULLY_VERIFIED") {
            return [billIdCol, totalAmountCol, payeesCol, downloadCol];
        }

        if (activeTab === "SENT_FOR_REVIEW") {
            return [billIdCol, registersCol, payeesCol, totalAmountCol, downloadCol];
        }

        return [billIdCol, payeesCol, downloadCol];
    }, [props.data, props.totalCount, t, activeTab]);

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
                selectableRows={SELECTABLE_TABS.includes(activeTab)}
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
        </>
    );
};

export default ManageBillsTable;
