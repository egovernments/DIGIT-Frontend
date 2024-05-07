import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { timeLineOptions } from "../../configs/timeLineOptions.json";
import Upload from "./Upload";
import Hypothesis from "./Hypothesis";
import RuleEngine from "./RuleEngine";
import Mapping from "./Mapping";
import Navigator from "../../components/Nagivator";
import { Toast } from "@egovernments/digit-ui-components";
import MicroplanPreview from "./MicroplanPreview";
import MicroplanDetails from "../../components/MicroplanDetails";
import { Request } from "@egovernments/digit-ui-libraries";
import { parseXlsxToJsonMultipleSheets } from "../../utils/exceltojson";

export const components = {
  MicroplanDetails,
  Upload,
  Hypothesis,
  RuleEngine,
  Mapping,
  MicroplanPreview,
};

import XLSX from "xlsx";
import MicroplanCreatedScreen from "../../components/MicroplanCreatedScreen";
import { LoaderWithGap, Tutorial } from "@egovernments/digit-ui-react-components";
import { mapDataForApi } from "../../components/CommonComponents";

// will be changed laters
const MicroplanName = "microplan 1912";
const campaignType = "ITIN";

// Main component for creating a microplan
const CreateMicroplan = () => {
  // Fetching data using custom MDMS hook
  const { id: campaignId = "" } = Digit.Hooks.useQueryParams();
  const { isLoading, data } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [{ name: "UIConfiguration" }]);
  const { mutate: CreateMutate } = Digit.Hooks.microplan.useCreatePlanConfig();
  const { mutate: UpdateMutate } = Digit.Hooks.microplan.useUpdatePlanConfig();
  const [ toRender, setToRender] = useState("navigator")
  const { t } = useTranslation();

  // States
  const [microplanData, setMicroplanData] = useState();
  const [operatorsObject, setOperatorsObject] = useState([]);
  const [toastCreateMicroplan, setToastCreateMicroplan] = useState();
  const [checkForCompleteness, setCheckForCompletion] = useState([]);
  const [loaderActivation, setLoderActivation] = useState(false);

  // useEffect to initialise the data from MDMS
  useEffect(() => {
    let temp;
    if (!data || !data["hcm-microplanning"]) return;
    let UIConfiguration = data["hcm-microplanning"]["UIConfiguration"];
    if (UIConfiguration) temp = UIConfiguration.find((item) => item.name === "ruleConfigure");
    if (!(temp && temp.ruleConfigureOperators)) return;
    setOperatorsObject(temp.ruleConfigureOperators);
  }, [data]);

  // useEffect to store data in session storage
  useEffect(() => {
    if (!microplanData) return;
    Digit.SessionStorage.set("microplanData", microplanData);
  }, [microplanData]);

  // useEffect to store data in session storage
  useEffect(() => {
    const data = Digit.SessionStorage.get("microplanData");
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
      if (!microplanData?.microplanDetails?.name) {
        setCheckDataCompletion("perform-action");
        return;
      }
      setMicroplanData((previous) => ({
        ...previous,
        status: { ...previous?.status, [currentPage?.name]: checkDataCompletion === "valid" ? true : false },
      }));
      if (currentPage?.name !== "FORMULA_CONFIGURATION") {
        setCheckDataCompletion("perform-action");
        return;
      }
      let checkStatusValues = _.cloneDeep(microplanData?.status) || {};
      if (Object.keys(checkStatusValues).length == 0) {
        setCheckDataCompletion("perform-action");
        return;
      }
      checkStatusValues[currentPage?.name] = checkDataCompletion === "valid" ? true : false;
      let check = true;
      for (let data of checkForCompleteness) {
        if(data === "mapping") break;
        check = check && checkStatusValues?.[data];
      }
      if (!check) {
        setCheckDataCompletion("perform-action");
        return;
      }
      setCheckDataCompletion("false");
      setLoderActivation(true);
      let body = mapDataForApi(microplanData, operatorsObject, microplanData?.microplanDetails?.name, campaignId, "DRAFT");
      if (microplanData && !microplanData.planConfigurationId) {
        await createPlanConfiguration(body, setCheckDataCompletion, setLoderActivation);
      } else if (microplanData && microplanData.planConfigurationId) {
        await updatePlanConfiguration(body, setCheckDataCompletion, setLoderActivation);
      }
    },
    [microplanData, UpdateMutate, CreateMutate]
  );

  const createPlanConfiguration = async (body, setCheckDataCompletion, setLoderActivation) => {
    await CreateMutate(body, {
      onSuccess: async (data) => {
        setMicroplanData((previous) => ({
          ...previous,
          planConfigurationId: data?.PlanConfiguration[0]?.id,
          auditDetails: data?.PlanConfiguration[0]?.auditDetails,
        }));
        setToastCreateMicroplan({ state: "success", message: t("SUCCESS_DATA_SAVED") });
        setTimeout(() => {
          setToastCreateMicroplan(undefined);
          setLoderActivation(false);
          setCheckDataCompletion("perform-action");
        }, 2000);
      },
      onError: (error, variables) => {
        setToastCreateMicroplan({
          message: t("ERROR_DATA_NOT_SAVED"),
          state: "error",
        });
        setTimeout(() => {
          setToastCreateMicroplan(undefined);
          setCheckDataCompletion("perform-action");
        }, 2000);
      },
    });
  };

  const updatePlanConfiguration = async (body, setCheckDataCompletion, setLoderActivation) => {
    body.PlanConfiguration["id"] = microplanData?.planConfigurationId;
    body.PlanConfiguration["auditDetails"] = microplanData?.auditDetails;
    await UpdateMutate(body, {
      onSuccess: async (data) => {
        setToastCreateMicroplan({ state: "success", message: t("SUCCESS_DATA_SAVED") });
        setTimeout(() => {
          setToastCreateMicroplan(undefined);
          setLoderActivation(false);
          setCheckDataCompletion("perform-action");
        }, 2000);
      },
      onError: (error, variables) => {
        setToastCreateMicroplan({
          message: t("ERROR_DATA_NOT_SAVED"),
          state: "error",
        });
        setTimeout(() => {
          setToastCreateMicroplan(undefined);
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

  const completeNavigation = () => {
    setToRender("success-screen");
  };
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

        {toastCreateMicroplan && toastCreateMicroplan.state === "success" && (
          <Toast style={{ bottom: "5.5rem", zIndex:"999991" }} label={toastCreateMicroplan.message} onClose={() => setToastCreateMicroplan(undefined)} />
        )}
        {toastCreateMicroplan && toastCreateMicroplan.state === "error" && (
          <Toast style={{ bottom: "5.5rem", zIndex:"999991" }} label={toastCreateMicroplan.message} onClose={() => setToastCreateMicroplan(undefined)} error />
        )}
      </div>
      {loaderActivation && <LoaderWithGap text={"LOADING"} />}
    </>
  );
};

export default CreateMicroplan;
