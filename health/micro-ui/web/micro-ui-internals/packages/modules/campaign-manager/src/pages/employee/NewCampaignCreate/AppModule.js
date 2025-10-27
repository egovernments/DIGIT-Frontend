import { Card, HeaderComponent, Button, Footer, Loader, Toast, TextBlock } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import React, { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import { SVG } from "@egovernments/digit-ui-components";
import getMDMSUrl from "../../../utils/getMDMSUrl";
import { HCMCONSOLE_APPCONFIG_MODULENAME } from "./CampaignDetails";
import EqualHeightWrapper from "../../../components/CreateCampaignComponents/WrapperModuleCard";

export const TEMPLATE_BASE_CONFIG_MASTER = "FormConfigTemplate";
//TODO @bhavya @jagan Cleanup and handle negative scenarios for unselect etc remove isSelected and make changes in the mdms v2
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
  const AppConfigSchema = HCMCONSOLE_APPCONFIG_MODULENAME;
  const url = getMDMSUrl(true);
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { languages, stateInfo } = storeData || {};
  const locales = languages?.map((locale) => locale.value);

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
        cacheTime: 1000000,
        staleTime: 1000000,
      }
    )
  );

  const { data: allowedModules } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "AllowedModules",
      },
    ],
    { select: (MdmsRes) => MdmsRes?.["HCM-ADMIN-CONSOLE"]?.AllowedModules?.[0] },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.AllowedModules` }
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
        cacheTime: 0,
        staleTime: 0,
      }
    )
  );

  useEffect(() => {
    if (mdmsData) {
      const createdModules = mdmsData
        .filter((item) => item?.uniqueIdentifier?.includes(campaignNumber) && item?.data?.isSelected === true)
        .map((item) => item?.data?.name) // extract module code
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

    const areAllowedModulesPresent = allowedModules?.allowedModule.every((module) => uniqueModules.includes(module));

    if (!areAllowedModulesPresent) {
      setShowToast({
        key: "error",
        label: `${t("HCM_MANDATORY_MODULES")} ${allowedModules?.allowedModule.map((m) => t(m)).join(", ")}`,
      });
      return;
    }

    const alreadyCreatedModules =
      mdmsData
        ?.filter((item) => item?.uniqueIdentifier?.includes(campaignNumber))
        ?.map((item) => item?.data?.name)
        ?.filter(Boolean) || [];

    const newModulesToCreate = uniqueModules.filter((code) => !alreadyCreatedModules.includes(code));

    const needsUpdate = (mdmsData || []).some((item) => {
      const moduleCode = item?.data?.name;
      const shouldBeSelected = uniqueModules.includes(moduleCode);
      return item?.data?.isSelected !== shouldBeSelected;
    });

    if (newModulesToCreate.length === 0 && !needsUpdate) {
      history.push(
        `/${window.contextPath}/employee/campaign/app-features?tenantId=${tenantId}&campaignNumber=${campaignNumber}&projectType=${campaignType}`
      );
      return;
    }

    // Step 1: Update selection flags in MDMS
    for (const item of mdmsData || []) {
      const moduleCode = item?.data?.name;
      const shouldBeSelected = uniqueModules.includes(moduleCode);
      if (item?.data?.isSelected === shouldBeSelected) continue;

      const updatedData = {
        ...item,
        data: {
          ...item.data,
          isSelected: shouldBeSelected,
        },
      };

      try {
        const schemaCode = `${CONSOLE_MDMS_MODULENAME}.${AppConfigSchema}`;
        setIsCreatingModule(true);
        await Digit.CustomService.getResponse({
          url: `${url}/v2/_update/${schemaCode}`,
          body: {
            Mdms: {
              tenantId,
              schemaCode,
              ...updatedData,
            },
          },
        });
      } catch (error) {
        console.error(`Failed to update module ${moduleCode}:`, error);
        setShowToast({ key: "error", label: t("HCM_MDMS_DATA_UPDATE_ERROR") });
        return;
      } finally {
        setIsCreatingModule(false);
      }
    }

    // Step 2: Create modules and handle localization
    const selectedModules = modulesData?.filter((module) => newModulesToCreate.includes(module?.data?.name));
    const baseProjectType = campaignType.toLowerCase();

    for (const module of selectedModules) {
      const moduleName = module?.data?.name?.toLowerCase();
      const baseModuleKey = `hcm-base-${moduleName}-${baseProjectType}`;
      const updatedModuleKey = `hcm-${moduleName}-${campaignNumber}`;

      for (const loc of locales) {
        let localisationData = null;
        try {
          setIsCreatingModule(true);
          localisationData = await Digit.CustomService.getResponse({
            url: `/localization/messages/v1/_search`,
            params: {
              locale: loc,
              module: baseModuleKey,
              tenantId,
            },
          });
        } catch (e) {
          console.error(`Failed to fetch localisation for locale ${loc}`, e);
          setShowToast({ key: "error", label: t("LOCALISATION_FETCH_ERROR") });
          return;
        } finally {
          setIsCreatingModule(false);
        }

        const updatedLocalizations =
          localisationData?.messages?.map((entry) => ({
            ...entry,
            locale: loc,
            module: updatedModuleKey,
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
            console.error(`Failed to upsert localization for ${moduleName} (${loc}):`, error);
            setShowToast({ key: "error", label: t("LOCALISATION_ERROR") });
            return;
          } finally {
            setIsCreatingModule(false);
          }
        }
      }

      // Step 3: Create the final module in MDMS
      const moduleWithProject = {
        ...module?.data,
        project: `${campaignNumber}`,
        isSelected: true,
      };

      // try {
      //   const schemaCode = `${CONSOLE_MDMS_MODULENAME}.${AppConfigSchema}`;
      //   setIsCreatingModule(true);
      //   await Digit.CustomService.getResponse({
      //     url: `${url}/v2/_create/${schemaCode}`,
      //     body: {
      //       Mdms: {
      //         tenantId,
      //         schemaCode,
      //         data: moduleWithProject,
      //       },
      //     },
      //   });
      // } catch (error) {
      //   console.error(`Failed to create module for ${moduleName}:`, error);
      //   setShowToast({ key: "error", label: t("HCM_MDMS_DATA_UPSERT_ERROR") });
      //   return;
      // } finally {
      //   setIsCreatingModule(false);
      // }
    }

    history.push(
      `/${window.contextPath}/employee/campaign/app-features?tenantId=${tenantId}&campaignNumber=${campaignNumber}&projectType=${campaignType}&code=${selectedModules?.[0]?.data?.name}`
    );
  };

  if (productTypeLoading || isLoading || mdmsData?.length == 0) {
    return <Loader page={true} variant={"OverlayLoader"} loaderText={t("SAVING_FEATURES_CONFIG_IN_SERVER")} />;
  }

  return (
    <>
      <div>
        <HeaderComponent className="campaign-header-module-style" style={{ marginBottom: "1rem" }}>
          {t(`HCM_CHOOSE_MODULE`)}
        </HeaderComponent>
        <TextBlock body="" caption={t("CMP_DRAWER_WHAT_IS_MODULE_APP_CONFIG_SCREEN")} header="" captionClassName="camp-drawer-caption" subHeader="" />
      </div>
      {isCreatingModule && <Loader page={true} variant={"OverlayLoader"} loaderText={t("COPYING_CONFIG_FOR_SELECTED_MODULES")} />}
      <EqualHeightWrapper deps={[modulesData]}>
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
                <p className="module-description">
                  {t(`HCM_MODULE_DESCRIPTION_${campaignType?.toUpperCase()}_${module?.data?.name?.toUpperCase()}`)}
                </p>
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
      </EqualHeightWrapper>
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
            icon={"ArrowBack"}
          />,
          <Button label={t("NEXT")} title={t("NEXT")} variation="primary" icon={"ArrowDirection"} isSuffix onClick={handleNext} />,
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
