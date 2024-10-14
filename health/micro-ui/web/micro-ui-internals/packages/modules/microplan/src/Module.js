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
  CampaignBoundary
  

};

export const initMicroplanComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
