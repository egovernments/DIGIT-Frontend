import React from "react";
import { Loader, HeaderComponent, SummaryCard, Button, Tag } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const MyProperties = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCitizenCurrentTenant(true) || Digit.ULBService.getCurrentTenantId();

  // Use useCustomAPIHook to fetch properties - matching mono-ui curl EXACTLY
  // Mono-ui sends NO query parameters, only RequestInfo with authToken in body
  const { isLoading, data: propertyResponse, error } = Digit.Hooks.useCustomAPIHook({
    url: "/property-services/property/_search",
    params: {}, // Empty params to match mono-ui curl exactly
    config: {
      enabled: true,
      select: (data) => {
        const properties = data?.Properties || [];
        // Filter out INACTIVE properties matching mono-ui (line 156)
        // NOTE: Shows ALL properties (both regular and MUTATION) - only excludes INACTIVE
        const activeProperties = properties.filter(property => property.status !== "INACTIVE");
        // Sort by last modified time descending (mono-ui lines 222-226)
        return activeProperties.sort((a, b) =>
          (b.auditDetails?.lastModifiedTime || 0) - (a.auditDetails?.lastModifiedTime || 0)
        );
      },
    },
  });

  const properties = propertyResponse || [];

  // Format address matching mono-ui getCommaSeperatedAddress (line 164)
  const formatAddress = (address) => {
    const parts = [];
    if (address?.doorNo) parts.push(address.doorNo);
    if (address?.buildingName) parts.push(address.buildingName);
    if (address?.street) parts.push(address.street);
    if (address?.locality?.name) {
      parts.push(t(address.locality.name));
    }
    if (address?.city) {
      const cityName = address.city.split('.').pop();
      parts.push(cityName);
    }
    if (address?.pincode) parts.push(address.pincode);
    return parts.filter(Boolean).join(", ");
  };

  const onNewPropertyButtonClick = () => {
    // Match mono-ui navigation (line 90)
    history.push(`/${window.contextPath}/citizen/pt/assessment-form`);
  };

  const onViewDetailsClick = (property) => {
    // Match mono-ui navigation pattern (lines 96-100)
    // Reuse employee PropertyDetails component (it works for both employee and citizen)
    history.push(
      `/${window.contextPath}/citizen/pt/property/${property.propertyId}?tenantId=${property.tenantId}`
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div style={{ padding: "1rem" }}>
        <Header>{t("PT_MY_PROPERTIES_HEADER")}</Header>
        <div style={{ color: "red", padding: "1rem" }}>
          {t("PT_ERROR_FETCHING_PROPERTIES")}
        </div>
      </div>
    );
  }

  const textStyles = {
    color: "#0B4B66",
    fontWeight: "700",
    fontSize: "32px",
    marginBottom: "1.5rem"
  }

  const getStatusType = (status) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
        return "success";
      case "INACTIVE":
      case "REJECTED":
        return "error";
      case "INWORKFLOW":
      case "PENDING":
        return "warning";
      default:
        return "monochrome";
    }
  };


  return (
    <React.Fragment>
      <HeaderComponent styles={textStyles}>
        {`${t("PT_MY_PROPERTIES_HEADER")} ${properties.length > 0 ? `(${properties.length})` : ""}`}
      </HeaderComponent>

      <div>
        {properties.length > 0 ? (
          properties.map((property, index) => (
            <SummaryCard
              key={index}
              header={formatAddress(property.address) || t("ES_COMMON_NA")}
              type="primary"
              style={{ marginBottom: "1rem", cursor: "pointer" }}
              sections={[
                {
                  cardType: 'primary',
                  fieldPairs: [
                    {
                      inline: true,
                      label: t("PT_UNIQUE_PROPERTY_ID"),
                      value: property.propertyId
                    },
                    {
                      inline: true,
                      label: t("PT_STATUS"),
                      type: "custom",
                      renderCustomContent: (value) => value,
                      value: (
                        <Tag
                          type={getStatusType(property.status)}
                          label={property.status || t("ES_COMMON_NA")}
                          showIcon={true}
                        />
                      )
                    },
                    {
                      inline: true,
                      label: null,
                      type: "custom",
                      renderCustomContent: (value) => value,
                      value: (
                        <Button
                            key="view-details"
                            label={t("PT_VIEW_DETAILS") || "View More Details"}
                            variation="link"
                            size="medium"
                            onClick={() => onViewDetailsClick(property)}
                          />
                      )
                    }
                  ]
                }
              ]}
            />
          ))
        ) : (
          // Empty state matching mono-ui BlankAssessment (lines 9-26)
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"24px"}}>
            <p style={{margin:"0px"}}>{t("PT_NO_ASSESSMENT_MESSAGE3")}</p>
              <Button
                label={t("PT_NO_ASSESSMENT_BUTTON")}
                variation="primary"
                onClick={onNewPropertyButtonClick}
              />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
