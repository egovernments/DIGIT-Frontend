import { Header, InboxSearchComposer } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import facilityMappingConfig from "../../configs/FacilityMappingConfig";
import { Loader, ActionBar, Button } from "@egovernments/digit-ui-components";
import WorkflowCommentPopUp from "../../components/WorkflowCommentPopUp";

const FacilityCatchmentMapping = () => {
  const [actionBarPopUp, setactionBarPopUp] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  const config = facilityMappingConfig();
  const url = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((roleData) => roleData?.code);


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
  };

  const { isLoading, data, isFetching, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);


  const { isLoading: isLoadingPlanObject, data: planObject, error: errorPlan, refetch: refetchPlan } = Digit.Hooks.microplanv1.useSearchPlanConfig(
    {
      PlanConfigurationSearchCriteria: {
        tenantId,
        id: url?.microplanId,
      },
    },
    {
      enabled: isRootApprover && data?.TotalCount === 0,
    }
  );


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


  if (isPlanEmpSearchLoading || isLoading || isLoadingPlanObject)
    return <Loader />

  return (
    <React.Fragment>
      <Header>{t("MICROPLAN_ASSIGN_CATCHMENT_VILLAGES")}</Header>
      <div className="inbox-search-wrapper">
        <InboxSearchComposer
          configs={config}
        ></InboxSearchComposer>
      </div>

      {isRootApprover && data?.TotalCount === 0 &&
        <ActionBar
          actionFields={[
            <Button icon="CheckCircle" label={t(`HCM_MICROPLAN_FINALIZE_FACILITY_TO_VILLAGE_ASSIGNMENT`)} onClick={handleActionBarClick} type="button" variation="primary" />,
          ]}
          className=""
          maxActionFieldsAllowed={5}
          setactionFieldsToRight
          sortActionFields
          style={{}}
        />}

      {actionBarPopUp && (
        <WorkflowCommentPopUp
          onClose={closeActionBarPopUp}
          heading={t(`HCM_MICROPLAN_FINALIZE_FACILITY_TO_VILLAGE_ASSIGNMENT`)}
          submitLabel={t(`HCM_MICROPLAN_FINALIZE_FACILITY_TO_VILLAGE_ASSIGNMENT`)}
          url="/plan-service/config/_update"
          requestPayload={{ PlanConfiguration: updateWorkflowForFooterAction() }}
          commentPath="workflow.comment"
          onSuccess={(data) => {
            history.push(`/${window.contextPath}/employee/microplan/village-finalise-success`, {
              // fileName: 'filename', // need to update when api is success
              message: "VILLAGE_ASSIGNED_TO_FACILITIES_SUCCESSFUL",
              back: "GO_BACK_TO_HOME",
              backlink: `/${window.contextPath}/employee`
            });
          }}
        />
      )}
    </React.Fragment>
  );
};

export default FacilityCatchmentMapping;
