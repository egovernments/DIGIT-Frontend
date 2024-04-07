import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { timeLineOptions } from "../../configs/timeLineOptions.json";
import Upload from "./Upload";
import Hypothesis from "./Hypothesis";
import RuleEngine from "./RuleEngine";
import Navigator from "../../components/Nagivator";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "@egovernments/digit-ui-components";

export const components = {
  Upload,
  Hypothesis,
  RuleEngine,
};

// will be changed laters
const MicroplanName = "microplan 1912";
const campaignType = "ITIN";

// Main component for creating a microplan
const CreateMicroplan = () => {
  // Fetching data using custom MDMS hook
  const { isLoading, data } = Digit.Hooks.useCustomMDMS("mz", "hcm-microplanning", [{ name: "UIConfiguration" }]);
  const { mutate: CreateMutate } = Digit.Hooks.microplan.useCreatePlanConfig();
  const { mutate: UpdateMutate } = Digit.Hooks.microplan.useUpdatePlanConfig();
  const { t } = useTranslation();

  // States
  const [microplanData, setMicroplanData] = useState();
  const [operatorsObject, setOperatorsObject] = useState([]);
  const [toastCreateMicroplan, setToastCreateMicroplan] = useState();

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
    setMicroplanData(data);
  }, []);

  // An addon function to pass to Navigator
  const nextEventAddon = useCallback(
    async (currentPage) => {
      if (!microplanData || currentPage?.name !== "FORMULA_CONFIGURATION") return;
      let body = mapDataForApi(microplanData, operatorsObject);

      if (microplanData && !microplanData.planConfigurationId) {
        await CreateMutate(body, {
          onSuccess: async (data) => {
            setMicroplanData((previous) => ({ ...previous, planConfigurationId: data?.PlanConfiguration?.id }));
            setToastCreateMicroplan({ state: "success", message: t("SUCCESS_DATA_SAVED") });
            setTimeout(() => {
              setToastCreateMicroplan(undefined);
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
      } else if (microplanData && microplanData.planConfigurationId) {
        body = body.PlanConfiguration["id"] = microplanData?.planConfigurationId;
        await UpdateMutate(body, {
          onSuccess: async (data) => {
            setMicroplanData((previous) => ({ ...previous, planConfigurationId: data?.PlanConfiguration?.id }));
            setToastCreateMicroplan({ state: "success", message: t("SUCCESS_DATA_SAVED") });
            setTimeout(() => {
              setToastCreateMicroplan(undefined);
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
      }
    },
    [microplanData, UpdateMutate, CreateMutate]
  );

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

  return (
    <div className="create-microplan">
      <Navigator
        config={timeLineOptions}
        checkDataCompleteness={true}
        stepNavigationActive={true}
        components={components}
        childProps={{ microplanData, setMicroplanData, campaignType }}
        nextEventAddon={nextEventAddon}
        setCurrentPageExternally={setCurrentPageExternally}
      />

      {toastCreateMicroplan && toastCreateMicroplan.state === "success" && (
        <Toast style={{ bottom: "5.5rem" }} label={toastCreateMicroplan.message} onClose={() => setToastCreateMicroplan(undefined)} />
      )}
      {toastCreateMicroplan && toastCreateMicroplan.state === "error" && (
        <Toast style={{ bottom: "5.5rem" }} label={toastCreateMicroplan.message} onClose={() => setToastCreateMicroplan(undefined)} error />
      )}
    </div>
  );
};

const mapDataForApi = (data, Operators) => {
  // Generate UUID
  const uuid = uuidv4();
  // return a Create API body
  return {
    PlanConfiguration: {
      tenantId: Digit.ULBService.getStateId(),
      name: MicroplanName,
      executionPlanId: uuid,
      files: Object.values(data?.upload).map((item) => ({
        filestoreId: item.filestoreId,
        inputFileType: item.fileType,
        templateIdentifier: item.section,
      })),
      assumptions: data?.hypothesis?.map((item) => {
        delete item.id;
        return item;
      }),
      operations: data?.ruleEngine?.map((item) => {
        const data = { ...item };
        delete data.id;
        const operator = Operators.find((e) => e.name === data.operator);
        if (operator && operator.code) data.operator = operator?.code;
        return data;
      }),
      resourceMapping: Object.values(data?.upload)
        .map((item) => item.resourceMapping)
        .flatMap((inner) => inner),
    },
  };
};

export default CreateMicroplan;
