import React, { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { SummaryCard, Card, Button, PopUp, TextInput, LabelFieldPair, HeaderComponent, Dropdown, Tag } from "@egovernments/digit-ui-components";

const PropertySummary = ({ onSelect, config, formData, errors }) => {

  const { t } = useTranslation();

  // Get session data from customProps (same pattern as TransferOwnership)
  const sessionData = config?.customProps?.sessionData || {};

  // Check if we're in reassessment mode
  const isReassessMode = config?.customProps?.isReassessMode || false;
  const taxCalculation = config?.customProps?.taxCalculation || null;
  const existingAssessment = config?.customProps?.existingAssessment || null;
  const financialYear = config?.customProps?.financialYear || "";
  const assessmentId = config?.customProps?.assessmentId || "";
  const importantDates = config?.customProps?.importantDates || null;
  const billingSlabs = config?.customProps?.billingSlabs || [];

  // State for popups and adhoc charges
  const [showRebateChargesPopup, setShowRebateChargesPopup] = useState(false);
  const [showCalculationDetailsPopup, setShowCalculationDetailsPopup] = useState(false);
  const [adhocPenalty, setAdhocPenalty] = useState(existingAssessment?.additionalDetails?.adhocPenalty || 0);
  const [adhocRebate, setAdhocRebate] = useState(existingAssessment?.additionalDetails?.adhocExemption || 0);
  const [penaltyReason, setPenaltyReason] = useState(null);
  const [rebateReason, setRebateReason] = useState(null);
  const [showOtherPenaltyField, setShowOtherPenaltyField] = useState(false);
  const [showOtherRebateField, setShowOtherRebateField] = useState(false);
  const [otherPenaltyReason, setOtherPenaltyReason] = useState("");
  const [otherRebateReason, setOtherRebateReason] = useState("");

  // Dropdown options - same as mono-ui
  const penaltyReasonOptions = [
    { code: "PENDING_DUES", name: t("PT_PENDING_DUES_FROM_EARLIER"), value: "Pending dues from earlier" },
    { code: "MISCALCULATION", name: t("PT_MISCALCULATION_DUES"), value: "Miscalculation of earlier assessment" },
    { code: "ONE_TIME_PENALTY", name: t("PT_ONE_TIME_PENALTY"), value: "One time Penalty" },
    { code: "OTHERS", name: t("PROPERTYTAX_BILLING_SLAB_OTHERS"), value: "Others" }
  ];

  const rebateReasonOptions = [
    { code: "ADVANCED_PAYMENT", name: t("PT_REBATE_OPTION1"), value: "Advanced paid by citizen earlier" },
    { code: "COMMISSIONER_REBATE", name: t("PT_REBATE_OPTION2"), value: "Rebate provided by commissioner/EO" },
    { code: "ADDITIONAL_CHARGED", name: t("PT_REBATE_OPTION3"), value: "Additional amount charged from the citizen" },
    { code: "OTHERS", name: t("PROPERTYTAX_BILLING_SLAB_OTHERS"), value: "Others" }
  ];

  const propertyAddress = sessionData["property-address"] || {};
  const assessmentInfo = sessionData["assessment-info"] || {};
  const ownershipInfo = sessionData["ownership-info"] || {};
  const ownershipDetails = ownershipInfo?.ownershipDetails || {};
  const documentInfo = sessionData["document-info"] || {};

  // Property Address Section
  const propertyAddressSections = [
    {
      cardType: "primary",
      fieldPairs: [
        { inline: true, label: t("CORE_COMMON_CITY"), value: propertyAddress.tenantId ? t(propertyAddress.tenantId) : t("ES_COMMON_NA") },
        { inline: true, label: t("PT_PROPERTY_DETAILS_DOOR_NUMBER"), value: propertyAddress.doorNo || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_PROPERTY_DETAILS_BUILDING_COLONY_NAME"), value: propertyAddress.buildingName || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_PROPERTY_DETAILS_STREET_NAME"), value: propertyAddress.street || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_LOCALITY_MOHALLA"), value: propertyAddress.locality?.name || propertyAddress.locality?.code || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_PROPERTY_ADDRESS_PINCODE"), value: propertyAddress.pincode || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_PROPERTY_ADDRESS_EXISTING_PID"), value: propertyAddress.existingPropertyId || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_SURVEY_ID"), value: propertyAddress.surveyId || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_YEAR_OF_CREATION"), value: propertyAddress.yearOfCreation?.name || propertyAddress.yearOfCreation?.code || propertyAddress.yearOfCreation || t("ES_COMMON_NA") }
      ]
    }
  ];

  // Assessment Info Section
  const propertyTypeCode = assessmentInfo.propertyType?.[0]?.code || assessmentInfo.propertyType?.code || "";
  const isVacant = propertyTypeCode === "VACANT";
  const isIndependent = propertyTypeCode === "INDEPENDENTPROPERTY";
  const isShared = propertyTypeCode === "SHAREDPROPERTY";

  const assessmentInfoFields = [
    { inline: true, label: t("PT_ASSESMENT_INFO_TYPE_OF_BUILDING"), value: assessmentInfo.propertyType?.[0]?.name || assessmentInfo.propertyType?.name || t("ES_COMMON_NA") },
    { inline: true, label: t("PT_ASSESMENT_INFO_USAGE_TYPE"), value: assessmentInfo.usageCategory?.[0]?.name || assessmentInfo.usageCategory?.name || t("ES_COMMON_NA") },
    { inline: true, label: t("PT_COMMON_VASIKA_NO"), value: assessmentInfo.vasikaNo || t("ES_COMMON_NA") },
    { inline: true, label: t("PT_COMMON_VASIKA_DATE"), value: assessmentInfo.vasikaDate ? new Date(assessmentInfo.vasikaDate).toLocaleDateString() : t("ES_COMMON_NA") },
    { inline: true, label: t("PT_COMMON_ALLOTMENT_NO"), value: assessmentInfo.allotmentNo || t("ES_COMMON_NA") },
    { inline: true, label: t("PT_COMMON_ALLOTMENT_DATE"), value: assessmentInfo.allotmentDate ? new Date(assessmentInfo.allotmentDate).toLocaleDateString() : t("ES_COMMON_NA") },
    { inline: true, label: t("PT_COMMON_BUSSINESS_NAME"), value: assessmentInfo.businessName || t("ES_COMMON_NA") },
    { inline: true, label: t("PT_COMMON_REMARKS"), value: assessmentInfo.remarks || t("ES_COMMON_NA") },
    { inline: true, label: t("PT_COMMON_INFLAMMABLE_MATERIAL_PROPERTY"), value: assessmentInfo.inflammableMaterial ? t("COMMON_YES") : t("COMMON_NO") },
    { inline: true, label: t("PT_COMMON_HEIGHT_OF_PROPERTY"), value: assessmentInfo.heightOfProperty ? t("COMMON_YES") : t("COMMON_NO") },
  ];

  // Add plot size and floor/unit details
  if (assessmentInfo.plotSize) {
    assessmentInfoFields.push({ inline: true, label: t("PT_FORM2_PLOT_SIZE"), value: `${assessmentInfo.plotSize} sq yards` });
  }

  if (isIndependent && assessmentInfo.noOfFloors) {
    assessmentInfoFields.push({ inline: true, label: t("PT_FORM2_NUMBER_OF_FLOORS"), value: assessmentInfo.noOfFloors?.name || assessmentInfo.noOfFloors?.code || assessmentInfo.noOfFloors });
  }

  const assessmentInfoSections = [
    {
      cardType: "primary",
      fieldPairs: assessmentInfoFields
    }
  ];

  // Ownership Info Section
  const ownershipInfoSections = [
    {
      cardType: "primary",
      fieldPairs: [
        { inline: true, label: t("PT_FORM3_OWNERSHIP_TYPE"), value: ownershipInfo.ownershipType?.i18nKey ? t(ownershipInfo.ownershipType.i18nKey) : ownershipInfo.ownershipType || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_OWNER_NAME"), value: ownershipInfo.ownerName || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_GENDER"), value: ownershipInfo.gender ? t(`PT_FORM3_${ownershipInfo.gender}`) : t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_MOBILE_NO"), value: ownershipInfo.mobileNumber || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_GUARDIAN_NAME"), value: ownershipInfo.guardianName || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_RELATIONSHIP"), value: ownershipInfo.relationship?.i18nKey ? t(ownershipInfo.relationship.i18nKey) : ownershipInfo.relationship?.code || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_SPECIAL_CATEGORY"), value: ownershipInfo.specialCategory?.i18nKey ? t(ownershipInfo.specialCategory.i18nKey) : ownershipInfo.specialCategory?.code || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_EMAIL_ID"), value: ownershipInfo.emailId || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_OWNERSHIP_PERCENTAGE"), value: ownershipInfo.ownershipPercentage ? `${ownershipInfo.ownershipPercentage}%` : t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_CORRESPONDENCE_ADDRESS"), value: ownershipInfo.correspondenceAddress || t("ES_COMMON_NA") }
      ]
    }
  ];

  const getOwnerSections = () => {
    const ownershipTypeCode = ownershipInfo.ownershipType?.[0]?.code || "";
    const isSingleOwner = ownershipTypeCode === "SINGLEOWNER";
    const isMultipleOwners = ownershipTypeCode === "MULTIPLEOWNERS";
    const isInstitutional = ownershipTypeCode?.includes("INSTITUTIONAL");

    if (isSingleOwner) {
      const fieldPairs = [
        { inline: true, label: t("PT_FORM3_OWNERSHIP_TYPE"), value: ownershipInfo.ownershipType?.[0]?.name || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_OWNER_NAME"), value: ownershipDetails?.ownerName || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_GENDER"), value: ownershipDetails?.gender?.name || ownershipDetails?.gender?.code || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_MOBILE_NO"), value: ownershipDetails?.mobileNumber || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"), value: ownershipDetails?.guardianName || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_RELATIONSHIP"), value: ownershipDetails?.relationship?.name || ownershipDetails?.relationship?.code || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_SPECIAL_CATEGORY"), value: ownershipDetails?.specialCategory?.name || ownershipDetails?.specialCategory?.code || t("ES_COMMON_NA") },
      ];

      // Add document fields if special category is not NONE
      if (ownershipDetails?.specialCategory?.code && ownershipDetails.specialCategory.code !== "NONE") {
        fieldPairs.push(
          { inline: true, label: t("PT_FORM3_DOCUMENT_ID_TYPE"), value: ownershipDetails?.documentIdType?.name || ownershipDetails?.documentIdType?.code || t("ES_COMMON_NA") },
          { inline: true, label: t("PT_FORM3_DOCUMENT_ID_NO"), value: ownershipDetails?.documentId || t("ES_COMMON_NA") }
        );
      }

      fieldPairs.push(
        { inline: true, label: t("PT_FORM3_EMAIL_ID"), value: ownershipDetails?.emailId || t("ES_COMMON_NA") },
        { inline: true, label: t("PT_SEARCHPROPERTY_TABEL_OWNERSHIPPERCENTAGE"), value: ownershipDetails?.ownershipPercentage ? `${ownershipDetails.ownershipPercentage}%` : t("ES_COMMON_NA") },
        { inline: true, label: t("PT_FORM3_CORRESPONDENCE_ADDRESS"), value: ownershipDetails?.correspondenceAddress || t("ES_COMMON_NA") }
      );

      return [
        {
          cardType: "secondary",
          header: t("PT_OWNER_DETAILS"),
          fieldPairs: fieldPairs,
        },
      ];
    } else if (isMultipleOwners) {
      const owners = ownershipDetails?.owners || [];

      if (owners.length === 0) {
        return [
          {
            cardType: "secondary",
            header: t("PT_OWNER_DETAILS"),
            fieldPairs: [
              { inline: true, label: t("PT_FORM3_OWNERSHIP_TYPE"), value: ownershipInfo.ownershipType?.[0]?.name || t("ES_COMMON_NA") },
              { inline: true, label: t("PT_OWNER_NAME"), value: t("ES_COMMON_NA") },
            ],
          },
        ];
      }

      // Create first section with ownership type and number of owners
      const sections = [
        {
          cardType: "secondary",
          header: t("PT_OWNER_DETAILS"),
          fieldPairs: [
            { inline: true, label: t("PT_FORM3_OWNERSHIP_TYPE"), value: ownershipInfo.ownershipType?.[0]?.name || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_MUTATION_NUMBER_OF_OWNERS"), value: owners.length },
          ],
        },
      ];

      // Add a section for each owner
      owners.forEach((owner, index) => {
        const fieldPairs = [
          { inline: true, label: t("PT_OWNER_NAME"), value: owner?.ownerName || t("ES_COMMON_NA") },
          { inline: true, label: t("PT_FORM3_GENDER"), value: owner?.gender?.name || owner?.gender?.code || t("ES_COMMON_NA") },
          { inline: true, label: t("PT_FORM3_MOBILE_NO"), value: owner?.mobileNumber || t("ES_COMMON_NA") },
          { inline: true, label: t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"), value: owner?.guardianName || t("ES_COMMON_NA") },
          { inline: true, label: t("PT_FORM3_RELATIONSHIP"), value: owner?.relationship?.name || owner?.relationship?.code || t("ES_COMMON_NA") },
          { inline: true, label: t("PT_FORM3_SPECIAL_CATEGORY"), value: owner?.specialCategory?.name || owner?.specialCategory?.code || t("ES_COMMON_NA") },
        ];

        // Add document fields if special category is not NONE
        if (owner?.specialCategory?.code && owner.specialCategory.code !== "NONE") {
          fieldPairs.push(
            { inline: true, label: t("PT_FORM3_DOCUMENT_ID_TYPE"), value: owner?.documentIdType?.name || owner?.documentIdType?.code || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_FORM3_DOCUMENT_ID_NO"), value: owner?.documentId || t("ES_COMMON_NA") }
          );
        }

        fieldPairs.push(
          { inline: true, label: t("PT_FORM3_EMAIL_ID"), value: owner?.emailId || t("ES_COMMON_NA") },
          { inline: true, label: t("PT_SEARCHPROPERTY_TABEL_OWNERSHIPPERCENTAGE"), value: owner?.ownershipPercentage ? `${owner.ownershipPercentage}%` : t("ES_COMMON_NA") },
          { inline: true, label: t("PT_FORM3_CORRESPONDENCE_ADDRESS"), value: owner?.correspondenceAddress || t("ES_COMMON_NA") }
        );

        sections.push({
          cardType: "secondary",
          header: `${t("PT_OWNER")} ${index + 1}`,
          fieldPairs: fieldPairs,
        });
      });

      return sections;
    } else if (isInstitutional) {
      return [
        {
          cardType: "secondary",
          header: t("PT_OWNER_DETAILS"),
          fieldPairs: [
            { inline: true, label: t("PT_FORM3_OWNERSHIP_TYPE"), value: ownershipInfo.ownershipType?.[0]?.name || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_INSTITUTION_NAME"), value: ownershipDetails?.institutionName || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_INSTITUTION_TYPE"), value: ownershipDetails?.institutionType?.name || ownershipDetails?.institutionType?.code || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_OWNER_NAME"), value: ownershipDetails?.ownerName || t("ES_COMMON_NA") },
            { inline: true, label: t("TL_NEW_OWNER_DESIG_LABEL"), value: ownershipDetails?.designation || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_FORM3_MOBILE_NO"), value: ownershipDetails?.mobileNumber || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_LANDLINE_NUMBER_FLOATING_LABEL"), value: ownershipDetails?.altContactNumber || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_FORM3_EMAIL_ID"), value: ownershipDetails?.emailId || t("ES_COMMON_NA") },
            { inline: true, label: t("PT_FORM3_CORRESPONDENCE_ADDRESS"), value: ownershipDetails?.correspondenceAddress || t("ES_COMMON_NA") },
          ],
        },
      ];
    }
    return [
      {
        cardType: "secondary",
        fieldPairs: [{ inline: true, label: t("PT_MUTATION_APPLICANT_TYPE_LABEL"), value: t("ES_COMMON_NA") }],
      },
    ];
  };

  const onwerSections = getOwnerSections();
  // Document Details Section
  const getDocumentLabel = (documentType) => {
    switch (documentType) {
      case "ADDRESSPROOF": return t("PT_ADDRESS_PROOF");
      case "IDENTITYPROOF": return t("PT_IDENTITY_PROOF");
      case "OWNERSHIPPROOF": return t("PT_REGISTRATION_PROOF");
      case "USAGEPROOF": return t("PT_USAGE_PROOF");
      default: return documentType;
    }
  };

  const getDocumentTypeLabel = (documentCode) => {
    if (!documentCode) return t("ES_COMMON_NA");
    return t(`PT_${documentCode.replace(".", "_")}`);
  };

  // Get documents array - handle different possible structures
  const documents = Array.isArray(documentInfo?.documents)
    ? documentInfo.documents
    : (documentInfo?.documents?.documents || []);

  const documentSections = [
    {
      cardType: "secondary",
      header: t("PT_DOCUMENT_DETAILS"),
      fieldPairs: documents.length > 0
        ? documents.map((doc, index) => ({
          inline: true,
          label: `${index + 1}. ${getDocumentLabel(doc.documentType)}`,
          value: doc.fileStoreId ? `${getDocumentTypeLabel(doc.documentCode)} - ${doc.fileName}` : t("ES_COMMON_NA"),
        }))
        : [{ inline: true, label: t("PT_DOCUMENT_DETAILS"), value: t("ES_COMMON_NA") }]
    },
  ];

  // Handler for saving adhoc charges
  const handleSaveRebateCharges = () => {
    // Update the config customProps with new values
    if (config?.customProps) {
      config.customProps.adhocPenalty = parseFloat(adhocPenalty) || 0;
      config.customProps.adhocRebate = parseFloat(adhocRebate) || 0;
    }
    setShowRebateChargesPopup(false);
  };

  // Get tax head estimates - same as mono-ui
  const taxHeadEstimates = (taxCalculation && taxCalculation.taxHeadEstimates) || [];
  const totalAmount = (taxCalculation && taxCalculation.totalAmount) || 0;

  // Calculate total including adhoc charges
  const calculateTotalWithAdhoc = () => {
    return totalAmount + (parseFloat(adhocPenalty) || 0) - (parseFloat(adhocRebate) || 0);
  };

  return (
    <div className="property-summary">
      {/* Tax Calculation Summary - Only in Reassessment Mode */}
      {isReassessMode && taxCalculation && (
        <>
          <Card style={{ marginBottom: "1.5rem" }}>
            <Tag
              type={"monochrome"}
              label={`${t("PT_TOTAL_AMOUNT")} : ₹ ${calculateTotalWithAdhoc().toFixed(2)}`}
              showIcon={true}
              stroke={true}
            />
            {/* Tax Breakdown - same as mono-ui */}
            <h3 style={{ margin: "0rem", color: "#0B4B66", fontSize: "18px", fontWeight: "600" }}>
              {t("PT_PROPERTY_TAX_ASSESSMENT_AND_PAYMENT")}
            </h3>
            <div>
              {taxHeadEstimates && taxHeadEstimates.map((item, index) => {
                const isRebateOrExemption = item.category === "REBATE" || item.category === "EXEMPTION";
                const displayAmount = item.estimateAmount || 0;
                return (
                  typeof item.estimateAmount !== 'undefined' && (
                    <div key={index} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.75rem 0",
                      borderBottom: "1px solid #E4E7E9",
                      color: "#505A5F"
                    }}>
                      <span style={{ fontWeight: "500" }}>{t(item.taxHeadCode)}</span>
                      <span style={{ fontWeight: "500" }}>
                        {displayAmount.toFixed(2)}
                      </span>
                    </div>
                  )
                );
              })}

              {/* Adhoc Penalty/Rebate */}
              {adhocPenalty > 0 && (
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #E4E7E9",
                  color: "#D32F2F"
                }}>
                  <span style={{ fontWeight: "500" }}>{t("PT_ADHOC_PENALTY")}</span>
                  <span style={{ fontWeight: "500" }}>{parseFloat(adhocPenalty).toFixed(2)}</span>
                </div>
              )}
              {adhocRebate > 0 && (
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #E4E7E9",
                  color: "#388E3C"
                }}>
                  <span style={{ fontWeight: "500" }}>{t("PT_ADHOC_REBATE")}</span>
                  <span style={{ fontWeight: "500" }}>-{parseFloat(adhocRebate).toFixed(2)}</span>
                </div>
              )}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem 0",
                marginTop: "0.5rem",
                borderTop: "2px solid #0B4B66",
                fontSize: "18px",
                fontWeight: "700",
                color: "#0B4B66"
              }}>
                <span>{t("PT_TOTAL")}</span>
                <span>₹ {calculateTotalWithAdhoc().toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button
                label={t("PT_ADD_REBATE_CHARGES")}
                variation="secondary"
                onClick={() => setShowRebateChargesPopup(true)}
                style={{ flex: 1 }}
              />
              <Button
                label={t("PT_CALCULATION_DETAILS")}
                variation="secondary"
                onClick={() => setShowCalculationDetailsPopup(true)}
                style={{ flex: 1 }}
              />
            </div>

            {/* Important Dates - from MDMS */}
            {importantDates && (
              <>
                <h3 style={{ margin: "0rem", color: "#0B4B66", fontSize: "18px", fontWeight: "600" }}>
                  {t("PT_IMPORTANT_DATES")}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem" }}>
                  {importantDates.rebate && importantDates.rebate.endingDay && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #E4E7E9" }}>
                      <span style={{ color: "#505A5F" }}>
                        {t("PT_LAST_DATE_FOR_REBATE")} ({importantDates.rebate.rate || 0}% of PT)
                      </span>
                      <span style={{ color: "#505A5F", fontWeight: "500" }}>
                        {importantDates.rebate.endingDay}
                      </span>
                    </div>
                  )}
                  {importantDates.penalty && importantDates.penalty.startingDay && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #E4E7E9" }}>
                      <span style={{ color: "#505A5F" }}>
                        {t("PT_PENALTY_APPLIED_FROM")} ({importantDates.penalty.rate || 10}% of PT)
                      </span>
                      <span style={{ color: "#505A5F", fontWeight: "500" }}>
                        {importantDates.penalty.startingDay}
                      </span>
                    </div>
                  )}
                  {importantDates.interest && importantDates.interest.startingDay && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0" }}>
                      <span style={{ color: "#505A5F" }}>
                        {t("PT_INTEREST_APPLIED_FROM")} ({importantDates.interest.rate || 9}% p.a. daily)
                      </span>
                      <span style={{ color: "#505A5F", fontWeight: "500" }}>
                        {importantDates.interest.startingDay}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        </>
      )}

      <SummaryCard
        header={t("PT_PROPERTY_ADDRESS_SUB_HEADER")}
        type="secondary"
        layout={2}
        sections={propertyAddressSections}
        style={{ marginBottom: "1rem" }}
      />

      <SummaryCard
        header={t("PT_ASSESMENT_INFO_SUB_HEADER")}
        type="secondary"
        layout={2}
        sections={assessmentInfoSections}
        style={{ marginBottom: "1rem" }}
      />

      <SummaryCard
        header={t("PT_OWNERSHIP_INFO_SUB_HEADER")}
        type={ownershipInfo?.ownershipType?.[0]?.code === "MULTIPLEOWNERS" ? "primary" : "secondary"}
        layout={1}
        sections={onwerSections}
        showSectionsAsMultipleCards={ownershipInfo?.ownershipType?.[0]?.code === "MULTIPLEOWNERS"}
        style={{ marginBottom: "1rem" }}
      />

      <SummaryCard
        header={t("PT_DOCUMENT_INFO")}
        type="secondary"
        layout={2}
        sections={documentSections}
        style={{ marginBottom: "1rem" }}
      />

      {/* Add Rebate/Charges Popup */}
      {showRebateChargesPopup && (
        <PopUp
          type="default"
          heading={t("PT_ADD_REBATE_CHARGES")}
          onClose={() => setShowRebateChargesPopup(false)}
          footerChildren={[
            <Button
              label={t("PT_CANCEL")}
              variation="secondary"
              onClick={() => setShowRebateChargesPopup(false)}
            />,
            <Button
              label={t("PT_SUBMIT")}
              variation="primary"
              onClick={handleSaveRebateCharges}
            />
          ]}
          style={{
            maxWidth: "1000px",
            width: "90%",
            maxHeight: "85vh"
          }}>
          {/* Additional Charges */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ margin: "0px", marginBottom: "8px", color: "#0B4B66", fontSize: "18px", fontWeight: "600" }}>
              {t("PT_ADDITIONAL_CHARGES")}
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <LabelFieldPair vertical={true} style={{ width: "50%" }}>
                <HeaderComponent className="label" style={{ margin: "0rem" }}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {t("PT_ADDITIONAL_CHARGES")}
                    </label>
                  </div>
                </HeaderComponent>
                <div className="digit-field" style={{ width: "100%" }}>
                  <TextInput
                    type="number"
                    value={adhocPenalty}
                    onChange={(e) => setAdhocPenalty(e.target.value)}
                    placeholder={t("PT_ENTER_AMOUNT")}
                  />
                </div>
              </LabelFieldPair>
              <LabelFieldPair vertical={true} style={{ width: "50%" }}>
                <HeaderComponent className="label" style={{ margin: "0rem" }}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {t("PT_REASON_FOR_CHARGES")}
                    </label>
                  </div>
                </HeaderComponent>
                <Dropdown
                  option={penaltyReasonOptions}
                  optionKey="name"
                  selected={penaltyReason}
                  select={(value) => {
                    setPenaltyReason(value);
                    setShowOtherPenaltyField(value && value.code === "OTHERS");
                  }}
                  placeholder={t("ES_CREATECOMPLAINT_SELECT_PLACEHOLDER")}
                  optionCardStyles={{ maxHeight: "10vh" }}
                />
              </LabelFieldPair>
            </div>
            {/* Show "Other" text field if "Others" is selected */}
            {showOtherPenaltyField && (
              <div style={{ marginTop: "8px" }}>
                <LabelFieldPair vertical={true}>
                  <HeaderComponent className="label" style={{ margin: "0rem" }}>
                    <div className={`label-container`}>
                      <label className={`label-styles`}>
                        {t("PT_DESCRIPTION_FLOATING_LABEL")}
                      </label>
                    </div>
                  </HeaderComponent>
                  <div className="digit-field" style={{ width: "100%" }}>
                    <TextInput
                      value={otherPenaltyReason}
                      onChange={(e) => setOtherPenaltyReason(e.target.value)}
                      placeholder={t("PT_DESCRIPTION_HINT_TEXT")}
                    />
                  </div>
                </LabelFieldPair>
              </div>
            )}
          </div>
          {/* Additional Rebate */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ margin: "0px", marginBottom: "8px", color: "#0B4B66", fontSize: "18px", fontWeight: "600" }}>
              {t("PT_ADDITIONAL_REBATE")}
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <LabelFieldPair vertical={true} style={{ width: "50%" }}>
                <HeaderComponent className="label" style={{ margin: "0rem" }}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {t("PT_ADDITIONAL_REBATE")}
                    </label>
                  </div>
                </HeaderComponent>
                <div className="digit-field" style={{ width: "100%" }}>
                  <TextInput
                    type="number"
                    value={adhocRebate}
                    onChange={(e) => setAdhocRebate(e.target.value)}
                    placeholder={t("PT_ENTER_AMOUNT")}
                  />
                </div>
              </LabelFieldPair>
              <LabelFieldPair vertical={true} style={{ width: "50%" }}>
                <HeaderComponent className="label" style={{ margin: "0rem" }}>
                  <div className={`label-container`}>
                    <label className={`label-styles`}>
                      {t("PT_REASON_FOR_REBATE")}
                    </label>
                  </div>
                </HeaderComponent>
                <Dropdown
                  option={rebateReasonOptions}
                  optionKey="name"
                  selected={rebateReason}
                  select={(value) => {
                    setRebateReason(value);
                    setShowOtherRebateField(value && value.code === "OTHERS");
                  }}
                  placeholder={t("ES_CREATECOMPLAINT_SELECT_PLACEHOLDER")}
                  optionCardStyles={{ maxHeight: "8vh" }}
                />
              </LabelFieldPair>
            </div>
            {/* Show "Other" text field if "Others" is selected */}
            {showOtherRebateField && (
              <div style={{ marginTop: "8px" }}>
                <LabelFieldPair vertical={true}>
                  <HeaderComponent className="label" style={{ margin: "0rem" }}>
                    <div className={`label-container`}>
                      <label className={`label-styles`}>
                        {t("PT_DESCRIPTION_FLOATING_LABEL")}
                      </label>
                    </div>
                  </HeaderComponent>
                  <div className="digit-field" style={{ width: "100%" }}>
                    <TextInput
                      value={otherRebateReason}
                      onChange={(e) => setOtherRebateReason(e.target.value)}
                      placeholder={t("PT_DESCRIPTION_HINT_TEXT")}
                    />
                  </div>
                </LabelFieldPair>
              </div>
            )}
          </div>
        </PopUp>
      )}
      {/* Calculation Details Popup */}
      {showCalculationDetailsPopup && (
        <PopUp
          type="default"
          heading={t("PT_CALCULATION_DETAILS")}
          footerChildren={[
            <Button
              label={t("PT_OK")}
              variation="primary"
              onClick={() => setShowCalculationDetailsPopup(false)}
            />
          ]}
          style={{
            maxWidth: "700px",
            width: "90%",
            maxHeight: "80vh"
          }}
          onClose={() => setShowCalculationDetailsPopup(false)}>
          <div>
            {/* Calculation Logic */}
            <div>
              <h3 style={{ margin: "0 0 0.75rem 0", color: "#0B4B66", fontSize: "16px", fontWeight: "600" }}>
                {t("PT_CALCULATION_LOGIC")}
              </h3>
              <p style={{ margin: 0, color: "#505A5F", fontSize: "14px", lineHeight: "1.6" }}>
                {t("PT_CALCULATION_LOGIC_TEXT")}
              </p>
              <p style={{ margin: "0.75rem 0 0 0", color: "#FF0000", fontSize: "12px", fontStyle: "italic" }}>
                *5% increase in Gross Tax is applicable for FY {financialYear}.
              </p>
            </div>

            {/* Applicable Charge Slabs */}
            {billingSlabs && billingSlabs.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ margin: "0 0 0.75rem 0", color: "#0B4B66", fontSize: "16px", fontWeight: "600" }}>
                  {t("PT_CHARGE_SLABS")}
                </h3>
                {billingSlabs.map((slab, index) => {
                  // Get floor label based on floor number
                  const getFloorLabel = (floorNo) => {
                    if (floorNo === undefined || floorNo === null) return "Ground Floor";
                    const floor = parseInt(floorNo);
                    if (floor === -1) return "Basement";
                    if (floor === 0) return "Ground Floor";
                    if (floor === 1) return "1st Floor";
                    if (floor === 2) return "2nd Floor";
                    if (floor === 3) return "3rd Floor";
                    return `${floor}th Floor`;
                  };

                  const floorLabel = getFloorLabel(slab.floorNo || 0);
                  const unitLabel = `${floorLabel} Unit - ${index + 1}`;
                  const rateValue = slab.rate ? `${slab.rate}/sq yards` : "1/sq yards";

                  return (
                    <div key={index} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #E4E7E9"
                    }}>
                      <span style={{ color: "#505A5F" }}>{unitLabel}</span>
                      <span style={{ color: "#0B4B66", fontWeight: "500" }}>{rateValue}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </PopUp>
      )}
    </div>
  );
};

export default PropertySummary;
