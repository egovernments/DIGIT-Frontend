import React, { useEffect } from "react";
import { Switch, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer, BreadCrumb } from "@egovernments/digit-ui-react-components";
import MicroplanningHeader from "../../components/MicroplanningHeader";
import Upload from "./Upload";
import Hypothesis from "./Hypothesis";
import RuleEngine from "./RuleEngine";
import Guidelines from "./Guidelines";
import CreateMicroplan from "./CreateMicroplan";

const MicroplanningBreadCrumb = ({ location ,defaultPath}) => {
  const { t } = useTranslation();
  const pathVar=location.pathname.replace(defaultPath+'/',"").split("?")?.[0];
  const {masterName,moduleName,uniqueIdentifier} = Digit.Hooks.useQueryParams()



  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("Home"),
      show: true,
    },
    {
      path: `/${window.contextPath}/employee/upload`,
      content:  t(`UPLOAD`) ,
      show: pathVar.includes("upload")?true: false,
    },
    {
      path: `/${window.contextPath}/employee/hypothesis`,
      content:  t(`HYPOTHESIS`) ,
      show: pathVar.includes("hypothesis")?true: false,
    },
    {
      path: `/${window.contextPath}/employee/rule-engine`,
      content:  t(`RULE_ENGINE`) ,
      show: pathVar.includes("rule-engine")?true: false,
    },
    {
      path: `/${window.contextPath}/employee/create-microplan`,
      content:  t(`CREATE_MICROPLAN`) ,
      show: pathVar.includes("create-microplan")?true: false,
    }
    
  ];
  return <BreadCrumb className="workbench-bredcrumb" crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

const App = ({ path }) => {
  const location = useLocation();
  const MDMSCreateSession = Digit.Hooks.useSessionStorage("MDMS_add", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = MDMSCreateSession;
  
  const MDMSViewSession = Digit.Hooks.useSessionStorage("MDMS_view", {});
  const [sessionFormDataView,setSessionFormDataView,clearSessionFormDataView] = MDMSViewSession

  useEffect(() => {
    if (!window.location.href.includes("mdms-add-v2") && sessionFormData && Object.keys(sessionFormData) != 0) {
      clearSessionFormData();
    }
    if (!window.location.href.includes("mdms-view") && sessionFormDataView ) {
      clearSessionFormDataView();
    }
  }, [location]);

  return (
    <React.Fragment>
      <div className="wbh-header-container">
        <MicroplanningBreadCrumb location={location} defaultPath={path} />
        <MicroplanningHeader />
      </div>
      <Switch>
        <AppContainer className="workbench">
          <PrivateRoute path={`${path}/upload`} component={() => <Upload parentRoute={path}/>} />
          <PrivateRoute path={`${path}/hypothesis`} component={() => <Hypothesis parentRoute={path}/>} />
          <PrivateRoute path={`${path}/rule-engine`} component={() => <RuleEngine parentRoute={path}/>} />
          <PrivateRoute path={`${path}/help-guidelines`} component={() => <Guidelines parentRoute={path}/>} />

          <PrivateRoute path={`${path}/create-microplan`} component={() => <CreateMicroplan parentRoute={path}/>} />
          
        </AppContainer>
      </Switch>
    </React.Fragment>
  );
};

export default App;
