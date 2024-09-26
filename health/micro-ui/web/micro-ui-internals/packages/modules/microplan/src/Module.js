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
import HypothesisWrapper from "./components/HypothesisWrapper";
import DataMgmt from "./components/DataMgmt";
import SummaryMicroplanDetails from "./components/SummaryMicroplanDetails";
import FormulaConfiguration from "./components/FormulaConfig";
import UserAccessManagement from "./components/UserAccessManagement";
import FileComponent from "./components/FileComponent";
import DataMgmtTable from "./components/DataMgmtTable";
import HeaderComp from "./components/HeaderComp";
import ThreeInputComp from "./components/ThreeInputComp";
import HeaderPlusThreeInput from "./components/HeaderPlusThreeInput";
import SummaryScreen3 from "./pages/employee/SummaryScreen3";


export const MicroplanModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [lowestHierarchy,setLowestHierarchy] = useState("") 
  const { data: BOUNDARY_HIERARCHY_TYPE } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "hierarchyConfig" }], {
    select: (data) => {
       const item = data?.["HCM-ADMIN-CONSOLE"]?.hierarchyConfig?.find((item) => item.isActive)
       setLowestHierarchy(item.lowestHierarchy)
        return item?.hierarchy
      },
  });

  const hierarchyData = Digit.Hooks.campaign.useBoundaryRelationshipSearch({BOUNDARY_HIERARCHY_TYPE,tenantId});

  const moduleCode = ["Microplanning","campaignmanager", "workbench", "mdms", "schema", "hcm-admin-schemas", `boundary-${BOUNDARY_HIERARCHY_TYPE}`];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  if (isLoading) {
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
  HypothesisWrapper,
  DataMgmt,
  SummaryMicroplanDetails,
  FormulaConfiguration,
  UserAccessManagement,
  FileComponent,
  DataMgmtTable,
  HeaderComp,
  ThreeInputComp,
  HeaderPlusThreeInput,
  SummaryScreen3

};

export const initMicroplanComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
