import { TourProvider } from "@egovernments/digit-ui-react-components";
import { Loader } from "@egovernments/digit-ui-components";
import React, { lazy, Suspense } from "react";
// import { useRouteMatch } from "react-router-dom";
import EmployeeApp from "./pages/employee";
import { CustomisedHooks } from "./hooks";
import { UICustomizations } from "./configs/UICustomizations";
import CampaignCard from "./components/CampaignCard";
import CampaignDates from "./components/CampaignDates";
import CampaignType from "./components/CampaignType";
import CampaignName from "./components/CampaignName";
import TimelineComponent from "./components/TimelineComponent";
import { ErrorBoundary } from "@egovernments/digit-ui-components";
import EnhancedLoader, { ComponentLoaders } from "./components/EnhancedLoader";

// LAZY LOADED COMPONENTS - Heavy Excel Processing
const UploadData = lazy(() => import("./components/UploadData"));
const UploadDataMappingWrapper = lazy(() => import("./components/UploadDataMappingWrapper"));
const DataUploadWrapper = lazy(() => import("./components/DataUploadWrapper"));
const XlsPreview = lazy(() => import("./components/XlsPreview"));
const BulkUpload = lazy(() => import("./components/BulkUpload"));

// LAZY LOADED COMPONENTS - Large Page Components  
const MyCampaign = lazy(() => import("./pages/employee/MyCampaign"));
const MyCampaignNew = lazy(() => import("./pages/employee/MyCampaignNew"));
const ConfigureApp = lazy(() => import("./pages/employee/ConfigureApp"));
const CreateChecklist = lazy(() => import("./pages/employee/CreateChecklist").then(module => ({ default: module.CreateChecklist })));
const SearchChecklist = lazy(() => import("./pages/employee/SearchChecklist"));
const UpdateBoundary = lazy(() => import("./pages/employee/UpdateCampaign"));
const ViewBoundary = lazy(() => import("./pages/employee/ViewBoundary"));
const ViewHierarchy = lazy(() => import("./pages/employee/ViewHierarchy"));
const GeoPode = lazy(() => import("./pages/employee/BoundaryRelationCreate"));

// LAZY LOADED COMPONENTS - App Configuration (Heavy)
const AppConfigurationTabLayer = lazy(() => import("./pages/employee/appConfigurationRedesign/AppConfigurationTabLayer"));
const AppPreview = lazy(() => import("./components/AppPreview"));

// LAZY LOADED COMPONENTS - Form Processing
const CycleConfiguration = lazy(() => import("./pages/employee/CycleConfiguration"));
const DeliverySetup = lazy(() => import("./pages/employee/deliveryRule"));
const AddProduct = lazy(() => import("./pages/employee/AddProduct"));
const UpdateDatesWithBoundaries = lazy(() => import("./pages/employee/UpdateDatesWithBoundaries"));
const DateAndCycleUpdate = lazy(() => import("./pages/employee/DateAndCycleUpdate"));

// LAZY LOADED COMPONENTS - Complex UI Components
const CampaignSummary = lazy(() => import("./components/CampaignSummary"));
const MultiSelectDropdown = lazy(() => import("./components/MultiSelectDropdown"));
const Wrapper = lazy(() => import("./components/SelectingBoundaryComponent").then(module => ({ default: module.Wrapper })));

// LAZY LOADED COMPONENTS - Data Processing
const CycleDetaisPreview = lazy(() => import("./components/CycleDetaisPreview"));
const Response = lazy(() => import("./pages/employee/Response"));
const CampaignSelection = lazy(() => import("./components/CampaignType"));
const CampaignDocumentsPreview = lazy(() => import("./components/CampaignDocumentsPreview"));
const AddProductField = lazy(() => import("./components/AddProductField"));
const CycleDataPreview = lazy(() => import("./components/CycleDataPreview"));
const CampaignResourceDocuments = lazy(() => import("./components/CampaignResourceDocuments"));
const DSSCard = lazy(() => import("./components/DSSCard").then(module => ({ default: module.DSSCard })));
const DateWithBoundary = lazy(() => import("./components/DateWithBoundary"));
const BoundaryWithDate = lazy(() => import("./components/BoundaryWithDate"));
const CreateQuestionContext = lazy(() => import("./components/CreateQuestionContext"));
const DeliveryDetailsSummary = lazy(() => import("./components/DeliveryDetailsSummary"));
const DataUploadSummary = lazy(() => import("./components/DataUploadSummary"));
const CampaignDetailsSummary = lazy(() => import("./components/CampaignDetailsSummary"));
const BoundaryDetailsSummary = lazy(() => import("./components/BoundaryDetailsSummary"));
const UpdateBoundaryWrapper = lazy(() => import("./components/UpdateBoundaryWrapper"));
const SelectingBoundariesDuplicate = lazy(() => import("./components/SelectingBoundariesDuplicate"));
const CampaignUpdateSummary = lazy(() => import("./components/CampaignUpdateSummary"));
const BoundarySummary = lazy(() => import("./components/BoundarySummary"));
const NoResultsFound = lazy(() => import("./components/NoResultsFound"));
const DateSelection = lazy(() => import("./components/CreateCampaignComponents/DateSelection"));
const ViewDetailComponent = lazy(() => import("./components/CreateCampaignComponents/ViewDetailComponent"));
const CycleSelection = lazy(() => import("./components/CreateCampaignComponents/CycleSelection"));
const HCMMyCampaignRowCard = lazy(() => import("./components/HCMMyCampaignRowCard"));
const QRButton = lazy(() => import("./components/CreateCampaignComponents/QRButton"));
const EqualHeightWrapper = lazy(() => import("./components/CreateCampaignComponents/WrapperModuleCard"));
const CampaignNameInfo = lazy(() => import("./components/CreateCampaignComponents/CampaignNameInfo"));

// Suspense wrapper for lazy loaded components with enhanced loading
const createLazyComponent = (LazyComponent, componentType = "default") => {
  const getLoader = () => {
    switch (componentType) {
      case 'excel':
        return <ComponentLoaders.ExcelUpload />;
      case 'table':
        return <ComponentLoaders.DataTable />;
      case 'form':
        return <ComponentLoaders.Form />;
      case 'card':
        return <ComponentLoaders.CampaignCard />;
      case 'app-config':
        return <ComponentLoaders.AppConfiguration />;
      case 'map':
        return <ComponentLoaders.MapView />;
      default:
        return <EnhancedLoader page={true} variant={"PageLoader"} showProgress={true} />;
    }
  };

  return React.forwardRef((props, ref) => (
    <Suspense fallback={getLoader()}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};
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

// Critical components that need to be loaded immediately
const criticalComponents = {
  CampaignModule: CampaignModule,
  CampaignCard: CampaignCard,
  CampaignDates,
  CampaignType,
  CampaignName,
  TimelineComponent,
};

// Heavy Excel processing components (lazy loaded with Suspense)
const heavyExcelComponents = {
  UploadData: createLazyComponent(UploadData, 'excel'),
  UploadDataMappingWrapper: createLazyComponent(UploadDataMappingWrapper, 'table'),
  DataUploadWrapper: createLazyComponent(DataUploadWrapper, 'excel'),
  XlsPreview: createLazyComponent(XlsPreview, 'table'),
  BulkUpload: createLazyComponent(BulkUpload, 'excel'),
};

// Large page components (lazy loaded)
const largePageComponents = {
  MyCampaign: createLazyComponent(MyCampaign),
  MyCampaignNew: createLazyComponent(MyCampaignNew),
  ConfigureApp: createLazyComponent(ConfigureApp),
  CreateChecklist: createLazyComponent(CreateChecklist),
  SearchChecklist: createLazyComponent(SearchChecklist),
  UpdateBoundary: createLazyComponent(UpdateBoundary),
  ViewBoundary: createLazyComponent(ViewBoundary),
  ViewHierarchy: createLazyComponent(ViewHierarchy),
  GeoPode: createLazyComponent(GeoPode),
};

// App configuration components (lazy loaded)
const appConfigComponents = {
  AppConfigurationParentRedesign: createLazyComponent(AppConfigurationTabLayer, 'app-config'),
  AppPreview: createLazyComponent(AppPreview, 'app-config'),
};

// Form processing components (lazy loaded)
const formProcessingComponents = {
  DeliveryRule: createLazyComponent(DeliverySetup, 'form'),
  CycleConfiguration: createLazyComponent(CycleConfiguration, 'form'),
  AddProduct: createLazyComponent(AddProduct, 'form'),
  UpdateDatesWithBoundaries: createLazyComponent(UpdateDatesWithBoundaries, 'form'),
  DateAndCycleUpdate: createLazyComponent(DateAndCycleUpdate, 'form'),
};

// Complex UI components (lazy loaded)
const complexUIComponents = {
  CampaignSummary: createLazyComponent(CampaignSummary),
  MultiSelectDropdownBoundary: createLazyComponent(MultiSelectDropdown),
  Wrapper: createLazyComponent(Wrapper),
};

// Data processing components (lazy loaded)
const dataProcessingComponents = {
  CycleDetaisPreview: createLazyComponent(CycleDetaisPreview),
  Response: createLazyComponent(Response),
  CampaignSelection: createLazyComponent(CampaignSelection),
  CampaignDocumentsPreview: createLazyComponent(CampaignDocumentsPreview),
  AddProductField: createLazyComponent(AddProductField),
  CycleDataPreview: createLazyComponent(CycleDataPreview),
  CampaignResourceDocuments: createLazyComponent(CampaignResourceDocuments),
  DSSCard: createLazyComponent(DSSCard),
  DateWithBoundary: createLazyComponent(DateWithBoundary),
  BoundaryWithDate: createLazyComponent(BoundaryWithDate),
  CreateQuestion: createLazyComponent(CreateQuestionContext),
  DeliveryDetailsSummary: createLazyComponent(DeliveryDetailsSummary),
  DataUploadSummary: createLazyComponent(DataUploadSummary),
  CampaignDetailsSummary: createLazyComponent(CampaignDetailsSummary),
  BoundaryDetailsSummary: createLazyComponent(BoundaryDetailsSummary),
  UpdateBoundaryWrapper: createLazyComponent(UpdateBoundaryWrapper),
  SelectingBoundariesDuplicate: createLazyComponent(SelectingBoundariesDuplicate),
  CampaignUpdateSummary: createLazyComponent(CampaignUpdateSummary),
  BoundarySummary: createLazyComponent(BoundarySummary),
  NoResultsFound: createLazyComponent(NoResultsFound),
  DateSelection: createLazyComponent(DateSelection),
  ViewDetailComponent: createLazyComponent(ViewDetailComponent),
  CycleSelection: createLazyComponent(CycleSelection),
  HCMMyCampaignRowCard: createLazyComponent(HCMMyCampaignRowCard),
  QRButton: createLazyComponent(QRButton),
  EqualHeightWrapper: createLazyComponent(EqualHeightWrapper),
  CampaignNameInfo: createLazyComponent(CampaignNameInfo),
};

// Non-critical components grouped by category (all lazy loaded)
const nonCriticalComponents = {
  ...heavyExcelComponents,
  ...largePageComponents,
  ...appConfigComponents,
  ...formProcessingComponents,
  ...complexUIComponents,
  ...dataProcessingComponents,
};

// All components combined (for backward compatibility)
const componentsToRegister = {
  ...criticalComponents,
  ...nonCriticalComponents,
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

// Memoized registration to prevent duplicate calls
const registeredComponents = new Set();

/**
 * Initialize critical campaign components immediately
 */
const initCriticalCampaignComponents = () => {
  console.log("🚀 Initializing critical campaign components...");
  Object.entries(criticalComponents).forEach(([key, value]) => {
    if (!registeredComponents.has(key)) {
      Digit.ComponentRegistryService.setComponent(key, value);
      registeredComponents.add(key);
    }
  });
  console.log(`✅ ${Object.keys(criticalComponents).length} critical campaign components registered`);
};

/**
 * Initialize heavy Excel processing components (lazy loaded)
 */
const initHeavyExcelComponents = () => {
  console.log("📊 Initializing heavy Excel processing components...");
  Object.entries(heavyExcelComponents).forEach(([key, value]) => {
    if (!registeredComponents.has(key)) {
      Digit.ComponentRegistryService.setComponent(key, value);
      registeredComponents.add(key);
    }
  });
  console.log(`✅ ${Object.keys(heavyExcelComponents).length} Excel components registered (lazy loaded)`);
};

/**
 * Initialize large page components (lazy loaded)
 */
const initLargePageComponents = () => {
  console.log("📄 Initializing large page components...");
  Object.entries(largePageComponents).forEach(([key, value]) => {
    if (!registeredComponents.has(key)) {
      Digit.ComponentRegistryService.setComponent(key, value);
      registeredComponents.add(key);
    }
  });
  console.log(`✅ ${Object.keys(largePageComponents).length} page components registered (lazy loaded)`);
};

/**
 * Initialize non-critical campaign components when needed (progressive loading)
 */
const initNonCriticalCampaignComponents = () => {
  console.log("⚙️ Initializing non-critical campaign components...");
  overrideHooks();
  updateCustomConfigs();
  
  // Initialize in batches for better performance
  setTimeout(() => initHeavyExcelComponents(), 0);
  setTimeout(() => initLargePageComponents(), 100);
  
  // Initialize remaining components
  Object.entries(dataProcessingComponents).forEach(([key, value]) => {
    if (!registeredComponents.has(key)) {
      Digit.ComponentRegistryService.setComponent(key, value);
      registeredComponents.add(key);
    }
  });
  
  Object.entries(formProcessingComponents).forEach(([key, value]) => {
    if (!registeredComponents.has(key)) {
      Digit.ComponentRegistryService.setComponent(key, value);
      registeredComponents.add(key);
    }
  });
  
  Object.entries(complexUIComponents).forEach(([key, value]) => {
    if (!registeredComponents.has(key)) {
      Digit.ComponentRegistryService.setComponent(key, value);
      registeredComponents.add(key);
    }
  });
  
  Object.entries(appConfigComponents).forEach(([key, value]) => {
    if (!registeredComponents.has(key)) {
      Digit.ComponentRegistryService.setComponent(key, value);
      registeredComponents.add(key);
    }
  });
  
  console.log(`✅ All non-critical campaign components registered (${Object.keys(nonCriticalComponents).length} components)`);
};

/**
 * The `initCampaignComponents` function initializes all campaign components by overriding hooks, updating
 * custom configurations, and registering components.
 */
const initCampaignComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    if (!registeredComponents.has(key)) {
      Digit.ComponentRegistryService.setComponent(key, value);
      registeredComponents.add(key);
    }
  });
};

export { 
  initCampaignComponents, 
  initCriticalCampaignComponents, 
  initNonCriticalCampaignComponents,
  initHeavyExcelComponents,
  initLargePageComponents
};
