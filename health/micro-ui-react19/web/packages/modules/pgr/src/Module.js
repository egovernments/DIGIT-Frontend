import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

import { pgr as PGRHooks } from "./hooks";
import { UICustomizations } from "./configs/UICustomizations";
import PGRCard from "./components/PGRCard";
import TimeLine from "./components/TimeLine";
import Complaint from "./components/Complaint";
import { FormComposer } from "./components/FormComposer";

import { ComplaintDetails } from "./pages/employee/ComplaintDetails";
import { CreateComplaint as CreateComplaintEmp } from "./pages/employee/CreateComplaint";
import Inbox from "./pages/employee/Inbox";
import InboxV2 from "./pages/employee/new-inbox";
import ResponseEmp from "./pages/employee/Response";

import { CreateComplaint as CreateComplaintCitizen } from "./pages/citizen/Create";
import { ComplaintsList } from "./pages/citizen/ComplaintsList";
import ComplaintDetailsPage from "./pages/citizen/ComplaintDetails";
import SelectRating from "./pages/citizen/Rating/SelectRating";
import RatingAndFeedBack from "./pages/citizen/Rating/Rating";
import ResponseCitizen from "./pages/citizen/Response";
import CitizenPGRApp from "./pages/citizen";
import EmployeePGRApp from "./pages/employee";

import { LOCALE } from "./constants/Localization";
import { PGR_CITIZEN_CREATE_COMPLAINT } from "./constants/Citizen";

const PGRModule = ({ stateCode, userType }) => {
  const language = Digit.StoreData.getCurrentLanguage();
  const moduleCode = "PGR";
  const { isLoading } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) return <Loader />;

  Digit.SessionStorage.set("PGR_STATE_CODE", stateCode);

  return userType === "citizen" ? <CitizenPGRApp /> : <EmployeePGRApp />;
};

const PGRLinks = ({ matchPath }) => {
  const { t } = useTranslation();
  const [, , clearParams] = Digit.Hooks.useSessionStorage(PGR_CITIZEN_CREATE_COMPLAINT, {});

  // Clear any stale session state when user lands on the home card
  const { CitizenHomeCard, ComplaintIcon } = Digit?.ComponentRegistryService?.getComponent("CitizenHomeCard") ? {} : {};

  const links = [
    { link: `${matchPath}/create-complaint/complaint-type`, i18nKey: t("CS_COMMON_FILE_A_COMPLAINT") },
    { link: `${matchPath}/complaints`, i18nKey: t(LOCALE.MY_COMPLAINTS) },
  ];

  const CitizenHomeCardComp = Digit.ComponentRegistryService.getComponent("CitizenHomeCard");
  const ComplaintIconComp = Digit.ComponentRegistryService.getComponent("ComplaintIcon");

  return CitizenHomeCardComp ? (
    <CitizenHomeCardComp header={t(LOCALE.HOME_COMPLAINTS)} links={links} Icon={ComplaintIconComp} />
  ) : null;
};

// All components registered globally — looked up at runtime via
// Digit.ComponentRegistryService.getComponent("key")
const componentsToRegister = {
  PGRModule,
  PGRLinks,
  PGRCard,
  PGRTimeLine: TimeLine,
  PGRComplaint: Complaint,
  PGRFormComposer: FormComposer,
  // Employee pages
  PGRComplaintDetails: ComplaintDetails,
  PGRCreateComplaintEmp: CreateComplaintEmp,
  PGRInbox: Inbox,
  PGRInboxV2: InboxV2,
  PGRResponseEmp: ResponseEmp,
  // Citizen pages
  PGRCreateComplaintCitizen: CreateComplaintCitizen,
  PGRComplaintsList: ComplaintsList,
  PGRComplaintDetailsPage: ComplaintDetailsPage,
  PGRSelectRating: SelectRating,
  PGRRatingAndFeedBack: RatingAndFeedBack,
  PGRResponseCitizen: ResponseCitizen,
};

const setupLibraries = (Library, service, method) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library][service] = method;
};

// Register all PGR hooks on Digit.Hooks.pgr
const overrideHooks = () => {
  Object.entries(PGRHooks).forEach(([method, fn]) => {
    setupLibraries("Hooks", "pgr", {
      ...(window.Digit?.Hooks?.pgr || {}),
      [method]: fn,
    });
  });
};

// Merge UICustomizations into the global config (same pattern as campaign-manager)
const updateCustomConfigs = () => {
  setupLibraries("Customizations", "commonUiConfig", {
    ...window?.Digit?.Customizations?.commonUiConfig,
    ...UICustomizations,
  });
};

// Called by parent app (src/index.js) after initLibraries()
export const initPGRComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
