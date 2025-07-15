import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState, useEffect ,useMemo} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import facilityMappingConfig from "../../configs/FacilityMappingConfig";
import { Loader, ActionBar, Button } from "@egovernments/digit-ui-components";
import WorkflowCommentPopUp from "../../components/WorkflowCommentPopUp";
import ConfirmationPopUp from "../../components/ConfirmationPopUp";
import GenericKpiFromDSS from "../../components/GenericKpiFromDSS";

const FacilityCatchmentMapping = () => {
  const [actionBarPopUp, setactionBarPopUp] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const url = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((roleData) => roleData?.code);
  const FacilityPopUp = Digit.ComponentRegistryService.getComponent("FacilityPopup");
  const [projectType, setProjectType] = useState('');
  const [disabledAction, setDisabledAction] = useState(false);
  const [censusQueryName, setCensusQueryName] = useState("censusData");
  const [refreshKey, setRefreshKey] = useState(() => Digit.SessionStorage.get("FACILITY_POPUP_KEY"));
  // Check if the user has the 'rootfacilitycatchmentmapper' role
  const isRootApprover = userRoles?.includes("ROOT_FACILITY_CATCHMENT_MAPPER");

  const {
    isLoading: isPlanEmpSearchLoading,
    data: planEmployee,
    error: planEmployeeError,
    refetch: refetchPlanEmployee,
  } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
    tenantId: tenantId,
    body: {
      PlanEmployeeAssignmentSearchCriteria: {
        tenantId: tenantId,
        active: true,
        planConfigurationId: url?.microplanId,
        employeeId: [user?.info?.uuid],
      },
    },
    config: {
      enabled: isRootApprover,
    },
  });

  const {
    isLoading: isLoadingCampaignObject,
    data: campaignObject,
    error: errorCampaign,
    refetch: refetchCampaign,
  } = Digit.Hooks.microplanv1.useSearchCampaign(
    {
      CampaignDetails: {
        tenantId,
        ids: [url?.campaignId],
      },
    },
    {
      enabled: url?.campaignId ? true : false,
    }
  );

  // Custom hook to fetch census data based on microplanId 
  const reqCriteriaResource = {
    url: `/census-service/_search`,
    body: {
      CensusSearchCriteria: {
        tenantId: tenantId,
        facilityAssigned: false,
        source: url?.microplanId,
        jurisdiction: planEmployee?.planData?.[0]?.jurisdiction,
      },
    },
    config: {
      enabled: planEmployee?.planData?.[0]?.jurisdiction ? true : false,
    },
    changeQueryName: censusQueryName
  };

  const { isLoading, data, isFetching, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);

  const { isLoading: isLoadingPlanObject, data: planObject, refetch:refetchPlan } = Digit.Hooks.microplanv1.useSearchPlanConfig(
    {
      PlanConfigurationSearchCriteria: {
        tenantId,
        id: url?.microplanId,
      },
    }
  );

  useEffect(() => {
    // Handler function to call on event dispatch
    const handleRefetch = () => {
      refetch(); // Triggers the custom hook's refetch
    };

    // Add the event listener
    window.addEventListener('refreshKeyUpdated', handleRefetch);

    // Cleanup to avoid memory leaks
    return () => {
      window.removeEventListener('refreshKeyUpdated', handleRefetch);
    };
  }, [refetch]); // refetchPlan is stable, good to list



  const planFacilitySearchConfig = {
    url: "/plan-service/plan/facility/_search",
    body: {
      PlanFacilitySearchCriteria: {
        tenantId: tenantId,
        planConfigurationId: url?.microplanId,
      }
    },
  };


  const { isLoading: isPlanFacilityLoading, data: planFacility } = Digit.Hooks.useCustomAPIHook(planFacilitySearchConfig);



   // fetch the process instance for the current microplan to check if we need to disabled actions or not
   const { isLoading:isProcessLoading, data: processData, } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-workflow-v2/egov-wf/process/_search",
    params: {
        tenantId: tenantId,
        history: true,
        businessIds: url?.microplanId,
    },
    config: {
        enabled: true,
        select: (data) => {
          return data?.ProcessInstances;
      },
    },
  });


  useEffect(() => {
    if (processData && processData.some((instance) => instance.action === "FINALIZE_CATCHMENT_MAPPING")) {
      setDisabledAction(true);
    }
  }, [processData]);

  useEffect(() => {
    // refreshing the screen to get the updated assigned villages count
    const handleRefreshKeyUpdate = () => {
      const updatedKey = Digit.SessionStorage.get("FACILITY_POPUP_KEY");
      setRefreshKey(updatedKey);
    };
  
    window.addEventListener("refreshKeyUpdated", handleRefreshKeyUpdate);
  
    return () => {
      window.removeEventListener("refreshKeyUpdated", handleRefreshKeyUpdate);
    };
  }, []);

  const handleActionBarClick = () => {
    setactionBarPopUp(true);
  };

  const closeActionBarPopUp = () => {
    setactionBarPopUp(false);
  };

  const updateWorkflowForFooterAction = () => {
    const updatedPlanConfig = {
      ...planObject,
      workflow: {
        ...planObject?.workflow,  // Keep existing workflow properties if any
        action: "FINALIZE_CATCHMENT_MAPPING",
      },
    };

    return updatedPlanConfig;
  };

  // Effect to update projectType based on campaign data
  useEffect(() => {
    if (campaignObject?.projectType) {
      setProjectType(campaignObject?.projectType);
    }
  }, [campaignObject]);


  const config = useMemo(() => facilityMappingConfig(projectType, disabledAction), [projectType, disabledAction]);

  if (isPlanEmpSearchLoading || isLoading || isLoadingPlanObject || isLoadingCampaignObject || isProcessLoading ||isPlanFacilityLoading)
    return <Loader />

  //role and name of User extracted

  const roles=Digit.UserService.getUser().info.roles;
  const userName=Digit.UserService.getUser().info.name;
  let userRole = "";

  roles.forEach(role => {
    if (role.code === "ROOT_FACILITY_CATCHMENT_MAPPER") {
      userRole = "ROOT_FACILITY_CATCHMENT_MAPPER";
    } else if (userRole!== "ROOT_FACILITY_CATCHMENT_MAPPER" && role.code === "FACILITY_CATCHMENT_MAPPER") {
      userRole = "FACILITY_CATCHMENT_MAPPER";
    
  }});

 



  return (
    <div key={refreshKey} style={{ marginBottom: (isRootApprover && data?.TotalCount === 0 && planObject?.status === "CENSUS_DATA_APPROVED") || ((!isRootApprover && data?.TotalCount === 0) || disabledAction) ? "2.5rem" : "0rem" }}>
      <Header styles={{ marginBottom: "1rem" }}>{t("MICROPLAN_ASSIGN_CATCHMENT_VILLAGES")}</Header>
      <div className="role-summary-sub-heading" style={{ marginBottom: "1.5rem" }}>
        <div className="mp-heading-bold">
          {`${t("HCM_MICROPLAN_MICROPLAN_NAME_LABEL")}: ${planObject?.name || t("NO_NAME_AVAILABLE")}`}
        </div>
        <div>
          {`${t("LOGGED_IN_AS")} ${userName} - ${t(userRole)}${planEmployee?.planData?.[0]?.hierarchyLevel ? 
            ` (${t(planEmployee.planData[0].hierarchyLevel.toUpperCase())})` : ""}`}
        </div>

      </div>
      <div style={{ marginBottom: "1rem" }}>
        <GenericKpiFromDSS module="MICROPLAN-FACILITY" planId={url?.microplanId} campaignType={campaignObject?.projectType} planEmployee={planEmployee} />
      </div>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer
          configs={config}
        ></InboxSearchComposer>
      </div>

      {isRootApprover && data?.TotalCount === 0 && planObject?.status === "CENSUS_DATA_APPROVED" &&
        <ActionBar
          actionFields={[
            <Button icon="CheckCircle" label={t(`HCM_MICROPLAN_FINALIZE_FACILITY_TO_VILLAGE_ASSIGNMENT`)}  title={t(`HCM_MICROPLAN_FINALIZE_FACILITY_TO_VILLAGE_ASSIGNMENT`)} onClick={handleActionBarClick} type="button" variation="primary" />,
          ]}
          className=""
          maxActionFieldsAllowed={5}
          setactionFieldsToRight
          sortActionFields
          style={{}}
        />}

      {((!isRootApprover && data?.TotalCount === 0) || disabledAction)  &&
        <ActionBar
          actionFields={[
            <Button icon={"ArrowBack"} label={t(`GO_BACK_TO_HOME`)} title={t(`GO_BACK_TO_HOME`)} onClick={() => history.push(`/${window.contextPath}/employee`)} type="button" variation="primary" />,
          ]}
          setactionFieldsToRight
          sortActionFields
        />}


      {actionBarPopUp && (
        <ConfirmationPopUp
          onClose={closeActionBarPopUp}
          alertHeading={t(`HCM_MICROPLAN_FINALIZE_FACILITY_TO_VILLAGE_ASSIGNMENT_ALERT_HEADING`)}
          alertMessage={`${t("HCM_MICROPLAN_FINALIZE_FACILITY_TO_VILLAGE_ASSIGNMENT_ALERT_PREFIX_MESSAGE")} ${planFacility?.TotalCount} ${t("FINALIZED_MIDDLE_MASSAGE")} ${data?.StatusCount?.["VALIDATED"]} ${t("HCM_MICROPLAN_FINALIZE_FACILITY_TO_VILLAGE_ASSIGNMENT_ALERT_SUFFIX_MESSAGE")}`}
          submitLabel={t(`HCM_MICROPLAN_FINALIZE_FACILITY_TO_VILLAGE_ASSIGNMENT_SUBMIT_ACTION`)}
          cancelLabel={t(`HCM_MICROPLAN_FINALIZE_FACILITY_TO_VILLAGE_ASSIGNMENT_CANCEL_ACTION`)}
          url="/plan-service/config/_update"
          requestPayload={{ PlanConfiguration: updateWorkflowForFooterAction() }}
          onSuccess={(data) => {
            history.push(`/${window.contextPath}/employee/microplan/village-finalise-success`, {
              info:"MP_PLAN_MICROPLAN_NAME",
              fileName: data?.PlanConfiguration?.[0]?.name,
              message: t(`VILLAGE_ASSIGNED_TO_FACILITIES_SUCCESSFUL`),
              back: t(`GO_BACK_TO_HOME`),
              backlink: `/${window.contextPath}/employee`
            });
          }}
        />
      )}
    </div>
  );
};

export default FacilityCatchmentMapping;
