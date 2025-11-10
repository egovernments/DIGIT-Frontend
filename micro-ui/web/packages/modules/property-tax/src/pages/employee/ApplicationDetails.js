import React, { useState, useEffect } from "react";
import {
  Card,
  Loader,
  Toast,
  Button,
  Tag,
  HeaderComponent,
  SummaryCard,
  Footer,
  Accordion,
  AccordionList
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useParams, useLocation, useHistory } from "react-router-dom";

const ApplicationDetails = () => {
  const { t } = useTranslation();
  const { applicationNo } = useParams();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const tenantId = searchParams.get('tenantId') || Digit?.ULBService?.getCurrentTenantId();

  const [applicationData, setApplicationData] = useState(null);
  const [toast, setToast] = useState(null);
  const [workflowHistory, setWorkflowHistory] = useState([]);

  // API hook for fetching application details by acknowledgment number
  const { isLoading, data: applicationResponse, error } = applicationNo && tenantId
    ? Digit.Hooks.useCustomAPIHook({
      url: "/property-services/property/_search",
      params: {
        tenantId,
        acknowldgementNumbers: applicationNo,
        audit: true
      },
      config: {
        enabled: !!(applicationNo && tenantId),
        select: (data) => data?.Properties || [],
      },
    })
    : { isLoading: false, data: null, error: null };

  // API hook for fetching workflow history
  const { data: workflowResponse } = applicationNo && tenantId
    ? Digit.Hooks.useCustomAPIHook({
      url: "/egov-workflow-v2/egov-wf/process/_search",
      params: {
        tenantId,
        businessIds: applicationNo
      },
      config: {
        enabled: !!(applicationNo && tenantId),
        select: (data) => data?.ProcessInstances || [],
      },
    })
    : { data: null };

  useEffect(() => {
    if (applicationResponse && applicationResponse.length > 0) {
      const application = applicationResponse[0];
      const owners = application.owners || [];
      const address = application.address || {};
      const propertyDetails = application.propertyDetails?.[0] || {};

      const formattedApplicationData = {
        applicationNumber: application.acknowldgementNumber,
        propertyId: application.propertyId,
        oldPropertyId: application.oldPropertyId,
        applicationDate: application.auditDetails?.createdTime,
        status: application.status,
        creationReason: application.creationReason,
        tenantId: application.tenantId,
        address: {
          doorNo: address.doorNo,
          buildingName: address.buildingName,
          street: address.street,
          locality: address.locality?.name || address.locality,
          city: address.city,
          pincode: address.pincode
        },
        propertyDetails: {
          propertyType: propertyDetails.propertyType,
          propertySubType: propertyDetails.propertySubType,
          usageCategoryMajor: propertyDetails.usageCategoryMajor,
          usageCategoryMinor: propertyDetails.usageCategoryMinor,
          landArea: propertyDetails.landArea,
          noOfFloors: propertyDetails.noOfFloors,
          yearOfConstruction: propertyDetails.additionalDetails?.yearOfConstruction
        },
        owners: owners.map(owner => ({
          name: owner.name,
          fatherOrHusbandName: owner.fatherOrHusbandName,
          mobileNumber: owner.mobileNumber,
          emailId: owner.emailId,
          ownerType: owner.ownerType,
          ownershipPercentage: owner.ownershipPercentage,
          status: owner.status
        })),
        documents: owners.flatMap(owner => owner.documents || [])
      };

      setApplicationData(formattedApplicationData);
    }
  }, [applicationResponse]);

  useEffect(() => {
    if (workflowResponse && workflowResponse.length > 0) {
      const processInstance = workflowResponse[0];
      const history = processInstance.state?.auditDetails || [];
      setWorkflowHistory(history);
    }
  }, [workflowResponse]);

  const handleBack = () => {
    history.goBack();
  };

  const handleViewProperty = () => {
    if (applicationData?.propertyId) {
      history.push(`/${window.contextPath}/employee/pt/property/${applicationData.propertyId}?tenantId=${tenantId}`);
    }
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

  const formatDate = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleDateString() : t("ES_COMMON_NA");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !applicationData) {
    return (
      <div>
        <HeaderComponent>{t("PT_APPLICATION_DETAILS")}</HeaderComponent>
        <div className="error-message">{t("PT_APPLICATION_NOT_FOUND")}</div>
      </div>
    );
  }

  const textStyles = {
    color: "#0B4B66",
    fontWeight: "700",
    fontSize: "32px",
    marginBottom: "1.5rem"
  };

  return (
    <div>
      {/* Header Section */}
      <HeaderComponent styles={textStyles}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
            <div styles={textStyles}>{t("PT_APPLICATION_DETAILS")}</div>
            <Tag
              type={"monochrome"}
              label={`${t("PT_APPLICATION_NO")}: ${applicationNo}`}
              showIcon={true}
            />
          </div>
        </div>
      </HeaderComponent>

      {/* Application Status */}
      <Card style={{ marginBottom: "1rem", padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#0B4B66" }}>
              {t("PT_APPLICATION_STATUS")}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Tag
                type={getStatusType(applicationData.status)}
                label={applicationData.status || t("ES_COMMON_NA")}
                showIcon={true}
              />
              <div style={{ color: "#666" }}>
                {t("PT_APPLIED_ON")}: {formatDate(applicationData.applicationDate)}
              </div>
            </div>
          </div>
          {applicationData.propertyId && (
            <Button
              label={t("PT_VIEW_PROPERTY")}
              variation="secondary"
              onClick={handleViewProperty}
            />
          )}
        </div>
      </Card>

      {/* Application Information */}
      <SummaryCard
        header={t("PT_APPLICATION_INFORMATION")}
        type="primary"
        layout={2}
        style={{ marginBottom: "1rem" }}
        sections={[
          {
            cardType: 'primary',
            header: t("PT_APPLICATION_DETAILS"),
            fieldPairs: [
              {
                inline: true,
                label: t("PT_APPLICATION_NO"),
                value: applicationData.applicationNumber || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: "PT_PROPERTY_ID",
                value: applicationData.propertyId || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_OLD_PROPERTY_ID"),
                value: applicationData.oldPropertyId || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_APPLICATION_TYPE"),
                value: applicationData.creationReason || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_APPLICATION_DATE"),
                value: formatDate(applicationData.applicationDate)
              },
              {
                inline: true,
                label: t("PT_TENANT_ID"),
                value: applicationData.tenantId || t("ES_COMMON_NA")
              }
            ]
          }
        ]}
      />

      {/* Property Address */}
      <SummaryCard
        header={t("PT_PROPERTY_ADDRESS")}
        type="primary"
        layout={2}
        style={{ marginBottom: "1rem" }}
        sections={[
          {
            cardType: 'primary',
            header: t("PT_ADDRESS_DETAILS"),
            fieldPairs: [
              {
                inline: true,
                label: t("PT_HOUSE_DOOR_NO"),
                value: applicationData.address.doorNo || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_BUILDING_NAME"),
                value: applicationData.address.buildingName || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_STREET_NAME"),
                value: applicationData.address.street || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_LOCALITY"),
                value: applicationData.address.locality || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_CITY"),
                value: applicationData.address.city || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PINCODE"),
                value: applicationData.address.pincode || t("ES_COMMON_NA")
              }
            ]
          }
        ]}
      />

      {/* Property Details */}
      <SummaryCard
        header={t("PT_PROPERTY_DETAILS")}
        type="primary"
        layout={2}
        style={{ marginBottom: "1rem" }}
        sections={[
          {
            cardType: 'primary',
            header: t("PT_PROPERTY_INFORMATION"),
            fieldPairs: [
              {
                inline: true,
                label: t("PT_PROPERTY_TYPE"),
                value: applicationData.propertyDetails.propertyType || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PROPERTY_SUB_TYPE"),
                value: applicationData.propertyDetails.propertySubType || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_USAGE_CATEGORY_MAJOR"),
                value: applicationData.propertyDetails.usageCategoryMajor || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_USAGE_CATEGORY_MINOR"),
                value: applicationData.propertyDetails.usageCategoryMinor || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_LAND_AREA"),
                value: applicationData.propertyDetails.landArea ? `${applicationData.propertyDetails.landArea} sq yards` : t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_NO_OF_FLOORS"),
                value: applicationData.propertyDetails.noOfFloors || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_YEAR_OF_CONSTRUCTION"),
                value: applicationData.propertyDetails.yearOfConstruction || t("ES_COMMON_NA")
              }
            ]
          }
        ]}
      />

      {/* Owner Details */}
      <SummaryCard
        header={t("PT_OWNER_DETAILS")}
        type="primary"
        layout={2}
        style={{ marginBottom: "1rem" }}
        sections={
          applicationData.owners && applicationData.owners.length > 0
            ? applicationData.owners.map((owner, index) => ({
              cardType: 'primary',
              header: `${t("PT_OWNER")} ${index + 1}`,
              fieldPairs: [
                {
                  inline: true,
                  label: t("PT_OWNER_NAME"),
                  value: owner.name || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_FATHER_HUSBAND_NAME"),
                  value: owner.fatherOrHusbandName || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_MOBILE_NUMBER"),
                  value: owner.mobileNumber || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_EMAIL_ID"),
                  value: owner.emailId || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OWNER_TYPE"),
                  value: owner.ownerType || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OWNERSHIP_PERCENTAGE"),
                  value: owner.ownershipPercentage ? `${owner.ownershipPercentage}%` : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_STATUS"),
                  type: "custom",
                  renderCustomContent: (value) => value,
                  value: (
                    <Tag
                      type={getStatusType(owner.status)}
                      label={owner.status || t("ES_COMMON_NA")}
                      showIcon={true}
                    />
                  )
                }
              ]
            }))
            : [{
              cardType: 'primary',
              header: t("PT_NO_OWNERS_FOUND"),
              fieldPairs: [
                {
                  inline: true,
                  label: t("PT_STATUS"),
                  value: t("ES_COMMON_NA")
                }
              ]
            }]
        }
      />

      <AccordionList>
        {/* Documents */}
        <Accordion
          title={t("PT_DOCUMENTS")}
          icon=""
          number=""
          onToggle={() => { }}
          style={{ marginBottom: "1rem" }}
          hideCardBorder={false}
          hideDivider={false}
          hideCardBg={false}
          hideBorderRadius={false}
        >
          <div style={{ padding: "1rem" }}>
            {applicationData.documents && applicationData.documents.length > 0 ? (
              applicationData.documents.map((doc, index) => (
                <div key={index} style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: "500" }}>{doc.documentType || t("ES_COMMON_NA")}</div>
                  <div style={{ fontSize: "14px", color: "#666" }}>{doc.fileStoreId || t("ES_COMMON_NA")}</div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                {t("PT_NO_DOCUMENTS_UPLOADED")}
              </div>
            )}
          </div>
        </Accordion>

        {/* Workflow History */}
        <Accordion
          title={t("PT_WORKFLOW_HISTORY")}
          icon=""
          number=""
          onToggle={() => { }}
          style={{ marginBottom: "1rem" }}
          hideCardBorder={false}
          hideDivider={false}
          hideCardBg={false}
          hideBorderRadius={false}
        >
          <div style={{ padding: "1rem" }}>
            {workflowHistory.length > 0 ? (
              workflowHistory.map((step, index) => (
                <div key={index} style={{
                  marginBottom: index < workflowHistory.length - 1 ? "1.5rem" : "0",
                  paddingBottom: index < workflowHistory.length - 1 ? "1.5rem" : "0",
                  borderBottom: index < workflowHistory.length - 1 ? "1px solid #e0e0e0" : "none"
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <span style={{ color: "#666", fontSize: "14px" }}>{t("PT_ACTION")}</span>
                      <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>
                        {step.action || t("ES_COMMON_NA")}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "#666", fontSize: "14px" }}>{t("PT_DATE")}</span>
                      <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>
                        {formatDate(step.createdTime)}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "#666", fontSize: "14px" }}>{t("PT_BY")}</span>
                      <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>
                        {step.createdBy || t("ES_COMMON_NA")}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: "#666", fontSize: "14px" }}>{t("PT_COMMENTS")}</span>
                      <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>
                        {step.comment || t("ES_COMMON_NA")}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                {t("PT_NO_WORKFLOW_HISTORY")}
              </div>
            )}
          </div>
        </Accordion>
      </AccordionList>

      {/* Footer Actions */}
      <Footer
        actionFields={[
          <Button
            key="back"
            label={t("PT_BACK")}
            variation="secondary"
            size="medium"
            onClick={handleBack}
          />
        ]}
        setactionFieldsToRight={false}
      />

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

export default ApplicationDetails;