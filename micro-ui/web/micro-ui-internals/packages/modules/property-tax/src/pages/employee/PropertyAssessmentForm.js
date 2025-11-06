import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { FormComposerV2, Stepper, HeaderComponent, Loader, Toast } from "@egovernments/digit-ui-components";
import { PropertyRegistrationConfig } from "../../configs/employee/PropertyRegistrationConfig";
import AddPropertyPopup from "../../components/AddPropertyPopup";

const PropertyAssessmentForm = ({ userType = "employee" }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const stepFromUrl = searchParams.get('step');
  const purpose = searchParams.get('purpose') || 'create'; // 'create', 'update', or 'reassess'
  const propertyIdFromUrl = searchParams.get('propertyId');
  const tenantIdFromUrl = searchParams.get('tenantId');
  const assessmentIdFromUrl = searchParams.get('assessmentId');
  const financialYearFromUrl = searchParams.get('FY');
  const tenantId = tenantIdFromUrl || Digit?.ULBService?.getCurrentTenantId();

  const isUpdateMode = !!(purpose === 'update' && propertyIdFromUrl);
  const isReassessMode = !!(purpose === 'reassess' && propertyIdFromUrl && assessmentIdFromUrl);
  const isCitizen = userType === "citizen";

  // Session storage key for this form
  const sessionKey = `PT_PROPERTY_REGISTRATION_${tenantId}_${(isUpdateMode || isReassessMode) ? propertyIdFromUrl : 'new'}`;
  const popupSeenKey = `PT_POPUP_SEEN_${tenantId}`;

  // Initialize state from URL or session storage
  const getInitialState = () => {
    try {
      // In reassess mode, always start at step 4 (summary) unless step is specified
      if (isReassessMode) {
        const stepNumber = stepFromUrl ? parseInt(stepFromUrl) - 1 : 4; // Default to summary step
        return {
          currentStep: stepNumber >= 0 && stepNumber < 5 ? stepNumber : 4,
          formData: {},
        };
      }

      // In update mode, don't load from session storage initially - let API data load first
      if (isUpdateMode) {
        const stepNumber = stepFromUrl ? parseInt(stepFromUrl) - 1 : 0;
        return {
          currentStep: stepNumber >= 0 && stepNumber < 5 ? stepNumber : 0,
          formData: {},
        };
      }

      // Check if coming from a fresh URL without any referrer context
      // If user navigates directly to assessment-form (not from within the app flow),
      // clear any stale session data
      const isDirectNavigation = !document.referrer ||
                                  !document.referrer.includes('assessment-form') ||
                                  document.referrer.includes('pt-acknowledgment');

      const savedData = Digit.SessionStorage.get(sessionKey);

      // Clear stale data if user is coming from acknowledgment page or direct navigation to step 1
      if (isDirectNavigation && (!stepFromUrl || stepFromUrl === '1')) {
        Digit.SessionStorage.del(sessionKey);
        Digit.SessionStorage.del(popupSeenKey);
        return {
          currentStep: 0,
          formData: {},
        };
      }

      // If URL has step parameter, use it
      if (stepFromUrl) {
        const stepNumber = parseInt(stepFromUrl) - 1; // Convert to 0-based index
        return {
          currentStep: stepNumber >= 0 && stepNumber < 5 ? stepNumber : 0,
          formData: savedData?.formData || {},
        };
      }

      // If no URL parameter but session data exists, use session data
      if (savedData) {
        return {
          currentStep: savedData.currentStep || 0,
          formData: savedData.formData || {},
        };
      }
    } catch (e) {
      console.error("Error loading session data:", e);
    }
    return {
      currentStep: 0,
      formData: {},
    };
  };

  const initialState = getInitialState();

  // Check if popup has been shown before
  const hasSeenPopup = () => {
    try {
      return Digit.SessionStorage.get(popupSeenKey) === true;
    } catch (e) {
      return false;
    }
  };

  const [currentStep, setCurrentStep] = useState(initialState.currentStep);
  const [formData, setFormData] = useState(initialState.formData);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showRequiredDocsPopup, setShowRequiredDocsPopup] = useState(!isUpdateMode && !isReassessMode && !hasSeenPopup());
  const [submitTrigger, setSubmitTrigger] = useState(false);
  const [propertyData, setPropertyData] = useState(null);
  const [fetchedPropertyData, setFetchedPropertyData] = useState(null);
  const [isPropertyDataLoaded, setIsPropertyDataLoaded] = useState(false);
  const [existingAssessment, setExistingAssessment] = useState(null);
  const [taxCalculation, setTaxCalculation] = useState(null);
  const [adhocPenalty, setAdhocPenalty] = useState(0);
  const [adhocRebate, setAdhocRebate] = useState(0);
  const [importantDates, setImportantDates] = useState(null);
  const [billingSlabs, setBillingSlabs] = useState([]);

  // Citizen-specific state for declaration
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");

  const config = PropertyRegistrationConfig(t, formData, loading, {
    isReassessMode,
    taxCalculation,
    existingAssessment,
    financialYear: financialYearFromUrl,
    assessmentId: assessmentIdFromUrl,
    importantDates,
    billingSlabs,
    isCitizen,
    termsAccepted,
    termsError,
    onTermsChange: (checked) => {
      setTermsAccepted(checked);
      if (checked) {
        setTermsError("");
      }
    }
  });
  const currentConfig = config[currentStep];

  // API hook for fetching property details in update or reassess mode
  const { isLoading: isFetchingProperty, data: propertyResponse } = (isUpdateMode || isReassessMode)
    ? Digit.Hooks.useCustomAPIHook({
        url: "/property-services/property/_search",
        params: {
          tenantId: tenantId,
          propertyIds: propertyIdFromUrl,
          audit: false
        },
        config: {
          enabled: !!((isUpdateMode || isReassessMode) && propertyIdFromUrl && tenantId),
          select: (data) => data?.Properties || [],
        },
      })
    : { isLoading: false, data: null };

  // API hook for fetching existing assessment in reassess mode
  const { isLoading: isFetchingAssessment, data: assessmentResponse } = isReassessMode && assessmentIdFromUrl
    ? Digit.Hooks.useCustomAPIHook({
        url: "/property-services/assessment/_search",
        params: {
          tenantId: tenantId,
          assessmentNumbers: assessmentIdFromUrl
        },
        config: {
          enabled: !!(isReassessMode && assessmentIdFromUrl && tenantId),
          select: (data) => data?.Assessments || [],
        },
      })
    : { isLoading: false, data: null };

  // API hook for property creation
  const { isLoading: isCreating, data: createResponse, revalidate: createProperty } = Digit.Hooks.useCustomAPIHook({
    url: "/property-services/property/_create",
    params: {},
    body: propertyData,
    config: {
      enabled: submitTrigger && !!propertyData && !isUpdateMode,
      select: (data) => data,
    },
  });

  // API hook for property update
  const { isLoading: isUpdating, data: updateResponse, revalidate: updateProperty } = Digit.Hooks.useCustomAPIHook({
    url: "/property-services/property/_update",
    params: {},
    body: propertyData,
    config: {
      enabled: submitTrigger && !!propertyData && isUpdateMode,
      select: (data) => data,
    },
  });

  // Load property data in update or reassess mode
  useEffect(() => {
    if (propertyResponse && propertyResponse.length > 0 && (isUpdateMode || isReassessMode) && !isPropertyDataLoaded) {
      const property = propertyResponse[0];
      setFetchedPropertyData(property);
      // Transform property data to form data format
      const transformedFormData = transformPropertyToFormData(property);
      setFormData(transformedFormData);
      setIsPropertyDataLoaded(true);
    }
  }, [propertyResponse, isUpdateMode, isReassessMode, isPropertyDataLoaded]);

  // Load existing assessment data in reassess mode
  useEffect(() => {
    if (assessmentResponse && assessmentResponse.length > 0 && isReassessMode) {
      const assessment = assessmentResponse[0];
      setExistingAssessment(assessment);

      // Initialize adhoc penalty and rebate from existing assessment
      if (assessment.additionalDetails) {
        setAdhocPenalty(assessment.additionalDetails.adhocPenalty || 0);
        setAdhocRebate(assessment.additionalDetails.adhocExemption || 0);
      }
    }
  }, [assessmentResponse, isReassessMode]);

  // Fetch Important Dates from MDMS
  useEffect(() => {
    const fetchImportantDates = async () => {
      if (isReassessMode && tenantId && financialYearFromUrl) {
        try {
          const mdmsResponse = await Digit.MDMSService.getMultipleTypes(tenantId, "PropertyTax", ["Rebate", "Penalty", "Interest", "FireCess"]);

          if (mdmsResponse?.PropertyTax) {
            const { Rebate, Penalty, Interest, FireCess } = mdmsResponse.PropertyTax;

            // Find correct dates for the financial year (same as mono-ui)
            const findCorrectDateObj = (fyear, data) => {
              if (!data || !Array.isArray(data)) return null;
              return data.find(item => item.fromFY === fyear);
            };

            const rebate = findCorrectDateObj(financialYearFromUrl, Rebate);
            const penalty = findCorrectDateObj(financialYearFromUrl, Penalty);
            const interest = findCorrectDateObj(financialYearFromUrl, Interest);
            const fireCess = findCorrectDateObj(financialYearFromUrl, FireCess);

            setImportantDates({ rebate, penalty, interest, fireCess });
          }
        } catch (error) {
          console.error("Important dates fetch error:", error);
        }
      }
    };

    fetchImportantDates();
  }, [isReassessMode, tenantId, financialYearFromUrl]);

  // Fetch tax calculation for reassessment when property data is loaded
  useEffect(() => {
    const fetchTaxCalculation = async () => {
      if (isReassessMode && propertyIdFromUrl && tenantId && isPropertyDataLoaded) {
        try {
          setLoading(true);

          // Call PT calculator API to get demand/calculation
          const result = await Digit.CustomService.getResponse({
            url: "/pt-calculator-v2/propertytax/v2/_estimate",
            method: "POST",
            body: {
              Assessment: {
                financialYear: financialYearFromUrl || "2024-25",
                propertyId: propertyIdFromUrl,
                tenantId: tenantId,
                source: "MUNICIPAL_RECORDS",
                channel: "COUNTER"
              }
            }
          });

          if (result?.Calculation && result.Calculation.length > 0) {
            const calculation = result.Calculation[0];
            setTaxCalculation(calculation);

            // Fetch billing slab details if billingSlabIds exist
            if (calculation.billingSlabIds && calculation.billingSlabIds.length > 0) {
              try {
                const billingSlabResponse = await Digit.MDMSService.getMultipleTypes(tenantId, "PropertyTax", ["PropertyTaxSlabs"]);

                if (billingSlabResponse?.PropertyTax?.PropertyTaxSlabs) {
                  const allSlabs = billingSlabResponse.PropertyTax.PropertyTaxSlabs;

                  // Match billing slab IDs with actual slab data
                  const matchedSlabs = calculation.billingSlabIds.map(slabId => {
                    const id = slabId.split("|")[0]; // Extract ID before pipe
                    return allSlabs.find(slab => slab.id === id);
                  }).filter(Boolean);

                  setBillingSlabs(matchedSlabs);
                }
              } catch (slabError) {
                console.error("Billing slab fetch error:", slabError);
              }
            }
          }
        } catch (error) {
          console.error("Tax calculation fetch error:", error);
          setToast({
            label: t("PT_TAX_CALCULATION_FETCH_FAILED"),
            type: "error"
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTaxCalculation();
  }, [isReassessMode, propertyIdFromUrl, tenantId, isPropertyDataLoaded, financialYearFromUrl, t]);

  // Handle create API response
  useEffect(() => {
    if (createResponse && submitTrigger) {
      // API returns Properties array or direct array
      const propertiesArray = createResponse?.Properties || (Array.isArray(createResponse) ? createResponse : null);

      if (propertiesArray && propertiesArray.length > 0) {
        const createdProperty = propertiesArray[0];

        // Clear session storage on successful submission
        Digit.SessionStorage.set(sessionKey, null);
        Digit.SessionStorage.set(popupSeenKey, null);

        // Redirect to acknowledgment page
        const params = new URLSearchParams({
          purpose: 'create',
          status: 'success',
          propertyId: createdProperty.propertyId,
          tenantId: createdProperty.tenantId,
          secondNumber: createdProperty.acknowldgementNumber
        });

        const contextPath = isCitizen ? "citizen" : "employee";
        history.push(
          `/${window.contextPath}/${contextPath}/pt/pt-acknowledgment?${params.toString()}`
        );
      } else {
        setToast({
          label: createResponse?.Errors?.[0]?.message || t("PT_PROPERTY_REGISTRATION_ERROR"),
          type: "error"
        });
      }

      setLoading(false);
      setSubmitTrigger(false);
    }
  }, [createResponse, submitTrigger, t]);

  // Handle update API response
  useEffect(() => {
    if (!submitTrigger || isUpdating) return;

    if (updateResponse) {
      // Check for errors first
      if (updateResponse?.Errors && updateResponse.Errors.length > 0) {
        setToast({
          label: updateResponse.Errors[0].message || t("PT_PROPERTY_UPDATE_ERROR"),
          type: "error"
        });
        setLoading(false);
        setSubmitTrigger(false);
        return;
      }

      // API returns Properties array or direct array
      const propertiesArray = updateResponse?.Properties || (Array.isArray(updateResponse) ? updateResponse : null);

      if (propertiesArray && propertiesArray.length > 0) {
        const updatedProperty = propertiesArray[0];

        // Clear session storage on successful submission
        Digit.SessionStorage.set(sessionKey, null);
        Digit.SessionStorage.set(popupSeenKey, null);

        // Redirect to acknowledgment page
        const params = new URLSearchParams({
          purpose: 'update',
          status: 'success',
          propertyId: updatedProperty.propertyId,
          tenantId: updatedProperty.tenantId,
          secondNumber: updatedProperty.acknowldgementNumber
        });

        const contextPath = isCitizen ? "citizen" : "employee";
        history.push(
          `/${window.contextPath}/${contextPath}/pt/pt-acknowledgment?${params.toString()}`
        );
      } else {
        setToast({
          label: t("PT_PROPERTY_UPDATE_ERROR"),
          type: "error"
        });
      }

      setLoading(false);
      setSubmitTrigger(false);
    }
  }, [updateResponse, submitTrigger, isUpdating, t, history, sessionKey, popupSeenKey]);

  // Handle API loading state
  useEffect(() => {
    if (isCreating || isUpdating) {
      setLoading(true);
    } else if (isFetchingProperty || isFetchingAssessment) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isCreating, isUpdating, isFetchingProperty, isFetchingAssessment]);

  // Save form data to session storage whenever it changes
  useEffect(() => {
    try {
      const dataToSave = {
        currentStep,
        formData,
      };
      Digit.SessionStorage.set(sessionKey, dataToSave);
    } catch (e) {
      console.error("Error saving to session storage:", e);
    }
  }, [currentStep, formData, sessionKey]);

  // Update URL with current step
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('step', (currentStep + 1).toString()); // Convert to 1-based for URL
    const newUrl = `${location.pathname}?${newSearchParams.toString()}`;

    // Only update if URL actually changed to avoid infinite loops
    if (location.search !== `?${newSearchParams.toString()}`) {
      history.replace(newUrl);
    }
  }, [currentStep, location.pathname, location.search, history]);

  const stepLabels = [
    "PT_PROPERTY_ADDRESS_SUB_HEADER",
    "PT_ASSESMENT_INFO_SUB_HEADER",
    "PT_OWNERSHIP_INFO_SUB_HEADER",
    "PT_DOCUMENT_INFO",
    "PT_COMMON_SUMMARY"
  ];

  const handleFormSubmit = (data) => {
    const currentStepKey = currentConfig.key;

    // Validate declaration for citizens on the summary step (Step 5)
    if (isCitizen && currentStepKey === "summary" && !termsAccepted) {
      setTermsError("PT_PLEASE_ACCEPT_DECLARATION");

      // Show alert
      alert(t("PT_PLEASE_ACCEPT_DECLARATION") || "Please check the declaration box to proceed further");

      // Scroll to declaration section
      setTimeout(() => {
        const declarationElement = document.querySelector(".declaration-container");
        if (declarationElement) {
          declarationElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return; // Don't proceed if declaration is not accepted
    }

    // Validate assessment details (Step 2) before proceeding
    if (currentStepKey === "assessment-info") {
      const assessmentConfig = currentConfig.body.find(field => field.component === "PTAssessmentDetails");
      if (assessmentConfig?.populators?.validation?.validateAssessmentDetails) {
        const isValid = assessmentConfig.populators.validation.validateAssessmentDetails();
        if (!isValid) {
          return; // Don't proceed if validation fails
        }
      }
    }

    // Validate ownership details (Step 3) before proceeding
    if (currentStepKey === "ownership-info") {
      const ownershipConfig = currentConfig.body.find(field => field.component === "PTOwnershipDetails");
      if (ownershipConfig?.populators?.validation?.validateOwnershipDetails) {
        const isValid = ownershipConfig.populators.validation.validateOwnershipDetails();
        if (!isValid) {
          return; // Don't proceed if validation fails
        }
      } else {
        console.error("Validation function not found!");
      }
    }

    setFormData(prev => ({
      ...prev,
      [currentStepKey]: {
        ...prev[currentStepKey],
        ...data
      }
    }));

    if (currentStep < config.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    // Transform form data to API format
    const apiPayload = transformFormDataToAPIFormat(formData);

    // For reassessment, update the existing assessment (matching mono-ui flow)
    if (isReassessMode) {
      try {
        setLoading(true);

        // Get adhoc values from config (may have been updated through popup)
        const currentConfig = config.find(step => step.key === "summary");
        const summaryCustomProps = (currentConfig && currentConfig.body && currentConfig.body[0] && currentConfig.body[0].customProps) || {};
        const finalAdhocPenalty = typeof summaryCustomProps.adhocPenalty !== 'undefined' ? summaryCustomProps.adhocPenalty : adhocPenalty;
        const finalAdhocRebate = typeof summaryCustomProps.adhocRebate !== 'undefined' ? summaryCustomProps.adhocRebate : adhocRebate;

        // First, fetch the latest assessment data (matching mono-ui)
        const assessmentSearchResponse = await Digit.CustomService.getResponse({
          url: "/property-services/assessment/_search",
          method: "POST",
          params: {
            tenantId: tenantId,
            assessmentNumbers: assessmentIdFromUrl
          },
          body: {}
        });

        if (!assessmentSearchResponse?.Assessments || assessmentSearchResponse.Assessments.length === 0) {
          setToast({
            label: t("PT_ASSESSMENT_NOT_FOUND"),
            type: "error"
          });
          setLoading(false);
          return;
        }

        const existingAssessmentData = assessmentSearchResponse.Assessments[0];

        // Update the assessment with new adhoc values (matching mono-ui)
        const assessmentUpdatePayload = {
          Assessment: {
            ...existingAssessmentData,
            assessmentDate: Date.now(),
            status: "ACTIVE",
            additionalDetails: {
              ...existingAssessmentData.additionalDetails,
              adhocPenalty: parseFloat(finalAdhocPenalty) || 0,
              adhocExemption: parseFloat(finalAdhocRebate) || 0
            }
          }
        };

        const assessmentUpdateResponse = await Digit.CustomService.getResponse({
          url: "/property-services/assessment/_update",
          method: "POST",
          body: assessmentUpdatePayload,
          params: { tenantId: tenantId }
        });

        if (assessmentUpdateResponse?.Assessments && assessmentUpdateResponse.Assessments.length > 0) {
          // Clear session storage
          Digit.SessionStorage.set(sessionKey, null);
          Digit.SessionStorage.set(popupSeenKey, null);

          // Redirect to acknowledgment page matching mono-ui pattern
          const params = new URLSearchParams({
            purpose: 'reassess',
            status: 'success',
            propertyId: propertyIdFromUrl,
            tenantId: tenantId,
            secondNumber: assessmentIdFromUrl,
            FY: financialYearFromUrl
          });

          const contextPath = isCitizen ? "citizen" : "employee";
          history.push(
            `/${window.contextPath}/${contextPath}/pt/pt-acknowledgment?${params.toString()}`
          );
        } else {
          setToast({
            label: assessmentUpdateResponse?.Errors?.[0]?.message || t("PT_REASSESSMENT_FAILED"),
            type: "error"
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Reassessment error:", error);
        setToast({
          label: error?.response?.data?.Errors?.[0]?.message || t("PT_REASSESSMENT_FAILED"),
          type: "error"
        });
        setLoading(false);
      }
    } else {
      // For create/update mode, use the existing flow
      setPropertyData(apiPayload);
      setSubmitTrigger(true);
      setLoading(true);
    }
  };

  // Transform property API data to form data format (for update mode)
  const transformPropertyToFormData = (property) => {
    // Extract property type parts (e.g., "BUILTUP.INDEPENDENTPROPERTY")
    const propertyTypeParts = property.propertyType?.split('.') || [];
    const propertyTypeMajor = propertyTypeParts.length > 1 ? propertyTypeParts[0] : null;
    const propertyTypeCode = propertyTypeParts.length > 1 ? propertyTypeParts[1] : property.propertyType;

    // Map property type code to name
    const propertyTypeMap = {
      "VACANT": "Vacant Land",
      "INDEPENDENTPROPERTY": "Independent Building",
      "SHAREDPROPERTY": "Flat/Part of the building"
    };

    // Extract usage category parts (e.g., "RESIDENTIAL" or "NONRESIDENTIAL.OTHERS")
    const usageCategoryParts = property.usageCategory?.split('.') || [];
    let usageCategoryMajor, usageCategoryMinor;

    if (usageCategoryParts.length > 1) {
      usageCategoryMajor = usageCategoryParts[0];
      usageCategoryMinor = usageCategoryParts[1];
    } else {
      // If no dot, it's a major category only (like "RESIDENTIAL")
      usageCategoryMajor = usageCategoryParts[0];
      usageCategoryMinor = null;
    }

    // Map usage category to name
    const usageCategoryMap = {
      "RESIDENTIAL": "Residential",
      "NONRESIDENTIAL": "Non Residential",
      "OTHERS": "Others",
      "COMMERCIAL": "Commercial",
      "INDUSTRIAL": "Industrial"
    };

    // Extract ownership category parts (e.g., "INDIVIDUAL.SINGLEOWNER")
    const ownershipParts = property.ownershipCategory?.split('.') || [];
    const ownershipType = ownershipParts.length > 1 ? ownershipParts[1] : ownershipParts[0];

    // Map ownership type to name
    const ownershipTypeMap = {
      "SINGLEOWNER": "Single Owner",
      "MULTIPLEOWNERS": "Multiple Owners",
      "INSTITUTIONALPRIVATE": "Institutional Private",
      "INSTITUTIONALGOVERNMENT": "Institutional Government"
    };

    // Map gender to name
    const genderMap = {
      "MALE": "Male",
      "FEMALE": "Female",
      "TRANSGENDER": "Transgender"
    };

    // Map relationship to name
    const relationshipMap = {
      "FATHER": "Father",
      "HUSBAND": "Husband"
    };

    // Transform owners data
    const owners = property.owners || [];
    const firstOwner = owners[0] || {};
    const isInstitutional = firstOwner.ownerType === "INSTITUTIONAL";
    const isMultipleOwners = owners.length > 1;

    let ownershipDetails = {};
    if (isInstitutional) {
      ownershipDetails = {
        ownerName: firstOwner.name,
        mobileNumber: firstOwner.mobileNumber,
        ...(firstOwner.emailId ? { emailId: firstOwner.emailId } : {}),
        ...(firstOwner.altContactNumber ? { altContactNumber: firstOwner.altContactNumber } : {}),
        ...(firstOwner.permanentAddress ? { correspondenceAddress: firstOwner.permanentAddress } : {}),
        sameAsPropertyAddress: false, // Not available in API response
        ...(firstOwner.institutionId ? { institutionType: firstOwner.institutionId } : {}),
        ...(firstOwner.designation ? { designation: firstOwner.designation } : {}),
        ...(firstOwner.documents?.[0]?.fileStoreId ? { documentId: firstOwner.documents[0].fileStoreId } : {}),
        ...(firstOwner.documents?.[0]?.documentType ? { documentIdType: firstOwner.documents[0].documentType } : {})
      };
    } else if (isMultipleOwners) {
      ownershipDetails = {
        owners: owners.map(owner => ({
          ownerName: owner.name,
          mobileNumber: owner.mobileNumber,
          ...(owner.emailId ? { emailId: owner.emailId } : {}),
          ...(owner.fatherOrHusbandName ? { guardianName: owner.fatherOrHusbandName } : {}),
          ...(owner.gender ? {
            gender: [{
              code: owner.gender.toUpperCase(),
              name: genderMap[owner.gender.toUpperCase()] || owner.gender,
              active: true
            }]
          } : {}),
          ...(owner.permanentAddress ? { correspondenceAddress: owner.permanentAddress } : {}),
          sameAsPropertyAddress: false, // Not available in API response
          ownershipPercentage: parseFloat(owner.ownerShipPercentage) || 0,
          specialCategory: owner.ownerType === "NONE" ? "NONE" : owner.ownerType,
          ...(owner.relationship ? {
            relationship: [{
              code: owner.relationship.toUpperCase(),
              name: relationshipMap[owner.relationship.toUpperCase()] || owner.relationship,
              active: true
            }]
          } : {}),
          ...(owner.documents?.[0]?.fileStoreId ? { documentId: owner.documents[0].fileStoreId } : {}),
          ...(owner.documents?.[0]?.documentType ? { documentIdType: owner.documents[0].documentType } : {})
        }))
      };
    } else {
      ownershipDetails = {
        ownerName: firstOwner.name,
        mobileNumber: firstOwner.mobileNumber,
        ...(firstOwner.emailId ? { emailId: firstOwner.emailId } : {}),
        ...(firstOwner.fatherOrHusbandName ? { guardianName: firstOwner.fatherOrHusbandName } : {}),
        ...(firstOwner.gender ? {
          gender: [{
            code: firstOwner.gender.toUpperCase(),
            name: genderMap[firstOwner.gender.toUpperCase()] || firstOwner.gender,
            active: true
          }]
        } : {}),
        ...(firstOwner.permanentAddress ? { correspondenceAddress: firstOwner.permanentAddress } : {}),
        sameAsPropertyAddress: false, // Not available in API response
        ownershipPercentage: parseFloat(firstOwner.ownerShipPercentage) || 100,
        specialCategory: firstOwner.ownerType === "NONE" ? "NONE" : firstOwner.ownerType,
        ...(firstOwner.relationship ? {
          relationship: [{
            code: firstOwner.relationship.toUpperCase(),
            name: relationshipMap[firstOwner.relationship.toUpperCase()] || firstOwner.relationship,
            active: true
          }]
        } : {}),
        ...(firstOwner.documents?.[0]?.fileStoreId ? { documentId: firstOwner.documents[0].fileStoreId } : {}),
        ...(firstOwner.documents?.[0]?.documentType ? { documentIdType: firstOwner.documents[0].documentType } : {})
      };
    }

    // Group units by floor
    const units = property.units || [];
    const floorMap = new Map();
    units.forEach(unit => {
      const floorNo = String(unit.floorNo || 0);
      if (!floorMap.has(floorNo)) {
        floorMap.set(floorNo, {
          floorNo: floorNo,
          units: []
        });
      }
      floorMap.get(floorNo).units.push({
        usageType: unit.unitType || unit.usageCategory,
        subUsageType: unit.usageCategory,
        occupancy: unit.occupancyType === "SELFOCCUPIED" ? "OWNER" : unit.occupancyType,
        builtUpArea: unit.constructionDetail?.builtUpArea || 0,
        arv: parseFloat(unit.arv) || 0,
        usageForDueMonths: unit.additionalDetails?.usageForDueMonths || "UNOCCUPIED",
        rentedForMonths: unit.additionalDetails?.rentedformonths || null
      });
    });

    const floors = Array.from(floorMap.values());

    return {
      "property-address": {
        tenantId: property.tenantId,
        ...(property.address?.doorNo && property.address.doorNo !== "" ? { doorNo: property.address.doorNo } : {}),
        ...(property.address?.buildingName && property.address.buildingName !== "" ? { buildingName: property.address.buildingName } : {}),
        ...(property.address?.street && property.address.street !== "" ? { street: property.address.street } : {}),
        ...(property.address?.locality?.code ? {
          locality: [{
            code: property.address.locality.code,
            name: property.address.locality.name,
            area: property.address.locality.area
          }]
        } : {}),
        ...(property.address?.pincode && property.address.pincode !== "" ? { pincode: property.address.pincode } : {}),
        ...(property.oldPropertyId && property.oldPropertyId !== "" ? { existingPropertyId: property.oldPropertyId || property.propertyId || "" } : {}),
        ...(property.surveyId && property.surveyId !== "" ? { surveyId: property.surveyId } : {}),
        ...(property.additionalDetails?.yearConstruction ? {
          yearOfCreation: {
            code: property.additionalDetails.yearConstruction,
            name: property.additionalDetails.yearConstruction,
            i18nKey: property.additionalDetails.yearConstruction
          }
        } : {})
      },
      "assessment-info": {
        propertyType: [{
          name: propertyTypeMap[propertyTypeCode] || propertyTypeCode,
          code: propertyTypeCode,
          active: true,
          ...(propertyTypeMajor ? { propertyType: propertyTypeMajor } : {})
        }],
        usageCategory: usageCategoryMinor ? [{
          code: usageCategoryMinor,
          usageCategoryMajor: usageCategoryMajor,
          name: usageCategoryMinor,
          active: true
        }] : [{
          code: usageCategoryMajor,
          name: usageCategoryMap[usageCategoryMajor] || usageCategoryMajor,
          active: true
        }],
        ...(property.additionalDetails?.vasikaNo ? { vasikaNo: property.additionalDetails.vasikaNo } : {}),
        ...(property.additionalDetails?.vasikaDate ? { vasikaDate: property.additionalDetails.vasikaDate } : {}),
        ...(property.additionalDetails?.allotmentNo ? { allotmentNo: property.additionalDetails.allotmentNo } : {}),
        ...(property.additionalDetails?.allotmentDate ? { allotmentDate: property.additionalDetails.allotmentDate } : {}),
        ...(property.additionalDetails?.businessName ? { businessName: property.additionalDetails.businessName } : {}),
        ...(property.additionalDetails?.remarks ? { remarks: property.additionalDetails.remarks } : {}),
        inflammableMaterial: property.additionalDetails?.inflammable || false,
        heightOfProperty: property.additionalDetails?.heightAbove36Feet || false,
        conditionalFields: {
          plotSize: parseFloat(property.landArea) || 0,
          noOfFloors: {
            code: property.noOfFloors,
            name: String(property.noOfFloors)
          },
          floors: floors,
          units: units.map(unit => ({
            floorNo: String(unit.floorNo || 0),
            usageType: unit.unitType || unit.usageCategory,
            subUsageType: unit.usageCategory,
            occupancy: unit.occupancyType === "SELFOCCUPIED" ? "OWNER" : unit.occupancyType,
            builtUpArea: unit.constructionDetail?.builtUpArea || 0,
            arv: parseFloat(unit.arv) || 0,
            usageForDueMonths: unit.additionalDetails?.usageForDueMonths || "UNOCCUPIED",
            ...(unit.additionalDetails?.rentedformonths ? { rentedForMonths: unit.additionalDetails.rentedformonths } : {})
          }))
        }
      },
      "ownership-info": {
        ownershipType: [{
          code: ownershipType,
          name: ownershipTypeMap[ownershipType] || ownershipType,
          active: true
        }],
        ownershipDetails: ownershipDetails
      },
      "document-info": {
        documents: property.documents?.map(doc => ({
          documentType: doc.documentType,
          fileStoreId: doc.fileStoreId
        })) || []
      }
    };
  };

  const transformFormDataToAPIFormat = (formData) => {
    const propertyAddress = formData["property-address"] || {};
    const assessmentInfo = formData["assessment-info"] || {};
    const ownershipInfo = formData["ownership-info"] || {};
    const ownerDetails = ownershipInfo.ownershipDetails || {};
    const documentInfo = formData["document-info"] || {};
    // Get conditional fields data
    const conditionalFields = assessmentInfo.conditionalFields || {};
    const tenantId = Digit?.ULBService?.getCurrentTenantId() || "mz";

    // Get property type - handle both string and object
    let propertyTypeCode = assessmentInfo.propertyType;
    if (Array.isArray(assessmentInfo.propertyType)) {
      propertyTypeCode = assessmentInfo.propertyType[0]?.code || assessmentInfo.propertyType[0];
    } else if (typeof assessmentInfo.propertyType === 'object' && assessmentInfo.propertyType !== null) {
      propertyTypeCode = assessmentInfo.propertyType.code || assessmentInfo.propertyType.value;
    }

    // Get the property type major category from MDMS if needed
    // For now, assume BUILTUP as default major category
    const propertyTypeFull = propertyTypeCode?.includes('.') ? propertyTypeCode : `BUILTUP.${propertyTypeCode}`;

    // Extract usage category - combine major and minor parts
    const usageCategoryObj = assessmentInfo.usageCategory?.[0] || assessmentInfo.usageCategory || {};
    let usageCategoryMinor, usageCategoryMajor, usageCategoryCode;

    if (typeof usageCategoryObj === 'string') {
      // It's a plain string like "RESIDENTIAL"
      usageCategoryCode = usageCategoryObj;
      const parts = usageCategoryCode.split('.');
      if (parts.length > 1) {
        usageCategoryMajor = parts[0];
        usageCategoryMinor = parts[1];
      } else {
        usageCategoryMajor = usageCategoryCode;
        usageCategoryMinor = null;
      }
    } else {
      // It's an object with code and usageCategoryMajor
      usageCategoryMinor = usageCategoryObj.code || usageCategoryObj.value;
      usageCategoryMajor = usageCategoryObj.usageCategoryMajor;

      // Construct full usage category code
      if (usageCategoryMajor && usageCategoryMinor) {
        usageCategoryCode = `${usageCategoryMajor}.${usageCategoryMinor}`;
      } else if (usageCategoryMinor) {
        usageCategoryCode = usageCategoryMinor;
      } else if (usageCategoryMajor) {
        usageCategoryCode = usageCategoryMajor;
      } else {
        usageCategoryCode = null;
      }
    }
    // Get ownership category with proper prefix
    const ownershipTypeCode = ownershipInfo.ownershipType?.[0]?.code || ownershipInfo.ownershipType?.code || ownershipInfo.ownershipType;
    let ownershipCategory = ownershipTypeCode;
    if (ownershipTypeCode === "SINGLEOWNER") {
      ownershipCategory = "INDIVIDUAL.SINGLEOWNER";
    } else if (ownershipTypeCode === "MULTIPLEOWNERS") {
      ownershipCategory = "INDIVIDUAL.MULTIPLEOWNERS";
    } else if (ownershipTypeCode === "INSTITUTIONALPRIVATE") {
      ownershipCategory = "INSTITUTIONAL.PRIVATE";
    } else if (ownershipTypeCode === "INSTITUTIONALGOVERNMENT") {
      ownershipCategory = "INSTITUTIONAL.GOVERNMENT";
    }

    // Helper function to capitalize first letter
    const capitalizeFirst = (str) => {
      if (!str) return str;
      if (typeof str !== 'string') return str;
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return {
      Property: {
        ...(isUpdateMode && fetchedPropertyData ? {
          id: fetchedPropertyData.id,
          propertyId: fetchedPropertyData.propertyId,
          accountId: fetchedPropertyData.accountId,
          oldPropertyId: fetchedPropertyData.oldPropertyId,
          status: fetchedPropertyData.status,
          acknowldgementNumber: fetchedPropertyData.acknowldgementNumber,
          auditDetails: fetchedPropertyData.auditDetails
        } : {}),
        tenantId: tenantId,
        surveyId: propertyAddress.surveyId || null,
        propertyType: propertyTypeFull,
        usageCategory: usageCategoryCode,
        usageCategoryMajor: usageCategoryMajor || null,
        usageCategoryMinor: usageCategoryMinor || null,
        ownershipCategory: ownershipCategory,
        source: "MUNICIPAL_RECORDS",
        channel: "CFC_COUNTER",
        creationReason: isReassessMode ? "REASSESSMENT" : (isUpdateMode ? "UPDATE" : "CREATE"),
        noOfFloors: parseInt(conditionalFields.noOfFloors?.code || conditionalFields.noOfFloors || assessmentInfo.noOfFloors?.code || assessmentInfo.noOfFloors) || 1,
        landArea: String(parseFloat(conditionalFields.plotSize) || 0),
        superBuiltUpArea: null,
        workflow: {
          businessService: "PT.CREATE",
          action: isUpdateMode ? "OPEN" : "OPEN",
          moduleName: "PT"
        },
        additionalDetails: {
          yearConstruction: propertyAddress.yearOfCreation?.code || propertyAddress.yearOfCreation || null,
          vasikaNo: assessmentInfo.vasikaNo || null,
          vasikaDate: assessmentInfo.vasikaDate || null,
          allotmentNo: assessmentInfo.allotmentNo || null,
          allotmentDate: assessmentInfo.allotmentDate || null,
          businessName: assessmentInfo.businessName || null,
          remarks: assessmentInfo.remarks || null,
          inflammable: assessmentInfo.inflammableMaterial || false,
          heightAbove36Feet: assessmentInfo.heightOfProperty || false
        },
        address: {
          ...(isUpdateMode && fetchedPropertyData?.address?.id ? { id: fetchedPropertyData.address.id } : {}),
          city: (() => {
            // Get city name from tenant
            const cityCode = tenantId.split('.').pop();
            return capitalizeFirst(cityCode);
          })(),
          doorNo: propertyAddress.doorNo || null,
          buildingName: propertyAddress.buildingName || null,
          street: propertyAddress.street || null,
          locality: {
            code: propertyAddress.locality?.[0]?.code || propertyAddress.locality?.code || propertyAddress.locality,
            area: propertyAddress.locality?.[0]?.area || propertyAddress.locality?.[0]?.name || propertyAddress.locality?.area || propertyAddress.locality?.name || "AREA1"
          },
          pincode: propertyAddress.pincode || null
        },
        owners: (() => {
          const ownershipTypeCode = ownershipInfo.ownershipType?.[0]?.code || ownershipInfo.ownershipType?.code || "";
          const isInstitutional = ownershipTypeCode?.includes("INSTITUTIONAL");
          const isMultipleOwners = ownershipTypeCode === "MULTIPLEOWNERS";

          // Get existing owners for update mode
          const existingOwners = isUpdateMode && fetchedPropertyData ? fetchedPropertyData.owners || [] : [];

          if (isInstitutional) {
            // Institutional ownership
            const existingOwner = existingOwners[0] || {};
            const owner = {
              ...(isUpdateMode && existingOwner.uuid ? {
                uuid: existingOwner.uuid,
                ownerInfoUuid: existingOwner.ownerInfoUuid,
                status: existingOwner.status
              } : {}),
              name: ownerDetails.ownerName,
              mobileNumber: ownerDetails.mobileNumber,
              emailId: ownerDetails.emailId || null,
              altContactNumber: ownerDetails.altContactNumber || null,
              permanentAddress: ownerDetails.correspondenceAddress || null,
              ownerShipPercentage: "100",
              ownerType: "INSTITUTIONAL",
              institutionId: ownerDetails.institutionType?.code || ownerDetails.institutionType,
              designation: ownerDetails.designation || null,
              relationship: null,
              isCorrespondenceAddress: ownerDetails.sameAsPropertyAddress || null
            };

            // Add documents if documentId exists
            if (ownerDetails.documentId && ownerDetails.documentIdType) {
              owner.documents = [{
                documentType: ownerDetails.documentIdType?.code || ownerDetails.documentIdType || "IDENTITYPROOF",
                fileStoreId: ownerDetails.documentId,
                documentUid: ownerDetails.documentId
              }];
            }

            return [owner];
          } else if (isMultipleOwners && ownerDetails.owners) {
            // Multiple owners
            return ownerDetails.owners.map((owner, index) => {
              const existingOwner = existingOwners[index] || {};

              // Extract relationship - handle array or object
              let relationshipCode;
              if (Array.isArray(owner.relationship)) {
                relationshipCode = owner.relationship[0]?.code || owner.relationship[0] || "FATHER";
              } else if (typeof owner.relationship === 'object' && owner.relationship !== null) {
                relationshipCode = owner.relationship.code || "FATHER";
              } else {
                relationshipCode = owner.relationship || "FATHER";
              }

              // Extract gender - handle array or object
              let genderCode;
              if (Array.isArray(owner.gender)) {
                genderCode = owner.gender[0]?.code || owner.gender[0];
              } else if (typeof owner.gender === 'object' && owner.gender !== null) {
                genderCode = owner.gender.code;
              } else {
                genderCode = owner.gender;
              }

              const ownerObj = {
                ...(isUpdateMode && existingOwner.uuid ? {
                  uuid: existingOwner.uuid,
                  ownerInfoUuid: existingOwner.ownerInfoUuid,
                  status: existingOwner.status
                } : {}),
                name: owner.ownerName,
                mobileNumber: owner.mobileNumber,
                emailId: owner.emailId || null,
                fatherOrHusbandName: owner.guardianName || null,
                gender: capitalizeFirst(genderCode),
                permanentAddress: owner.correspondenceAddress || null,
                ownerShipPercentage: String(parseFloat(owner.ownershipPercentage) || 0),
                ownerType: owner.specialCategory?.code || owner.specialCategory || "NONE",
                relationship: capitalizeFirst(relationshipCode),
                isCorrespondenceAddress: owner.sameAsPropertyAddress || null
              };

              // Add documents if special category is not NONE and documentId exists
              const specialCategoryCode = owner.specialCategory?.code || owner.specialCategory;
              if (specialCategoryCode && specialCategoryCode !== "NONE" && owner.documentId && owner.documentIdType) {
                ownerObj.documents = [{
                  documentType: owner.documentIdType?.code || owner.documentIdType || "SPECIALCATEGORYPROOF",
                  fileStoreId: owner.documentId,
                  documentUid: owner.documentId
                }];
              }

              return ownerObj;
            });
          } else {
            // Single owner
            const existingOwner = existingOwners[0] || {};

            // Extract relationship - handle array or object
            let relationshipCode;
            if (Array.isArray(ownerDetails.relationship)) {
              relationshipCode = ownerDetails.relationship[0]?.code || ownerDetails.relationship[0] || "FATHER";
            } else if (typeof ownerDetails.relationship === 'object' && ownerDetails.relationship !== null) {
              relationshipCode = ownerDetails.relationship.code || "FATHER";
            } else {
              relationshipCode = ownerDetails.relationship || "FATHER";
            }

            // Extract gender - handle array or object
            let genderCode;
            if (Array.isArray(ownerDetails.gender)) {
              genderCode = ownerDetails.gender[0]?.code || ownerDetails.gender[0];
            } else if (typeof ownerDetails.gender === 'object' && ownerDetails.gender !== null) {
              genderCode = ownerDetails.gender.code;
            } else {
              genderCode = ownerDetails.gender;
            }

            const owner = {
              ...(isUpdateMode && existingOwner.uuid ? {
                uuid: existingOwner.uuid,
                ownerInfoUuid: existingOwner.ownerInfoUuid,
                status: existingOwner.status
              } : {}),
              name: ownerDetails.ownerName,
              mobileNumber: ownerDetails.mobileNumber,
              emailId: ownerDetails.emailId || null,
              fatherOrHusbandName: ownerDetails.guardianName || null,
              gender: capitalizeFirst(genderCode),
              permanentAddress: ownerDetails.correspondenceAddress || null,
              ownerShipPercentage: String(parseFloat(ownerDetails.ownershipPercentage) || 100),
              ownerType: ownerDetails.specialCategory?.code || ownerDetails.specialCategory || "NONE",
              relationship: capitalizeFirst(relationshipCode),
              isCorrespondenceAddress: ownerDetails.sameAsPropertyAddress || null
            };

            // Add documents if special category is not NONE and documentId exists
            const specialCategoryCode = ownerDetails.specialCategory?.code || ownerDetails.specialCategory;
            if (specialCategoryCode && specialCategoryCode !== "NONE" && ownerDetails.documentId && ownerDetails.documentIdType) {
              owner.documents = [{
                documentType: ownerDetails.documentIdType?.code || ownerDetails.documentIdType || "SPECIALCATEGORYPROOF",
                fileStoreId: ownerDetails.documentId,
                documentUid: ownerDetails.documentId
              }];
            }

            return [owner];
          }
        })(),
        units: (() => {
          const existingUnits = isUpdateMode && fetchedPropertyData ? fetchedPropertyData.units || [] : [];

          const newUnits = (conditionalFields.floors?.flatMap((floor) =>
            floor.units?.map((unit, unitIndex) => {
              // Try to find matching existing unit by floor and index
              const existingUnit = existingUnits.find(eu =>
                eu.floorNo === String(parseInt(floor.floorNo?.code || floor.floorNo) || 0)
              ) || existingUnits[unitIndex] || {};

              const occupancy = unit.occupancy?.code || unit.occupancy || "OWNER";
              return {
                ...(isUpdateMode && existingUnit.id ? { id: existingUnit.id } : {}),
                floorNo: String(parseInt(floor.floorNo?.code || floor.floorNo) || 0),
                unitType: unit.usageType?.code || unit.usageType || usageCategoryCode,
                usageCategory: unit.subUsageType?.code || unit.usageType?.code || usageCategoryCode,
                occupancyType: occupancy === "OWNER" ? "SELFOCCUPIED" : occupancy,
                additionalDetails: {
                  usageForDueMonths: unit.usageForDueMonths || "UNOCCUPIED",
                  rentedformonths: parseInt(unit.rentedForMonths) || null
                },
                arv: String(parseFloat(unit.arv) || 0),
                constructionDetail: {
                  ...(isUpdateMode && existingUnit.constructionDetail?.id ? { id: existingUnit.constructionDetail.id } : {}),
                  builtUpArea: parseFloat(unit.builtUpArea) || 0
                }
              };
            }) || []).filter(Boolean)) || (conditionalFields.units?.map((unit, unitIndex) => {
              const existingUnit = existingUnits[unitIndex] || {};
              const occupancy = unit.occupancy?.code || unit.occupancy || "OWNER";
              return {
                ...(isUpdateMode && existingUnit.id ? { id: existingUnit.id } : {}),
                floorNo: String(parseInt(unit.floorNo?.code || unit.floorNo) || 0),
                unitType: unit.usageType?.code || unit.usageType || usageCategoryCode,
                usageCategory: unit.subUsageType?.code || unit.usageType?.code || usageCategoryCode,
                occupancyType: occupancy === "OWNER" ? "SELFOCCUPIED" : occupancy,
                additionalDetails: {
                  usageForDueMonths: unit.usageForDueMonths || "UNOCCUPIED",
                  rentedformonths: parseInt(unit.rentedForMonths) || null
                },
                arv: String(parseFloat(unit.arv) || 0),
                constructionDetail: {
                  ...(isUpdateMode && existingUnit.constructionDetail?.id ? { id: existingUnit.constructionDetail.id } : {}),
                  builtUpArea: parseFloat(unit.builtUpArea) || 0
                }
              };
            }) || []);

          return newUnits;
        })(),
        documents: (() => {
          if (!documentInfo) return [];

          // Handle nested documents structure
          let docs = [];

          if (documentInfo.documents?.documents && Array.isArray(documentInfo.documents.documents)) {
            docs = documentInfo.documents.documents;
          } else if (Array.isArray(documentInfo.documents)) {
            docs = documentInfo.documents;
          } else if (Array.isArray(documentInfo)) {
            docs = documentInfo;
          }

          // Filter only documents with fileStoreId
          return docs
            .filter(doc => doc && doc.fileStoreId)
            .map(doc => ({
              documentType: doc.documentType,
              fileStoreId: doc.fileStoreId
            }));
        })()
      }
    };
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const handlePopupProceed = () => {
    // Mark popup as seen in session storage
    Digit.SessionStorage.set(popupSeenKey, true);
    setShowRequiredDocsPopup(false);
  };

  const handlePopupClose = () => {
    // Clear session storage when leaving the form
    Digit.SessionStorage.del(sessionKey);
    Digit.SessionStorage.del(popupSeenKey);
    setShowRequiredDocsPopup(false);
    window.history.back();
  };

  const onSecondaryActionClick = () => {
    if (currentStep === 0) {
      // Clear session storage when leaving the form from first step
      Digit.SessionStorage.del(sessionKey);
      Digit.SessionStorage.del(popupSeenKey);
      history.goBack();
      return;
    }

    setCurrentStep((prev) => prev - 1);
  };

  const textStyles = {
    color: "#0B4B66",
    fontWeight: "700",
    fontSize: "32px",
    marginBottom: "1.5rem"
  }

  const defaultValues = {
    "tenantId": t(Digit?.ULBService?.getCurrentTenantId())
  }

  return (
    <div className="property-assessment-form">
      <HeaderComponent styles={textStyles}>
        <div styles={textStyles}>
          {isReassessMode ? t("PT_REASSESSMENT") : (isUpdateMode ? t("PT_PROPERTY_UPDATE") : t("PT_PROPERTY_REGISTRATION"))}
        </div>
      </HeaderComponent>

      {/* Stepper */}
      <div className="stepper-container">
        <Stepper
          customSteps={stepLabels}
          currentStep={currentStep + 1}
          onStepClick={handleStepClick}
          style={{ marginBottom: "24px" }}
        />
      </div>
      <div style={{ fontWeight: "400", color: "#505a5f", fontSize: "16px", fontFamily: "Roboto", marginBottom: "24px" }}>{t(currentConfig?.message)}</div>
      {currentConfig && (
        <FormComposerV2
          key={`${currentStep}-${(isUpdateMode || isReassessMode) ? isPropertyDataLoaded : 'create'}-${JSON.stringify(formData[currentConfig.key])}`}
          config={[currentConfig]}
          onSubmit={handleFormSubmit}
          defaultValues={formData[currentConfig.key] || defaultValues}
          showSecondaryLabel={currentStep > 0 ? true : false}
          secondaryLabel={t("PT_BACK")}
          secondaryActionIcon={"ArrowBack"}
          onSecondayActionClick={onSecondaryActionClick}
          label={currentStep === config.length - 1 ? (isReassessMode ? t("PT_SUBMIT_REASSESSMENT") : t("PT_SUBMIT")) : t("PT_NEXT")}
          isSubmitting={loading}
          className="assessment-form"
          cardClassName="assessment-form-card"
          showFormInCard={true}
          actionClassName="actionBarClass assessment-form-actionbar"
        />
      )}

      {/* Loading and Toast */}
      {loading && <Loader />}
      {toast && (
        <Toast
          label={toast.label}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Required Documents Popup */}
      <AddPropertyPopup
        isOpen={showRequiredDocsPopup}
        onClose={handlePopupClose}
        onProceed={handlePopupProceed}
      />
    </div>
  );
};

export default PropertyAssessmentForm;