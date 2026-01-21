import React, { createContext, useContext, useEffect, useReducer, useState, useCallback, useMemo } from "react";
import AppFieldScreenWrapper from "./AppFieldScreenWrapper";
import { Footer, Button, Loader, PopUp, SidePanel, Toast, FieldV1, Tag, TextArea } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import DrawerFieldComposer from "./DrawerFieldComposer";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import AppLocalisationTable from "./AppLocalisationTable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AppPreview from "../../../components/AppPreview";
import { useCustomT } from "./useCustomT";
import useUpsertLocalisationParallel from "../../../hooks/useUpsertLocalisationParallel";
import { useFormConfigAPI, transformFormDataToMDMS } from "../../../hooks/useFormConfigAPI";
import { useHistory } from "react-router-dom";
// Import the local FieldPropertiesPanelConfig
//import fieldPropertiesPanelConfig from "../../../localMdmsMasters/FieldPropertiesPanelConfig.json";

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

const AppConfigContext = createContext();

const initialState = {};

export const useAppConfigContext = () => {
  return useContext(AppConfigContext);
};
const reorderConfig = (config, fromIndex, toIndex) => {
  if (
    fromIndex === toIndex || // No change needed
    fromIndex < 0 ||
    toIndex < 0 || // Prevent negative indexes
    fromIndex >= config?.length ||
    toIndex >= config?.length // Prevent out-of-bounds access
  ) {
    return [...config]; // Return a copy to ensure immutability
  }

  const updatedConfig = [...config]; // Copy array to avoid mutation
  const [movedItem] = updatedConfig.splice(fromIndex, 1); // Remove item
  updatedConfig.splice(toIndex, 0, movedItem); // Insert item at new index
  return updatedConfig?.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
};

// Helper function to convert to sentence case
const toSentenceCase = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
const reducer = (state = initialState, action, updateLocalization) => {
  switch (action.type) {
    case "MASTER_DATA":
      return {
        ...state,
        MASTER_DATA: { ...action.state },
        screenConfig: action.state?.screenConfig,
        screenData: action.state?.screenConfig,
      };
    case "SET_SCREEN_DATA":
      return {
        ...state,
        screenConfig: action.state?.screenConfig,
        screenData: action.state?.screenConfig,
        drawerField: null,
      };
    case "ADD_SECTION":
      return {
        ...state,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            // Find the maximum section number from existing sections to avoid duplicates
            const existingSectionNumbers = (item?.cards || [])
              .map(card => {
                const headingField = card.headerFields?.find(hf => hf.label === "SCREEN_HEADING");
                const match = headingField?.value?.match(/Section\s+(\d+)/i);
                return match ? parseInt(match[1], 10) : 0;
              });
            const maxSectionNumber = existingSectionNumbers.length > 0 ? Math.max(...existingSectionNumbers) : 0;
            const newSectionNumber = maxSectionNumber + 1;
            return {
              ...item,
              cards: [
                ...item?.cards,
                {
                  fields: [],
                  header: "Header",
                  description: "Desc",
                  headerFields: [
                    {
                      type: "text",
                      label: "SCREEN_HEADING",
                      active: true,
                      jsonPath: "ScreenHeading",
                      metaData: {},
                      required: true,
                      value: `Section ${newSectionNumber}`,
                    },
                    {
                      type: "text",
                      label: "SCREEN_DESCRIPTION",
                      active: true,
                      jsonPath: "Description",
                      metaData: {},
                      required: true,
                      value: `Description for Section ${newSectionNumber}`,
                    },
                  ],
                },
              ],
            };
          }
          return item;
        }),
      };
    case "TOGGLE_APPLICANT_DETAILS":
      return {
        ...state,
        applicantDetailsEnabled: action.payload.enabled,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            const updatedCards = [...item.cards];
            
            if (action.payload.enabled) {
              // Add applicant details section if it doesn't exist
              const applicantSectionExists = updatedCards.some(card => 
                card.fields?.some(field => field.jsonPath === "ApplicantName")
              );
              
              if (!applicantSectionExists) {
                updatedCards.push({
                  fields: [
                    {
                      type: "text",
                      appType: "text",
                      label: "Name",
                      active: true,
                      jsonPath: "ApplicantName",
                      metaData: {},
                      required: true,
                      value: "",
                      readOnly: false,
                      deleteFlag: false, // Make this non-deletable
                      isMandatory: true, // Mark as mandatory
                      hidden: false, // Ensure it's visible
                      order: 1,
                    },
                    {
                      type: "mobileNumber",
                      appType: "mobileNumber",
                      label: "Mobile number",
                      active: true,
                      jsonPath: "ApplicantMobile",
                      metaData: {
                        hideSpan: true,
                      },
                      required: true,
                      value: "",
                      readOnly: false,
                      deleteFlag: false, // Make this non-deletable
                      hideSpan: true,
                      isMandatory: true, // Mark as mandatory
                      hidden: false, // Ensure it's visible
                      order: 2,
                      minLength: window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobileMaxLength || 10,
                      maxLength: window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobileMaxLength || 10,
                      populators: {
                        hideSpan: true,
                        minLength: window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobileMaxLength || 10,
                        maxLength: window?.globalConfigs?.getConfig("CORE_MOBILE_CONFIGS")?.mobileMaxLength || 10,
                      }
                    },
                    {
                      type: "text",
                      appType: "text",
                      label: "Email",
                      active: true,
                      jsonPath: "ApplicantEmail",
                      metaData: {},
                      required: false,
                      value: "",
                      readOnly: false,
                      deleteFlag: false, // Default field - shows toggle
                      hidden: false,
                      order: 3,
                      regex: "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
                      errorMessage: "invalid email",
                    },
                    {
                      type: "dropdown",
                      appType: "dropdown",
                      label: "Gender",
                      active: true,
                      jsonPath: "ApplicantGender",
                      metaData: {},
                      required: false,
                      value: "",
                      readOnly: false,
                      deleteFlag: false, // Default field - shows toggle
                      hidden: false,
                      order: 4,
                      isMdms: true,
                      MdmsDropdown: true,
                      schemaCode: "common-masters.GenderType",
                    },
                  ],
                  header: "Applicant Details",
                  description: "Applicant Information",
                  sectionType: "applicant",
                  headerFields: [
                    {
                      type: "text",
                      label: "SCREEN_HEADING",
                      active: true,
                      jsonPath: "ScreenHeading",
                      metaData: {},
                      required: true,
                      value: "Applicant Details",
                    },
                    {
                      type: "text",
                      label: "SCREEN_DESCRIPTION",
                      active: true,
                      jsonPath: "Description",
                      metaData: {},
                      required: true,
                      value: "Please provide your personal information",
                    },
                  ],
                  sectionType: "applicant", // Add section type to identify applicant sections
                });
              }
            } else {
              // Remove applicant details section
              const filteredCards = updatedCards.filter(card => 
                !card.fields?.some(field => field.jsonPath === "ApplicantName")
              );
              updatedCards.length = 0;
              updatedCards.push(...filteredCards);
            }
            
            return {
              ...item,
              cards: updatedCards,
            };
          }
          return item;
        }),
      };
    case "TOGGLE_ADDRESS_DETAILS":
      return {
        ...state,
        addressDetailsEnabled: action.payload.enabled,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            const updatedCards = [...item.cards];
            
            if (action.payload.enabled) {
              // Add address details section if it doesn't exist
              const addressSectionExists = updatedCards.some(card => 
                card?.fields?.some(field => field.jsonPath === "AddressPincode")
              );
              
              if (!addressSectionExists) {
                updatedCards.push({
                  fields: [
                    {
                      type: "text",
                      appType: "text",
                      label: "Pincode",
                      active: true,
                      jsonPath: "AddressPincode",
                      metaData: {},
                      required: false,
                      value: "",
                      readOnly: false,
                      deleteFlag: false, // Default field - shows toggle
                      hidden: false,
                      order: 1,
                      regex: "^[1-9][0-9]{5}$",
                      errorMessage: "Please enter a valid 6-digit pincode",
                    },
                    {
                      type: "text",
                      appType: "text",
                      label: "Street name",
                      active: true,
                      jsonPath: "AddressStreet",
                      metaData: {},
                      required: false,
                      value: "",
                      readOnly: false,
                      deleteFlag: false, // Default field - shows toggle
                      hidden: false,
                      order: 2,
                    },
                    {
                      type: "hierarchyDropdown",
                      appType: "hierarchyDropdown",
                      label: "Area Selection",
                      active: true,
                      jsonPath: "AddressLocation",
                      metaData: {},
                      required: false,
                      value: "",
                      readOnly: false,
                      deleteFlag: false, // Default field - shows toggle
                      hidden: false,
                      order: 3,
                      component: "HierarchyDropdown",
                      populators: {
                        name: "boundaryHierarchy",
                        hierarchyType: action.payload.hierarchyDefaults?.hierarchyType || "", // 0th element from hierarchy types
                        highestHierarchy: action.payload.hierarchyDefaults?.highestHierarchy || "", // Same as lowest on initial load
                        lowestHierarchy: action.payload.hierarchyDefaults?.lowestHierarchy || "", // Lowest level from selected hierarchy
                        autoSelect: true,
                      }
                    },
                    {
                      type: "mapcoord",
                      appType: "mapcoord",
                      label: "Select location on map",
                      active: true,
                      jsonPath: "AddressMapCoord",
                      metaData: {},
                      required: false,
                      value: "",
                      readOnly: false,
                      deleteFlag: false, // Default field - shows toggle
                      hidden: false,
                      order: 4,
                      component: "MapWithInput",
                      disable: false,
                      format: "component"
                    },
                  ],
                  header: "Address Details",
                  description: "Address Information",
                  sectionType: "address",
                  headerFields: [
                    {
                      type: "text",
                      label: "SCREEN_HEADING",
                      active: true,
                      jsonPath: "ScreenHeading",
                      metaData: {},
                      required: true,
                      value: "Address Details",
                    },
                    {
                      type: "text",
                      label: "SCREEN_DESCRIPTION",
                      active: true,
                      jsonPath: "Description",
                      metaData: {},
                      required: true,
                      value: "Please provide your address information",
                    },
                  ],
                });
              }
            } else {
              // Remove address details section
              const filteredCards = updatedCards.filter(card => 
                !card?.fields?.some(field => field.jsonPath === "AddressPincode")
              );
              updatedCards.length = 0;
              updatedCards.push(...filteredCards);
            }
            
            return {
              ...item,
              cards: updatedCards,
            };
          }
          return item;
        }),
      };
    case "TOGGLE_DOCUMENT_SECTION":
      return {
        ...state,
        documentSectionEnabled: action.payload.enabled,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            const updatedCards = [...item.cards];
            
            if (action.payload.enabled) {
              // Add document section if it doesn't exist
              const documentSectionExists = updatedCards.some(card => 
                card?.sectionType === "document" || 
                card?.fields?.some(field => field.jsonPath === "DocumentUpload")
              );
              
              if (!documentSectionExists) {
                updatedCards.push({
                  fields: [],
                  header: "Document Section",
                  description: "Document Upload and Download",
                  sectionType: "document", // Add this to identify document sections
                  headerFields: [
                    {
                      type: "text",
                      label: "SCREEN_HEADING",
                      active: true,
                      jsonPath: "ScreenHeading",
                      metaData: {},
                      required: true,
                      value: "Document Section",
                    },
                    {
                      type: "text",
                      label: "SCREEN_DESCRIPTION",
                      active: true,
                      jsonPath: "Description",
                      metaData: {},
                      required: true,
                      value: "Please upload required documents",
                    },
                  ],
                });
              }
            } else {
              // Remove document section
              const filteredCards = updatedCards.filter(card => 
                card?.sectionType !== "document" && 
                !card?.fields?.some(field => field.jsonPath === "DocumentUpload")
              );
              updatedCards.length = 0;
              updatedCards.push(...filteredCards);
            }
            
            return {
              ...item,
              cards: updatedCards,
            };
          }
          return item;
        }),
      };
    case "ADD_ACTION_LABEL":
      return {
        ...state,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            return {
              ...item,
              actionLabel: action.payload.actionLabel,
            };
          }
          return item;
        }),
      };

    case "ADD_FIELD":
  return {
    ...state,
    isPopup: true,
    screenData: state?.screenData?.map((item, index) => {
      if (item?.name === action?.payload?.currentScreen?.name) {
        return {
          ...item,
          cards: item?.cards?.map((j, k, c) => {
            if (j === action.payload.currentCard) {
              // Check for duplicate field labels
              const existingLabels = j.fields.map(field => field.label?.toLowerCase().trim());
              const newLabel = action?.payload?.fieldData?.label?.toLowerCase().trim();
              
              if (existingLabels.includes(newLabel)) {
                return j;
              }
              
              const regex = new RegExp(`^${item?.name}_${j?.header}_newField(\\d+)$`);
              const maxCounter = j.fields
                .map((f) => {
                  const match = f.jsonPath && f.jsonPath.match(regex);
                  return match ? parseInt(match[1], 10) : 0;
                })
                .reduce((max, curr) => Math.max(max, curr), 0);
              const nextCounter = maxCounter + 1;
              const fieldType = action.payload.fieldData?.type?.fieldType;

              const isTextType = fieldType === "text" || fieldType === "textInput";
              const defaultValidation = isTextType ? {
                regex: "^[A-Za-z0-9 _.',]*$",
                errorMessage: "Only default characters allowed"
              } : {};

              return {
                ...j,
                fields: [
                  ...j.fields,
                  {
                    ...action?.payload?.fieldData,
                    jsonPath: `${item?.name}_${j?.header}_newField${nextCounter}`,
                    type: fieldType,
                    appType: action.payload.fieldData?.type?.type,
                    label: toSentenceCase(action.payload.fieldData?.label),  // Apply sentence case here
                    active: true,
                    deleteFlag: true,
                    ...defaultValidation,
                  },
                ],
              };
            }
            return j;
          }),
        };
      }
      return item;
    }),
  };
    case "HIDE_FIELD": //added logic to hide fields in display
      return {
        ...state,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            return {
              ...item,
              cards: item?.cards?.map((j, cardIndex) => {
                // Fix: Use card index to identify the specific card
                if (cardIndex === action.payload.currentCardIndex || j === action.payload.currentCard) {
                  return {
                    ...j,
                    fields: j.fields?.map((k) => (k.jsonPath === action.payload.currentField.jsonPath ? { ...k, hidden: !k.hidden } : { ...k })),
                  };
                }
                return j;
              }),
            };
          }
          return item;
        }),
      };
    case "DELETE_FIELD":
      return {
        ...state,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            return {
              ...item,
              cards: item?.cards?.map((j, cardIndex) => {
                // Fix: Use card index to identify the specific card
                if (cardIndex === action.payload.currentCardIndex || j === action.payload.currentCard) {
                  return {
                    ...j,
                    fields: j.fields?.filter((k) => k.jsonPath !== action.payload.currentField.jsonPath),
                  };
                }
                return j;
              }),
            };
          }
          return item;
        }),
      };
    case "UPDATE_HEADER_FIELD":
      // updateLocalization(
      //   action?.payload?.localisedCode,
      //   Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage,
      //   action?.payload?.value
      // );
      return {
        ...state,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            return {
              ...item,
              cards: item?.cards?.map((j, k) => {
                // Fix: Use reference comparison to identify the specific card
                if (j === action.payload.currentField) {
                  return {
                    ...j,
                    headerFields: j.headerFields?.map((m, n) => {
                      if (m.label === action?.payload?.field?.label) {
                        return {
                          ...m,
                          value: action?.payload?.value, // Store value directly
                        };
                      }
                      return m;
                    }),
                  };
                }
                return j;
              }),
            };
          }
          return item;
        }),
      };
    case "SELECT_DRAWER_FIELD":
      return {
        ...state,
        currentScreen: action?.payload?.currentScreen,
        currentCard: action?.payload?.currentCard,
        currentCardIndex: action?.payload?.currentCardIndex, // Store card index instead of reference
        drawerField: action?.payload?.drawerField,
      };
    case "UNSELECT_DRAWER_FIELD":
      return {
        ...state,
        drawerField: null,
      };
    case "UPDATE_DRAWER_FIELD":
  return {
    ...state,
    screenData: state?.screenData?.map((item, index) => {
      if (item?.name === state?.currentScreen?.name) {
        return {
          ...item,
          cards: item?.cards?.map((j, cardIndex) => {
            if (cardIndex === state.currentCardIndex) {
              return {
                ...j,
                fields: j.fields.map((k) => {
                  if (k.id ? k.id === state?.drawerField?.id : k.jsonPath === state?.drawerField?.jsonPath) {
                    return {
                      ...action.payload.updatedState,
                      // Apply sentence case to label if it exists
                      label: toSentenceCase(action.payload.updatedState?.label),
                    };
                  }
                  return k;
                }),
              };
            }
            return j;
          }),
        };
      }
      return item;
    }),
  };
    case "REORDER_FIELDS":
      return {
        ...state,
        screenData: [
          {
            ...state?.screenData[0],
            cards: state?.screenData[0]?.cards.map((card, index) => {
              if (index === action.payload.cardIndex) {
                return {
                  ...card,
                  fields: reorderConfig(card.fields, action.payload.fromIndex, action.payload.toIndex),
                };
              }
              return card;
            }),
          },
        ],
      };
    case "DELETE_SECTION":
      return {
        ...state,
        screenData: state?.screenData?.map((item, idx) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            return {
              ...item,
              cards: item.cards.filter((_, i) => i !== action.payload.sectionIndex),
            };
          }
          return item;
        }),
      };
    default:
      return state;
  }
};

const MODULE_CONSTANTS = "Studio";

function AppConfigurationWrapper({ screenConfig, localeModule, pageTag, formName, formDescription, onFormNameChange, onFormDescriptionChange }) {
  const { locState, addMissingKey, updateLocalization, onSubmit, back, showBack, parentDispatch } = useAppLocalisationContext();
  const [state, dispatch] = useReducer((state, action) => reducer(state, action, updateLocalization), initialState);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  const { t } = useTranslation();
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;
  const [showPopUp, setShowPopUp] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [addFieldData, setAddFieldData] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const fieldMasterName = searchParams.get("fieldType");
  const [selectedPreviewSection, setSelectedPreviewSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(null);
  const { mutateAsync: localisationMutate } = useUpsertLocalisationParallel(tenantId, localeModule, currentLocale);
  const [showToast, setShowToast] = useState(null);
  const [nextButtonDisable, setNextButtonDisable] = useState(null);
  const enabledModules = Digit?.SessionStorage.get("initData")?.languages || [];
  const [validationErrors, setValidationErrors] = useState({});

  // Restricted characters for form name (URL-unsafe characters)
  const RESTRICTED_CHARS = /[?&=\/:#+]/g;
  const sanitizeInput = (value) => value.replace(RESTRICTED_CHARS, "");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Form configuration API hook
  const { saveFormConfig, updateFormConfig, fetchFormConfigByName } = useFormConfigAPI();
  
  // Get module and service from URL parameters
  const module = searchParams.get("module");
  const service = searchParams.get("service");
  const editMode = searchParams.get("editMode") === "true"; // Check for edit mode

  // Get original form name from URL params - this never changes during the session
  const originalFormName = searchParams.get("formName") || "";

  // State for form name and description (will be updated from side panel)
  const [currentFormName, setCurrentFormName] = useState(formName || "");
  const [currentFormDescription, setCurrentFormDescription] = useState(formDescription || "");

  // Local state for popup form name to prevent re-renders
  const [popupFormName, setPopupFormName] = useState(formName || "");
  const [popupFormDescription, setPopupFormDescription] = useState(formDescription || "");
  
  const [showFormNamePopup, setShowFormNamePopup] = useState(() => {
    // Use a function to compute initial state to avoid re-computation on every render
    // In edit mode, don't show popup if we have a form name
    const isEditMode = searchParams.get("editMode") === "true";
    return !(formName || "") && !isEditMode;
  });
  const [showSectionPopup, setShowSectionPopup] = useState(false);

  // Fetch existing form data if in edit mode (using original formName from URL)
  const { data: existingFormData, isLoading: isLoadingExistingForm } = fetchFormConfigByName(originalFormName);

  // Fetch hierarchy types for address section defaults
  const hierarchyTypesReq = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `hierarchyTypes_appConfig`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 100,
        offset: 0,
      },
    },
    config: {
      enabled: true,
      select: (data) => {
        const hierarchies = data?.BoundaryHierarchy || [];
        return hierarchies.map(h => ({
          code: h.hierarchyType,
          name: h.hierarchyType,
          boundaryHierarchy: h.boundaryHierarchy || []
        }));
      },
    },
  };
  const { data: hierarchyTypesData } = Digit.Hooks.useCustomAPIHook(hierarchyTypesReq);
  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [
      { name: fieldMasterName, limit: 100 },
      { name: "FieldTypeMappingConfig", limit: 100 },
      { name: "FieldPropertiesPanelConfig", limit: 100 },
      { name: "DETAILS_RENDERER_CONFIG", limit: 100 },
    ],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        // Get FieldTypeMappingConfig from MDMS (contains all field types including document, hierarchy, mapcoord)
        const fieldTypeMappingConfig = data?.["Studio"]?.["FieldTypeMappingConfig"] || [];

        // Get FieldPropertiesPanelConfig from MDMS (contains all panel configs including hierarchy dropdowns)
        const fieldPropertiesPanelConfig = data?.["Studio"]?.["FieldPropertiesPanelConfig"] || [];

        // Sort field types by order
        const sortedFieldTypes = [...fieldTypeMappingConfig].sort((a, b) => (a.order || 0) - (b.order || 0));

        // Sort panel config by order
        const sortedPanelConfig = [...fieldPropertiesPanelConfig].sort((a, b) => (a.order || 0) - (b.order || 0));

        dispatch({
          type: "MASTER_DATA",
          state: {
            screenConfig: screenConfig,
            ...data?.["Studio"],
            // Use FieldPropertiesPanelConfig from MDMS for drawer panel
            DrawerPanelConfig: sortedPanelConfig,
            // Use FieldTypeMappingConfig from MDMS for field types
            AppFieldType: sortedFieldTypes,
            DetailsConfig: data?.["Studio"]?.["DETAILS_RENDERER_CONFIG"],
          },
        });
      },
    },
    { schemaCode: "BASE_APP_MASTER_DATA" } //mdmsv2
  );

  const openAddFieldPopup = (data) => {
    setPopupData({ ...data, id: crypto.randomUUID() });
  };
  const fetchLoc = (key) => {
    return locState?.find((i) => i.code === key)?.[currentLocale];
  };

  // Function to check for duplicate form names
  const checkDuplicateFormName = async (formName) => {
    if (!formName) return false;
    
    try {
      const payload = {
        MdmsCriteria: {
          tenantId: tenantId,
          schemaCode: "Studio.ServiceConfigurationDrafts",
          filters: {
            module: module,
            service: service,
          },
        },
      };

      const response = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_search`,
        params: { tenantId: tenantId },
        body: payload,
      });

      const draft = response?.mdms?.[0];
      if (!draft || !draft.data?.uiforms) {
        return false; // No draft or no forms, so no duplicate
      }
      
      const existingForms = draft.data.uiforms;
      
      // In edit mode, exclude the current form from duplicate check
      if (editMode && existingFormData) {
        return existingForms.some(form => 
          form.formName === formName.trim() && 
          form.formName !== existingFormData.data?.formName
        );
      }
      
      // In create mode, check if any form with same name exists
      return existingForms.some(form => form.formName === formName.trim());
    } catch (error) {
      console.error("Error checking duplicate form name:", error);
      return false; // Return false to allow form creation if check fails
    }
  };



  // Validation function for form builder
  const validateForm = async () => {
    const errors = {};

    // 1. Verify if form name not entered
    if (!currentFormName || !currentFormName.trim()) {
      errors.formName = t("FORM_NAME_REQUIRED");
    } else {
      // 2. Check for duplicate form name (only if form name is provided)
      const isDuplicate = await checkDuplicateFormName(currentFormName);
      if (isDuplicate) {
        errors.duplicateFormName = t("FORM_NAME_ALREADY_EXISTS");
      }
    }

    // Collect all fields from all cards instead of just the first card
    const allFields = [];
    state?.screenData?.[0]?.cards?.forEach(card => {
      if (card?.fields) {
        allFields.push(...card.fields);
      }
    });

    // 3. Verify field added but no type selected
    const fieldsWithoutType = allFields.filter(field => !field.type);
    if (fieldsWithoutType.length > 0) {
      errors.fieldType = t("FIELD_TYPE_REQUIRED");
    }

    // 4. Verify if two fields with same name
    const fieldNames = allFields.map(field => field.label).filter(Boolean);
    const duplicateNames = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      errors.duplicateNames = t("DUPLICATE_FIELD_NAMES");
    }

    // 5. Check for required metadata missing
    const fieldsWithMissingMetadata = allFields.filter(field => {
      if (!field.label || !field.type) return true;
      return false;
    });
    if (fieldsWithMissingMetadata.length > 0) {
      errors.missingMetadata = t("MISSING_REQUIRED_INFORMATION");
    }

    // 6. Check for radio and dropdown fields with less than 2 options
    const radioDropdownFields = allFields.filter(field => 
      field.type === 'radio' || field.type === 'dropdown'
    );
    
    const fieldsWithInsufficientOptions = radioDropdownFields.filter(field => {
      // For MDMS fields, we don't need to check options as they come from master data
      if (field.isMdms || field.schemaCode) {
        return false;
      }
      
      // For enum fields with dropDownOptions, check if there are at least 2 options
      if (field.dropDownOptions && Array.isArray(field.dropDownOptions)) {
        return field.dropDownOptions.length < 2;
      }
      
      // For fields without options, they need at least 2 options
      return true;
    });
    
    if (fieldsWithInsufficientOptions.length > 0) {
      const fieldNames = fieldsWithInsufficientOptions.map(field => field.label).join(', ');
      errors.insufficientOptions = `${t("AT_LEAST_2_OPTIONS_REQUIRED")} ${fieldNames}`;
    }

    // 7. Check for documentUploadAndDownload fields missing templateUrl or templatePDFKey
    const documentUploadAndDownloadFields = allFields.filter(field =>
      field.type === 'documentUploadAndDownload'
    );

    const fieldsWithMissingTemplate = documentUploadAndDownloadFields.filter(field => {
      // Check if either templateUrl or templatePDFKey is provided
      const hasTemplateUrl = field.templateDownloadURL && field.templateDownloadURL.trim() !== '';
      const hasTemplatePDFKey = field.templatePDFKey && field.templatePDFKey.trim() !== '';
      
      // Return true if neither is provided (validation error)
      return !hasTemplateUrl && !hasTemplatePDFKey;
    });

    if (fieldsWithMissingTemplate.length > 0) {
      const fieldNames = fieldsWithMissingTemplate.map(field => field.label).join(', ');
      errors.missingTemplate = `${t("TEMPLATE_URL_OR_PDF_KEY_REQUIRED")} ${fieldNames}`;
    }

    const fieldsWithInvalidTemplateUrl = documentUploadAndDownloadFields.filter(field => {
      const url = field.templateDownloadURL?.trim();
      if (!url) return false; // empty is handled above

      // Multiple URL detection
      if (url.includes(",") || url.split(" ").length > 1 || url.includes("|")) {
        return true;
      }

      // Validate URL syntax
      try {
        new URL(url);
        return false; // valid URL
      } catch (e) {
        return true; // invalid URL
      }
    });

    if (fieldsWithInvalidTemplateUrl.length > 0) {
      const fieldNames = fieldsWithInvalidTemplateUrl.map(field => field.label).join(', ');
      errors.invalidTemplateUrl = `${t("INVALID_TEMPLATE_URL_SINGLE_URL_ONLY")} ${fieldNames}`;
    }

    // 8. Check for documentUploadAndDownload fields with both templateUrl AND templatePDFKey provided
    const fieldsWithBothTemplates = documentUploadAndDownloadFields.filter(field => {
      const hasTemplateUrl = field.templateDownloadURL && field.templateDownloadURL.trim() !== '';
      const hasTemplatePDFKey = field.templatePDFKey && field.templatePDFKey.trim() !== '';

      // Return true if BOTH are provided (validation error)
      return hasTemplateUrl && hasTemplatePDFKey;
    });

    if (fieldsWithBothTemplates.length > 0) {
      const fieldNames = fieldsWithBothTemplates.map(field => field.label).join(', ');
      errors.bothTemplatesProvided = `${t("ONLY_ONE_TEMPLATE_ALLOWED")} ${fieldNames}`;
    }

    // 9. Check for regex and errorMessage dependency - both must be provided together
    const fieldsWithIncompleteRegexValidation = allFields.filter(field => {
      // Check if regex exists and is not empty (ignoring whitespace)
      const hasRegex = field.regex && typeof field.regex === 'string' && field.regex.trim() !== '';
      // Check if errorMessage exists and is not empty (ignoring whitespace)
      const hasErrorMessage = field.errorMessage && typeof field.errorMessage === 'string' && field.errorMessage.trim() !== '';

      // Return true if one is provided but not the other (validation error)
      // This means: if hasRegex is true but hasErrorMessage is false, OR vice versa
      return (hasRegex && !hasErrorMessage) || (!hasRegex && hasErrorMessage);
    });

    if (fieldsWithIncompleteRegexValidation.length > 0) {
      const fieldNames = fieldsWithIncompleteRegexValidation.map(field => field.label).join(', ');
      errors.incompleteRegexValidation = `${t("REGEX_AND_ERROR_MESSAGE_REQUIRED_TOGETHER")} ${fieldNames}`;
    }

    // 10. Check if form only has custom sections, then at least one field is required
    const allCards = state?.screenData?.[0]?.cards || [];

    // Check if there are any pre-defined sections (applicant, address, document)
    const hasPredefinedSections = allCards.some(card => {
      const sectionType = card.sectionType || "";
      return sectionType === "applicant" ||
             sectionType === "address" ||
             sectionType === "document";
    });

    // 10a. Check if address section exists but has no visible fields (all hidden)
    const addressSection = allCards.find(card =>
      card.sectionType === "address" ||
      card?.fields?.some(field => field.jsonPath === "AddressPincode")
    );

    if (addressSection) {
      const visibleAddressFields = addressSection.fields?.filter(field => field.hidden !== true) || [];
      if (visibleAddressFields.length === 0) {
        errors.addressSectionEmpty = t("ADDRESS_SECTION_MUST_HAVE_AT_LEAST_ONE_VISIBLE_FIELD");
      }
    }

    // If no predefined sections, ensure there's at least one field somewhere in the form
    if (!hasPredefinedSections) {
      // Count total fields across all cards
      const totalFields = allCards.reduce((count, card) => {
        return count + (card.fields ? card.fields.length : 0);
      }, 0);

      // If no fields at all (even if there are no cards or only empty custom sections), show error
      if (totalFields === 0) {
        errors.noFieldsInCustomSections = t("AT_LEAST_ONE_FIELD_REQUIRED_IN_CUSTOM_SECTIONS");
      } 
    }
     // 11. Check if any section is empty (no fields present)
    const emptySections = allCards.filter(card => {
      return !card.fields || card.fields.length === 0;
    });

    if (emptySections.length > 0) {
      // Get section names/headers for better error message
      const emptySectionNames = emptySections.map(card => {
        // Get the section heading from headerFields
        const headingField = card.headerFields?.find(hf => hf.label === "SCREEN_HEADING");
        return headingField?.value || card.header || "Unnamed Section";
      }).join(', ');

      errors.emptySections = `${t("SECTIONS_CANNOT_BE_EMPTY")} ${emptySectionNames}`;
    }

    // 12. Validate prefix (isdCodePrefix) - should only contain numbers and + sign
    const fieldsWithInvalidPrefix = allFields.filter(field => {
      if (field.isdCodePrefix && typeof field.isdCodePrefix === 'string') {
        const prefixRegex = /^[\d+]*$/;
        return !prefixRegex.test(field.isdCodePrefix);
      }
      return false;
    });

    if (fieldsWithInvalidPrefix.length > 0) {
      const fieldNames = fieldsWithInvalidPrefix.map(field => field.label).join(', ');
      errors.invalidPrefix = `${t("PREFIX_SHOULD_ONLY_CONTAIN_NUMBERS_AND_PLUS")} ${fieldNames}`;
    }

    // 13. Validate min/max length - min should not be greater than max
    const fieldsWithInvalidMinMax = allFields.filter(field => {
      const minLength = field.minLength ? parseInt(field.minLength) : null;
      const maxLength = field.maxLength ? parseInt(field.maxLength) : null;

      if (minLength !== null && maxLength !== null && !isNaN(minLength) && !isNaN(maxLength) &&
          (field.type === "textInput" || field.type === "text" || field.type === "mobileNumber" || field.type === "textarea")) {
        return minLength > maxLength;
      }
      return false;
    });

    if (fieldsWithInvalidMinMax.length > 0) {
      const fieldNames = fieldsWithInvalidMinMax.map(field => field.label).join(', ');
      errors.invalidMinMax = `${t("MIN_LENGTH_CANNOT_BE_GREATER_THAN_MAX_LENGTH")} ${fieldNames}`;
    }

    // 14. Validate regex - check if the regex pattern is valid and contains regex syntax
    const fieldsWithInvalidRegex = allFields.filter(field => {
      if (field.regex && typeof field.regex === 'string' && field.regex.trim() !== '') {
        // First check if it's syntactically valid
        try {
          new RegExp(field.regex);
        } catch (e) {
          return true; // Regex is syntactically invalid
        }

        // Then check if it contains actual regex metacharacters
        // Valid regex should contain at least one of: [] () {} ^ $ . * + ? | \
        const hasRegexSyntax = /[\[\](){}^$.*+?|\\]/.test(field.regex);
        if (!hasRegexSyntax) {
          return true; // Valid syntax but no regex metacharacters (just a plain string)
        }

        return false; // Regex is valid and contains regex syntax
      }
      return false;
    });

    if (fieldsWithInvalidRegex.length > 0) {
      const fieldNames = fieldsWithInvalidRegex.map(field => field.label).join(', ');
      errors.invalidRegex = `${t("INVALID_REGEX_PATTERN")} ${fieldNames}`;
    }

    return errors;
  };

  // Function to check for unsaved changes
  const checkForUnsavedChanges = () => {
    // This is a simplified check - you might want to implement more sophisticated change tracking
    return hasUnsavedChanges;
  };

  // Memoized onChange handler for form description to prevent unnecessary re-renders
  const handleFormDescriptionChange = useCallback((event) => {
    const newValue = event.target.value;
    setCurrentFormDescription(newValue);
    // Call parent's onChange function only if it exists and is different
    if (onFormDescriptionChange && typeof onFormDescriptionChange === 'function') {
      onFormDescriptionChange(newValue);
    }
  }, [onFormDescriptionChange]);

  // Memoized onChange handlers for popup form fields (separate from main form fields)
  const handlePopupFormNameChange = useCallback((event) => {
    const newValue = sanitizeInput(event.target.value);
    setPopupFormName(newValue);
  }, []);

  const handlePopupFormDescriptionChange = useCallback((event) => {
    const newValue = event.target.value;
    setPopupFormDescription(newValue);
  }, []);

  // Function to handle window beforeunload event
  // const handleBeforeUnload = (e) => {
  //   if (checkForUnsavedChanges()) {
  //     e.preventDefault();
  //     e.returnValue = t("STUDIO_UNSAVED_CHANGES_WARNING");
  //     return t("STUDIO_UNSAVED_CHANGES_WARNING");
  //   }
  // };

  // Add event listener for window beforeunload
  // useEffect(() => {
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [hasUnsavedChanges]);

  // Add event listener for opening form name popup
  useEffect(() => {
    const handleOpenFormNamePopup = () => {
      // Initialize popup form name with current form name when opening
      setPopupFormName(currentFormName);
      setPopupFormDescription(currentFormDescription);
      setShowFormNamePopup(true);
    };

    window.addEventListener('openFormNamePopup', handleOpenFormNamePopup);
    return () => {
      window.removeEventListener('openFormNamePopup', handleOpenFormNamePopup);
    };
  }, [currentFormName, currentFormDescription]);

  // Prevent popup from showing in edit mode when we have existing data
  useEffect(() => {
    if (editMode && existingFormData && !isLoadingExistingForm && showFormNamePopup) {
      setShowFormNamePopup(false);
    }
  }, [editMode, existingFormData, isLoadingExistingForm]); // Removed showFormNamePopup from dependencies

  // Track changes to mark unsaved changes
  useEffect(() => {
    if (state?.screenData) {
      setHasUnsavedChanges(true);
    }
  }, [state?.screenData]);

  // Clear unsaved changes when form is successfully saved
  const clearUnsavedChanges = () => {
    setHasUnsavedChanges(false);
  };

  // Helper function to update form references in workflow localStorage
  // Forms are only assigned to START states in the workflow
  const updateWorkflowFormReferencesInLocalStorage = (oldFormName, newFormName) => {
    try {
      let updated = false;

      // Get canvasElements from localStorage
      const canvasElementsStr = localStorage.getItem("canvasElements");
      if (canvasElementsStr && canvasElementsStr !== "undefined") {
        const canvasElements = JSON.parse(canvasElementsStr);

        // Update form references ONLY in START state
        canvasElements.forEach(element => {
          if (element.nodetype === "start" && element.form) {
            // Check if form is an object with code/name properties
            if (typeof element.form === 'object') {
              if (element.form.code === oldFormName || element.form.name === oldFormName) {
                element.form.code = newFormName;
                element.form.name = newFormName;
                updated = true;
              }
            }
            // Check if form is just a string
            else if (typeof element.form === 'string' && element.form === oldFormName) {
              element.form = newFormName;
              updated = true;
            }
          }
        });

        // Save back to localStorage if updated
        if (updated) {
          localStorage.setItem("canvasElements", JSON.stringify(canvasElements));
        }
      }

      return updated;
    } catch (error) {
      console.error("Failed to update workflow form references in localStorage:", error);
      return false;
    }
  };

  useEffect(() => {
    const handleStepChange = (e) => {
      setNextButtonDisable(e.detail);
    };

    window.addEventListener("lastButtonDisabled", handleStepChange);

    return () => {
      window.removeEventListener("lastButtonDisabled", handleStepChange);
    };
  }, []);

  useEffect(() => {
    // In edit mode, don't overwrite with default screenConfig if existing data is loaded or loading
    if (editMode && (existingFormData || isLoadingExistingForm)) {
      return;
    }
    dispatch({
      type: "SET_SCREEN_DATA",
      state: {
        screenConfig: screenConfig,
      },
    });
  }, [screenConfig, editMode, existingFormData, isLoadingExistingForm]);

  // Load existing form data when in edit mode
  useEffect(() => {
    if (editMode && existingFormData && !isLoadingExistingForm) {
      
      // Set form name and description from existing data
      // Use the original form name from URL to prevent re-triggering when form name changes
      const existingFormName = existingFormData?.data?.formName || originalFormName;
      const existingFormDescription = existingFormData?.data?.formDescription || formDescription;
      
      setCurrentFormName(existingFormName);
      setCurrentFormDescription(existingFormDescription);
      
      // Also set popup form name and description
      setPopupFormName(existingFormName);
      setPopupFormDescription(existingFormDescription);
      
      // Transform MDMS data back to form builder format
      const formConfig = existingFormData?.data?.formConfig;
      if (formConfig?.screens) {
        // Process imported screens to mark mandatory applicant fields
        const processedScreens = formConfig.screens.map(screen => ({
          ...screen,
          cards: screen.cards?.map(card => ({
            ...card,
            fields: card.fields?.map(field => {
              // Mark ApplicantName, ApplicantMobile, and ApplicantMobileNumber as mandatory
              if (field.jsonPath === "ApplicantName" ||
                  field.jsonPath === "ApplicantMobile" ||
                  field.jsonPath === "ApplicantMobileNumber") {
                return {
                  ...field,
                  isMandatory: true,
                  deleteFlag: false
                };
              }
              return field;
            })
          }))
        }));

        dispatch({
          type: "SET_SCREEN_DATA",
          state: {
            screenConfig: processedScreens,
          },
        });
      }
    }
  }, [editMode, existingFormData, isLoadingExistingForm, originalFormName, formDescription]);

  if (isLoadingAppConfigMdmsData || (editMode && isLoadingExistingForm)) {
    return <Loader page={true} variant={"PageLoader"} />;
  }
  const closeToast = () => {
    setShowToast(null);
  };

  function createLocaleArrays() {
    const result = {};
    // Dynamically determine locales
    const locales = Object.keys(locState[0]).filter((key) => key.includes(currentLocale.slice(currentLocale.indexOf("_"))) && key !== currentLocale);
    locales.unshift(currentLocale);
    locales.forEach((locale) => {
      result[locale] = locState
        ?.filter((item) => typeof item?.code !== "boolean")
        ?.map((item) => ({
          code: item.code,
          message: item[locale] || " ",
          module: localeModule ? localeModule : "hcm-dummy-module",
          locale: locale,
        }));
    });

    return result;
  }
  const findConfig = (bindTo, config) => {
    return config.reduce(
      (res, item) => res || (item.bindTo === bindTo ? item : Array.isArray(item.conditionalField) ? findConfig(bindTo, item.conditionalField) : null),
      null
    );
  };
  const validateFromState = (state, drawerPanelConfig, locS, cL) => {
    const errors = {};
    const fields = state?.fields;
    const headerFields = state?.headerFields;

    for (let i = 0; i < headerFields.length; i++) {
      if (headerFields[i]?.jsonPath === "ScreenHeading") {
        const fieldItem = headerFields[i];
        const value = locS?.find((i) => i?.code === fieldItem?.value)?.[cL] || null;
        if (!value || value.trim() === "") {
          return { type: "error", value: `${t("HEADER_FIELD_EMPTY_ERROR")}` };
        }
      }
    }
    const validateValue = (value, validation, label, a, b) => {
      if (!validation) return null;

      // required check
      if (validation.required) {
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return validation.message || `${t(`${label || "FIELD"}_REQUIRED_FOR`)} ${a?.label}`;
        }
      }

      // pattern check
      if (validation.pattern && value) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          return validation.message || `${t(`${label || "Field"}_IS_INVALID`)}`;
        }
      }

      return null; // no error
    };
    for (let i = 0; i < fields.length; i++) {
      const fieldObj = fields[i];

      // For each key in field object
      for (const key in fieldObj) {
        // Find config matching this key
        const config = findConfig(key, drawerPanelConfig);
        if (!config) continue; // no config, skip validation for this key

        // get validation object (could be an array, object, or nested)
        let validation = config.validation;

        // If validation is an array, find validation matching key or default
        if (Array.isArray(validation)) {
          // example: validation array might have { key: "toArray", required: true, message: "..." }
          // You can adapt this as per your validation array structure
          const valFromArray = validation.find((v) => v.key === key || !v.key);
          if (valFromArray) validation = valFromArray;
          else validation = null;
        }

        // Validate the field value
        const value = fieldObj[key];

        const errorMsg = validateValue(fetchLoc(value), validation, config.label, fieldObj, config);

        if (errorMsg) {
          // Use a unique key to identify error (field index + key)
          return errorMsg;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        type: "error",
        errors,
      };
    }

    return false;
  };

  const locUpdate = async () => {
    const localeArrays = createLocaleArrays();
    let updateCount = 0;
    let updateSuccess = false;
    try {
      setLoading(true);
      const result = await localisationMutate(localeArrays);
      updateCount = updateCount + 1;
      updateSuccess = true;
    } catch (error) {
      setLoading(false);
      setShowToast({ key: "error", label: "CONFIG_SAVE_FAILED" });
      console.error(`Error sending localisation data:`, error);
    }
    return;
  };
  const handleSubmit = async (finalSubmit) => {
    
    // Validate form before proceeding
    const validationErrors = await validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      
      // Show toast with first error
      const firstError = Object.values(validationErrors)[0];
      setShowToast({ 
        key: "error", 
        label: firstError,
        transitionTime: 5000
      });
      return;
    }

    // Clear validation errors if validation passes
    setValidationErrors({});
    
    // Comment out localization processing - use plain text values directly
    // const localeArrays = createLocaleArrays();
    let updateCount = 0;
    let updateSuccess = false;
    
    try {
      setLoading(true);
      
      // Comment out localization saving - we don't need it anymore
      // const result = await localisationMutate(localeArrays);
      // updateCount = updateCount + 1;
      // updateSuccess = true;
      
      // Set success to true since we're not doing localization
      updateSuccess = true;
      
      // Save form configuration to MDMS
      if (finalSubmit) {
        // Check if module and service are available from URL parameters
        if (!module || !service) {
          setShowToast({ 
            key: "error", 
            label: "MODULE_AND_SERVICE_REQUIRED",
            transitionTime: 5000
          });
          return;
        }
        
        try {
          // Transform form data to MDMS format - include document configs
          const mdmsFormData = transformFormDataToMDMS(
            {
              ...state,
            },
            module,
            service,
            formName || currentFormName, // Use formName from parent props (updated via onFormNameChange)
            formDescription || currentFormDescription // Use formDescription from parent props (updated via onFormDescriptionChange)
          );
          
          let result;
          if (editMode) {
            // Update existing form
            if (existingFormData) {
              // For edit mode, we need to update the specific form in the uiforms array
              const updatePayload = {
                module: module,
                service: service,
                formName: formName || currentFormName,
                formDescription: formDescription || currentFormDescription,
                formConfig: mdmsFormData.formConfig,
                formId: existingFormData.id,
                originalFormName: originalFormName,
                //documentConfigs: documentConfigs // Include document configs in update payload
              };
              result = await updateFormConfig.mutateAsync(updatePayload);

              // Update workflow form references in localStorage if form name changed
              if (originalFormName && originalFormName !== (formName || currentFormName)) {
                const updated = updateWorkflowFormReferencesInLocalStorage(
                  originalFormName,
                  formName || currentFormName
                );
              }

              clearUnsavedChanges();
              setShowToast({
                key: "success",
                label: "FORM_UPDATED_SUCCESSFULLY",
                transitionTime: 5000
              });
              setTimeout(() => {
                history.push(`/${window.contextPath}/employee/servicedesigner/forms?module=${module}&service=${service}`);
            }, 3000);
            } else {
              // If editMode is true but existingFormData is not available, 
              // we need to search for the form first
              try {
                // Search for the form by formName in the draft
                const searchPayload = {
                  MdmsCriteria: {
                    tenantId: tenantId,
                    schemaCode: "Studio.ServiceConfigurationDrafts",
                    filters: {
                      module: module,
                      service: service,
                    },
                  },
                };
                const searchResponse = await Digit.CustomService.getResponse({
                  url: `/${mdms_context_path}/v2/_search`,
                  params: { tenantId: tenantId },
                  body: searchPayload,
                });
                
                const draft = searchResponse?.mdms?.[0];
                if (draft && draft.data?.uiforms) {
                  const form = draft.data.uiforms.find(f => f.formName === currentFormName);
                  if (form) {
                    const updatePayload = {
                      module: module,
                      service: service,
                      formName: currentFormName,
                      formDescription: currentFormDescription,
                      formConfig: mdmsFormData.formConfig,
                      formId: draft.id,
                      originalFormName: originalFormName,
                      //documentConfigs: documentConfigs // Include document configs in update payload
                    };
                    result = await updateFormConfig.mutateAsync(updatePayload);

                    // Update workflow form references in localStorage if form name changed
                    if (originalFormName && originalFormName !== currentFormName) {
                      const updated = updateWorkflowFormReferencesInLocalStorage(
                        originalFormName,
                        currentFormName
                      );
                    }

                    clearUnsavedChanges();
                    setShowToast({
                      key: "success",
                      label: "FORM_UPDATED_SUCCESSFULLY",
                      transitionTime: 5000
                    });
                    setTimeout(() => {
                      history.push(`/${window.contextPath}/employee/servicedesigner/forms?module=${module}&service=${service}`);
                  }, 3000);
                  } else {
                    throw new Error("Form not found for update");
                  }
                } else {
                  throw new Error("Service configuration draft not found");
                }
              } catch (searchError) {
                console.error("Error searching for existing form:", searchError);
                setShowToast({ 
                  key: "error", 
                  label: "FORM_NOT_FOUND_FOR_UPDATE",
                  transitionTime: 5000
                });
                return;
              }
            }
          } else {
            // Create new form
            result = await saveFormConfig.mutateAsync({
              ...mdmsFormData
            });
            clearUnsavedChanges();
            setShowToast({ 
              key: "success", 
              label: "FORM_SAVED_SUCCESSFULLY",
              transitionTime: 5000
            });
            setTimeout(() => {
              history.push(`/${window.contextPath}/employee/servicedesigner/forms?module=${module}&service=${service}`);
          }, 3000);
          }
          
        } catch (mdmsError) {
          console.error("Error saving/updating form to MDMS:", mdmsError);
          setShowToast({ 
            key: "error", 
            label: t("MDMS_CREATE_BACKEND_ERROR"),
            transitionTime: 5000
          });
        }
      }
      
    } catch (error) {
      setLoading(false);
      setShowToast({ key: "error", label: "CONFIG_SAVE_FAILED" });
      console.error(`Error sending localisation data:`, error);
    }
    
    setShowPopUp(false);
    setLoading(false);
    
    if (updateSuccess || !updateCount) {
      onSubmit(state, finalSubmit);
    }
    
    console.info(editMode ? "FORM_UPDATE_SUCCESS" : "FORM_SAVE_SUCCESS");
  };

  const currentPage = parseInt(pageTag?.split(" ")[1]);

  // Check if sections already exist
  const allCards = state?.screenData?.[0]?.cards || [];
  const addressSectionExists = allCards.some(card =>
    card?.sectionType === "address" ||
    card?.fields?.some(field => field.jsonPath === "AddressPincode")
  );
  const applicantSectionExists = allCards.some(card => card?.sectionType === "applicant");
  const documentSectionExists = allCards.some(card => card?.sectionType === "document");

  return (
    <AppConfigContext.Provider value={{
      state,
      dispatch,
      openAddFieldPopup,
      currentFormName,
      setCurrentFormName,
      currentFormDescription,
      setCurrentFormDescription,
      selectedPreviewSection,
      setSelectedPreviewSection,
      validationErrors,
      setValidationErrors,
      hasUnsavedChanges,
      setHasUnsavedChanges,
      documentSectionEnabled: state.documentSectionEnabled,
    }}>
      {loading && <Loader page={true} variant={"OverlayLoader"} loaderText={t("SAVING_CONFIG_IN_SERVER")} />}
      
      <div style={{ marginRight: "1.5rem", position: "relative", width: "100%" }}>
        {/* Add Section Button - Top Right */}
        <Button
          type={"button"}
          size={"medium"}
          variation={"secondary"}
          label={t("ADD_SECTION")}
          onClick={() => {
            setShowSectionPopup(true);
          }}
          style={{ 
            position: "absolute", 
            top: "-0.5rem", 
            right: "0.5rem",
            zIndex: 10,
            fontSize: "0.875rem",
            padding: "0.5rem 1rem",
            fontWeight: "500",
            borderRadius: "6px",
          }}
        />
        
        <AppPreview 
          data={state?.screenData?.[0]} 
          selectedField={state?.drawerField}
          t={useCustomT}
          selectedSection={selectedPreviewSection}
          onSectionChange={(sectionIndex) => {
            setSelectedPreviewSection(sectionIndex);
            dispatch({ type: "UNSELECT_DRAWER_FIELD" });
          }}
        />
      </div>
      {/* <div className="appConfig-flex-action">
        <Button
          className="app-configure-action-button"
          variation="secondary"
          label={t("PREVIOUS")}
          title={t("PREVIOUS")}
          icon="ArrowBack"
          isDisabled={currentPage === 1}
          onClick={() => back()}
        />
        <span className="app-config-tag-page"> {pageTag} </span>
        <Button
          className="app-configure-action-button"
          variation="secondary"
          label={t("NEXT")}
          title={t("NEXT")}
          icon="ArrowForward"
          isSuffix={true}
          isDisabled={nextButtonDisable}
          onClick={async () => {
            await handleSubmit();
          }}
        />
      </div> */}
      {true && (
        <SidePanel
          bgActive
          className="app-configuration-side-panel"
          defaultOpenWidth={369}
          closedContents={[]}
          closedFooter={[<en />]}
          closedHeader={[]}
          closedSections={[]}
          defaultClosedWidth=""
          footer={[
            <div className="app-configure-drawer-footer-container">
              {enabledModules?.length > 1 ? (
                <Button
                  className="app-configure-drawer-footer-button"
                  type={"button"}
                  size={"medium"}
                  variation={"secondary"}
                  icon={"Translate"}
                  label={t("ADD_LOCALISATION")}
                  onClick={() => {
                    setShowPopUp(true);
                  }}
                />
              ) : null}
            </div>,
          ]}
          header={[
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="typography heading-m">
                {t("FIELD_CONFIGURATION")}
              </div>
              {editMode && (
                <Tag
                  label={t("EDIT_MODE")}
                  style={{ background: "#FFF3CD", color: "#856404", border: "1px solid #FFEAA7" }}
                />
              )}
            </div>,
          ]}
          hideScrollIcon
          isDraggable={false}
          position="right"
          sections={[]}
          styles={{}}
          type="static"
        >
          {state?.drawerField ? (
            <React.Fragment>
              <Button
                className=""
                variation="secondary"
                label={t("FORM_BACK")}
                title={t("FORM_BACK")}
                icon="ArrowBack"
                size="small"
                onClick={() =>
                  dispatch({
                    type: "UNSELECT_DRAWER_FIELD",
                  })
                }
              />
              <DrawerFieldComposer currentCard={state?.screenData?.[0]?.cards?.[selectedPreviewSection]} />
            </React.Fragment>
          ) : (
            <DndProvider backend={HTML5Backend}>
              <AppFieldScreenWrapper currentCard={state?.screenData?.[0]?.cards?.[selectedPreviewSection]} />
            </DndProvider>
          )}
        </SidePanel>
      )}

      {showPopUp && (
        <PopUp
          type={"default"}
          heading={t("ADD_LOCALISATION")}
          children={[
            <div>
              {state?.screenData
                ?.find((i) => i.name === state?.currentScreen?.name)
                ?.cards?.map((card) => [
                  ...card?.fields?.map((field) => ({ message: field?.label })), // Extract label for fields
                  ...card?.headerFields?.map((headerField) => ({ message: headerField?.value })), // Extract value for header fields
                ])
                ?.flat()}
            </div>,
          ]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          onClose={() => {
            setShowPopUp(false);
          }}
          equalWidthButtons={"false"}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("CLOSE")}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("SUBMIT")}
              onClick={() => {
                locUpdate();
                setShowPopUp(false);
              }}
            />,
          ]}
        >
          <AppLocalisationTable currentScreen={state?.screenData?.[0]?.name} state={state} />
        </PopUp>
      )}
      {popupData && (
        <PopUp
          className="app-config-add-field-popup"
          type={"default"}
          heading={t("ADD_FIELD_POP_HEADING")}
          children={[
            <FieldV1
              required={true}
              label={`${t("ADD_FIELD_TYPE")}`}
              type={"dropdown"}
              value={addFieldData?.type}
              config={{
                step: "",
              }}
              onChange={(value) => {
                const isIdPopulator = value?.type === "idPopulator";
                setAddFieldData((prev) => ({
                  ...prev,
                  type: value,
                  ...(isIdPopulator && { isMdms: true, MdmsDropdown: true, schemaCode: "HCM.ID_TYPE_OPTIONS_POPULATOR" }),
                }));
              }}
              populators={{
                t: t,
                title: "ADD_FIELD_TYPE",
                fieldPairClassName: "",
                options: (() => {
                  // Get all available field types
                  const allFieldTypes = (state?.MASTER_DATA?.AppFieldType || [])
                    .filter((item) => item?.metadata?.type !== "template" && item?.metadata?.type !== "dynamic")
                    ?.sort((a, b) => a?.order - b?.order);

                  // Check if current section is a document section
                  const currentCard = popupData?.currentCard;

                  // Check for document section by header, description, or existing document fields
                  const isDocumentSection =
                    currentCard?.header === "Document Section" ||
                    currentCard?.description === "Document Upload and Download" ||
                    currentCard?.fields?.some(field =>
                      field.jsonPath === "DocumentUpload" ||
                      field.type === "documentUpload" ||
                      field.type === "documentUploadAndDownload"
                    );

                  // If it's a document section, show ONLY document upload field types
                  if (isDocumentSection) {
                    return allFieldTypes.filter(fieldType =>
                      fieldType.type === "documentUpload" ||
                      fieldType.type === "documentUploadAndDownload"
                    );
                  }

                  // If it's not a document section, filter out document upload field types
                  // Also filter out hierarchyDropdown and mapcoord as they are only for pre-defined sections
                  return allFieldTypes.filter(fieldType =>
                    fieldType.type !== "documentUpload" &&
                    fieldType.type !== "documentUploadAndDownload" &&
                    fieldType.type !== "hierarchyDropdown" &&
                    fieldType.type !== "mapcoord"
                  );
                })(),
                optionsKey: "type",
              }}
              infoMessage={t("INFO_ADD_FIELD_TYPE")}
            />,
            <FieldV1
              required={true}
              type={"text"}
              label={`${t("ADD_FIELD_LABEL")}`}
              value={addFieldData?.label || ""}
              config={{
                step: "",
              }}
              onChange={(event) => {
                setAddFieldData((prev) => ({
                  ...prev,
                  label: event.target.value,
                }));
              }}
              populators={{ fieldPairClassName: "" }}
              infoMessage={t("INFO_ADD_FIELD_LABEL")}
            />,
          ]}
          onOverlayClick={() => {
            setShowError(null);
            setPopupData(null);
            setAddFieldData(null);
          }}
          onClose={() => {
            setShowError(null);
            setPopupData(null);
            setAddFieldData(null);
          }}
          equalWidthButtons={"false"}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("CLOSE")}
              onClick={() => {
                setShowError(null);
                setPopupData(null);
                setAddFieldData(null);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("SUBMIT")}
              onClick={() => {
                if (!addFieldData) {
                  setShowToast({ 
                    key: "error", 
                    label: "FIELD_TYPE_AND_LABEL_REQUIRED",
                    transitionTime: 3000
                  });
                  return;
                } else if (!addFieldData?.label?.trim() && !addFieldData?.type) {
                  setShowToast({ 
                    key: "error", 
                    label: "FIELD_TYPE_AND_LABEL_REQUIRED",
                    transitionTime: 3000
                  });
                  return;
                } else if (!addFieldData?.type) {
                  setShowToast({ 
                    key: "error", 
                    label: "FIELD_TYPE_AND_LABEL_REQUIRED",
                    transitionTime: 3000
                  });
                  return;
                } else if (!addFieldData?.label?.trim()) {
                  setShowToast({ 
                    key: "error", 
                    label: "FIELD_TYPE_AND_LABEL_REQUIRED",
                    transitionTime: 3000
                  });
                  return;
                }
                
                // Check for duplicate field labels
                const currentCard = popupData?.currentCard;
                const existingLabels = currentCard?.fields?.map(field => field.label?.toLowerCase().trim()) || [];
                const newLabel = addFieldData?.label?.toLowerCase().trim();
                if (existingLabels.includes(newLabel)) {
                  setShowToast({
                    key: "error",
                    label: "DUPLICATE_FIELD_LABEL",
                    transitionTime: 3000
                  });
                  return;
                }
                dispatch({
                  type: "ADD_FIELD",
                  payload: {
                    ...popupData,
                    fieldData: addFieldData,
                  },
                });
                setShowError(null);
                setPopupData(null);
                setAddFieldData(null);
              }}
            />,
          ]}
        ></PopUp>
      )}
      {showToast && (
        <div style={{ zIndex: 9999, position: 'relative' }}>
          <Toast
            type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
            label={t(showToast?.label)}
            transitionTime={showToast.transitionTime}
            onClose={closeToast}
          />
        </div>
      )}
      
      {/* Section Popup */}
      {showSectionPopup && (
        <PopUp
          type={"default"}
          heading={t("ADD_SECTION")}
          children={[
            <div style={{ padding: "1rem 0" }}>
              {/* Custom Section Button */}
              <div style={{ 
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: "#fff"
              }}
              onClick={() => {
                const newSectionIndex = state?.screenData?.[0]?.cards?.length || 0;
                dispatch({
                  type: "ADD_SECTION",
                  payload: {
                    currentScreen: state?.screenData?.[0],
                    sectionName: "New Section",
                    sectionDescription: "Description for the new section",
                  },
                });
                setSelectedPreviewSection(newSectionIndex);
                dispatch({ type: "UNSELECT_DRAWER_FIELD" });
                setShowSectionPopup(false);
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
                e.target.style.borderColor = "black";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#fff";
                e.target.style.borderColor = "#e9ecef";
              }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div className="typography heading-s" style={{ marginBottom: "0.25rem", color: "black" }}>
                      {t("CUSTOM_SECTION")}
                    </div>
                    <div className="typography body-s" style={{ color: "#666" }}>
                      {t("CREATE_NEW_SECTION")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Template Button */}
              <div style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                cursor: addressSectionExists ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                backgroundColor: addressSectionExists ? "#f5f5f5" : "#fff",
                opacity: addressSectionExists ? 0.6 : 1
              }}
              onClick={() => {
                if (addressSectionExists) return;
                const newSectionIndex = state?.screenData?.[0]?.cards?.length || 0;

                // Get default hierarchy values from fetched data
                const firstHierarchy = hierarchyTypesData?.[0];
                const boundaryLevels = firstHierarchy?.boundaryHierarchy || [];
                const defaultHierarchyType = firstHierarchy?.code || "";
                // Set both highest and lowest to the same value (lowest level) on initial load
                const defaultLowestHierarchy = boundaryLevels.length > 0
                  ? boundaryLevels[boundaryLevels.length - 1]?.boundaryType
                  : "";

                dispatch({
                  type: "TOGGLE_ADDRESS_DETAILS",
                  payload: {
                    enabled: true,
                    currentScreen: state?.screenData?.[0],
                    hierarchyDefaults: {
                      hierarchyType: defaultHierarchyType,
                      highestHierarchy: defaultLowestHierarchy, // Same as lowest on initial load
                      lowestHierarchy: defaultLowestHierarchy,
                    },
                  },
                });
                setSelectedPreviewSection(newSectionIndex);
                dispatch({ type: "UNSELECT_DRAWER_FIELD" });
                setShowSectionPopup(false);
              }}
              onMouseEnter={(e) => {
                if (!addressSectionExists) {
                  e.target.style.backgroundColor = "#f8f9fa";
                  e.target.style.borderColor = "black";
                }
              }}
              onMouseLeave={(e) => {
                if (!addressSectionExists) {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.borderColor = "#e9ecef";
                }
              }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div className="typography heading-s" style={{ marginBottom: "0.25rem", color: addressSectionExists ? "#999" : "black" }}>
                      {t("ADDRESS_SECTION")}
                    </div>
                    <div className="typography body-s" style={{ color: addressSectionExists ? "#999" : "#666" }}>
                      {t("ADD_ADDRESS_FIELDS")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Applicant Template Button */}
              <div style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                cursor: applicantSectionExists ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                backgroundColor: applicantSectionExists ? "#f5f5f5" : "#fff",
                opacity: applicantSectionExists ? 0.6 : 1
              }}
              onClick={() => {
                if (applicantSectionExists) return;
                const newSectionIndex = state?.screenData?.[0]?.cards?.length || 0;
                dispatch({
                  type: "TOGGLE_APPLICANT_DETAILS",
                  payload: {
                    enabled: true,
                    currentScreen: state?.screenData?.[0],
                  }
                });
                setSelectedPreviewSection(newSectionIndex);
                dispatch({ type: "UNSELECT_DRAWER_FIELD" });
                setShowSectionPopup(false);
              }}
              onMouseEnter={(e) => {
                if (!applicantSectionExists) {
                  e.target.style.backgroundColor = "#f8f9fa";
                  e.target.style.borderColor = "black";
                }
              }}
              onMouseLeave={(e) => {
                if (!applicantSectionExists) {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.borderColor = "#e9ecef";
                }
              }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div className="typography heading-s" style={{ marginBottom: "0.25rem", color: applicantSectionExists ? "#999" : "black" }}>
                      {t("APPLICANT_SECTION")}
                    </div>
                    <div className="typography body-s" style={{ color: applicantSectionExists ? "#999" : "#666" }}>
                      {t("APPLICANTS_DETAILS_DESC")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Template Button */}
              <div style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                cursor: documentSectionExists ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                backgroundColor: documentSectionExists ? "#f5f5f5" : "#fff",
                opacity: documentSectionExists ? 0.6 : 1
              }}
              onClick={() => {
                if (documentSectionExists) return;
                const newSectionIndex = state?.screenData?.[0]?.cards?.length || 0;
                dispatch({
                  type: "TOGGLE_DOCUMENT_SECTION",
                  payload: {
                    enabled: true,
                    currentScreen: state?.screenData?.[0],
                  },
                });
                setSelectedPreviewSection(newSectionIndex);
                dispatch({ type: "UNSELECT_DRAWER_FIELD" });
                setShowSectionPopup(false);
              }}
              onMouseEnter={(e) => {
                if (!documentSectionExists) {
                  e.target.style.backgroundColor = "#f8f9fa";
                  e.target.style.borderColor = "black";
                }
              }}
              onMouseLeave={(e) => {
                if (!documentSectionExists) {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.borderColor = "#e9ecef";
                }
              }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div className="typography heading-s" style={{ marginBottom: "0.25rem", color: documentSectionExists ? "#999" : "black" }}>
                      {t("DOCUMENT_SECTION")}
                    </div>
                    <div className="typography body-s" style={{ color: documentSectionExists ? "#999" : "#666" }}>
                      {t("DOCUMENT_DESC")}
                    </div>
                  </div>
                </div>
              </div>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowSectionPopup(false);
          }}
          onClose={() => {
            setShowSectionPopup(false);
          }}
          equalWidthButtons={"false"}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("CANCEL")}
              onClick={() => {
                setShowSectionPopup(false);
              }}
            />,
          ]}
        />
      )}

      {showFormNamePopup && (
        <PopUp
          type={"default"}
          heading={t("CREATE_NEW_FORM")}
          children={[
            <div style={{ padding: "1rem 0" }} className="form-name-popup-fields">
              <FieldV1
                required={true}
                type={"text"}
                label={t("FORM_NAME")}
                value={popupFormName}
                config={{
                  step: "",
                }}
                onChange={handlePopupFormNameChange}
                populators={{ fieldPairClassName: "" }}
                error={validationErrors.formName ? t(validationErrors.formName) : null}
                infoMessage={t("INFO_FORM_NAME")}
              />
              <FieldV1
                type={"textarea"}
                label={t("FORM_DESCRIPTION")}
                value={popupFormDescription}
                config={{
                  step: "",
                }}
                onChange={handlePopupFormDescriptionChange}
                populators={{ fieldPairClassName: "" }}
                infoMessage={t("INFO_FORM_DESCRIPTION")}
              />
            </div>,
          ]}
          onOverlayClick={() => {
            setShowFormNamePopup(false);
          }}
          onClose={() => {
            setShowFormNamePopup(false);
          }}
          equalWidthButtons={"false"}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("CANCEL")}
              onClick={() => {
                setShowFormNamePopup(false);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("CREATE_FORM")}
              onClick={() => {
                if (popupFormName?.trim()) {
                  // Update the main form name and description with popup values
                  setCurrentFormName(popupFormName);
                  setCurrentFormDescription(popupFormDescription);
                  
                  // Call parent's onChange functions if they exist
                  if (onFormNameChange && typeof onFormNameChange === 'function') {
                    onFormNameChange(popupFormName);
                  }
                  if (onFormDescriptionChange && typeof onFormDescriptionChange === 'function') {
                    onFormDescriptionChange(popupFormDescription);
                  }
                  
                  setShowFormNamePopup(false);
                  setValidationErrors({}); // Clear any existing validation errors
                } else {
                  setValidationErrors({ formName: "FORM_NAME_REQUIRED" });
                }
              }}
            />,
          ]}
        />
      )}

      <Footer
        actionFields={[
          <Button
            type={"button"}
            style={{ marginLeft: "2.5rem", width: "14rem" }}
            label={t("HCM_BACK")}
            variation={"secondary"}
            t={t}
            onClick={() => {
              window.history.back();
            }}
          ></Button>,
          <Button
            type={"button"}
            label={editMode ? t("UPDATE_FORM") : t("PROCEED_TO_PREVIEW")}
            variation={"primary"}
            onClick={() => handleSubmit(true)}
            style={{ width: "14rem" }}
            t={t}
          ></Button>,
        ]}
        className={"new-actionbar"}
      />
    </AppConfigContext.Provider>
  );
}

export default React.memo(AppConfigurationWrapper);
