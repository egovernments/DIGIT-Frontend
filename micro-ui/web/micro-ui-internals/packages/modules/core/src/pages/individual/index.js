import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useHistory, Redirect, useRouteMatch } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundaries";
import ErrorComponent from "../../components/ErrorComponent";
import Program from "./pages";
import { Dropdown, TopBar } from "@egovernments/digit-ui-components";
import GoogleTranslateComponent from "./components/GoogleTranslateComponent";

// import CitizenHome from "./Home";
// import LanguageSelection from "./Home/LanguageSelection";
// import LocationSelection from "./Home/LocationSelection";
// import UserProfile from "./Home/UserProfile";
// import Login from "./Login";

const IndividualApp = ({
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
  const classname = Digit.Hooks.useRouteSubscription(pathname);
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const history = useHistory();
  const [formData, setFormData] = React.useState("en");
  return (
    <div className={"employee"}>
      <ErrorBoundary initData={initData}>
        <Switch>
          <Route path={path}>
            <div
              className={"loginContainer"}
              style={{ "--banner-url": `url(${window?.globalConfigs?.getConfig?.("HOME_BACKGROUND")})`, padding: "0px" }}
            >
              <div className="banner banner-container">
                <TopBar
                  className=""
                  img=""
                  language={formData}
                  logo=""
                  actionFields={[
                    <Dropdown
                      customSelector="Language"
                      option={[{name:"English",code:"en"},{name:"हिन्दी",code:"hi"},{name:"Français",code:"fr"},{name:"Español",code:"es"}]}
                      optionKey="name"
                      select={(updated)=>setFormData(updated?.code)}
                      theme="light"
                      value={formData}
                    />,
                  ]}
                  props={{}}
                  showDeafultImg
                  style={{}}
                  theme="light"
                  ulb="My Scheme"
                />
                <Program path={path}></Program>
              </div>
            </div>
          </Route>
          <Route path={`${path}/error`}>
            <ErrorComponent
              initData={initData}
              goToHome={() => {
                history.push(`/${window?.contextPath}/${Digit?.UserService?.getType?.()}`);
              }}
            />
          </Route>
        </Switch>
      </ErrorBoundary>
     <GoogleTranslateComponent pageLanguage= {formData}></GoogleTranslateComponent>
      <div className="employee-login-home-footer" style={{ backgroundColor: "unset" }}>
        <img
          alt="Powered by DIGIT"
          src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER_BW")}
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
          }}
        />
      </div>
    </div>
  );
};

export default IndividualApp;
