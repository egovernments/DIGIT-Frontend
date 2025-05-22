import { Card, HeaderComponent, Button, Toggle, Footer, Loader } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { SVG } from "@egovernments/digit-ui-components";
import getMDMSUrl from "../../../utils/getMDMSUrl";

const AppFeatures = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const url = getMDMSUrl(true);
  const searchParams = new URLSearchParams(location.search);
  const initialCode = searchParams.get("code");
  const AppConfigSchema = "SimpleAppConfiguration";

  const [code, setCode] = useState(initialCode);

  const projectType = searchParams.get("projectType");
  const campaignNumber = searchParams.get("campaignNumber");
  const tenantId = searchParams.get("tenantId");
  const [selectedModule, setSelectedModule] = useState(null);

  const [selectedModuleCodes, setSelectedModuleCodes] = useState(() => {
    return Digit?.SessionStorage.get("SelectedFeaturesByModule") || {};
  });

  function updateUrlParams(params) {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url);
  }

  const { isLoading: productTypeLoading, data: modulesData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "AppModuleSchema" }],
    {
      select: (data) => {
        return data?.[CONSOLE_MDMS_MODULENAME]?.AppModuleSchema;
      },
    },
    { schemaCode: `${"CONSOLE_MDMS_MODULENAME"}.AppModuleSchema` }
  );

  const reqCriteriaMDMSSearch = {
    url: `${url}/v2/_search`,
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        schemaCode: `${CONSOLE_MDMS_MODULENAME}.${AppConfigSchema}`,
      },
    },
    config: {
      enabled: true,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading, data: mdmsData, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteriaMDMSSearch);

  const filteredFlows = mdmsData?.mdms?.filter((entry) => entry?.data?.project?.includes(campaignNumber));

  useEffect(() => {
    if (!selectedModule && filteredFlows?.length > 0) {
      setSelectedModule(filteredFlows[0]);
    }
  }, [filteredFlows]);

  const onToggleSelect = (selectedCode) => {
    updateUrlParams({ code: selectedCode });
    setCode(selectedCode);
    // Find selectedModule in filteredFlows by matching flow.data.name === selectedCode
    const selectedFlow = filteredFlows?.find((flow) => flow?.data?.name === selectedCode);
    setSelectedModule(selectedFlow);
  };

  const selectedModuleName = selectedModule?.data?.name;

  // Get features from AppModuleSchema
  const selectedModuleFeatures = modulesData?.find((mod) => mod?.code === selectedModuleName)?.features || [];

  const handleSelectModule = (featureCode) => {
    setSelectedModuleCodes((prev) => {
      const updated = { ...prev };
      const currentModule = code;

      const currentFeatures = updated[currentModule] || [];

      if (currentFeatures?.includes(featureCode)) {
        updated[currentModule] = currentFeatures.filter((f) => f !== featureCode);
      } else {
        updated[currentModule] = [...currentFeatures, featureCode];
      }

      Digit?.SessionStorage.set("SelectedFeaturesByModule", updated);
      return updated;
    });
  };

  // Prepare toggle options for selected modules
  const toggleOptions = filteredFlows?.map((flow) => ({
    code: flow?.data?.name,
    name: t(flow?.data?.name),
  }));

  if (productTypeLoading || isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <>
      <div>
        <HeaderComponent className="campaign-header-style">{t(`HCM_CHOOSE_FEATURE_FOR_APP`)}</HeaderComponent>
        <Toggle
          name="toggleOptions"
          numberOfToggleItems={toggleOptions?.length}
          onChange={function noRefCheck() {}}
          onSelect={onToggleSelect}
          options={toggleOptions || []}
          optionsKey="code"
          selectedOption={code}
          type="toggle"
        />
      </div>
      <div className="modules-container">
        {selectedModuleFeatures?.map((feature, index) => (
          <Card className={`module-card ${selectedModuleCodes?.[code]?.includes(feature?.code) ? "selected-card" : ""}`}>
            {selectedModuleCodes?.[code]?.includes(feature?.code) && (
              <SVG.CheckCircle
                fill={"#00703C"}
                width={"3rem"}
                height={"3rem"}
                style={{
                  position: "absolute",
                  left: "-10px",
                  top: "-14px",
                }}
              />
            )}
            <HeaderComponent className={`detail-header ${selectedModuleCodes?.[code]?.includes(feature?.code) ? "selected-header" : ""}`}>
              {t(feature?.code)}
            </HeaderComponent>
            <hr style={{ border: "1px solid #e0e0e0", width: "100%", margin: "0.5rem 0" }} />
            <p style={{ margin: "0rem" }}>{t(feature.description)}</p>
            <Button
              className={"campaign-module-button"}
              type={"button"}
              size={"large"}
              variation={selectedModuleCodes?.[code]?.includes(feature?.code) ? "secondary" : "primary"}
              label={selectedModuleCodes?.[code]?.includes(feature?.code) ? t("DESELECT") : t("ES_CAMPAIGN_SELECT")}
              onClick={() => handleSelectModule(feature?.code)}
            />
          </Card>
        ))}
      </div>
      <Footer
        actionFields={[
          <Button
            label={t("GO_BACK")}
            title={t("GO_BACK")}
            icon="ArrowBack"
            variation="secondary"
            style={{
              marginLeft: "2.5rem",
            }}
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
            isSuffix={true}
            variation="primary"
            onClick={() => {
              history.push(
                `/${window.contextPath}/employee/campaign/app-configuration-redesign?variant=app&masterName=${AppConfigSchema}&fieldType=AppFieldTypeOne&prefix=${campaignNumber}&localeModule=APPONE&tenantId=${tenantId}&campaignNumber=${campaignNumber}`
              );
            }}
          />,
        ]}
      />
    </>
  );
};

export default AppFeatures;
