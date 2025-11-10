import React, { useState, useEffect, Fragment } from "react";
import {
  CardText,
  CardSectionHeader,
} from "@egovernments/digit-ui-react-components";
import {
  Button, Tag, Card, Loader, LabelFieldPair,
  Toast, TextInput,
  Dropdown,
  RadioButtons,
  Footer,
  Tab,
  HeaderComponent,
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

const PaymentCollection = ({ match }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tenantId = queryParams.get("tenantId") || Digit?.ULBService?.getCurrentTenantId();
  const propertyId = match?.params?.propertyId;

  const [billData, setBillData] = useState(null);
  const [paymentType, setPaymentType] = useState({
    "label": "PT_FULL_AMOUNT",
    "value": "full_amount"
  });
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [showArrears, setShowArrears] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amountToPay: "",
    paidBy: { code: "COMMON_OWNER", name: t("COMMON_OWNER"), i18nKey: "COMMON_OWNER" },
    payerName: "",
    payerMobile: "",
    g8ReceiptNo: "",
    g8ReceiptDate: "",
    // Payment mode specific fields
    transactionNumber: "",
    transactionNumberConfirm: "",
    transactionDate: "",
    chequeNumber: "",
    chequeDate: "",
    ddNumber: "",
    ddDate: "",
    cardLast4Digits: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Create payment mutation hook
  const paymentMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: "/collection-services/payments/_create",
    params: {},
    body: {},
    method: "POST",
    tenantId,
    config: {
      enabled: false,
    },
  });

  useEffect(() => {
    fetchBillData();
  }, [propertyId, tenantId]);

  const fetchBillData = async () => {
    if (!propertyId || !tenantId) return;

    setLoading(true);
    try {
      // Fetch bill using fetchBill API
      const response = await Digit.PaymentService.fetchBill(tenantId, {
        consumerCode: propertyId,
        businessService: "PT"
      });

      if (response?.Bill && response.Bill.length > 0) {
        const bill = response.Bill[0];
        const billDetails = bill.billDetails?.[0];

        setBillData(bill);
        const defaultPaidBy = paidByOptions.find(opt => opt.code === "COMMON_OWNER") || paidByOptions[0];
        setPaymentData(prev => ({
          ...prev,
          amountToPay: billDetails?.amount || bill.totalAmount || 0,
          payerName: bill.payerName || "",
          payerMobile: bill.mobileNumber || "",
          paidBy: defaultPaidBy
        }));
      }
    } catch (error) {
      console.error("Failed to fetch bill:", error);
      setToast({
        label: error?.response?.data?.Errors?.[0]?.message || t("PT_FETCH_BILL_ERROR"),
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const paidByOptions = [
    { code: "COMMON_OWNER", name: t("COMMON_OWNER"), i18nKey: "COMMON_OWNER" },
    { code: "COMMON_OTHER", name: t("COMMON_OTHER"), i18nKey: "COMMON_OTHER" }
  ];

  const paymentModeTabItems = [
    { code: "CASH", name: "COMMON_CASH" },
    { code: "CHEQUE", name: "COMMON_CHEQUE" },
    { code: "DD", name: "COMMON_DD" },
    { code: "CARD", name: "COMMON_CREDIT_DEBIT_CARD" },
    { code: "OFFLINE_NEFT", name: "COMMON_NEFT" },
    { code: "OFFLINE_RTGS", name: "COMMON_RTGS" },
    { code: "POSTAL_ORDER", name: "COMMON_POSTAL_ORDER" },
    { code: "QR_CODE", name: "COMMON_QR_CODE" }
  ];

  const handleInputChange = (field, value) => {
    setPaymentData(prev => {
      const updates = { [field]: value };
      // Handle paidBy field changes
      if (field === "paidBy") {
        if (value?.code === "COMMON_OTHER") {
          // Reset payer name and mobile when "Other" is selected
          updates.payerName = "";
          updates.payerMobile = "";
        } else if (value?.code === "COMMON_OWNER") {
          // Restore owner details when "Owner" is selected
          updates.payerName = billData?.payerName || "";
          updates.payerMobile = billData?.mobileNumber || "";
        }
      }
      return { ...prev, ...updates };
    });
  };

  const handlePaymentTypeChange = (selectedValue) => {
    setPaymentType(selectedValue);

    if (selectedValue.value === "full_amount") {
      const totalAmount = billData?.billDetails?.[0]?.amount || billData?.totalAmount || 0;
      setPaymentData(prev => ({
        ...prev,
        amountToPay: totalAmount
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        amountToPay: ""
      }));
    }
  };

  const handlePaymentModeChange = (selectedTab) => {
    // selectedTab will be the code of the selected tab item
    setPaymentMode(selectedTab);
    // Reset mode-specific fields when changing payment mode
    setPaymentData(prev => ({
      ...prev,
      transactionNumber: "",
      transactionNumberConfirm: "",
      transactionDate: "",
      chequeNumber: "",
      chequeDate: "",
      ddNumber: "",
      ddDate: "",
      cardLast4Digits: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
    }));
  };

  const handleIFSCSearch = async (e) => {
    // Prevent any default form behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const ifscCode = paymentData.ifscCode;
    if (!ifscCode || ifscCode.length < 11) {
      setToast({
        label: t("ERR_ENTER_VALID_IFSC"),
        type: "error"
      });
      return;
    }

    try {
      const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
      const data = await response.json();

      if (data === "Not Found" || !data.BANK) {
        setToast({
          label: t("ERR_BANK_DETAILS_NOT_FOUND_FOR_IFSC"),
          type: "error"
        });
        setPaymentData(prev => ({
          ...prev,
          bankName: "",
          branchName: ""
        }));
      } else {
        setPaymentData(prev => ({
          ...prev,
          bankName: data.BANK || "",
          branchName: data.BRANCH || ""
        }));
      }
    } catch (error) {
      console.error("IFSC search error:", error);
      setToast({
        label: t("ERR_BANK_DETAILS_NOT_FOUND_FOR_IFSC"),
        type: "error"
      });
    }
  };

  const validatePayment = () => {
    const amount = parseFloat(paymentData.amountToPay);
    const totalAmount = billData?.billDetails?.[0]?.amount || billData?.totalAmount || 0;

    if (!amount || amount <= 0) {
      return { isValid: false, error: t("PT_INVALID_AMOUNT") };
    }

    if (amount > totalAmount) {
      return { isValid: false, error: t("PT_AMOUNT_EXCEEDS_DUE") };
    }

    if (!paymentData.paidBy || !paymentData.paidBy.code) {
      return { isValid: false, error: t("PT_PAID_BY_REQUIRED") };
    }

    if (!paymentData.payerName || paymentData.payerName.trim() === "") {
      return { isValid: false, error: t("PT_PAYER_NAME_REQUIRED") };
    }

    if (!paymentData.payerMobile || !/^[0-9]{10}$/.test(paymentData.payerMobile)) {
      return { isValid: false, error: t("PT_PAYER_MOBILE_INVALID") };
    }

    // Payment mode specific validations
    if (paymentMode === "CHEQUE") {
      if (!paymentData.chequeNumber) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.chequeDate) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.ifscCode) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.bankName) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.branchName) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
    }

    if (paymentMode === "DD") {
      if (!paymentData.ddNumber) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.ddDate) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.ifscCode) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.bankName) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.branchName) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
    }

    if (paymentMode === "CARD") {
      if (!paymentData.cardLast4Digits || !/^[0-9]{4}$/.test(paymentData.cardLast4Digits)) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.transactionNumber) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.transactionNumberConfirm) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (paymentData.transactionNumber !== paymentData.transactionNumberConfirm) {
        return { isValid: false, error: t("PT_TRANSACTION_NUMBER_MISMATCH") };
      }
    }

    if (paymentMode === "OFFLINE_NEFT" || paymentMode === "OFFLINE_RTGS") {
      if (!paymentData.transactionNumber) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.transactionDate) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.ifscCode) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.bankName) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.branchName) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
    }

    if (paymentMode === "QR_CODE") {
      if (!paymentData.transactionNumber) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.transactionDate) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
    }

    if (paymentMode === "POSTAL_ORDER") {
      if (!paymentData.transactionNumber) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
      if (!paymentData.transactionDate) {
        return { isValid: false, error: t("ERR_DEFAULT_INPUT_FIELD_MSG") };
      }
    }

    return { isValid: true };
  };

  const handlePaymentSubmit = async () => {
    const validation = validatePayment();
    if (!validation.isValid) {
      setToast({
        label: validation.error,
        type: "error"
      });
      return;
    }

    setLoading(true);
    try {
      // Build payment mode specific instrument details
      const instrumentDetails = {};

      switch (paymentMode) {
        case "CHEQUE":
          instrumentDetails.instrumentNumber = paymentData.chequeNumber;
          instrumentDetails.instrumentDate = paymentData.chequeDate;
          instrumentDetails.ifscCode = paymentData.ifscCode;
          instrumentDetails.bankName = paymentData.bankName;
          instrumentDetails.branchName = paymentData.branchName;
          break;
        case "DD":
          instrumentDetails.instrumentNumber = paymentData.ddNumber;
          instrumentDetails.instrumentDate = paymentData.ddDate;
          instrumentDetails.ifscCode = paymentData.ifscCode;
          instrumentDetails.bankName = paymentData.bankName;
          instrumentDetails.branchName = paymentData.branchName;
          break;
        case "CARD":
          instrumentDetails.instrumentNumber = paymentData.transactionNumber;
          instrumentDetails.cardLast4Digits = paymentData.cardLast4Digits;
          break;
        case "OFFLINE_NEFT":
        case "OFFLINE_RTGS":
          instrumentDetails.instrumentNumber = paymentData.transactionNumber;
          instrumentDetails.instrumentDate = paymentData.transactionDate;
          instrumentDetails.ifscCode = paymentData.ifscCode;
          instrumentDetails.bankName = paymentData.bankName;
          instrumentDetails.branchName = paymentData.branchName;
          break;
        case "QR_CODE":
        case "POSTAL_ORDER":
          instrumentDetails.instrumentNumber = paymentData.transactionNumber;
          instrumentDetails.instrumentDate = paymentData.transactionDate;
          break;
        case "CASH":
        default:
          // No additional instrument details needed for cash
          break;
      }

      // Create payment payload - structure should match mono-ui
      const amountPaid = parseFloat(paymentData.amountToPay);
      const totalDue = billData?.totalAmount || 0;

      const paymentPayload = {
        Payment: {
          tenantId: tenantId,
          totalDue: totalDue,
          totalAmountPaid: amountPaid,
          paymentMode: paymentMode,
          paidBy: paymentData.payerName,
          mobileNumber: paymentData.payerMobile,
          payerName: paymentData.payerName,
          transactionNumber: paymentData.transactionNumber || null,
          transactionDate: Date.now(),
          instrumentNumber: instrumentDetails.instrumentNumber || null,
          instrumentDate: instrumentDetails.instrumentDate || null,
          instrumentStatus: instrumentDetails.instrumentNumber ? "DEPOSITED" : null,
          ifscCode: instrumentDetails.ifscCode || null,
          paymentDetails: [
            {
              businessService: "PT",
              billId: billData?.id,
              totalDue: totalDue,
              totalAmountPaid: amountPaid,
              manualReceiptNumber: paymentData.g8ReceiptNo || null,
              manualReceiptDate: paymentData.g8ReceiptDate ? new Date(paymentData.g8ReceiptDate).getTime() : null
            }
          ]
        }
      };

      // Add additionalDetails only for non-cash payments with bank details
      if (paymentMode !== "CASH" && instrumentDetails.ifscCode) {
        paymentPayload.Payment.additionalDetails = [
          {
            branchName: instrumentDetails.branchName,
            bankName: instrumentDetails.bankName
          }
        ];
      }

      // Call payment collection API using mutation
      paymentMutation.mutate({ body: paymentPayload, config: { enable: true } }, {
        onSuccess: (response) => {
          setLoading(false);
          if (response?.Payments && response.Payments.length > 0) {
            const payment = response.Payments[0];
            const receiptNumber = payment.paymentDetails?.[0]?.receiptNumber || payment.receiptNumber;

            // Redirect to payment acknowledgement page with all required params (matching mono-ui)
            history.push(
              `/${window.contextPath}/employee/pt/payment-acknowledgement?status=success&consumerCode=${propertyId}&tenantId=${tenantId}&receiptNumber=${receiptNumber}&businessService=PT`
            );
          }
        },
        onError: (error) => {
          console.error("Payment error:", error);
          setLoading(false);

          // Redirect to acknowledgement screen with failure status (matching mono-ui behavior)
          history.push(
            `/${window.contextPath}/employee/pt/payment-acknowledgement?status=failure&consumerCode=${propertyId}&tenantId=${tenantId}&businessService=PT`
          );
        }
      });
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);

      // Redirect to acknowledgement screen with failure status
      history.push(
        `/${window.contextPath}/employee/pt/payment-acknowledgement?status=failure&consumerCode=${propertyId}&tenantId=${tenantId}&businessService=PT`
      );
    }
  };

  const getTaxHeadLabel = (taxHeadCode) => {
    // Try to get translation, fallback to code
    const translated = t(taxHeadCode);
    return translated === taxHeadCode ? taxHeadCode : translated;
  };

  const renderArrearsDetails = () => {
    const billDetails = billData?.billDetails?.[0];
    if (!billDetails?.billAccountDetails) return null;

    // Filter for arrears items
    const arrearsItems = billDetails.billAccountDetails.filter(
      item => item.taxHeadCode && item.taxHeadCode.includes("ARREAR")
    );

    if (arrearsItems.length === 0) {
      return (
        <p style={{ color: "rgba(0, 0, 0, 0.6)", fontSize: "14px", margin: "0px" }}>
          {t("CS_NO_ARREARS")}
        </p>
      );
    }

    return arrearsItems.map((item, index) => {
      const amount = item.amount || 0;
      const period = item.fromPeriod && item.toPeriod
        ? `${new Date(item.fromPeriod).toLocaleDateString()} to ${new Date(item.toPeriod).toLocaleDateString()}`
        : "";

      return (
        <div key={index} style={{ display: "flex", justifyContent: "space-between", paddingBlock: "8px", borderBottom: "1px solid #e0e0e0" }}>
          <div>
            <span style={{ color: "rgba(0, 0, 0, 0.87)", fontSize: "14px" }}>
              {getTaxHeadLabel(item.taxHeadCode)}
            </span>
            {period && <div style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.6)" }}>{period}</div>}
          </div>
          <span style={{ color: "rgba(0, 0, 0, 0.87)", fontSize: "14px", fontWeight: 500 }}>
            ₹ {amount.toFixed(2)}
          </span>
        </div>
      );
    });
  };

  const renderPaymentModeFields = () => {
    switch (paymentMode) {
      case "CASH":
        return null; // No additional fields for cash

      case "CHEQUE":
        return (
          <>
            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_CHQ_NO_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.chequeNumber}
                  onChange={(e) => handleInputChange("chequeNumber", e.target.value)}
                  placeholder={t("NOC_PAYMENT_CHQ_NO_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_CHEQUE_DATE_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.chequeDate}
                  onChange={(e) => handleInputChange("chequeDate", e.target.value)}
                  type="date"
                  placeholder={t("NOC_PAYMENT_CHEQUE_DATE_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_IFSC_CODE_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  type="search"
                  value={paymentData.ifscCode}
                  onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                  placeholder={t("NOC_PAYMENT_IFSC_CODE_PLACEHOLDER")}
                  onIconSelection={handleIFSCSearch}
                />
              </div>

            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_BANK_NAME_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  placeholder={t("NOC_PAYMENT_BANK_NAME_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_BANK_BRANCH_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.branchName}
                  onChange={(e) => handleInputChange("branchName", e.target.value)}
                  placeholder={t("NOC_PAYMENT_BANK_BRANCH_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>
          </>
        );

      case "DD":
        return (
          <>
            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_DD_NO_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.ddNumber}
                  onChange={(e) => handleInputChange("ddNumber", e.target.value)}
                  placeholder={t("NOC_PAYMENT_DD_NO_PLACEHOLDER")}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_DD_DATE_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.ddDate}
                  onChange={(e) => handleInputChange("ddDate", e.target.value)}
                  type="date"
                  placeholder={t("NOC_PAYMENT_DD_DATE_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_IFSC_CODE_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  type="search"
                  value={paymentData.ifscCode}
                  onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                  placeholder={t("NOC_PAYMENT_IFSC_CODE_PLACEHOLDER")}
                  onIconSelection={handleIFSCSearch}
                />
              </div>

            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_BANK_NAME_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  placeholder={t("NOC_PAYMENT_BANK_NAME_PLACEHOLDER")}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_BANK_BRANCH_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.branchName}
                  onChange={(e) => handleInputChange("branchName", e.target.value)}
                  placeholder={t("NOC_PAYMENT_BANK_BRANCH_PLACEHOLDER")}
                />
              </div>
            </LabelFieldPair>
          </>
        );

      case "CARD":
        return (
          <>
            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_CARD_LAST_DIGITS_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.cardLast4Digits}
                  onChange={(e) => handleInputChange("cardLast4Digits", e.target.value)}
                  placeholder={t("NOC_PAYMENT_CARD_LAST_DIGITS_LABEL_PLACEHOLDER")}
                  maxLength={4}
                  pattern="[0-9]{4}"
                />
              </div>

            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_TRANS_NO_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.transactionNumber}
                  onChange={(e) => handleInputChange("transactionNumber", e.target.value)}
                  placeholder={t("NOC_PAYMENT_TRANS_NO_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_RENTR_TRANS_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.transactionNumberConfirm}
                  onChange={(e) => handleInputChange("transactionNumberConfirm", e.target.value)}
                  placeholder={t("NOC_PAYMENT_TRANS_NO_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>
          </>
        );

      case "OFFLINE_NEFT":
      case "OFFLINE_RTGS":
      case "QR_CODE":
        return (
          <>
            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("PAYMENT_TXN_NO_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.transactionNumber}
                  onChange={(e) => handleInputChange("transactionNumber", e.target.value)}
                  placeholder={t("PAYMENT_TXN_NO_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("PAYMENT_TXN_DATE_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.transactionDate}
                  onChange={(e) => handleInputChange("transactionDate", e.target.value)}
                  type="date"
                  placeholder={t("PAYMENT_TXN_DATE_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>

            {(paymentMode === "OFFLINE_NEFT" || paymentMode === "OFFLINE_RTGS") && (
              <>
                <LabelFieldPair style={{ marginBottom: "16px" }}>
                  <HeaderComponent className="label" style={{ margin: "0rem" }}>
                    <div className={`label-container`}>
                      <label className={`label-styles`}>
                        {t("NOC_PAYMENT_IFSC_CODE_LABEL")}
                      </label>
                      <div style={{ color: "#B91900" }}>{" * "}</div>
                    </div>
                  </HeaderComponent>
                  <div className="digit-field">
                    <TextInput
                      t={t}
                      type="search"
                      value={paymentData.ifscCode}
                      onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                      placeholder={t("NOC_PAYMENT_IFSC_CODE_PLACEHOLDER")}
                      onIconSelection={handleIFSCSearch}
                    />
                  </div>

                </LabelFieldPair>

                <LabelFieldPair style={{ marginBottom: "16px" }}>
                  <HeaderComponent className="label" style={{ margin: "0rem" }}>
                    <div className={`label-container`}>
                      <label className={`label-styles`}>
                        {t("NOC_PAYMENT_BANK_NAME_LABEL")}
                      </label>
                      <div style={{ color: "#B91900" }}>{" * "}</div>
                    </div>
                  </HeaderComponent>
                  <div className="digit-field">
                    <TextInput
                      t={t}
                      value={paymentData.bankName}
                      onChange={(e) => handleInputChange("bankName", e.target.value)}
                      placeholder={t("NOC_PAYMENT_BANK_NAME_PLACEHOLDER")}
                    />
                  </div>
                </LabelFieldPair>

                <LabelFieldPair style={{ marginBottom: "16px" }}>
                  <HeaderComponent className="label" style={{ margin: "0rem" }}>
                    <div className={`label-container`}>
                      <label className={`label-styles`}>
                        {t("NOC_PAYMENT_BANK_BRANCH_LABEL")}
                      </label>
                      <div style={{ color: "#B91900" }}>{" * "}</div>
                    </div>
                  </HeaderComponent>
                  <div className="digit-field">
                    <TextInput
                      t={t}
                      value={paymentData.branchName}
                      onChange={(e) => handleInputChange("branchName", e.target.value)}
                      placeholder={t("NOC_PAYMENT_BANK_BRANCH_PLACEHOLDER")}
                    />
                  </div>

                </LabelFieldPair>
              </>
            )}
          </>
        );

      case "POSTAL_ORDER":
        return (
          <>
            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("PAYMENT_IPO_NO_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.transactionNumber}
                  onChange={(e) => handleInputChange("transactionNumber", e.target.value)}
                  placeholder={t("PAYMENT_IPO_NO_PLACEHOLDER")}
                />
              </div>
            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("PAYMENT_TXN_DATE_LABEL")}
                  </label>
                  <div style={{ color: "#B91900" }}>{" * "}</div>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.transactionDate}
                  onChange={(e) => handleInputChange("transactionDate", e.target.value)}
                  type="date"
                  placeholder={t("PAYMENT_TXN_DATE_PLACEHOLDER")}
                />
              </div>
            </LabelFieldPair>
          </>
        );

      default:
        return null;
    }
  };

  const renderTaxBreakup = () => {
    const billDetails = billData?.billDetails?.[0];
    if (!billDetails?.billAccountDetails) return null;

    return billDetails.billAccountDetails.map((item, index) => {
      const amount = item.amount || 0;
      return (
        <div key={index} style={{ display: "flex", justifyContent: "space-between", paddingBlock: "8px", borderBottom: "1px solid #e0e0e0" }}>
          <span style={{ color: "rgba(0, 0, 0, 0.87)", fontSize: "14px" }}>
            {getTaxHeadLabel(item.taxHeadCode)}
          </span>
          <span style={{ color: "rgba(0, 0, 0, 0.87)", fontSize: "14px", fontWeight: 500 }}>
            {amount.toFixed(2)}
          </span>
        </div>
      );
    });
  };

  if (loading && !billData) {
    return <Loader />;
  }

  const totalAmount = billData?.totalAmount || 0;
  const billDetails = billData?.billDetails?.[0];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 500, color: "rgba(0, 0, 0, 0.87)" }}>
          {t("COMMON_PAY_SCREEN_HEADER")}
        </h2>
        <div style={{ marginTop: "16px" }}>
          <Tag
            type="monochrome"
            label={`${t("PT_PROPERTY_ID")}: ${propertyId}`}
            showIcon={false}
            stroke={true}
          />
        </div>
      </div>

      {/* Payment Collection Details */}
      <Card>
        <CardSectionHeader>
          {t("NOC_PAYMENT_HEAD")}
        </CardSectionHeader>

        {/* Fee Estimate and Total Amount */}
        {/* Fee Estimate */}
        <Card style={{ flex: 1 }} type={"secondary"}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 500, fontSize: "16px" }}>
              {t("NOC_FEE_ESTIMATE_HEADER")}
            </div>
            {/* Total Amount Tag */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "rgba(0, 0, 0, 0.6)" }}>
                {t("TL_COMMON_TOTAL_AMT")}
              </span>
              <Tag
                type="success"
                label={`₹ ${totalAmount.toFixed(2)}`}
                showIcon={false}
              />
            </div>
          </div>
          {renderTaxBreakup()}
          {/* Total Amount */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", marginTop: "8px", borderTop: "2px solid #d6d5d5", fontWeight: 600 }}>
            <span style={{ fontSize: "16px" }}>{t("TL_COMMON_TOTAL_AMT")}</span>
            <span style={{ fontSize: "16px" }}>{totalAmount.toFixed(2)}</span>
          </div>
        </Card>


        {/* Arrears Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Button
            label={`${showArrears ? t("CS_HIDE_ARREARS_CARD") : t("CS_SHOW_ARREARS_CARD")}`}
            variation="link"
            onClick={() => setShowArrears(!showArrears)}
          />
          {showArrears && (
            <Card type={"secondary"}>
              <CardText style={{ fontWeight: 500, margin: "0px" }}>
                {t("CS_ARREARS_DETAILS")}
              </CardText>
              {renderArrearsDetails()}
            </Card>
          )}
        </div>

        {/* Amount to be Paid */}
        <Card type={"secondary"}>
          <CardText style={{ fontWeight: 600, marginBottom: "12px", fontSize: "16px", margin: "0px" }}>
            {t("AMOUNT_TO_BE_PAID")}
          </CardText>

          <RadioButtons
            options={[
              { label: t("PT_FULL_AMOUNT"), value: "full_amount" },
              { label: t("PAY_CUSTOM_AMOUNT"), value: "partial_amount" }
            ]}
            selectedOption={paymentType}
            onSelect={handlePaymentTypeChange}
            optionsKey="label"
            alignVertical={true}
            style={{ display: "flex", gap: "8px", margin: "0px" }}
          />

          <LabelFieldPair style={{ marginBottom: "16px" }}>
            <HeaderComponent className="label" style={{ margin: "0rem" }}>
              <div className={`label-container`}>
                <label className={`label-styles`}>
                  {t("PT_AMOUNT_TO_PAY")} (Rs)
                </label>
                <div style={{ color: "#B91900" }}>{" * "}</div>
              </div>
            </HeaderComponent>
            <div className="digit-field">
              <TextInput
                t={t}
                value={paymentData.amountToPay}
                onChange={(e) => handleInputChange("amountToPay", e.target.value)}
                type="number"
                disabled={paymentType === "full_amount"}
              />
            </div>
          </LabelFieldPair>
        </Card>

        {/* Capture Payment */}
        <Card type={"secondary"}>
          <CardText style={{ fontWeight: 600, margin: "0px", fontSize: "16px" }}>
            {t("NOC_PAYMENT_CAP_PMT")}
          </CardText>

          {/* Payment Mode Tabs */}
          <Tab
            configNavItems={paymentModeTabItems}
            configItemKey="code"
            configDisplayKey="name"
            activeLink={paymentMode}
            setActiveLink={handlePaymentModeChange}
            showNav={true}
          >
            <Card>
              <LabelFieldPair style={{ marginBottom: "16px" }}>
                <HeaderComponent className="label" style={{ margin: "0rem" }}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {t("NOC_PAYMENT_PAID_BY_LABEL")}
                    </label>
                    <div style={{ color: "#B91900" }}>{" * "}</div>
                  </div>
                </HeaderComponent>
                <Dropdown
                  t={t}
                  option={paidByOptions}
                  selected={paymentData.paidBy}
                  select={(value) => handleInputChange("paidBy", value)}
                  optionKey="name"
                  placeholder={t("PT_COMMON_SELECT_PLACEHOLDER")}
                />
              </LabelFieldPair>

              <LabelFieldPair style={{ marginBottom: "16px" }}>
                <HeaderComponent className="label" style={{ margin: "0rem" }}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {t("NOC_PAYMENT_PAYER_NAME_LABEL")}
                    </label>
                    <div style={{ color: "#B91900" }}>{" * "}</div>
                  </div>
                </HeaderComponent>
                <div className="digit-field">
                  <TextInput
                    t={t}
                    value={paymentData.payerName}
                    onChange={(e) => handleInputChange("payerName", e.target.value)}
                  />
                </div>
              </LabelFieldPair>

              <LabelFieldPair style={{ marginBottom: "16px" }}>
                <HeaderComponent className="label" style={{ margin: "0rem" }}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {t("NOC_PAYMENT_PAYER_MOB_LABEL")}
                    </label>
                    <div style={{ color: "#B91900" }}>{" * "}</div>
                  </div>
                </HeaderComponent>
                <div className="digit-field">
                  <TextInput
                    t={t}
                    value={paymentData.payerMobile}
                    onChange={(e) => handleInputChange("payerMobile", e.target.value)}
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength={10}
                  />
                </div>

              </LabelFieldPair>

              {/* Payment Mode Specific Fields */}
              {renderPaymentModeFields()}
            </Card>
          </Tab>

          {/* G8 Receipt Details */}
          <div style={{ borderTop: "1px solid #d6d5d4" }}>
            <CardText style={{ fontWeight: 600, marginBottom: "16px", fontSize: "16px" }}>
              {t("NOC_PAYMENT_RCPT_DETAILS")}
            </CardText>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_RCPT_NO_LABEL")}
                  </label>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.g8ReceiptNo}
                  onChange={(e) => handleInputChange("g8ReceiptNo", e.target.value)}
                  placeholder={t("NOC_PAYMENT_RCPT_NO_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>

            <LabelFieldPair style={{ marginBottom: "16px" }}>
              <HeaderComponent className="label" style={{ margin: "0rem" }}>
                <div className={`label-container`}>
                  <label className={`label-styles`}>
                    {t("NOC_PAYMENT_RECEIPT_ISSUE_DATE_LABEL")}
                  </label>
                </div>
              </HeaderComponent>
              <div className="digit-field">
                <TextInput
                  t={t}
                  value={paymentData.g8ReceiptDate}
                  onChange={(e) => handleInputChange("g8ReceiptDate", e.target.value)}
                  type="date"
                  placeholder={t("NOC_PAYMENT_RECEIPT_ISSUE_DATE_PLACEHOLDER")}
                />
              </div>

            </LabelFieldPair>
          </div>
        </Card>
      </Card>

      {/* Footer */}
      <Footer
        actionFields={[
          <Button
            icon="ArrowForward"
            isSuffix
            label={t("COMMON_GENERATE_RECEIPT")}
            onClick={handlePaymentSubmit}
            type="button"
            isDisabled={loading}
          />
        ]}
        setactionFieldsToRight
      />

      {loading && <Loader />}
      {toast && (
        <Toast
          label={toast.label}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PaymentCollection;
