import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, CustomSVG, Tag, Toast, Tooltip, TooltipWrapper } from "@egovernments/digit-ui-components";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";

import { downloadFileWithName, formatTimestampToDate, getCustomPaginationOptions } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";
import { useHistory } from "react-router-dom";
import EditWorkerDetailsPopUp from "./editWorkerDetailsPopUp ";
import WorkerDetailsPopUp from "./WorkerDetailsPopUp";


const BillDetailsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [showToast, setShowToast] = useState(null);
    const project = Digit?.SessionStorage.get("staffProjects");
    const selectedProject = Digit?.SessionStorage.get("selectedProject");
    const [showEditField, setShowEditField] = useState(false);
    const [editFieldName, setEditFieldName] = useState(null);
    const [fieldKey, setFieldKey] = useState(null);
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [initialFieldValue, setInitialFieldValue] = useState("");
    const [tableData, setTableData] = useState(props?.data || []);
    const [selectedRow, setSelectedRow] = useState(null);
    const workerRatesData = props?.workerRatesData;
    const billStatus = props?.billStatus;
    const subTab = props?.subTab;

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

    const currencySuffix = workerRatesData?.currency ? ` (${workerRatesData.currency})` : "";

    const colHeader = (label) => (
        <div style={{ borderRight: "2px solid #787878", width: "100%", textAlign: "start" }}>
            {label}
        </div>
    );

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

        const workerNameColWithEdit = {
            name: colHeader(t("HCM_AM_WORKER_NAME")),
            selector: (row) => {
                const showErrorName =
                    ["VERIFICATION_FAILED", "PENDING_EDIT"].includes(row?.status) &&
                    ["NAME_MISMATCH", "MTN_USERINFO_MISSING_NAME", "MTN_USERINFO_FETCH_FAILED"]
                        .some(r => (row?.additionalDetails?.errorDetails?.reasonForFailure || "").toLowerCase().includes(r.toLowerCase()));
                return (
                    <div className="ellipsis-cell" style={{ display: "flex", alignItems: "center", minWidth: 0, maxWidth: "100%" }}>
                        <span className="ellipsis-cell" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px", display: "inline-block", marginRight: "4px" }}
                            title={row?.givenName || t("NA")}>
                            {row?.givenName || t("NA")}
                        </span>
                        {props?.editBill && row?.status === "PENDING_EDIT" && (
                            <Button
                                style={{ minWidth: "auto", padding: "0px 4px", fontSize: "11px", height: "20px", lineHeight: "16px", marginRight: "4px" }}
                                variation="secondary" size="small" icon="Edit"
                                onClick={() => {
                                    setShowEditField(true);
                                    setFieldKey("givenName");
                                    setInitialFieldValue(row?.givenName || "");
                                    setEditingRowIndex(row?.id);
                                    setEditFieldName(t("HCM_AM_WORKER_NAME"));
                                }}
                            />
                        )}
                        {showErrorName && (
                            <TooltipWrapper arrow
                                content={<div style={{ maxWidth: "600px", whiteSpace: "normal", wordWrap: "break-word" }}>{t(row?.additionalDetails?.errorDetails?.reasonForFailure)}</div>}
                                enterDelay={100} header={t("HCM_AM_DATA_ERROR")} leaveDelay={0} placement="right">
                                <span style={{ display: "inline-block" }}>
                                    <Button style={{ minWidth: "auto", color: "#B91900", paddingLeft: "0.25rem", cursor: "default", backgroundColor: "transparent" }}
                                        variation="tertiary" size="medium" icon="Error" iconFill="#B91900" />
                                </span>
                            </TooltipWrapper>
                        )}
                    </div>
                );
            },
            allowOverflow: true,
            minWidth: "220px",
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

        const phoneColWithEdit = {
            name: colHeader(t("HCM_AM_MOBILE_NUMBER")),
            selector: (row) => {
                const showErrorMobileNumber =
                    ["VERIFICATION_FAILED", "PENDING_EDIT"].includes(row?.status) &&
                    ["MTN_ACCOUNT_VALIDATION_FAILED", "MTN_ACCOUNT_INACTIVE", "MTN_USERINFO_FETCH_FAILED"]
                        .some(r => (row?.additionalDetails?.errorDetails?.reasonForFailure || "").toLowerCase().includes(r.toLowerCase()));
                return (
                    <div style={{ display: "flex", alignItems: "center", minWidth: 0, maxWidth: "100%" }}>
                        <span className="ellipsis-cell" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px", display: "inline-block", marginRight: "4px" }}>
                            {row?.mobileNumber || t("ES_COMMON_NA")}
                        </span>
                        {props?.editBill && row?.status === "PENDING_EDIT" && (
                            <Button
                                style={{ minWidth: "auto", padding: "0px 4px", fontSize: "11px", height: "20px", lineHeight: "16px", marginRight: "4px" }}
                                variation="secondary" size="small" icon="Edit"
                                onClick={() => {
                                    setFieldKey("mobileNumber");
                                    setInitialFieldValue(row?.mobileNumber || "");
                                    setEditingRowIndex(row?.id);
                                    setShowEditField(true);
                                    setEditFieldName(t("HCM_AM_MOBILE_NUMBER"));
                                }}
                            />
                        )}
                        {showErrorMobileNumber && (
                            <TooltipWrapper arrow
                                content={<div style={{ maxWidth: "600px", whiteSpace: "normal", wordWrap: "break-word" }}>{t(row?.additionalDetails?.errorDetails?.reasonForFailure)}</div>}
                                enterDelay={100} header={t("HCM_AM_DATA_ERROR")} leaveDelay={0} placement="right">
                                <span style={{ display: "inline-block" }}>
                                    <Button style={{ minWidth: "auto", color: "#B91900", paddingLeft: "0.25rem", cursor: "default", backgroundColor: "transparent" }}
                                        variation="tertiary" size="medium" icon="Error" iconFill="#B91900" />
                                </span>
                            </TooltipWrapper>
                        )}
                    </div>
                );
            },
            allowOverflow: true,
            minWidth: "220px",
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
                    {row?.additionalDetails?.noOfDaysWorked != null ? row.additionalDetails.noOfDaysWorked : t("NA")}
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

        const totalWithFeesCol = {
            name: colHeader(`${t("HCM_AM_TOTAL_AMOUNT_WITH_FEES")}${currencySuffix}`),
            selector: (row) => {
                const finalAmount = row?.totalAmount ? calculateTotalWithFees(row.totalAmount, 3.5) : null;
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {finalAmount !== null ? `${finalAmount}` : 0}
                    </div>
                );
            },
            style: { justifyContent: "flex-end" },
        };

        // --- New columns for standard view ---

        const perDayCol = {
            name: colHeader(`${t("HCM_AM_WAGE_RATE")} (A)${currencySuffix}`),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {row?.perDay != null ? row.perDay : 0}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const foodCol = {
            name: colHeader(`${t("HCM_AM_FOOD_ALLOWANCE")} (B)${currencySuffix}`),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {row?.food != null ? row.food : 0}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const travelCol = {
            name: colHeader(`${t("HCM_AM_TRANSPORTATION")} (C)${currencySuffix}`),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {row?.travel != null ? row.travel : 0}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const miscCol = {
            name: colHeader(`${t("HCM_AM_MISC")} (D)${currencySuffix}`),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                    {row?.misc != null ? row.misc : 0}
                </div>
            ),
            style: { justifyContent: "flex-end" },
        };

        const feesCol = {
            name: colHeader(`${t("HCM_AM_FEES_AND_CHARGES")} (G)${currencySuffix}`),
            selector: (row) => {
                const total = Number(row?.totalAmount || 0);
                const fee = Math.round((total * 3.5) / 100);
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {fee}
                    </div>
                );
            },
            style: { justifyContent: "flex-end" },
        };

        const totalCol = {
            name: colHeader(`${t("HCM_AM_TOTAL")}${currencySuffix}`),
            selector: (row) => {
                const total = Number(row?.totalAmount || 0);
                const fee = Math.round((total * 3.5) / 100);
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

        // --- Column set selection based on billStatus ---

        // Edit mode: keep existing columns with edit buttons
        if (props?.editBill) {
            return [userIdCol, workerNameColWithEdit, phoneColWithEdit, roleCol, operatorCol, daysCol, wageCol, totalAmountCol, totalWithFeesCol];
        }

        // Partially Verified with sub-tabs
        if (billStatus === "PARTIALLY_VERIFIED") {
            if (subTab === "VERIFICATION_FAILED") {
                return [userIdCol, workerNameCol, operatorCol, payeeNameCol, phoneCol, roleCol, daysCol, wageCol, totalAmountCol, reasonCol, actionCol];
            }
            // VERIFIED sub-tab
            return [userIdCol, workerNameCol, operatorCol, payeeNameCol, phoneCol, roleCol, daysCol, wageCol, totalAmountCol];
        }

        // Standard view for PENDING_VERIFICATION, VERIFICATION_IN_PROGRESS, FULLY_VERIFIED, SENT_FOR_REVIEW
        return [userIdCol, workerNameCol, payeeNameCol, phoneCol, roleCol, perDayCol, foodCol, travelCol, miscCol, daysCol, feesCol, totalCol];

    }, [tableData, t, props?.isSelectionDisabledTransfer, props?.isSelectionDisabledVerify, billStatus, subTab, props?.editBill]);

    const handlePageChange = (page, totalRows) => {
        props?.handlePageChange(page, totalRows);
    };

    const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
        props?.handlePerRowsChange(currentRowsPerPage, currentPage);
    };

    const handleFieldUpdate = (key, newValue) => {
        console.log("inside handleFieldUpdate", key, newValue, editingRowIndex);
        const updatedData = tableData.map((row) =>
            row.id === editingRowIndex
                ? { ...row, [key]: newValue }
                : row
        );
        setTableData(updatedData);
        setShowEditField(false);
        setEditFieldName(null);
        setEditingRowIndex(null);
    };
    const handleMultiFieldUpdate = (updatedFields) => {
        const updatedData = tableData.map((row) =>
            row.id === selectedRow?.id ? { ...row, ...updatedFields } : row
        );
        setTableData(updatedData);
        setSelectedRow(null);
    };

    const handleSelectedRowsChange = ({ selectedRows }) => {
        props?.onSelectionChange(selectedRows);
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
                clearSelectedRows={props?.clearSelectedRows}
                paginationTotalRows={props?.totalCount}
                paginationPerPage={props?.rowsPerPage}
                sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
                paginationRowsPerPageOptions={defaultPaginationValues}
                fixedHeader={true}
                selectableRows={props?.selectableRows}
                selectableRowDisabled={(row) =>
                    (props?.status === "VERIFIED" && props?.isSelectionDisabledTransfer) ||
                    (props?.status === "PAYMENT_FAILED" && props?.isSelectionDisabledTransfer) ||
                    (props?.status === "NOT_VERIFIED" && props?.isSelectionDisabledVerify) ||
                    (row?.status === 'PENDING_EDIT' && !props?.editBill) ||
                    (row?.status === 'EDITED' && props?.editBill)
                }
                conditionalRowStyles={[
                    {
                        when: (row) =>
                            (props?.status === "VERIFIED" && props?.isSelectionDisabledTransfer) ||
                            (props?.status === "PAYMENT_FAILED" && props?.isSelectionDisabledTransfer) ||
                            (props?.status === "NOT_VERIFIED" && props?.isSelectionDisabledVerify) ||
                            (row?.status === 'PENDING_EDIT' && !props?.editBill),
                        style: {
                            backgroundColor: "#f0f0f0",
                            color: "#999",
                            opacity: 0.6,
                        },
                    },
                ]}
                onSelectedRowsChange={handleSelectedRowsChange}
                fixedHeaderScrollHeight={"70vh"}
                paginationComponentOptions={getCustomPaginationOptions(t)}
            />
            {showEditField && (
                <EditWorkerDetailsPopUp
                    onClose={() => setShowEditField(false)}
                    editFieldName={editFieldName}
                    onSubmit={handleFieldUpdate}
                    fieldKey={fieldKey}
                    initialValue={initialFieldValue}
                />
            )}
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
