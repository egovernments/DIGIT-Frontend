import { useMemo } from "react";
import { Card, HeaderComponent, Loader, SVG, Button, Footer } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CONSOLE_MDMS_MODULENAME } from "../../../Module";
import EqualHeightWrapper from "../../../components/CreateCampaignComponents/WrapperModuleCard";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";
import { getCampaignDeliveryMethods, getDeliveryMethods } from "../../../utils/deliveryMethods";

const NewAppModule = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const campaignNumber = searchParams.get("campaignNumber");
  const projectType = searchParams.get("projectType");
  const tenantId = searchParams.get("tenantId");
  const viewMode = searchParams.get("viewMode") === "true";

  const schemaCode = `${CONSOLE_MDMS_MODULENAME}.FormConfig`;
  const { isLoading, data: mdmsData } = Digit.Hooks.useCustomAPIHook(
    Digit.Utils.campaign.getMDMSV2Criteria(
      tenantId,
      schemaCode,
      {
        project: campaignNumber,
      },
      `MDMSDATA-${schemaCode}-${campaignNumber}`,
      {
        enabled: !!campaignNumber,
        cacheTime: 0,
        staleTime: 0,
      }
    )
  );

  // The campaign type declares its delivery strategies, each of which may name the app module it
  // belongs to. Read here to build the module-to-strategy lookup used by isModuleEnabled below.
  const { data: projectTypeMdms } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    { enabled: !!projectType },
    { schemaCode: "HCM-PROJECT-TYPES.projectTypes" }
  );

  const { data: campaignData } = Digit.Hooks.useCustomAPIHook({
    url: `/project-factory/v1/project-type/search`,
    body: { CampaignDetails: { tenantId, campaignNumber } },
    config: {
      enabled: !!campaignNumber,
      cacheTime: 0,
      staleTime: 0,
      select: (d) => d?.CampaignDetails?.[0],
    },
  });

  // Which app module belongs to which delivery strategy.
  //
  // A strategy names its module through `appModule`. Where the module is named after the strategy
  // itself the code is also registered directly, so a campaign type whose module and strategy
  // share a name needs no `appModule` entry at all.
  const moduleToMethod = useMemo(() => {
    const record = projectTypeMdms?.MdmsRes?.["HCM-PROJECT-TYPES"]?.projectTypes?.find((e) => e?.code === projectType);
    return getDeliveryMethods(record).reduce((acc, method) => {
      if (!method?.code) return acc;
      acc[method.code] = method.code;
      if (method.appModule) acc[method.appModule] = method.code;
      return acc;
    }, {});
  }, [projectTypeMdms, projectType]);

  const chosenMethods = useMemo(() => getCampaignDeliveryMethods(campaignData), [campaignData]);

  /**
   * A module that belongs to a delivery strategy can only be configured when that strategy was
   * chosen for the campaign. Modules that no strategy claims - which is every module for a
   * campaign type that declares no strategies - are left entirely to their own `active` flag.
   */
  const isModuleEnabled = (moduleName, active) => {
    if (active !== true) return false;
    const requiredMethod = moduleToMethod?.[moduleName];
    if (!requiredMethod) return true;
    return chosenMethods.includes(requiredMethod);
  };

  /**
   * Whether a module is disabled because the delivery strategy it belongs to was not chosen.
   *
   * A card can be disabled for two different reasons and the user needs to be able to tell them
   * apart: a module that MDMS has not switched on is not available to anyone yet, whereas this one
   * is available and simply not part of this campaign. Used for wording only - whether the card is
   * disabled at all is decided by isModuleEnabled above.
   */
  const isStrategyNotSelected = (moduleName, active) => {
    if (active !== true) return false;
    const requiredMethod = moduleToMethod?.[moduleName];
    return !!requiredMethod && !chosenMethods.includes(requiredMethod);
  };

  // Sort mdmsData by order
  const sortedMdmsData = mdmsData?.slice().sort((a, b) => {
    const orderA = a?.data?.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b?.data?.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  const handleCardClick = (moduleName, version) => {
    navigate(
      `/${window.contextPath}/employee/campaign/app-config-init?campaignNumber=${campaignNumber}&flow=${moduleName}&version=${version}${viewMode ? "&viewMode=true" : ""}`
    );
  };

  if (isLoading) {
    // Page loader (nothing renders behind it) - OverlayLoader also brings the library's 6-dot animation
    return <Loader page={true} variant={"PageLoader"} loaderText={t(I18N_KEYS.CAMPAIGN_CREATE.LOADING_MODULE)} />;
  }

  return (
    <div className="app-modules-select-wrapper">
      <div>
        <HeaderComponent className="campaign-header-module-style" style={{ marginBottom: "1rem" }}>
          {t(I18N_KEYS.PAGES.HCM_CHOOSE_MODULE)}
        </HeaderComponent>
      </div>
      <EqualHeightWrapper deps={[sortedMdmsData]}>
        <div className="modules-container">
          {sortedMdmsData?.map((item, index) => {
            const isActive = isModuleEnabled(item?.data?.name, item?.data?.active);
            const isVisited = item?.data?.version > 1;

            // Checked before the configured states on purpose: a module whose strategy was removed
            // may well have been configured earlier, and offering to edit configuration that is no
            // longer part of the campaign would be misleading.
            const buttonLabel = isStrategyNotSelected(item?.data?.name, item?.data?.active)
              ? t(I18N_KEYS.CAMPAIGN_CREATE.STRATEGY_NOT_SELECTED_MODULE)
              : viewMode && isVisited
              ? t(I18N_KEYS.CAMPAIGN_CREATE.VIEW_CONFIGURATION)
              : isVisited
              ? t(I18N_KEYS.CAMPAIGN_CREATE.EDIT_CONFIGURATION)
              : isActive
              ? t(I18N_KEYS.CAMPAIGN_CREATE.CONFIGURE_MODULE)
              : t(I18N_KEYS.CAMPAIGN_CREATE.UPCOMING_MODULE);

            return (
              <Card
                key={item?.id || index}
                className={`module-card ${isActive ? "selected-card" : ""}`}
                onClick={() => {}}
                id={`setup-mobile-app-card-${item?.data?.name}`}
                style={{
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {isVisited && (
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
                <HeaderComponent className={`detail-header ${isActive ? "selected-header" : ""}`}>{t(item?.data?.name)}</HeaderComponent>
                <hr style={{ border: "1px solid #D6D5D4", width: "100%", margin: "0" }} />
                <p className="module-description">{item?.data?.description || t(`MODULE_DESCRIPTION_${item?.data?.name}`)}</p>

                {/* The edit icon and the primary styling both follow the button being usable, so a
                    module that was configured earlier but is disabled now does not invite a click. */}
                <Button
                  type="button"
                  size="medium"
                  variation={isVisited ? "secondary" : isActive ? "primary" : "secondary"}
                  icon={isVisited && !viewMode && isActive ? "Edit" : null}
                  className={`campaign-module-button ${isActive ? "primaryButton" : "secondButton"}`}
                  label={buttonLabel}
                  title={buttonLabel}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    if (isActive) {
                      // Handle button click for allowed modules
                      handleCardClick(item?.data?.name, item?.data?.version);
                    }
                  }}
                  isDisabled={!isActive}
                  id={`setup-mobile-app-card-${item?.data?.name}`}
                  style={{
                    marginTop: "1rem",
                    width: "100%",
                  }}
                />
              </Card>
            );
          })}
        </div>
      </EqualHeightWrapper>
      <Footer
        actionFields={[
          <Button
            icon="ArrowBack"
            label={t(I18N_KEYS.COMMON.GO_BACK)}
            title={t(I18N_KEYS.COMMON.GO_BACK)}
            onClick={() => {
              // Handle back navigation - could go to module selection or previous screen
              navigate(`/${window?.contextPath}/employee/campaign/view-details?campaignNumber=${campaignNumber}&tenantId=${tenantId}`);
            }}
            type="button"
            variation="secondary"
            style={{
              marginLeft: "4rem",
              minWidth: "12.5rem",
            }}
          />,
        ]}
        maxActionFieldsAllowed={5}
      />
    </div>
  );
};

export default NewAppModule;
