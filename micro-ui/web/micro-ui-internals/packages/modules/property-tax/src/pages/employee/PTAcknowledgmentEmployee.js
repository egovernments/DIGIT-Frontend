import React, { useEffect, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { PanelCard, Button, Footer, Tag } from "@egovernments/digit-ui-components";

const PTAcknowledgmentEmployee = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const purpose = queryParams.get("purpose");
  const status = queryParams.get("status");
  const propertyId = queryParams.get("propertyId");
  const tenantId = queryParams.get("tenantId");
  const acknowldgementNumber = queryParams.get("secondNumber");
  const isSuccess = status === "success";
  const handleViewProperty = () => {
    history.push(`/${window.contextPath}/employee/pt/property/${propertyId}?tenantId=${tenantId}`);
  };

  const handleProceedToPayment = () => {
    // Navigate to payment page
    history.push(`/${window.contextPath}/employee/pt/payment/${propertyId}?tenantId=${tenantId}`);
  };

  const handleGoHome = () => {
    history.push(`/${window.contextPath}/employee`);
  };

  // Get appropriate labels based on purpose
  const getSuccessMessage = () => {
    if (purpose === "create") return t("PT_PROPERTY_REGISTRATION_SUCCESS");
    if (purpose === "reassess") return t("PT_PROPERTY_REASSESS_SUCCESS");
    return t("PT_PROPERTY_UPDATE_SUCCESS");
  };

  const getErrorMessage = () => {
    if (purpose === "create") return t("PT_PROPERTY_REGISTRATION_ERROR");
    if (purpose === "reassess") return t("PT_PROPERTY_REASSESS_ERROR");
    return t("PT_PROPERTY_UPDATE_ERROR");
  };

  const getInfoLabel = () => {
    if (purpose === "reassess") return t("PT_ASSESSMENT_NUMBER");
    return t("PT_ACKNOWLEDGEMENT_NUMBER");
  };

  return (
    <>
      <PanelCard
        type={isSuccess ? "success" : "error"}
        message={isSuccess ? getSuccessMessage() : getErrorMessage()}
        info={isSuccess ? getInfoLabel() : ""}
        response={acknowldgementNumber}
      >
        <Tag
          type={"monochrome"}
          label={`${t("PT_PROPERTY_ID")}: ${propertyId}`}
          showIcon={true}
          stroke={true}
        />
      </PanelCard>
      <Footer
        setactionFieldsToRight={true}
        actionFields={[
          <Button
            key="go-home"
            label={t("CORE_COMMON_GO_TO_HOME")}
            variation="secondary"
            onClick={handleGoHome}
          />,
          <Button
            key="view-property"
            label={t("PT_VIEW_PROPERTY")}
            variation={purpose === "reassess" && isSuccess ? "secondary" : "primary"}
            onClick={handleViewProperty}
          />,
          // Show "Proceed to payment" button only for successful reassessment
          ...(purpose === "reassess" && isSuccess ? [
            <Button
              key="proceed-payment"
              label={t("PT_PROCEED_TO_PAYMENT")}
              variation="primary"
              onClick={handleProceedToPayment}
            />
          ] : [])
        ]}
      />
    </>
  );
};

export default PTAcknowledgmentEmployee;
