import React, { createContext, Fragment, useContext, useEffect, useMemo, useReducer, useState } from "react";
import AppFieldScreenWrapper from "./AppFieldScreenWrapper";
import { Footer, Button, Loader, PopUp, SidePanel, Toast, FieldV1 } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import DrawerFieldComposer from "./DrawerFieldComposer";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import AppLocalisationTable from "./AppLocalisationTable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AppPreview from "../../../components/AppPreview";
import { useCustomT } from "./useCustomT";
import { useQueryClient } from "@tanstack/react-query";

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
                    },
                    {
                      type: "text",
                      label: "SCREEN_DESCRIPTION",
                      active: true,
                      jsonPath: "Description",
                      metaData: {},
                      required: true,
                    },
                  ],
                },
              ],
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
                if (j.header === action.payload.currentCard?.header) {
                  const regex = new RegExp(`^${item?.name}_${j?.header}_newField(\\d+)$`);
                  const maxCounter = j.fields
                    .map((f) => {
                      const match = f.jsonPath && f.jsonPath.match(regex);
                      return match ? parseInt(match[1], 10) : 0;
                    })
                    .reduce((max, curr) => Math.max(max, curr), 0);
                  const nextCounter = maxCounter + 1;
                  return {
                    ...j,
                    fields: [
                      ...j.fields,
                      {
                        ...action?.payload?.fieldData,
                        jsonPath: `${item?.name}_${j?.header}_newField${nextCounter}`,
                        type: action.payload.fieldData?.type?.fieldType,
                        appType: action.payload.fieldData?.type?.type,
                        label: action.payload.fieldData?.label,
                        active: true,
                        deleteFlag: true,
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
              cards: item?.cards?.map((j, k) => {
                if (j.header === action.payload.currentCard?.header) {
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
              cards: item?.cards?.map((j, k) => {
                if (j.header === action.payload.currentCard?.header) {
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
      updateLocalization(
        action?.payload?.localisedCode,
        Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage,
        action?.payload?.value
      );
      return {
        ...state,
        screenData: state?.screenData?.map((item, index) => {
          if (item?.name === action?.payload?.currentScreen?.name) {
            return {
              ...item,
              cards: item?.cards?.map((j, k) => {
                if (j.header === action.payload.currentField?.header) {
                  return {
                    ...j,
                    headerFields: j.headerFields?.map((m, n) => {
                      if (m.label === action?.payload?.field?.label) {
                        return {
                          ...m,
                          value: action?.payload?.localisedCode,
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
              cards: item?.cards?.map((j, k) => {
                if (j.header === state.currentCard?.header) {
                  return {
                    ...j,
                    fields: j.fields.map((k) => {
                      if (k.id ? k.id === state?.drawerField?.id : k.jsonPath === state?.drawerField?.jsonPath) {
                        return {
                          ...action.payload.updatedState,
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
    default:
      return state;
  }
};

const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";

function AppConfigurationWrapper({ screenConfig, localeModule, pageTag }) {
  const queryClient = useQueryClient();
  const { locState, addMissingKey, updateLocalization, onSubmit, back, showBack, parentDispatch } = useAppLocalisationContext();
  const [state, dispatch] = useReducer((state, action) => reducer(state, action, updateLocalization), initialState);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;
  const [showPopUp, setShowPopUp] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [addFieldData, setAddFieldData] = useState(null);
  const addFieldDataLabel = useMemo(() => {
    return addFieldData?.label ? useCustomT(addFieldData?.label) : null;
  }, [addFieldData]);
  const searchParams = new URLSearchParams(location.search);
  const fieldMasterName = searchParams.get("fieldType");
  const [showPreview, setShowPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(null);
  const { mutateAsync: localisationMutate } = Digit.Hooks.campaign.useUpsertLocalisationParallel(tenantId, localeModule, currentLocale);
  const [showToast, setShowToast] = useState(null);
  const [nextButtonDisable, setNextButtonDisable] = useState(null);
  const enabledModules = Digit?.SessionStorage.get("initData")?.languages || [];
  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [
      { name: fieldMasterName, limit: 100 },
      { name: "FieldPropertiesPanelConfig", limit: 100 },
      { name: "DETAILS_RENDERER_CONFIG", limit: 100 },
    ],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        dispatch({
          type: "MASTER_DATA",
          state: {
            screenConfig: screenConfig,
            ...data?.["HCM-ADMIN-CONSOLE"],
            DrawerPanelConfig: data?.["HCM-ADMIN-CONSOLE"]?.["FieldPropertiesPanelConfig"],
            AppFieldType: data?.["HCM-ADMIN-CONSOLE"]?.[fieldMasterName],
            DetailsConfig: data?.["HCM-ADMIN-CONSOLE"]?.["DETAILS_RENDERER_CONFIG"],
            // ...dummyMaster,
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

  useEffect(() => {
    dispatch({
      type: "SET_SCREEN_DATA",
      state: {
        screenConfig: screenConfig,
      },
    });
  }, [screenConfig]);

  const closeToast = () => {
    setShowToast(null);
  };

  function createLocaleArrays(fetchCurrentLocaleOnly) {
    const result = {};

    if (!Array.isArray(locState) || !locState[0] || typeof currentLocale !== "string" || !currentLocale.includes("_")) {
      return result;
    }
    // Dynamically determine locales
    const locales = fetchCurrentLocaleOnly
      ? []
      : Object.keys(locState[0]).filter((key) => key.includes(currentLocale.slice(currentLocale.indexOf("_"))) && key !== currentLocale);
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
        const value = (locS || [])?.find((i) => i?.code === fieldItem?.value)?.[cL] || null;
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
      queryClient.removeQueries(`SEARCH_APP_LOCALISATION_FOR_TABLE`);
      setShowToast({ key: "success", label: "TRANSLATIONS_SAVED_SUCCESSFULLY" });
    } catch (error) {
      setLoading(false);
      setShowToast({ key: "error", label: "CONFIG_SAVE_FAILED" });
      console.error(`Error sending localisation data:`, error);
    } finally {
      setShowPopUp(false);
      setLoading(false);
    }
    return;
  };
  const handleSubmit = async (finalSubmit, tabChange) => {
    if (state?.screenData?.[0]?.type === "object") {
      //skipping template screen validation
      const errorCheck = validateFromState(
        state?.screenData?.[0]?.cards?.[0],
        state?.MASTER_DATA?.FieldPropertiesPanelConfig,
        locState,
        currentLocale
      );
      if (errorCheck) {
        setShowToast({ key: "error", label: errorCheck?.value ? errorCheck?.value : errorCheck });
        return;
      }
    }
    const localeArrays = createLocaleArrays(true);
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
    setShowPopUp(false);
    setLoading(false);
    if (updateSuccess || !updateCount) {
      onSubmit(state, finalSubmit, tabChange); // assumes onSubmit is a stable function
    }
    console.info("LOCALISATION_UPSERT_SUCCESS");
  };

  useEffect(() => {
    const handleStepChange = (e) => {
      setNextButtonDisable(e.detail);
    };

    const handleTabChange = async (e) => {
      // Submit the form here
      await handleSubmit(false, true); // your submit function
      // Now notify the caller that submit is done
      e.detail?.onComplete?.();
    };

    window.addEventListener("lastButtonDisabled", handleStepChange);
    window.addEventListener("tabChangeWithSave", handleTabChange);

    return () => {
      window.removeEventListener("lastButtonDisabled", handleStepChange);
      window.removeEventListener("tabChangeWithSave", handleTabChange);
    };
  }, [state, locState, handleSubmit]);

  const currentPage = parseInt(pageTag.split(" ")[1]);

  if (isLoadingAppConfigMdmsData) {
    return <Loader page={true} variant={"PageLoader"} />;
  }
  return (
    <AppConfigContext.Provider value={{ state, dispatch, openAddFieldPopup }}>
      {loading && <Loader page={true} variant={"OverlayLoader"} loaderText={t("SAVING_CONFIG_IN_SERVER")} />}
      <AppPreview data={state?.screenData?.[0]} selectedField={state?.drawerField} t={useCustomT} />
      <div className="appConfig-flex-action">
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
            <div className="typography heading-m" style={{ color: "#0B4B66" }}>
              {t("FIELD_CONFIGURATION")}
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
            <>
              <Button
                className=""
                variation="secondary"
                label={t("BACK")}
                title={t("BACK")}
                icon="ArrowBack"
                size="small"
                onClick={() =>
                  dispatch({
                    type: "UNSELECT_DRAWER_FIELD",
                  })
                }
              />
              <DrawerFieldComposer />
            </>
          ) : (
            <DndProvider backend={HTML5Backend}>
              <AppFieldScreenWrapper />
            </DndProvider>
          )}
        </SidePanel>
      )}
      {showPreview && (
        <PopUp
          className={"custom-pop-up"}
          type={"default"}
          heading={t("CHECKLIST_PREVIEW")}
          children={[]}
          onOverlayClick={() => {
            setShowPreview(false);
          }}
          onClose={() => {
            setShowPreview(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("CLOSE")}
              onClick={() => {
                setShowPreview(false);
              }}
            />,
          ]}
          sortFooterChildren={true}
        >
          <AppPreview data={state?.screenData?.[0]} selectedField={state?.drawerField} />
        </PopUp>
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
              type={"text"}
              label={`${t("ADD_FIELD_LABEL")}`}
              value={addFieldData?.label ? useCustomT(addFieldData?.label) : ""}
              config={{
                step: "",
              }}
              onChange={(event) => {
                updateLocalization(
                  addFieldData?.label && addFieldData?.label !== true
                    ? addFieldData?.label
                    : `${popupData?.currentScreen?.parent}_${popupData?.currentScreen?.name}_${popupData?.id}`,
                  Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage,
                  event.target.value
                );
                setAddFieldData((prev) => ({
                  ...prev,
                  label:
                    addFieldData?.label && addFieldData?.label !== true
                      ? addFieldData?.label
                      : `${popupData?.currentScreen?.parent}_${popupData?.currentScreen?.name}_${popupData?.id}`,
                }));
              }}
              populators={{ fieldPairClassName: "" }}
              error={showError?.label ? t(showError?.label) : null}
            />,
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
                options: (state?.MASTER_DATA?.AppFieldType || [])
                  .filter((item) => item?.metadata?.type !== "template" && item?.metadata?.type !== "dynamic")
                  ?.sort((a, b) => a?.order - b?.order),
                optionsKey: "type",
              }}
              error={showError?.dropdown ? t(showError?.dropdown) : null}
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
                  setShowError({ label: "FIELD_TYPE_AND_LABEL_REQUIRED", dropdown: "FIELD_TYPE_AND_LABEL_REQUIRED" });
                  return;
                } else if (!addFieldDataLabel?.trim() && !addFieldData?.type) {
                  setShowError({ label: "FIELD_TYPE_AND_LABEL_REQUIRED", dropdown: "FIELD_TYPE_AND_LABEL_REQUIRED" });
                  return;
                } else if (!addFieldData?.type) {
                  setShowError({ dropdown: "FIELD_TYPE_AND_LABEL_REQUIRED" });
                  return;
                } else if (!addFieldDataLabel?.trim()) {
                  setShowError({ label: "FIELD_TYPE_AND_LABEL_REQUIRED" });
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
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
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
            label={t("PROCEED_TO_PREVIEW")}
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
