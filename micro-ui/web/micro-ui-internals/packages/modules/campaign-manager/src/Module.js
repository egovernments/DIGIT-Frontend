import { TourProvider } from "@egovernments/digit-ui-react-components";
import { Loader } from "@egovernments/digit-ui-components";
import React from "react";
// import { useRouteMatch } from "react-router-dom";
import EmployeeApp from "./pages/employee";
import { CustomisedHooks } from "./hooks";
import { UICustomizations } from "./configs/UICustomizations";
import CampaignCard from "./components/CampaignCard";
import CycleConfiguration from "./pages/employee/CycleConfiguration";
import DeliverySetup from "./pages/employee/deliveryRule";
import CampaignDates from "./components/CampaignDates";
import CampaignType from "./components/CampaignType";
import CampaignName from "./components/CampaignName";
import MyCampaign from "./pages/employee/MyCampaign";
import CampaignSummary from "./components/CampaignSummary";
import CycleDetaisPreview from "./components/CycleDetaisPreview";
import Response from "./pages/employee/Response";
import UploadData from "./components/UploadData";
import CampaignSelection from "./components/CampaignType";
import CampaignDocumentsPreview from "./components/CampaignDocumentsPreview";
import AddProduct from "./pages/employee/AddProduct";
import AddProductField from "./components/AddProductField";
import CycleDataPreview from "./components/CycleDataPreview";
import { ErrorBoundary } from "@egovernments/digit-ui-components";
import CampaignResourceDocuments from "./components/CampaignResourceDocuments";
import ConfigureApp from "./pages/employee/ConfigureApp";
import TimelineComponent from "./components/TimelineComponent";
import { DSSCard } from "./components/DSSCard";
import UpdateDatesWithBoundaries from "./pages/employee/UpdateDatesWithBoundaries";
import DateWithBoundary from "./components/DateWithBoundary";
import BoundaryWithDate from "./components/BoundaryWithDate";
import DateAndCycleUpdate from "./pages/employee/DateAndCycleUpdate";
import { CreateChecklist } from "./pages/employee/CreateChecklist";
import CreateQuestionContext from "./components/CreateQuestionContext";
import SearchChecklist from "./pages/employee/SearchChecklist";
import DeliveryDetailsSummary from "./components/DeliveryDetailsSummary";
import DataUploadSummary from "./components/DataUploadSummary";
import CampaignDetailsSummary from "./components/CampaignDetailsSummary";
import BoundaryDetailsSummary from "./components/BoundaryDetailsSummary";
import UpdateBoundary from "./pages/employee/UpdateCampaign";
import UpdateBoundaryWrapper from "./components/UpdateBoundaryWrapper";
// import SelectingBoundaryComponent from "./components/SelectingBoundaryComponent";
import { Wrapper } from "./components/SelectingBoundaryComponent";
import SelectingBoundariesDuplicate from "./components/SelectingBoundariesDuplicate";
import CampaignUpdateSummary from "./components/CampaignUpdateSummary";
import XlsPreview from "./components/XlsPreview";
import BulkUpload from "./components/BulkUpload";
import BoundarySummary from "./components/BoundarySummary";
import GeoPode from "./pages/employee/BoundaryRelationCreate";
import ViewBoundary from "./pages/employee/ViewBoundary";
import ViewHierarchy from "./pages/employee/ViewHierarchy";
import MultiSelectDropdown from "./components/MultiSelectDropdown";
import NoResultsFound from "./components/NoResultsFound";
import UploadDataMappingWrapper from "./components/UploadDataMappingWrapper";
import DataUploadWrapper from "./components/DataUploadWrapper";
import DateSelection from "./components/CreateCampaignComponents/DateSelection";
import ViewDetailComponent from "./components/CreateCampaignComponents/ViewDetailComponent";
//App config import
import AppPreview from "./components/AppPreview";
import CycleSelection from "./components/CreateCampaignComponents/CycleSelection";
import HCMMyCampaignRowCard from "./components/HCMMyCampaignRowCard";
import MyCampaignNew from "./pages/employee/MyCampaignNew";
import AppConfigurationTabLayer from "./pages/employee/appConfigurationRedesign/AppConfigurationTabLayer";
import QRButton from "./components/CreateCampaignComponents/QRButton";
import EqualHeightWrapper from "./components/CreateCampaignComponents/WrapperModuleCard";
import CampaignNameInfo from "./components/CreateCampaignComponents/CampaignNameInfo";
/**
 * MDMS Module name
 */
export const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";

/**
 * The CampaignModule function fetches store data based on state code, module code, and language, and
 * renders the EmployeeApp component within a TourProvider component if the data is not loading.
 * @returns The CampaignModule component returns either a Loader component if data is still loading, or
 * a TourProvider component wrapping an EmployeeApp component with specific props passed to it.
 */
const CampaignModule = React.memo(({ stateCode, userType, tenants }) => {
  const tenantId = Digit?.ULBService?.getCurrentTenantId();
  const moduleName = Digit.Utils.campaign.getModuleName();
  const { data: BOUNDARY_HIERARCHY_TYPE, isLoading: hierarchyLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "HierarchySchema",
        filter: `[?(@.type=='${moduleName}')]`,
      },
    ],
    {
      select: (data) => {
        return data?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.[0]?.hierarchy;
      },
    },
    { schemaCode: "HierarchySchema" }
  );

  const hierarchyData = Digit.Hooks.campaign.useBoundaryRelationshipSearch({ BOUNDARY_HIERARCHY_TYPE, tenantId });
  const modulePrefix = "hcm";

  const moduleCode = BOUNDARY_HIERARCHY_TYPE
    ? [`boundary-${BOUNDARY_HIERARCHY_TYPE}`]
    : ["campaignmanager", "schema", "admin-schemas", "checklist", "appconfiguration", "dummy-module"];

  // const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <ErrorBoundary moduleName="CAMPAIGN">
      <TourProvider>
        <EmployeeApp BOUNDARY_HIERARCHY_TYPE={BOUNDARY_HIERARCHY_TYPE} stateCode={stateCode} userType={userType} hierarchyData={hierarchyData} />
      </TourProvider>
    </ErrorBoundary>
  );
});

const componentsToRegister = {
  CampaignModule: CampaignModule,
  CampaignCard: CampaignCard,
  UploadData,
  DeliveryRule: DeliverySetup,
  CycleConfiguration: CycleConfiguration,
  CampaignDates,
  CampaignType,
  CampaignName,
  MyCampaign,
  CampaignSummary,
  CycleDetaisPreview,
  Response,
  CampaignSelection,
  CampaignDocumentsPreview: CampaignDocumentsPreview,
  AddProduct,
  AddProductField,
  CycleDataPreview,
  CampaignResourceDocuments,
  ConfigureApp,
  DSSCard,
  UpdateDatesWithBoundaries,
  DateWithBoundary,
  BoundaryWithDate,
  DateAndCycleUpdate,
  TimelineComponent,
  CreateChecklist,
  CreateQuestion: CreateQuestionContext,
  SearchChecklist,
  DeliveryDetailsSummary,
  DataUploadSummary,
  CampaignDetailsSummary,
  BoundaryDetailsSummary,
  Wrapper,
  UpdateBoundary,
  UpdateBoundaryWrapper,
  SelectingBoundariesDuplicate,
  BulkUpload,
  CampaignUpdateSummary,
  XlsPreview,
  MultiSelectDropdownBoundary: MultiSelectDropdown,
  GeoPode,
  ViewBoundary,
  ViewHierarchy,
  BoundarySummary,
  NoResultsFound,
  UploadDataMappingWrapper,
  DataUploadWrapper,
  AppPreview,
  AppConfigurationParentRedesign: AppConfigurationTabLayer,
  DateSelection,
  ViewDetailComponent,
  CycleSelection,
  HCMMyCampaignRowCard,
  MyCampaignNew,
  QRButton,
  EqualHeightWrapper,
  CampaignNameInfo,
};

const overrideHooks = () => {
  Object.keys(CustomisedHooks).map((ele) => {
    if (ele === "Hooks") {
      Object.keys(CustomisedHooks[ele]).map((hook) => {
        Object.keys(CustomisedHooks[ele][hook]).map((method) => {
          setupHooks(hook, method, CustomisedHooks[ele][hook][method]);
        });
      });
    } else if (ele === "Utils") {
      Object.keys(CustomisedHooks[ele]).map((hook) => {
        Object.keys(CustomisedHooks[ele][hook]).map((method) => {
          setupHooks(hook, method, CustomisedHooks[ele][hook][method], false);
        });
      });
    } else {
      Object.keys(CustomisedHooks[ele]).map((method) => {
        setupLibraries(ele, method, CustomisedHooks[ele][method]);
      });
    }
  });
};

/* To Overide any existing hook we need to use similar method */
const setupHooks = (HookName, HookFunction, method, isHook = true) => {
  window.Digit = window.Digit || {};
  window.Digit[isHook ? "Hooks" : "Utils"] = window.Digit[isHook ? "Hooks" : "Utils"] || {};
  window.Digit[isHook ? "Hooks" : "Utils"][HookName] = window.Digit[isHook ? "Hooks" : "Utils"][HookName] || {};
  window.Digit[isHook ? "Hooks" : "Utils"][HookName][HookFunction] = method;
};
/* To Overide any existing libraries  we need to use similar method */
const setupLibraries = (Library, service, method) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library][service] = method;
};

/* To Overide any existing config/middlewares  we need to use similar method */
const updateCustomConfigs = () => {
  setupLibraries("Customizations", "commonUiConfig", { ...window?.Digit?.Customizations?.commonUiConfig, ...UICustomizations });
  // setupLibraries("Utils", "parsingUtils", { ...window?.Digit?.Utils?.parsingUtils, ...parsingUtils });
};

/**
 * The `initCampaignComponents` function initializes campaign components by overriding hooks, updating
 * custom configurations, and registering components.
 */
const initCampaignComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export { initCampaignComponents };
