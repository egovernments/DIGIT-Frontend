import { AppContainer, BreadCrumb, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import SetupMicroplan from "./SetupMicroplan";
import { useMyContext } from "../../utils/context";
import MicroplanSearch from "./MicroplanSearch";
import SummaryScreen from "./SummaryScreen";
import Table from "./sample1";
import Sample from "./sample";

const bredCrumbStyle = { maxWidth: "min-content" };
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
  const { t } = useTranslation();
  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Age', accessor: 'age' },
    { Header: 'Country', accessor: 'country' },
  ];

  const data = [
    { name: 'John', age: 28, country: 'USA' },
    { name: 'Jane', age: 22, country: 'Canada' },
    { name: 'Paul', age: 36, country: 'UK' },
  ];
  const { dispatch } = useMyContext();
  const { isLoading: isLoadingMdmsMicroplanData, data: MicroplanMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "hcm-microplanning",
    [
      { name: "MicroplanNamingConvention" },
      { name: "MicroplanNamingRegx" },
      { name: "resourceDistributionStrategy" }
    ],
    {
      cacheTime: Infinity,
      select: (data) => {
        dispatch({
          type: "SETINITDATA",
          state: {
            ...data?.["hcm-microplanning"],
          },
        });
      }
    },
    { schemaCode: "BASE_MASTER_DATA" } //mdmsv2
  );


  if (isLoadingMdmsMicroplanData) {
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
        <PrivateRoute path={`${path}/sample1`} component={() =>
          <Table
            columns={columns} data={data}
            getCellProps={(cellInfo) => {
              return {
                style: {
                  padding: "20px 18px",
                  fontSize: "16px",
                  whiteSpace: "normal",
                },
              };
            }}
            t={t}
          />}
        />
        <PrivateRoute path={`${path}/sample`} component={() => <Sample></Sample>} />



      </AppContainer>
    </Switch>
  );
};

export default App;
