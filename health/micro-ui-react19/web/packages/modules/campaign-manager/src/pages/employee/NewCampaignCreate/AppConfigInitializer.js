import { Loader, Button, Card } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { transformMdmsToAppConfig, transformMdmsToFlowConfig } from "./transformMdmsConfig";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

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

  const [setupFailed, setSetupFailed] = useState(false);
  // Bumped by the retry button. It is part of the run key below, so retrying starts a fresh
  // attempt while an ordinary re-render still does not.
  const [attempt, setAttempt] = useState(0);
  const startedRef = useRef(null);

  const schemaCode = `${CONSOLE_MDMS_MODULENAME}.FormConfig`;
  const { isLoading, isFetching, data: mdmsData } = Digit.Hooks.useCustomAPIHook(
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
    if (!mdmsData || mdmsData.length === 0) return;

    // The effect re-runs on every new mdmsData reference, and the work below writes to MDMS.
    // Without this guard a second run could start while the first is still creating, and both
    // would write the same records.
    const runKey = `${campaignNumber}-${flow}-${attempt}`;
    if (startedRef.current === runKey) return;
    startedRef.current = runKey;

    const searchMaster = (code, filters) =>
      Digit.CustomService.getResponse({
        url: `/${mdmsContext}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: code,
            filters: filters,
            limit: 1000,
            isActive: true,
          },
        },
        useCache: false,
      });

    const processData = async () => {
      const goToConfig = () =>
        navigate(
          `/${window?.contextPath}/employee/campaign/new-app-configuration-redesign?campaignNumber=${campaignNumber}&flow=${flow}&version=${version}${
            viewMode ? "&viewMode=true" : ""
          }`
        );

      try {
        // Both records are checked, not just TransformedFormConfig. AppFlowConfig is written in
        // exactly one place - the create below - so skipping ahead on TransformedFormConfig alone
        // left a missing AppFlowConfig out of reach for good, and the configuration screen kept
        // reporting no flow configuration. Checking both also repairs a campaign already in that
        // state the next time someone opens the module.
        const [transformed, flowCfg] = await Promise.all([
          searchMaster("HCM-ADMIN-CONSOLE.TransformedFormConfig", { project: campaignNumber, module: flow }),
          searchMaster("HCM-ADMIN-CONSOLE.AppFlowConfig", { project: campaignNumber, name: flow }),
        ]);

        const hasTransformed = transformed?.mdms?.length > 0;
        const hasFlowConfig = flowCfg?.mdms?.length > 0;

        if (hasTransformed && hasFlowConfig) {
          goToConfig();
          return;
        }

        // Only what is missing gets written, so a campaign that already holds the user's edited
        // pages keeps them and gains just the record it was short of.
        const writes = [];

        if (!hasTransformed) {
          transformMdmsToAppConfig(mdmsData[0]).forEach((configData) => {
            writes.push(
              Digit.CustomService.getResponse({
                url: `/${mdmsContext}/v2/_create/HCM-ADMIN-CONSOLE.TransformedFormConfig`,
                body: {
                  Mdms: {
                    tenantId: tenantId,
                    schemaCode: "HCM-ADMIN-CONSOLE.TransformedFormConfig",
                    data: configData,
                    isActive: true,
                  },
                },
                useCache: false,
              })
            );
          });
        }

        if (!hasFlowConfig) {
          writes.push(
            Digit.CustomService.getResponse({
              url: `/${mdmsContext}/v2/_create/HCM-ADMIN-CONSOLE.AppFlowConfig`,
              body: {
                Mdms: {
                  tenantId: tenantId,
                  schemaCode: "HCM-ADMIN-CONSOLE.AppFlowConfig",
                  data: {
                    project: campaignNumber,
                    name: flow,
                    flows: transformMdmsToFlowConfig(mdmsData[0]),
                  },
                  isActive: true,
                },
              },
              useCache: false,
            })
          );
        }

        await Promise.all(writes);
        goToConfig();
      } catch (error) {
        console.error("Error processing MDMS data:", error);
        // This used to be logged and nothing more, leaving the user on a loader that never
        // resolved - and, since some writes above may already have landed, a half-finished setup
        // the next visit would skip over. Showing it gives them a retry.
        setSetupFailed(true);
      }
    };

    processData();
  }, [mdmsData, campaignNumber, flow, navigate, tenantId, version, viewMode, attempt]);

  // Nothing to set up: either the URL is missing what the search needs, or the search found no
  // form configuration. Both used to sit on a loader for ever, since the effect above only runs
  // once mdmsData has rows.
  //
  // Array.isArray is doing real work here. An unresolved query reports undefined and the hook
  // exposes no "has fetched" flag, so testing for a falsy value would flash this message in the
  // render or two before the request settles. Only a search that answered with no rows reaches it.
  const missingParams = !campaignNumber || !flow;
  const noFormConfig = missingParams || (!isLoading && !isFetching && Array.isArray(mdmsData) && mdmsData.length === 0);

  if (setupFailed || noFormConfig) {
    return (
      <main style={{ display: "contents" }}>
        <Card>
          <h1 className="digit-card-header">{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_ERROR)}</h1>
          <p>
            {noFormConfig
              ? t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_NO_FLOW_CONFIG_FOUND)
              : t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_SETUP_FAILED)}
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            {!noFormConfig && (
              <Button
                variation="primary"
                label={t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_RETRY)}
                title={t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_RETRY)}
                size="medium"
                onClick={() => {
                  setSetupFailed(false);
                  setAttempt((a) => a + 1);
                }}
                textStyles={{color:"#FFFFFF"}}
              />
            )}
            <Button
              variation="secondary"
              icon="ArrowBack"
              label={t(I18N_KEYS.APP_CONFIGURATION.BACK_TO_MODULES)}
              title={t(I18N_KEYS.APP_CONFIGURATION.BACK_TO_MODULES)}
              size="medium"
              onClick={() =>
                navigate(
                  `/${window?.contextPath}/employee/campaign/new-app-modules?campaignNumber=${campaignNumber}&tenantId=${tenantId}${
                    viewMode ? "&viewMode=true" : ""
                  }`
                )
              }
            />
          </div>
        </Card>
      </main>
    );
  }

  return <Loader page={true} variant={"OverlayLoader"} loaderText={t("LOADING_MODULE", { module: flow, campaign: campaignNumber })} />;
};

export default AppConfigInitializer;
