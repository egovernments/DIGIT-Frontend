import React, { Fragment,useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, TextInput, Toast } from "@egovernments/digit-ui-components";

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
    const [showToast, setShowToast] = useState(null);

    const handleSave = () => {
        if (!isEditable) return;
        const trimmedPayeeName = payeeName.trim();
        const trimmedPayeeMobile = payeeMobileNumber.trim();
        const trimmedBankAccount = bankAccount.trim();
        const trimmedBankCode = bankCode.trim();
        const trimmedBeneficiaryCode = beneficiaryCode.trim();
        //todo add validations for bank fields
        if (!trimmedPayeeName) {
            setShowToast({
                key: "error",
                label: t("HCM_AM_INVALID_NAME_ERROR_TOAST_MESSAGE") || "Please enter a valid name.",
                transitionTime: 3000,
            });
            return;
        }
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(trimmedPayeeMobile)) {
            setShowToast({
                key: "error",
                label: t("HCM_AM_INVALID_MOBILE_NUMBER_ERROR_TOAST_MESSAGE") || "Please enter a valid 8-digit mobile number.",
                transitionTime: 3000,
            });
            return;
        }
        setShowToast(null);
        onSubmit({
            payeeName: trimmedPayeeName,
            payeePhoneNumber: trimmedPayeeMobile,
            ...(isBank ? { bankAccount: trimmedBankAccount, bankCode: trimmedBankCode, beneficiaryCode: trimmedBeneficiaryCode } : {}),
        });
    };

    const labelStyle = { fontWeight: "600", fontSize: "14px", marginBottom: "4px", color: "#0B0C0C" };

    const renderEditable = (label, value, onChange, required) => (
        <div style={{ marginBottom: "1rem" }}>
            <div style={labelStyle}>
                {label}{required && <span style={{ color: "#B91900" }}> *</span>}
            </div>
            <TextInput
                style={{ width: "100%" }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={!isEditable}
            />
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
                        {renderEditable(t("HCM_AM_PAYEE_NAME"), payeeName, setPayeeName, true)}
                        {renderEditable(t("HCM_AM_PAYEE_PHONE_NUMBER"), payeeMobileNumber, setPayeeMobileNumber, true)}
                        {renderReadOnlyInput(t("HCM_AM_MNO_NAME"), operator)}
                        {isBank && (
                            <>
                                {renderEditable(t("HCM_AM_BANK_ACCOUNT"), bankAccount, setBankAccount, true)}
                                {renderEditable(t("HCM_AM_BANK_CODE"), bankCode, setBankCode, true)}
                                {renderEditable(t("HCM_AM_BENEFICIARY_CODE"), beneficiaryCode, setBeneficiaryCode, true)}
                            </>
                        )}

                        {/* Read-only card */}
                        <div style={{
                            background: "#F5F5F5",
                            border: "1px solid #E0E0E0",
                            borderRadius: "6px",
                            padding: "12px 16px",
                            marginTop: "0.5rem",
                        }}>
                            {readOnlyFields.map((field) => (
                                <div key={field.label} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "6px 0",
                                    borderBottom: "1px solid #E8E8E8",
                                }}>
                                    <span style={{ fontSize: "14px", color: "#0B0C0C", fontWeight: "600" }}>{field.label}</span>
                                    <span style={{ fontSize: "14px", color: "#505A5F" }}>
                                        {field.value !== undefined && field.value !== null ? field.value : t("NA")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
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
            {showToast && (
                <Toast
                    style={{ zIndex: 10001 }}
                    label={showToast.label}
                    type={showToast.key}
                    onClose={() => setShowToast(null)}
                />
            )}
        </>
    );
};

export default WorkerDetailsPopUp;
