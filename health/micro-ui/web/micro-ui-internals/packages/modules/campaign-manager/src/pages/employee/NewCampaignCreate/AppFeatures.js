import { Card, HeaderComponent, Button, Toggle, Footer } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { SVG } from "@egovernments/digit-ui-components";

const AppFeatures = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  // const tenantId = Digit.ULBService.getCurrentTenantId();
  const searchParams = new URLSearchParams(location.search);
  const initialCode = searchParams.get("code");
  // const [code, setCode] = useState(initialCode);
  const [code, setCode] = useState(() => {
    const storedModules = Digit?.SessionStorage.get("SelectedModules");
    return Array.isArray(storedModules) && storedModules.length > 0 ? storedModules[0] : "";
  });
  const projectType = searchParams.get("projectType");
  const campaignNumber = searchParams.get("campaignNumber");
  const tenantId = searchParams.get("tenantId");
  // const [selectedModuleCodes, setSelectedModuleCodes] = useState([]);
  const [selectedModuleCodes, setSelectedModuleCodes] = useState(() => {
  return Digit?.SessionStorage.get("SelectedFeaturesByModule") || {};
});

  const [selectedFeaturesByModule, setSelectedFeaturesByModule] = useState(() => {
    return Digit?.SessionStorage.get("SelectedFeaturesByModule") || {};
  });

  const [sessionModuleCodes, setSessionModuleCodes] = useState(() => {
    const storedModules = Digit?.SessionStorage.get("SelectedModules");
    return Array.isArray(storedModules) ? storedModules : [];
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
    [{ name: "BaseConfigs" }],
    {
      select: (data) => {
        console.log("datasaa", data);
        return data?.[CONSOLE_MDMS_MODULENAME]?.BaseConfigs;
      },
    },
    { schemaCode: `${"CONSOLE_MDMS_MODULENAME"}.BaseConfigs` }
  );

  // const handleSelectModule = (moduleCode) => {
  //   if (selectedModuleCodes.includes(moduleCode)) {
  //     setSelectedModuleCodes((prev) => prev.filter((code) => code !== moduleCode));
  //   } else {
  //     setSelectedModuleCodes((prev) => [...prev, moduleCode]);
  //   }
  // };

  const handleSelectModule = (featureCode) => {
    setSelectedModuleCodes((prev) => {
      const updated = { ...prev };
      const currentModule = code;

      const currentFeatures = updated[currentModule] || [];

      if (currentFeatures.includes(featureCode)) {
        updated[currentModule] = currentFeatures.filter((f) => f !== featureCode);
      } else {
        updated[currentModule] = [...currentFeatures, featureCode];
      }

      Digit?.SessionStorage.set("SelectedFeaturesByModule", updated);
      return updated;
    });
  };

  console.log("modulesData", modulesData, sessionModuleCodes, code);

  const filteredModules = modulesData?.filter((mod) => sessionModuleCodes.includes(mod.name));

  console.log("filtered", filteredModules);

  // Prepare toggle options for selected modules
  const toggleOptions = filteredModules?.map((mod) => ({
    code: mod.name,
    name: t(mod.name), // or mod.name if no translation available
  }));

  return (
    <>
      <div>
        <HeaderComponent className="campaign-header-style">{t(`HCM_CHOOSE_FEATURE_FOR_APP`)}</HeaderComponent>
        <Toggle
          name="toggleOptions"
          numberOfToggleItems={toggleOptions?.length}
          onChange={function noRefCheck() {}}
          onSelect={(d) => {
            updateUrlParams({ code: d });
            setCode(d);
          }}
          options={toggleOptions || []}
          optionsKey="code"
          selectedOption={code}
          type="toggle"
        />
      </div>
      <div className="modules-container">
        {filteredModules
          ?.filter((mod) => mod.name === code)
          ?.flatMap((mod) => mod.features || [])
          ?.map((feature, index) => (
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
              <p style={{ margin: "0rem" }}>{t(feature.DESC)}</p>
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
            variation="primary"
            onClick={() => {
              history.push(
                `/${window.contextPath}/employee/campaign/app-configuration-redesign?variant=app&masterName=SimplifiedAppConfig4&fieldType=${campaignNumber}&prefix=APPONE&localeModule=APPONE&tenantId=${tenantId}`
              );
            }}
          />,
        ]}
      />
    </>
  );
};

export default AppFeatures;
