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
  const isAssessMode = !!(purpose === 'assess' && propertyIdFromUrl); // New assessment for existing property
  const isCitizen = userType === "citizen";

  // Session storage key for this form
  const sessionKey = `PT_PROPERTY_REGISTRATION_${tenantId}_${(isUpdateMode || isReassessMode || isAssessMode) ? propertyIdFromUrl : 'new'}`;
  const popupSeenKey = `PT_POPUP_SEEN_${tenantId}`;

  // Initialize state from URL or session storage
  const getInitialState = () => {
    try {
      const stepNumber = stepFromUrl ? parseInt(stepFromUrl) - 1 : 0;
      const savedData = Digit.SessionStorage.get(sessionKey);

      // If we have saved data, merge it with current step from URL
      if (savedData) {
        return {
          currentStep: stepNumber >= 0 && stepNumber < 5 ? stepNumber : (savedData.currentStep || 0),
          formData: savedData.formData || {},
        };
      }

      // Default state if no session data
      return {
        currentStep: stepNumber >= 0 && stepNumber < 5 ? stepNumber : 0,
        formData: {},
      };
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
  // Store the initial step to handle back navigation correctly when starting from a specific step (e.g. Assess & Pay)
  const [startingStep] = useState(initialState.currentStep);
  const [formData, setFormData] = useState(initialState.formData);

  // Sync state with URL step parameter (handles back/forward navigation and edit links)
  useEffect(() => {
    if (stepFromUrl) {
      const stepNumber = parseInt(stepFromUrl) - 1;
      if (stepNumber !== currentStep && stepNumber >= 0 && stepNumber < 5) {
        setCurrentStep(stepNumber);
      }
    }
  }, [stepFromUrl]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showRequiredDocsPopup, setShowRequiredDocsPopup] = useState(!isUpdateMode && !isReassessMode && !isAssessMode && !hasSeenPopup());
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

  const handleStepClick = (stepIndex) => {
    // Prevent stepper navigation if in Assess mode and started at Summary step (Assess & Pay flow)
    if (isAssessMode && startingStep === 4) {
      return;
    }

    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const config = PropertyRegistrationConfig(t, formData, loading, {
    isReassessMode: isReassessMode || isAssessMode, // Treat assess mode same as reassess for config
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
    },
    allFormData: formData, // Pass entire formData for components that need data from other steps
    isUpdateMode: isUpdateMode, // Pass update mode flag to config
    onStepClick: handleStepClick
  });
  const currentConfig = config[currentStep];



  // API hook for fetching property details in update, reassess, or assess mode
  const { isLoading: isFetchingProperty, data: propertyResponse } = (isUpdateMode || isReassessMode || isAssessMode)
    ? Digit.Hooks.useCustomAPIHook({
      url: "/property-services/property/_search",
      params: {
        tenantId: tenantId,
        propertyIds: propertyIdFromUrl,
        audit: false
      },
      config: {
        enabled: !!((isUpdateMode || isReassessMode || isAssessMode) && propertyIdFromUrl && tenantId),
        select: (data) => data?.Properties || [],
      },
    })
    : { isLoading: false, data: null };

  console.log(propertyResponse, "1: propertyResponse");


  // API hook for fetching existing assessment in reassess mode
  // In reassess mode: fetch specific assessment by assessment number
  // In assess mode: fetch all assessments for the property to get latest one for reference
  const { isLoading: isFetchingAssessment, data: assessmentResponse } = (isReassessMode && assessmentIdFromUrl) || (isAssessMode && propertyIdFromUrl)
    ? Digit.Hooks.useCustomAPIHook({
      url: "/property-services/assessment/_search",
      params: isReassessMode
        ? {
          tenantId: tenantId,
          assessmentNumbers: assessmentIdFromUrl
        }
        : {
          tenantId: tenantId,
          propertyIds: propertyIdFromUrl
        },
      config: {
        enabled: !!((isReassessMode && assessmentIdFromUrl && tenantId) || (isAssessMode && propertyIdFromUrl && tenantId)),
        select: (data) => {
          const assessments = data?.Assessments || [];
          // In assess mode, get the most recent active assessment for reference
          if (isAssessMode && assessments.length > 0) {
            const activeAssessments = assessments.filter(a => a.status === 'ACTIVE');
            // Sort by date to get latest
            return activeAssessments.sort((a, b) => {
              const dateA = a.assessmentDate || a.auditDetails?.createdTime || 0;
              const dateB = b.assessmentDate || b.auditDetails?.createdTime || 0;
              return new Date(dateB) - new Date(dateA);
            });
          }
          return assessments;
        },
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


  // NOTE: Update API is now called directly in handleFinalSubmit to avoid payload corruption
  // The useCustomAPIHook was causing RequestInfo.userInfo.roles to bleed into Property.owners array

  // API hook for tax calculation/estimation in reassess or assess mode
  const { isLoading: isFetchingTaxCalculation, data: taxCalculationResponse } = (isReassessMode || isAssessMode) && propertyIdFromUrl && financialYearFromUrl
    ? Digit.Hooks.useCustomAPIHook({
      url: "/pt-calculator-v2/propertytax/v2/_estimate",
      params: {
        tenantId: tenantId
      },
      body: {
        Assessment: {
          financialYear: financialYearFromUrl,
          propertyId: propertyIdFromUrl,
          tenantId: tenantId,
          source: "MUNICIPAL_RECORDS",
          channel: "CFC_COUNTER"
        }
      },
      config: {
        enabled: !!((isReassessMode || isAssessMode) && propertyIdFromUrl && tenantId && financialYearFromUrl && isPropertyDataLoaded),
        select: (data) => data?.Calculation?.[0] || null,
      },
    })
    : { isLoading: false, data: null };

  // Load property data in update, reassess, or assess mode
  // IMPORTANT: Only load ONCE when component first receives API data
  useEffect(() => {
    // Check if we've already loaded data in this session using sessionStorage
    const dataLoadedKey = `PT_DATA_LOADED_${tenantId}_${propertyIdFromUrl}`;
    const hasLoadedInSession = Digit.SessionStorage.get(dataLoadedKey);

    // Check if we already have form data in session storage (user has made edits)
    const savedData = Digit.SessionStorage.get(sessionKey);
    const hasExistingFormData = savedData?.formData && Object.keys(savedData.formData).length > 0;

    // Only load property data if:
    // 1. We have property response from API
    // 2. We're in update/reassess/assess mode
    // 3. We haven't loaded it yet (both flag and session check)
    // 4. We DON'T have existing form data in session (prevents overwriting user edits)
    if (propertyResponse && propertyResponse.length > 0 && (isUpdateMode || isReassessMode || isAssessMode) && !isPropertyDataLoaded && !hasLoadedInSession && !hasExistingFormData) {
      const property = propertyResponse[0];
      setFetchedPropertyData(property);
      // Transform property data to form data format
      const transformedFormData = transformPropertyToFormData(property);

      // Store original property metadata for update operations
      // This ensures IDs, UUIDs, and audit details are preserved in session storage
      transformedFormData._propertyMetadata = {
        id: property.id,
        propertyId: property.propertyId,
        accountId: property.accountId,
        oldPropertyId: property.oldPropertyId,
        status: property.status,
        acknowldgementNumber: property.acknowldgementNumber,
        auditDetails: property.auditDetails,
        address: {
          id: property.address?.id
        },
        owners: property.owners?.map(owner => ({
          uuid: owner.uuid,
          ownerInfoUuid: owner.ownerInfoUuid,
          status: owner.status
        })) || [],
        units: property.units?.map(unit => ({
          id: unit.id,
          constructionDetail: {
            id: unit.constructionDetail?.id
          }
        })) || []
      };

      setFormData(transformedFormData);
      setIsPropertyDataLoaded(true);
      // Mark as loaded in session storage to prevent reloading
      Digit.SessionStorage.set(dataLoadedKey, true);
    } else if (propertyResponse && propertyResponse.length > 0 && !fetchedPropertyData && (isUpdateMode || isReassessMode || isAssessMode)) {
      // If we have property response but haven't cached it yet, cache it for comparison
      // This handles the case where we skip the transform but still need the original for change detection
      const property = propertyResponse[0];
      setFetchedPropertyData(property);
      setIsPropertyDataLoaded(true);
      Digit.SessionStorage.set(dataLoadedKey, true);
    }
  }, [propertyResponse, isUpdateMode, isReassessMode, isAssessMode, isPropertyDataLoaded, tenantId, propertyIdFromUrl, sessionKey]);

  // Clear adhoc values and existing assessment on component mount for new assessments (assess mode with assessmentId=0)
  // This must run BEFORE config is created to prevent PropertySummary from initializing with stale values
  useEffect(() => {
    // Reset adhoc values when loading a fresh assessment page (assessmentId = 0)
    const isNewAssessmentPage = isAssessMode && (!assessmentIdFromUrl || assessmentIdFromUrl === '0' || assessmentIdFromUrl === 0);

    if (isNewAssessmentPage) {
      // Clear state values immediately
      setAdhocPenalty(0);
      setAdhocRebate(0);
      setExistingAssessment(null);
    }
  }, [isAssessMode, assessmentIdFromUrl]); // Run when component mounts or URL params change

  // Load existing assessment data in reassess or assess mode
  useEffect(() => {
    // Skip loading assessment data if this is a new assessment (assessmentId=0)
    const isNewAssessment = isAssessMode && (!assessmentIdFromUrl || assessmentIdFromUrl === '0' || assessmentIdFromUrl === 0);

    if (isNewAssessment) {
      // Don't load any assessment data for new assessments
      return;
    }

    if (assessmentResponse && assessmentResponse.length > 0 && (isReassessMode || isAssessMode)) {
      const assessment = assessmentResponse[0];
      setExistingAssessment(assessment);

      // Initialize adhoc penalty and rebate from existing assessment (only for reassess of same year)
      if (isReassessMode && assessment.additionalDetails) {
        setAdhocPenalty(assessment.additionalDetails.adhocPenalty || 0);
        setAdhocRebate(assessment.additionalDetails.adhocExemption || 0);
      }
      // In assess mode with existing assessment, keep values at 0 (already set above)
    }
  }, [assessmentResponse, isReassessMode, isAssessMode, assessmentIdFromUrl]);

  // Fetch Important Dates from MDMS
  useEffect(() => {
    const fetchImportantDates = async () => {
      if ((isReassessMode || isAssessMode) && tenantId && financialYearFromUrl) {
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
  }, [isReassessMode, isAssessMode, tenantId, financialYearFromUrl]);

  // Process tax calculation response
  useEffect(() => {
    const fetchBillingSlabs = async (calculation) => {
      if (calculation?.billingSlabIds && calculation.billingSlabIds.length > 0) {
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
    };

    if (taxCalculationResponse) {
      setTaxCalculation(taxCalculationResponse);
      fetchBillingSlabs(taxCalculationResponse);
    }
  }, [taxCalculationResponse, tenantId]);

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

  // NOTE: Update API response is now handled directly in handleFinalSubmit
  // Removed useEffect to avoid hook-based payload corruption issue

  // Handle API loading state
  useEffect(() => {
    if (isCreating) {
      setLoading(true);
    } else if (isFetchingProperty || isFetchingAssessment) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isCreating, isFetchingProperty, isFetchingAssessment]);

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

  const handleFormSubmit = async (data) => {
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

    // Merge the new data
    const newFormData = {
      ...formData,
      [currentStepKey]: {
        ...formData[currentStepKey],
        ...data
      }
    };

    // Save to sessionStorage IMMEDIATELY before state update (prevents loss on remount)
    const dataToSave = {
      currentStep: currentStep < config.length - 1 ? currentStep + 1 : currentStep,
      formData: newFormData,
    };

    Digit.SessionStorage.set(sessionKey, dataToSave);

    // Now update state (this will trigger remount due to URL change)
    setFormData(newFormData);

    // DISABLED AUTO-SAVE: Only update on final submit
    // Auto-save on each step has been disabled as per user requirement
    // Data is saved in session storage and will be sent on final submit only

    // For all modes, just navigate to next step or trigger final submit
    if (currentStep < config.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    // Transform form data to API format
    console.log("=== FINAL SUBMIT - Form Data ===");
    console.log("formData:", JSON.stringify(formData, null, 2));
    console.log("================================");

    const apiPayload = transformFormDataToAPIFormat(formData);

    console.log("=== FINAL SUBMIT - API Payload ===");
    console.log("Full API Payload:", JSON.stringify(apiPayload, null, 2));
    console.log("===================================");

    // For update mode, use direct API call instead of hooks to avoid payload corruption
    if (isUpdateMode) {
      try {
        setLoading(true);

        // Get current user info for RequestInfo
        const userInfo = Digit.UserService.getUser();
        const authToken = userInfo?.access_token || null;

        // Wrap payload with RequestInfo (as sibling, not parent)
        const payloadWithRequestInfo = {
          Property: apiPayload.Property,
          RequestInfo: {
            apiId: "Rainmaker",
            authToken: authToken,
            userInfo: userInfo?.info || userInfo,
            msgId: `${Date.now()}|en_IN`,
            plainAccessRequest: {}
          }
        };

        const updateResponse = await Digit.CustomService.getResponse({
          url: "/property-services/property/_update",
          method: "POST",
          body: payloadWithRequestInfo,
          params: { tenantId: tenantId }
        });

        console.log("=== UPDATE API RESPONSE ===");
        console.log("updateResponse:", JSON.stringify(updateResponse, null, 2));
        console.log("===========================");

        // Check for errors first
        if (updateResponse?.Errors && updateResponse.Errors.length > 0) {
          setToast({
            label: updateResponse.Errors[0].message || t("PT_PROPERTY_UPDATE_ERROR"),
            type: "error"
          });
          setLoading(false);
          return;
        }

        // API returns Properties array
        const propertiesArray = updateResponse?.Properties;

        if (propertiesArray && propertiesArray.length > 0) {
          const updatedProperty = propertiesArray[0];
          console.log("=== UPDATED PROPERTY FROM API ===");
          console.log("updatedProperty:", JSON.stringify(updatedProperty, null, 2));
          console.log("=================================");

          // Clear session storage on successful submission
          Digit.SessionStorage.set(sessionKey, null);
          Digit.SessionStorage.set(popupSeenKey, null);
          Digit.SessionStorage.set(`PT_DATA_LOADED_${tenantId}_${propertyIdFromUrl}`, null);

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
      } catch (error) {
        console.error("Property update error:", error);
        setToast({
          label: error?.response?.data?.Errors?.[0]?.message || t("PT_PROPERTY_UPDATE_ERROR"),
          type: "error"
        });
        setLoading(false);
      }
      return; // Exit early after handling update
    }

    // For reassessment or new assessment, create/update assessment (matching mono-ui flow)
    if (isReassessMode || isAssessMode) {
      try {
        setLoading(true);

        // Get adhoc values from config (may have been updated through popup)
        const currentConfig = config.find(step => step.key === "summary");
        const summaryCustomProps = (currentConfig && currentConfig.body && currentConfig.body[0] && currentConfig.body[0].customProps) || {};
        const finalAdhocPenalty = typeof summaryCustomProps.adhocPenalty !== 'undefined' ? summaryCustomProps.adhocPenalty : adhocPenalty;
        const finalAdhocRebate = typeof summaryCustomProps.adhocRebate !== 'undefined' ? summaryCustomProps.adhocRebate : adhocRebate;

        // Check if this is a new assessment (assessmentId is 0 or null) or reassessment of existing assessment
        const isNewAssessment = !assessmentIdFromUrl || assessmentIdFromUrl === '0' || assessmentIdFromUrl === 0;

        if (isNewAssessment) {
          // CREATE new assessment (matching old UI flow)
          const assessmentCreatePayload = {
            Assessment: {
              tenantId: tenantId,
              propertyId: propertyIdFromUrl,
              financialYear: financialYearFromUrl,
              assessmentDate: Date.now(),
              source: "MUNICIPAL_RECORDS",
              channel: "COUNTER",
              status: "ACTIVE",
              additionalDetails: {
                adhocPenalty: parseFloat(finalAdhocPenalty) || 0,
                adhocExemption: parseFloat(finalAdhocRebate) || 0
              }
            }
          };

          const assessmentCreateResponse = await Digit.CustomService.getResponse({
            url: "/property-services/assessment/_create",
            method: "POST",
            body: assessmentCreatePayload,
            params: { tenantId: tenantId }
          });

          if (assessmentCreateResponse?.Assessments && assessmentCreateResponse.Assessments.length > 0) {
            const createdAssessment = assessmentCreateResponse.Assessments[0];

            // Clear session storage
            Digit.SessionStorage.set(sessionKey, null);
            Digit.SessionStorage.set(popupSeenKey, null);

            // Redirect to acknowledgment page matching old UI pattern
            const params = new URLSearchParams({
              purpose: 'assess',
              status: 'success',
              propertyId: propertyIdFromUrl,
              tenantId: tenantId,
              secondNumber: createdAssessment.assessmentNumber,
              FY: financialYearFromUrl
            });

            const contextPath = isCitizen ? "citizen" : "employee";
            history.push(
              `/${window.contextPath}/${contextPath}/pt/pt-acknowledgment?${params.toString()}`
            );
          } else {
            setToast({
              label: assessmentCreateResponse?.Errors?.[0]?.message || t("PT_ASSESSMENT_FAILED"),
              type: "error"
            });
          }
        } else {
          // UPDATE existing assessment (for reassessment with valid assessment ID)
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
        }

        setLoading(false);
      } catch (error) {
        console.error("Assessment error:", error);
        setToast({
          label: error?.response?.data?.Errors?.[0]?.message || (isAssessMode ? t("PT_ASSESSMENT_FAILED") : t("PT_REASSESSMENT_FAILED")),
          type: "error"
        });
        setLoading(false);
      }
    } else {
      // For create mode, use the hook-based flow
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

    // Get property metadata from formData (persisted in session storage) or fallback to state
    const propertyMetadata = formData._propertyMetadata || (fetchedPropertyData ? {
      id: fetchedPropertyData.id,
      propertyId: fetchedPropertyData.propertyId,
      accountId: fetchedPropertyData.accountId,
      oldPropertyId: fetchedPropertyData.oldPropertyId,
      status: fetchedPropertyData.status,
      acknowldgementNumber: fetchedPropertyData.acknowldgementNumber,
      auditDetails: fetchedPropertyData.auditDetails,
      address: {
        id: fetchedPropertyData.address?.id
      },
      owners: fetchedPropertyData.owners?.map(owner => ({
        uuid: owner.uuid,
        ownerInfoUuid: owner.ownerInfoUuid,
        status: owner.status
      })) || [],
      units: fetchedPropertyData.units?.map(unit => ({
        id: unit.id,
        constructionDetail: {
          id: unit.constructionDetail?.id
        }
      })) || []
    } : null);

    // Debug logging
    console.log("=== transformFormDataToAPIFormat DEBUG ===");
    console.log("isUpdateMode:", isUpdateMode);
    console.log("propertyMetadata:", propertyMetadata);
    console.log("propertyMetadata exists:", !!propertyMetadata);
    if (propertyMetadata) {
      console.log("propertyMetadata.id:", propertyMetadata.id);
      console.log("propertyMetadata.propertyId:", propertyMetadata.propertyId);
    }
    console.log("=========================================");

    // Get property type - handle both string and object
    let propertyTypeCode = assessmentInfo.propertyType;
    let propertyTypeMajor = null;

    if (Array.isArray(assessmentInfo.propertyType)) {
      const propertyTypeObj = assessmentInfo.propertyType[0];
      propertyTypeCode = propertyTypeObj?.code || propertyTypeObj;
      propertyTypeMajor = propertyTypeObj?.propertyType; // Get major category if available
    } else if (typeof assessmentInfo.propertyType === 'object' && assessmentInfo.propertyType !== null) {
      propertyTypeCode = assessmentInfo.propertyType.code || assessmentInfo.propertyType.value;
      propertyTypeMajor = assessmentInfo.propertyType.propertyType;
    }

    // Construct full property type
    // VACANT is standalone, others are under BUILTUP
    let propertyTypeFull;
    if (propertyTypeCode?.includes('.')) {
      // Already has dot notation
      propertyTypeFull = propertyTypeCode;
    } else if (propertyTypeCode === 'VACANT') {
      // VACANT is standalone, not under BUILTUP
      propertyTypeFull = 'VACANT';
    } else {
      // Use propertyTypeMajor if available, otherwise default to BUILTUP
      const majorCategory = propertyTypeMajor || 'BUILTUP';
      propertyTypeFull = `${majorCategory}.${propertyTypeCode}`;
    }

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

    // Log form data BEFORE constructing payload
    console.log("=== PAYLOAD CONSTRUCTION DEBUG ===");
    console.log("propertyAddress:", propertyAddress);
    console.log("propertyAddress.surveyId:", propertyAddress.surveyId);
    console.log("assessmentInfo:", assessmentInfo);
    console.log("assessmentInfo.businessName:", assessmentInfo.businessName);
    console.log("ownershipInfo:", ownershipInfo);
    console.log("ownerDetails:", ownerDetails);
    console.log("ownerDetails.ownerName:", ownerDetails.ownerName);
    console.log("==================================");

    // Helper to convert Sq.Ft to Sq.Yards (divide by 9) matching Old UI
    const convertArea = (value) => {
      const val = parseFloat(value) || 0;
      // Convert Sq.Ft to Sq.Yards and round to 2 decimal places
      return val > 0 ? parseFloat((val / 9).toFixed(2)) : 0;
    };

    const payloadToReturn = {
      Property: {
        ...(isUpdateMode && propertyMetadata ? {
          id: propertyMetadata.id,
          propertyId: propertyMetadata.propertyId,
          accountId: propertyMetadata.accountId,
          oldPropertyId: propertyMetadata.oldPropertyId,
          status: propertyMetadata.status,
          acknowldgementNumber: propertyMetadata.acknowldgementNumber,
          auditDetails: propertyMetadata.auditDetails
        } : {}),
        tenantId: tenantId,
        surveyId: propertyAddress.surveyId || null,
        linkedProperties: null,
        propertyType: propertyTypeFull,
        usageCategory: usageCategoryCode,
        usageCategoryMajor: usageCategoryMajor || null,
        usageCategoryMinor: usageCategoryMinor || null,
        ownershipCategory: ownershipCategory,
        source: "MUNICIPAL_RECORDS",
        channel: "CFC_COUNTER",
        creationReason: (isReassessMode || isAssessMode) ? "REASSESSMENT" : (isUpdateMode ? "STATUS" : "CREATE"),
        noOfFloors: (() => {
          if (propertyTypeCode === 'VACANT') return 1;
          if (propertyTypeCode === 'SHAREDPROPERTY') return 2; // Match Mseva behavior
          const rawFloor = parseInt(conditionalFields.noOfFloors?.code || conditionalFields.noOfFloors || assessmentInfo.noOfFloors?.code || assessmentInfo.noOfFloors) || 1;
          return rawFloor + 1;
        })(),
        // landArea: null for SHAREDPROPERTY, otherwise converted value
        landArea: propertyTypeCode === 'SHAREDPROPERTY' ? null : String(convertArea(conditionalFields.plotSize) || 0),
        // Calculate superBuiltUpArea: For Shared Property, use input (plotSize), otherwise sum of units
        superBuiltUpArea: (() => {
          console.log("***LOG*** Calculating superBuiltUpArea");
          console.log("***LOG*** propertyTypeCode:", propertyTypeCode);

          // Priority 1: Check for duplicate/explicit superBuiltUpArea (from form config matching old UI)
          if (conditionalFields.superBuiltUpArea) {
            console.log("***LOG*** Using explicit superBuiltUpArea:", conditionalFields.superBuiltUpArea);
            return convertArea(conditionalFields.superBuiltUpArea) || null;
          }

          // Determine units list
          let units = [];
          if (conditionalFields.floors && conditionalFields.floors.length > 0) {
            units = conditionalFields.floors.flatMap(f => f.units || []);
          } else if (conditionalFields.units && conditionalFields.units.length > 0) {
            units = conditionalFields.units;
          }
          console.log("***LOG*** Extracted units count:", units.length);

          // Calculate total before conversion
          let totalValue = 0;

          if (propertyTypeCode === 'SHAREDPROPERTY' || propertyTypeCode === 'BUILTUP.SHAREDPROPERTY') {
            // Try plotSize first for Shared Property as it often holds the super area in this UI
            if (conditionalFields.plotSize) {
              const ps = parseFloat(conditionalFields.plotSize);
              if (ps > 0) {
                console.log("***LOG*** Using plotSize for SHAREDPROPERTY:", ps);
                totalValue = ps;
              }
            }
          }

          if (totalValue === 0) {
            const totalBuiltUp = units.reduce((sum, unit) => sum + (parseFloat(unit.builtUpArea) || 0), 0);
            console.log("***LOG*** Calculated totalBuiltUp from units:", totalBuiltUp);
            totalValue = totalBuiltUp;
          }

          return totalValue > 0 ? convertArea(totalValue) : null;
        })(),
        isactive: false,
        isinactive: false,
        dueAmount: null,
        dueAmountYear: null,
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
          tenantId: tenantId,
          doorNo: propertyAddress.doorNo || null,
          plotNo: null,
          ...(isUpdateMode && propertyMetadata?.address?.id ? { id: propertyMetadata.address.id } : {}),
          landmark: null,
          city: (() => {
            // Get city name from tenant
            const cityCode = tenantId.split('.').pop();
            return capitalizeFirst(cityCode);
          })(),
          district: null,
          region: null,
          state: null,
          country: null,
          pincode: propertyAddress.pincode || null,
          buildingName: propertyAddress.buildingName || null,
          street: propertyAddress.street || null,
          locality: {
            code: propertyAddress.locality?.[0]?.code || propertyAddress.locality?.code || propertyAddress.locality,
            name: propertyAddress.locality?.[0]?.name || propertyAddress.locality?.name || propertyAddress.locality?.[0]?.code || "Locality",
            label: "Locality",
            latitude: null,
            longitude: null,
            area: propertyAddress.locality?.[0]?.area || propertyAddress.locality?.area || "AREA1",
            children: [],
            materializedPath: null
          },
          geoLocation: {
            latitude: 0,
            longitude: 0
          },
          additionalDetails: null
        },
        owners: (() => {
          const ownershipTypeCode = ownershipInfo.ownershipType?.[0]?.code || ownershipInfo.ownershipType?.code || "";
          const isInstitutional = ownershipTypeCode?.includes("INSTITUTIONAL");
          const isMultipleOwners = ownershipTypeCode === "MULTIPLEOWNERS";

          // Get existing owners for update mode
          const existingOwners = isUpdateMode && propertyMetadata ? propertyMetadata.owners || [] : [];

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
                gender: (genderCode || "").toUpperCase(),
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
              gender: (genderCode || "").toUpperCase(),
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
          if (propertyTypeCode === 'VACANT') return [];
          const existingUnits = isUpdateMode && propertyMetadata ? propertyMetadata.units || [] : [];

          // Try floors first (for INDEPENDENTPROPERTY), then units (for SHAREDPROPERTY)
          let newUnits = [];

          if (conditionalFields.floors && conditionalFields.floors.length > 0) {
            // INDEPENDENTPROPERTY: map from floors
            newUnits = conditionalFields.floors.flatMap((floor) =>
              (floor.units || []).map((unit, unitIndex) => {
                // Try to find matching existing unit by floor and index
                const existingUnit = existingUnits.find(eu =>
                  eu.floorNo === String(parseInt(floor.floorNo?.code || floor.floorNo) || 0)
                ) || existingUnits[unitIndex] || {};

                const occupancy = unit.occupancy?.code || unit.occupancy || "OWNER";

                // Extract unitType and usageCategory from subUsageType (full hierarchical path)
                // subUsageType.code = "NONRESIDENTIAL.COMMERCIAL.RETAIL.RETAIL"
                // unitType should be "RETAIL" (last segment)
                // usageCategory should be full path "NONRESIDENTIAL.COMMERCIAL.RETAIL.RETAIL"
                let finalUnitType, finalUsageCategory;

                if (unit.subUsageType) {
                  const subUsageCode = unit.subUsageType?.code || unit.subUsageType;
                  finalUsageCategory = subUsageCode;
                  // Extract last segment for unitType
                  const pathParts = subUsageCode.split('.');
                  finalUnitType = pathParts[pathParts.length - 1];
                } else {
                  // Fallback: use property-level usageCategory or unit's usage type
                  finalUsageCategory = usageCategoryCode || unit.usageType?.code || unit.usageType || "RESIDENTIAL";
                  // If no subUsageType, unitType should be undefined (matching Mseva)
                  finalUnitType = undefined;
                }

                return {
                  ...(isUpdateMode && existingUnit.id ? { id: existingUnit.id } : {}),
                  tenantId: null,
                  floorNo: parseInt(floor.floorNo?.code || floor.floorNo) || 0,
                  unitType: finalUnitType,
                  usageCategory: finalUsageCategory,
                  occupancyType: occupancy === "OWNER" ? "SELFOCCUPIED" : occupancy,
                  occupancyName: occupancy === "OWNER" ? "Self-Occupied" : (occupancy === "RENTED" ? "Rented" : occupancy),
                  active: true,
                  occupancyDate: 0,
                  constructionDetail: {
                    ...(isUpdateMode && existingUnit.constructionDetail?.id ? { id: existingUnit.constructionDetail.id } : {}),
                    carpetArea: null,
                    builtUpArea: convertArea(unit.builtUpArea),
                    plinthArea: null,
                    superBuiltUpArea: null,
                    constructionType: null,
                    constructionDate: null,
                    dimensions: null
                  },
                  additionalDetails: null,
                  auditDetails: null,
                  arv: null
                };
              })
            ).filter(Boolean);
          } else if (conditionalFields.units && conditionalFields.units.length > 0) {
            // SHAREDPROPERTY: map from units directly
            newUnits = conditionalFields.units.map((unit, unitIndex) => {
              const existingUnit = existingUnits[unitIndex] || {};
              const occupancy = unit.occupancy?.code || unit.occupancy || "OWNER";

              // Extract unitType and usageCategory from subUsageType (full hierarchical path)
              let finalUnitType, finalUsageCategory;

              if (unit.subUsageType) {
                const subUsageCode = unit.subUsageType?.code || unit.subUsageType;
                finalUsageCategory = subUsageCode;
                // Extract last segment for unitType
                const pathParts = subUsageCode.split('.');
                finalUnitType = pathParts[pathParts.length - 1];
              } else {
                // Fallback: use property-level usageCategory or unit's usage type
                finalUsageCategory = usageCategoryCode || unit.usageType?.code || unit.usageType || "RESIDENTIAL";
                // If no subUsageType, unitType should be undefined (matching Mseva)
                finalUnitType = undefined;
              }

              const plotSizeValue = parseFloat(conditionalFields.plotSize) || 0;
              const unitBuiltUpArea = parseFloat(unit.builtUpArea) || 0;
              const finalBuiltUpArea = unitBuiltUpArea > 0 ? unitBuiltUpArea : (plotSizeValue > 0 ? plotSizeValue : 0);

              return {
                ...(isUpdateMode && existingUnit.id ? { id: existingUnit.id } : {}),
                floorNo: String(parseInt(unit.floorNo?.code || unit.floorNo) || 0),
                unitType: finalUnitType,
                usageCategory: finalUsageCategory,
                occupancyType: occupancy === "OWNER" ? "SELFOCCUPIED" : occupancy,
                additionalDetails: {
                  usageForDueMonths: unit.usageForDueMonths?.code || unit.usageForDueMonths || "UNOCCUPIED",
                  rentedformonths: parseInt(unit.rentedForMonths) || null
                },
                arv: String(parseFloat(unit.arv) || 0),
                constructionDetail: {
                  ...(isUpdateMode && existingUnit.constructionDetail?.id ? { id: existingUnit.constructionDetail.id } : {}),
                  builtUpArea: convertArea(finalBuiltUpArea)
                }
              };
            }).filter(Boolean);
          }

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
        })(),
        // Add workflow object for update operations (matching old UI)
        ...(isUpdateMode ? {
          workflow: {
            businessService: "PT.CREATE",
            action: "OPEN",
            moduleName: "PT"
          }
        } : {}),
        // Additional fields matching old UI
        AlternateUpdated: false,
        isOldDataEncryptionRequest: false,
        occupancyDate: 0,
        usage: null,
        financialYear: null,
        assessmentNumber: "0",
        assessmentDate: null,
        adhocExemption: null,
        adhocPenalty: null,
        adhocExemptionReason: null,
        adhocPenaltyReason: null,
        calculation: null
      }
    };

    // Log final payload AFTER construction
    console.log("=== FINAL PAYLOAD DEBUG ===");
    console.log("payloadToReturn.Property.surveyId:", payloadToReturn.Property.surveyId);
    console.log("payloadToReturn.Property.additionalDetails.businessName:", payloadToReturn.Property.additionalDetails.businessName);
    console.log("payloadToReturn.Property.owners[0].name:", payloadToReturn.Property.owners[0]?.name);
    console.log("Full Property Payload:", JSON.stringify(payloadToReturn.Property, null, 2));
    console.log("===========================");

    return payloadToReturn;
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
    // If the user started at the summary step (e.g. from Assess & Pay) and is currently at that step,
    // the back button should return to the property page instead of going to the previous step.
    if (isAssessMode && startingStep === 4 && currentStep === 4) {
      const context = isCitizen ? "citizen" : "employee";
      history.push(`/${window.contextPath}/${context}/pt/property/${propertyIdFromUrl}?tenantId=${tenantId}`);
      return;
    }

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
          {isReassessMode ? t("PT_REASSESSMENT") : isAssessMode ? t("PT_ASSESSMENT") : (isUpdateMode ? t("PT_PROPERTY_UPDATE") : t("PT_PROPERTY_REGISTRATION"))}
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
          key={`${currentConfig.key}-${currentStep}-${(isUpdateMode || isReassessMode || isAssessMode) ? isPropertyDataLoaded : 'create'}`}
          config={[currentConfig]}
          onSubmit={handleFormSubmit}
          defaultValues={formData[currentConfig.key] || defaultValues}
          showSecondaryLabel={currentStep > 0 ? true : false}
          secondaryLabel={t("PT_BACK")}
          secondaryActionIcon={"ArrowBack"}
          onSecondayActionClick={onSecondaryActionClick}
          label={currentStep === config.length - 1 ? (isReassessMode ? t("PT_SUBMIT_REASSESSMENT") : isAssessMode ? t("PT_ASSESS_PROPERTY") : t("PT_SUBMIT")) : t("PT_NEXT")}
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

      {/* Required Documents Popup - Only show on first step */}
      <AddPropertyPopup
        isOpen={showRequiredDocsPopup && currentStep === 0}
        onClose={handlePopupClose}
        onProceed={handlePopupProceed}
      />
    </div>
  );
};

export default PropertyAssessmentForm;