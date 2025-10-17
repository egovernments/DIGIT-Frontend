import React, { useEffect, useMemo, useState } from "react";
import { Routes, useLocation, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContainer, BreadCrumb } from "@egovernments/digit-ui-react-components";
import { lazyWithFallback } from "@egovernments/digit-ui-components";
import AppHelpTutorial from "../../components/AppHelpTutorial";
import HelpInfoCard from "../../components/HelpInfoCard";
import FullConfigWrapper from "./NewAppConfiguration/FullConfigWrapper";

// Create lazy components with fallbacks using the utility
const SetupCampaign = lazyWithFallback(
  () => import(/* webpackChunkName: "setup-campaign" */ "./SetupCampaign"),
  () => require("./SetupCampaign").default,
  { loaderText: "Loading Setup Campaign..." }
);

const ConfigureApp = lazyWithFallback(
  () => import(/* webpackChunkName: "configure-app" */ "./ConfigureApp"),
  () => require("./ConfigureApp").default,
  { loaderText: "Loading Configure App..." }
);

const CreateChecklist = lazyWithFallback(
  () => import(/* webpackChunkName: "create-checklist" */ "./CreateChecklist"),
  () => require("./CreateChecklist").CreateChecklist,
  { loaderText: "Loading Create Checklist..." }
);

const SearchChecklist = lazyWithFallback(
  () => import(/* webpackChunkName: "search-checklist" */ "./SearchChecklist"),
  () => require("./SearchChecklist").default,
  { loaderText: "Loading Search Checklist..." }
);

const UpdateCampaign = lazyWithFallback(
  () => import(/* webpackChunkName: "update-campaign" */ "./UpdateCampaign"),
  () => require("./UpdateCampaign").default,
  { loaderText: "Loading Update Campaign..." }
);

const BoundaryRelationCreate = lazyWithFallback(
  () => import(/* webpackChunkName: "boundary-relation-create" */ "./BoundaryRelationCreate"),
  () => require("./BoundaryRelationCreate").default,
  { loaderText: "Loading Boundary Relation Create..." }
);

const ViewBoundary = lazyWithFallback(
  () => import(/* webpackChunkName: "view-boundary" */ "./ViewBoundary"),
  () => require("./ViewBoundary").default,
  { loaderText: "Loading View Boundary..." }
);

const ViewHierarchy = lazyWithFallback(
  () => import(/* webpackChunkName: "view-hierarchy" */ "./ViewHierarchy"),
  () => require("./ViewHierarchy").default,
  { loaderText: "Loading View Hierarchy..." }
);

const ViewChecklist = lazyWithFallback(
  () => import(/* webpackChunkName: "view-checklist" */ "./ViewChecklist"),
  () => require("./ViewChecklist").default,
  { loaderText: "Loading View Checklist..." }
);

const UpdateChecklist = lazyWithFallback(
  () => import(/* webpackChunkName: "update-checklist" */ "./UpdateChecklist"),
  () => require("./UpdateChecklist").default,
  { loaderText: "Loading Update Checklist..." }
);

const BoundaryHome = lazyWithFallback(
  () => import(/* webpackChunkName: "boundary-home" */ "./BoundaryHome"),
  () => require("./BoundaryHome").default,
  { loaderText: "Loading Boundary Home..." }
);

const ApprovedMicroplans = lazyWithFallback(
  () => import(/* webpackChunkName: "approved-microplans" */ "./ApprovedMicroplans"),
  () => require("./ApprovedMicroplans").default,
  { loaderText: "Loading Approved Microplans..." }
);

const FetchFromMicroplan = lazyWithFallback(
  () => import(/* webpackChunkName: "fetch-from-microplan" */ "../../components/fetchFromMicroplan"),
  () => require("../../components/fetchFromMicroplan").default,
  { loaderText: "Loading Fetch From Microplan..." }
);

const CampaignHome = lazyWithFallback(
  () => import(/* webpackChunkName: "campaign-home" */ "./NewCampaignCreate/CampaignHome"),
  () => require("./NewCampaignCreate/CampaignHome").default,
  { loaderText: "Loading Campaign Home..." }
);

const CreateCampaign = lazyWithFallback(
  () => import(/* webpackChunkName: "create-campaign" */ "./NewCampaignCreate/CreateCampaign"),
  () => require("./NewCampaignCreate/CreateCampaign").default,
  { loaderText: "Loading Create Campaign..." }
);

const CampaignDetails = lazyWithFallback(
  () => import(/* webpackChunkName: "campaign-details" */ "./NewCampaignCreate/CampaignDetails"),
  () => require("./NewCampaignCreate/CampaignDetails").default,
  { loaderText: "Loading Campaign Details..." }
);

const AppModule = lazyWithFallback(
  () => import(/* webpackChunkName: "app-module" */ "./NewCampaignCreate/AppModule"),
  () => require("./NewCampaignCreate/AppModule").default,
  { loaderText: "Loading App Module..." }
);

const AppFeatures = lazyWithFallback(
  () => import(/* webpackChunkName: "app-features" */ "./NewCampaignCreate/AppFeatures"),
  () => require("./NewCampaignCreate/AppFeatures").default,
  { loaderText: "Loading App Features..." }
);

const MyCampaignNew = lazyWithFallback(
  () => import(/* webpackChunkName: "my-campaign-new" */ "./MyCampaignNew"),
  () => require("./MyCampaignNew").default,
  { loaderText: "Loading My Campaign New..." }
);

const NewUploadScreen = lazyWithFallback(
  () => import(/* webpackChunkName: "new-upload-screen" */ "./NewCampaignCreate/NewUploadScreen"),
  () => require("./NewCampaignCreate/NewUploadScreen").default,
  { loaderText: "Loading New Upload Screen..." }
);

const AppConfigurationTabLayer = lazyWithFallback(
  () => import(/* webpackChunkName: "app-configuration-tab-layer" */ "./appConfigurationRedesign/AppConfigurationTabLayer"),
  () => require("./appConfigurationRedesign/AppConfigurationTabLayer").default,
  { loaderText: "Loading App Configuration..." }
);
const AppConfigurationStore = lazyWithFallback(
  () => import(/* webpackChunkName: "app-configuration-store" */ "./NewAppConfiguration/AppConfigurationStore"),
  () => require("./NewAppConfiguration/AppConfigurationStore").default,
  { loaderText: "Loading App Configuration..." }
);

/**
 * The CampaignBreadCrumb function generates breadcrumb navigation for a campaign setup page in a React
 * application.
 * @returns The CampaignBreadCrumb component is returning a BreadCrumb component with the specified
 * crumbs array and spanStyle prop. The crumbs array contains two objects with path, content, and show
 * properties for each breadcrumb item. The spanStyle prop is set to { maxWidth: "min-content" }.
 */
const CampaignBreadCrumb = ({ location, defaultPath }) => {
  const { t } = useTranslation();

  const search = useLocation().search;
  const queryParams = new URLSearchParams(search);
  const navigate = useNavigate();
  const url = Digit.Hooks.useQueryParams();
  const campaignNumber = url?.campaignNumber;
  const campaignId = url?.campaignId;
  const projectType = url?.projectType;
  const name = url?.campaignName;
  const role = url?.role;
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const pathVar = location.pathname.replace(defaultPath + "/", "").split("?")?.[0];

  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("CAMPAIGN_HOME"),
      show: true,
    },
    // {
    //   path: pathVar === "my-campaign" ? "" : `/${window?.contextPath}/employee/campaign/my-campaign`,
    //   content: t("MY_CAMPAIGN"),
    //   show:
    //     pathVar === "my-campaign" ||
    //     pathVar === "checklist/create" ||
    //     pathVar === "checklist/view" ||
    //     pathVar === "checklist/update" ||
    //     pathVar === "update-dates-boundary"
    //       ? true
    //       : false,
    // },
    {
      path: pathVar === "my-campaign-new" ? "" : `/${window?.contextPath}/employee/campaign/my-campaign-new`,
      content: t("MY_CAMPAIGN"),
      show: pathVar === "my-campaign-new" || pathVar === "checklist/update" ? true : false,
    },
    {
      path: pathVar === "campaign-home" ? "" : `/${window?.contextPath}/employee/campaign/campaign-home`,
      content: t("CREATE_CAMPAIGN_HOME"),
      show: pathVar.match("campaign-home") || pathVar.match("create-campaign") ? true : false,
    },
    {
      path: "",
      content: t("CREATE_CAMPAIGN"),
      show: pathVar.match("create-campaign") || pathVar === "view-details" ? true : false,
    },
    {
      path: pathVar === "view-details" ? "" : `/${window?.contextPath}/employee/campaign/view-details`,
      content: t("VIEW_DETAILS"),
      query: `campaignNumber=${campaignNumber}&tenantId=${tenantId}`,
      show:
        pathVar.match("view-details") ||
        pathVar.match("setup-campaign") ||
        pathVar.match("app-configuration-redesign") ||
        pathVar.match("app-modules") ||
        pathVar.match("app-features") ||
        pathVar === "update-dates-boundary" ||
        pathVar === "update-campaign" ||
        pathVar === "checklist/search" ||
        pathVar === "upload-screen"
          ? true
          : false,
    },
    {
      path: pathVar === "update-dates-boundary" ? "" : `/${window?.contextPath}/employee/campaign/view-details`,
      content: t("UPDATE_DATE_CHANGE"),
      show: pathVar === "update-dates-boundary" ? true : false,
    },
    {
      path: pathVar === "checklist/search" ? "" : `/${window?.contextPath}/employee/campaign/checklist/search`,
      content: t("ACTION_LABEL_CONFIGURE_APP"),
      query: `campaignNumber=${campaignNumber}&tenantId=${tenantId}&name=${name}&campaignId=${campaignId}&projectType=${projectType}&role=${role}`,
      show: pathVar === "checklist/search" || pathVar === "checklist/create" || pathVar === "checklist/view" ? true : false,
    },
    {
      path: "",
      content: t("ACTION_CREATE_CHECKLIST"),
      show: pathVar === "checklist/create" ? true : false,
    },
    {
      path: "",
      content: t("ACTION_UPLOAD_SCREEN"),
      show: pathVar === "upload-screen" ? true : false,
    },
    {
      path: "",
      content: t("ACTION_VIEW_CHECKLIST"),
      show: pathVar === "checklist/view" ? true : false,
    },
    {
      path: "",
      content: t("ACTION_UPDATE_CHECKLIST"),
      show: pathVar === "checklist/update" ? true : false,
    },
    {
      path: pathVar === "boundary/home" ? "" : `/${window?.contextPath}/employee/campaign/boundary/home`,
      content: t("BOUNDARY_DATA_MANAGEMENT"),
      show: pathVar.match("boundary/") ? true : false,
    },
    {
      path: pathVar === "update-campaign" ? "" : `/${window?.contextPath}/employee/campaign/update-campaign`,
      content: t("UPDATE_CAMPAIGN"),
      show: pathVar.match("update-campaign") ? true : false,
    },
    {
      path: pathVar === "setup-campaign" ? "" : `/${window?.contextPath}/employee/campaign/setup-campaign`,
      content: t("CREATE_NEW_CAMPAIGN"),
      show: pathVar === "setup-campaign" ? true : false,
    },
    {
      path: pathVar === "app-modules" ? "" : `/${window?.contextPath}/employee/campaign/app-modules`,
      content: t("APP_CONFIGURATION"),
      query: `campaignNumber=${campaignNumber}&tenantId=${tenantId}&projectType=${projectType}`,
      show: pathVar === "app-modules" || pathVar === "app-configuration-redesign" ? true : false,
    },
    {
      path: "",
      content: t("APP_FEATURES"),
      show: pathVar === "app-features" ? true : false,
    },
    {
      path: "",
      content: t("APP_CONFIGURATION_REDESIGN"),
      show: pathVar === "app-configuration-redesign" ? true : false,
    },
  ];

  return <BreadCrumb className="campaign-breadcrumb" crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

/**
 * The `App` function in JavaScript defines a component that handles different routes and renders
 * corresponding components based on the path provided.
 * @returns The `App` component is returning a JSX structure that includes a `div` with a className of
 * "wbh-header-container" containing a `CampaignBreadCrumb` component and a `Switch` component. Inside
 * the `Switch` component, there are several `Route` components with different paths and
 * corresponding components such as `UploadBoundaryData`, `CycleConfiguration`, `DeliveryRule`, `
 */
const App = ({ path, BOUNDARY_HIERARCHY_TYPE: BoundaryHierarchy, hierarchyData: propsHierarchyData }) => {
  const location = useLocation();
  const userId = Digit.UserService.getUser().info.uuid;
  const BOUNDARY_HIERARCHY_TYPE = useMemo(() => BoundaryHierarchy, [BoundaryHierarchy]);
  const hierarchyData = useMemo(() => propsHierarchyData, [propsHierarchyData]);
  const microplanStatus = "RESOURCE_ESTIMATIONS_APPROVED";
  const UploadBoundaryData = Digit?.ComponentRegistryService?.getComponent("UploadBoundaryData");
  const CycleConfiguration = Digit?.ComponentRegistryService?.getComponent("CycleConfiguration");
  const DeliveryRule = Digit?.ComponentRegistryService?.getComponent("DeliveryRule");
  const MyCampaign = Digit?.ComponentRegistryService?.getComponent("MyCampaign");
  const CampaignSummary = Digit?.ComponentRegistryService?.getComponent("CampaignSummary");
  const Response = Digit?.ComponentRegistryService?.getComponent("Response");
  const AddProduct = Digit?.ComponentRegistryService?.getComponent("AddProduct");
  const UpdateDatesWithBoundaries = Digit?.ComponentRegistryService?.getComponent("UpdateDatesWithBoundaries");
  const AppConfigurationParentRedesign = Digit?.ComponentRegistryService?.getComponent("AppConfigurationParentRedesign");

  useEffect(() => {
    if (window.location.pathname !== "/workbench-ui/employee/campaign/setup-campaign") {
      window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
      window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
    }
    if (window.location.pathname === "/workbench-ui/employee/campaign/response") {
      window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
      window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
    }
    return () => {
      if (window.location.pathname !== "/workbench-ui/employee/campaign/setup-campaign") {
        window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
        window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
      }
    };
  }, []);

  return (
    <React.Fragment>
      <div className="wbh-header-container">
        {window?.location?.pathname === "/workbench-ui/employee/campaign/add-product" ||
        window?.location?.pathname === "/workbench-ui/employee/campaign/response" ||
        window?.location?.pathname === "/workbench-ui/employee/campaign/new-app-configuration-redesign" ? null : (
          <CampaignBreadCrumb location={location} defaultPath={path} />
        )}
        <AppHelpTutorial appPath={path} location={location} buttonLabel="CAMP_HELP_TEXT" />
      </div>
      <AppContainer className="campaign">
        <Routes>
          <Route path={`create-campaign/upload-boundary-data`} element={<UploadBoundaryData />} />
          <Route path={`create-campaign/cycle-configure`} element={<CycleConfiguration />} />
          <Route path={`create-campaign/delivery-details`} element={<DeliveryRule />} />
          <Route
            path={`setup-campaign`}
            element={<SetupCampaign hierarchyType={BOUNDARY_HIERARCHY_TYPE} hierarchyData={hierarchyData} />}
          />
          <Route path={`my-campaign`} element={<MyCampaign />} />
          <Route path={`my-campaign-new`} element={<MyCampaignNew />} />
          <Route path={`fetch-from-microplan`} element={<FetchFromMicroplan />} />
          <Route path={`preview`} element={<CampaignSummary />} />
          <Route path={`response`} element={<Response />} />
          <Route path={`add-product`} element={<AddProduct />} />
          <Route path={`configure-app`} element={<ConfigureApp />} />
          <Route path={`update-dates-boundary`} element={<UpdateDatesWithBoundaries />} />
          <Route path={`checklist/create`} element={<CreateChecklist />} />
          <Route path={`checklist/search`} element={<SearchChecklist />} />
          <Route path={`checklist/view`} element={<ViewChecklist />} />
          <Route path={`checklist/update`} element={<UpdateChecklist />} />
          <Route path={`boundary/home`} element={<BoundaryHome />} />
          <Route path={`boundary/create`} element={<BoundaryRelationCreate />} />
          <Route path={`boundary/view-all-hierarchy`} element={<ViewBoundary />} />
          <Route path={`boundary/data`} element={<ViewHierarchy />} />
          <Route path={`update-campaign`} element={<UpdateCampaign hierarchyData={hierarchyData} />} />
          <Route path={`setup-from-microplan`} element={<ApprovedMicroplans />} />
          <Route path={`app-configuration-redesign`} element={<AppConfigurationTabLayer />} />
          <Route path={`new-app-configuration-redesign`} element={<FullConfigWrapper />} />
          <Route
            path={`create-campaign`}
            element={<CreateCampaign hierarchyType={BOUNDARY_HIERARCHY_TYPE} hierarchyData={hierarchyData} />}
          />
          <Route path={`campaign-home`} element={<CampaignHome />} />
          <Route path={`view-details`} element={<CampaignDetails />} />
          <Route path={`app-modules`} element={<AppModule />} />
          <Route path={`app-features`} element={<AppFeatures />} />
          <Route path={`upload-screen`} element={<NewUploadScreen />} />
          {/* <HelpInfoCard appPath={path} location={location} /> */}
        </Routes>
      </AppContainer>
      {/* <Switch>
        <AppContainer className="campaign">
          <PrivateRoute path={`${path}/create-campaign/upload-boundary-data`} component={() => <UploadBoundaryData />} />
          <PrivateRoute path={`${path}/create-campaign/cycle-configure`} component={() => <CycleConfiguration />} />
          <PrivateRoute path={`${path}/create-campaign/delivery-details`} component={() => <DeliveryRule />} />
          <PrivateRoute
            path={`${path}/setup-campaign`}
            component={() => <SetupCampaign hierarchyType={BOUNDARY_HIERARCHY_TYPE} hierarchyData={hierarchyData} />}
          />
          <PrivateRoute path={`${path}/my-campaign`} component={() => <MyCampaign />} />
          <PrivateRoute path={`${path}/my-campaign-new`} component={() => <MyCampaignNew />} />
          <PrivateRoute path={`${path}/fetch-from-microplan`} component={() => <FetchFromMicroplan />} />
          <PrivateRoute path={`${path}/preview`} component={() => <CampaignSummary />} />
          <PrivateRoute path={`${path}/response`} component={() => <Response />} />
          <PrivateRoute path={`${path}/add-product`} component={() => <AddProduct />} />
          <PrivateRoute path={`${path}/configure-app`} component={() => <ConfigureApp />} />
          <PrivateRoute path={`${path}/update-dates-boundary`} component={() => <UpdateDatesWithBoundaries />} />
          <PrivateRoute path={`${path}/checklist/create`} component={() => <CreateChecklist />} />
          <PrivateRoute path={`${path}/checklist/search`} component={() => <SearchChecklist />} />
          <PrivateRoute path={`${path}/checklist/view`} component={() => <ViewChecklist />} />
          <PrivateRoute path={`${path}/checklist/update`} component={() => <UpdateChecklist />} />
          <PrivateRoute path={`${path}/boundary/home`} component={() => <BoundaryHome />} />
          <PrivateRoute path={`${path}/boundary/create`} component={() => <BoundaryRelationCreate />} />
          <PrivateRoute path={`${path}/boundary/view-all-hierarchy`} component={() => <ViewBoundary />} />
          <PrivateRoute path={`${path}/boundary/data`} component={() => <ViewHierarchy />} />
          <PrivateRoute path={`${path}/update-campaign`} component={() => <UpdateCampaign hierarchyData={hierarchyData} />} />
          <PrivateRoute path={`${path}/setup-from-microplan`} component={() => <ApprovedMicroplans />} />
          <PrivateRoute path={`${path}/app-configuration-redesign`} component={() => <AppConfigurationParentRedesign />} />
          <PrivateRoute
            path={`${path}/create-campaign`}
            component={() => <CreateCampaign hierarchyType={BOUNDARY_HIERARCHY_TYPE} hierarchyData={hierarchyData} />}
          />
          <PrivateRoute path={`${path}/campaign-home`} component={() => <CampaignHome />} />
          <PrivateRoute path={`${path}/view-details`} component={() => <CampaignDetails />} />
          <PrivateRoute path={`${path}/app-modules`} component={() => <AppModule />} />
          <PrivateRoute path={`${path}/app-features`} component={() => <AppFeatures />} />
          <PrivateRoute path={`${path}/upload-screen`} component={() => <NewUploadScreen />} />
          <HelpInfoCard appPath={path} location={location} />
        </AppContainer>
      </Switch> */}
    </React.Fragment>
  );
};

export default React.memo(App);
