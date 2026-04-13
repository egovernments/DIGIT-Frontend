import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, CustomSVG, Tag, Toast, Tooltip, TooltipWrapper } from "@egovernments/digit-ui-components";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";

import { downloadFileWithName, formatTimestampToDate, getCustomPaginationOptions } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";
import { useHistory } from "react-router-dom";
import WorkerDetailsPopUp from "./WorkerDetailsPopUp";


const BillDetailsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast, setShowToast] = useState(null);
    const project = Digit?.SessionStorage.get("staffProjects");
    const selectedProject = Digit?.SessionStorage.get("selectedProject");
    const [tableData, setTableData] = useState(props?.data || []);
    const [selectedRow, setSelectedRow] = useState(null);
    const workerRatesData = props?.workerRatesData;
    const billStatus = props?.billStatus;
    const subTab = props?.subTab;
    const isReviewerEdit = props?.isReviewerEdit;

    useEffect(() => {
        setTableData(props?.data || []);
    }, [props?.data]);

    const calculateTotalWithFees = (amount, percent) => {
        if (!amount || !percent) return amount;

        const total = Number(amount);
        const additional = (total * percent) / 100;
        const finalAmount = total + additional;

        return Math.round(finalAmount);
    };

    const displayPerDayRate = (val) => {
        const n = Number(val);
        if (val === "" || val == null || Number.isNaN(n)) return 0;
        return Math.round(n * 100) / 100;
    };

    const FEE_PERCENT = 3.5;
    const reviewerLineSubtotal = (row) => {
        const wage = Number(row?.perDay || 0);
        const food = Number(row?.food || 0);
        const travel = Number(row?.travel || 0);
        const misc = Number(row?.misc || 0);
        const days = Number(row?.additionalDetails?.attendance || 0);
        return Math.round((wage + food + travel + misc) * days);
    };

    const handleReviewerCellChange = (rowId, field, value) => {
        const updatedData = tableData.map((row) =>
            row.id === rowId ? { ...row, [field]: value === "" ? "" : Number(value) } : row
        );
        setTableData(updatedData);
        if (props?.onRowChange) {
            const updatedRow = updatedData.find((r) => r.id === rowId);
            if (updatedRow) props.onRowChange(updatedRow);
        }
    };

    const currencySuffix = workerRatesData?.currency ? ` (${workerRatesData.currency})` : "";

    const colHeader = (label) => (
        <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
            {label}
        </div>
    );

    const editableCell = (row, field, withDollar = true) => {
        if (!isReviewerEdit) {
            return (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {row?.[field] != null ? row[field] : 0}
                </div>
            );
        }
        return (
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                {withDollar && <span style={{ fontSize: "14px", color: "#505A5F" }}>$</span>}
                <input
                    type="number"
                    value={row?.[field] != null ? row[field] : ""}
                    onChange={(e) => handleReviewerCellChange(row.id, field, e.target.value)}
                    style={{
                        width: "70px",
                        padding: "4px 6px",
                        border: "1px solid #B1B4B6",
                        borderRadius: "4px",
                        fontSize: "14px",
                        textAlign: "right",
                    }}
                />
            </div>
        );
    };

    const columns = useMemo(() => {
        // --- Reusable column definitions ---

        const userIdCol = {
            name: colHeader(t("HCM_AM_WORKER_ID")),
            selector: (row) => {
                const showErrorPayments = row?.status === "PAYMENT_FAILED";
                const showErrorNotProcessed =
                    (row?.status === "PENDING_VERIFICATION" ||
                     row?.status === "VERIFICATION_FAILED" ||
                     row?.status === "EDITED") &&
                    row?.additionalDetails?.errorDetails?.reasonForFailure === "MTN_SERVICE_EXCEPTION";
                return (
                    <div className="ellipsis-cell" style={{ display: "flex", alignItems: "center", minWidth: 0, maxWidth: "100%" }}>
                        <span
                            className="ellipsis-cell"
                            style={{
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                maxWidth: "160px", display: "inline-block", marginRight: "4px",
                                color: "#C84C0E", cursor: "pointer", textDecoration: "underline",
                            }}
                            title={t(row?.userId) || t("NA")}
                            onClick={() => setSelectedRow(row)}
                        >
                            {t(row?.userId) || t("NA")}
                        </span>
                        {(showErrorPayments || showErrorNotProcessed) && (
                            <TooltipWrapper
                                arrow
                                content={
                                    <div style={{ maxWidth: "600px", whiteSpace: "normal", wordWrap: "break-word" }}>
                                        {showErrorPayments
                                            ? (row?.additionalDetails?.responseMessage
                                                ? t(row.additionalDetails.responseMessage)
                                                : row?.additionalDetails?.errorDetails?.reasonForFailure
                                                    ? t(row.additionalDetails.errorDetails.reasonForFailure)
                                                    : `${t("HCM_AM_REQUEST_NOT_PROCESSED")} ${t("HCM_AM_PLEASE_TRY_AGAIN")}`)
                                            : `${t("HCM_AM_REQUEST_NOT_PROCESSED")} ${t("HCM_AM_PLEASE_TRY_AGAIN")}`
                                        }
                                    </div>
                                }
                                enterDelay={100}
                                header={t("HCM_AM_DATA_ERROR")}
                                leaveDelay={0}
                                placement="right"
                            >
                                <span style={{ display: "inline-block" }}>
                                    <Button
                                        style={{ minWidth: "auto", color: "#B91900", paddingLeft: "0.25rem", cursor: "default", backgroundColor: "transparent" }}
                                        variation="tertiary" size="medium" icon="Error" iconFill="#B91900"
                                    />
                                </span>
                            </TooltipWrapper>
                        )}
                    </div>
                );
            },
            allowOverflow: true,
            minWidth: "180px",
        };

        const workerNameCol = {
            name: colHeader(t("HCM_AM_WORKER_NAME")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px", display: "inline-block" }}
                    title={row?.givenName || t("NA")}>
                    {row?.givenName || t("NA")}
                </span>
            ),
            minWidth: "150px",
        };

        const payeeNameCol = {
            name: colHeader(t("HCM_AM_PAYEE_NAME")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{ fontSize: "14px" }}>
                    {row?.payeeName || "\u2014"}
                </span>
            ),
            style: { justifyContent: "start" },
            minWidth: "130px",
        };

        const phoneCol = {
            name: colHeader(t("HCM_AM_MOBILE_NUMBER")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px", display: "inline-block" }}>
                    {row?.mobileNumber || t("NA")}
                </span>
            ),
            minWidth: "140px",
        };

        const roleCol = {
            name: colHeader(t("HCM_AM_ROLE")),
            selector: (row) => (
                <span className="ellipsis-cell" title={t(row?.role) || t("NA")} style={{ fontSize: "14px" }}>
                    {t(row?.role) || t("NA")}
                </span>
            ),
            style: { justifyContent: "start" },
        };

        const operatorCol = {
            name: colHeader(t("HCM_AM_MNO_NAME")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{ fontSize: "14px" }}>
                    {row?.operator || t("MTN")}
                </span>
            ),
            style: { justifyContent: "start" },
        };

        const daysCol = {
            name: colHeader(t("HCM_AM_NUMBER_OF_DAYS")),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {row?.additionalDetails?.attendance != null ? row.additionalDetails.attendance : t("NA")}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const wageCol = {
            name: colHeader(`${t("HCM_AM_WAGE")}${currencySuffix}`),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {`${row.wage}`}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const totalAmountCol = {
            name: colHeader(`${t("HCM_AM_TOTAL_AMOUNT")}${currencySuffix}`),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {`${row.totalAmount}`}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        // --- Per-day rate columns (values divided by days worked) ---

        const perDayCol = {
            name: colHeader(`${t("HCM_AM_WAGE_RATE")} ${currencySuffix}`),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {displayPerDayRate(row?.perDay)}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const foodCol = {
            name: colHeader(`${t("HCM_AM_FOOD_ALLOWANCE")} ${currencySuffix}`),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {displayPerDayRate(row?.food)}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const travelCol = {
            name: colHeader(`${t("HCM_AM_TRANSPORTATION")} ${currencySuffix}`),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {displayPerDayRate(row?.travel)}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const miscCol = {
            name: colHeader(`${t("HCM_AM_MISC")} ${currencySuffix}`),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {displayPerDayRate(row?.misc)}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const feesCol = {
            name: colHeader(`${t("HCM_AM_FEES_AND_CHARGES")} %`),
            selector: (row) => {
                const total = Number(row?.totalAmount || 0);
                const fee = Math.round((total * FEE_PERCENT) / 100);
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {fee}
                    </div>
                );
            },
            style: { justifyContent: "flex-end" },
        };

        const totalCol = {
            name: colHeader(`${t("HCM_AM_TOTAL_AMOUNT")}${currencySuffix}`),
            selector: (row) => {
                const total = Number(row?.totalAmount || 0);
                const fee = Math.round((total * FEE_PERCENT) / 100);
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {total + fee}
                    </div>
                );
            },
            style: { justifyContent: "flex-end" },
        };

        // --- Columns for Partially Verified > Verification Failed ---

        const reasonCol = {
            name: colHeader(t("HCM_AM_REASON_FOR_FAILURE")),
            selector: (row) => (
                <span className="ellipsis-cell" title={t(row?.additionalDetails?.errorDetails?.reasonForFailure) || t("NA")}
                    style={{ fontSize: "14px", color: "#B91900" }}>
                    {t(row?.additionalDetails?.errorDetails?.reasonForFailure) || t("NA")}
                </span>
            ),
            minWidth: "180px",
            style: { justifyContent: "start" },
        };

        const actionCol = {
            name: colHeader(t("HCM_AM_ACTION")),
            selector: () => (
                <Button
                    variation="secondary"
                    size="small"
                    label={t("HCM_AM_RESOLVE")}
                    onClick={() => { /* placeholder */ }}
                />
            ),
            width: "120px",
        };

        // --- Additional columns for approver views ---

        const errorMessageCol = {
            name: colHeader(t("HCM_AM_ERROR_MESSAGE")),
            selector: (row) => (
                <span className="ellipsis-cell" title={t(row?.additionalDetails?.responseMessage || row?.additionalDetails?.errorDetails?.reasonForFailure) || t("NA")}
                    style={{ fontSize: "14px", color: "#B91900" }}>
                    {t(row?.additionalDetails?.responseMessage || row?.additionalDetails?.errorDetails?.reasonForFailure) || t("NA")}
                </span>
            ),
            minWidth: "180px",
            style: { justifyContent: "start" },
        };

        // --- Reviewer editable columns ---

        const reviewerWageCol = {
            name: colHeader(`${t("HCM_AM_WAGE_RATE")}${currencySuffix}`),
            selector: (row) => editableCell(row, "perDay"),
            style: { justifyContent: "flex-end" },
            minWidth: "130px",
        };

        const reviewerFoodCol = {
            name: colHeader(`${t("HCM_AM_FOOD_ALLOWANCE")}${currencySuffix}`),
            selector: (row) => editableCell(row, "food"),
            style: { justifyContent: "flex-end" },
            minWidth: "130px",
        };

        const reviewerTravelCol = {
            name: colHeader(`${t("HCM_AM_TRANSPORTATION")}${currencySuffix}`),
            selector: (row) => editableCell(row, "travel"),
            style: { justifyContent: "flex-end" },
            minWidth: "130px",
        };

        const reviewerMiscCol = {
            name: colHeader(`${t("HCM_AM_MISC")}${currencySuffix}`),
            selector: (row) => {
                const miscLocked = row?.ratesFromPayables && !row?.hasMiscPayable;
                if (miscLocked) {
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {displayPerDayRate(row?.misc)}
                        </div>
                    );
                }
                return editableCell(row, "misc");
            },
            style: { justifyContent: "flex-end" },
            minWidth: "130px",
        };

        const reviewerDaysCol = {
            name: colHeader(t("HCM_AM_NUMBER_OF_DAYS")),
            selector: (row) => {
                if (!isReviewerEdit) {
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {row?.additionalDetails?.attendance != null ? row.additionalDetails.attendance : t("NA")}
                        </div>
                    );
                }
                return (
                    <input
                        type="number"
                        value={row?.additionalDetails?.attendance != null ? row.additionalDetails.attendance : ""}
                        onChange={(e) => {
                            const val = e.target.value === "" ? "" : Number(e.target.value);
                            const updatedData = tableData.map((r) =>
                                r.id === row.id
                                    ? { ...r, additionalDetails: { ...r.additionalDetails, attendance: val } }
                                    : r
                            );
                            setTableData(updatedData);
                            if (props?.onRowChange) {
                                const updatedRow = updatedData.find((r) => r.id === row.id);
                                if (updatedRow) props.onRowChange(updatedRow);
                            }
                        }}
                        style={{
                            width: "70px",
                            padding: "4px 6px",
                            border: "1px solid #B1B4B6",
                            borderRadius: "4px",
                            fontSize: "14px",
                            textAlign: "right",
                        }}
                    />
                );
            },
            style: { justifyContent: "flex-end" },
            minWidth: "130px",
        };

        const reviewerFeesCol = {
            name: colHeader(`${t("HCM_AM_FEES_AND_CHARGES")}${currencySuffix}`),
            selector: (row) => {
                const subtotal = reviewerLineSubtotal(row);
                const fee = Math.round((subtotal * FEE_PERCENT) / 100);
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {fee}
                    </div>
                );
            },
            style: { justifyContent: "flex-end" },
            minWidth: "130px",
        };

        const reviewerTotalCol = {
            name: colHeader(`${t("HCM_AM_TOTAL")}${currencySuffix}`),
            selector: (row) => {
                const subtotal = reviewerLineSubtotal(row);
                const fee = Math.round((subtotal * FEE_PERCENT) / 100);
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem", fontWeight: "bold" }}>
                        {subtotal + fee}
                    </div>
                );
            },
            style: { justifyContent: "flex-end" },
            minWidth: "120px",
        };

        // --- Column set selection based on billStatus and role ---

        // Reviewer view (SENT_FOR_REVIEW / SENT_FOR_APPROVAL)
        if (props?.role === "PAYMENT_REVIEWER") {
            return [userIdCol, workerNameCol, payeeNameCol, operatorCol, phoneCol, roleCol,
                reviewerWageCol, reviewerFoodCol, reviewerTravelCol, reviewerMiscCol, reviewerDaysCol, reviewerFeesCol, reviewerTotalCol];
        }

        // Partially Verified with sub-tabs
        if (billStatus === "PARTIALLY_VERIFIED") {
            if (subTab === "VERIFICATION_FAILED") {
                return [userIdCol, workerNameCol, operatorCol, payeeNameCol, phoneCol, roleCol, daysCol, wageCol, totalAmountCol, reasonCol, actionCol];
            }
            // VERIFIED sub-tab
            return [userIdCol, workerNameCol, operatorCol, payeeNameCol, phoneCol, roleCol, daysCol, wageCol, totalAmountCol];
        }

        // Approver: Partially Paid with sub-tabs (Failed / Paid)
        if (billStatus === "PARTIALLY_PAID") {
            if (subTab === "FAILED") {
                return [userIdCol, workerNameCol, payeeNameCol, phoneCol, roleCol, operatorCol, perDayCol, foodCol, travelCol, miscCol, daysCol, feesCol, totalCol, errorMessageCol];
            }
            // PAID sub-tab
            return [userIdCol, workerNameCol, payeeNameCol, phoneCol, roleCol, perDayCol, foodCol, travelCol, miscCol, daysCol, feesCol, totalCol];
        }

        // Standard view for PENDING_VERIFICATION, VERIFICATION_IN_PROGRESS, FULLY_VERIFIED, SENT_FOR_REVIEW,
        // SENT_FOR_APPROVAL, PAYMENT_IN_PROGRESS, FULLY_PAID, etc.
        return [userIdCol, workerNameCol, payeeNameCol, phoneCol, roleCol, perDayCol, foodCol, travelCol, miscCol, daysCol, feesCol, totalCol];

    }, [tableData, t, billStatus, subTab, props?.role, isReviewerEdit]);

    const handlePageChange = (page, totalRows) => {
        props?.handlePageChange(page, totalRows);
    };

    const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
        props?.handlePerRowsChange(currentRowsPerPage, currentPage);
    };

    const handleMultiFieldUpdate = (updatedFields) => {
        const updatedData = tableData.map((row) =>
            row.id === selectedRow?.id ? { ...row, ...updatedFields } : row
        );
        setTableData(updatedData);
        setSelectedRow(null);
    };

    return (
        <>
            <DataTable
                className="search-component-table"
                columns={columns}
                data={tableData}
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
                selectableRows={false}
                fixedHeaderScrollHeight={"70vh"}
                paginationComponentOptions={getCustomPaginationOptions(t)}
            />
            {selectedRow && (
                <WorkerDetailsPopUp
                    row={selectedRow}
                    onClose={() => setSelectedRow(null)}
                    onSubmit={handleMultiFieldUpdate}
                />
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
        </>
    );
};

export default BillDetailsTable;
