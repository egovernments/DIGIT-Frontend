import React, { createContext, useContext, useReducer, useState } from "react";
import AppFieldScreenWrapper from "./AppFieldScreenWrapper";
import { Loader } from "@egovernments/digit-ui-components";
import SidePanel from "./SidePanel";
import { useTranslation } from "react-i18next";
import DrawerFieldComposer from "./DrawerFieldComposer";
import SidePanel from "./SidePanel";
import { useAppLocalisationContext } from "./AppLocalisationWrapper";
import AppLocalisationTable from "./AppLocalisationTable";
// import { dummyMaster } from "../../configs/dummyMaster";

const AppConfigContext = createContext();

const initialState = {};

export const useAppConfigContext = () => {
  return useContext(AppConfigContext);
};

const reducer = (state = initialState, action, updateLocalization) => {
  switch (action.type) {
    case "MASTER_DATA":
      return {
        ...state,
        MASTER_DATA: { ...action.state },
        screenData: action.state?.AppScreenConfigTemplateSchema,
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
                      if (k.id === state.drawerField.id) {
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
    default:
      return state;
  }
};

const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";

function AppConfigurationWrapper() {
  const { locState, addMissingKey, updateLocalization, onSubmit } = useAppLocalisationContext();
  const [state, dispatch] = useReducer((state, action) => reducer(state, action, updateLocalization), initialState);
  const { t } = useTranslation();
  const [showPopUp, setShowPopUp] = useState(false);
  const { isLoading: isLoadingAppConfigMdmsData, data: AppConfigMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    MODULE_CONSTANTS,
    [{ name: "AppScreenConfigTemplateSchema" }, { name: "AppFieldType" }, { name: "DrawerPanelConfig" }, { name: "AppScreenLocalisationConfig" }],
    {
      cacheTime: Infinity,
      staleTime: Infinity,
      select: (data) => {
        dispatch({
          type: "MASTER_DATA",
          state: {
            ...data?.["HCM-ADMIN-CONSOLE"],
            // ...dummyMaster,
          },
        });
      },
    },
    { schemaCode: "BASE_APP_MASTER_DATA" } //mdmsv2
  );

  if (isLoadingAppConfigMdmsData) {
    return <Loader page={true} variant={"PageLoader"}/>;
  }

  return (
    <AppConfigContext.Provider value={{ state, dispatch }}>
      <AppFieldScreenWrapper onSubmit={onSubmit} />
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
              Header
            </div>,
          ]}
          hideScrollIcon
          isDraggable={false}
          position="right"
          sections={[]}
          styles={{}}
          type="static"
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
        </SidePanel>
      )}
      {showPopUp && (
        <PopUp
          type={"default"}
          heading={t("ADD_LOCALISATION")}
          children={[
            <div>
              HELLO
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
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("SUBMIT")}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
          ]}
        >
          <AppLocalisationTable />
        </PopUp>
      )}
    </AppConfigContext.Provider>
  );
}

export default AppConfigurationWrapper;
