import {
  CitizenHomeCard,
  CitizenInfoLabel,
  Loader,
} from "@egovernments/digit-ui-react-components";

import { BackLink, CustomSVG ,LandingPageWrapper } from "@egovernments/digit-ui-components";

import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RoleBasedEmployeeHome } from "./RoleBasedEmployeeHome";
import QuickSetupConfigComponent from "../pages/employee/QuickStart/Config";
import WhatsAppNotificationPopup from "./Dialog/WhatsAppNotificationPopup";

/* 
Feature :: Citizen All service screen cards
*/
export const processLinkData = (newData, code, t) => {
  const obj = newData?.[`${code}`];
  if (obj) {
    obj.map((link) => {
      if (Digit.Utils.getMultiRootTenant()) {
        link["navigationURL"] = link["navigationURL"].replace("/sandbox-ui/citizen", `/sandbox-ui/${Digit.ULBService.getStateId()}/citizen`);
      }
      link.link = link["navigationURL"];
      link.i18nKey = t(link["name"]);

    });
  }
  const newObj = {
    links: obj?.reverse(),
    header: Digit.Utils.locale.getTransformedLocale(`ACTION_TEST_${code}`),
    iconName: `CITIZEN_${code}_ICON`,
  };
  if (code === "FSM") {
    const roleBasedLoginRoutes = [
      {
        role: "FSM_DSO",
        from: `/${window?.contextPath}/citizen/fsm/dso-dashboard`,
        dashoardLink: "CS_LINK_DSO_DASHBOARD",
        loginLink: "CS_LINK_LOGIN_DSO",
      },
    ];
    //RAIN-7297
    roleBasedLoginRoutes.map(({ role, from, loginLink, dashoardLink }) => {
      if (Digit.UserService.hasAccess(role))
        newObj?.links?.push({
          link: from,
          i18nKey: t(dashoardLink),
        });
      else
        newObj?.links?.push({
          link: `/${window?.contextPath}/citizen/login`,
          state: { role: "FSM_DSO", from },
          i18nKey: t(loginLink),
        });
    });
  }

  return newObj;
};
const iconSelector = (code) => {
  switch (code) {
    case "PT":
      return <CustomSVG.PTIcon className="fill-path-primary-main" />;
    case "WS":
      return <CustomSVG.WSICon className="fill-path-primary-main" />;
    case "FSM":
      return <CustomSVG.FSMIcon className="fill-path-primary-main" />;
    case "MCollect":
      return <CustomSVG.MCollectIcon className="fill-path-primary-main" />;
    case "PGR":
      return <CustomSVG.PGRIcon className="fill-path-primary-main" />;
    case "TL":
      return <CustomSVG.TLIcon className="fill-path-primary-main" />;
    case "OBPS":
      return <CustomSVG.OBPSIcon className="fill-path-primary-main" />;
    case "Bills":
      return <CustomSVG.BillsIcon className="fill-path-primary-main" />;
    default:
      return <CustomSVG.PTIcon className="fill-path-primary-main" />;
  }
};
const CitizenHome = ({
  modules,
  getCitizenMenu,
  fetchedCitizen,
  isLoading,
}) => {
  const paymentModule = modules.filter(({ code }) => code === "Payment")[0];
  const moduleArr = modules.filter(({ code }) => code !== "Payment");
  const moduleArray = [paymentModule, ...moduleArr];
  const { t } = useTranslation();

  const userInfo = Digit.UserService.getUser()?.info || {};
  const isLoggedIn = !!Digit.UserService.getUser()?.access_token;
  const tenant = Digit.ULBService.getCurrentTenantId();
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const stateLvlTenantId = isMultiRootTenant
    ? Digit.ULBService.getCurrentTenantId()
    : window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
  const moduleName = Digit?.Utils?.getConfigModuleName?.() || "commonUiConfig";

  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);

  // Check if user preferences feature is enabled
  const { data: enableUserPreferences } = Digit.Hooks.useCustomMDMS(
    stateLvlTenantId,
    moduleName,
    [{ name: "UserPreferencesConfig" }],
    {
      select: (data) => data?.[moduleName]?.UserPreferencesConfig?.[0]?.enableUserPreferences,
    },
    { schemaCode: `${moduleName}.UserPreferencesConfig` }
  );

  // Search existing preference to check if WhatsApp is already opted in
  const { data: preferenceData, isLoading: isPreferenceLoading } = Digit.Hooks.useCustomAPIHook({
    url: "/user-preference/v1/_search",
    body: {
      criteria: {
        userId: userInfo?.uuid,
        tenantId: tenant,
        preferenceCode: "USER_NOTIFICATION_PREFERENCES",
      },
    },
    changeQueryName: "whatsapp_popup_preference_search",
    config: {
      enabled: !!userInfo?.uuid && isLoggedIn && !!enableUserPreferences,
      select: (data) => data?.preferences?.[0],
      cacheTime: 0,
      staleTime: 0,
    },
  });

  useEffect(() => {
    if (!isLoggedIn || !enableUserPreferences || isPreferenceLoading) return;
    const alreadyShown = sessionStorage.getItem("whatsapp_popup_shown");
    if (alreadyShown) return;

    const whatsappStatus = preferenceData?.payload?.consent?.WHATSAPP?.status;
    // Show popup only if WhatsApp is not already GRANTED
    if (whatsappStatus !== "GRANTED") {
      setShowWhatsAppPopup(true);
    }
  }, [isLoggedIn, enableUserPreferences, isPreferenceLoading, preferenceData]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {showWhatsAppPopup && <WhatsAppNotificationPopup onClose={() => setShowWhatsAppPopup(false)} />}
      <div className="citizen-all-services-wrapper">
        {location.pathname.includes(
          "sanitation-ui/citizen/all-services"
        ) || (location.pathname.includes("sandbox-ui") && location.pathname.includes("all-services")) ? null : (
          <BackLink onClick={() => window.history.back()}/>
        )}
        <div className="citizenAllServiceGrid">
          {moduleArray
            .filter((mod) => mod)
            .map(({ code }, index) => {
              let mdmsDataObj;
              if (fetchedCitizen)
                mdmsDataObj = fetchedCitizen
                  ? processLinkData(getCitizenMenu, code, t)
                  : undefined;
              if (mdmsDataObj?.links?.length > 0) {
                return (
                  <CitizenHomeCard
                    header={t(mdmsDataObj?.header)}
                    links={mdmsDataObj?.links
                      ?.filter((ele) => ele?.link)
                      ?.sort((x, y) => x?.orderNumber - y?.orderNumber)}
                    Icon={() => iconSelector(code)}
                    Info={
                      code === "OBPS"
                        ? () => (
                          <CitizenInfoLabel
                            style={{ margin: "0px", padding: "10px" }}
                            info={t("CS_FILE_APPLICATION_INFO_LABEL")}
                            text={t(
                              `BPA_CITIZEN_HOME_STAKEHOLDER_INCLUDES_INFO_LABEL`
                            )}
                          />
                        )
                        : null
                    }
                    isInfo={code === "OBPS" ? true : false}
                  />
                );
              } else return <React.Fragment />;
            })}
        </div>
      </div>
    </React.Fragment>
  );
};

const EmployeeHome = ({ modules, additionalComponent }) => {
  return (
    <>
      <div className="employee-app-container digit-home-employee-app">
        {/* <div className="ground-container moduleCardWrapper gridModuleWrapper digit-home-moduleCardWrapper"> */}
        <LandingPageWrapper>
          {modules?.map(({ code }, index) => {
            const Card =
              Digit.ComponentRegistryService.getComponent(`${code}Card`) ||
              (() => <React.Fragment />);
            return <Card key={index} />;
          })}
          </LandingPageWrapper>
        {/* </div> */}
      </div>

      {additionalComponent &&
        additionalComponent?.length > 0 &&
        additionalComponent.map((i) => {
          const Component =
            typeof i === "string"
              ? Digit.ComponentRegistryService.getComponent(i)
              : null;
          return Component ? (
            <div className="additional-component-wrapper">
              <Component />
            </div>
          ) : null;
        })}
    </>
  );
};

export const AppHome = ({
  userType,
  modules,
  getCitizenMenu,
  fetchedCitizen,
  isLoading,
  additionalComponent,
}) => {
  if (userType === "citizen") {
    return (
      <CitizenHome
        modules={modules}
        getCitizenMenu={getCitizenMenu}
        fetchedCitizen={fetchedCitizen}
        isLoading={isLoading}
      />
    );
  }
  const isSuperUserWithMultipleRootTenant = Digit.UserService.hasAccess("SUPERUSER") && Digit.Utils.getMultiRootTenant()
  // Check if URL contains 'sandbox-ui' for subtenant behavior
  const isSandboxUI = location.pathname.includes('sandbox-ui');

  // Set margin-top: 3rem if isSandboxUI is true and isSuperUserWithMultipleRootTenant is false, otherwise 6rem
  const marginTopValue = (!isSuperUserWithMultipleRootTenant && isSandboxUI) ? "2rem" : "6rem";

  return Digit.Utils.getRoleBasedHomeCard() ? (
    <div className={isSuperUserWithMultipleRootTenant ? "homeWrapper" : ""} style={{"marginTop": marginTopValue}}>
      <RoleBasedEmployeeHome modules={modules} additionalComponent={additionalComponent} />
      {isSuperUserWithMultipleRootTenant && !window.Digit.Utils.browser.isMobile() ? <QuickSetupConfigComponent /> : null}
    </div>
  ) : (
    <EmployeeHome modules={modules} additionalComponent={additionalComponent} />
  );
};
