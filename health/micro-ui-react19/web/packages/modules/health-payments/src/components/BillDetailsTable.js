import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, CustomSVG, Tag, Toast, Tooltip, TooltipWrapper } from "@egovernments/digit-ui-components";
import { InfoOutline } from "@egovernments/digit-ui-svg-components";

import { downloadFileWithName, formatTimestampToDate, getCustomPaginationOptions } from "../utils";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./table_inbox_custom_style";
import { defaultPaginationValues } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import WorkerDetailsPopUp from "./WorkerDetailsPopUp";
import { isBank } from "../utils/roleUtils";


const BillDetailsTable = ({ ...props }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(null);
    const project = Digit?.SessionStorage.get("staffProjects");
    const selectedProject = Digit?.SessionStorage.get("selectedProject");
    const [tableData, setTableData] = useState(props?.data || []);
    const [selectedRow, setSelectedRow] = useState(null);
    const workerRatesData = props?.workerRatesData;
    const rateHeadCodes = props?.rateHeadCodes || ["PER_DAY", "FOOD", "TRAVEL", "MISC"];
    const baseHeadCodes = useMemo(
        () => (Array.isArray(props?.baseHeadCodes) ? props.baseHeadCodes : []),
        [props?.baseHeadCodes]
    );
    const billStatus = props?.billStatus;
    const subTab = props?.subTab;
    const isReviewerEdit = props?.isReviewerEdit;
    const hasTriedSave = props?.hasTriedSave;
    const maxAttendanceDays = props?.maxAttendanceDays;
    const tenantId = props?.tenantId || Digit.ULBService.getCurrentTenantId();
    const billId = props?.billId;
    const expenseContextPath = props?.expenseContextPath || "health-expense";
    const isBankMode = isBank;

    const billDetailUpdateMutation = Digit.Hooks.useCustomAPIMutationHook({
        url: `/${expenseContextPath}/bill/v1/billdetails/_update`,
    });

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

    const truncateToDecimals = (num, decimals = 2) => {
        if (!Number.isFinite(num)) return 0;
        const factor = 10 ** decimals;
        return Math.trunc(num * factor) / factor;
    };

    const displayPerDayRate = (val) => {
        const n = Number(val);
        if (val === "" || val == null || Number.isNaN(n)) return 0;
        return truncateToDecimals(n, 2);
    };

    const displayAmountMax2 = (val) => {
        const n = Number(val);
        if (val === "" || val == null || Number.isNaN(n)) return 0;
        return truncateToDecimals(n, 2);
    };

    const displayFeePercentOneDecimal = (val) => {
        const n = Number(val);
        if (val === "" || val == null || Number.isNaN(n)) return null;
        return (Math.round(n * 10) / 10).toFixed(1);
    };

    const getFeePercent = (row) => {
        // Prefer the live row-state percent (set by the parent from
        // payableLineItems). Fall back to the legacy additionalDetails value
        // for older bills that haven't been resaved.
        const liveRaw = row?.feePercent;
        if (liveRaw !== undefined && liveRaw !== null && liveRaw !== "") {
            const n = Number(liveRaw);
            if (Number.isFinite(n)) return n;
        }
        const legacy = Number(row?.additionalDetails?.feePercent);
        return Number.isFinite(legacy) ? legacy : null;
    };

    const reviewerLineSubtotal = (row) => {
        const ratesByHead = row?.ratesByHead || {};
        const perDaySum = Object.values(ratesByHead).reduce(
            (sum, value) => sum + (Number(value) || 0),
            0
        );
        const days = Number(row?.totalAttendance || 0);
        return perDaySum * days;
    };

    // Subtotal restricted to the FEES base headCodes (e.g. PER_DAY+FOOD+TRAVEL).
    // Used to compute the live fee amount in the reviewer total column.
    const reviewerBaseSubtotal = (row) => {
        const ratesByHead = row?.ratesByHead || {};
        const heads = baseHeadCodes.length > 0 ? baseHeadCodes : Object.keys(ratesByHead);
        const baseSum = heads.reduce(
            (sum, h) => sum + (Number(ratesByHead?.[h]) || 0),
            0
        );
        const days = Number(row?.totalAttendance || 0);
        return baseSum * days;
    };

    const normalizeNonNegativeInt = (raw) => {
        if (raw === "") return "";
        const n = Number(raw);
        if (!Number.isFinite(n)) return "";
        return Math.max(0, Math.trunc(n));
    };

    const getReviewerRateMaxByHead = (headCode) => {
        const rateMaxLimitSchema = props?.rateMaxLimitSchema;
        if (rateMaxLimitSchema && workerRatesData?.headCodeMapping) {
            const reverseMap = Object.fromEntries(
                Object.entries(workerRatesData.headCodeMapping).map(([field, hc]) => [hc, field])
            );
            const fieldKey = reverseMap[headCode];
            if (fieldKey !== undefined && rateMaxLimitSchema[fieldKey] !== undefined) {
                return rateMaxLimitSchema[fieldKey];
            }
        }
        if (headCode === "PER_DAY") return 150;
        return 50;
    };

    const normalizeFeePercent = (raw) => {
        if (raw === "") return "";
        const n = Number(raw);
        if (!Number.isFinite(n)) return "";
        const clamped = Math.min(100, Math.max(0, n));
        return Math.round(clamped * 10) / 10;
    };

    const handleReviewerRateByHeadChange = (rowId, headCode, value) => {
        const normalizedValue = normalizeNonNegativeInt(value);
        const maxAllowed = getReviewerRateMaxByHead(headCode);
        const isClamped =
            normalizedValue !== "" &&
            Number.isFinite(Number(normalizedValue)) &&
            Number(normalizedValue) > maxAllowed;
        const clampedValue =
            normalizedValue === "" ? normalizedValue : Math.min(Number(normalizedValue), maxAllowed);
        const updatedData = tableData.map((row) => {
            if (row.id !== rowId) return row;
            const nextRatesByHead = {
                ...(row?.ratesByHead || {}),
                [headCode]: clampedValue,
            };
            // Keep legacy fields in sync while callers are still reading them.
            const legacyFieldByHead = {
                PER_DAY: "perDay",
                FOOD: "food",
                TRAVEL: "travel",
                MISC: "misc",
            };
            const legacyField = legacyFieldByHead[headCode];
            return legacyField
                ? { ...row, ratesByHead: nextRatesByHead, [legacyField]: clampedValue }
                : { ...row, ratesByHead: nextRatesByHead };
        });
        if (isClamped) {
            setShowToast({
                key: "error",
                label: `Rate cannot exceed ${maxAllowed} for ${headCode.replace(/_/g, " ")}`,
                transitionTime: 3000,
            });
        }
        setTableData(updatedData);
        if (props?.onRowChange) {
            const updatedRow = updatedData.find((r) => r.id === rowId);
            if (updatedRow) props.onRowChange(updatedRow);
        }
    };

    const handleReviewerAdditionalDetailsChange = (rowId, field, value) => {
        const nextValue = field === "feePercent" ? normalizeFeePercent(value) : value === "" ? "" : Number(value);
        const updatedData = tableData.map((row) =>
            row.id === rowId
                ? { ...row, additionalDetails: { ...(row.additionalDetails || {}), [field]: nextValue } }
                : row
        );
        setTableData(updatedData);
        if (props?.onRowChange) {
            const updatedRow = updatedData.find((r) => r.id === rowId);
            if (updatedRow) props.onRowChange(updatedRow);
        }
    };

    const handleReviewerFeePercentChange = (rowId, value) => {
        const nextValue = normalizeFeePercent(value);
        const updatedData = tableData.map((row) =>
            row.id === rowId ? { ...row, feePercent: nextValue } : row
        );
        setTableData(updatedData);
        if (props?.onRowChange) {
            const updatedRow = updatedData.find((r) => r.id === rowId);
            if (updatedRow) props.onRowChange(updatedRow);
        }
    };

    const currencySuffix = workerRatesData?.currency ? ` (${workerRatesData.currency})` : "";
    const HEAD_LABEL_KEY_MAP = {
        PER_DAY: "HCM_AM_WAGE_RATE",
        FOOD: "HCM_AM_FOOD_ALLOWANCE",
        TRAVEL: "HCM_AM_TRANSPORTATION",
        MISC: "HCM_AM_MISC",
    };

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

    const columns = useMemo(() => {
        // --- Reusable column definitions ---

        const userIdCol = {
            name: colHeader(t("HCM_AM_WORKER_ID")),
            selector: (row) => {
                // const showErrorPayments = row?.status === "PAYMENT_FAILED";
                // const showErrorNotProcessed =
                //     (row?.status === "PENDING_VERIFICATION" ||
                //      row?.status === "VERIFICATION_FAILED" ||
                //      row?.status === "EDITED") &&
                //     row?.additionalDetails?.errorDetails?.reasonForFailure === "MTN_SERVICE_EXCEPTION";
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
                        {/* {(showErrorPayments || showErrorNotProcessed) && (
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
                        )} */}
                    </div>
                );
            },
            allowOverflow: true,
            minWidth: "180px",
            maxWidth: "240px",
            grow: 1,
        };

        const workerNameCol = {
            name: colHeader(t("HCM_AM_WORKER_NAME")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{ fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px", display: "inline-block" }}
                    title={row?.givenName || t("NA")}>
                    {row?.givenName || t("NA")}
                </span>
            ),
            minWidth: "150px",
            maxWidth: "220px",
            grow: 1,
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
            maxWidth: "220px",
            grow: 1,
        };

        const phoneCol = {
            name: colHeader(t("HCM_AM_MOBILE_NUMBER")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{ fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px", display: "inline-block" }}>
                    {row?.mobileNumber || t("NA")}
                </span>
            ),
            minWidth: "140px",
            maxWidth: "180px",
            grow: 1,
        };

        const payeePhoneCol = {
            name: colHeader(t("HCM_AM_PAYEE_PHONE_NUMBER")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px", display: "inline-block" }}>
                    {row?.payeePhoneNumber || t("NA")}
                </span>
            ),
            minWidth: "160px",
            maxWidth: "200px",
            grow: 1,
        };

        const roleCol = {
            name: colHeader(t("HCM_AM_ROLE")),
            selector: (row) => (
                <span
                    className="ellipsis-cell"
                    title={t(row?.role) || t("NA")}
                    style={{
                        fontSize: "14px",
                        whiteSpace: "normal",
                        overflow: "visible",
                        textOverflow: "clip",
                        display: "block",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                    }}
                >
                    {t(row?.role) || t("NA")}
                </span>
            ),
            style: { justifyContent: "start" },
            minWidth: "140px",
            maxWidth: "180px",
            grow: 1,
        };

        const operatorCol = {
            name: colHeader(t("HCM_AM_PAYMENT_PROVIDER")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{ fontSize: "14px" }}>
                    {row?.payee?.paymentProvider || "\u2014"}
                </span>
            ),
            style: { justifyContent: "start" },
            minWidth: "140px",
            maxWidth: "180px",
            grow: 1,
        };

        const bankAccountCol = {
            name: colHeader(t("HCM_AM_BANK_ACCOUNT")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{ fontSize: "14px" }}>
                    {row?.payee?.bankAccount || "\u2014"}
                </span>
            ),
            style: { justifyContent: "start" },
            minWidth: "160px",
            maxWidth: "220px",
            grow: 1,
        };

        const bankCodeCol = {
            name: colHeader(t("HCM_AM_BANK_CODE")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{ fontSize: "14px" }}>
                    {row?.payee?.bankCode || "\u2014"}
                </span>
            ),
            style: { justifyContent: "start" },
            minWidth: "140px",
            maxWidth: "180px",
            grow: 1,
        };

        const beneficiaryCodeCol = {
            name: colHeader(t("HCM_AM_BENEFICIARY_CODE")),
            selector: (row) => (
                <span className="ellipsis-cell" style={{ fontSize: "14px" }}>
                    {row?.payee?.beneficiaryCode || "\u2014"}
                </span>
            ),
            style: { justifyContent: "start" },
            minWidth: "160px",
            maxWidth: "220px",
            grow: 1,
        };

        const daysCol = {
            name: colHeader(t("HCM_AM_NUMBER_OF_DAYS"), "right"),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem", fontSize: "14px" }}>
                    {row?.totalAttendance != null ? row.totalAttendance : t("NA")}
                </div>
            ),
            style: { justifyContent: "flex-end" },
            minWidth: "120px",
            maxWidth: "150px",
            grow: 1,
        };

        const wageCol = {
            name: colHeader(`${t("HCM_AM_WAGE")}${currencySuffix}`, "right"),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem", fontSize: "14px" }}>
                    {`${row.wage}`}
                </div>
            ),
            style: { justifyContent: "flex-end" },
            minWidth: "120px",
            maxWidth: "160px",
            grow: 1,
        };

        const totalAmountCol = {
            name: colHeader(`${t("HCM_AM_TOTAL_AMOUNT")}${currencySuffix}`, "right"),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem", fontSize: "14px" }}>
                    {displayAmountMax2(row?.totalAmount)}
                </div>
            ),
            style: { justifyContent: "flex-end" },
            minWidth: "140px",
            maxWidth: "180px",
            grow: 1,
        };

        // --- Per-day rate columns (dynamic by head code) ---
        const getHeadLabel = (headCode) => {
            const key = HEAD_LABEL_KEY_MAP?.[headCode];
            if (key) return t(key);
            const translated = t(headCode);
            return translated === headCode ? headCode.replace(/_/g, " ") : translated;
        };

        const dynamicRateCols = rateHeadCodes.map((headCode) => ({
            name: colHeader(`${getHeadLabel(headCode)} ${currencySuffix}`, "right"),
            selector: (row) => (
                <div className="ellipsis-cell" style={{ paddingRight: "1rem", fontSize: "14px" }}>
                    {displayPerDayRate(row?.ratesByHead?.[headCode])}
                </div>
            ),
            style: { justifyContent: "flex-end" },
            minWidth: "130px",
            maxWidth: "170px",
            grow: 1,
        }));

        const feesCol = {
            name: colHeader(`${t("HCM_AM_FEES_AND_CHARGES")} %`, "right"),
            selector: (row) => {
                const percent = getFeePercent(row);
                const displayPercent = displayFeePercentOneDecimal(percent);
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem",fontSize: "14px" }}>
                        {displayPercent == null ? "\u2014" : displayPercent}
                    </div>
                );
            },
            style: { justifyContent: "flex-end" },
            minWidth: "130px",
            maxWidth: "170px",
            grow: 1,
        };

        const totalCol = {
            name: colHeader(`${t("HCM_AM_TOTAL_AMOUNT")}${currencySuffix}`, "right"),
            selector: (row) => {
                const total = displayAmountMax2(row?.totalAmount);
                // const percent = getFeePercent(row);
                // const fee = percent == null ? 0 : Math.round((total * percent) / 100);
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem",fontSize: "14px" }}>
                        {/* {total + fee} */}
                        {total}
                    </div>
                );
            },
            style: { justifyContent: "flex-end" },
            minWidth: "140px",
            maxWidth: "180px",
            grow: 1,
        };

        // --- Columns for Partially Verified > Verification Failed ---

        const reasonCol = {
            name: colHeader(t("HCM_AM_REASON_FOR_FAILURE")),
            selector: (row) => (
                <span
                    className="ellipsis-cell"
                    title={t(row?.additionalDetails?.errorDetails?.reasonForFailure) || t("NA")}
                    style={{
                        fontSize: "14px",
                        color: "#B91900",
                        whiteSpace: "normal",
                        overflow: "visible",
                        textOverflow: "clip",
                        display: "block",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                    }}
                >
                    {t(row?.additionalDetails?.errorDetails?.reasonForFailure) || t("NA")}
                </span>
            ),
            grow: 1,
            minWidth: "180px",
            maxWidth: "280px",
            style: { justifyContent: "start" },
        };

        const actionCol = {
            name: colHeader(t("HCM_AM_ACTION")),
            selector: () => (
                <Button
                    variation="secondary"
                    size="small"
                    label={t("HCM_AM_IGNORE_ERROR")}
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
            grow: 1,
            minWidth: "180px",
            maxWidth: "280px",
            style: { justifyContent: "start" },
        };

        // --- Reviewer editable columns ---

        const dynamicReviewerRateCols = rateHeadCodes.map((headCode) => ({
            name: colHeader(`${getHeadLabel(headCode)}${currencySuffix}`, "right"),
            selector: (row) => {
                const headPayableCodes = row?.payableHeadCodes || [];
                const locked = row?.ratesFromPayables && !headPayableCodes.includes(headCode);
                if (!isReviewerEdit || locked) {
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {displayPerDayRate(row?.ratesByHead?.[headCode])}
                        </div>
                    );
                }
                const isEmpty = hasTriedSave && row?.ratesByHead?.[headCode] === "";
                const maxAllowed = getReviewerRateMaxByHead(headCode);
                return (
                    <input
                        type="number"
                        value={row?.ratesByHead?.[headCode] != null ? row.ratesByHead[headCode] : ""}
                        onChange={(e) => handleReviewerRateByHeadChange(row.id, headCode, e.target.value)}
                        min={0}
                        max={maxAllowed}
                        step={1}
                        style={{
                            width: "70px",
                            padding: "4px 6px",
                            border: isEmpty ? "1px solid #B91900" : "1px solid #B1B4B6",
                            borderRadius: "4px",
                            fontSize: "14px",
                            textAlign: "right",
                        }}
                    />
                );
            },
            style: { justifyContent: "flex-end" },
            grow: 1,
            minWidth: "130px",
            maxWidth: "170px",
        }));

        const reviewerDaysCol = {
            name: colHeader(t("HCM_AM_NUMBER_OF_DAYS"), "right"),
            selector: (row) => {
                if (!isReviewerEdit) {
                    return (
                        <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                            {row?.totalAttendance != null ? row.totalAttendance : t("NA")}
                        </div>
                    );
                }
                const isEmpty = hasTriedSave && row?.totalAttendance === "";
                const isOutOfRange =
                    hasTriedSave &&
                    maxAttendanceDays != null &&
                    Number(row?.totalAttendance) > maxAttendanceDays;
                return (
                    <input
                        type="number"
                        value={row?.totalAttendance != null ? row.totalAttendance : ""}
                        onChange={(e) => {
                            const normalized = normalizeNonNegativeInt(e.target.value);
                            const isClamped =
                                normalized !== "" &&
                                maxAttendanceDays != null &&
                                Number(normalized) > maxAttendanceDays;
                            const val =
                                normalized === "" || maxAttendanceDays == null
                                    ? normalized
                                    : Math.min(normalized, maxAttendanceDays);
                            if (isClamped) {
                                setShowToast({
                                    key: "error",
                                    label:
                                        t("HCM_AM_ATTENDANCE_EXCEEDS_BILLING_PERIOD") ||
                                        `Attendance cannot exceed ${maxAttendanceDays} day(s) for this billing period`,
                                    transitionTime: 3000,
                                });
                            }
                            const updatedData = tableData.map((r) =>
                                r.id === row.id
                                    ? { ...r, totalAttendance: val, additionalDetails: { ...r.additionalDetails, attendance: val } }
                                    : r
                            );
                            setTableData(updatedData);
                            if (props?.onRowChange) {
                                const updatedRow = updatedData.find((r) => r.id === row.id);
                                if (updatedRow) props.onRowChange(updatedRow);
                            }
                        }}
                        min={0}
                        max={maxAttendanceDays != null ? maxAttendanceDays : undefined}
                        step={1}
                        style={{
                            width: "70px",
                            padding: "4px 6px",
                            border: isEmpty || isOutOfRange ? "1px solid #B91900" : "1px solid #B1B4B6",
                            borderRadius: "4px",
                            fontSize: "14px",
                            textAlign: "right",
                        }}
                    />
                );
            },
            style: { justifyContent: "flex-end" },
            grow: 1,
            minWidth: "130px",
            maxWidth: "170px",
        };

        const reviewerFeesCol = {
            name: colHeader(`${t("HCM_AM_FEES_AND_CHARGES")} %`, "right"),
            selector: (row) => {
                const percent = getFeePercent(row);
                // FEES is editable only when (a) reviewer is in edit mode AND
                // (b) the bill actually has FEES configured for it
                // (baseHeadCodes resolved from fieldConfig).
                const feesEditable = isReviewerEdit && baseHeadCodes.length > 0;
                if (feesEditable) {
                    const isEmpty = hasTriedSave && row?.feePercent === "";
                    return (
                        <input
                            type="number"
                            value={row?.feePercent != null ? row.feePercent : ""}
                            onChange={(e) => handleReviewerFeePercentChange(row.id, e.target.value)}
                            min={0}
                            max={100}
                            step={0.1}
                            style={{
                                width: "70px",
                                padding: "4px 6px",
                                border: isEmpty ? "1px solid #B91900" : "1px solid #B1B4B6",
                                borderRadius: "4px",
                                fontSize: "14px",
                                textAlign: "right",
                            }}
                        />
                    );
                }
                const displayFee = displayFeePercentOneDecimal(percent);
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem" }}>
                        {displayFee == null ? "\u2014" : displayFee}
                    </div>
                );
            },
            style: { justifyContent: "flex-end" },
            grow: 1,
            minWidth: "130px",
            maxWidth: "170px",
        };

        const reviewerTotalCol = {
            name: colHeader(`${t("HCM_AM_TOTAL_AMOUNT")}${currencySuffix}`, "right"),
            selector: (row) => {
                const subtotal = reviewerLineSubtotal(row);
                const baseSubtotal =
                    baseHeadCodes.length > 0 ? reviewerBaseSubtotal(row) : subtotal;
                const percent = getFeePercent(row);
                const fee = percent == null ? 0 : (baseSubtotal * percent) / 100;
                return (
                    <div className="ellipsis-cell" style={{ paddingRight: "1rem", fontWeight: "bold" }}>
                        {displayAmountMax2(subtotal + fee)}
                    </div>
                );
            },
            style: { justifyContent: "flex-end" },
            minWidth: "120px",
            maxWidth: "170px",
            grow: 1,
        };

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

        // --- Column set selection based on billStatus and role ---

        // Reviewer view (SENT_FOR_REVIEW / SENT_FOR_APPROVAL)
        if (props?.role === "PAYMENT_REVIEWER") {
            return removeLastHeaderRightBorder([
                userIdCol, workerNameCol, phoneCol, payeeNameCol, operatorCol,
                bankAccountCol, bankCodeCol, beneficiaryCodeCol, roleCol,
                ...dynamicReviewerRateCols, reviewerDaysCol, reviewerFeesCol, reviewerTotalCol
            ]);
        }

        // bank-mode view: show payee bank details
        if (isBankMode) {
            const bankModeCols = [
                userIdCol,
                workerNameCol,
                phoneCol,
                payeeNameCol,
                operatorCol,
                bankAccountCol,
                bankCodeCol,
                beneficiaryCodeCol,
                roleCol,
                ...dynamicRateCols,
                daysCol,
                feesCol,
                totalCol,
            ];
            const showFailedVerificationExtras = billStatus === "PARTIALLY_VERIFIED" && subTab === "VERIFICATION_FAILED";
            return removeLastHeaderRightBorder(showFailedVerificationExtras ? [...bankModeCols, reasonCol] : bankModeCols);//todo add actionCol as well for ignore error
        }

        // Partially Verified with sub-tabs
        if (billStatus === "PARTIALLY_VERIFIED") {
            if (subTab === "VERIFICATION_FAILED") {
                return removeLastHeaderRightBorder([userIdCol, workerNameCol, operatorCol, payeeNameCol, phoneCol,  roleCol, daysCol, wageCol, totalAmountCol, reasonCol, actionCol]);
            }
            // VERIFIED sub-tab
            return removeLastHeaderRightBorder([userIdCol, workerNameCol, operatorCol, payeeNameCol, phoneCol,  roleCol, daysCol, wageCol, totalAmountCol]);
        }

        // Approver: Partially Paid with sub-tabs (Failed / Paid)
        if (billStatus === "PARTIALLY_PAID") {
            if (subTab === "FAILED") {
                return removeLastHeaderRightBorder([userIdCol, workerNameCol, payeeNameCol, phoneCol, roleCol, operatorCol, ...dynamicRateCols, daysCol, feesCol, totalCol, errorMessageCol]);
            }
            // PAID sub-tab
            return removeLastHeaderRightBorder([userIdCol, workerNameCol, payeeNameCol, phoneCol, roleCol, ...dynamicRateCols, daysCol, feesCol, totalCol]);
        }

        // Standard view for PENDING_VERIFICATION, VERIFICATION_IN_PROGRESS, FULLY_VERIFIED, SENT_FOR_REVIEW,
        // SENT_FOR_APPROVAL, PAYMENT_IN_PROGRESS, FULLY_PAID, etc.
        return removeLastHeaderRightBorder([userIdCol, workerNameCol, payeeNameCol, phoneCol, roleCol, ...dynamicRateCols, daysCol, feesCol, totalCol]);

    }, [tableData, t, billStatus, subTab, props?.role, isReviewerEdit, isBankMode, currencySuffix, rateHeadCodes, baseHeadCodes, hasTriedSave]);

    const handlePageChange = (page, totalRows) => {
        props?.handlePageChange(page, totalRows);
    };

    const handlePerRowsChange = async (currentRowsPerPage, currentPage) => {
        props?.handlePerRowsChange(currentRowsPerPage, currentPage);
    };

    const handleMultiFieldUpdate = async (updatedFields) => {
        if (billDetailUpdateMutation?.isLoading) return;
        if (!billId) {
            setShowToast({ key: "error", label: t("HCM_AM_BILL_NOT_FOUND"), transitionTime: 3000 });
            return;
        }
        if (!tenantId) {
            setShowToast({ key: "error", label: t("HCM_AM_SOMETHING_WENT_WRONG"), transitionTime: 3000 });
            return;
        }
        if (!selectedRow?.id) {
            setShowToast({ key: "error", label: t("HCM_AM_SOMETHING_WENT_WRONG"), transitionTime: 3000 });
            return;
        }
        const isEditable = ["PENDING_VERIFICATION", "VERIFICATION_FAILED"].includes(selectedRow?.status);
        if (!isEditable) {
            setShowToast({ key: "error", label: t("HCM_AM_EDIT_NOT_ALLOWED_FOR_STATUS") || t("HCM_AM_SOMETHING_WENT_WRONG"), transitionTime: 3000 });
            return;
        }

        const existingPayee = selectedRow?.payee || {};
        const payeeIdentifier = existingPayee?.identifier || selectedRow?.payee?.identifier;

        const nextPayee = {
            ...existingPayee,
            tenantId: existingPayee?.tenantId || tenantId,
            ...(existingPayee?.type ? { type: existingPayee.type } : {}),
            ...(payeeIdentifier ? { identifier: payeeIdentifier } : {}),
            paymentProvider: existingPayee?.paymentProvider || "BANK",
            payeeName: updatedFields?.payeeName,
            // payeePhoneNumber: updatedFields?.payeePhoneNumber,
            ...(updatedFields?.bankAccount !== undefined ? { bankAccount: updatedFields.bankAccount } : {}),
            ...(updatedFields?.bankCode !== undefined ? { bankCode: updatedFields.bankCode } : {}),
            ...(updatedFields?.beneficiaryCode !== undefined ? { beneficiaryCode: updatedFields.beneficiaryCode } : {}),
        };

        const payeeUpdatedAtEpochMs = Date.now();
        try {
            await billDetailUpdateMutation.mutateAsync(
                {
                    body: {
                        // RequestInfo: Digit.Utils.getRequestInfo(),
                        billId,
                        tenantId,
                        billDetails: [
                            {
                                id: selectedRow.id,
                                payee: nextPayee, //todo
                                additionalDetails: {
                                    ...(selectedRow?.additionalDetails || {}),
                                    editInfo: {
                                        ...(selectedRow?.additionalDetails?.editInfo || {}),
                                        payeeUpdatedAtEpochMs,
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    onSuccess: () => {
                        const updatedData = tableData.map((row) =>
                            row.id === selectedRow?.id
                                ? {
                                    ...row,
                                    ...updatedFields,
                                    payee: nextPayee,
                                    payeeName: updatedFields?.payeeName,
                                    // payeePhoneNumber: updatedFields?.payeePhoneNumber,
                                }
                                : row
                        );
                        setTableData(updatedData);
                        setSelectedRow(null);
                        setShowToast({ key: "success", label: t("HCM_AM_SAVE_CHANGES_SUCCESS"), transitionTime: 3000 });
                        setTimeout(() => {
                            props?.onRefetchBill?.();
                        }, 2000);
                    },
                    onError: (error) => {
                        setShowToast({
                            key: "error",
                            label: error?.response?.data?.Errors?.[0]?.message || t("HCM_AM_SOMETHING_WENT_WRONG"),
                            transitionTime: 3000,
                        });
                    },
                }
            );
        } catch (e) {
            setShowToast({
                key: "error",
                label: e?.response?.data?.Errors?.[0]?.message || t("HCM_AM_SOMETHING_WENT_WRONG"),
                transitionTime: 3000,
            });
        }
    };

    return (
        <>
            <DataTable
                className="search-component-table bill-details-table"
                columns={columns}
                data={tableData}
                pagination
                paginationServer
                customStyles={tableCustomStyle(false, { rowHover: false })}
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
                    isSaving={billDetailUpdateMutation?.isLoading}
                    isEditable={["PENDING_VERIFICATION", "VERIFICATION_FAILED"].includes(selectedRow?.status)}
                    isBank={isBankMode}
                    currency={workerRatesData?.currency}
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
