import React from "react";
import { useTranslation } from "react-i18next";
import { HeaderComponent, Loader, SummaryCard, Button } from "@egovernments/digit-ui-components";
import { convertEpochToDate } from "../../utils";

export const PTMyPayments = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // First API call: Fetch all properties for the logged-in citizen
  const { isLoading: isLoadingProperties, data: propertiesResponse } = Digit.Hooks.useCustomAPIHook({
    url: "/property-services/property/_search",
    params: {
      tenantId: tenantId,
    },
    body: {},
    config: {
      enabled: true,
      select: (data) => data?.Properties || [],
    },
  });

  // Extract property IDs (consumerCodes) from properties
  const properties = propertiesResponse || [];
  const consumerCodes = properties.map((property) => property.propertyId).join(",");

  // Second API call: Fetch payments for those properties
  const { isLoading: isLoadingPayments, data: paymentsResponse } = Digit.Hooks.useCustomAPIHook({
    url: "/collection-services/payments/PT/_search",
    params: {
      tenantId: Digit.ULBService.getCitizenCurrentTenant(),
      consumerCodes: consumerCodes,
    },
    body: {
      RequestInfo: {
        authToken: Digit.UserService.getUser()?.access_token,
      },
    },
    config: {
      enabled: properties.length > 0 && !!consumerCodes,
      select: (data) => {
        const payments = data?.Payments || [];
        return payments.map((payment) => {
          const consumerCode = payment?.paymentDetails?.[0]?.bill?.consumerCode;
          const property = properties.find((prop) => prop.propertyId === consumerCode);
          return {
            ...payment,
            owners: property?.owners || [],
          };
        });
      },
    },
  });

  const isLoading = isLoadingProperties || isLoadingPayments;
  const applicationsList = paymentsResponse || [];

  if (isLoading) {
    return <Loader />;
  }

  const textStyles = {
    color: "#0B4B66",
    fontWeight: "700",
    fontSize: "32px",
    marginBottom: "1.5rem",
  };

  return (
    <React.Fragment>
      <HeaderComponent styles={textStyles}>
        {`${t("PT_MY_PAYMENTS_HEADER")} ${
          applicationsList.length > 0 ? `(${applicationsList.length})` : ""
        }`}
      </HeaderComponent>
      <div>
        {applicationsList.length > 0 ? (
          applicationsList.map((application, index) => (
            <div key={index}>
              <PTPayments application={application} />
            </div>
          ))
        ) : (
          <p style={{ marginLeft: "16px", marginTop: "16px" }}>
            {t("PT_NO_PAYMENTS_FOUND") || t("PT_NO_APPLICATION_FOUND_MSG")}
          </p>
        )}
      </div>
    </React.Fragment>
  );
};

const PTPayments = ({ application }) => {
  const { t } = useTranslation();

  const amountPaid =
    application?.paymentDetails?.[0]?.totalAmountPaid || application?.totalAmountPaid;
  const consumerCode =
    application?.paymentDetails?.[0]?.bill?.consumerCode || application?.consumerCode;
  const receiptDate =
    application?.paymentDetails?.[0]?.receiptDate || application?.transactionDate;
  const receiptNumber = application?.paymentDetails?.[0]?.receiptNumber;
  const ownerNames =
    application?.owners?.map((owner) => owner?.name).filter(Boolean).join(", ") ||
    t("ES_COMMON_NA");

  // Extract fileStoreId from application
  const fileStoreId = application?.fileStoreId || "";

  // Format amount with rupee symbol
  const formattedAmount = `₹ ${amountPaid || 0}`;

  // Download receipt function - matches mono-ui implementation
  const handleDownloadReceipt = async (fileStoreId, consumerCode, tenantId, businessService = "PT") => {
    try {
      tenantId = tenantId ? tenantId : Digit.ULBService.getCurrentTenantId();
      if (fileStoreId) {
        // Download from filestore
        const fileUrl = await Digit.UploadServices.Filefetch([fileStoreId], tenantId);

        if (fileUrl && fileUrl.data && fileUrl.data[fileStoreId]) {
          const downloadUrl = fileUrl.data[fileStoreId];

          // Create temporary link and trigger download
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = `Receipt_${consumerCode}.pdf`;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error("Receipt file URL not found");
          alert(t("PT_RECEIPT_NOT_AVAILABLE") || "Receipt not available for download.");
        }
      } else {
        console.error("Receipt fileStoreId not found in payment");
        alert(
          t("PT_RECEIPT_FILE_NOT_AVAILABLE") ||
            "Receipt file not available. It may not have been generated yet."
        );
      }
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert(t("PT_RECEIPT_DOWNLOAD_ERROR") || "Error downloading receipt. Please try again.");
    }
  };

  const fieldPairs = [
    {
      inline: true,
      label: t("CS_PAYMENT_AMOUNT_PAID_WITHOUT_SYMBOL"),
      value: formattedAmount,
      valueStyle: { fontSize: "24px", fontWeight: "700", color: "#0B4B66" },
    },
    {
      inline: true,
      label: t("PT_SEARCHPROPERTY_TABEL_PID") || t("PT_PROPERTY_ID"),
      value: consumerCode || t("ES_COMMON_NA"),
      valueStyle: { fontWeight: 600 },
    },
    {
      inline: true,
      label: t("PT_OWNERS_NAME"),
      value: ownerNames,
    },
    {
      inline: true,
      label: t("PT_RECEIPT_DATE_LABEL"),
      value: convertEpochToDate(receiptDate) || t("ES_COMMON_NA"),
    },
    {
      inline: true,
      label: t("PT_RECEIPT_NO_LABEL"),
      value: receiptNumber || t("ES_COMMON_NA"),
      valueStyle: { fontWeight: 600 },
    },
  ];

  if (receiptNumber && consumerCode) {
    fieldPairs.push({
      inline: true,
      label: null,
      type: "custom",
      renderCustomContent: (value) => value,
      value: (
        <Button
          label={t("PT_DOWNLOAD_RECEIPT")}
          variation="primary"
          size="medium"
          onClick={() =>
            handleDownloadReceipt(fileStoreId, consumerCode, application?.tenantId, "PT")
          }
        />
      ),
    });
  }

  return (
    <SummaryCard
      header={`${t("PT_RECEIPT_NO_LABEL")}: ${receiptNumber || t("ES_COMMON_NA")}`}
      type="primary"
      style={{ marginBottom: "1.5rem" }}
      sections={[
        {
          cardType: "primary",
          fieldPairs: fieldPairs,
        },
      ]}
    />
  );
};

export default PTMyPayments;
