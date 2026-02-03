import React, { useReducer, Fragment, useEffect, useState, act } from "react";
import { CardText, LabelFieldPair, CardLabel, CardSubHeader, Paragraph, Header, Card } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { TextInput, InfoCard, Stepper, TextBlock, Loader, FieldV1 } from "@egovernments/digit-ui-components";
import { deliveryConfig } from "../../configs/deliveryConfig";
import getDeliveryConfig from "../../utils/getDeliveryConfig";
import TagComponent from "../../components/TagComponent";
import { CONSOLE_MDMS_MODULENAME } from "../../Module";
import { convertEpochToNewDateFormat } from "../../utils/convertEpochToNewDateFormat";

const initialState = (saved, filteredDeliveryConfig, refetch) => {
  const data = {
    cycleConfgureDate: {
      cycle:
        saved?.cycleConfgureDate?.cycle && !refetch
          ? saved?.cycleConfgureDate?.cycle
          : filteredDeliveryConfig?.cycleConfig
          ? filteredDeliveryConfig?.cycleConfig?.cycle
          : 1,
      deliveries:
        saved?.cycleConfgureDate?.deliveries && !refetch
          ? saved?.cycleConfgureDate?.deliveries
          : filteredDeliveryConfig?.cycleConfig
          ? filteredDeliveryConfig?.cycleConfig?.deliveries
          : 1,
      isDisable:
        saved?.cycleConfgureDate?.IsDisable && !refetch
          ? saved?.cycleConfgureDate?.IsDisable
          : filteredDeliveryConfig?.cycleConfig
          ? filteredDeliveryConfig?.cycleConfig?.IsDisable
          : false,
    },
    cycleData: saved?.cycleData ? [...saved?.cycleData] : [],
  };
  // onSelect("cycleConfigure", state);
  return data;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "RELOAD":
      return initialState(action.saved, action.filteredDeliveryConfig, action.refetch);
    case "UPDATE_CYCLE":
      return { ...state, cycleConfgureDate: { ...state.cycleConfgureDate, cycle: action.payload } };
    case "UPDATE_DELIVERY":
      return { ...state, cycleConfgureDate: { ...state.cycleConfgureDate, deliveries: action.payload } };
    case "SELECT_TO_DATE":
      return {
        ...state,
        cycleData: updateCycleData(state.cycleData, action.index, { toDate: action.payload }),
        // cycleData: state.cycleData.map((item) => (item.key === action.index ? { ...item, toDate: action.payload } : item)),
      };
    case "SELECT_FROM_DATE":
      return {
        ...state,
        cycleData: updateCycleData(state.cycleData, action.index, { fromDate: action.payload }),
        // cycleData: state.cycleData.map((item) => (item.key === action.index ? { ...item, fromDate: action.payload } : item)),
      };
    default:
      return state;
  }
};

// const updateCycleData = (cycleData, index, update) => {
//   const existingItem = cycleData.find((item) => item.key === index);

//   if (!existingItem) {
//     // If the item with the specified key doesn't exist, add a new item
//     return [...cycleData, { key: index, ...update }];
//   }

//   // If the item exists, update it
//   return cycleData.map((item) => (item.key === index ? { ...item, ...update } : item));
// };

const updateCycleData = (cycleData, index, update) => {
  const existingItem = cycleData.find((item) => item.key === index);

  let updatedData;

  if (!existingItem) {
    // Add new item if not found
    updatedData = [...cycleData, { key: index, ...update }];
  } else {
    // Update existing item
    updatedData = cycleData.map((item) => (item.key === index ? { ...item, ...update } : item));
  }

  // Filter out items that don't have a 'key'
  return updatedData.filter((item) => item.key !== undefined && item.key !== null);
};

function CycleConfiguration({ onSelect, formData, control, ...props }) {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const selectedProjectType =
    window.Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_TYPE?.projectType?.code || searchParams.get("projectType");
  const campaignName = window.Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_NAME?.campaignName;
  const [filteredDeliveryConfig, setFilterDeliveryConfig] = useState(null);
  const { isLoading: deliveryConfigLoading, data } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    {
      staleTime: 0,
      cacheTime: 0,
      enabled: selectedProjectType ? true : false,
    },
    { schemaCode: `${"HCM-PROJECT-TYPES"}.projectTypes` }
  );

  const reqCriteria = {
    url: `/project-factory/v1/project-type/search`,
    body: {
      CampaignDetails: {
        tenantId: tenantId,
        campaignNumber: campaignNumber,
      },
    },
    config: {
      enabled: !!campaignNumber,
      cacheTime: 0,
      staleTime: 0,
      select: (data) => {
        return data?.CampaignDetails?.[0];
      },
    },
  };

  const { data: campaignData, isFetching, isLoading: campaignDataLoading } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  useEffect(() => {
    if (data && selectedProjectType) {
      const deliveryData = getDeliveryConfig({ data: data?.MdmsRes?.["HCM-PROJECT-TYPES"], projectType: selectedProjectType });
      setFilterDeliveryConfig(deliveryData);
    }
  }, [data, selectedProjectType]);

  function convertEpochToDate(epoch) {
    if (!epoch) return "";

    const date = new Date(Number(epoch));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (!filteredDeliveryConfig) {
      setIsLoading(true);
    } else setIsLoading(false);
  }, [filteredDeliveryConfig]);
  // const saved =
  //   Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure ||
  //   campaignData?.additionalDetails?.cycleData || filteredDeliveryConfig?.cycleConfig;
  // const sessionData = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure;
  const sessionData = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_DATA")?.additionalDetails?.cycleData;
  const campaignCycleData = campaignData?.additionalDetails?.cycleData;
  const filteredCycleConfig = filteredDeliveryConfig?.cycleConfig;

  let saved = sessionData?.cycleData?.length > 0 ? sessionData : filteredCycleConfig;
  const refetch = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure?.cycleConfgureDate
    ?.refetch;
  const tempSession = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA");
  const [state, dispatch] = useReducer(reducer, initialState(saved, filteredDeliveryConfig, refetch));
  const { cycleConfgureDate, cycleData } = state;
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState({
    startDate: tempSession?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate || convertEpochToDate(campaignData?.startDate),
    endDate: tempSession?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate || convertEpochToDate(campaignData?.endDate),
  });

  useEffect(() => {
    setDateRange({
      startDate: tempSession?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate || convertEpochToDate(campaignData?.startDate),
      endDate: tempSession?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate || convertEpochToDate(campaignData?.endDate),
    });
  }, [
    campaignData?.startDate,
    campaignData?.endDate,
    tempSession?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate,
    tempSession?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate,
  ]);

  const [executionCount, setExecutionCount] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const currentKey = searchParams.get("key");
  const [key, setKey] = useState(() => {
    const keyParam = searchParams.get("key");
    return keyParam ? parseInt(keyParam) : 1;
  });

  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }

  // useEffect(() => {
  //   if (!deliveryConfigLoading) {
  //     dispatch({
  //       type: "RELOAD",
  //       saved: saved,
  //       filteredDeliveryConfig: filteredDeliveryConfig,
  //       refetch: refetch,
  //     });
  //   }
  // }, [filteredDeliveryConfig, deliveryConfigLoading]);

  useEffect(() => {
    // const sessionData = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA")?.HCM_CAMPAIGN_CYCLE_CONFIGURE?.cycleConfigure;
    const sessionData = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_DATA")?.additionalDetails?.cycleData;
    const campaignCycleData = campaignData?.additionalDetails?.cycleData;
    const filteredCycleConfig = filteredDeliveryConfig?.cycleConfig;

    const finalSaved =
      sessionData?.cycleData?.length > 0 ? sessionData : campaignCycleData?.cycleData?.length > 0 ? campaignCycleData : filteredCycleConfig;

    const currentRefetch = sessionData?.cycleConfgureDate?.refetch;

    if (!deliveryConfigLoading) {
      dispatch({
        type: "RELOAD",
        saved: finalSaved,
        filteredDeliveryConfig: filteredDeliveryConfig,
        refetch: currentRefetch,
      });
    }
  }, [filteredDeliveryConfig, campaignData, deliveryConfigLoading]);

  useEffect(() => {
    const updatedState = {
      ...state,
      deliveryConfig: filteredDeliveryConfig,
    };
    onSelect("cycleConfigure", updatedState);
  }, [state]);

  useEffect(() => {
    if (executionCount < 5) {
      const updatedState = {
        ...state,
        deliveryConfig: filteredDeliveryConfig,
      };
      onSelect("cycleConfigure", updatedState);
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  const updateCycle = (d) => {
    if (d === 0 || d > 5) return;
    if (Number(d?.target?.value) === 0 || Number(d?.target?.value) > 5) return;
    // if (d?.target?.value.trim() === "") return;
    dispatch({ type: "UPDATE_CYCLE", payload: d?.target?.value ? Number(d?.target?.value) : d?.target?.value === "" ? d.target.value : d });
  };

  const updateDelivery = (d) => {
    if (d === 0 || d > 5) return;
    if (Number(d?.target?.value) === 0 || Number(d?.target?.value) > 5) return;
    // if (d?.target?.value.trim() === "") return;
    dispatch({ type: "UPDATE_DELIVERY", payload: d?.target?.value ? Number(d?.target?.value) : d });
  };

  const selectToDate = (index, d) => {
    const localDate = new Date(d);
    localDate.setHours(0, 0, 0, 0); // Local midnight
    // Add 5.5 hours so UTC becomes local midnight
    const adjustedDate = new Date(localDate.getTime() + 19800000);
    const isoString = adjustedDate.toISOString();
    dispatch({ type: "SELECT_TO_DATE", index, payload: isoString });
  };

  const selectFromDate = (index, d) => {
    const localDate = new Date(d);
    localDate.setHours(0, 0, 0, 0); // Local midnight
    // Add 5.5 hours so UTC becomes local midnight
    const adjustedDate = new Date(localDate.getTime() + 19800000);
    const isoString = adjustedDate.toISOString();
    dispatch({ type: "SELECT_FROM_DATE", index, payload: isoString });
  };

  useEffect(() => {
    setKey(currentKey);
    setCurrentStep(currentKey);
  }, [currentKey]);

  useEffect(() => {
    updateUrlParams({ key: key });
    window.dispatchEvent(new Event("checking"));
  }, [key]);

  const onStepClick = (currentStep) => {
    if (currentStep === 0) {
      setKey(7);
    } else if (currentStep === 2) setKey(9);
    else setKey(8);
  };
  if (isLoading || campaignDataLoading || deliveryConfigLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <>
      <div className="container">
        <div className="card-container2">
          <div style={{ marginBottom: "1.5rem" }}>
            <Card>
              <TagComponent campaignName={campaignName} />
              <Header styles={{ marginTop: "1.5rem", color: "#0b4b66" }} className="select-boundary">
                {t(`CAMPAIGN_PROJECT_${selectedProjectType.toUpperCase()}`)}
              </Header>
              <p
                className="dates-description"
                value={`${convertEpochToNewDateFormat(tempSession?.HCM_CAMPAIGN_DATE?.campaignDates?.startDate)} - ${convertEpochToNewDateFormat(
                  tempSession?.HCM_CAMPAIGN_DATE?.campaignDates?.endDate
                )}`}
              />
              {/* <Card className="campaign-counter-container"> */}
              <CardText>{t(`CAMPAIGN_CYCLE_CONFIGURE_HEADING_${selectedProjectType.toUpperCase()}`)}</CardText>
              <LabelFieldPair style={{ marginBottom: "1.5rem" }}>
                <CardLabel className="cycleBold" style={{ fontWeight: "700" }}>
                  {t(`CAMPAIGN_NO_OF_CYCLE`)}
                  <span className="mandatory-span">*</span>
                </CardLabel>
                <TextInput type="numeric" value={cycleConfgureDate?.cycle} onChange={(d) => updateCycle(d)} disabled={cycleConfgureDate?.isDisable} />
              </LabelFieldPair>
              <LabelFieldPair>
                <CardLabel className="cycleBold" style={{ fontWeight: "700" }}>
                  {t(`CAMPAIGN_NO_OF_DELIVERY`)}
                  <span className="mandatory-span">*</span>
                </CardLabel>
                <TextInput
                  type="numeric"
                  value={cycleConfgureDate?.deliveries}
                  onChange={(d) => updateDelivery(d)}
                  disabled={cycleConfgureDate?.isDisable}
                />
              </LabelFieldPair>
            </Card>
          </div>
          <Card className="campaign-counter-container">
            <CardSubHeader className={"start-header"} style={{ marginBottom: "1.5rem" }}>
              {t(`CAMPAIGN_ADD_START_END_DATE_TEXT`)}
            </CardSubHeader>
            {[...Array(cycleConfgureDate.cycle)].map((_, index) => (
              <LabelFieldPair key={index}>
                <CardLabel>
                  {t(`CAMPAIGN_CYCLE`)} {index + 1}
                  <span className="mandatory-span">*</span>
                </CardLabel>
                <div className="date-field-container">
                  <FieldV1
                    type="date"
                    placeholder={t("FROM_DATE")}
                    // value={cycleData?.find((j) => j.key === index + 1)?.fromDate}
                    value={
                      cycleData?.find((j) => j.key === index + 1)?.fromDate
                        ? new Date(cycleData.find((j) => j.key === index + 1)?.fromDate).toISOString().split("T")[0]
                        : ""
                    }
                    withoutLabel={true}
                    min={
                      index > 0 && cycleData?.find((j) => j.key === index)?.toDate
                        ? new Date(new Date(cycleData?.find((j) => j.key === index)?.toDate)?.getTime() + 86400000)?.toISOString()?.split("T")?.[0]
                        : dateRange?.startDate
                    }
                    max={dateRange?.endDate}
                    populators={{
                      newDateFormat: true,
                      max: dateRange?.endDate,
                      min:
                        index > 0 && cycleData?.find((j) => j.key === index)?.toDate
                          ? new Date(new Date(cycleData.find((j) => j.key === index)?.toDate).getTime() + 86400000).toISOString().split("T")[0]
                          : dateRange?.startDate,
                    }}
                    onChange={(d) => selectFromDate(index + 1, d)}
                  />
                  <FieldV1
                    type="date"
                    placeholder={t("TO_DATE")}
                    // value={cycleData?.find((j) => j.key === index + 1)?.toDate}
                    value={
                      cycleData?.find((j) => j.key === index + 1)?.toDate
                        ? new Date(cycleData.find((j) => j.key === index + 1)?.toDate).toISOString().split("T")[0]
                        : ""
                    }
                    withoutLabel={true}
                    min={
                      cycleData?.find((j) => j.key === index + 1)?.fromDate
                        ? new Date(new Date(cycleData?.find((j) => j.key === index + 1)?.fromDate)?.getTime() + 86400000)
                            ?.toISOString()
                            ?.split("T")?.[0]
                        : null
                    }
                    populators={{
                      newDateFormat: true,
                      max: dateRange?.endDate,
                      min: cycleData?.find((j) => j.key === index + 1)?.fromDate
                        ? new Date(new Date(cycleData?.find((j) => j.key === index + 1)?.fromDate)?.getTime() + 86400000)
                            ?.toISOString()
                            ?.split("T")?.[0]
                        : null,
                    }}
                    max={dateRange?.endDate}
                    onChange={(d) => selectToDate(index + 1, d)}
                  />
                </div>
              </LabelFieldPair>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

export default CycleConfiguration;
