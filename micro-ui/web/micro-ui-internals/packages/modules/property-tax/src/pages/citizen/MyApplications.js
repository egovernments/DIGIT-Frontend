import React from "react";
import { Loader, HeaderComponent, SummaryCard, Button, Tag } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const MyApplications = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCitizenCurrentTenant(true) || Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser().info;

  // Fetch ALL properties for the logged-in citizen (filtered by mobile number)
  const { isLoading, data: propertyResponse, error } = Digit.Hooks.useCustomAPIHook({
    url: "/property-services/property/_search",
    params: {
      mobileNumber: user?.mobileNumber,
      tenantId: tenantId
    },
    config: {
      enabled: !!user?.mobileNumber,
      select: (data) => {
        const properties = data?.Properties || [];
        // Filter to show only properties created/registered by this user
        // In mono-ui, "My Applications" shows properties where status is INWORKFLOW or has creationReason
        const applications = properties.filter(property =>
          property.status === "INWORKFLOW" ||
          property.creationReason === "CREATE" ||
          property.creationReason === "MUTATION" ||
          property.creationReason === "UPDATE"
        );
        // Sort by creation time descending (newest first)
        return applications.sort((a, b) =>
          (b.auditDetails?.createdTime || 0) - (a.auditDetails?.createdTime || 0)
        );
      },
    },
  });

  const applications = propertyResponse || [];

  // Format address
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

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return t("ES_COMMON_NA");
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const onNewApplicationButtonClick = () => {
    history.push(`/${window.contextPath}/citizen/pt/assessment-form`);
  };

  const onViewDetailsClick = (application) => {
    // Navigate to Application Preview (reusing employee component)
    // Note: ApplicationPreview expects 'applicationNumber' query param and 'type' param
    // Type is 'property' for property applications and 'assessment' for assessment applications
    const applicationType = application.creationReason === "REASSESSMENT" ? "assessment" : "property";

    history.push(
      `/${window.contextPath}/citizen/pt/application-preview?propertyId=${application.propertyId}&tenantId=${application.tenantId}&applicationNumber=${application.acknowldgementNumber}&type=${applicationType}`
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div style={{ padding: "1rem" }}>
        <HeaderComponent>{t("PT_MY_APPLICATIONS_HEADER")}</HeaderComponent>
        <div style={{ color: "red", padding: "1rem" }}>
          {t("PT_ERROR_FETCHING_APPLICATIONS")}
        </div>
      </div>
    );
  }

  const textStyles = {
    color: "#0B4B66",
    fontWeight: "700",
    fontSize: "32px",
    marginBottom: "1.5rem"
  };

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

  const getCreationReasonLabel = (creationReason) => {
    switch (creationReason) {
      case "CREATE":
        return t("PT_NEW_PROPERTY");
      case "MUTATION":
        return t("PT_MUTATION");
      case "UPDATE":
        return t("PT_UPDATE_PROPERTY");
      case "REASSESSMENT":
        return t("PT_REASSESSMENT");
      default:
        return creationReason || t("ES_COMMON_NA");
    }
  };

  return (
    <React.Fragment>
      <HeaderComponent styles={textStyles}>
        {`${t("PT_MY_APPLICATIONS_HEADER")} ${applications.length > 0 ? `(${applications.length})` : ""}`}
      </HeaderComponent>

      <div>
        {applications.length > 0 ? (
          applications.map((application, index) => (
            <SummaryCard
              key={index}
              header={formatAddress(application.address) || t("ES_COMMON_NA")}
              type="primary"
              style={{ marginBottom: "1rem", cursor: "pointer" }}
              sections={[
                {
                  cardType: 'primary',
                  fieldPairs: [
                    {
                      inline: true,
                      label: t("PT_APPLICATION_NUMBER"),
                      value: application.acknowldgementNumber || t("ES_COMMON_NA")
                    },
                    {
                      inline: true,
                      label: t("PT_UNIQUE_PROPERTY_ID"),
                      value: application.propertyId || t("ES_COMMON_NA")
                    },
                    {
                      inline: true,
                      label: t("PT_APPLICATION_TYPE"),
                      value: getCreationReasonLabel(application.creationReason)
                    },
                    {
                      inline: true,
                      label: t("PT_APPLICATION_DATE"),
                      value: formatDate(application.auditDetails?.createdTime)
                    },
                    {
                      inline: true,
                      label: t("PT_STATUS"),
                      type: "custom",
                      renderCustomContent: (value) => value,
                      value: (
                        <Tag
                          type={getStatusType(application.status)}
                          label={t(`PT_STATUS_${application.status}`) || application.status || t("ES_COMMON_NA")}
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
                          label={t("PT_VIEW_DETAILS") || "View Details"}
                          variation="link"
                          size="medium"
                          onClick={() => onViewDetailsClick(application)}
                        />
                      )
                    }
                  ]
                }
              ]}
            />
          ))
        ) : (
          // Empty state
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexDirection: "column", padding: "2rem" }}>
            <p style={{ margin: "0px", fontSize: "16px", color: "#505A5F" }}>
              {t("PT_NO_APPLICATIONS_MESSAGE") || "You don't have any property applications yet."}
            </p>
            <Button
              label={t("PT_CREATE_NEW_PROPERTY_BUTTON") || "Create New Property"}
              variation="primary"
              onClick={onNewApplicationButtonClick}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
