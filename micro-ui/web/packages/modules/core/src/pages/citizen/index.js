import { BackLink, CitizenHomeCard, CitizenInfoLabel } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundaries";
import { AppHome, processLinkData } from "../../components/Home";
import TopBarSideBar from "../../components/TopBarSideBar";
import StaticCitizenSideBar from "../../components/TopBarSideBar/SideBar/StaticCitizenSideBar";
import ImageComponent from "../../components/ImageComponent";
import { lazyWithFallback } from "@egovernments/digit-ui-components";
import DynamicModuleLoader from "../../components/DynamicModuleLoader";

// Create lazy components with fallbacks using the utility
const ErrorComponent = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-error-component" */ "../../components/ErrorComponent"),
  () => require("../../components/ErrorComponent").default,
  { loaderText: "Loading Error Component..." }
);

const FAQsSection = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-faqs" */ "./FAQs/FAQs"),
  () => require("./FAQs/FAQs").default,
  { loaderText: "Loading FAQs..." }
);

const CitizenHome = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-home" */ "./Home"),
  () => require("./Home").default,
  { loaderText: "Loading Home..." }
);

const LanguageSelection = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-language-selection" */ "./Home/LanguageSelection"),
  () => require("./Home/LanguageSelection").default,
  { loaderText: "Loading Language Selection..." }
);

const LocationSelection = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-location-selection" */ "./Home/LocationSelection"),
  () => require("./Home/LocationSelection").default,
  { loaderText: "Loading Location Selection..." }
);

const UserProfile = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-user-profile" */ "./Home/UserProfile"),
  () => require("./Home/UserProfile").default,
  { loaderText: "Loading User Profile..." }
);

const HowItWorks = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-how-it-works" */ "./HowItWorks/howItWorks"),
  () => require("./HowItWorks/howItWorks").default,
  { loaderText: "Loading How It Works..." }
);

const Login = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-login" */ "./Login"),
  () => require("./Login").default,
  { loaderText: "Loading Login..." }
);

const Search = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-search" */ "./SearchApp"),
  () => require("./SearchApp").default,
  { loaderText: "Loading Search..." }
);

const StaticDynamicCard = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-static-dynamic-card" */ "./StaticDynamicComponent/StaticDynamicCard"),
  () => require("./StaticDynamicComponent/StaticDynamicCard").default,
  { loaderText: "Loading Dynamic Content..." }
);

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
  sourceUrl, // This prop seems unused, consider removing
  pathname, // This prop seems unused, `useLocation().pathname` is used directly
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
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickOnWhatsApp = (obj) => {
    window.open(obj);
  };

  const hideSidebar = sidebarHiddenFor.some((e) => window.location.href.includes(e));

  // Create app routes with dynamic module loading and loading states for citizen modules
  const appRoutes = modules.map(({ code, tenants }, index) => {
    return (
      <Route
        key={index}
        path={`${code.toLowerCase()}/*`}
        element={
          <DynamicModuleLoader
            moduleCode={code}
            stateCode={stateCode}
            userType="citizen"
            tenants={getTenants(tenants, appTenants)}
            maxRetries={3}
            retryDelay={1000}
            initialDelay={800}
          />
        }
      />
    );
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
      <React.Fragment key={code + "-routes"}>
        <Route path={`${code.toLowerCase()}-home`} element={
          <div className="moduleLinkHomePage">
            <ImageComponent src={bannerImage || stateInfo?.bannerUrl} alt="noimagefound" />
            <BackLink className="moduleLinkHomePageBackButton" onClick={() => navigate(-1)} />
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
            </div>
            <StaticDynamicCard moduleCode={code?.toUpperCase()} />
          </div>
        } />
        <Route path={`${code.toLowerCase()}-faq`} element={<FAQsSection module={code?.toUpperCase()} />} />
        <Route path={`${code.toLowerCase()}-how-it-works`} element={<HowItWorks module={code?.toUpperCase()} />} />
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

        <Routes>
          <Route path="/" element={<CitizenHome />} />

          <Route path="select-language" element={<LanguageSelection />} />

          <Route path="select-location" element={<LocationSelection />} />

          <Route path="error" element={
            <ErrorComponent
              initData={initData}
              goToHome={() => {
                navigate(`/${window?.contextPath}/${Digit?.UserService?.getType?.()}`);
              }}
            />
          } />

          <Route path="all-services" element={
            <AppHome
              userType="citizen"
              modules={modules}
              getCitizenMenu={linkData}
              fetchedCitizen={isLinkDataFetched}
              isLoading={islinkDataLoading}
            />
          } />

          <Route path="login/*" element={<Login stateCode={stateCode} />} />

          <Route path="register/*" element={<Login stateCode={stateCode} isUserRegistered={false} />} />

          <Route path="user/profile" element={<UserProfile stateCode={stateCode} userType={"citizen"} cityDetails={cityDetails} />} />

          <Route path="Audit" element={<Search />} />

          {/* Dynamic App Routes and Module Level Link Home Pages */}
          {appRoutes}
          {ModuleLevelLinkHomePages}
        </Routes>
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