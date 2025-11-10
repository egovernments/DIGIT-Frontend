import React from "react";
import { HeaderComponent, Loader, SummaryCard, Button, Tag } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { convertEpochToDate } from "../../utils";

// Bill Card Component
const BillCard = ({ bill }) => {
  const { t } = useTranslation();
  const history = useHistory();

  // Extract bill details
  const consumerCode = bill?.consumerCode;
  const billNumber = bill?.billNumber;
  const billDate = bill?.billDate;
  const totalAmount = bill?.totalAmount;
  const status = bill?.status;

  // Extract owner name from bill's payer info
  const ownerNames = bill?.payerName || t("ES_COMMON_NA");

  // Get bill details for period
  const billDetails = bill?.billDetails?.[0];
  const fromPeriod = billDetails?.fromPeriod;
  const toPeriod = billDetails?.toPeriod;

  // Format bill period
  const billPeriod = fromPeriod && toPeriod
    ? `${convertEpochToDate(fromPeriod)} - ${convertEpochToDate(toPeriod)}`
    : t("ES_COMMON_NA");

  // Status tag type
  const getStatusType = (status) => {
    const upperStatus = status?.toUpperCase();
    if (upperStatus === "ACTIVE" || upperStatus === "PAID") return "success";
    if (upperStatus === "CANCELLED" || upperStatus === "EXPIRED") return "error";
    return "warning";
  };

  // Handle Pay button click
  const handlePayClick = () => {
    history.push(`/digit-ui/citizen/pt/property/${consumerCode}/payment`);
  };

  const fieldPairs = [
    {
      inline: true,
      label: t("PT_TOTAL_AMOUNT_DUE") || t("PT_AMOUNT_DUE"),
      value: `₹ ${totalAmount || 0}`,
      valueStyle: { fontSize: "24px", fontWeight: "700", color: "#0B4B66" }
    },
    {
      inline: true,
      label: t("PT_BILL_NUMBER") || t("PT_BILL_ID"),
      value: billNumber || t("ES_COMMON_NA"),
      valueStyle: { fontWeight: 600 }
    },
    {
      inline: true,
      label: t("PT_SEARCHPROPERTY_TABEL_PID") || t("PT_PROPERTY_ID"),
      value: consumerCode || t("ES_COMMON_NA"),
      valueStyle: { fontWeight: 600 }
    },
    {
      inline: true,
      label: t("PT_OWNERS_NAME"),
      value: ownerNames
    },
    {
      inline: true,
      label: t("PT_BILL_DATE") || t("PT_GENERATION_DATE"),
      value: convertEpochToDate(billDate) || t("ES_COMMON_NA")
    },
    {
      inline: true,
      label: t("PT_BILL_PERIOD") || t("PT_ASSESSMENT_YEAR"),
      value: billPeriod
    },
    {
      inline: true,
      label: t("PT_STATUS"),
      type: "custom",
      renderCustomContent: (value) => value,
      value: (
        <Tag
          type={getStatusType(status)}
          label={t(`PT_BILL_STATUS_${status}`) || status || t("ES_COMMON_NA")}
          showIcon={true}
        />
      )
    }
  ];

  // Add Pay button if bill is active/unpaid
  if (status?.toUpperCase() === "ACTIVE" && consumerCode) {
    fieldPairs.push({
      inline: true,
      label: null,
      type: "custom",
      renderCustomContent: (value) => value,
      value: (
        <Button
          label={t("PT_PAY_NOW") || "Pay Now"}
          variation="primary"
          size="medium"
          onClick={handlePayClick}
        />
      )
    });
  }

  return (
    <SummaryCard
      header={`${t("PT_BILL_NUMBER")}: ${billNumber || t("ES_COMMON_NA")}`}
      type="primary"
      style={{ marginBottom: "1rem" }}
      sections={[
        {
          cardType: 'primary',
          fieldPairs: fieldPairs
        }
      ]}
    />
  );
};

// Main MyBills Component
export const PTMyBills = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getStateId();
  const user = Digit.UserService.getUser();
  const mobileNumber = user?.info?.mobileNumber;

  // Fetch bills using _fetchbill endpoint with mobileNumber (matches mono-ui)
  const { isLoading, data: billsResponse } = Digit.Hooks.useCustomAPIHook({
    url: "/billing-service/bill/v2/_fetchbill",
    params: {
      tenantId: tenantId,
      mobileNumber: mobileNumber,
      businessService: "PT"
    },
    body: {
      RequestInfo: {
        authToken: user?.access_token,
      }
    },
    config: {
      enabled: !!mobileNumber,
      select: (data) => {
        return data?.Bill || [];
      },
    },
  });

  const billsList = billsResponse || [];

  if (isLoading) {
    return <Loader />;
  }

  const textStyles = {
    color: "#0B4B66",
    fontWeight: "700",
    fontSize: "32px",
    marginBottom: "1.5rem"
  };

  return (
    <React.Fragment>
      <HeaderComponent styles={textStyles}>
        {`${t("PT_MY_BILLS_HEADER") || t("CS_TITLE_MY_RECEIPTS")} ${billsList.length > 0 ? `(${billsList.length})` : ""}`}
      </HeaderComponent>
      <div>
        {billsList.length > 0 ? (
          billsList.map((bill, index) => (
            <div key={index}>
              <BillCard bill={bill} />
            </div>
          ))
        ) : (
          <p style={{ marginLeft: "16px", marginTop: "16px" }}>
            {t("PT_NO_BILLS_FOUND") || t("PT_NO_RECEIPTS_FOUND_MSG")}
          </p>
        )}
      </div>
    </React.Fragment>
  );
};
