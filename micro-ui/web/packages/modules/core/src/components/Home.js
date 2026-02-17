import {
  CitizenHomeCard,
  CitizenInfoLabel,
  Loader,
} from "@egovernments/digit-ui-react-components";

import { BackLink, CustomSVG, SVG, LandingPageWrapper, Card, Divider } from "@egovernments/digit-ui-components";

import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { RoleBasedEmployeeHome } from "./RoleBasedEmployeeHome";
import QuickSetupConfigComponent from "../pages/employee/QuickStart/Config";

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
import { useNavigate } from "react-router-dom";

// Inside CitizenHome component
const CitizenHome = ({ getCitizenMenu, fetchedCitizen, isLoading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = window.Digit.Utils.browser.isMobile();

  if (isLoading || !fetchedCitizen || !getCitizenMenu) {
    return <Loader />;
  }

  const parentModules = Object.keys(getCitizenMenu);

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    navigate(link);
  };

  

  const handleNavigate = (link) => {
    if (!link) return;
    link?.includes(`${window?.contextPath}/`) ? navigate(link) : (window.location.href = link);
  };
  console.log(SVG.AddExpense, "SVG.AddExpense");

  const renderApplyIcon = () => (
    <SVG.AddExpense fill="#C84C0E" width="1.25rem" height="1.25rem" className="digit-button-customIcon medium teritiary" />
  );

  const renderMyAppIcon = () => (
    <SVG.ListAlt fill="#C84C0E" width="1.25rem" height="1.25rem" className="digit-button-customIcon medium teritiary" />
  );

  const isApplyLink = (link) => {
    const name = (link.name || link.displayName || "").toLowerCase();
    return name.includes("apply") || name.includes("_apply");
  };
  

  // Desktop: LandingPageWrapper + custom cards with icons (same grid as employee)
  if (!isMobile) {
    const children = parentModules.map((code) => {
      const mdmsDataObj = processLinkData(getCitizenMenu, code, t);

      if (!mdmsDataObj?.links?.length) return null;

      const seenLinks = new Set();
      const dedupedLinks = mdmsDataObj.links
        ?.filter((ele) => ele?.link)
        ?.sort((x, y) => x?.orderNumber - y?.orderNumber)
        .filter((link) => {
          const key = link.link;
          if (seenLinks.has(key)) return false;
          seenLinks.add(key);
          return true;
        });

      return (
        <Card key={code} className="digit-landing-page-card" style={{ borderRadius: "1rem" }}>
          <div className="icon-module-header">
            <div className="digit-landingpagecard-icon">
              <CustomSVG.Devices fill="#C84C0E" width="1rem" height="1rem" />
            </div>
            <div className="ladingcard-moduleName" role="heading" aria-level="2">
              {t(mdmsDataObj?.header)}
            </div>
          </div>
          <Divider className="digit-landingpage-divider" variant="small" />
          {dedupedLinks.map((link, i) => {
            const LinkIcon = link.leftIcon && link.leftIcon !== "TLIcon" && CustomSVG[link.leftIcon] ? CustomSVG[link.leftIcon] : null;
            return (
              <button
                key={i}
                className="digit-button-teritiary medium"
                type="button"
                style={{ padding: "0px" }}
                onClick={() => handleNavigate(link.link)}
              >
                <div className="icon-label-container teritiary medium">
                  {LinkIcon ? <LinkIcon fill="#C84C0E" width="1.25rem" height="1.25rem" className="digit-button-customIcon medium teritiary" /> : (isApplyLink(link) ? renderApplyIcon() : renderMyAppIcon())}
                  <h2 className="digit-button-label">{link.i18nKey}</h2>
                </div>
              </button>
            );
          })}
        </Card>
      );
    }).filter(Boolean);

    return (
      <div className="citizen-all-services-wrapper">
        <div className="employee-app-container digit-home-employee-app">
          <LandingPageWrapper>{children}</LandingPageWrapper>
        </div>
      </div>
    );
  }

  // Mobile: Original vertical card layout
  return (
    <div className="citizen-all-services-wrapper">
      {location.pathname.includes(
          "sanitation-ui/citizen/all-services"
        ) || (location.pathname.includes("sandbox-ui") && location.pathname.includes("all-services")) ? null : (
          <BackLink onClick={() => window.history.back()}/>
        )}
      <div className="citizenAllServiceGrid">
        {parentModules.map((code) => {
          const mdmsDataObj = processLinkData(getCitizenMenu, code, t);

          if (mdmsDataObj?.links?.length > 0) {
            return (
              <div className="CitizenHomeCard" key={code}>
                <div className="header">
                  <h2>{t(mdmsDataObj?.header)}</h2>
                  {iconSelector(code)}
                </div>
                <div className="links">
                  {mdmsDataObj?.links
                    ?.filter((ele) => ele?.link)
                    ?.sort((x, y) => x?.orderNumber - y?.orderNumber)
                    .map((link, i) => (
                      <div className="linksWrapper" key={i}>
                        <a
                          href={link.link}
                          onClick={(e) => handleLinkClick(e, link.link)}
                        >
                          {link.i18nKey}
                        </a>
                      </div>
                    ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
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
  return Digit.Utils.getRoleBasedHomeCard() ? (
    <div className={isSuperUserWithMultipleRootTenant ? "homeWrapper" : ""}>
      <RoleBasedEmployeeHome modules={modules} additionalComponent={additionalComponent} />
      {isSuperUserWithMultipleRootTenant && !window.Digit.Utils.browser.isMobile() ? <QuickSetupConfigComponent /> : null}
    </div>
  ) : (
    <EmployeeHome modules={modules} additionalComponent={additionalComponent} />
  );
};
