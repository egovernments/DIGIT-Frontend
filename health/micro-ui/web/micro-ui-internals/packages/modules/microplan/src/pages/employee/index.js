import { AppContainer, BreadCrumb, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React,{useEffect} from "react";
import { useTranslation } from "react-i18next";
import { Switch,useLocation } from "react-router-dom";
import SetupMicroplan from "./SetupMicroplan";
import { useMyContext } from "../../utils/context";
import MicroplanSearch from "./MicroplanSearch";
import SummaryScreen from "./SummaryScreen";
import Sample from "./Sample";
import FormulaConfiguration from "../../components/FormulaConfig";
import SummaryScreen2 from "./SummaryScreen2";
import SummaryScreen3 from "./SummaryScreen3";


const bredCrumbStyle={ maxWidth: "min-content" };
const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      path: `/${window?.contextPath}/employee`,
      content: t(location.pathname.split("/").pop()),
      show: true,
    },
  ];
  return <BreadCrumb crumbs={crumbs} spanStyle={bredCrumbStyle} />;
};

const App = ({ path, stateCode, userType, tenants }) => {
  const { dispatch } = useMyContext();
  const location = useLocation();
  //destroying session
  useEffect(() => {
    const pathVar = location.pathname.replace(`${path}/`, "").split("?")?.[0];
    Digit.Utils.microplanv1.destroySessionHelper(pathVar, ["setup-microplan"], "MICROPLAN_DATA");
  }, [location]);


  const { isLoading: isLoadingMdmsMicroplanData, data:MicroplanMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "hcm-microplanning",
    [
      { name: "MicroplanNamingConvention" },
      { name: "MicroplanNamingRegx" },
      { name: "ResourceDistributionStrategy"},
      { name:  "HypothesisAssumptions"}  

    ],
    {
      cacheTime:Infinity,
      select:(data) => {
        dispatch({
          type: "SETINITDATA",
          state: {
            ...data?.["hcm-microplanning"],
          },
        });
      }
    },
    {schemaCode:"BASE_MASTER_DATA"} //mdmsv2
  );
  

  if(isLoadingMdmsMicroplanData){
    return <Loader />
  }

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
         <PrivateRoute path={`${path}/setup-microplan`} component={() => <SetupMicroplan />} />
         <PrivateRoute path={`${path}/microplan-search`} component={() => <MicroplanSearch></MicroplanSearch>} /> 
         <PrivateRoute path={`${path}/summary-screen`} component={() => <SummaryScreen></SummaryScreen>} />
         <PrivateRoute path={`${path}/sample`} component={() => <Sample></Sample>} />
         <PrivateRoute path={`${path}/summary-screen1`} component={() => <SummaryScreen2></SummaryScreen2>} />
         <PrivateRoute path={`${path}/summary-screen2`} component={() => <SummaryScreen3></SummaryScreen3>} />





      </AppContainer>
    </Switch>
  );
};

export default App;
