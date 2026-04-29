import React, { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextInput } from "@egovernments/digit-ui-components";

/**
 * WorkerDetailsPopUp
 * Opens when clicking on a worker's username in the bill details table.
 * Editable fields: payee name, payee mobile number
 * Read-only fields: role, no. of days, wage, amount
 */
const WorkerDetailsPopUp = ({ onClose, onSubmit, row, isSaving = false, isEditable = true, isBank = false }) => {
    const { t } = useTranslation();
    const [payeeName, setPayeeName] = useState(row?.payee?.payeeName || "");
    const [payeeMobileNumber, setPayeeMobileNumber] = useState(row?.payee?.payeePhoneNumber || "");
    const [operator] = useState(row?.payee?.paymentProvider || "BANK");
    const [bankAccount, setBankAccount] = useState(row?.payee?.bankAccount || "");
    const [bankCode, setBankCode] = useState(row?.payee?.bankCode || "");
    const [beneficiaryCode, setBeneficiaryCode] = useState(row?.payee?.beneficiaryCode || "");
    const [errors, setErrors] = useState({});

    const validate = (trimmed) => {
        const e = {};
        const nameRe = /^[A-Za-z0-9 ]{1,100}$/;
        if (!nameRe.test(trimmed.payeeName)) {
            e.payeeName = t("HCM_AM_INVALID_NAME_ERROR") || "Name must be alphanumeric and up to 100 characters.";
        }
        const hasPayeeMobile = !!trimmed.payeeMobile;
        if ((!isBank || hasPayeeMobile) && !/^[0-9]{10}$/.test(trimmed.payeeMobile)) {
            e.payeeMobileNumber = t("HCM_AM_INVALID_MOBILE_NUMBER_ERROR") || "Phone number must be exactly 10 digits.";
        }
        if (isBank) {
            if (!/^[0-9]{10}$/.test(trimmed.bankAccount)) {
                e.bankAccount = t("HCM_AM_INVALID_BANK_ACCOUNT_ERROR") || "Bank account must be exactly 10 digits.";
            }
            if (!/^(?:[0-9]{3}|[0-9]{9})$/.test(trimmed.bankCode)) {
                e.bankCode = t("HCM_AM_INVALID_BANK_CODE_ERROR") || "Bank code must be 3 or 9 digits.";
            }
            if (!/^[A-Za-z0-9]{1,35}$/.test(trimmed.beneficiaryCode)) {
                e.beneficiaryCode =
                    t("HCM_AM_INVALID_BENEFICIARY_CODE_ERROR") || "Beneficiary code must be alphanumeric and up to 35 characters.";
            }
        }
        return e;
    };

    const setField = (key, setter) => (val) => {
        setter(val);
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const handleSave = () => {
        if (!isEditable) return;
        const trimmedPayeeName = payeeName.trim();
        const trimmedPayeeMobile = payeeMobileNumber.trim();
        const trimmedBankAccount = bankAccount.trim();
        const trimmedBankCode = bankCode.trim();
        const trimmedBeneficiaryCode = beneficiaryCode.trim();

        const nextErrors = validate({
            payeeName: trimmedPayeeName,
            payeeMobile: trimmedPayeeMobile,
            bankAccount: trimmedBankAccount,
            bankCode: trimmedBankCode,
            beneficiaryCode: trimmedBeneficiaryCode,
        });
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        setErrors({});
        onSubmit({
            payeeName: trimmedPayeeName,
            payeePhoneNumber: trimmedPayeeMobile,
            ...(isBank ? { bankAccount: trimmedBankAccount, bankCode: trimmedBankCode, beneficiaryCode: trimmedBeneficiaryCode } : {}),
        });
    };

    const labelStyle = { fontWeight: "600", fontSize: "14px", marginBottom: "4px", color: "#0B0C0C" };

    const renderEditable = (label, value, onChange, required, error) => (
        <div style={{ marginBottom: "1rem" }}>
            <div style={labelStyle}>
                {label}
                {required && <span style={{ color: "#B91900" }}> *</span>}
            </div>
            <TextInput
                style={{ width: "100%", ...(error ? { borderColor: "#B91900" } : {}) }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={!isEditable}
            />
            {error && <div style={{ color: "#B91900", fontSize: "12px", marginTop: "4px" }}>{error}</div>}
        </div>
    );

    const renderReadOnlyInput = (label, value) => (
        <div style={{ marginBottom: "1rem" }}>
            <div style={labelStyle}>{label}</div>
            <TextInput style={{ width: "100%" }} value={value} disabled />
        </div>
    );

    const readOnlyFields = [
        { label: t("HCM_AM_ROLE"), value: t(row?.role) },
        { label: t("HCM_AM_NUMBER_OF_DAYS"), value: row?.totalAttendance },
        { label: t("HCM_AM_WAGE"), value: row?.wage },
        { label: t("HCM_AM_TOTAL_AMOUNT"), value: row?.totalAmount },
    ];

    return (
        <>
            <PopUp
                style={{ width: "600px" }}
                onClose={onClose}
                heading={t("HCM_AM_EDIT_WORKER_DETAILS_LABEL")}
                children={[
                    <div key="worker-detail-fields" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        {renderEditable(t("HCM_AM_PAYEE_NAME"), payeeName, setField("payeeName", setPayeeName), true, errors.payeeName)}
                        {renderEditable(
                            t("HCM_AM_PAYEE_PHONE_NUMBER"),
                            payeeMobileNumber,
                            setField("payeeMobileNumber", setPayeeMobileNumber),
                            !isBank,
                            errors.payeeMobileNumber
                        )}
                        {renderReadOnlyInput(t("HCM_AM_PAYMENT_PROVIDER"), operator)}
                        {isBank && (
                            <>
                                {renderEditable(
                                    t("HCM_AM_BANK_ACCOUNT"),
                                    bankAccount,
                                    setField("bankAccount", setBankAccount),
                                    true,
                                    errors.bankAccount
                                )}
                                {renderEditable(t("HCM_AM_BANK_CODE"), bankCode, setField("bankCode", setBankCode), true, errors.bankCode)}
                                {renderEditable(
                                    t("HCM_AM_BENEFICIARY_CODE"),
                                    beneficiaryCode,
                                    setField("beneficiaryCode", setBeneficiaryCode),
                                    true,
                                    errors.beneficiaryCode
                                )}
                            </>
                        )}

                        {/* Read-only card */}
                        <div
                            style={{
                                background: "#F5F5F5",
                                border: "1px solid #E0E0E0",
                                borderRadius: "6px",
                                padding: "12px 16px",
                                marginTop: "0.5rem",
                            }}
                        >
                            {readOnlyFields.map((field) => (
                                <div
                                    key={field.label}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "6px 0",
                                        borderBottom: "1px solid #E8E8E8",
                                    }}
                                >
                                    <span style={{ fontSize: "14px", color: "#0B0C0C", fontWeight: "600" }}>{field.label}</span>
                                    <span style={{ fontSize: "14px", color: "#505A5F" }}>
                                        {field.value !== undefined && field.value !== null ? field.value : t("NA")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>,
                ]}
                onOverlayClick={onClose}
                footerChildren={[
                    <div key="footer-btns" style={{ display: "flex", justifyContent: "flex-end", gap: "16px", width: "100%" }}>
                        <Button
                            type="button"
                            size="large"
                            variation="secondary"
                            label={t("HCM_AM_CLOSE")}
                            title={t("HCM_AM_CLOSE")}
                            onClick={onClose}
                        />
                        <Button
                            type="button"
                            size="large"
                            variation="primary"
                            label={t("HCM_AM_APPROVE")}
                            title={t("HCM_AM_APPROVE")}
                            onClick={handleSave}
                            isDisabled={!isEditable || isSaving}
                        />
                    </div>,
                ]}
            />
        </>
    );
};

export default WorkerDetailsPopUp;
