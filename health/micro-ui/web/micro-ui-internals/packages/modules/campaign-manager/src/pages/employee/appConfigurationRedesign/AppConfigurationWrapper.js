import React, { createContext, Fragment, useContext, useEffect, useReducer, useRef, useState } from "react";
import AppFieldScreenWrapper from "./AppFieldScreenWrapper";
import { Footer, Button, Divider, Loader, PopUp, SidePanel, Dropdown, LabelFieldPair, TextInput, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import DrawerFieldComposer from "./DrawerFieldComposer";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import AppLocalisationTable from "./AppLocalisationTable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AppPreview from "../../../components/AppPreview";
import { dummyMaster } from "../../../configs/dummyMaster";
import { useCustomT } from "./useCustomT";
import { add } from "lodash";
// import { dummyMaster } from "../../configs/dummyMaster";

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

  return updatedConfig;
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

function AppConfigurationWrapper({ screenConfig, localeModule }) {
  const { locState, addMissingKey, updateLocalization, onSubmit, back, showBack, parentDispatch } = useAppLocalisationContext();
  const [state, dispatch] = useReducer((state, action) => reducer(state, action, updateLocalization), initialState);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const currentLocale = Digit?.SessionStorage.get("locale") || Digit?.SessionStorage.get("initData")?.selectedLanguage;
  const [showPopUp, setShowPopUp] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [addFieldData, setAddFieldData] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const fieldMasterName = searchParams.get("fieldType");
  // const localeModule = searchParams.get("localeModule");
  const module = localeModule ? localeModule : "hcm-dummy-module";
  const [showPreview, setShowPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { mutateAsync: localisationMutate } = Digit.Hooks.campaign.useUpsertLocalisation(tenantId, module, currentLocale);
  const [showToast, setShowToast] = useState(null);
  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [
      { name: fieldMasterName, limit: 100 },
      { name: "DrawerPanelConfigOne", limit: 100 },
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
            DrawerPanelConfig: data?.["HCM-ADMIN-CONSOLE"]?.["DrawerPanelConfigOne"],
            AppFieldType: data?.["HCM-ADMIN-CONSOLE"]?.[fieldMasterName],
            // ...dummyMaster,
          },
        });
      },
    },
    { schemaCode: "BASE_APP_MASTER_DATA" } //mdmsv2
  );
  // const isLoadingAppConfigMdmsData = false;
  // useEffect(() => {
  //   dispatch({
  //     type: "MASTER_DATA",
  //     state: {
  //       screenConfig: screenConfig,
  //       ...dummyMaster?.["HCM-ADMIN-CONSOLE"],
  //       AppFieldType: dummyMaster?.["HCM-ADMIN-CONSOLE"]?.[fieldMasterName],
  //       // ...dummyMaster,
  //     },
  //   });
  // }, [dummyMaster]);

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

  if (isLoadingAppConfigMdmsData) {
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
        .map((item) => ({
          code: item.code,
          message: item[locale] || "",
          module: localeModule ? localeModule : "hcm-dummy-module",
          locale: locale,
        }))
        .filter((item) => item.message !== "");
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
    // const findConfig = (bindTo) => drawerPanelConfig.find((item) => item.bindTo === bindTo);

    for (let i = 0; i < headerFields.length; i++) {
      const fieldItem = headerFields[i];
      const value = locS?.find((i) => i?.code === fieldItem?.value)?.[cL] || null;
      if (!value || value.trim() === "") {
        return { type: "error", value: `HEADER_FIELD_EMPTY_ERROR_${fieldItem?.label}` };
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
          return validation.message || `${label || "Field"} is required for ${a?.label}`;
        }
      }

      // pattern check
      if (validation.pattern && value) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          return validation.message || `${label || "Field"} is invalid`;
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

    return { type: "success" };
  };

  const handleSubmit = async ({ finalSubmit }) => {
    const errorCheck = validateFromState(state?.screenData?.[0]?.cards?.[0], state?.MASTER_DATA?.DrawerPanelConfigOne, locState, currentLocale);
    if (errorCheck) {
      setShowToast({ key: "error", label: errorCheck });
      return;
    }
    const localeArrays = createLocaleArrays();
    for (const locale of Object.keys(localeArrays)) {
      if (localeArrays[locale].length > 0) {
        try {
          setLoading(true);
          const result = await localisationMutate(localeArrays[locale]);
          onSubmit(state, finalSubmit);
        } catch (error) {
          setLoading(false);
          setShowToast({ key: "error", label: "CONFIG_SAVE_FAILED" });
          console.error(`Error sending ${locale} localisation data:`, error);
        }
      }
    }

    setShowPopUp(false);
    setLoading(false);

    console.info("LOCALISATION_UPSERT_SUCCESS");
    // setShowToast({ key: "success", label: "LOCALISATION_SUCCESS" });
  };

  return (
    <AppConfigContext.Provider value={{ state, dispatch, openAddFieldPopup }}>
      {loading && <Loader page={true} variant={"OverlayLoader"} loaderText={t("SAVING_CONFIG_IN_SERVER")} />}
      <div style={{ display: "flex", alignItems: "flex-end", marginRight: "24rem" }}>
        <Button
          className="app-configure-action-button"
          variation="secondary"
          label={t("PREVIOUS")}
          title={t("PREVIOUS")}
          icon="ArrowBack"
          isDisabled={false}
          onClick={() => back()}
        />
        <AppPreview data={state?.screenData?.[0]} selectedField={state?.drawerField} t={useCustomT} />
        {/* <DndProvider backend={HTML5Backend}>
          <AppFieldScreenWrapper onSubmit={onSubmit} />
        </DndProvider> */}
        <Button
          className="app-configure-action-button"
          variation="secondary"
          label={t("NEXT")}
          title={t("NEXT")}
          icon="ArrowForward"
          isSuffix={true}
          isDisabled={false}
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
              <Button
                className="app-configure-drawer-footer-button"
                type={"button"}
                size={"large"}
                variation={"secondary"}
                icon={"Translate"}
                label={t("ADD_LOCALISATION")}
                onClick={() => {
                  setShowPopUp(true);
                }}
              />
              {/* <Button
                className="app-configure-drawer-footer-button"
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("PREVIEW")}
                onClick={() => {
                  setShowPreview(true);
                }}
              /> */}
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
          // addClose={true}
          // onClose={() =>
          // dispatch({
          // type: "UNSELECT_DRAWER_FIELD",
          // })
          // }
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
              {/* <Divider /> */}
              {/* <Button
                type={"button"}
                size={"large"}
                variation={"primary"}
                label={t("ADD_LOCALISATION")}
                onClick={() => {
                  setShowPopUp(true);
                }}
              /> */}
              {/* <Button
                type={"button"}
                size={"large"}
                variation={"secondary"}
                label={t("PREVIEW")}
                onClick={() => {
                  setShowPreview(true);
                }}
              /> */}
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
            <Button type={"button"} size={"large"} variation={"primary"} label={t("SUBMIT")} onClick={handleSubmit} />,
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
            <LabelFieldPair>
              <div className="product-label-field">
                <span>{`${t("ADD_FIELD_LABEL")}`}</span>
                <span className="mandatory-span">*</span>
              </div>
              <TextInput
                // style={{ maxWidth: "40rem" }}
                name="name"
                value={addFieldData?.label ? useCustomT(addFieldData?.label) : ""}
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
              />
            </LabelFieldPair>,
            <LabelFieldPair>
              <div className="product-label-field">
                <span>{`${t("ADD_FIELD_TYPE")}`}</span>
                <span className="mandatory-span">*</span>
              </div>
              <Dropdown
                // style={}
                variant={""}
                t={t}
                option={state?.MASTER_DATA?.AppFieldType}
                optionKey={"type"}
                selected={addFieldData?.type}
                select={(value) => {
                  setAddFieldData((prev) => ({ ...prev, type: value }));
                }}
              />
            </LabelFieldPair>,
          ]}
          onOverlayClick={() => {
            setPopupData(null);
          }}
          onClose={() => {
            setPopupData(null);
          }}
          equalWidthButtons={"false"}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("CLOSE")}
              onClick={() => {
                setPopupData(null);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("SUBMIT")}
              onClick={() => {
                dispatch({
                  type: "ADD_FIELD",
                  payload: {
                    ...popupData,
                    fieldData: addFieldData,
                  },
                });
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
            onClick={() => handleSubmit({ finalSubmit: true })}
            style={{ width: "14rem" }}
            t={t}
          ></Button>,
        ]}
        className={"new-actionbar"}
      />
      {/* <ActionBar className="app-config-actionBar">
        {showBack && <Button className="previous-button" variation="secondary" label={t("BACK")} title={t("BACK")} onClick={() => back()} />}
        <Button className="previous-button" variation="primary" label={t("NEXT")} title={t("NEXT")} onClick={() => onSubmit(state)} />
      </ActionBar> */}
    </AppConfigContext.Provider>
  );
}

export default React.memo(AppConfigurationWrapper);
