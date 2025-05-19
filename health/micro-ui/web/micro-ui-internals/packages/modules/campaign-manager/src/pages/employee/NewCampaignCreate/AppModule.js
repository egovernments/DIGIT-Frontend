import { Card, HeaderComponent, Button, Footer, Loader, Toast } from "@egovernments/digit-ui-components";
import { ArrowForward } from "@egovernments/digit-ui-svg-components";
import { useTranslation } from "react-i18next";
import React, { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { SVG } from "@egovernments/digit-ui-components";
import getMDMSUrl from "../../../utils/getMDMSUrl";
const AppModule = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const campaignType = searchParams.get("projectType");
  const tenantId = searchParams.get("tenantId");
  const [selectedModuleCodes, setSelectedModuleCodes] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const AppConfigSchema = "SimplifiedAppConfig4";

  const { isLoading: productTypeLoading, data: modulesData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "BaseConfigs" }],
    {
      select: (data) => {
        console.log("data", data);
        return data?.[CONSOLE_MDMS_MODULENAME]?.BaseConfigs;
      },
    },
    { schemaCode: `${"CONSOLE_MDMS_MODULENAME"}.BaseConfigs` }
  );

  const handleSelectModule = (moduleCode) => {
    if (selectedModuleCodes.includes(moduleCode)) {
      setSelectedModuleCodes((prev) => prev.filter((code) => code !== moduleCode));
    } else {
      setSelectedModuleCodes((prev) => [...prev, moduleCode]);
    }
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const handleNext = async () => {
    // Filter only the selected modules from modulesData
    const selectedModules = modulesData.filter((module) => selectedModuleCodes.includes(module.name));
    const baseProjectType = campaignType?.split("-")?.[0]?.toLowerCase();
    const localisationModules = selectedModuleCodes.map((moduleCode) => `hcm-base-${moduleCode.toLowerCase()}-${baseProjectType}`).join(",");
    if (selectedModules?.length === 0) {
      setShowToast({ key: "error", label: t("SELECT_ATLEAST_ONE_MODULE") });
      return;
    }

    let localisationData = null;
    try {
      localisationData = await Digit.CustomService.getResponse({
        url: `/localization/messages/v1/_search`,
        params: {
          locale: locale,
          module: localisationModules,
          tenantId: tenantId,
        },
      });
    } catch (e) {
      console.error("Failed to fetch localisation data", e);
      setShowToast({ key: "error", label: t("LOCALISATION_FETCH_ERROR") });
      return;
    }

    for (const module of selectedModules) {
      const baseModuleKey = `hcm-base-${module.name.toLowerCase()}-${baseProjectType}`;
      const updatedModuleName = `hcm-${module.name.toLowerCase()}-${campaignNumber}`;

      const filteredLocalizations = localisationData?.messages?.filter((entry) => entry.module === baseModuleKey);
      const updatedLocalizations =
        filteredLocalizations?.map((entry) => ({
          ...entry,
          module: updatedModuleName,
        })) || [];

      if (updatedLocalizations.length > 0) {
        try {
          const response = await Digit.CustomService.getResponse({
            url: `/localization/messages/v1/_upsert`,
            body: {
              tenantId,
              messages: updatedLocalizations,
            },
          });
          console.info(`Localization upserted for ${module.name}:`, response);
        } catch (error) {
          setShowToast({ key: "error", label: t("LOCALISATION_ERROR") });
          console.error(`Failed to upsert localization for ${module.name}:`, error);
          return;
        }
      }

      const moduleWithProject = {
        ...module,
        project: `${module.name}_${campaignNumber}`,
      };

      try {
        const url = getMDMSUrl(true);
        const response = await Digit.CustomService.getResponse({
          url: `${url}/v2/_create/Workbench.UISchema`,
          body: {
            Mdms: {
              tenantId: tenantId,
              schemaCode: `${CONSOLE_MDMS_MODULENAME}.${AppConfigSchema}`,
              data: moduleWithProject,
            },
          },
        });

        console.info(`Created module for ${module.name}:`, response);
      } catch (error) {
        setShowToast({ key: "error", label: t("HCM_MDMS_DATA_UPSERT_ERROR") });
        console.error(`Failed to create module for ${module.name}:`, error);
        return;
      }
    }

    history.push(
      `/${window.contextPath}/employee/campaign/app-configuration-redesign?variant=app&masterName=SimplifiedAppConfig4&fieldType=${campaignNumber}&prefix=APPONE&localeModule=APPONE&tenantId=${tenantId}`
    );
  };

  if (productTypeLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <>
      <div>
        <HeaderComponent className="campaign-header-style">{t(`HCM_CHOOSE_MODULE`)}</HeaderComponent>
      </div>
      <div className="modules-container">
        {modulesData?.map((module, index) => (
          <Card className={`module-card ${selectedModuleCodes.includes(module?.name) ? "selected-card" : ""}`}>
            {selectedModuleCodes.includes(module?.name) && (
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
            <HeaderComponent className={`detail-header ${selectedModuleCodes.includes(module?.name) ? "selected-header" : ""}`}>
              {t(module.name)}
            </HeaderComponent>
            <hr style={{ border: "1px solid #e0e0e0", width: "100%", margin: "0.5rem 0" }} />
            <p style={{ margin: "0rem" }}> {t(`HCM_MODULE_DESCRIPTION_${campaignType?.toUpperCase()}_${module?.name?.toUpperCase()}`)}</p>
            <Button
              className={"campaign-module-button"}
              type={"button"}
              size={"large"}
              variation={selectedModuleCodes.includes(module?.name) ? "secondary" : "primary"}
              label={selectedModuleCodes.includes(module?.name) ? t("DESELECT") : t("ES_CAMPAIGN_SELECT")}
              onClick={() => handleSelectModule(module?.name)}
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
              history.push(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}`);
            }}
          />,
          <Button label={t("NEXT")} title={t("NEXT")} variation="primary" onClick={handleNext} />,
        ]}
      />
      {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
        />
      )}
    </>
  );
};

export default AppModule;
