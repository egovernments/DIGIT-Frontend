import React, { useState, useEffect, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Card, HeaderComponent, Button, Toggle, Footer, Loader, SVG, TextBlock } from "@egovernments/digit-ui-components";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import getMDMSUrl from "../../../utils/getMDMSUrl";
import { TEMPLATE_BASE_CONFIG_MASTER } from "./AppModule";

/**
 * Utility to create a filter string to fetch formats based on project and allowed formats.
 */
const getTemplateFormatFilter = (projectNo = "", formats = []) => {
  const formatFilter = formats?.map((format) => `@.format=='${format}'`).join("||");
  return `[?(@.project=='${projectNo}')].pages.*.properties[?((${formatFilter})&& @.hidden==false)].format`;
};

/**
 * Utility to create a filter string to fetch flow names for a project.
 */
const getFlowFilter = (projectNo = "") => `[?(@.project=='${projectNo}')].name`;

/**
 * Compares existing selected features vs. current feature config.
 * Returns whether any module has changed selections.
 */
const findIsAnyChangedFeatures = (selectedFeaturesByModule = {}, selectedFeatureConfigs = []) => {
  const modules = Object.keys(selectedFeaturesByModule);
  const keys = modules.map((key) => {
    return (
      selectedFeatureConfigs.every((elem) => selectedFeaturesByModule[key].includes(elem)) &&
      selectedFeaturesByModule[key].every((elem) => selectedFeatureConfigs.includes(elem)) &&
      key
    );
  });

  return { changed: !keys.every(Boolean), keys: modules.filter((key) => !keys.includes(key)) };
};

/**
 * Checks if a given feature is selected for the given module.
 */
const isFeatureSelected = (feature, module, selectedFeaturesByModule) => selectedFeaturesByModule?.[module]?.some((e) => e === feature?.format);

const AppFeatures = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const mdmsBaseUrl = getMDMSUrl(true);
  const { campaignNumber, projectType, tenantId } = Digit.Hooks.useQueryParams();
  const AppConfigSchema = "SimpleAppConfiguration";

  const [selectedFeaturesByModule, setSelectedFeaturesByModule] = useState(null);
  const [availableFormats, setAvailableFormats] = useState([]);
  const [selectedModuleCode, setSelectedModuleCode] = useState(null);

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

  // Fetch selected feature configurations for the campaign
  const selectedFeatureCriteria = useMemo(() => {
    return Digit.Utils.campaign.getMDMSV1Criteria(
      tenantId,
      CONSOLE_MDMS_MODULENAME,
      [
        {
          name: "SimpleAppConfiguration",
          filter: getTemplateFormatFilter(campaignNumber, availableFormats),
        },
      ],
      `MDMSDATA-${campaignNumber}-${availableFormats}`,
      {
        enabled: availableFormats?.length > 0,
        ...Digit.Utils.campaign.getMDMSV1Selector(CONSOLE_MDMS_MODULENAME, "SimpleAppConfiguration"),
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
          name: "SimpleAppConfiguration",
          filter: getFlowFilter(campaignNumber),
        },
      ],
      `MDMSDATA-${campaignNumber}`,
      {
        enabled: !!campaignNumber,
        ...Digit.Utils.campaign.getMDMSV1Selector(CONSOLE_MDMS_MODULENAME, "SimpleAppConfiguration"),
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
    if (!selectedFeaturesByModule && selectedFeatureConfigs?.length > 0 && moduleToggleData?.length) {
      const defaultSelection = moduleToggleData.reduce((acc, moduleCode) => {
        acc[moduleCode] = [...selectedFeatureConfigs];
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

  const toggleOptions = moduleToggleData?.map((moduleCode) => ({
    code: moduleCode,
    name: t(moduleCode),
  }))||[];

  if (isModuleDataLoading) return <Loader page={true} variant={"PageLoader"} />;

  return (
    <>
      <div className="hcm-app-features">
        {(isSelectedFeatureLoading || isModuleToggleLoading) && <Loader page={true} variant={"PageLoader"} />}
        {isUpdateLoading && <Loader page={true} variant={"OverlayLoader"} loaderText={t("SAVING_FEATURES_CONFIG_IN_SERVER")} />}
        <HeaderComponent className="campaign-header-style">{t("HCM_CHOOSE_FEATURE_FOR_APP")}</HeaderComponent>
        <TextBlock
          body=""
          caption={t("CMP_DRAWER_WHAT_IS_FEATURE_APP_CONFIG_SCREEN")}
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
            label={t("GO_BACK")}
            title={t("GO_BACK")}
            variation="secondary"
            style={{ marginLeft: "2.5rem" }}
            onClick={() => {
              history.push(
                `/${window.contextPath}/employee/campaign/app-modules?projectType=${projectType}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
              );
            }}
          />,
          <Button
            key="next"
            label={t("NEXT")}
            title={t("NEXT")}
            variation="primary"
            onClick={() => {
              const changes = findIsAnyChangedFeatures(selectedFeaturesByModule, selectedFeatureConfigs);
              const redirectURL = `/${window.contextPath}/employee/campaign/app-configuration-redesign?variant=app&masterName=${AppConfigSchema}&fieldType=AppFieldTypeOne&prefix=${campaignNumber}&localeModule=APPONE&tenantId=${tenantId}&campaignNumber=${campaignNumber}&formId=default&projectType=${projectType}`;
              if (changes?.changed) {
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
                      history.push(redirectURL);
                    },
                    onError: (err) => {
                      console.error("Update failed:", err);
                    },
                  }
                );
              } else {
                history.push(redirectURL);
              }
            }}
          />,
        ]}
      />
    </>
  );
};

export default AppFeatures;

const AppFeaturesList = ({ selectedModuleFeatures, selectedModuleCode, selectedFeaturesByModule, handleSelectFeature }) => {
  const { t } = useTranslation();

  return (
    <div className="modules-container">
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
              label={featureSelected ? t("DESELECT") : feature?.disabled ? t("ES_FEATURE_DISABLED") : t("ES_CAMPAIGN_SELECT")}
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
      
    />
  );
};
