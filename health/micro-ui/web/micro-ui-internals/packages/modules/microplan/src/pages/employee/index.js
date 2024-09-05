import { AppContainer, BreadCrumb, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React,{useEffect} from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import SetupMicroplan from "./SetupMicroplan";
import { useMyContext } from "../../utils/context";

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
  const { isLoading: isLoadingMdmsMicroplanData, data:MicroplanMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "hcm-microplanning",
    [
      { name: "MicroplanNamingConvention" },
      { name: "MicroplanNamingRegx" },
      { name: "resourceDistributionStrategy"}
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
      </AppContainer>
    </Switch>
  );
};

export default App;
