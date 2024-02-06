import { useClearNotifications, useEvents, useNotificationCount } from "./events";
import useCreateEvent from "./events/useCreateEvent";
import useUpdateEvent from "./events/useUpdateEvent";
import {
  useBulkPdfDetails,
  useDemandSearch,
  useFetchBillsForBuissnessService,
  useFetchCitizenBillsForBuissnessService,
  useFetchPayment,
  useGetPaymentRulesForBusinessServices,
  usePaymentSearch,
  usePaymentUpdate,
  useRecieptSearch,
} from "./payment";
import { useInitStore } from "./store";
import useAccessControl from "./useAccessControl";
import { useApplicationsForBusinessServiceSearch } from "./useApplicationForBillSearch";
import useClickOutside from "./useClickOutside";
import useCustomMDMS from "./useCustomMDMS";
import useDocumentSearch from "./useDocumentSearch";
import useDynamicData from "./useDynamicData";
import useLocation from "./useLocation";

import useInboxGeneral from "./useInboxGeneral/useInboxGeneral";
import useNewInboxGeneral from "./useInboxGeneral/useNewInbox";
import useBoundaryLocalities from "./useLocalities";
import useCommonMDMS from "./useMDMS";
import useWorkflowDetailsV2 from "./useWorkflowDetailsV2";
import useModuleTenants from "./useModuleTenants";
import useQueryParams from "./useQueryParams";
import useRouteSubscription from "./useRouteSubscription";
import { useUserSearch } from "./userSearch";
import useSessionStorage from "./useSessionStorage";
import useApplicationStatusGeneral from "./useStatusGeneral";
import useStore from "./useStore";
import { useTenants } from "./useTenants";
import useWorkflowDetails from "./workflow";
import useCustomAPIHook from "./useCustomAPIHook";
import useCustomAPIMutationHook from "./useCustomAPIMutationHook";
import useUpdateCustom from "./useUpdateCustom";

import useProjectSearch from "./project/useProjectSearch";
import useViewFinancialDetails from "./project/useViewFinancialDetails";

import useSearchWORKS from "./works/useSearchWORKS";
import useSearchApprovedEstimates from "./works/useSearchApprovedEstimates";
import useViewEstimateDetails from "./works/useViewEstimateDetails";
import useViewProjectDetails from "./works/useViewProjectDetails";
import useViewProjectClosureDetails from "./works/useViewProjectClosureDetails";
import useViewProjectClosureDetailsBills from "./works/useViewProjectClosureBills";
import useViewProjectClosureDetailsClosureChecklist from "./works/useViewProjectClosureDetailsClosureChecklist";
import useViewProjectClosureDetailsKickoffChecklist from "./works/useViewProjectClosureDetailsKickoffChecklist";
import useViewLOIDetails from "./works/useViewLOIDetails";
import useCreateLOI from "./works/useCreateLOI";
import useEstimateSearchWorks from "./works/useSearch";
import useCreateEstimate from "./works/useCreateEstimate";
import useCreateEstimateNew from "./works/useCreateEstimateNew";
import useSearchEstimate from "./works/useSearchEstimate";
import useApplicationActionsLOI from "./works/useApplicationActions";
import useApplicationActionsEstimate from "./works/useUpdateEstimate";
import useUpdateEstimateWorks from "./works/useUpdateEstimate";
import useWorksInbox from "./works/useInbox";
import useKickoffInbox from "./works/useKickoffInbox";
import useCreateProject from "./works/useCreateProject";
import useUpdateProject from "./works/useUpdateProject";

import useComplaintDetails from "./pgr/useComplaintDetails";
import { useComplaintsList, useComplaintsListByMobile } from "./pgr/useComplaintList";
import useComplaintStatus from "./pgr/useComplaintStatus";
import useComplaintStatusCount from "./pgr/useComplaintStatusWithCount";
import useComplaintSubType from "./pgr/useComplaintSubType";
import useComplaintTable from "./pgr/useComplaintTable";
import useComplaintTypes from "./pgr/useComplaintTypes";
import useEmployeeFilter from "./pgr/useEmployeeFilter";
import useInboxData from "./pgr/useInboxData";
import useLocalities from "./pgr/useLocalities";
import useServiceDefs from "./pgr/useServiceDefs";
import usePGRTenants from "./pgr/useTenants";
import useGenderMDMS from "./useGenderMDMS";

import useEmployeeSearch from "./useEmployeeSearch";

import useDashboardConfig from "./dss/useDashboardConfig";
import useDSSDashboard from "./dss/useDSSDashboard";
import useGetChart from "./dss/useGetChart";
import useDssMdms from "./dss/useMDMS";
import useGetCustomFilterValues from "./dss/useGetCustomFilterValues";
import useGetCustomFilterRequestValues from "./dss/useGetCustomFilterRequestValues";

import useHRMSCount from "./hrms/useHRMSCount";
import useHRMSCreate from "./hrms/useHRMScreate";
import useHRMSGenderMDMS from "./hrms/useHRMSGender";
import useHrmsMDMS from "./hrms/useHRMSMDMS";
import useHRMSSearch from "./hrms/useHRMSsearch";
import useHRMSUpdate from "./hrms/useHRMSUpdate";

import useDocCreate from "./engagement/useCreate";
import useDocDelete from "./engagement/useDelete";
import { useEngagementMDMS } from "./engagement/useMdms";
import useDocSearch from "./engagement/useSearch";
import useDocUpdate from "./engagement/useUpdate";
import useEventDetails from "./events/useEventDetails";
import useEventInbox from "./events/useEventInbox";

import useSurveyCreate from "./surveys/useCreate";
import useSurveyDelete from "./surveys/useDelete";
import useSurveySearch from "./surveys/useSearch";
import useSurveyShowResults from "./surveys/useShowResults";
import useSurveySubmitResponse from "./surveys/useSubmitResponse";
import useSurveyInbox from "./surveys/useSurveyInbox";
import useSurveyUpdate from "./surveys/useUpdate";

import useGetDSSAboutJSON from "./useGetDSSAboutJSON";
import useGetDSSFAQsJSON from "./useGetDSSFAQsJSON";
import useGetFAQsJSON from "./useGetFAQsJSON";
import useGetHowItWorksJSON from "./useHowItWorksJSON";
import { usePrivacyContext } from "./usePrivacyContext";
import useStaticData from "./useStaticData";

const pgr = {
  useComplaintDetails,
  useComplaintsList,
  useComplaintsListByMobile,
  useComplaintStatus,
  useComplaintTable,
  useComplaintTypes,
  useEmployeeFilter,
  useInboxData,
  useLocalities,
  useServiceDefs,
  useTenants: usePGRTenants,
  useComplaintSubType,
  useComplaintStatusCount,
};

const project = {
  useViewFinancialDetails,
  useProjectSearch,
};

const works = {
  useViewEstimateDetails,
  useViewProjectDetails,
  useViewProjectClosureDetails,
  useViewProjectClosureDetailsBills,
  useViewProjectClosureDetailsKickoffChecklist,
  useViewProjectClosureDetailsClosureChecklist,
  useViewLOIDetails,
  useCreateLOI,
  useEstimateSearchWorks,
  useSearchWORKS,
  useCreateEstimate,
  useCreateEstimateNew,
  useSearchEstimate,
  useApplicationActionsLOI,
  useUpdateEstimate: useUpdateEstimateWorks,
  useApplicationActionsEstimate,
  useSearchApprovedEstimates,
  useInbox: useWorksInbox,
  useKickoffInbox,
  useCreateProject,
  useUpdateProject,
  useUpdateCustom,
};

const dss = {
  useMDMS: useDssMdms,
  useDashboardConfig,
  useDSSDashboard,
  useGetChart,
  useGetCustomFilterValues,
  useGetCustomFilterRequestValues,
};

const hrms = {
  useHRMSSearch,
  useHrmsMDMS,
  useHRMSCreate,
  useHRMSUpdate,
  useHRMSCount,
  useHRMSGenderMDMS,
};

const events = {
  useInbox: useEventInbox,
  useCreateEvent,
  useEventDetails,
  useUpdateEvent,
};

const engagement = {
  useMDMS: useEngagementMDMS,
  useDocCreate,
  useDocSearch,
  useDocDelete,
  useDocUpdate,
};

const survey = {
  useCreate: useSurveyCreate,
  useUpdate: useSurveyUpdate,
  useDelete: useSurveyDelete,
  useSearch: useSurveySearch,
  useSubmitResponse: useSurveySubmitResponse,
  useShowResults: useSurveyShowResults,
  useSurveyInbox,
};

const Hooks = {
  useSessionStorage,
  useQueryParams,
  useFetchPayment,
  usePaymentUpdate,
  useFetchCitizenBillsForBuissnessService,
  useFetchBillsForBuissnessService,
  useGetPaymentRulesForBusinessServices,
  useWorkflowDetails,
  useInitStore,
  useClickOutside,
  useUserSearch,
  useApplicationsForBusinessServiceSearch,
  useDemandSearch,
  useInboxGeneral,
  useEmployeeSearch,
  useBoundaryLocalities,
  useCommonMDMS,
  useApplicationStatusGeneral,
  useModuleTenants,
  useRecieptSearch,
  usePaymentSearch,
  useNewInboxGeneral,
  useEvents,
  useClearNotifications,
  useNotificationCount,
  useStore,
  useDocumentSearch,
  useTenants,
  useAccessControl,
  usePrivacyContext,
  pgr,
  works,
  dss,
  project,

  hrms,

  events,
  engagement,
  survey,
  useGenderMDMS,
  useRouteSubscription,
  useCustomAPIHook,
  useCustomAPIMutationHook,
  useWorkflowDetailsV2,
  useUpdateCustom,
  useCustomMDMS,
  useGetHowItWorksJSON,
  useGetFAQsJSON,
  useGetDSSFAQsJSON,
  useGetDSSAboutJSON,
  useStaticData,
  useDynamicData,
  useBulkPdfDetails,
  useLocation,
};

export default Hooks;
