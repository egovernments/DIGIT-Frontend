import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import AppFieldScreenWrapper from "./AppFieldScreenWrapper";
import { Footer, Button, Divider, Loader, PopUp, SidePanel } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import DrawerFieldComposer from "./DrawerFieldComposer";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import AppLocalisationTable from "./AppLocalisationTable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import AppPreview from "../../../components/AppPreview";
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
        screenData1: action.state?.AppScreenConfigTemplateSchema,
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
    case "ADD_FIELD":
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
                    fields: [
                      ...j.fields,
                      {
                        id: crypto.randomUUID(),
                        type: "text",
                        label: "LABEL",
                        active: true,
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
                    fields: j.fields?.filter((k) => k.id !== action.payload.currentField.id),
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
      updateLocalization(action?.payload?.localisedCode, Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN", action?.payload?.value);
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

function AppConfigurationWrapper({ screenConfig }) {
  const { locState, addMissingKey, updateLocalization, onSubmit, back, showBack, parentDispatch } = useAppLocalisationContext();
  const [state, dispatch] = useReducer((state, action) => reducer(state, action, updateLocalization), initialState);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const [showPopUp, setShowPopUp] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const fieldMasterName = searchParams.get("fieldType");
  const module = "dummy-localisation";
  const [showPreview, setShowPreview] = useState(null);
  const { mutateAsync: localisationMutate } = Digit.Hooks.campaign.useUpsertLocalisation(tenantId, module, "en_IN");
  const [showToast, setShowToast] = useState(null);
  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [{ name: "AppScreenConfigTemplateSchema" }, { name: fieldMasterName }, { name: "DrawerPanelConfig" }, { name: "AppScreenLocalisationConfig" }],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        dispatch({
          type: "MASTER_DATA",
          state: {
            screenConfig: screenConfig,
            ...data?.["HCM-ADMIN-CONSOLE"],
            AppFieldType: data?.["HCM-ADMIN-CONSOLE"]?.[fieldMasterName],
            // ...dummyMaster,
          },
        });
      },
    },
    { schemaCode: "BASE_APP_MASTER_DATA" } //mdmsv2
  );

  useEffect(() => {
    dispatch({
      type: "SET_SCREEN_DATA",
      state: {
        screenConfig: screenConfig,
      },
    });
  }, [screenConfig]);

  if (isLoadingAppConfigMdmsData) {
    return <Loader />;
  }
  const closeToast = () => {
    setShowToast(null);
  };

  function createLocaleArrays() {
    const result = {};

    // Dynamically determine locales
    const locales = Object.keys(locState[0]).filter((key) => key.includes("_IN") && key !== "en_IN");
    locales.unshift("en_IN");
    locales.forEach((locale) => {
      result[locale] = locState
        .map((item) => ({
          code: item.code,
          message: item[locale] || "",
          module: item.module || "hcm-dummy-module",
          locale: locale,
        }))
        .filter((item) => item.message !== "");
    });

    return result;
  }

  const handleSubmit = async () => {
    const localeArrays = createLocaleArrays();
    for (const locale of Object.keys(localeArrays)) {
      if (localeArrays[locale].length > 0) {
        try {
          const result = await localisationMutate(localeArrays[locale]);
        } catch (error) {
          console.error(`Error sending ${locale} localisation data:`, error);
        }
      }
    }

    setShowPopUp(false);
    setShowToast({ key: "success", label: "LOCALISATION_SUCCESS" });
  };
  return (
    <AppConfigContext.Provider value={{ state, dispatch }}>
      <DndProvider backend={HTML5Backend}>
        <AppFieldScreenWrapper onSubmit={onSubmit} />
      </DndProvider>
      {state?.drawerField && (
        <SidePanel
          bgActive
          className=""
          closedContents={[]}
          closedFooter={[<en />]}
          closedHeader={[]}
          closedSections={[]}
          defaultClosedWidth=""
          defaultOpenWidth=""
          footer={[]}
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
          addClose={true}
          onClose={() =>
            dispatch({
              type: "UNSELECT_DRAWER_FIELD",
            })
          }
        >
          <DrawerFieldComposer />
          <Divider />
          <Button
            type={"button"}
            size={"large"}
            variation={"primary"}
            label={t("ADD_LOCALISATION")}
            onClick={() => {
              setShowPopUp(true);
            }}
          />
          <Button
            type={"button"}
            size={"large"}
            variation={"secondary"}
            label={t("PREVIEW")}
            onClick={() => {
              setShowPreview(true);
            }}
          />
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
          <AppPreview data={state?.screenData?.[0]} />
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
              variation={"primary"}
              label={t("CLOSE")}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
            <Button type={"button"} size={"large"} variation={"primary"} label={t("SUBMIT")} onClick={handleSubmit} />,
          ]}
        >
          <AppLocalisationTable />
        </PopUp>
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
          <Button className="previous-button" variation="secondary" label={t("BACK")} title={t("BACK")} onClick={() => back()} />,
          <Button className="previous-button" variation="primary" label={t("NEXT")} title={t("NEXT")} onClick={() => onSubmit(state)} />,
        ]}
        className=""
        maxActionFieldsAllowed={5}
        setactionFieldsToRight
        sortActionFields
        style={{}}
      />
      {/* <ActionBar className="app-config-actionBar">
        {showBack && <Button className="previous-button" variation="secondary" label={t("BACK")} title={t("BACK")} onClick={() => back()} />}
        <Button className="previous-button" variation="primary" label={t("NEXT")} title={t("NEXT")} onClick={() => onSubmit(state)} />
      </ActionBar> */}
    </AppConfigContext.Provider>
  );
}

export default React.memo(AppConfigurationWrapper);
