import { Loader, Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import transformMdmsToAppConfig from "./transformers/mdmsToAppConfig";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

const mdmsContext = window.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

const toNumber = (value, defaultValue = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

const getLastModifiedTime = (record) => {
  return toNumber(record?.auditDetails?.lastModifiedTime, 0);
};

const getMatchingFormConfigRecords = (records, campaignNumber, flowModule) => {
  return (records || []).filter((record) => {
    return record?.data?.project === campaignNumber && record?.data?.name === flowModule;
  });
};

const selectLatestFormConfigRecord = (records) => {
  const sorted = [...records].sort((a, b) => {
    const versionDiff = toNumber(b?.data?.version, 0) - toNumber(a?.data?.version, 0);
    if (versionDiff !== 0) return versionDiff;

    const auditDiff = getLastModifiedTime(b) - getLastModifiedTime(a);
    if (auditDiff !== 0) return auditDiff;

    const idA = String(a?.id || "");
    const idB = String(b?.id || "");
    return idB.localeCompare(idA);
  });

  return sorted[0] || null;
};

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

        const fullData = response?.mdms?.map((item) => item?.data)?.filter(Boolean) || [];

        const matchingRecords = getMatchingFormConfigRecords(appConfigResponse?.mdms || [], campaignNumber, flowModule);
        const selectedRecord = selectLatestFormConfigRecord(matchingRecords);

        // Step 3: Update the existing config's mdms property with transformedData
        if (selectedRecord?.data && fullData.length > 0) {
          const existingConfig = selectedRecord.data;
          const currentVersion = toNumber(existingConfig?.version, 0);
          const transformedData = transformMdmsToAppConfig(fullData, currentVersion, existingConfig?.flows);

          // Update the mdms property with transformed data
          const updatedConfig = {
            ...existingConfig,
            flows: transformedData,
            version: currentVersion + 1,
          };

          // Update the MDMS record
          const updatePayload = {
            Mdms: {
              ...selectedRecord,
              data: updatedConfig,
            },
          };

          await Digit.CustomService.getResponse({
            url: `/${mdmsContext}/v2/_update/HCM-ADMIN-CONSOLE.FormConfig`,
            body: updatePayload,
          });

          const verifyResponse = await Digit.CustomService.getResponse({
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

          const verifiedRecord = (verifyResponse?.mdms || []).find((row) => row?.id === selectedRecord?.id);
          const expectedVersion = currentVersion + 1;
          const verifiedVersion = toNumber(verifiedRecord?.data?.version, -1);
          const isVersionUpdated = verifiedVersion === expectedVersion;
          const isFlowsUpdated =
            JSON.stringify(verifiedRecord?.data?.flows || []) === JSON.stringify(updatedConfig?.flows || []);

          if (!verifiedRecord || !isVersionUpdated || !isFlowsUpdated) {
            throw new Error("APP_CONFIG_WRITE_VERIFICATION_FAILED");
          }

          // Show success message and redirect after 3 seconds
          setLoaderText(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_SUBMITTED_REDIRECTING);
          setTimeout(() => {
            navigate(`/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
          }, 3000);
        } else {
          console.error("No matching FormConfig found for campaignNumber and flow");
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
