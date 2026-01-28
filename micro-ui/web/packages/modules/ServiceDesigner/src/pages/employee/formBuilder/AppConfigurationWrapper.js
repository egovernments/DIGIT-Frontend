import React, { createContext, useContext, useEffect, useReducer, useState, useCallback, useMemo, useRef } from "react";
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
import { useNavigate } from "react-router-dom";

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

const AppConfigContext = createContext();

const initialState = {};

export const useAppConfigContext = () => {
  return useContext(AppConfigContext);
};

const reorderConfig = (config, fromIndex, toIndex) => {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= config?.length ||
    toIndex >= config?.length
  ) {
    return [...config];
  }

  const updatedConfig = [...config];
  const [movedItem] = updatedConfig.splice(fromIndex, 1);
  updatedConfig.splice(toIndex, 0, movedItem);
  return updatedConfig?.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
};

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
                      deleteFlag: false,
                      isMandatory: true,
                      hidden: false,
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
                      deleteFlag: false,
                      hideSpan: true,
                      isMandatory: true,
                      hidden: false,
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
                      deleteFlag: false,
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
                      deleteFlag: false,
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
                  sectionType: "applicant",
                });
              }
            } else {
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
                      deleteFlag: false,
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
                      deleteFlag: false,
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
                      deleteFlag: false,
                      hidden: false,
                      order: 3,
                      component: "HierarchyDropdown",
                      populators: {
                        name: "boundaryHierarchy",
                        hierarchyType: action.payload.hierarchyDefaults?.hierarchyType || "",
                        highestHierarchy: action.payload.hierarchyDefaults?.highestHierarchy || "",
                        lowestHierarchy: action.payload.hierarchyDefaults?.lowestHierarchy || "",
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
                      deleteFlag: false,
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
              const documentSectionExists = updatedCards.some(card => 
                card?.sectionType === "document" || 
                card?.fields?.some(field => field.jsonPath === "DocumentUpload")
              );
              
              if (!documentSectionExists) {
                updatedCards.push({
                  fields: [],
                  header: "Document Section",
                  description: "Document Upload and Download",
                  sectionType: "document",
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
                        label: toSentenceCase(action.payload.fieldData?.label),
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
    case "HIDE_FIELD":
      return {
        ...state,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            return {
              ...item,
              cards: item?.cards?.map((j, cardIndex) => {
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
      return {
        ...state,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            return {
              ...item,
              cards: item?.cards?.map((j, k) => {
                if (j === action.payload.currentField) {
                  return {
                    ...j,
                    headerFields: j.headerFields?.map((m, n) => {
                      if (m.label === action?.payload?.field?.label) {
                        return {
                          ...m,
                          value: action?.payload?.value,
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
        currentCardIndex: action?.payload?.currentCardIndex,
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
  const navigate = useNavigate();
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

  const RESTRICTED_CHARS = /[?&=\/:#+]/g;
  const sanitizeInput = (value) => value.replace(RESTRICTED_CHARS, "");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const { saveFormConfig, updateFormConfig, fetchFormConfigByName } = useFormConfigAPI();
  
  const module = searchParams.get("module");
  const service = searchParams.get("service");
  const editMode = searchParams.get("editMode") === "true";

  const originalFormName = searchParams.get("formName") || "";

  const [currentFormName, setCurrentFormName] = useState(formName || "");
  const [currentFormDescription, setCurrentFormDescription] = useState(formDescription || "");

  const [popupFormName, setPopupFormName] = useState(formName || "");
  const [popupFormDescription, setPopupFormDescription] = useState(formDescription || "");
  
  // Use ref to track if popup should show - compute only once
  const initialShowFormNamePopup = useRef(() => {
    const isEditMode = searchParams.get("editMode") === "true";
    return !(formName || "") && !isEditMode;
  });
  const [showFormNamePopup, setShowFormNamePopup] = useState(initialShowFormNamePopup.current);
  const [showSectionPopup, setShowSectionPopup] = useState(false);

  const { data: existingFormData, isLoading: isLoadingExistingForm } = fetchFormConfigByName(originalFormName);

  const hierarchyTypesReq = useMemo(() => ({
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
  }), [tenantId]);

  const { data: hierarchyTypesData } = Digit.Hooks.useCustomAPIHook(hierarchyTypesReq);

  // Track if MDMS data has been initialized
  const mdmsInitializedRef = useRef(false);

  // Memoize the select callback to prevent it from being recreated on every render
  const mdmsSelectCallback = useCallback((data) => {
    const fieldTypeMappingConfig = data?.["Studio"]?.["FieldTypeMappingConfig"] || [];
    const fieldPropertiesPanelConfig = data?.["Studio"]?.["FieldPropertiesPanelConfig"] || [];
    const sortedFieldTypes = [...fieldTypeMappingConfig].sort((a, b) => (a.order || 0) - (b.order || 0));
    const sortedPanelConfig = [...fieldPropertiesPanelConfig].sort((a, b) => (a.order || 0) - (b.order || 0));

    return {
      ...data?.["Studio"],
      DrawerPanelConfig: sortedPanelConfig,
      AppFieldType: sortedFieldTypes,
      DetailsConfig: data?.["Studio"]?.["DETAILS_RENDERER_CONFIG"],
    };
  }, []);

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
      select: mdmsSelectCallback,
    },
    { schemaCode: "BASE_APP_MASTER_DATA" }
  );

  // Dispatch MASTER_DATA only when AppConfigMdmsData changes and hasn't been initialized
  useEffect(() => {
    if (AppConfigMdmsData && !mdmsInitializedRef.current) {
      mdmsInitializedRef.current = true;
      dispatch({
        type: "MASTER_DATA",
        state: {
          screenConfig: screenConfig,
          ...AppConfigMdmsData,
        },
      });
    }
  }, [AppConfigMdmsData, screenConfig]);

  const openAddFieldPopup = useCallback((data) => {
    setPopupData({ ...data, id: crypto.randomUUID() });
  }, []);

  const fetchLoc = useCallback((key) => {
    return locState?.find((i) => i.code === key)?.[currentLocale];
  }, [locState, currentLocale]);

  const checkDuplicateFormName = useCallback(async (formName) => {
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
        return false;
      }
      
      const existingForms = draft.data.uiforms;
      
      if (editMode && existingFormData) {
        return existingForms.some(form => 
          form.formName === formName.trim() && 
          form.formName !== existingFormData.data?.formName
        );
      }
      
      return existingForms.some(form => form.formName === formName.trim());
    } catch (error) {
      console.error("Error checking duplicate form name:", error);
      return false;
    }
  }, [tenantId, module, service, editMode, existingFormData]);

  const validateForm = useCallback(async () => {
    const errors = {};

    if (!currentFormName || !currentFormName.trim()) {
      errors.formName = t("FORM_NAME_REQUIRED");
    } else {
      const isDuplicate = await checkDuplicateFormName(currentFormName);
      if (isDuplicate) {
        errors.duplicateFormName = t("FORM_NAME_ALREADY_EXISTS");
      }
    }

    const allFields = [];
    state?.screenData?.[0]?.cards?.forEach(card => {
      if (card?.fields) {
        allFields.push(...card.fields);
      }
    });

    const fieldsWithoutType = allFields.filter(field => !field.type);
    if (fieldsWithoutType.length > 0) {
      errors.fieldType = t("FIELD_TYPE_REQUIRED");
    }

    const fieldNames = allFields.map(field => field.label).filter(Boolean);
    const duplicateNames = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      errors.duplicateNames = t("DUPLICATE_FIELD_NAMES");
    }

    const fieldsWithMissingMetadata = allFields.filter(field => {
      if (!field.label || !field.type) return true;
      return false;
    });
    if (fieldsWithMissingMetadata.length > 0) {
      errors.missingMetadata = t("MISSING_REQUIRED_INFORMATION");
    }

    const radioDropdownFields = allFields.filter(field => 
      field.type === 'radio' || field.type === 'dropdown'
    );
    
    const fieldsWithInsufficientOptions = radioDropdownFields.filter(field => {
      if (field.isMdms || field.schemaCode) {
        return false;
      }
      
      if (field.dropDownOptions && Array.isArray(field.dropDownOptions)) {
        return field.dropDownOptions.length < 2;
      }
      
      return true;
    });
    
    if (fieldsWithInsufficientOptions.length > 0) {
      const fieldNames = fieldsWithInsufficientOptions.map(field => field.label).join(', ');
      errors.insufficientOptions = `${t("AT_LEAST_2_OPTIONS_REQUIRED")} ${fieldNames}`;
    }

    const documentUploadAndDownloadFields = allFields.filter(field =>
      field.type === 'documentUploadAndDownload'
    );

    const fieldsWithMissingTemplate = documentUploadAndDownloadFields.filter(field => {
      const hasTemplateUrl = field.templateDownloadURL && field.templateDownloadURL.trim() !== '';
      const hasTemplatePDFKey = field.templatePDFKey && field.templatePDFKey.trim() !== '';
      
      return !hasTemplateUrl && !hasTemplatePDFKey;
    });

    if (fieldsWithMissingTemplate.length > 0) {
      const fieldNames = fieldsWithMissingTemplate.map(field => field.label).join(', ');
      errors.missingTemplate = `${t("TEMPLATE_URL_OR_PDF_KEY_REQUIRED")} ${fieldNames}`;
    }

    const fieldsWithInvalidTemplateUrl = documentUploadAndDownloadFields.filter(field => {
      const url = field.templateDownloadURL?.trim();
      if (!url) return false;

      if (url.includes(",") || url.split(" ").length > 1 || url.includes("|")) {
        return true;
      }

      try {
        new URL(url);
        return false;
      } catch (e) {
        return true;
      }
    });

    if (fieldsWithInvalidTemplateUrl.length > 0) {
      const fieldNames = fieldsWithInvalidTemplateUrl.map(field => field.label).join(', ');
      errors.invalidTemplateUrl = `${t("INVALID_TEMPLATE_URL_SINGLE_URL_ONLY")} ${fieldNames}`;
    }

    const fieldsWithBothTemplates = documentUploadAndDownloadFields.filter(field => {
      const hasTemplateUrl = field.templateDownloadURL && field.templateDownloadURL.trim() !== '';
      const hasTemplatePDFKey = field.templatePDFKey && field.templatePDFKey.trim() !== '';

      return hasTemplateUrl && hasTemplatePDFKey;
    });

    if (fieldsWithBothTemplates.length > 0) {
      const fieldNames = fieldsWithBothTemplates.map(field => field.label).join(', ');
      errors.bothTemplatesProvided = `${t("ONLY_ONE_TEMPLATE_ALLOWED")} ${fieldNames}`;
    }

    const fieldsWithIncompleteRegexValidation = allFields.filter(field => {
      const hasRegex = field.regex && typeof field.regex === 'string' && field.regex.trim() !== '';
      const hasErrorMessage = field.errorMessage && typeof field.errorMessage === 'string' && field.errorMessage.trim() !== '';

      return (hasRegex && !hasErrorMessage) || (!hasRegex && hasErrorMessage);
    });

    if (fieldsWithIncompleteRegexValidation.length > 0) {
      const fieldNames = fieldsWithIncompleteRegexValidation.map(field => field.label).join(', ');
      errors.incompleteRegexValidation = `${t("REGEX_AND_ERROR_MESSAGE_REQUIRED_TOGETHER")} ${fieldNames}`;
    }

    const allCards = state?.screenData?.[0]?.cards || [];

    const hasPredefinedSections = allCards.some(card => {
      const sectionType = card.sectionType || "";
      return sectionType === "applicant" ||
             sectionType === "address" ||
             sectionType === "document";
    });

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

    if (!hasPredefinedSections) {
      const totalFields = allCards.reduce((count, card) => {
        return count + (card.fields ? card.fields.length : 0);
      }, 0);

      if (totalFields === 0) {
        errors.noFieldsInCustomSections = t("AT_LEAST_ONE_FIELD_REQUIRED_IN_CUSTOM_SECTIONS");
      } 
    }

    const emptySections = allCards.filter(card => {
      return !card.fields || card.fields.length === 0;
    });

    if (emptySections.length > 0) {
      const emptySectionNames = emptySections.map(card => {
        const headingField = card.headerFields?.find(hf => hf.label === "SCREEN_HEADING");
        return headingField?.value || card.header || "Unnamed Section";
      }).join(', ');

      errors.emptySections = `${t("SECTIONS_CANNOT_BE_EMPTY")} ${emptySectionNames}`;
    }

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

    const fieldsWithInvalidRegex = allFields.filter(field => {
      if (field.regex && typeof field.regex === 'string' && field.regex.trim() !== '') {
        try {
          new RegExp(field.regex);
        } catch (e) {
          return true;
        }

        const hasRegexSyntax = /[\[\](){}^$.*+?|\\]/.test(field.regex);
        if (!hasRegexSyntax) {
          return true;
        }

        return false;
      }
      return false;
    });

    if (fieldsWithInvalidRegex.length > 0) {
      const fieldNames = fieldsWithInvalidRegex.map(field => field.label).join(', ');
      errors.invalidRegex = `${t("INVALID_REGEX_PATTERN")} ${fieldNames}`;
    }

    return errors;
  }, [currentFormName, state?.screenData, checkDuplicateFormName, t]);

  const checkForUnsavedChanges = useCallback(() => {
    return hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  const handleFormDescriptionChange = useCallback((event) => {
    const newValue = event.target.value;
    setCurrentFormDescription(newValue);
    if (onFormDescriptionChange && typeof onFormDescriptionChange === 'function') {
      onFormDescriptionChange(newValue);
    }
  }, [onFormDescriptionChange]);

  const handlePopupFormNameChange = useCallback((event) => {
    const newValue = sanitizeInput(event.target.value);
    setPopupFormName(newValue);
  }, []);

  const handlePopupFormDescriptionChange = useCallback((event) => {
    const newValue = event.target.value;
    setPopupFormDescription(newValue);
  }, []);

  useEffect(() => {
    const handleOpenFormNamePopup = () => {
      setPopupFormName(currentFormName);
      setPopupFormDescription(currentFormDescription);
      setShowFormNamePopup(true);
    };

    window.addEventListener('openFormNamePopup', handleOpenFormNamePopup);
    return () => {
      window.removeEventListener('openFormNamePopup', handleOpenFormNamePopup);
    };
  }, [currentFormName, currentFormDescription]);

  // Use ref to track if we've already closed the popup
  const popupClosedRef = useRef(false);
  
  useEffect(() => {
    if (editMode && existingFormData && !isLoadingExistingForm && showFormNamePopup && !popupClosedRef.current) {
      popupClosedRef.current = true;
      setShowFormNamePopup(false);
    }
  }, [editMode, existingFormData, isLoadingExistingForm, showFormNamePopup]);

  // Track screen data changes for unsaved changes - use ref to prevent loops
  const prevScreenDataRef = useRef(null);
  
  useEffect(() => {
    if (state?.screenData && prevScreenDataRef.current !== null && state?.screenData !== prevScreenDataRef.current) {
      setHasUnsavedChanges(true);
    }
    prevScreenDataRef.current = state?.screenData;
  }, [state?.screenData]);

  const clearUnsavedChanges = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const updateWorkflowFormReferencesInLocalStorage = useCallback((oldFormName, newFormName) => {
    try {
      let updated = false;

      const canvasElementsStr = localStorage.getItem("canvasElements");
      if (canvasElementsStr && canvasElementsStr !== "undefined") {
        const canvasElements = JSON.parse(canvasElementsStr);

        canvasElements.forEach(element => {
          if (element.nodetype === "start" && element.form) {
            if (typeof element.form === 'object') {
              if (element.form.code === oldFormName || element.form.name === oldFormName) {
                element.form.code = newFormName;
                element.form.name = newFormName;
                updated = true;
              }
            }
            else if (typeof element.form === 'string' && element.form === oldFormName) {
              element.form = newFormName;
              updated = true;
            }
          }
        });

        if (updated) {
          localStorage.setItem("canvasElements", JSON.stringify(canvasElements));
        }
      }

      return updated;
    } catch (error) {
      console.error("Failed to update workflow form references in localStorage:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    const handleStepChange = (e) => {
      setNextButtonDisable(e.detail);
    };

    window.addEventListener("lastButtonDisabled", handleStepChange);

    return () => {
      window.removeEventListener("lastButtonDisabled", handleStepChange);
    };
  }, []);

  // Use ref to track if screen data has been set
  const screenDataSetRef = useRef(false);
  
  useEffect(() => {
    if (editMode && (existingFormData || isLoadingExistingForm)) {
      return;
    }
    if (!screenDataSetRef.current && screenConfig) {
      screenDataSetRef.current = true;
      dispatch({
        type: "SET_SCREEN_DATA",
        state: {
          screenConfig: screenConfig,
        },
      });
    }
  }, [screenConfig, editMode, existingFormData, isLoadingExistingForm]);

  // Use ref to track if existing form data has been loaded
  const existingFormLoadedRef = useRef(false);
  
  useEffect(() => {
    if (editMode && existingFormData && !isLoadingExistingForm && !existingFormLoadedRef.current) {
      existingFormLoadedRef.current = true;
      
      const existingFormNameValue = existingFormData?.data?.formName || originalFormName;
      const existingFormDescriptionValue = existingFormData?.data?.formDescription || formDescription;
      
      setCurrentFormName(existingFormNameValue);
      setCurrentFormDescription(existingFormDescriptionValue);
      
      setPopupFormName(existingFormNameValue);
      setPopupFormDescription(existingFormDescriptionValue);
      
      const formConfig = existingFormData?.data?.formConfig;
      if (formConfig?.screens) {
        const processedScreens = formConfig.screens.map(screen => ({
          ...screen,
          cards: screen.cards?.map(card => ({
            ...card,
            fields: card.fields?.map(field => {
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

  // Memoize field type options for the popup dropdown - MUST be before any early returns
  const fieldTypeOptions = useMemo(() => {
    const allFieldTypes = (state?.MASTER_DATA?.AppFieldType || [])
      .filter((item) => item?.metadata?.type !== "template" && item?.metadata?.type !== "dynamic")
      ?.sort((a, b) => a?.order - b?.order);

    const currentCard = popupData?.currentCard;

    const isDocumentSection =
      currentCard?.header === "Document Section" ||
      currentCard?.description === "Document Upload and Download" ||
      currentCard?.fields?.some(field =>
        field.jsonPath === "DocumentUpload" ||
        field.type === "documentUpload" ||
        field.type === "documentUploadAndDownload"
      );

    if (isDocumentSection) {
      return allFieldTypes.filter(fieldType =>
        fieldType.type === "documentUpload" ||
        fieldType.type === "documentUploadAndDownload"
      );
    }

    return allFieldTypes.filter(fieldType =>
      fieldType.type !== "documentUpload" &&
      fieldType.type !== "documentUploadAndDownload" &&
      fieldType.type !== "hierarchyDropdown" &&
      fieldType.type !== "mapcoord"
    );
  }, [state?.MASTER_DATA?.AppFieldType, popupData?.currentCard]);

  // Memoize context value to prevent unnecessary re-renders - MUST be before any early returns
  const contextValue = useMemo(() => ({
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
    documentSectionEnabled: state?.documentSectionEnabled,
  }), [
    state,
    openAddFieldPopup,
    currentFormName,
    currentFormDescription,
    selectedPreviewSection,
    validationErrors,
    hasUnsavedChanges,
  ]);

  if (isLoadingAppConfigMdmsData || (editMode && isLoadingExistingForm)) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  const closeToast = () => {
    setShowToast(null);
  };

  function createLocaleArrays() {
    const result = {};
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

      if (validation.pattern && value) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          return validation.message || `${t(`${label || "Field"}_IS_INVALID`)}`;
        }
      }

      return null;
    };

    for (let i = 0; i < fields.length; i++) {
      const fieldObj = fields[i];

      for (const key in fieldObj) {
        const config = findConfig(key, drawerPanelConfig);
        if (!config) continue;

        let validation = config.validation;

        if (Array.isArray(validation)) {
          const valFromArray = validation.find((v) => v.key === key || !v.key);
          if (valFromArray) validation = valFromArray;
          else validation = null;
        }

        const value = fieldObj[key];

        const errorMsg = validateValue(fetchLoc(value), validation, config.label, fieldObj, config);

        if (errorMsg) {
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
    const validationErrors = await validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      
      const firstError = Object.values(validationErrors)[0];
      setShowToast({ 
        key: "error", 
        label: firstError,
        transitionTime: 5000
      });
      return;
    }

    setValidationErrors({});
    
    let updateCount = 0;
    let updateSuccess = false;
    
    try {
      setLoading(true);
      
      updateSuccess = true;
      
      if (finalSubmit) {
        if (!module || !service) {
          setShowToast({ 
            key: "error", 
            label: "MODULE_AND_SERVICE_REQUIRED",
            transitionTime: 5000
          });
          return;
        }
        
        try {
          const mdmsFormData = transformFormDataToMDMS(
            {
              ...state,
            },
            module,
            service,
            formName || currentFormName,
            formDescription || currentFormDescription
          );
          
          let result;
          if (editMode) {
            if (existingFormData) {
              const updatePayload = {
                module: module,
                service: service,
                formName: formName || currentFormName,
                formDescription: formDescription || currentFormDescription,
                formConfig: mdmsFormData.formConfig,
                formId: existingFormData.id,
                originalFormName: originalFormName,
              };
              result = await updateFormConfig.mutateAsync(updatePayload);

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
                navigate(`/${window.contextPath}/employee/servicedesigner/forms?module=${module}&service=${service}`);
              }, 3000);
            } else {
              try {
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
                    };
                    result = await updateFormConfig.mutateAsync(updatePayload);

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
                      navigate(`/${window.contextPath}/employee/servicedesigner/forms?module=${module}&service=${service}`);
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
              navigate(`/${window.contextPath}/employee/servicedesigner/forms?module=${module}&service=${service}`);
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

  const allCards = state?.screenData?.[0]?.cards || [];
  const addressSectionExists = allCards.some(card =>
    card?.sectionType === "address" ||
    card?.fields?.some(field => field.jsonPath === "AddressPincode")
  );
  const applicantSectionExists = allCards.some(card => card?.sectionType === "applicant");
  const documentSectionExists = allCards.some(card => card?.sectionType === "document");

  return (
    <AppConfigContext.Provider value={contextValue}>
      {loading && <Loader page={true} variant={"OverlayLoader"} loaderText={t("SAVING_CONFIG_IN_SERVER")} />}
      
      <div style={{ marginRight: "1.5rem", position: "relative", width: "100%" }}>
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
                  ...card?.fields?.map((field) => ({ message: field?.label })),
                  ...card?.headerFields?.map((headerField) => ({ message: headerField?.value })),
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
                options: fieldTypeOptions,
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
      
      {showSectionPopup && (
        <PopUp
          type={"default"}
          heading={t("ADD_SECTION")}
          children={[
            <div style={{ padding: "1rem 0" }}>
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
                e.currentTarget.style.backgroundColor = "#f8f9fa";
                e.currentTarget.style.borderColor = "black";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.borderColor = "#e9ecef";
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

                const firstHierarchy = hierarchyTypesData?.[0];
                const boundaryLevels = firstHierarchy?.boundaryHierarchy || [];
                const defaultHierarchyType = firstHierarchy?.code || "";
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
                      highestHierarchy: defaultLowestHierarchy,
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
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.borderColor = "black";
                }
              }}
              onMouseLeave={(e) => {
                if (!addressSectionExists) {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.borderColor = "#e9ecef";
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
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.borderColor = "black";
                }
              }}
              onMouseLeave={(e) => {
                if (!applicantSectionExists) {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.borderColor = "#e9ecef";
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
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.borderColor = "black";
                }
              }}
              onMouseLeave={(e) => {
                if (!documentSectionExists) {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.borderColor = "#e9ecef";
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
                  setCurrentFormName(popupFormName);
                  setCurrentFormDescription(popupFormDescription);
                  
                  if (onFormNameChange && typeof onFormNameChange === 'function') {
                    onFormNameChange(popupFormName);
                  }
                  if (onFormDescriptionChange && typeof onFormDescriptionChange === 'function') {
                    onFormDescriptionChange(popupFormDescription);
                  }
                  
                  setShowFormNamePopup(false);
                  setValidationErrors({});
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