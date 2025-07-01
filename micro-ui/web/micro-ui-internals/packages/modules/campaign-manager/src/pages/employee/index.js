import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer, BreadCrumb } from "@egovernments/digit-ui-react-components";
import SetupCampaign from "./SetupCampaign";
import ConfigureApp from "./ConfigureApp";
import { CreateChecklist } from "./CreateChecklist";
import SearchChecklist from "./SearchChecklist";
import UpdateCampaign from "./UpdateCampaign";
import BoundaryRelationCreate from "./BoundaryRelationCreate";
import ViewBoundary from "./ViewBoundary";
import ViewHierarchy from "./ViewHierarchy";
import ViewChecklist from "./ViewChecklist";
import UpdateChecklist from "./UpdateChecklist";
import BoundaryHome from "./BoundaryHome";
import ApprovedMicroplans from "./ApprovedMicroplans";
import FetchFromMicroplan from "../../components/fetchFromMicroplan";
import FormBuilder from "./appConfigurationScreenParent/FormBuilder";
import SchemaBuilder from "./appConfigurationScreenParent/SchemaBuilder";
import CampaignHome from "./NewCampaignCreate/CampaignHome";
import CreateCampaign from "./NewCampaignCreate/CreateCampaign";
import CampaignDetails from "./NewCampaignCreate/CampaignDetails";
import AppModule from "./NewCampaignCreate/AppModule";
import AppFeatures from "./NewCampaignCreate/AppFeatures";
import AppHelpTutorial from "../../components/AppHelpTutorial";
import MyCampaignNew from "./MyCampaignNew";
import HelpInfoCard from "../../components/HelpInfoCard";
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
  // const history = useHistory();
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
        pathVar === "checklist/search"
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
 * the `Switch` component, there are several `PrivateRoute` components with different paths and
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
  const AppConfigurationParentLayer = Digit?.ComponentRegistryService?.getComponent("AppConfigurationParentLayer");
  const AppConfigurationParentRedesign = Digit?.ComponentRegistryService?.getComponent("AppConfigurationParentRedesign");

  useEffect(() => {
    if (window.location.pathname !== `/${window?.contextPath}/employee/campaign/setup-campaign`) {
      window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
      window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
    }
    if (window.location.pathname === `/${window?.contextPath}/employee/campaign/response`) {
      window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
      window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
    }
    return () => {
      if (window.location.pathname !== `/${window?.contextPath}/employee/campaign/setup-campaign`) {
        window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_FORM_DATA");
        window.Digit.SessionStorage.del("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
      }
    };
  }, []);

  return (
    <React.Fragment>
      <div className="wbh-header-container">
        {window?.location?.pathname === `/${window?.contextPath}/employee/campaign/add-product` ||
        window?.location?.pathname === `/${window?.contextPath}/employee/campaign/response` ? null : (
          <CampaignBreadCrumb location={location} defaultPath={path} />
        )}
        <AppHelpTutorial appPath={path} location={location} buttonLabel="CAMP_HELP_TEXT" />
      </div>
      <AppContainer className="campaign">
        <Routes>
          <Route path="create-campaign/upload-boundary-data" element={<PrivateRoute element={<UploadBoundaryData />} />} />
          <Route path="create-campaign/cycle-configure" element={<PrivateRoute element={<CycleConfiguration />} />} />
          <Route path="create-campaign/delivery-details" element={<PrivateRoute element={<DeliveryRule />} />} />
          <Route
            path="setup-campaign"
            element={<PrivateRoute element={<SetupCampaign hierarchyType={BOUNDARY_HIERARCHY_TYPE} hierarchyData={hierarchyData} />} />}
          />
          <Route path="my-campaign" element={<PrivateRoute element={<MyCampaign />} />} />
          <Route path="my-campaign-new" element={<PrivateRoute element={<MyCampaignNew />} />} />
          <Route path="fetch-from-microplan" element={<PrivateRoute element={<FetchFromMicroplan />} />} />
          <Route path="preview" element={<PrivateRoute element={<CampaignSummary />} />} />
          <Route path="response" element={<PrivateRoute element={<Response />} />} />
          <Route path="add-product" element={<PrivateRoute element={<AddProduct />} />} />
          <Route path="configure-app" element={<PrivateRoute element={<ConfigureApp />} />} />
          <Route path="update-dates-boundary" element={<PrivateRoute element={<UpdateDatesWithBoundaries />} />} />
          <Route path="checklist/create" element={<PrivateRoute element={<CreateChecklist />} />} />
          <Route path="checklist/search" element={<PrivateRoute element={<SearchChecklist />} />} />
          <Route path="checklist/view" element={<PrivateRoute element={<ViewChecklist />} />} />
          <Route path="checklist/update" element={<PrivateRoute element={<UpdateChecklist />} />} />
          <Route path="boundary/home" element={<PrivateRoute element={<BoundaryHome />} />} />
          <Route path="boundary/create" element={<PrivateRoute element={<BoundaryRelationCreate />} />} />
          <Route path="boundary/view-all-hierarchy" element={<PrivateRoute element={<ViewBoundary />} />} />
          <Route path="boundary/data" element={<PrivateRoute element={<ViewHierarchy />} />} />
          <Route path="update-campaign" element={<PrivateRoute element={<UpdateCampaign hierarchyData={hierarchyData} />} />} />
          <Route path="setup-from-microplan" element={<PrivateRoute element={<ApprovedMicroplans />} />} />
          <Route path="app-configuration-parent" element={<PrivateRoute element={<AppConfigurationParentLayer />} />} />
          <Route path="app-configuration-redesign" element={<PrivateRoute element={<AppConfigurationParentRedesign />} />} />
          <Route path="form-builder-configuration" element={<PrivateRoute element={<FormBuilder />} />} />
          <Route path="schema-builder-configuration" element={<PrivateRoute element={<SchemaBuilder />} />} />
          {/* <Route path="app-configuration" element={<PrivateRoute element={<AppConfigurationWrapper />} />} /> */}
          <Route
            path="create-campaign"
            element={<PrivateRoute element={<CreateCampaign hierarchyType={BOUNDARY_HIERARCHY_TYPE} hierarchyData={hierarchyData} />} />}
          />
          <Route path="campaign-home" element={<PrivateRoute element={<CampaignHome />} />} />
          <Route path="view-details" element={<PrivateRoute element={<CampaignDetails />} />} />
          <Route path="app-modules" element={<PrivateRoute element={<AppModule />} />} />
          <Route path="app-features" element={<PrivateRoute element={<AppFeatures />} />} />
        </Routes>

        <HelpInfoCard appPath={path} location={location} />
      </AppContainer>
    </React.Fragment>
  );
};

export default React.memo(App);
