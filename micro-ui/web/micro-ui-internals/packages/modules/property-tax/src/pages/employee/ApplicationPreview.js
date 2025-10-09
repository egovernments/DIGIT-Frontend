import React, { useState, useEffect, useRef } from "react";
import {
  Loader,
  Toast,
  Button,
  Tag,
  HeaderComponent,
  SummaryCard,
  Footer,
  Accordion
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";

const ApplicationPreview = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const propertyId = searchParams.get('propertyId');
  const applicationNumber = searchParams.get('applicationNumber');
  const tenantId = searchParams.get('tenantId') || Digit?.ULBService?.getCurrentTenantId();
  const applicationType = searchParams.get('type') || 'property';

  const [applicationData, setApplicationData] = useState(null);
  const [toast, setToast] = useState(null);
  const [workflowHistory, setWorkflowHistory] = useState([]);

  // API hook for fetching application details with audit enabled
  const { isLoading, data: applicationResponse, error } = applicationNumber && tenantId
    ? Digit.Hooks.useCustomAPIHook({
      url: "/property-services/property/_search",
      params: {
        tenantId,
        acknowldgementNumbers: applicationNumber,
        audit: true  // Enable audit to get workflow history
      },
      config: {
        enabled: !!(applicationNumber && tenantId),
        select: (data) => data?.Properties || [],
      },
    })
    : { isLoading: false, data: null, error: null };

  // API hook for fetching workflow process details
  const { data: workflowResponse, isLoading: isWorkflowLoading } = applicationNumber && tenantId
    ? Digit.Hooks.useCustomAPIHook({
      url: "/egov-workflow-v2/egov-wf/process/_search",
      params: {
        tenantId,
        businessIds: applicationNumber,
        history:true
      },
      config: {
        enabled: !!(applicationNumber && tenantId),
        select: (data) => {
          return data?.ProcessInstances || [];
        },
      },
    })
    : { data: null, isLoading: false };

  // Process application data
  useEffect(() => {
    if (applicationResponse && applicationResponse.length > 0) {
      const application = applicationResponse[0];
      const owners = application.owners || [];
      const address = application.address || {};
      const propertyDetails = application.propertyDetails?.[0] || {};
      const units = application.units || [];

      const formattedApplicationData = {
        applicationNumber: application.acknowldgementNumber,
        propertyId: application.propertyId,
        oldPropertyId: application.oldPropertyId,
        surveyId: application.surveyId,
        propertyType: application.propertyType,
        usageCategory: application.usageCategory,
        creationReason: application.creationReason,
        status: application.status,
        tenantId: application.tenantId,
        applicationDate: application.auditDetails?.createdTime,
        lastModifiedDate: application.auditDetails?.lastModifiedTime,
        createdBy: application.auditDetails?.createdBy,
        lastModifiedBy: application.auditDetails?.lastModifiedBy,
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
          landArea: application.landArea,
          buildUpArea: propertyDetails.buildUpArea,
          noOfFloors: application.noOfFloors,
          yearOfConstruction: propertyDetails.additionalDetails?.yearOfConstruction,
          vasikaNo: propertyDetails.additionalDetails?.vasikaNo,
          vasikaDate: propertyDetails.additionalDetails?.vasikaDate,
          allotmentNo: propertyDetails.additionalDetails?.allotmentNo,
          allotmentDate: propertyDetails.additionalDetails?.allotmentDate,
          businessName: application.additionalDetails?.businessName,
          remarks: propertyDetails.additionalDetails?.remarks,
          inflammableMaterial: propertyDetails.additionalDetails?.inflammableMaterial,
          heightMoreThan36Feet: propertyDetails.additionalDetails?.heightMoreThan36Feet,
          yearConstruction: propertyDetails?.additionalDetails?.yearConstruction
        },
        owners: owners.map(owner => ({
          name: owner.name,
          fatherOrHusbandName: owner.fatherOrHusbandName,
          relationship: owner.relationship,
          mobileNumber: owner.mobileNumber,
          emailId: owner.emailId,
          ownerType: owner.ownerType,
          ownershipPercentage: owner.ownershipPercentage,
          permanentAddress: owner.permanentAddress,
          correspondenceAddress: owner.correspondenceAddress,
          gender: owner.gender,
          category: owner.category,
          documents: owner.documents,
          status: owner.status
        })),
        units: units.map(unit => ({
          id: unit.id,
          unitType: unit.unitType,
          usageCategory: unit.usageCategory,
          occupancyType: unit.occupancyType,
          occupancyName: unit.occupancyName,
          floorNo: unit.floorNo,
          unitArea: unit.constructionDetail?.builtUpArea || unit.unitArea,
          carpetArea: unit.constructionDetail?.carpetArea,
          builtUpArea: unit.constructionDetail?.builtUpArea,
          constructionType: unit.constructionDetail?.constructionType,
          constructionDate: unit.constructionDetail?.constructionDate,
          arv: unit.arv,
          active: unit.active,
          ...(unit.occupancyType === "RENTED" && {
            totalRentCollected: unit.totalRentCollected,
            monthsOnRent: unit.monthsOnRent,
            usageForPendingMonths: unit.usageForPendingMonths
          }),
        })),
        workflow: application.workflow,
        additionalDetails: application.additionalDetails || {}
      };

      setApplicationData(formattedApplicationData);
    } else if (applicationResponse && applicationResponse.length === 0) {
      setToast({
        label: t("PT_APPLICATION_NOT_FOUND"),
        type: "error"
      });
    }
  }, [applicationResponse, t]);

  // Process workflow history
  useEffect(() => {
    if (workflowResponse && workflowResponse.length > 0) {
      // ProcessInstances array contains the workflow history
      // Map each process instance to display format
      const formattedHistory = workflowResponse.map(processInstance => ({
        date: processInstance.auditDetails?.createdTime
          ? new Date(processInstance.auditDetails.createdTime).toLocaleDateString('en-GB')
          : t("ES_COMMON_NA"),
        updatedBy: processInstance.assigner?.name || t("ES_COMMON_NA"),
        status: `WF_${processInstance.businessService}_${processInstance.state.state}`,
        ulbOfficial: processInstance.assignes?.[0]?.name || t("ES_COMMON_NA"),
        comments: processInstance.comment || t("ES_COMMON_NA")
      }));

      setWorkflowHistory(formattedHistory);
    }
  }, [workflowResponse, t]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching application details:", error);
      setToast({
        label: t("PT_FAILED_TO_FETCH_APPLICATION"),
        type: "error"
      });
    }
  }, [error, t]);

  const handleBack = () => {
    history.goBack();
  };

  const getStatusType = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "error";
      case "INWORKFLOW":
        return "warning";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "monochrome";
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!applicationData) {
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
              label={`${t("PT_APPLICATION_NO")}: ${applicationData.applicationNumber}`}
              showIcon={true}
            />
          </div>
        </div>
      </HeaderComponent>

      {/* Task Status / Workflow History */}
      {workflowHistory && workflowHistory.length > 0 && (
        <Accordion
          title={t("PT_TASK_STATUS")}
          icon=""
          number=""
          onToggle={() => { }}
          customStyles={{ marginBottom: "1rem" }}
          hideCardBorder={false}
          hideDivider={false}
          hideCardBg={false}
          hideBorderRadius={false}
        >
          <SummaryCard
            style={{ padding: "0rem", boxShadow: "none", borderRadius: "0rem" }}
            type="primary"
            layout={1}
            sections={workflowHistory.map((history, index) => ({
              cardType: 'primary',
              header: `${t("PT_TASK")} ${index + 1}`,
              fieldPairs: [
                {
                  inline: true,
                  label: t("PT_DATE"),
                  value: history.date
                },
                {
                  inline: true,
                  label: t("PT_UPDATED_BY"),
                  value: history.updatedBy
                },
                {
                  inline: true,
                  label: t("PT_STATUS"),
                  type: "custom",
                  renderCustomContent: (value) => value,
                  value: (
                    <Tag
                      type={getStatusType(history.status)}
                      label={history.status}
                      showIcon={true}
                    />
                  )
                },
                {
                  inline: true,
                  label: t("PT_ULB_OFFICIAL"),
                  value: history.ulbOfficial
                },
                {
                  inline: true,
                  label: t("PT_COMMENTS"),
                  value: history.comments
                }
              ]
            }))}
          />
        </Accordion>
      )}

      {/* Property Address Information */}
      <SummaryCard
        header={t("PT_PROPERTY_ADDRESS_INFORMATION")}
        type="primary"
        style={{ marginBottom: "1rem" }}
        layout={2}
        sections={[
          {
            cardType: 'primary',
            header: t("PT_PROPERTY_ADDRESS_INFORMATION"),
            fieldPairs: [
              {
                inline: true,
                label: t("PT_CITY"),
                value: applicationData.address.city || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_HOUSE_DOOR_NO"),
                value: applicationData.address.doorNo || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COLONY_BUILDING_NAME"),
                value: applicationData.address.buildingName || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_STREET_NAME"),
                value: applicationData.address.street || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_MOHALLA_LOCALITY"),
                value: applicationData.address.locality || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PINCODE"),
                value: applicationData.address.pincode || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("EXISTING_PROPERTY_ID"),
                value: applicationData.propertyId
              },
              {
                inline: true,
                label: t("PT_SURVEY_ID_UID"),
                value: applicationData.surveyId || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_YEAR_OF_CORRECTION"),
                value: applicationData.propertyDetails.yearConstruction || t("ES_COMMON_NA")
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
                label: t("PT_USAGE_TYPE"),
                value: applicationData.usageCategory || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PROPERTY_TYPE"),
                value: applicationData.propertyDetails.propertyType || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_PLOT_SIZE"),
                value: applicationData.propertyDetails.landArea ?
                  `${applicationData.propertyDetails.landArea} sq yards` :
                  t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_NO_OF_FLOORS"),
                value: applicationData.propertyDetails.noOfFloors || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_VASIKA_NO"),
                value: applicationData.propertyDetails.vasikaNo || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_VASIKA_DATE"),
                value: applicationData.propertyDetails.vasikaDate || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_ALLOTMENT_NO"),
                value: applicationData.propertyDetails.allotmentNo || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_ALLOTMENT_DATE"),
                value: applicationData.propertyDetails.allotmentDate || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_BUSSINESS_NAME"),
                value: applicationData.propertyDetails.businessName || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_REMARKS"),
                value: applicationData.propertyDetails.remarks || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_INFLAMMABLE_MATERIAL_PROPERTY"),
                value: applicationData.propertyDetails.inflammableMaterial || t("ES_COMMON_NA")
              },
              {
                inline: true,
                label: t("PT_COMMON_HEIGHT_OF_PROPERTY"),
                value: applicationData.propertyDetails.heightMoreThan36Feet || t("ES_COMMON_NA")
              }
            ]
          },
          ...(applicationData.units && applicationData.units.length > 0 ?
            applicationData.units.map((unit, index) => ({
              cardType: 'primary',
              header: `${t("PT_UNIT")} ${index + 1}`,
              fieldPairs: [
                {
                  inline: true,
                  label: t("PT_USAGE_CATEGORY"),
                  value: unit.usageCategory || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_UNIT_TYPE"),
                  value: unit.unitType || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OCCUPANCY_TYPE"),
                  value: unit.occupancyType || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OCCUPANCY_NAME"),
                  value: unit.occupancyName || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_FLOOR_NO"),
                  value: unit.floorNo !== null ? unit.floorNo : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_BUILT_UP_AREA"),
                  value: unit.builtUpArea ? `${unit.builtUpArea} sq ft` : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_CARPET_AREA"),
                  value: unit.carpetArea ? `${unit.carpetArea} sq ft` : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_PLINTH_AREA"),
                  value: unit.plinthArea ? `${unit.plinthArea} sq ft` : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_CONSTRUCTION_TYPE"),
                  value: unit.constructionType || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_CONSTRUCTION_DATE"),
                  value: unit.constructionDate ? new Date(unit.constructionDate).toLocaleDateString() : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_ARV"),
                  value: unit.arv ? `₹${unit.arv}` : t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_STATUS"),
                  type: "custom",
                  renderCustomContent: (value) => value,
                  value: (
                    <Tag
                      type={unit.active ? "success" : "error"}
                      label={unit.active ? t("ACTIVE") : t("INACTIVE")}
                      showIcon={true}
                    />
                  )
                },
                // Add rental fields if occupancy is RENTED
                ...(unit.occupancyType === "RENTED" ? [
                  {
                    inline: true,
                    label: t("PT_TOTAL_RENT_COLLECTED"),
                    value: unit.totalRentCollected ? `₹${unit.totalRentCollected}` : t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_MONTHS_ON_RENT"),
                    value: unit.monthsOnRent || t("ES_COMMON_NA")
                  },
                  {
                    inline: true,
                    label: t("PT_USAGE_FOR_PENDING_MONTHS"),
                    value: unit.usageForPendingMonths || t("ES_COMMON_NA")
                  }
                ] : [])
              ]
            })) : [])
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
              subHeader: owner.name || t("ES_COMMON_NA"),
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
                  label: t("PT_GENDER"),
                  value: owner.gender || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_CATEGORY"),
                  value: owner.category || t("ES_COMMON_NA")
                },
                {
                  inline: true,
                  label: t("PT_OWNERSHIP_INFO_CORR_ADDR"),
                  value: owner.correspondenceAddress || owner.permanentAddress || t("ES_COMMON_NA")
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

      {/* Documents Section */}
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
          {applicationData.owners && applicationData.owners.some(owner => owner.documents && owner.documents.length > 0) ? (
            <div>
              {applicationData.owners.map((owner, ownerIndex) =>
                owner.documents && owner.documents.length > 0 ? (
                  <div key={ownerIndex} style={{ marginBottom: "1rem" }}>
                    <h5 style={{ margin: "0 0 0.5rem 0", color: "#0B4B66" }}>
                      {t("PT_OWNER")} {ownerIndex + 1} - {owner.name}
                    </h5>
                    {owner.documents.map((doc, docIndex) => (
                      <div key={docIndex} style={{ padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", marginBottom: "0.5rem" }}>
                        <div style={{ fontWeight: "500" }}>{doc.documentType || t("ES_COMMON_NA")}</div>
                        <div style={{ fontSize: "14px", color: "#666" }}>{doc.fileStoreId || t("ES_COMMON_NA")}</div>
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
              {t("PT_NO_DOCUMENTS_UPLOADED")}
            </div>
          )}
        </div>
      </Accordion>

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
        setactionFieldsToRight={true}
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

export default ApplicationPreview;