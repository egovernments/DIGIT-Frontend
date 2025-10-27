import { Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { transformMdmsToAppConfig, transformMdmsToFlowConfig } from "./transformMdmsConfig";

const DummyLoader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const flow = searchParams.get("flow");
  const tenantId = searchParams.get("tenantId") || Digit?.ULBService?.getCurrentTenantId();

  const schemaCode = `${CONSOLE_MDMS_MODULENAME}.NewApkConfig`;
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
      console.log("MDMS Data loaded:", mdmsData);

      const processData = async () => {
        try {
          // First check if NewFormConfig data already exists
          const searchResponse = await Digit.CustomService.getResponse({
            url: "/mdms-v2/v2/_search",
            body: {
              MdmsCriteria: {
                tenantId: tenantId,
                schemaCode: "HCM-ADMIN-CONSOLE.NewFormConfig",
                filters: {
                  project: campaignNumber,
                },
                isActive: true,
              },
            },
            useCache: false,
          });

          // If data already exists, directly navigate
          if (searchResponse?.mdms && searchResponse.mdms.length > 0) {
            console.log("NewFormConfig data already exists, navigating directly");
            navigate(
              `/${window?.contextPath}/employee/campaign/new-app-configuration-redesign?campaignNumber=${campaignNumber}&flow=${flow}`
            );
            return;
          }

          // If no data exists, transform and create
          const appConfig = transformMdmsToAppConfig(mdmsData[0]);
          console.log("Transformed App Config:", appConfig);

          const flowConfig = transformMdmsToFlowConfig(mdmsData[0]);
          console.log("Transformed Flow Config:", flowConfig);
          // Create MDMS API calls for each config object in parallel
          debugger;
          const apiCalls = appConfig.map((configData) => {
            const payload = {
              tenantId: tenantId,
              schemaCode: "HCM-ADMIN-CONSOLE.NewFormConfig",
              data: configData,
              isActive: true,
            };

            return Digit.CustomService.getResponse({
              url: "/mdms-v2/v2/_create/HCM-ADMIN-CONSOLE.FormConfig",
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
              flows: flowConfig,
            },
            isActive: true,
          };

          const flowConfigApiCall = Digit.CustomService.getResponse({
            url: "/mdms-v2/v2/_create/HCM-ADMIN-CONSOLE.FormConfig",
            body: {
              Mdms: flowConfigPayload,
            },
            useCache: false,
          });

          // Execute all API calls in parallel (appConfig + flowConfig)
          const results = await Promise.all([...apiCalls, flowConfigApiCall]);
          console.log("MDMS Create API Results:", results);

          // Redirect to new-app-configuration after successful API calls
          navigate(
            `/${window?.contextPath}/employee/campaign/new-app-configuration-redesign?campaignNumber=${campaignNumber}&flow=${flow}`
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

export default DummyLoader;
