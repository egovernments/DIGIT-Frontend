import { Loader } from "@egovernments/digit-ui-react-components";
import React,{useState,useEffect,useMemo} from "react";
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
import MapViewComponent from "./components/MapViewComponent";
import BoundaryFilter from "./components/BoundaryFilter";
import BaseMapSwitcher from "./components/BaseMapSwitcher";
import CustomScaleControl from "./components/CustomScaleControl";
import MapFilterIndex from "./components/MapFilterIndex";
import FilterSection from "./components/FilterSection";
import ChoroplethSelection from "./components/ChoroplethSelection";
import VillageHierarchyTooltipWrapper from "./components/VillageHierarchyTooltipWrapper";
import CampaignCard from "./components/OldCampaignCard"; // @nipunarora-eGov remove this once migrated to new react component card implementation
import AddColumns from "./components/AddColumns";
import AddColumnsWrapper from "./components/AddColumnsWrapper";
import MapViewPopup from "./components/MapViewPopup";

export const MicroplanModule = React.memo(({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const tenantId = useMemo(() => Digit.ULBService.getCurrentTenantId(), []);
  const [lowestHierarchy,setLowestHierarchy] = useState("") 
  const { data: BOUNDARY_HIERARCHY_TYPE_DATA } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "HierarchySchema" }], {
    select: (data) => {
      return data?.["HCM-ADMIN-CONSOLE"]?.HierarchySchema?.find(
        (item) => item.type === "microplan"
      );
    },
  },{schemaCode:"BASE_MASTER_DATA_INITIAL"});

  const BOUNDARY_HIERARCHY_TYPE = BOUNDARY_HIERARCHY_TYPE_DATA?.hierarchy;
  useEffect(() => {
    if (BOUNDARY_HIERARCHY_TYPE_DATA?.lowestHierarchy) {
      setLowestHierarchy(BOUNDARY_HIERARCHY_TYPE_DATA.lowestHierarchy);
    }
  }, [BOUNDARY_HIERARCHY_TYPE_DATA]);
  
  const relationshipParams = useMemo(() => ({
    BOUNDARY_HIERARCHY_TYPE,
    tenantId,
  }), [BOUNDARY_HIERARCHY_TYPE, tenantId]);

  const hierarchyData = Digit.Hooks.campaign.useBoundaryRelationshipSearch(relationshipParams);

  const moduleCode = useMemo(() => [
    "Microplanning",
    "campaignmanager",
    "workbench",
    "mdms",
    "schema",
    "hcm-admin-schemas"
  ], []);

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
});

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
  AddColumns,
  AddColumnsWrapper,
  HeaderComp,
  FormulaView,
  FormulaSection,
  SummaryScreen,
  CampaignBoundary,
  UserAccessWrapper,
  AssumptionsList,
  FormulaConfigScreen,
  FacilityPopup,
  VillageHierarchyTooltipWrapper,
  UserAccessMgmt,
  UserAccessMgmtTableWrapper,
  DataMgmtComponent,
  ShowMoreWrapper,
  MapViewComponent,
  BoundaryFilter,
  BaseMapSwitcher,
  CustomScaleControl,
  MapFilterIndex,
  FilterSection,
  ChoroplethSelection,
  CampaignCard,
  MapViewPopup  
};

export const initMicroplanComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
