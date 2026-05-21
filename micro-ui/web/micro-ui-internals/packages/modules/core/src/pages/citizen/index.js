import { BackLink, CitizenHomeCard, CitizenInfoLabel } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundaries";
import ErrorComponent from "../../components/ErrorComponent";
import { AppHome, processLinkData } from "../../components/Home";
import TopBarSideBar from "../../components/TopBarSideBar";
import StaticCitizenSideBar from "../../components/TopBarSideBar/SideBar/StaticCitizenSideBar";
import FAQsSection from "./FAQs/FAQs";
import CitizenHome from "./Home";
import LanguageSelection from "./Home/LanguageSelection";
import LocationSelection from "./Home/LocationSelection";
import UserProfile from "./Home/UserProfile";
import HowItWorks from "./HowItWorks/howItWorks";
import Login from "./Login";
import Search from "./SearchApp";
import StaticDynamicCard from "./StaticDynamicComponent/StaticDynamicCard";
import ImageComponent from "../../components/ImageComponent";

const sidebarHiddenFor = [
  `${window?.contextPath}/citizen/register/name`,
  `/${window?.contextPath}/citizen/select-language`,
  `/${window?.contextPath}/citizen/select-location`,
  `/${window?.contextPath}/citizen/login`,
  `/${window?.contextPath}/citizen/register/otp`,
];

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes.map((item) => item.code).includes(tenant.code));
};

const Home = ({
  stateInfo,
  userDetails,
  CITIZEN,
  cityDetails,
  mobileView,
  handleUserDropdownSelection,
  logoUrl,
  DSO,
  stateCode,
  modules,
  appTenants,
  sourceUrl,
  pathname,
  initData,
}) => {
  const { isLoading: islinkDataLoading, data: linkData, isFetched: isLinkDataFetched } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getStateId(),
    "ACCESSCONTROL-ACTIONS-TEST",
    [
      {
        name: "actions-test",
        filter: `[?(@.url == '${Digit.Utils.getMultiRootTenant() ? window.globalPath : window.contextPath}-card')]`,
      },
    ],
    {
      select: (data) => {
        const formattedData = data?.["ACCESSCONTROL-ACTIONS-TEST"]?.["actions-test"]
          ?.filter((el) => el.enabled === true)
          .reduce((a, b) => {
            a[b.parentModule] = a[b.parentModule]?.length > 0 ? [b, ...a[b.parentModule]] : [b];
            return a;
          }, {});
        return formattedData;
      },
    }
  );
  const classname = Digit.Hooks.useRouteSubscription(pathname);
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const isMultiRootTenant = Digit.Utils.getMultiRootTenant();
  const fromSandbox = new URLSearchParams(location.search).get("from") === "sandbox";
  const _user = Digit.UserService.getUser();
  const isLoggedIn = _user && _user.access_token && _user.info;
  const sandboxLangSelectionPath = (() => {
    if (!fromSandbox) return null;
    const segs = location.pathname.split("/");
    const citIdx = segs.indexOf("citizen");
    const urlTenant = citIdx > 0 ? segs[citIdx - 1] : null;
    const userTenant = _user?.info?.tenantId;
    const isTenantMismatch = isLoggedIn && urlTenant && userTenant && userTenant !== urlTenant;
    if (!isLoggedIn || isTenantMismatch) return `/${window?.globalPath}/user/login`;
    return null;
  })();

  // Manual tenant-slug edit guard on the citizen login URL. When the address bar
  // looks like `/sandbox-ui/<urlTenant>/citizen/login?from=/sandbox-ui/<fromTenant>/...`
  // and urlTenant differs from fromTenant, the user has hand-edited the tenant slug.
  // Bounce them to the global sandbox login so they pick a tenant the normal way.
  React.useEffect(() => {
    if (!isMultiRootTenant) return;
    if (!location.pathname.includes("/citizen/login")) return;
    if (!window?.globalPath) return;
    const segs = location.pathname.split("/");
    const citIdx = segs.indexOf("citizen");
    const urlTenant = citIdx > 0 ? segs[citIdx - 1] : null;
    if (!urlTenant || urlTenant === window.globalPath) return;
    const fromParam = new URLSearchParams(location.search).get("from") || "";
    if (!fromParam) return;
    let fromTenant = null;
    try {
      const decoded = decodeURIComponent(fromParam);
      const prefix = `/${window.globalPath}/`;
      if (decoded.startsWith(prefix)) {
        const rest = decoded.substring(prefix.length);
        const slash = rest.indexOf("/");
        fromTenant = slash > 0 ? rest.substring(0, slash) : null;
      }
    } catch (e) {}
    if (fromTenant && urlTenant !== fromTenant) {
      window.location.replace(`/${window.globalPath}/user/login`);
    }
  }, [location.pathname, location.search, isMultiRootTenant]);

  const handleClickOnWhatsApp = (obj) => {
    window.open(obj);
  };

  const hideSidebar = sidebarHiddenFor.some((e) => window.location.href.includes(e));
  const appRoutes = modules.map(({ code, tenants }, index) => {
    const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
    return Module ? (
      <Route key={index} path={`${path}/${code.toLowerCase()}`}>
        <Module stateCode={stateCode} moduleCode={code} userType="citizen" tenants={getTenants(tenants, appTenants)} />
      </Route>
    ) : null;
  });

  const ModuleLevelLinkHomePages = modules.map(({ code, bannerImage }, index) => {
    let Links = Digit.ComponentRegistryService.getComponent(`${code}Links`) || (() => <React.Fragment />);
    let mdmsDataObj = isLinkDataFetched ? processLinkData(linkData, code, t) : undefined;

    if (mdmsDataObj?.header === "ACTION_TEST_WS") {
      mdmsDataObj?.links.sort((a, b) => {
        return b.orderNumber - a.orderNumber;
      });
    }
    return (
      <React.Fragment>
        <Route key={index} path={`${path}/${code.toLowerCase()}-home`}>
          <div className="moduleLinkHomePage">
            <ImageComponent src={bannerImage || stateInfo?.bannerUrl} alt="noimagefound" />

            <BackLink className="moduleLinkHomePageBackButton" onClick={() => window.history.back()} />
            <h1>{t("MODULE_" + code.toUpperCase())}</h1>
            <div className="moduleLinkHomePageModuleLinks">
              {mdmsDataObj && (
                <CitizenHomeCard
                  header={t(mdmsDataObj?.header)}
                  links={mdmsDataObj?.links}
                  Icon={() => <span />}
                  Info={
                    code === "OBPS"
                      ? () => (
                          <CitizenInfoLabel
                            style={{ margin: "0px", padding: "10px" }}
                            info={t("CS_FILE_APPLICATION_INFO_LABEL")}
                            text={t(`BPA_CITIZEN_HOME_STAKEHOLDER_INCLUDES_INFO_LABEL`)}
                          />
                        )
                      : null
                  }
                  isInfo={code === "OBPS" ? true : false}
                />
              )}
              {/* <Links key={index} matchPath={`/digit-ui/citizen/${code.toLowerCase()}`} userType={"citizen"} /> */}
            </div>
            <StaticDynamicCard moduleCode={code?.toUpperCase()} />
          </div>
        </Route>
        <Route key={"faq" + index} path={`${path}/${code.toLowerCase()}-faq`}>
          <FAQsSection module={code?.toUpperCase()} />
        </Route>
        <Route key={"hiw" + index} path={`${path}/${code.toLowerCase()}-how-it-works`}>
          <HowItWorks module={code?.toUpperCase()} />
        </Route>
      </React.Fragment>
    );
  });

  return (
    <div className={classname}>
      <TopBarSideBar
        t={t}
        stateInfo={stateInfo}
        userDetails={userDetails}
        CITIZEN={CITIZEN}
        cityDetails={cityDetails}
        mobileView={mobileView}
        handleUserDropdownSelection={handleUserDropdownSelection}
        logoUrl={logoUrl}
        showSidebar={CITIZEN ? true : false}
        linkData={linkData}
        islinkDataLoading={islinkDataLoading}
      />

      <div className={`main center-container citizen-home-container mb-25`}>
        {hideSidebar ? null : (
          <div className="SideBarStatic">
            <StaticCitizenSideBar linkData={linkData} islinkDataLoading={islinkDataLoading} />
          </div>
        )}

        <Switch>
          <Route exact path={path}>
            <CitizenHome />
          </Route>

          <Route exact path={`${path}/select-language`}>
            <LanguageSelection />
          </Route>

          <Route exact path={`${path}/select-location`}>
            <LocationSelection />
          </Route>
          <Route path={`${path}/error`}>
            <ErrorComponent
              initData={initData}
              goToHome={() => {
                history.push(`/${window?.contextPath}/${Digit?.UserService?.getType?.()}`);
              }}
            />
          </Route>
          <Route path={`${path}/all-services`}>
            <AppHome
              userType="citizen"
              modules={modules}
              getCitizenMenu={linkData}
              fetchedCitizen={isLinkDataFetched}
              isLoading={islinkDataLoading}
            />
          </Route>

          <Route path={`${path}/login`}>
            {sandboxLangSelectionPath ? <Redirect to={sandboxLangSelectionPath} /> : <Login stateCode={stateCode} />}
          </Route>

          <Route path={`${path}/register`}>
            <Login stateCode={stateCode} isUserRegistered={false} />
          </Route>

          <Route path={`${path}/user/profile`}>
            <UserProfile stateCode={stateCode} userType={"citizen"} cityDetails={cityDetails} />
          </Route>

          <Route path={`${path}/Audit`}>
            <Search />
          </Route>
          <ErrorBoundary initData={initData}>
            {appRoutes}
            {ModuleLevelLinkHomePages}
          </ErrorBoundary>
        </Switch>
      </div>
      <div className="citizen-home-footer" style={window.location.href.includes("citizen/obps") ? { zIndex: "-1" } : {}}>
        <ImageComponent
          alt="Powered by DIGIT"
          src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER")}
          style={{ height: "1.2em", cursor: "pointer" }}
          onClick={() => {
            window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
          }}
        />
      </div>
    </div>
  );
};

export default Home;
