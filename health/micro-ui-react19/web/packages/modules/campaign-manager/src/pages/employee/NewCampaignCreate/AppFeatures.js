import React, { useState, useEffect, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, HeaderComponent, Button, Toggle, Footer, Loader, SVG, TextBlock, CardText, PopUp } from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import getMDMSUrl from "../../../utils/getMDMSUrl";
import { TEMPLATE_BASE_CONFIG_MASTER } from "./AppModule";
import { HCMCONSOLE_APPCONFIG_MODULENAME } from "./CampaignDetails";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

/**
 * Utility to create a filter string to fetch formats based on project and allowed formats.
 */
const getTemplateFormatFilter = (projectNo = "", formats = []) => {
  const formatFilter = formats?.map((format) => `@.format=='${format}'`).join("||");
  return `[?(@.project=='${projectNo}')]`;
  // return `[?(@.project=='${projectNo}')].pages.*.properties[?((${formatFilter})&& @.hidden==false)].format`;
};

/**
 * Utility to create a filter string to fetch flow names for a project.
 */
const getFlowFilter = (projectNo = "") => `[?(@.project=='${projectNo}' && @.isSelected==true )]`;

/**
 * Compares existing selected features vs. current feature config.
 * Returns whether any module has changed selections.
 */
const findIsAnyChangedFeatures = (selectedFeaturesByModule = {}, selectedFeatureConfigs = []) => {
  const modules = Object?.keys(selectedFeaturesByModule);
  const keys = modules.map((key) => {
    return (
      selectedFeatureConfigs[key].every((elem) => selectedFeaturesByModule[key].includes(elem)) &&
      selectedFeaturesByModule[key].every((elem) => selectedFeatureConfigs[key].includes(elem)) &&
      key
    );
  });

  return { changed: !keys.every(Boolean), keys: modules.filter((key) => !keys.includes(key)) };
};

/**
 * Checks if a given feature is selected for the given module.
 */
const isFeatureSelected = (feature, module, selectedFeaturesByModule) => selectedFeaturesByModule?.[module]?.some((e) => e === feature?.format);

const getSelectedFeaturesByProjectName = (data, projectNo, formats) => {
  const result = {};

  for (const obj of data) {
    if (obj.project !== projectNo) continue;

    const projectName = obj.name || obj.project; // fallback if name is missing
    const selectedFormats = [];

    for (const page of obj.pages || []) {
      for (const prop of page.properties || []) {
        if (formats.includes(prop.format) && prop.hidden === false) {
          selectedFormats.push(prop.format);
        }
      }
    }

    result[projectName] = selectedFormats;
  }

  return result;
};

const AppFeatures = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mdmsBaseUrl = getMDMSUrl(true);
  const { campaignNumber, projectType, tenantId } = Digit.Hooks.useQueryParams();
  const AppConfigSchema = HCMCONSOLE_APPCONFIG_MODULENAME;

  const [selectedFeaturesByModule, setSelectedFeaturesByModule] = useState(null);
  const [availableFormats, setAvailableFormats] = useState([]);
  const [selectedModuleCode, setSelectedModuleCode] = useState(null);
  const [showPopUp, setShowPopUp] = useState(null);

  // Fetch all module schemas and their features from MDMS
  const { isLoading: isModuleDataLoading, data: moduleSchemas } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV1Criteria(
      tenantId,
      CONSOLE_MDMS_MODULENAME,
      [{ name: "AppModuleSchema" }],
      "MDMSDATA-AppModuleSchema",
      Digit.Utils.campaign.getMDMSV1Selector(CONSOLE_MDMS_MODULENAME, "AppModuleSchema")
    )
  );

  const { updateConfig, isLoading: isUpdateLoading } = Digit.Hooks.campaign.useUpdateAppConfigForFeatures();
  const { mutate: clearCacheMutate } = Digit.Hooks.campaign.useUpdateAppConfig(tenantId);

  const reqCriteriaForm = {
    url: `/${mdms_context_path}/v2/_search`,
    changeQueryName: `APP_FEATURES_CONFIG_CACHE`,
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        schemaCode: `${CONSOLE_MDMS_MODULENAME}.TransformedFormConfig`,
        isActive: true,
        limit: 1000,
        filters: {
          campaignNumber: campaignNumber,
        },
      },
    },
    config: {
      select: (data) => {
        return data?.mdms;
      },
    },
  };

  const { isLoading: isCacheLoading, data: cacheData, refetch: refetchCache } = Digit.Hooks.useCustomAPIHook(reqCriteriaForm);

  // Fetch selected feature configurations for the campaign
  const selectedFeatureCriteria = useMemo(() => {
    return Digit.Utils.campaign.getMDMSV1Criteria(
      tenantId,
      CONSOLE_MDMS_MODULENAME,
      [
        {
          name: HCMCONSOLE_APPCONFIG_MODULENAME,
          filter: getTemplateFormatFilter(campaignNumber, availableFormats),
        },
      ],
      `MDMSDATA-${campaignNumber}-${availableFormats}`,
      {
        enabled: availableFormats?.length > 0,
        cacheTime: 0,
        staleTime: 0,
        select: (data) => {
          const respArr = data?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.[HCMCONSOLE_APPCONFIG_MODULENAME];
          const temp = getSelectedFeaturesByProjectName(respArr, campaignNumber, availableFormats);
          return temp;
        },
      }
    );
  }, [availableFormats, campaignNumber]);

  const { isLoading: isSelectedFeatureLoading, data: selectedFeatureConfigs } = Digit.Hooks.useCustomAPIHook(selectedFeatureCriteria);

  // Fetch toggle tab names (module codes) for campaign
  const { isLoading: isModuleToggleLoading, data: moduleToggleData } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV1Criteria(
      tenantId,
      CONSOLE_MDMS_MODULENAME,
      [
        {
          name: HCMCONSOLE_APPCONFIG_MODULENAME,
          filter: getFlowFilter(campaignNumber),
        },
      ],
      `MDMSDATA-${campaignNumber}`,
      {
        enabled: !!campaignNumber,
        cacheTime: 0,
        staleTime: 0,
        select: (data) => {
          const temp = data?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.[HCMCONSOLE_APPCONFIG_MODULENAME];
          return temp?.sort((a, b) => a?.order - b?.order)?.map((i) => i?.name) || [];
        },
        // ...Digit.Utils.campaign.getMDMSV1Selector(CONSOLE_MDMS_MODULENAME, HCMCONSOLE_APPCONFIG_MODULENAME),
      }
    )
  );

  // Set all formats found in schemas
  useEffect(() => {
    if (availableFormats.length === 0 && moduleSchemas) {
      const formats = moduleSchemas?.flatMap((module) => module?.features?.map((feature) => feature?.format)).filter(Boolean);
      setAvailableFormats(formats);
    }
  }, [moduleSchemas]);

  // Auto-select features when data is loaded
  useEffect(() => {
    if (!selectedFeaturesByModule && selectedFeatureConfigs && moduleToggleData?.length) {
      const defaultSelection = moduleToggleData.reduce((acc, moduleCode) => {
        acc[moduleCode] = [...selectedFeatureConfigs?.[moduleCode]];
        return acc;
      }, {});
      setSelectedFeaturesByModule(defaultSelection);
    }
  }, [selectedFeatureConfigs, moduleToggleData]);

  // Auto-select the first tab if nothing is selected
  useEffect(() => {
    if (!selectedModuleCode && moduleToggleData?.length > 0) {
      setSelectedModuleCode(moduleToggleData[0]);
    }
  }, [moduleToggleData]);

  const handleToggleChange = (moduleCode) => setSelectedModuleCode(moduleCode);

  // Get features for the selected module
  const selectedModuleFeatures = useMemo(() => {
    return moduleSchemas?.find((mod) => mod?.code === selectedModuleCode)?.features || [];
  }, [selectedModuleCode, moduleSchemas]);

  // Toggle feature selection
  const handleSelectFeature = (featureCode, moduleCode, isSelected = false) => {
    setSelectedFeaturesByModule((prev) => ({
      ...prev,
      [moduleCode]: isSelected ? prev?.[moduleCode]?.filter((e) => e !== featureCode) : [...(prev?.[moduleCode] || []), featureCode],
    }));
  };

  const toggleOptions =
    moduleToggleData?.map((moduleCode) => ({
      code: moduleCode,
      name: t(moduleCode),
    })) || [];

  if (isModuleDataLoading) return <Loader page={true} variant={"PageLoader"} />;

  const handleNext = async (clearCache) => {
    const changes = findIsAnyChangedFeatures(selectedFeaturesByModule, selectedFeatureConfigs);
    const redirectURL = `/${window.contextPath}/employee/campaign/app-configuration-redesign?variant=app&masterName=${AppConfigSchema}&fieldType=FieldTypeMappingConfig&prefix=${campaignNumber}&localeModule=APPONE&tenantId=${tenantId}&campaignNumber=${campaignNumber}&formId=default&projectType=${projectType}`;
    if (changes?.changed) {
      if (clearCache) {
        await Promise.all(
          clearCache.map(async (cacheData) => {
            await clearCacheMutate(
              {
                moduleName: "HCM-ADMIN-CONSOLE",
                masterName: "TransformedFormConfig",
                data: {
                  ...cacheData,
                  data: {
                    projectType: cacheData?.data?.projectType,
                    campaignNumber: cacheData?.data?.campaignNumber,
                    flow: cacheData?.data?.flow,
                    data: null,
                  },
                },
              },
              {
                onError: (error, variables) => {
                  console.error("Cache clear failed:", error, variables);
                },
                onSuccess: async (data) => {
                  return null;
                },
              }
            );
          })
        );
      }
      updateConfig(
        {
          tenantId,
          campaignNo: campaignNumber,
          changes: changes,
          selectedFeaturesByModule,
          availableFormats: moduleSchemas,
        },
        {
          onSuccess: () => {
            navigate(redirectURL);
          },
          onError: (err) => {
            console.error("Update failed:", err);
          },
        }
      );
    } else {
      navigate(redirectURL);
    }
  };

  const handleConfirmCacheClear = () => {
    const changes = findIsAnyChangedFeatures(selectedFeaturesByModule, selectedFeatureConfigs);
    const changeExists = changes?.changed || false;
    const moduleToClearCache = cacheData.filter((i) => changes.keys.includes(i.data.flow) && i.data.data);
    if (moduleToClearCache?.length > 0 && changeExists) {
      setShowPopUp(moduleToClearCache);
    } else {
      handleNext(false);
    }
  };

  return (
    <>
      <div className="hcm-app-features">
        {(isSelectedFeatureLoading || isModuleToggleLoading) && <Loader page={true} variant={"PageLoader"} />}
        {isUpdateLoading && <Loader page={true} variant={"OverlayLoader"} loaderText={t(I18N_KEYS.CAMPAIGN_CREATE.SAVING_FEATURES_CONFIG_IN_SERVER)} />}
        <HeaderComponent className="campaign-header-module-style">{t(I18N_KEYS.CAMPAIGN_CREATE.HCM_CHOOSE_FEATURE_FOR_APP)}</HeaderComponent>
        <TextBlock
          body=""
          caption={t(I18N_KEYS.CAMPAIGN_CREATE.CMP_DRAWER_WHAT_IS_FEATURE_APP_CONFIG_SCREEN)}
          header=""
          captionClassName="camp-drawer-caption"
          subHeader=""
        />
      </div>
      <div className="feature-container">
        <AppConfigTab toggleOptions={toggleOptions} handleToggleChange={handleToggleChange} selectedOption={selectedModuleCode} />
        <AppFeaturesList
          selectedModuleFeatures={selectedModuleFeatures}
          selectedModuleCode={selectedModuleCode}
          selectedFeaturesByModule={selectedFeaturesByModule}
          handleSelectFeature={handleSelectFeature}
        />
      </div>
      <Footer
        actionFields={[
          <Button
            key="back"
            label={t(I18N_KEYS.COMMON.GO_BACK)}
            title={t(I18N_KEYS.COMMON.GO_BACK)}
            variation="secondary"
            style={{ marginLeft: "2.5rem" }}
            icon={"ArrowBack"}
            onClick={() => {
              navigate(
                `/${window.contextPath}/employee/campaign/app-modules?projectType=${projectType}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
              );
            }}
          />,
          <Button
            key="next"
            label={t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)}
            title={t(I18N_KEYS.CAMPAIGN_CREATE.NEXT)}
            variation="primary"
            icon={"ArrowDirection"}
            isSuffix
            onClick={() => handleConfirmCacheClear()}
          />,
        ]}
      />
      {showPopUp && (
        <PopUp
          className={"boundaries-pop-module"}
          type={"default"}
          heading={t(I18N_KEYS.CAMPAIGN_CREATE.SURE_TO_CLEAR_CACHE)}
          children={[
            <div>
              <CardText style={{ margin: 0 }}>{t(I18N_KEYS.CAMPAIGN_CREATE.SURE_TO_CLEAR_CACHE_MODAL_TEXT)}</CardText>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          onClose={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t(I18N_KEYS.COMMON.NO)}
              title={t(I18N_KEYS.COMMON.NO)}
              onClick={() => {
                setShowPopUp(false);
              }}
            />,
            <Button
              className={"campaign-type-alert-button"}
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t(I18N_KEYS.CAMPAIGN_CREATE.CONFIRM)}
              title={t(I18N_KEYS.CAMPAIGN_CREATE.CONFIRM)}
              onClick={() => {
                handleNext(showPopUp);
                setShowPopUp(false);
              }}
            />,
          ]}
          sortFooterChildren={true}
        />
      )}
    </>
  );
};

export default AppFeatures;

const AppFeaturesList = ({ selectedModuleFeatures, selectedModuleCode, selectedFeaturesByModule, handleSelectFeature }) => {
  const { t } = useTranslation();

  return (
    <div className="modules-feature-container">
      {selectedModuleFeatures?.map((feature) => {
        const featureSelected = isFeatureSelected(feature, selectedModuleCode, selectedFeaturesByModule);
        return (
          <Card key={feature?.code} className={`module-card ${featureSelected ? "selected-card" : ""}`}>
            {featureSelected && (
              <SVG.CheckCircle fill="#00703C" width="3rem" height="3rem" style={{ position: "absolute", left: "-10px", top: "-14px" }} />
            )}
            <HeaderComponent className={`detail-header ${featureSelected ? "selected-header" : ""}`}>{t(feature?.code)}</HeaderComponent>
            <hr style={{ border: "1px solid #e0e0e0", width: "100%", margin: "0.5rem 0" }} />
            <p className="module-description">{t(feature?.description)}</p>
            <Button
              className="campaign-module-button"
              type="button"
              size="large"
              isDisabled={feature?.disabled}
              variation={featureSelected ? "secondary" : "primary"}
              label={featureSelected ? t(I18N_KEYS.CAMPAIGN_CREATE.DESELECT) : feature?.disabled ? t(I18N_KEYS.CAMPAIGN_CREATE.ES_FEATURE_DISABLED) : t(I18N_KEYS.CAMPAIGN_CREATE.ES_CAMPAIGN_SELECT)}
              title={featureSelected ? t(I18N_KEYS.CAMPAIGN_CREATE.DESELECT) : feature?.disabled ? t(I18N_KEYS.CAMPAIGN_CREATE.ES_FEATURE_DISABLED) : t(I18N_KEYS.CAMPAIGN_CREATE.ES_CAMPAIGN_SELECT)}
              onClick={() => handleSelectFeature(feature?.format, selectedModuleCode, featureSelected)}
            />
          </Card>
        );
      })}
    </div>
  );
};

export const AppConfigTab = ({ toggleOptions = [], handleToggleChange, selectedOption, wrapperClassName = "app-config" }) => {
  // Construct schema code using constants
  const schemaCode = `${CONSOLE_MDMS_MODULENAME}.${TEMPLATE_BASE_CONFIG_MASTER}`;

  // Extract URL query params
  const { projectType, tenantId } = Digit.Hooks.useQueryParams();
  const { t } = useTranslation();

  // Fetch configuration data from MDMS using custom hook
  const { isLoading: isConfigLoading, data: defaultModuleConfigs } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV2Criteria(tenantId, schemaCode, { project: projectType }, `MDMSDATA-${schemaCode}-${projectType}`, {
      enabled: !!projectType,
      select: (data) => {
        // Transform MDMS data to simplified shape
        return data?.mdms?.map((config) => ({
          name: config?.data?.name,
          order: config?.data?.order,
        }));
      },
    })
  );

  // Return null until loading is complete or data is missing
  if (isConfigLoading || !defaultModuleConfigs || !toggleOptions) return null;

  // Create a set of toggle codes provided by the user
  const userSelectedCodes = new Set(toggleOptions.map((item) => item.code));

  // Step 1: Sort default configs based on order
  const sortedDefaultConfigs = [...defaultModuleConfigs].sort((a, b) => a.order - b.order);

  // Step 2: Start with user-provided toggle options (preserve original order)
  const finalToggleOptions = [...toggleOptions];

  // Step 3: Append missing defaults that user hasn't explicitly selected
  sortedDefaultConfigs.forEach((defaultItem) => {
    if (!userSelectedCodes.has(defaultItem.name)) {
      finalToggleOptions.push({
        code: defaultItem.name,
        name: t(defaultItem.name),
        disabled: true, // Mark as disabled since not selected by user
      });
    }
  });

  const orderMap = new Map(defaultModuleConfigs.map((item) => [item.name, item.order]));

  // Sort finalToggleOptions by order
  finalToggleOptions.sort((a, b) => {
    return orderMap.get(a.code) - orderMap.get(b.code);
  });

  // Render the toggle UI component
  return (
    <Toggle
      name="moduleToggle"
      numberOfToggleItems={finalToggleOptions.length}
      onChange={() => {}}
      onSelect={handleToggleChange}
      options={finalToggleOptions}
      optionsKey="code"
      selectedOption={selectedOption}
      type="toggle"
      additionalWrapperClass={wrapperClassName}
      variant="vertical"
      disabled={finalToggleOptions.every((option) => option.disabled)}
    />
  );
};
