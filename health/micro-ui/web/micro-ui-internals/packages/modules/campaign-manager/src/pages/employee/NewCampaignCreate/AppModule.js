import { Card, HeaderComponent, Button, Footer, Loader, Toast, TextBlock } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { SVG } from "@egovernments/digit-ui-components";
import getMDMSUrl from "../../../utils/getMDMSUrl";

export const TEMPLATE_BASE_CONFIG_MASTER = "TemplateBaseConfig";

const AppModule = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const campaignType = searchParams.get("projectType");
  const tenantId = searchParams.get("tenantId");
  const [selectedModuleCodes, setSelectedModuleCodes] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const locale = Digit?.SessionStorage.get("initData")?.selectedLanguage || "en_IN";
  const AppConfigSchema = "SimpleAppConfiguration";
  const url = getMDMSUrl(true);
  const [isCreatingModule, setIsCreatingModule] = useState(false);

  const schemaCode = `${CONSOLE_MDMS_MODULENAME}.${TEMPLATE_BASE_CONFIG_MASTER}`;
  const { isLoading: productTypeLoading, data: modulesData } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV2Criteria(
      tenantId,
      schemaCode,
      {
        project: campaignType,
      },
      `MDMSDATA-${schemaCode}-${campaignType}`,
      {
        enabled: !!campaignType,
      }
    )
  );

  const handleSelectModule = (moduleCode) => {
    if (selectedModuleCodes.includes(moduleCode)) {
      setSelectedModuleCodes((prev) => prev.filter((code) => code !== moduleCode));
    } else {
      setSelectedModuleCodes((prev) => [...prev, moduleCode]);
    }
  };

  const schemaCodeForAppConfig = `${CONSOLE_MDMS_MODULENAME}.${AppConfigSchema}`;
  const { isLoading, data: mdmsData } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV2Criteria(
      tenantId,
      schemaCodeForAppConfig,
      {
        project: campaignNumber,
      },
      `MDMSDATA-${schemaCodeForAppConfig}-${campaignNumber}`,
      {
        enabled: !!campaignNumber,
      }
    )
  );

  React.useEffect(() => {
    if (mdmsData) {
      const createdModules = mdmsData
        .filter((item) => item?.uniqueIdentifier?.includes(campaignNumber))
        .map((item) => item?.uniqueIdentifier?.split(".")?.[1]) // extract module code
        .filter(Boolean);

      setSelectedModuleCodes(createdModules); // preselect those modules
    }
  }, [mdmsData, campaignNumber]);

  const closeToast = () => {
    setShowToast(null);
  };

  const handleNext = async () => {
    const uniqueModules = [...new Set(selectedModuleCodes)];

    if (uniqueModules.length === 0) {
      setShowToast({ key: "error", label: t("SELECT_ATLEAST_ONE_MODULE") });
      return;
    }

    const alreadyCreatedModules =
      mdmsData
        ?.filter((item) => item?.uniqueIdentifier?.includes(campaignNumber))
        ?.map((item) => item?.uniqueIdentifier?.split(".")?.[1])
        ?.filter(Boolean) || [];

    const newModulesToCreate = uniqueModules.filter((code) => !alreadyCreatedModules.includes(code));

    if (newModulesToCreate.length === 0) {
      navigate(
        `/${window.contextPath}/employee/campaign/app-features?tenantId=${tenantId}&campaignNumber=${campaignNumber}&projectType=${campaignType}`
      );
      return;
    }

    const selectedModules = modulesData?.filter((module) => newModulesToCreate.includes(module?.data?.name));
    const baseProjectType = campaignType.toLowerCase();
    const localisationModules = newModulesToCreate.map((code) => `hcm-base-${code.toLowerCase()}-${baseProjectType}`).join(",");

    let localisationData = null;
    try {
      localisationData = await Digit.CustomService.getResponse({
        url: `/localization/messages/v1/_search`,
        params: {
          locale,
          module: localisationModules,
          tenantId,
        },
      });
    } catch (e) {
      console.error("Failed to fetch localisation data", e);
      setShowToast({ key: "error", label: t("LOCALISATION_FETCH_ERROR") });
      return;
    }

    for (const module of selectedModules) {
      const baseModuleKey = `hcm-base-${module?.data?.name.toLowerCase()}-${baseProjectType}`;
      const updatedModuleName = `hcm-${module?.data?.name.toLowerCase()}-${campaignNumber}`;

      const filteredLocalizations = localisationData?.messages?.filter((entry) => entry.module === baseModuleKey);

      const updatedLocalizations =
        filteredLocalizations?.map((entry) => ({
          ...entry,
          module: updatedModuleName,
        })) || [];
      if (updatedLocalizations.length > 0) {
        try {
          setIsCreatingModule(true);
          await Digit.CustomService.getResponse({
            url: `/localization/messages/v1/_upsert`,
            body: {
              tenantId,
              messages: updatedLocalizations,
            },
          });
        } catch (error) {
          console.error(`Failed to upsert localization for ${module?.data?.name}:`, error);
          setShowToast({ key: "error", label: t("LOCALISATION_ERROR") });
          return;
        } finally {
          setIsCreatingModule(false); // Stop loading
        }
      }

      const moduleWithProject = {
        ...module?.data,
        project: `${campaignNumber}`,
      };

      try {
        const schemaCode = `${CONSOLE_MDMS_MODULENAME}.${AppConfigSchema}`;
        setIsCreatingModule(true);
        await Digit.CustomService.getResponse({
          url: `${url}/v2/_create/${schemaCode}`,
          body: {
            Mdms: {
              tenantId,
              schemaCode: schemaCode,
              data: moduleWithProject,
            },
          },
        });
      } catch (error) {
        console.error(`Failed to create module for ${module?.data?.name}:`, error);
        setShowToast({ key: "error", label: t("HCM_MDMS_DATA_UPSERT_ERROR") });
        return;
      } finally {
        setIsCreatingModule(false); // Stop loading
      }
    }

    navigate(
      `/${window.contextPath}/employee/campaign/app-features?tenantId=${tenantId}&campaignNumber=${campaignNumber}&projectType=${campaignType}&code=${selectedModules?.[0]?.data?.name}`
    );
  };

  if (productTypeLoading || isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <>
      <div>
        <HeaderComponent className="campaign-header-style">{t(`HCM_CHOOSE_MODULE`)}</HeaderComponent>
        <TextBlock body="" caption={t("CMP_DRAWER_WHAT_IS_MODULE_APP_CONFIG_SCREEN")} header="" captionClassName="camp-drawer-caption" subHeader="" />
      </div>
      {isCreatingModule && <Loader page={true} variant={"OverlayLoader"} loaderText={t("COPYING_CONFIG_FOR_SELECTED_MODULES")} />}
      <div className="modules-container">
        {modulesData
          ?.sort((x, y) => x?.data?.order - y?.data?.order)
          // ?.filter((module) => module?.data?.isDisabled === "false")
          .map((module, index) => (
            <Card className={`module-card ${selectedModuleCodes.includes(module?.data?.name) ? "selected-card" : ""}`}>
              {selectedModuleCodes.includes(module?.data?.name) && (
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
              <HeaderComponent className={`detail-header ${selectedModuleCodes.includes(module?.data?.name) ? "selected-header" : ""}`}>
                {t(module?.data?.name)}
              </HeaderComponent>
              <hr style={{ border: "1px solid #e0e0e0", width: "100%", margin: "0.5rem 0" }} />
              <p className="module-description">{t(`HCM_MODULE_DESCRIPTION_${campaignType?.toUpperCase()}_${module?.data?.name?.toUpperCase()}`)}</p>
              {/* <p style={{ margin: "0rem" }}> {t(`HCM_MODULE_DESCRIPTION_${campaignType?.toUpperCase()}_${module?.data?.name?.toUpperCase()}`)}</p> */}
              <Button
                className={"campaign-module-button"}
                type={"button"}
                size={"large"}
                isDisabled={module?.data?.disabled}
                variation={selectedModuleCodes.includes(module?.data?.name) ? "secondary" : "primary"}
                label={selectedModuleCodes.includes(module?.data?.name) ? t("DESELECT") : t("ES_CAMPAIGN_SELECT")}
                onClick={() => handleSelectModule(module?.data?.name)}
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
              navigate(`/${window.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}`);
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
