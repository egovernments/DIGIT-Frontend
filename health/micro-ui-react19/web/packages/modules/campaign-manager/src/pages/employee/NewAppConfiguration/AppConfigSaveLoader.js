import { Loader, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import transformMdmsToAppConfig from "./transformers/mdmsToAppConfig";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

const AppConfigSaveLoader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const flowModule = searchParams.get("flow");
  const tenantId = searchParams.get("tenantId") || Digit?.ULBService?.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [loaderText, setLoaderText] = useState("SUBMITTING_APP_CONFIG");

  useEffect(() => {
    const saveConfig = async () => {
      try {
        // Step 1: Fetch TransformedFormConfig data and transform it
        const response = await Digit.CustomService.getResponse({
          url: `/${mdmsContext}/v2/_search`,
          body: {
            MdmsCriteria: {
              tenantId: tenantId,
              schemaCode: "HCM-ADMIN-CONSOLE.TransformedFormConfig",
              filters: {
                project: campaignNumber,
                module: flowModule,
              },
              limit: 1000,
              isActive: true,
            },
          },
        });

        // Step 2: Search for existing FormConfig with campaignNumber and flow
        const appConfigResponse = await Digit.CustomService.getResponse({
          url: `/${mdmsContext}/v2/_search`,
          body: {
            MdmsCriteria: {
              tenantId: tenantId,
              schemaCode: "HCM-ADMIN-CONSOLE.FormConfig",
              filters: {
                project: campaignNumber,
                name: flowModule,
              },
              limit: 1000,
              isActive: true,
            },
          },
        });

        const fullData = response?.mdms && response?.mdms?.map((item) => item.data);
        
        const transformedData = transformMdmsToAppConfig(fullData, appConfigResponse.mdms?.[0].data?.version, appConfigResponse.mdms?.[0]?.data?.flows);
        // Step 3: Update the existing config's mdms property with transformedData
        if (appConfigResponse?.mdms && appConfigResponse.mdms.length > 0) {
          const existingConfig = appConfigResponse.mdms?.[0].data;

          // Update the mdms property with transformed data
          const updatedConfig = {
            ...existingConfig,
            flows: transformedData,
            version: existingConfig?.version + 1,
          };

          // Update the MDMS record
          const updatePayload = {
            Mdms: {
              ...appConfigResponse.mdms?.[0],
              data: updatedConfig,
            },
          };

          await Digit.CustomService.getResponse({
            url: `/${mdmsContext}/v2/_update/HCM-ADMIN-CONSOLE.FormConfig`,
            body: updatePayload,
          });

          // Show success message and redirect after 3 seconds
          setLoaderText(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_SUBMITTED_REDIRECTING);
          setTimeout(() => {
            navigate(`/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
          }, 3000);
        } else {
          console.error("No existing FormConfig found for campaignNumber and flow");
          setShowToast({ key: "error", label: "APP_CONFIG_UPDATE_FAILED" });
          // Navigate back after showing error
          setTimeout(() => {
            navigate(-1);
          }, 3000);
        }
      } catch (error) {
        console.error("Error in saveConfig:", error);
        setShowToast({ key: "error", label: "APP_CONFIG_UPDATE_FAILED" });
        // Navigate back after showing error
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      }
    };

    if (campaignNumber && flowModule && tenantId) {
      saveConfig();
    }
  }, [campaignNumber, flowModule, tenantId, navigate]);

  return (
    <>
      <Loader page={true} variant={"OverlayLoader"} loaderText={t(loaderText)} />
      {showToast && (
        <Toast type={showToast?.key === "error" ? "error" : "success"} label={t(showToast?.label)} onClose={() => setShowToast(null)} />
      )}
    </>
  );
};

export default AppConfigSaveLoader;
