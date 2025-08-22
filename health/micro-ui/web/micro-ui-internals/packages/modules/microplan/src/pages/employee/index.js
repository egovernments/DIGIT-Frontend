import { AppContainer, BreadCrumb, Loader, PrivateRoute } from "@egovernments/digit-ui-react-components";
import BreadCrumbNew from "./BreadCrumbNew";
import React, { useEffect,useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import SetupMicroplan from "./SetupMicroplan";
import { useMyContext } from "../../utils/context";
import MicroplanSearch from "./MicroplanSearch";
import SummaryScreen from "./SummaryScreen";
import CampaignBoundary from "../../components/CampaignBoundary";
import UserManagement from "./UserManagement";
import SearchUnderJurisdiction from "../../components/SearchUnderJurisdiction";
import TableNew from "./TablePage";
import PopInbox from "./PopInbox";
import UserUpload from "../../components/UserUpload";
import UserDownload from "./UserDownload";
import VillageView from "./viewVillage";
import MyMicroplans from "./MyMicroplans";
import ChooseActivity from "./ChooseActivity";
import Response from "../../components/Response";

import FacilityCatchmentMapping from "./FacilityCatchmentMapping";
import PlanInbox from "./PlanInbox";
import MapViewComponent from "../../components/MapViewComponent";
import MapViewPopupWrapper from "../../components/MapViewPopup";

// const bredCrumbStyle = { maxWidth: "min-content" };
const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();

  const url = Digit.Hooks.useQueryParams();
  const microplanId = url?.microplanId;
  const campaignId = url?.campaignId;
  const setupCompleted = url?.["setup-completed"];

  const crumbs = [
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      internalLink: `/${window?.contextPath}/employee/microplan/user-management`,
      content: t("USER_MANAGEMENT"),
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "UPLOAD_USER" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "USER_DOWNLOAD",
    },
    {
      internalLink: `/${window?.contextPath}/employee/microplan/microplan-search`,
      content: t("OPEN_MICROPLANS"),
      show: (Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "SETUP_MICROPLAN" && setupCompleted==="true")
    },  
    {
      internalLink: `/${window?.contextPath}/employee/microplan/my-microplans`,
      content: t("MY_MICROPLANS"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "SELECT_ACTIVITY" ||
      Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "POP_INBOX" ||
      Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "ASSIGN_FACILITIES_TO_VILLAGES" ||
      Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "PLAN_INBOX" ||
      Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VILLAGE_VIEW",
    }, 
    {
      internalLink: `/${window?.contextPath}/employee/microplan/select-activity`,
      content: t("SELECT_ACTIVITY"),
      query: `microplanId=${microplanId}&campaignId=${campaignId}`,
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "POP_INBOX" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "ASSIGN_FACILITIES_TO_VILLAGES" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "PLAN_INBOX" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VILLAGE_VIEW",
    },
    {
      internalLink: `/${window?.contextPath}/employee/microplan/pop-inbox`,
      content: t("POP_INBOX"),
      query: `microplanId=${microplanId}&campaignId=${campaignId}`,
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VILLAGE_VIEW"
    }, 
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: setupCompleted ? t("VIEW_SUMMARY") : t(Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop())),
      show: true,
    },
   
  ];
  
  return <BreadCrumbNew crumbs={crumbs} />;
};

const App = ({ path, stateCode, userType, tenants, BOUNDARY_HIERARCHY_TYPE: BoundaryHierarchy, hierarchyData: propsHierarchyData, lowestHierarchy : lowestHierarchy1 }) => {
  const { dispatch } = useMyContext();
  const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const BOUNDARY_HIERARCHY_TYPE = useMemo(() => BoundaryHierarchy, [BoundaryHierarchy]);
  const hierarchyData = useMemo(() => propsHierarchyData, [propsHierarchyData]);
  const lowestHierarchy = useMemo(() => lowestHierarchy1, [lowestHierarchy1]);
  //destroying session
  useEffect(() => {
    const pathVar = location.pathname.replace(`${path}/`, "").split("?")?.[0];
    Digit.Utils.microplanv1.destroySessionHelper(pathVar, ["setup-microplan"], "MICROPLAN_DATA");
  }, [location]);

  useEffect(() => {
    if (window.location.pathname !== `/${window.contextPath}/employee/microplan/setup-microplan`) {
      window.Digit.SessionStorage.del("MICROPLAN_DATA");
      window.Digit.SessionStorage.del("HYPOTHESIS_DATA");
      window.Digit.SessionStorage.del("FORMULA_DATA");
    }
    if (window.location.pathname === `/${window.contextPath}/employee/microplan/response`) {
      window.Digit.SessionStorage.del("MICROPLAN_DATA");
      window.Digit.SessionStorage.del("HYPOTHESIS_DATA");
      window.Digit.SessionStorage.del("FORMULA_DATA");
    }
    return () => {
      if (window.location.pathname !== `/${window.contextPath}/employee/microplan/setup-microplan`) {
        window.Digit.SessionStorage.del("MICROPLAN_DATA");
        window.Digit.SessionStorage.del("HYPOTHESIS_DATA");
        window.Digit.SessionStorage.del("FORMULA_DATA");
      }
    };
  }, []);

  const { isLoading: isLoadingMdmsMicroplanData, data: MicroplanMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "hcm-microplanning",
    [
      { name: "MicroplanNamingConvention" },
      { name: "MicroplanNamingRegex" },
      { name: "ResourceDistributionStrategy" },
      { name: "rolesForMicroplan" },
      { name: "HypothesisAssumptions" },
      { name: "RuleConfigureOutput" },
      { name: "RuleConfigureInputs" },
      { name: "AutoFilledRuleConfigurations" },
      { name: "RuleConfigureOperators" },
      { name: "RegistrationAndDistributionHappeningTogetherOrSeparately" },
      { name: "hierarchyConfig" },
      { name: "villageRoadCondition" },
      { name: "villageTerrain" },
      { name: "securityQuestions" },
      { name: "facilityType" },
      { name: "facilityStatus" },
      { name: "VehicleDetails" },
      { name: "ContextPathForUser" },
      { name: "DssKpiConfigs" },
      { name: "MicroplanCampaignTypes" },
      {name: "PopConfig"},
      {name:"PlanInboxConfiguration"}
    ],
    {
      cacheTime: Infinity,
      select: (data) => {
        dispatch({
          type: "MASTER_DATA",
          state: {
            ...data?.["hcm-microplanning"],
          },
        });
      },
    },
    { schemaCode: "BASE_MASTER_DATA" } //mdmsv2
  );

  const { isLoading: isLoadingMdmsAdditionalData, data: AdditionalMdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "HCM-ADMIN-CONSOLE",
    [{ name: "hierarchyConfig" }],
    {
      cacheTime: Infinity,
      select: (data) => {
        // dispatch({
        //   type: "MASTER_DATA",
        //   state: {
        //       hierarchyConfig:[
        //       {
        //         "hierarchy": "Workbench",
        //         "lowestHierarchy": "Post Administrative",
        //         "splitBoundariesOn" : "District",
        //         "isActive": false
        //       },
        //         {
        //         "hierarchy": "ADMIN",
        //         "lowestHierarchy": "Post Administrative",
        //         "splitBoundariesOn" : "District",
        //         "isActive": false
        //       },
        //       {
        //         "hierarchy": "Health",
        //         "lowestHierarchy": "Post Administrative",
        //         "splitBoundariesOn" : "District",
        //         "isActive": false
        //       },
        //       {
        //         "hierarchy": "MICROPLAN",
        //         "lowestHierarchy": "Village",
        //         "splitBoundariesOn" : "District",
        //         "isActive": true
        //       }
        //     ],
        //     ...data?.["HCM-ADMIN-CONSOLE"],
        //   },
        // });
      },
    },
    { schemaCode: "ADDITIONAL_MASTER_DATA" } //mdmsv2
  );

  const reqCriteria = {
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `${BOUNDARY_HIERARCHY_TYPE}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId: tenantId,
        limit: 1,
        offset: 0,
        hierarchyType: BOUNDARY_HIERARCHY_TYPE,
      },
    },
    config: {
      cacheTime: Infinity,
      enabled: !!BOUNDARY_HIERARCHY_TYPE,
      select: (data) => {
        dispatch({
          type: "MASTER_DATA",
          state: {
            boundaryHierarchy: data?.BoundaryHierarchy?.[0]?.boundaryHierarchy,
            hierarchyType: BOUNDARY_HIERARCHY_TYPE,
            lowestHierarchy,
          },
        });
        return data?.BoundaryHierarchy?.[0];
      },
    },
  };
  const { data: hierarchyDefinition, isLoading: isBoundaryHierarchyLoading } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  if (isLoadingMdmsMicroplanData || isLoadingMdmsAdditionalData || isBoundaryHierarchyLoading) {
    return <Loader />;
  }

  //TODO: Hardcode jurisdiction in state for now, need a microplan with complete setup done with all selected boundaries(in campaign), need superviser users with jurisdiction and tagging

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute
          path={`${path}/setup-microplan`}
          component={() => <SetupMicroplan hierarchyType={BOUNDARY_HIERARCHY_TYPE} hierarchyData={hierarchyData} />}
        />
        <PrivateRoute path={`${path}/microplan-search`} component={MicroplanSearch} />
        <PrivateRoute path={`${path}/user-management`} component={() => <UserManagement></UserManagement>} />
        <PrivateRoute path={`${path}/user-download`} component={() => <UserDownload />} />
        <PrivateRoute path={`${path}/select-activity`} component={() => <ChooseActivity />} />
        <PrivateRoute path={`${path}/campaign-boundary`} component={() => <CampaignBoundary />} />
        <PrivateRoute path={`${path}/test`} component={() => <SearchUnderJurisdiction></SearchUnderJurisdiction>} />
        <PrivateRoute path={`${path}/table`} component={() => <TableNew />} />
        <PrivateRoute path={`${path}/pop-inbox`} component={() => <PopInbox />} />
        <PrivateRoute path={`${path}/plan-inbox`} component={() => <PlanInbox />} />
        <PrivateRoute path={`${path}/upload-user`} component={() => <UserUpload />} />
        <PrivateRoute path={`${path}/village-view`} component={() => <VillageView />} />
        <PrivateRoute path={`${path}/my-microplans`} component={MyMicroplans} />
        <PrivateRoute path={`${path}/upload-user-success`} component={() => <Response />} />
        <PrivateRoute path={`${path}/setup-completed-response`} component={() => <Response useWindowState={true}/>} />
        <PrivateRoute path={`${path}/draft-completed-response`} component={() => <Response />} />
        <PrivateRoute path={`${path}/population-finalise-success`} component={() => <Response />} />
        <PrivateRoute path={`${path}/assign-facilities-to-villages`} component={() => <FacilityCatchmentMapping />} />
        <PrivateRoute path={`${path}/village-finalise-success`} component={() => <Response />} />
        <PrivateRoute path={`${path}/microplan-success`} component={() => <Response />} />
        <PrivateRoute path={`${path}/map-view`} component={() => <MapViewPopupWrapper />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
