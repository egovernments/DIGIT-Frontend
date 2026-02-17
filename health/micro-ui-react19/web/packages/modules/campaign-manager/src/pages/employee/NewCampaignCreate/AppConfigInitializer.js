import { Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { transformMdmsToAppConfig, transformMdmsToFlowConfig } from "./transformMdmsConfig";

const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
const AppConfigInitializer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const version = searchParams.get("version");
  const flow = searchParams.get("flow");
  const tenantId = searchParams.get("tenantId") || Digit?.ULBService?.getCurrentTenantId();
  const viewMode = searchParams.get("viewMode") === "true";

  const schemaCode = `${CONSOLE_MDMS_MODULENAME}.FormConfig`;
  const { isLoading, data: mdmsData } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV2Criteria(
      tenantId,
      schemaCode,
      {
        project: campaignNumber,
        name: flow,
      },
      `MDMSDATA-${schemaCode}-${campaignNumber}-${flow}`,
      {
        enabled: !!(campaignNumber && flow),
        cacheTime: 0,
        staleTime: 0,
      }
    )
  );

  useEffect(() => {
    if (mdmsData && mdmsData.length > 0) {
      const processData = async () => {
        try {
          // First check if TransformedFormConfig data already exists
          const searchResponse = await Digit.CustomService.getResponse({
            url: `/${mdmsContext}/v2/_search`,
            body: {
              MdmsCriteria: {
                tenantId: tenantId,
                schemaCode: "HCM-ADMIN-CONSOLE.TransformedFormConfig",
                filters: {
                  project: campaignNumber,
                  module: flow,
                },
                limit: 1000,
                isActive: true,
              },
            },
            useCache: false,
          });

          // If data already exists, directly navigate
          if (searchResponse?.mdms && searchResponse.mdms.length > 0) {
            navigate(
              `/${window?.contextPath}/employee/campaign/new-app-configuration-redesign?campaignNumber=${campaignNumber}&flow=${flow}&version=${version}${viewMode ? "&viewMode=true" : ""}`
            );
            return;
          }

          // If no data exists, transform and create
          const appConfig = transformMdmsToAppConfig(mdmsData[0]);

          const flowConfig = transformMdmsToFlowConfig(mdmsData[0]);
          // Create MDMS API calls for each config object in parallel
          const apiCalls = appConfig.map((configData) => {
            const payload = {
              tenantId: tenantId,
              schemaCode: "HCM-ADMIN-CONSOLE.TransformedFormConfig",
              data: configData,
              isActive: true,
            };

            return Digit.CustomService.getResponse({
              url: `/${mdmsContext}/v2/_create/HCM-ADMIN-CONSOLE.TransformedFormConfig`,
              body: {
                Mdms: payload,
              },
              useCache: false,
            });
          });

          // Create Flow Config API call
          const flowConfigPayload = {
            tenantId: tenantId,
            schemaCode: "HCM-ADMIN-CONSOLE.AppFlowConfig",
            data: {
              project: campaignNumber,
              name: flow,
              flows: flowConfig,
            },
            isActive: true,
          };

          const flowConfigApiCall = Digit.CustomService.getResponse({
            url: `/${mdmsContext}/v2/_create/HCM-ADMIN-CONSOLE.AppFlowConfig`,
            body: {
              Mdms: flowConfigPayload,
            },
            useCache: false,
          });

          // Execute all API calls in parallel (appConfig + flowConfig)
          const results = await Promise.all([...apiCalls, flowConfigApiCall]);

          // Redirect to new-app-configuration after successful API calls
          navigate(
            `/${window?.contextPath}/employee/campaign/new-app-configuration-redesign?campaignNumber=${campaignNumber}&flow=${flow}&version=${version}${viewMode ? "&viewMode=true" : ""}`
          );
        } catch (error) {
          console.error("Error processing MDMS data:", error);
        }
      };

      processData();
    }
  }, [mdmsData, campaignNumber, flow, navigate, tenantId]);

  return <Loader page={true} variant={"OverlayLoader"} loaderText={t("LOADING_MODULE", { module: flow, campaign: campaignNumber })} />;
};

export default AppConfigInitializer;
