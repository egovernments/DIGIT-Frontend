import { Loader } from "@egovernments/digit-ui-react-components";
import React,{useState} from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import MicroplanCard from "./components/MicroplanCard";
import { overrideHooks, updateCustomConfigs } from "./utils";
import MicroplanDetails from "./components/MicroplanDetails";
import CampaignDetails from "./components/CampaignDetails";
import { ProviderContext } from "./utils/context";
import BoundarySelection from "./components/BoundarySelection";
import AssumptionsForm from "./components/AssumptionsForm";
import HypothesisWrapper from "./components/HypothesisWrapper";
import UploadDataCustom from "./components/UploadDataCustom";
import DataMgmtTable from "./components/DataMgmtTable";
import FileComponent from "./components/FileComponent";
import HeaderComp from "./components/HeaderComp";
import FormulaSection from "./components/FormulaSectionCard";
import FormulaView from "./components/FormulaView";
import SummaryScreen from "./pages/employee/SummaryScreen";
import CampaignBoundary from "./components/CampaignBoundary";
import FormulaConfigWrapper from "./components/FormulaConfigWrapper";
import UserAccessWrapper from "./components/UserAccessWrapper";
import AssumptionsList from "./components/AssumptionsList";
import FormulaConfigScreen from "./components/FormulaConfigScreen";
import FacilityPopup from "./components/FacilityPopup";
import UserAccessMgmt from "./components/UserAccessMgmt";
import UserAccessMgmtTableWrapper from "./components/UserAccessMgmtTableWrapper";
import { DataMgmtComponent } from "./components/DataMgmtComponent";
import { ShowMoreWrapper } from "./components/ShowMoreWrapper";

export const MicroplanModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [lowestHierarchy,setLowestHierarchy] = useState("") 
  const { data: BOUNDARY_HIERARCHY_TYPE } = Digit.Hooks.useCustomMDMS(tenantId, "hcm-microplanning", [{ name: "hierarchyConfig" }], {
    select: (data) => {
       const item = data?.["hcm-microplanning"]?.hierarchyConfig?.find((item) => item.isActive)
       setLowestHierarchy(item.lowestHierarchy)
        return item?.hierarchy
      },
  },{schemaCode:"BASE_MASTER_DATA_INITIAL"});

  const hierarchyData = Digit.Hooks.campaign.useBoundaryRelationshipSearch({BOUNDARY_HIERARCHY_TYPE,tenantId});

  const moduleCode = ["Microplanning","campaignmanager", "workbench", "mdms", "schema", "hcm-admin-schemas"];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading: isBoundaryLocalisationLoading, data: boundaryStore } = Digit.Services.useStore({
    stateCode,
    moduleCode:[`boundary-${BOUNDARY_HIERARCHY_TYPE}`],
    language,
    modulePrefix : "hcm",
  });
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  if (isLoading && isBoundaryLocalisationLoading) {
    return <Loader />;
  }
  return (
    <ProviderContext>
      <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} hierarchyData={hierarchyData} BOUNDARY_HIERARCHY_TYPE={BOUNDARY_HIERARCHY_TYPE} lowestHierarchy={lowestHierarchy}/>
    </ProviderContext>
  );
};

const componentsToRegister = {
  MicroplanModule,
  MicroplanCard,
  CampaignDetails,
  MicroplanDetails,
  BoundarySelection,
  AssumptionsForm,
  HypothesisWrapper,
  FormulaConfigWrapper,
  UploadDataCustom,
  DataMgmtTable,
  FileComponent,
  HeaderComp,
  FormulaView,
  FormulaSection,
  SummaryScreen,
  CampaignBoundary,
  UserAccessWrapper,
  AssumptionsList,
  FormulaConfigScreen,
  FacilityPopup,
  UserAccessMgmt,
  UserAccessMgmtTableWrapper,
  DataMgmtComponent,
  ShowMoreWrapper,
};

export const initMicroplanComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
