import React, { useEffect, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { PanelCard, Button, Footer, Tag, Loader, Toast } from "@egovernments/digit-ui-components";

const PaymentAcknowledgement = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const status = queryParams.get("status") || "success";
  const consumerCode = queryParams.get("consumerCode") || queryParams.get("propertyId");
  const tenantId = queryParams.get("tenantId");
  const receiptNumber = queryParams.get("receiptNumber");
  const businessService = queryParams.get("businessService") || "PT";

  const isSuccess = status === "success";
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const downloadReceiptFromFilestoreID = async (fileStoreId, mode = "download") => {
    try {
      // Get file URL from filestore
      const fileUrl = await Digit.UploadServices.Filefetch([fileStoreId], tenantId);

      if (fileUrl && fileUrl.data && fileUrl.data[fileStoreId]) {
        const pdfUrl = fileUrl.data[fileStoreId];

        if (mode === "download") {
          // Download the file
          window.open(pdfUrl, "_blank");
        } else if (mode === "print") {
          // Open in new window and trigger print
          const printWindow = window.open(pdfUrl, "_blank");
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.print();
            };
          }
        }
      }
    } catch (error) {
      console.error("Error accessing file from filestore:", error);
      throw error;
    }
  };

  const handleDownloadReceipt = async () => {
    if (!receiptNumber || !tenantId) {
      console.error("Missing receipt number or tenant ID");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Fetch payment details from collection service
      // Note: For employees, we need to use the business service in the path
      const paymentSearchResponse = await Digit.CustomService.getResponse({
        url: `/collection-services/payments/${businessService}/_search`,
        method: "POST",
        body: {},
        params: {
          receiptNumbers: receiptNumber,
          tenantId: tenantId
        }
      });

      if (paymentSearchResponse?.Payments && paymentSearchResponse.Payments.length > 0) {
        const payment = paymentSearchResponse.Payments[0];

        // Step 2: Get fileStoreId from payment details
        // Check in paymentDetails first, then payment level
        let fileStoreId = payment.fileStoreId;
        if (!fileStoreId && payment.paymentDetails && payment.paymentDetails.length > 0) {
          fileStoreId = payment.paymentDetails[0].fileStoreId;
        }

        if (fileStoreId) {
          // Step 3: Fetch file URL from filestore and download
          await downloadReceiptFromFilestoreID(fileStoreId, "download");
        } else {
          // If no fileStoreId, generate receipt PDF via pdf-service
          try {
            const pdfResponse = await Digit.CustomService.getResponse({
              url: "/pdf-service/v1/_create",
              useCache: false,
              method: "POST",
              params: {
                tenantId: tenantId,
                key: "property-receipt"
              },
              body: {
                Payments: [payment]
              },
              config: {
                responseType: 'arraybuffer'
              }
            });

            if (pdfResponse?.filestoreIds && pdfResponse.filestoreIds.length > 0) {
              // Download the generated receipt
              await downloadReceiptFromFilestoreID(pdfResponse.filestoreIds[0], "download");
            } else {
              setToast({
                label: t("PT_RECEIPT_GENERATION_FAILED") || "Failed to generate receipt.",
                type: "error"
              });
            }
          } catch (pdfError) {
            console.error("PDF generation error:", pdfError);
            setToast({
              label: t("PT_RECEIPT_GENERATION_FAILED") || "Failed to generate receipt.",
              type: "error"
            });
          }
        }
      } else {
        setToast({
          label: t("PT_PAYMENT_NOT_FOUND") || "Payment details not found.",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error downloading receipt:", error);
      setToast({
        label: t("PT_RECEIPT_DOWNLOAD_ERROR") || "Error downloading receipt. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = async () => {
    if (!receiptNumber || !tenantId) {
      console.error("Missing receipt number or tenant ID");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Fetch payment details from collection service
      // Note: For employees, we need to use the business service in the path
      const paymentSearchResponse = await Digit.CustomService.getResponse({
        url: `/collection-services/payments/${businessService}/_search`,
        method: "POST",
        body: {},
        params: {
          receiptNumbers: receiptNumber,
          tenantId: tenantId
        }
      });

      if (paymentSearchResponse?.Payments && paymentSearchResponse.Payments.length > 0) {
        const payment = paymentSearchResponse.Payments[0];

        // Step 2: Get fileStoreId from payment details
        // Check in paymentDetails first, then payment level
        let fileStoreId = payment.fileStoreId;
        if (!fileStoreId && payment.paymentDetails && payment.paymentDetails.length > 0) {
          fileStoreId = payment.paymentDetails[0].fileStoreId;
        }

        if (fileStoreId) {
          // Step 3: Fetch file URL from filestore and print
          await downloadReceiptFromFilestoreID(fileStoreId, "print");
        } else {
          // If no fileStoreId, generate receipt PDF via pdf-service
          try {
            const pdfResponse = await Digit.CustomService.getResponse({
              url: "/pdf-service/v1/_create",
              useCache: false,
              method: "POST",
              params: {
                tenantId: tenantId,
                key: "property-receipt"
              },
              body: {
                Payments: [payment]
              },
              config: {
                responseType: 'arraybuffer'
              }
            });

            if (pdfResponse?.filestoreIds && pdfResponse.filestoreIds.length > 0) {
              // Print the generated receipt
              await downloadReceiptFromFilestoreID(pdfResponse.filestoreIds[0], "print");
            } else {
              setToast({
                label: t("PT_RECEIPT_GENERATION_FAILED") || "Failed to generate receipt.",
                type: "error"
              });
            }
          } catch (pdfError) {
            console.error("PDF generation error:", pdfError);
            setToast({
              label: t("PT_RECEIPT_GENERATION_FAILED") || "Failed to generate receipt.",
              type: "error"
            });
          }
        }
      } else {
        setToast({
          label: t("PT_PAYMENT_NOT_FOUND") || "Payment details not found.",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error printing receipt:", error);
      setToast({
        label: t("PT_RECEIPT_PRINT_ERROR") || "Error printing receipt. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    history.push(`/${window.contextPath}/employee`);
  };

  const handleViewProperty = () => {
    if (consumerCode && tenantId) {
      history.push(`/${window.contextPath}/employee/pt/property/${consumerCode}?tenantId=${tenantId}`);
    }
  };

  const handleRetry = () => {
    if (consumerCode && tenantId) {
      history.push(`/${window.contextPath}/employee/pt/payment/${consumerCode}?tenantId=${tenantId}`);
    }
  };

  const getSuccessMessage = () => {
    return t(`EMPLOYEE_SUCCESS_${businessService}_PAYMENT_MESSAGE`) || t("PT_PAYMENT_SUCCESS");
  };

  const getSuccessDetail = () => {
    return t(`EMPLOYEE_SUCCESS_${businessService}_PAYMENT_MESSAGE_DETAIL`) || t("PT_PAYMENT_SUCCESS_DETAIL");
  };

  const getFailureMessage = () => {
    return t(`EMPLOYEE_FAILURE_${businessService}_PAYMENT_MESSAGE`) || t("PT_PAYMENT_FAILED");
  };

  const getFailureDetail = () => {
    return t(`EMPLOYEE_FAILURE_${businessService}_PAYMENT_MESSAGE_DETAIL`) || t("PT_PAYMENT_FAILED_DETAIL");
  };

  const getReceiptLabel = () => {
    return t(`EMPLOYEE_SUCCESS_${businessService}_PAYMENT_RECEIPT_NO`) || t("PT_RECEIPT_NUMBER");
  };

  return (
    <>
      {loading && <Loader />}
      <PanelCard
        type={isSuccess ? "success" : "error"}
        message={isSuccess ? getSuccessMessage() : getFailureMessage()}
        info={isSuccess ? getReceiptLabel() : ""}
        response={isSuccess ? receiptNumber : ""}
        footerChildren={
          isSuccess ? (
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <Tag
                type="monochrome"
                label={`${t("PT_PROPERTY_ID")}: ${consumerCode}`}
                showIcon={true}
                stroke={true}
              />
              <Tag
                type="monochrome"
                label={`${t("TENANT_ID")}: ${tenantId}`}
                showIcon={true}
                stroke={true}
              />
            </div>
          ) : null
        }
      >
        <div style={{ marginTop: "16px", color: "rgba(0, 0, 0, 0.6)", fontSize: "16px" }}>
          {isSuccess ? getSuccessDetail() : getFailureDetail()}
        </div>
      </PanelCard>

      <Footer
        setactionFieldsToRight={true}
        actionFields={
          isSuccess
            ? [
              <Button
                key="go-home"
                label={t("CORE_COMMON_GO_TO_HOME")}
                variation="secondary"
                onClick={handleGoHome}
              />,
              <Button
                key="view-property"
                label={t("PT_VIEW_PROPERTY")}
                variation="primary"
                onClick={handleViewProperty}
              />,
              <Button
                label={t("COMMON_DOWNLOAD_RECEIPT")}
                variation="secondary"
                onClick={handleDownloadReceipt}
                isDisabled={loading}
              />,
              <Button
                label={t("COMMON_PRINT_RECEIPT")}
                variation="secondary"
                onClick={handlePrintReceipt}
                isDisabled={loading}
              />
            ]
            : [
              <Button
                key="go-home"
                label={t("CORE_COMMON_GO_TO_HOME")}
                variation="secondary"
                onClick={handleGoHome}
              />,
              <Button
                key="retry"
                label={t("COMMON_RETRY")}
                variation="primary"
                onClick={handleRetry}
              />
            ]
        }
      />

      {toast && (
        <Toast
          label={toast.label}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default PaymentAcknowledgement;
