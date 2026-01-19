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
  TextInput,
  Dropdown,
  Stepper
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";

const AssessmentForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const propertyId = searchParams.get('propertyId');
  const assessmentId = searchParams.get('assessmentId');
  const purpose = searchParams.get('purpose') || 'assess';
  const financialYear = searchParams.get('FY') || '2024-25';
  const tenantId = searchParams.get('tenantId') || Digit?.ULBService?.getCurrentTenantId();

  const [propertyData, setPropertyData] = useState(null);
  const [existingAssessment, setExistingAssessment] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [estimate, setEstimate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Editable property fields for reassessment
  const [editableProperty, setEditableProperty] = useState({
    propertyType: '',
    usageCategory: '',
    landArea: '',
    noOfFloors: '',
    units: []
  });

  // API hook for fetching property details
  const { isLoading, data: propertyResponse, error } = propertyId && tenantId
    ? Digit.Hooks.useCustomAPIHook({
      url: "/property-services/property/_search",
      params: {
        tenantId,
        propertyIds: propertyId,
        audit: false
      },
      config: {
        enabled: !!(propertyId && tenantId),
        select: (data) => data?.Properties || [],
      },
    })
    : { isLoading: false, data: null, error: null };

  // API hook for fetching existing assessment if reassessment
  const { data: assessmentResponse } = assessmentId && tenantId && purpose === 'reassess'
    ? Digit.Hooks.useCustomAPIHook({
      url: "/property-services/assessment/_search",
      params: {
        tenantId,
        assessmentNumbers: assessmentId
      },
      config: {
        enabled: !!(assessmentId && tenantId && purpose === 'reassess'),
        select: (data) => data?.Assessments || [],
      },
    })
    : { data: null };

  // Load property data
  useEffect(() => {
    if (propertyResponse && propertyResponse.length > 0) {
      const property = propertyResponse[0];
      setPropertyData(property);

      // Initialize editable fields with current property data
      setEditableProperty({
        propertyType: property.propertyType || '',
        usageCategory: property.usageCategory || '',
        landArea: property.landArea || '',
        noOfFloors: property.noOfFloors || '',
        units: property.units || []
      });
    }
  }, [propertyResponse]);

  // Load existing assessment data for reassessment
  useEffect(() => {
    if (assessmentResponse && assessmentResponse.length > 0 && purpose === 'reassess') {
      setExistingAssessment(assessmentResponse[0]);
    }
  }, [assessmentResponse, purpose]);

  const handlePropertyFieldChange = (field, value) => {
    setEditableProperty(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUnitFieldChange = (unitIndex, field, value) => {
    setEditableProperty(prev => ({
      ...prev,
      units: prev.units.map((unit, idx) =>
        idx === unitIndex ? { ...unit, [field]: value } : unit
      )
    }));
  };

  const handleCalculateEstimate = async () => {
    setIsCalculating(true);
    try {
      // Create assessment payload for estimate calculation
      const assessmentPayload = {
        Assessment: {
          ...propertyData,
          financialYear: financialYear,
          propertyId: propertyId,
          tenantId: tenantId,
          source: "MUNICIPAL_RECORDS",
          channel: "COUNTER",
          assessmentDate: Date.now(),
          propertyType: editableProperty.propertyType,
          usageCategory: editableProperty.usageCategory,
          landArea: editableProperty.landArea ? parseFloat(editableProperty.landArea) : null,
          noOfFloors: editableProperty.noOfFloors ? parseInt(editableProperty.noOfFloors) : null,
          units: editableProperty.units,
          address: propertyData?.address
        }
      };

      // Call PT calculator API for estimate
      const result = await Digit.CustomService.getResponse({
        url: "/pt-calculator-v2/propertytax/v2/_estimate",
        method: "POST",
        body: assessmentPayload
      });

      if (result?.Calculation && result.Calculation.length > 0) {
        setEstimate(result.Calculation[0]);
        setCurrentStep(2); // Move to review step
      } else {
        throw new Error("Estimate calculation failed");
      }
    } catch (error) {
      console.error("Estimate calculation error:", error);
      setToast({
        label: t("PT_ESTIMATE_CALCULATION_FAILED"),
        type: "error"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);

    try {
      // Update property with modified details first if reassessment
      if (purpose === 'reassess') {
        const propertyUpdatePayload = {
          Property: {
            ...propertyData,
            propertyType: editableProperty.propertyType,
            usageCategory: editableProperty.usageCategory,
            landArea: parseFloat(editableProperty.landArea),
            noOfFloors: parseInt(editableProperty.noOfFloors),
            units: editableProperty.units,
            workflow: {
              action: "UPDATE"
            }
          }
        };

        await Digit.CustomService.getResponse({
          url: "/property-services/property/_update",
          method: "POST",
          body: propertyUpdatePayload,
          params: { tenantId: tenantId }
        });
      }

      // Create new assessment
      const assessmentPayload = {
        Assessment: {
          financialYear: financialYear,
          propertyId: propertyId,
          tenantId: tenantId,
          assessmentDate: Date.now(),
          source: "MUNICIPAL_RECORDS",
          channel: "COUNTER",
          status: "ACTIVE",
          additionalDetails: {
            // Preserve adhoc penalty/exemption from previous assessment if reassessment
            ...(purpose === 'reassess' && existingAssessment?.additionalDetails ? {
              adhocPenalty: existingAssessment.additionalDetails.adhocPenalty || 0,
              adhocExemption: existingAssessment.additionalDetails.adhocExemption || 0
            } : {})
          }
        }
      };

      const result = await Digit.CustomService.getResponse({
        url: "/property-services/assessment/_create",
        method: "POST",
        body: assessmentPayload,
        params: { tenantId: tenantId }
      });

      if (result?.Assessments && result.Assessments.length > 0) {
        setToast({
          label: purpose === 'reassess' ?
            t("PT_REASSESSMENT_SUCCESSFUL") :
            t("PT_ASSESSMENT_SUCCESSFUL"),
          type: "success"
        });

        // Redirect back to property details after 2 seconds
        setTimeout(() => {
          history.push(`/${window.contextPath}/employee/pt/property/${propertyId}?tenantId=${tenantId}`);
        }, 2000);
      } else {
        throw new Error("Assessment creation failed");
      }
    } catch (error) {
      console.error("Assessment error:", error);
      setToast({
        label: error?.response?.data?.Errors?.[0]?.message ||
          (purpose === 'reassess' ? t("PT_REASSESSMENT_FAILED") : t("PT_ASSESSMENT_FAILED")),
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Validate property details before moving to next step
      if (!editableProperty.propertyType || !editableProperty.usageCategory) {
        setToast({ label: t("PT_PROPERTY_DETAILS_REQUIRED"), type: "error" });
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Calculate estimate
      handleCalculateEstimate();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !propertyData) {
    return (
      <div>
        <HeaderComponent>{purpose === 'reassess' ? t("PT_REASSESSMENT") : t("PT_ASSESSMENT")}</HeaderComponent>
        <div className="error-message">{t("PT_PROPERTY_NOT_FOUND")}</div>
      </div>
    );
  }

  const textStyles = {
    color: "#0B4B66",
    fontWeight: "700",
    fontSize: "32px",
    marginBottom: "1.5rem"
  };

  const propertyTypeOptions = [
    { code: "BUILT_UP", name: t("PT_BUILT_UP") },
    { code: "VACANT", name: t("PT_VACANT") },
    { code: "SHAREDPROPERTY", name: t("PT_SHARED_PROPERTY") }
  ];

  const usageCategoryOptions = [
    { code: "RESIDENTIAL", name: t("PT_RESIDENTIAL") },
    { code: "COMMERCIAL", name: t("PT_COMMERCIAL") },
    { code: "INDUSTRIAL", name: t("PT_INDUSTRIAL") },
    { code: "MIXED", name: t("PT_MIXED") }
  ];

  const steps = [
    { title: t("PT_PROPERTY_DETAILS"), isActive: currentStep === 0, isCompleted: currentStep > 0 },
    { title: t("PT_UNIT_DETAILS"), isActive: currentStep === 1, isCompleted: currentStep > 1 },
    { title: t("PT_REVIEW_ESTIMATE"), isActive: currentStep === 2, isCompleted: currentStep > 2 }
  ];

  return (
    <div>
      {/* Header Section */}
      <HeaderComponent styles={textStyles}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
            <div styles={textStyles}>
              {purpose === 'reassess' ? t("PT_REASSESSMENT") : t("PT_ASSESSMENT")}
            </div>
            <Tag
              type={"monochrome"}
              label={`${t("PT_PROPERTY_PTUID")}: ${propertyId}`}
              showIcon={true}
            />
          </div>
        </div>
      </HeaderComponent>

      {/* Stepper */}
      <Stepper
        currentStep={currentStep}
        steps={steps}
        onStepClick={(step) => {
          if (step < currentStep) setCurrentStep(step);
        }}
        direction="horizontal"
        style={{ marginBottom: "2rem" }}
      />

      {/* Step 0: Property Details */}
      {currentStep === 0 && (
        <>
          {/* Property Information - Read Only */}
          <SummaryCard
            header={t("PT_PROPERTY_INFORMATION")}
            type="primary"
            style={{ marginBottom: "1rem" }}
            layout={2}
            sections={[
              {
                cardType: 'primary',
                header: t("PT_PROPERTY_ADDRESS"),
                fieldPairs: [
                  {
                    inline: true,
                    label: t("PT_PROPERTY_ID"),
                    value: propertyData.propertyId
                  },
                  {
                    inline: true,
                    label: t("PT_PROPERTY_ADDRESS"),
                    value: [
                      propertyData.address?.doorNo,
                      propertyData.address?.buildingName,
                      propertyData.address?.street,
                      propertyData.address?.locality,
                      propertyData.address?.city
                    ].filter(Boolean).join(", ") || t("ES_COMMON_NA")
                  }
                ]
              }
            ]}
          />

          {/* Editable Property Details */}
          <Card style={{ padding: "1rem", marginBottom: "1rem" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#0B4B66" }}>
              {t("PT_EDITABLE_PROPERTY_DETAILS")}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <Dropdown
                label={t("PT_PROPERTY_TYPE")}
                option={propertyTypeOptions}
                optionKey="code"
                select={(value) => handlePropertyFieldChange('propertyType', value?.code)}
                selected={propertyTypeOptions.find(opt => opt.code === editableProperty.propertyType)}
                placeholder={t("PT_SELECT_PROPERTY_TYPE")}
              />

              <Dropdown
                label={t("PT_USAGE_CATEGORY")}
                option={usageCategoryOptions}
                optionKey="code"
                select={(value) => handlePropertyFieldChange('usageCategory', value?.code)}
                selected={usageCategoryOptions.find(opt => opt.code === editableProperty.usageCategory)}
                placeholder={t("PT_SELECT_USAGE_CATEGORY")}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <TextInput
                label={t("PT_PLOT_SIZE")}
                value={editableProperty.landArea}
                onChange={(e) => handlePropertyFieldChange('landArea', e.target.value)}
                placeholder={t("PT_ENTER_PLOT_SIZE")}
                type="number"
              />

              <TextInput
                label={t("PT_NO_OF_FLOORS")}
                value={editableProperty.noOfFloors}
                onChange={(e) => handlePropertyFieldChange('noOfFloors', e.target.value)}
                placeholder={t("PT_ENTER_NO_OF_FLOORS")}
                type="number"
              />
            </div>

            {purpose === 'reassess' && (
              <div style={{
                padding: "1rem",
                backgroundColor: "#E3F2FD",
                border: "1px solid #BBDEFB",
                borderRadius: "4px",
                marginTop: "1rem"
              }}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#1976D2" }}>
                  {t("PT_REASSESSMENT_INFO")}
                </h4>
                <p style={{ margin: "0", color: "#1976D2", fontSize: "14px" }}>
                  {t("PT_FINANCIAL_YEAR")}: {financialYear}
                </p>
                <p style={{ margin: "0", color: "#1976D2", fontSize: "14px" }}>
                  {t("PT_ORIGINAL_ASSESSMENT_ID")}: {assessmentId}
                </p>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Step 1: Unit Details */}
      {currentStep === 1 && (
        <Card style={{ padding: "1rem", marginBottom: "1rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#0B4B66" }}>
            {t("PT_UNIT_DETAILS")}
          </h3>

          {editableProperty.units && editableProperty.units.length > 0 ? (
            editableProperty.units.map((unit, index) => (
              <div key={index} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                <h4 style={{ margin: "0 0 1rem 0", color: "#0B4B66" }}>
                  {t("PT_UNIT")} {index + 1} - {t("PT_FLOOR")} {unit.floorNo}
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ fontWeight: "500" }}>{t("PT_USAGE_CATEGORY")}</label>
                    <div>{unit.usageCategory || t("ES_COMMON_NA")}</div>
                  </div>
                  <div>
                    <label style={{ fontWeight: "500" }}>{t("PT_OCCUPANCY_TYPE")}</label>
                    <div>{unit.occupancyType || t("ES_COMMON_NA")}</div>
                  </div>
                  <div>
                    <label style={{ fontWeight: "500" }}>{t("PT_BUILT_UP_AREA")}</label>
                    <div>{unit.constructionDetail?.builtUpArea ? `${unit.constructionDetail.builtUpArea} sq ft` : t("ES_COMMON_NA")}</div>
                  </div>
                  <div>
                    <label style={{ fontWeight: "500" }}>{t("PT_CONSTRUCTION_TYPE")}</label>
                    <div>{unit.constructionDetail?.constructionType || t("ES_COMMON_NA")}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
              {t("PT_NO_UNITS_FOUND")}
            </div>
          )}
        </Card>
      )}

      {/* Step 2: Review & Estimate */}
      {currentStep === 2 && (
        <>
          {estimate ? (
            <Card style={{ padding: "1rem", marginBottom: "1rem" }}>
              <h3 style={{ margin: "0 0 1rem 0", color: "#0B4B66" }}>
                {t("PT_TAX_ESTIMATE")}
              </h3>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
                  <span style={{ fontWeight: "500" }}>{t("PT_PROPERTY_TAX")}</span>
                  <span>₹{estimate.propertyTax || 0}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
                  <span style={{ fontWeight: "500" }}>{t("PT_FIRE_CESS")}</span>
                  <span>₹{estimate.fireCess || 0}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
                  <span style={{ fontWeight: "500" }}>{t("PT_CANCER_CESS")}</span>
                  <span>₹{estimate.cancerCess || 0}</span>
                </div>
                {purpose === 'reassess' && existingAssessment?.additionalDetails && (
                  <>
                    {existingAssessment.additionalDetails.adhocPenalty > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #ddd", color: "#d32f2f" }}>
                        <span style={{ fontWeight: "500" }}>{t("PT_ADHOC_PENALTY")}</span>
                        <span>₹{existingAssessment.additionalDetails.adhocPenalty}</span>
                      </div>
                    )}
                    {existingAssessment.additionalDetails.adhocExemption > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #ddd", color: "#388e3c" }}>
                        <span style={{ fontWeight: "500" }}>{t("PT_ADHOC_EXEMPTION")}</span>
                        <span>-₹{existingAssessment.additionalDetails.adhocExemption}</span>
                      </div>
                    )}
                  </>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", fontSize: "18px", fontWeight: "bold" }}>
                  <span>{t("PT_TOTAL_AMOUNT")}</span>
                  <span style={{ color: "#0B4B66" }}>₹{estimate.totalAmount || 0}</span>
                </div>
              </div>

              <div style={{
                padding: "1rem",
                backgroundColor: "#FFF3CD",
                border: "1px solid #FFEAA7",
                borderRadius: "4px"
              }}>
                <p style={{ margin: "0", fontSize: "14px" }}>
                  {t("PT_ASSESSMENT_NOTE")}
                </p>
              </div>
            </Card>
          ) : (
            <Loader />
          )}
        </>
      )}

      {/* Footer Actions */}
      <Footer
        actionFields={[
          currentStep > 0 && (
            <Button
              key="previous"
              label={t("PT_PREVIOUS")}
              variation="secondary"
              size="medium"
              onClick={handlePrevious}
            />
          ),
          <Button
            key="back"
            label={t("PT_BACK")}
            variation="secondary"
            size="medium"
            onClick={handleBack}
          />,
          currentStep < 2 ? (
            <Button
              key="next"
              label={isCalculating ? t("PT_CALCULATING") : t("PT_NEXT")}
              variation="primary"
              size="medium"
              onClick={handleNext}
              disabled={isCalculating}
            />
          ) : (
            <Button
              key="submit"
              label={isSubmitting ?
                (purpose === 'reassess' ? t("PT_REASSESSING") : t("PT_ASSESSING")) :
                (purpose === 'reassess' ? t("PT_SUBMIT_REASSESSMENT") : t("PT_SUBMIT_ASSESSMENT"))
              }
              variation="primary"
              size="medium"
              onClick={handleSubmitAssessment}
              disabled={isSubmitting}
            />
          )
        ].filter(Boolean)}
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

export default AssessmentForm;