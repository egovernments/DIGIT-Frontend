import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { timeLineOptions } from "../../configs/timeLineOptions.json";
import Upload from "../../components/Upload";
import Hypothesis from "../../components/Hypothesis";
import RuleEngine from "../../components/RuleEngine";
import Mapping from "../../components/Mapping";
import Navigator from "../../components/Nagivator";
import { Toast } from "@egovernments/digit-ui-components";
import MicroplanPreview from "../../components/MicroplanPreview";
import MicroplanDetails from "../../components/MicroplanDetails";

export const components = {
  MicroplanDetails,
  Upload,
  Hypothesis,
  RuleEngine,
  Mapping,
  MicroplanPreview,
};

import MicroplanCreatedScreen from "../../components/MicroplanCreatedScreen";
import { LoaderWithGap, Tutorial } from "@egovernments/digit-ui-react-components";
import { useMyContext } from "../../utils/context";
import { updateSessionUtils } from "../../utils/updateSessionUtils";
import { render } from "react-dom";

// will be changed laters
const campaignType = "ITIN";

// Main component for creating a microplan
const CreateMicroplan = () => {

  // Fetching data using custom MDMS hook
  const { id: campaignId = "" } = Digit.Hooks.useQueryParams();
  const { mutate: CreateMutate } = Digit.Hooks.microplan.useCreatePlanConfig();
  const { mutate: UpdateMutate } = Digit.Hooks.microplan.useUpdatePlanConfig();
  const [toRender, setToRender] = useState("navigator");
  const { t } = useTranslation();

  // States
  const [microplanData, setMicroplanData] = useState();
  const [operatorsObject, setOperatorsObject] = useState([]);
  const [toastCreateMicroplan, setToastCreateMicroplan] = useState();
  const [checkForCompleteness, setCheckForCompletion] = useState([]);
  const [loaderActivation, setLoaderActivation] = useState(false);
  const { state } = useMyContext();

  //fetch campaign data
  const { id = "" } = Digit.Hooks.useQueryParams();
  const { isLoading: isCampaignLoading, data: campaignData } = Digit.Hooks.microplan.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        ids: [id],
      },
    },
    {
      enabled: !!id,
    }
  );

  // request body for boundary hierarchy api
  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    params: {},
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: Digit.ULBService.getStateId(),
        hierarchyType: campaignData?.hierarchyType,
      },
    },
    config: {
      enabled: !!campaignData?.hierarchyType,
      select: (data) => {
        return data?.BoundaryHierarchy?.[0]?.boundaryHierarchy?.map((item) => item?.boundaryType) || {};
      },
    },
  };
  const { isLoading: ishierarchyLoading, data: heirarchyData } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // useEffect to initialise the data from MDMS
  useEffect(() => {
    let temp;
    if (!state || !state.UIConfiguration) return;
    let UIConfiguration = state.UIConfiguration;
    if (UIConfiguration) temp = UIConfiguration.find((item) => item.name === "ruleConfigure");
    if (!(temp && temp.ruleConfigureOperators)) return;
    setOperatorsObject(temp.ruleConfigureOperators);
  }, []);

  // useEffect to store data in session storage
  useEffect(() => {
    if (!microplanData) return;
    Digit.SessionStorage.set("microplanData", microplanData);
  }, [microplanData]);

  // useEffect to store data in session storage
  useEffect(() => {
    const data = Digit.SessionStorage.get("microplanData");
    if (data?.microplanStatus === "GENERATED") setToRender("success-screen");
    let statusData = {};
    let toCheckCompletenesData = [];
    timeLineOptions.forEach((item) => {
      statusData[item.name] = false;
      if (item?.checkForCompleteness) toCheckCompletenesData.push(item.name);
    });
    if (data && data?.status) {
      if (Object.keys(data?.status) === 0) setMicroplanData({ ...data, status: statusData });
      else setMicroplanData({ ...data });
    }
    setCheckForCompletion(toCheckCompletenesData);
  }, []);

  // An addon function to pass to Navigator
  const nextEventAddon = useCallback(
    async (currentPage, checkDataCompletion, setCheckDataCompletion) => {
      if (!microplanData) {
        setCheckDataCompletion("perform-action");
        return;
      }
      setMicroplanData((previous) => ({
        ...previous,
        status: { ...previous?.status, [currentPage?.name]: checkDataCompletion === "valid"},
      }));
      // if (currentPage?.name !== "FORMULA_CONFIGURATION") {
      //   setCheckDataCompletion("perform-action");
      //   return;
      // }
      
      // let checkStatusValues = _.cloneDeep(microplanData?.status) || {};
      // if (Object.keys(checkStatusValues).length == 0) {
      //   setCheckDataCompletion("perform-action");
      //   return;
      // }
      // checkStatusValues[currentPage?.name] = checkDataCompletion === "valid" ? true : false;
      // let check = true;
      // for (let data of checkForCompleteness) {
      //   check = check && checkStatusValues && checkStatusValues[data];
      //   // if (data === currentPage?.name) break;
      // }
      // if (!check) {
      //   setToastCreateMicroplan({
      //     message: t("ERROR_DATA_NOT_SAVED"),
      //     state: "error",
      //   });
      //   setLoaderActivation(true);
      //   setLoaderActivation(false);
      //   // setToastCreateMicroplan(undefined);
      //   setCheckDataCompletion("perform-action");
      //   return;
      // }
      setCheckDataCompletion("false");
      let body = Digit.Utils.microplan.mapDataForApi(microplanData, operatorsObject, microplanData?.microplanDetails?.name, campaignId, "DRAFT",microplanData?.planConfigurationId?"update":"create");
      if(!Digit.Utils.microplan.planConfigRequestBodyValidator(body, state, campaignType)){
        setCheckDataCompletion("perform-action");
        return
      }
      setLoaderActivation(true);
      if (!microplanData?.planConfigurationId) {
        await createPlanConfiguration(body, setCheckDataCompletion, setLoaderActivation);
      } else if (microplanData && microplanData.planConfigurationId) {
        await updatePlanConfiguration(body, setCheckDataCompletion, setLoaderActivation);
      }
    },
    [microplanData, UpdateMutate, CreateMutate]
  );

  const createPlanConfiguration = async (body, setCheckDataCompletion, setLoaderActivation) => {
    await CreateMutate(body, {
      onSuccess: async (data) => {
        // setMicroplanData((previous) => ({
        //   ...previous,
        //   planConfigurationId: data?.PlanConfiguration[0]?.id,
        //   auditDetails: data?.PlanConfiguration[0]?.auditDetails,
        // }));
        const additionalProps = {
          heirarchyData: heirarchyData,
          t,
          campaignType,
        };
        const computedSession = await updateSessionUtils.computeSessionObject(data?.PlanConfiguration[0], state, additionalProps);
        if (computedSession) {
          computedSession.microplanStatus = "DRAFT";
          setMicroplanData(computedSession);
        } else {
          console.error("Failed to compute session data.");
        }
        setToastCreateMicroplan({ state: "success", message: t("SUCCESS_DATA_SAVED") });
        setTimeout(() => {
          // setToastCreateMicroplan(undefined);
          setLoaderActivation(false);
          setCheckDataCompletion("perform-action");
        }, 500);
      },
      onError: (error, variables) => {
        setToastCreateMicroplan({
          message: t("ERROR_DATA_NOT_SAVED"),
          state: "error",
        });
        setTimeout(() => {
          setLoaderActivation(false);
          // setToastCreateMicroplan(undefined);
          setCheckDataCompletion("false");
        }, 2000);
      },
    });
  };

  const updatePlanConfiguration = async (body, setCheckDataCompletion, setLoaderActivation) => {
    body.PlanConfiguration["id"] = microplanData?.planConfigurationId;
    body.PlanConfiguration["auditDetails"] = microplanData?.auditDetails;
    await UpdateMutate(body, {
      onSuccess: async (data) => {
        const additionalProps = {
          heirarchyData: heirarchyData,
          t,
          campaignType,
        };
        const computedSession = await updateSessionUtils.computeSessionObject(data?.PlanConfiguration[0], state, additionalProps);
        if (computedSession) {
          computedSession.microplanStatus = "DRAFT";
          setMicroplanData(computedSession);
        } else {
          console.error("Failed to compute session data.");
        }
        setToastCreateMicroplan({ state: "success", message: t("SUCCESS_DATA_SAVED") });
        setTimeout(() => {
          // setToastCreateMicroplan(undefined);
          setLoaderActivation(false);
          setCheckDataCompletion("perform-action");
        }, 500);
      },
      onError: (error, variables) => {
        setToastCreateMicroplan({
          message: t("ERROR_DATA_NOT_SAVED"),
          state: "error",
        });
        setTimeout(() => {
          // setToastCreateMicroplan(undefined);
          setLoaderActivation(false);
          setCheckDataCompletion("false");
        }, 2000);
      },
    });
  };

  const setCurrentPageExternally = useCallback(
    (props) => {
      switch (props.method) {
        case "set":
          let currentPage;
          const data = Digit.SessionStorage.get("microplanData");
          if (data && data?.currentPage) currentPage = data.currentPage;
          if (currentPage && props && props?.setCurrentPage && timeLineOptions.find((item) => item.id === currentPage?.id)) {
            props.setCurrentPage(currentPage);
            return true;
          }
          break;
        case "save":
          if (props && props.currentPage) {
            setMicroplanData((previous) => ({ ...previous, currentPage: props.currentPage }));
          }
          break;
      }
    },
    [microplanData, setMicroplanData, Navigator]
  );

  const completeNavigation = useCallback(() => {
    setToRender("success-screen");
  },[setToRender]);

  return (
    <>
      <div className="create-microplan">
        {toRender === "navigator" && (
          <Navigator
            config={timeLineOptions}
            checkDataCompleteness={true}
            stepNavigationActive={true}
            components={components}
            childProps={{ microplanData, setMicroplanData, campaignType, MicroplanName: microplanData?.microplanDetails?.name }}
            nextEventAddon={nextEventAddon}
            setCurrentPageExternally={setCurrentPageExternally}
            completeNavigation={completeNavigation}
          />
        )}
        {toRender === "success-screen" && <MicroplanCreatedScreen microplanData={microplanData} />}
      </div>
      {toastCreateMicroplan && toastCreateMicroplan.state === "success" && (
          <Toast style={{ zIndex: "999991" }} label={toastCreateMicroplan.message} onClose={() => setToastCreateMicroplan(undefined)} />
        )}
        {toastCreateMicroplan && toastCreateMicroplan.state === "error" && (
          <Toast style={{ zIndex: "999991" }} label={toastCreateMicroplan.message} onClose={() => setToastCreateMicroplan(undefined)} type="error" />
        )}
      {loaderActivation && <LoaderWithGap text={"LOADING"} />}
    </>
  );
};

export default CreateMicroplan;
