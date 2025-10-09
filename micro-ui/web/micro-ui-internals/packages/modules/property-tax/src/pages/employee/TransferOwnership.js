import React, { useState, useEffect, useMemo } from "react";
import {
  Loader,
  Toast,
  HeaderComponent,
  Stepper,
  FormComposerV2,
  Tag,
} from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { TransferOwnershipConfig } from "../../configs/employee/TransferOwnershipConfig";

const TransferOwnership = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const consumerCode = searchParams.get('consumerCode');
  const tenantId = searchParams.get('tenantId') || Digit?.ULBService?.getCurrentTenantId();
  const stepFromUrl = searchParams.get('step');

  // Session storage key for this property
  const sessionKey = `PT_MUTATION_${consumerCode}_${tenantId}`;

  // Initialize state from URL or session storage
  const getInitialState = () => {
    try {
      const savedData = Digit.SessionStorage.get(sessionKey);

      // If URL has step parameter, use it and ignore session storage for step-related state
      if (stepFromUrl) {
        const stepNumber = parseInt(stepFromUrl);
        return {
          currentKey: stepNumber,
          totalFormData: savedData?.totalFormData || {},
          activeSteps: savedData?.activeSteps >= stepNumber ? savedData.activeSteps : stepNumber,
        };
      }

      // If no URL parameter but session data exists, use session data
      if (savedData) {
        return {
          currentKey: savedData.currentKey || 1,
          totalFormData: savedData.totalFormData || {},
          activeSteps: savedData.activeSteps || 1,
        };
      }
    } catch (e) {
      console.error("Error loading session data:", e);
    }
    return {
      currentKey: 1,
      totalFormData: {},
      activeSteps: 1,
    };
  };

  const initialState = getInitialState();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalFormData, setTotalFormData] = useState(initialState.totalFormData);
  const [activeSteps, setActiveSteps] = useState(initialState.activeSteps);
  const [propertyData, setPropertyData] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [currentKey, setCurrentKey] = useState(initialState.currentKey);

  // API hook for fetching property details
  const { isLoading, data: propertyResponse, error } = consumerCode && tenantId
    ? Digit.Hooks.useCustomAPIHook({
      url: "/property-services/property/_search",
      params: {
        tenantId,
        propertyIds: consumerCode,
        audit: false
      },
      config: {
        enabled: !!(consumerCode && tenantId),
        select: (data) => data?.Properties || [],
      },
    })
    : { isLoading: false, data: null, error: null };

  useEffect(() => {
    if (propertyResponse && propertyResponse.length > 0) {
      const property = propertyResponse[0];
      setPropertyData(property);
    }
  }, [propertyResponse]);

  const config = useMemo(() => {
    return TransferOwnershipConfig(totalFormData, propertyData, isSubmitting);
  }, [totalFormData, propertyData, isSubmitting]);

  const filterConfig = useMemo(() => {
    return (config, currentKey) => {
      return config
        .map((cfg) => {
          return {
            ...cfg,
            form: cfg?.form.filter((step) => parseInt(step.key) === currentKey),
          };
        })
        .filter((cfg) => cfg.form.length > 0);
    };
  }, []);

  const filteredConfig = useMemo(() => {
    return filterConfig(config, currentKey);
  }, [config, currentKey, filterConfig]);

  useEffect(() => {
    setCurrentStep(Number(filteredConfig?.[0]?.form?.[0]?.stepCount - 1));
  }, [currentKey, filteredConfig]);

  // Clear toast only when successfully moving to next step (currentKey changes)
  useEffect(() => {
    setShowToast(null);
  }, [currentKey]);

  useEffect(() => {
    setIsSubmitting(false);
  }, [currentKey]);

  // Save form data to session storage whenever it changes
  useEffect(() => {
    try {
      const dataToSave = {
        currentKey,
        totalFormData,
        activeSteps,
      };
      Digit.SessionStorage.set(sessionKey, dataToSave);
    } catch (e) {
      console.error("Error saving to session storage:", e);
    }
  }, [currentKey, totalFormData, activeSteps, sessionKey]);

  // Update URL with current step
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('step', currentKey.toString());
    const newUrl = `${location.pathname}?${newSearchParams.toString()}`;

    // Only update if URL actually changed to avoid infinite loops
    if (location.search !== `?${newSearchParams.toString()}`) {
      history.replace(newUrl);
    }
  }, [currentKey]);

  const onStepClick = (step) => {
    if (step > currentStep) return;
    const filteredSteps = config?.[0].form.filter((item) => item.stepCount === String(step + 1));
    const minKeyStep = filteredSteps.reduce((min, step) => {
      return parseInt(step.key) < parseInt(min.key) ? step : min;
    });
    setCurrentKey(parseInt(minKeyStep?.key));
  };

  const onSubmit = (formData) => {
    setIsSubmitting(true);

    const name = filteredConfig?.[0]?.form?.[0]?.name;
    const currentConfBody = filteredConfig?.[0]?.form?.[0]?.body?.[0];
    const componentKey = currentConfBody?.key;

    // Extract the actual form data from the nested structure
    const actualFormData = formData?.[name]?.[componentKey] || formData?.[componentKey] || formData?.[name] || formData;
    // Validation based on current step
    if (componentKey === "transfereeDetails") {
      const validationErrors = [];
      const data = actualFormData;

      // Validate ownership type
      if (!data?.ownershipType) {
        validationErrors.push(t("PT_MUTATION_OWNERSHIP_TYPE_REQUIRED") || "Please select ownership type");
      }

      // Validate owners for individual ownership
      if (data?.ownershipType === "INDIVIDUAL.SINGLEOWNER" || data?.ownershipType === "INDIVIDUAL.MULTIPLEOWNERS") {
        if (!data?.owners || data.owners.length === 0) {
          validationErrors.push(t("PT_MUTATION_ATLEAST_ONE_OWNER_REQUIRED") || "At least one owner is required");
        } else {
          data.owners.forEach((owner, index) => {
            if (!owner.name) validationErrors.push(`${t("PT_MUTATION_OWNER_NAME_REQUIRED")} (${t("PT_OWNER")} ${index + 1})`);
            if (!owner.gender) validationErrors.push(`${t("PT_MUTATION_GENDER_REQUIRED")} (${t("PT_OWNER")} ${index + 1})`);
            if (!owner.mobileNumber) validationErrors.push(`${t("PT_MUTATION_MOBILE_REQUIRED")} (${t("PT_OWNER")} ${index + 1})`);
            if (!owner.guardianName) validationErrors.push(`${t("PT_MUTATION_GUARDIAN_NAME_REQUIRED")} (${t("PT_OWNER")} ${index + 1})`);
            if (!owner.ownershipPercentage) validationErrors.push(`${t("PT_MUTATION_OWNERSHIP_PERCENTAGE_REQUIRED")} (${t("PT_OWNER")} ${index + 1})`);
            if (!owner.relationship) validationErrors.push(`${t("PT_MUTATION_RELATIONSHIP_REQUIRED")} (${t("PT_OWNER")} ${index + 1})`);
            if (!owner.specialCategory) validationErrors.push(`${t("PT_MUTATION_SPECIAL_CATEGORY_REQUIRED")} (${t("PT_OWNER")} ${index + 1})`);
            if (!owner.correspondenceAddress) validationErrors.push(`${t("PT_MUTATION_CORRESPONDENCE_ADDRESS_REQUIRED")} (${t("PT_OWNER")} ${index + 1})`);

            // Validate special category document fields (only if special category is not "NONE")
            if (owner.specialCategory && owner.specialCategory !== "NONE") {
              if (!owner.specialCategoryDocumentType) {
                validationErrors.push(`${t("PT_MUTATION_SPECIAL_CATEGORY_DOCUMENT_TYPE_REQUIRED") || "Special category document type is required"} (${t("PT_OWNER")} ${index + 1})`);
              }
              if (!owner.specialCategoryDocumentId) {
                validationErrors.push(`${t("PT_MUTATION_SPECIAL_CATEGORY_DOCUMENT_ID_REQUIRED") || "Special category document ID is required"} (${t("PT_OWNER")} ${index + 1})`);
              }
            }
          });

          // For multiple owners, check total percentage
          if (data?.ownershipType === "INDIVIDUAL.MULTIPLEOWNERS") {
            const totalPercentage = data.owners.reduce((sum, owner) => sum + (parseFloat(owner.ownershipPercentage) || 0), 0);
            if (totalPercentage !== 100) {
              validationErrors.push(t("PT_MUTATION_TOTAL_OWNERSHIP_PERCENTAGE_ERROR") || "Total ownership percentage must equal 100");
            }
          }
        }
      }

      // Validate institution data
      if (data?.ownershipType && data.ownershipType.startsWith("INSTITUTIONAL")) {
        if (!data?.institutionData?.institutionName) validationErrors.push(t("PT_MUTATION_INSTITUTION_NAME_REQUIRED"));
        if (!data?.institutionData?.institutionType) validationErrors.push(t("PT_MUTATION_INSTITUTION_TYPE_REQUIRED"));
        if (!data?.institutionData?.authorizedPersonName) validationErrors.push(t("PT_MUTATION_AUTHORIZED_PERSON_NAME_REQUIRED"));
        if (!data?.institutionData?.designation) validationErrors.push(t("PT_MUTATION_DESIGNATION_REQUIRED"));
        if (!data?.institutionData?.mobile) validationErrors.push(t("PT_MUTATION_MOBILE_REQUIRED"));
        if (!data?.institutionData?.landline) validationErrors.push(t("PT_MUTATION_LANDLINE_REQUIRED"));
        if (!data?.institutionData?.correspondenceAddress) validationErrors.push(t("PT_MUTATION_CORRESPONDENCE_ADDRESS_REQUIRED"));
      }

      // Validate registration details
      if (!data?.registrationData?.transferReason) validationErrors.push(t("PT_MUTATION_TRANSFER_REASON_REQUIRED"));
      if (!data?.registrationData?.marketValue) validationErrors.push(t("PT_MUTATION_MARKET_VALUE_REQUIRED"));
      if (!data?.registrationData?.documentNumber) validationErrors.push(t("PT_MUTATION_DOCUMENT_NUMBER_REQUIRED"));
      if (!data?.registrationData?.documentDate) validationErrors.push(t("PT_MUTATION_DOCUMENT_DATE_REQUIRED"));
      if (!data?.registrationData?.documentValue) validationErrors.push(t("PT_MUTATION_DOCUMENT_VALUE_REQUIRED"));

      // If there are validation errors, show toast and don't proceed
      if (validationErrors.length > 0) {
        setShowToast({
          key: "error",
          label: validationErrors[0],
          transitionTime: 5000,
        });
        setIsSubmitting(false);
        return;
      }
    }

    // Validation for documents step
    if (componentKey === "documents") {
      const validationErrors = [];
      const docsData = actualFormData?.documents || {};
      const documentsArray = docsData?.documents || [];

      if (Array.isArray(documentsArray)) {
        documentsArray.forEach((doc, index) => {
          const docLabel = index === 0 ? "Address Proof" : index === 1 ? "Identity Proof" : "Transfer Reason Document";

          // Only validate if document is marked as required in MDMS
          if (doc.required) {
            // If document is required and file is uploaded, document type must be selected
            if (doc.fileStoreId && !doc.documentCode) {
              validationErrors.push(t("PT_DOCUMENT_TYPE_REQUIRED") || `Please select document type for ${docLabel}`);
            }
            // If document is required, file must be uploaded
            if (!doc.fileStoreId) {
              validationErrors.push(t("PT_DOCUMENT_FILE_REQUIRED") || `Please upload ${docLabel}`);
            }
          } else {
            // If document is optional but file is uploaded, document type must be selected
            if (doc.fileStoreId && !doc.documentCode) {
              validationErrors.push(t("PT_DOCUMENT_TYPE_REQUIRED") || `Please select document type for ${docLabel}`);
            }
          }
        });
      }

      if (validationErrors.length > 0) {
        setShowToast({
          key: "error",
          label: validationErrors[0],
          transitionTime: 5000,
        });
        setIsSubmitting(false);
        return;
      }
    }

    // Update totalFormData
    setTotalFormData((prev) => {
      return {
        ...prev,
        [name]: actualFormData,
      };
    });

    // If this is the last step, handle final submission
    if (currentConfBody.isLast) {
      handleFinalSubmit({ ...totalFormData, [name]: actualFormData });
    } else {
      // Move to next step
      setCurrentStep((prev) => prev + 1);
      setCurrentKey((prev) => prev + 1);
      setActiveSteps(Math.max(activeSteps, currentKey + 1));
    }
  };

  const handleFinalSubmit = async (finalData) => {
    try {
      setIsSubmitting(true);

      // Get transferee details and documents
      const transfereeData = finalData?.PT_TRANSFEREE_DETAILS || {};
      const documentsData = finalData?.PT_DOCUMENT_DETAILS || {};

      // Clone property data to avoid mutating original
      const updatedProperty = { ...propertyData };

      // Set workflow object
      updatedProperty.workflow = {
        businessService: "PT.MUTATION",
        tenantId,
        action: "OPEN",
        moduleName: "PT"
      };

      // Mark existing owners as INACTIVE
      if (updatedProperty.owners && Array.isArray(updatedProperty.owners)) {
        updatedProperty.owners = updatedProperty.owners.map(owner => ({
          ...owner,
          status: "INACTIVE"
        }));
      }

      // Prepare new owners based on ownership type
      let newOwners = [];
      const ownershipType = transfereeData?.ownershipType;

      if (ownershipType === "INDIVIDUAL.SINGLEOWNER" || ownershipType === "INDIVIDUAL.MULTIPLEOWNERS") {
        // Individual ownership - use owners array
        newOwners = (transfereeData?.owners || []).map(owner => ({
          name: owner.name,
          fatherOrHusbandName: owner.guardianName,
          relationship: owner.relationship,
          mobileNumber: owner.mobileNumber,
          emailId: owner.emailId,
          gender: owner.gender,
          ownerType: owner.specialCategory || "NONE",
          ownerShipPercentage: owner.ownershipPercentage,
          permanentAddress: owner.correspondenceAddress,
          status: "ACTIVE",
          isPrimaryOwner: true,
          institutionId: null,
          documents: owner.specialCategoryDocumentId ? [{
            documentType: owner.specialCategoryDocumentType || "SPECIALCATEGORYPROOF",
            fileStoreId: owner.specialCategoryDocumentId,
            documentUid: owner.specialCategoryDocumentId,
            status: "ACTIVE"
          }] : []
        }));
      } else if (ownershipType && ownershipType.startsWith("INSTITUTIONAL")) {
        // Institutional ownership
        const institutionData = transfereeData?.institutionData || {};
        newOwners = [{
          name: institutionData.institutionName,
          fatherOrHusbandName: institutionData.authorizedPersonName,
          mobileNumber: institutionData.mobile,
          altContactNumber: institutionData.landline,
          emailId: institutionData.emailId,
          permanentAddress: institutionData.correspondenceAddress,
          ownerType: "NONE",
          status: "ACTIVE",
          isPrimaryOwner: true,
          institutionId: null
        }];

        // Set institution object
        updatedProperty.institution = {
          name: institutionData.institutionName,
          type: institutionData.institutionType,
          nameOfAuthorizedPerson: institutionData.authorizedPersonName,
          designation: institutionData.designation,
          tenantId: tenantId
        };
      }

      // Merge old owners with new owners
      updatedProperty.owners = [...updatedProperty.owners, ...newOwners];

      // Update ownership category
      updatedProperty.ownershipCategory = ownershipType;

      // Convert documentDate to epoch if it exists and store mutation fields
      if (transfereeData?.registrationData?.documentDate) {
        if (!updatedProperty.additionalDetails) {
          updatedProperty.additionalDetails = {};
        }
        updatedProperty.additionalDetails.documentDate = new Date(transfereeData.registrationData.documentDate).getTime();
        updatedProperty.additionalDetails.reasonForTransfer = transfereeData.registrationData.transferReason;
        updatedProperty.additionalDetails.marketValue = transfereeData.registrationData.marketValue;
        updatedProperty.additionalDetails.documentNumber = transfereeData.registrationData.documentNumber;
        updatedProperty.additionalDetails.documentValue = transfereeData.registrationData.documentValue;
        updatedProperty.additionalDetails.remarks = transfereeData.registrationData.remarks;
      }

      // Process documents
      const newDocuments = [];
      const documents = documentsData?.documents?.documents || [];

      documents.forEach(doc => {
        if (doc.fileStoreId && doc.documentCode) {
          // Extract document type - if it's TRANSFERREASONDOCUMENT, get the specific reason
          let documentType = doc.documentCode;
          if (doc.documentCode.includes("TRANSFERREASONDOCUMENT")) {
            const parts = doc.documentCode.split(".");
            documentType = parts[parts.length - 1]; // Get the last part (e.g., SALE, GIFT, etc.)
          }

          newDocuments.push({
            documentType: documentType,
            fileStoreId: doc.fileStoreId,
            documentUid: doc.fileStoreId,
            auditDetails: null,
            status: "ACTIVE"
          });
        }
      });

      // Keep old property documents (USAGEPROOF, OCCUPANCYPROOF, CONSTRUCTIONPROOF)
      const oldDocuments = (updatedProperty.documents || []).filter(doc =>
        doc.documentType.includes("USAGEPROOF") ||
        doc.documentType.includes("OCCUPANCYPROOF") ||
        doc.documentType.includes("CONSTRUCTIONPROOF")
      );

      // Merge documents
      updatedProperty.documents = [...newDocuments, ...oldDocuments];

      // Set creationReason
      updatedProperty.creationReason = "MUTATION";

      // Call the mutation API
      let response;
      try {
        response = await Digit.CustomService.getResponse({
          url: "/property-services/property/_update",
          method: "POST",
          body: {
            Property: updatedProperty
          },
          params: {
            tenantId: tenantId
          }
        });
      } catch (apiError) {
        // Check if API returned an error response
        if (apiError?.response?.data?.Errors) {
          const errorMessage = apiError.response.data.Errors[0]?.message || t("PT_MUTATION_SUBMISSION_FAILED");
          console.error("API Error:", errorMessage);
          setShowToast({
            key: "error",
            label: errorMessage,
            transitionTime: 5000,
          });
          setIsSubmitting(false);
          return;
        }
        throw apiError;
      }
      // Check if response is successful
      if (response && response.Properties && response.Properties.length > 0) {
        const acknowledgementNumber = response.Properties[0].acknowldgementNumber;
        // Clear session storage on successful submission
        Digit.SessionStorage.delete(sessionKey);

        setShowToast({
          key: "success",
          label: t("PT_MUTATION_SUBMITTED_SUCCESSFULLY"),
          transitionTime: 3000,
        });

        setTimeout(() => {
          history.push(`/${window.contextPath}/employee/pt/acknowledgement?acknowledgementNumber=${acknowledgementNumber}&tenantId=${tenantId}&purpose=apply&status=success`);
        }, 2000);
      } else {
        console.error("Invalid response structure:", response);
        throw new Error("No response from mutation API");
      }
    } catch (error) {
      console.error("Mutation submission error:", error);

      setShowToast({
        key: "error",
        label: t("PT_MUTATION_SUBMISSION_FAILED"),
        transitionTime: 5000,
      });
      setIsSubmitting(false);
    }
  };

  const onSecondayActionClick = () => {
    if (currentKey === 1) {
      // Clear session storage when leaving the mutation flow
      Digit.SessionStorage.delete(sessionKey);
      history.goBack();
      return;
    }

    setCurrentStep((prev) => prev - 1);
    setCurrentKey((prev) => prev - 1);
  };

  const getNextActionLabel = () => {
    if (filteredConfig?.[0]?.form?.[0]?.body?.[0]?.isLast) {
      return t("PT_SUBMIT");
    }
    return t("PT_NEXT");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !propertyData) {
    return (
      <div>
        <HeaderComponent>{t("PT_TRANSFER_OWNERSHIP")}</HeaderComponent>
        <div className="error-message">{t("PT_PROPERTY_NOT_FOUND")}</div>
      </div>
    );
  }

  const textStyles = {
    color: "#0B4B66",
    fontWeight: "700",
    fontSize: "32px",
    marginBottom: "1.5rem"
  }
  return (
    <React.Fragment>
      <HeaderComponent styles={textStyles}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div styles={textStyles}>{t("PT_MUTATION_TRANSFER_HEADER")}</div>
          <Tag
            type={"monochrome"}
            label={`${t("PT_PROPERTY_TAX_UNIQUE_ID")}: ${consumerCode}`}
            showIcon={true}
          />
        </div>
      </HeaderComponent>
      <Stepper
        customSteps={["PT_TRANSFEREE_DETAILS", "PT_DOCUMENT_DETAILS", "PT_REVIEW_DETAILS"]}
        onStepClick={onStepClick}
        currentStep={currentStep + 1}
        activeSteps={activeSteps}
        style={{marginBottom:"24px"}}
      />
      <FormComposerV2
        config={filteredConfig?.[0]?.form.map((config) => {
          return {
            ...config,
            body: config?.body.filter((a) => !a.hideInEmployee),
          };
        })}
        onSubmit={onSubmit}
        showSecondaryLabel={currentKey > 1 ? true : false}
        secondaryLabel={t("PT_BACK")}
        actionClassName="actionBarClass transfer-ownership-actionbar"
        className="transfer-ownership-form"
        cardClassName="transfer-ownership-card"
        noCardStyle={true}
        onSecondayActionClick={onSecondayActionClick}
        label={getNextActionLabel()}
      />
      {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={showToast?.label}
          transitionTime={showToast.transitionTime}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </React.Fragment>
  );
};

export default TransferOwnership;