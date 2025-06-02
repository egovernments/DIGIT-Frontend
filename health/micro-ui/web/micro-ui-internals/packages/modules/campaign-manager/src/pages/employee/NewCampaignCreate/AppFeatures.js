import { Card, HeaderComponent, Button, Toggle, Footer, Loader, SVG } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo,Fragment } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import getMDMSUrl from "../../../utils/getMDMSUrl";

// Constructs a filter string to fetch only relevant formats for a project
const getTemplateFormatFilter = (projectNo = "", formats = []) => {
  const formatFilter = formats
    ?.map((format) => `@.format=='${format}'`)
    .join("||");

  return `[?(@.project=='${projectNo}')].pages.*.properties[?((${formatFilter})&& @.hidden==false)].format`;
};

// Constructs a filter string to fetch flow names for a project
const getFlowFilter = (projectNo = "") => `[?(@.project=='${projectNo}')].name`;

const findIsAnyChangedFeatures = (selectedFeaturesByModule={}, selectedFeatureConfigs=[]) => {
  if(!selectedFeaturesByModule||Object.keys(selectedFeaturesByModule).length===selectedFeatureConfigs.length) return false;
  const modules=Object.keys(selectedFeaturesByModule);
  const keys=(modules.map(key=>{
    return (selectedFeatureConfigs.every(elemnt=>selectedFeaturesByModule[key].includes(elemnt))&&
    selectedFeaturesByModule[key].every(elemnt=>selectedFeatureConfigs.includes(elemnt))&&key);
  }))
  return {changed:!keys.every(ele=>ele),keys:modules.filter(ele=>!keys.includes(ele))};

}


// Checks if a specific feature is already selected in configuration
const isFeatureSelected = (feature, module,selectedFeaturesByModule) => selectedFeaturesByModule?.[module]?.some(e=>e==feature?.format);

const AppFeatures = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const mdmsBaseUrl = getMDMSUrl(true);

  const { campaignNumber, projectType, tenantId } = Digit.Hooks.useQueryParams();
  const AppConfigSchema = "SimpleAppConfiguration";

  const [selectedFeaturesByModule, setSelectedFeaturesByModule] = useState(null);
  const [availableFormats, setAvailableFormats] = useState([]);
  const [selectedModuleCode, setSelectedModuleCode] = useState(null);

  // Fetch all modules and their feature formats from MDMS
  const { isLoading: isModuleDataLoading, data: moduleSchemas } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV1Criteria(
      tenantId,
      CONSOLE_MDMS_MODULENAME,
      [{ name: "AppModuleSchema" }],
      "MDMSDATA-AppModuleSchema",
      Digit.Utils.campaign.getMDMSV1Selector(CONSOLE_MDMS_MODULENAME, "AppModuleSchema")
    )
  );
  const {   updateConfig,         // Call this with { tenantId, campaignNo }
    isLoading,} = Digit.Hooks.campaign.useUpdateAppConfigForFeatures();

console.log(isLoading,"upd");


  // Fetch selected feature configurations for the current campaign and selected formats
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
        enabled: availableFormats?.length !== 0,
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

  // Auto-set formats from module data when available
  useEffect(() => {
    if (availableFormats?.length === 0 && moduleSchemas) {
      const formats = moduleSchemas
        ?.flatMap((module) => module?.features?.map((feature) => feature?.format))
        .filter(Boolean);
      setAvailableFormats(formats);
    }
  }, [moduleSchemas]);


  

  useEffect(() => {
    if (!selectedFeaturesByModule && selectedFeatureConfigs&& selectedFeatureConfigs?.length>0) {
      // moduleToggleData?.reduce(reduce((acc, moduleCode) => {
      //   const selectedFeatures = selectedFeatureConfigs?.find((feature) => feature?.moduleCode === moduleCode)?.features || [];
      //   acc[moduleCode] = selectedFeatures;
      //   return acc;
      // }, {});
      // setSelectedFeaturesByModule(selectedFeaturesByModule);selectedFeatureConfigs
      setSelectedFeaturesByModule( moduleToggleData.reduce((acc, curr) => {
        if(acc[curr]){
        acc[curr].push(...selectedFeatureConfigs)    
        }else{
              acc[curr] = [ ...selectedFeatureConfigs];
        }
      return acc;
    }, {}))
    }
  }, [selectedFeatureConfigs]);

  // Auto-select the first module tab if none is selected
  useEffect(() => {
    if (!selectedModuleCode && moduleToggleData?.length > 0) {
      setSelectedModuleCode(moduleToggleData[0]);
    }
  }, [moduleToggleData]);

  const handleToggleChange = (moduleCode) => {
    setSelectedModuleCode(moduleCode);
  };

  // Extract the selected module's features from module data
  const selectedModuleFeatures = useMemo(() => {
    return moduleSchemas?.find((mod) => mod?.code === selectedModuleCode)?.features || [];
  }, [selectedModuleCode, moduleSchemas]);

  const handleSelectFeature = (featureCode,selectedModuleCode,selected=false) => {
    // Placeholder for feature toggle logic. To be implemented.
    setSelectedFeaturesByModule((prev) => ({
      ...prev,
      [selectedModuleCode]:selected?prev?.[selectedModuleCode]?.filter(e=>e!=featureCode):[...prev?.[selectedModuleCode],featureCode],
    }));
  };
  


  // Prepare options for the toggle control (top module tabs)
  const toggleOptions = moduleToggleData?.map((moduleCode) => ({
    code: moduleCode,
    name: t(moduleCode),
  }));

  // Show loader while MDMS data is being fetched
  if (isModuleDataLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <>
      <div className="hcm-app-features">
        {(isSelectedFeatureLoading || isModuleToggleLoading||isLoading) && <Loader page={true} variant={"PageLoader"} />}

        <HeaderComponent className="campaign-header-style">
          {t("HCM_CHOOSE_FEATURE_FOR_APP")}
        </HeaderComponent>

        <Toggle
          name="moduleToggle"
          numberOfToggleItems={toggleOptions?.length}
          onChange={() => {}}
          onSelect={handleToggleChange}
          options={toggleOptions || []}
          optionsKey="code"
          selectedOption={selectedModuleCode}
          type="toggle"
        />
      </div>

      <div className="modules-container">
        {selectedModuleFeatures?.map((feature) => {
          const featureSelected=isFeatureSelected(feature, selectedModuleCode,selectedFeaturesByModule);
          return(
          <Card
            key={feature?.code}
            className={`module-card ${featureSelected ? "selected-card" : ""}`}
          >
            {featureSelected && (
              <SVG.CheckCircle
                fill="#00703C"
                width="3rem"
                height="3rem"
                style={{ position: "absolute", left: "-10px", top: "-14px" }}
              />
            )}

            <HeaderComponent
              className={`detail-header ${featureSelected ? "selected-header" : ""}`}
            >
              {t(feature?.code)}
            </HeaderComponent>

            <hr style={{ border: "1px solid #e0e0e0", width: "100%", margin: "0.5rem 0" }} />

            <p className="module-description">{t(feature?.description)}</p>

            <Button
              className="campaign-module-button"
              type="button"
              size="large"
              isDisabled={feature?.disabled}
              variation={featureSelected ? "secondary" : "primary"}
              label={
                featureSelected
                  ? t("DESELECT")
                  : feature?.disabled
                  ? t("ES_FEATURE_DISABLED")
                  : t("ES_CAMPAIGN_SELECT")
              }
              onClick={() => handleSelectFeature(feature?.format,selectedModuleCode,featureSelected)}
            />
          </Card>
        )})}
      </div>

      <Footer
        actionFields={[
          <Button
            label={t("GO_BACK")}
            title={t("GO_BACK")}
            icon="ArrowBack"
            variation="secondary"
            style={{ marginLeft: "2.5rem" }}
            onClick={() => {
              history.push(
                `/${window.contextPath}/employee/campaign/app-modules?projectType=${projectType}&campaignNumber=${campaignNumber}&tenantId=${tenantId}`
              );
            }}
          />,
          <Button
            label={t("NEXT")}
            title={t("NEXT")}
            icon="ArrowForward"
            isSuffix
            variation="primary"
            onClick={() => {
              const changes=findIsAnyChangedFeatures(selectedFeaturesByModule,selectedFeatureConfigs);
              changes?.changed&&updateConfig({ tenantId: tenantId, campaignNo: campaignNumber,changes:changes?.changes ,allModules:moduleToggleData},
                {
                  onSuccess: (res) => {
                    history.push(
                      `/${window.contextPath}/employee/campaign/app-configuration-redesign?variant=app&masterName=${AppConfigSchema}&fieldType=AppFieldTypeOne&prefix=${campaignNumber}&localeModule=APPONE&tenantId=${tenantId}&campaignNumber=${campaignNumber}&formId=default&projectType=${projectType}`
                    )
                  },
                  onError: (err) => {
                    console.error("Update failed:", err);
                  },
                })
              !changes?.changed&&history.push(
                `/${window.contextPath}/employee/campaign/app-configuration-redesign?variant=app&masterName=${AppConfigSchema}&fieldType=AppFieldTypeOne&prefix=${campaignNumber}&localeModule=APPONE&tenantId=${tenantId}&campaignNumber=${campaignNumber}&formId=default&projectType=${projectType}`
              );
            }}
          />,
        ]}
      />
    </>
  );
};

export default AppFeatures;
