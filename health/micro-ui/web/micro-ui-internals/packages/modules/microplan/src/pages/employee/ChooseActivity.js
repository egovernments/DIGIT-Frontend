import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Loader, SVG } from "@egovernments/digit-ui-react-components";
import ActivityHomeCard from "../../components/ActivityCard";


const ChooseActivity = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { campaignId, microplanId,  } = Digit.Hooks.useQueryParams();
    const tenantId = Digit.ULBService.getStateId();
    const userInfo = Digit.UserService.getUser();
    const [activityCardData, setActivityCardData] = useState([]);



    const { isLoading: isLoadingPlanObject, data: planObject, refetch: refetchPlanObject} = Digit.Hooks.microplanv1.useSearchPlanConfig(
        {
          PlanConfigurationSearchCriteria: {
            tenantId,
            id: microplanId,
          },
        },
        {
          enabled: true,
        }
    );

  //   // Watch for campaignId or microplanId changes to trigger the fetch
    useEffect(() => {
     refetchPlanObject();
     refetchProcessInstance();
  }, [microplanId, campaignId]);

    const { isLoading: isBusinessServiceLoading, data: workflowDataSample, } = Digit.Hooks.useCustomAPIHook({
        url: "/egov-workflow-v2/egov-wf/businessservice/_search",
        params: {
          tenantId: tenantId,
          businessServices: "PLAN_CONFIGURATION",
        },
        config: {
          enabled: !isLoadingPlanObject && (planObject !== null || planObject !== undefined ),
          select: (data) => {
            const service = data.BusinessServices?.[0];
            const matchingState = service?.states.find((state) => state.applicationStatus === planObject?.status);
            return matchingState || null;
          },
        },
      });

    // fetch the process instance for the current microplan to check if current process is done or not
      const { isLoading:isProcessLoading, data: processData, revalidate, refetch:refetchProcessInstance } = Digit.Hooks.useCustomAPIHook({
        url: "/egov-workflow-v2/egov-wf/process/_search",
        params: {
            tenantId: tenantId,
            history: true,
            businessIds: microplanId,
        },
        config: {
            enabled: true,
            select: (data) => {
              return data?.ProcessInstances;
          },
        },
      });


      useEffect(() => {
        if(planObject && workflowDataSample && processData){
          const updatedActivityCardData = [
            {
              name: "VALIDATE_N_APPROVE_POPULATION_DATA",
              link: `pop-inbox?campaignId=${campaignId}&microplanId=${microplanId}`,
              doneLabel: isProcessDone(processData, "APPROVE_CENSUS_DATA") && "CENSUS_VALIDATED_LABEL",
              icon: <SVG.Population height="36" width="36" fill={isCardDisabled(["POPULATION_DATA_APPROVER", "ROOT_POPULATION_DATA_APPROVER"], isProcessDone(processData, "APPROVE_CENSUS_DATA"), ["EXECUTION_TO_BE_DONE","CENSUS_DATA_APPROVAL_IN_PROGRESS"]) ? "#C5C5C5" : "#C84C0E"}/>,
              disable: isCardDisabled(["POPULATION_DATA_APPROVER", "ROOT_POPULATION_DATA_APPROVER"], isProcessDone(processData, "APPROVE_CENSUS_DATA"), ["EXECUTION_TO_BE_DONE","CENSUS_DATA_APPROVAL_IN_PROGRESS"]),
              optionKey: "VALIDATE_N_APPROVE_POPULATION_DATA"
            },
            {
              name: "ASSIGN_FACILITIES_TO_VILLAGE",
              link: `assign-facilities-to-villages?campaignId=${campaignId}&microplanId=${microplanId}`,
              doneLabel: isProcessDone(processData, "FINALIZE_CATCHMENT_MAPPING") && "FACILITY_CATCHEMENT_DONE_LABEL",
              icon: <SVG.AssignmentTurnedIn height="36" width="36" fill={isCardDisabled(["FACILITY_CATCHMENT_MAPPER", "ROOT_FACILITY_CATCHMENT_MAPPER"], isProcessDone(processData, "FINALIZE_CATCHMENT_MAPPING"), ["CENSUS_DATA_APPROVED"]) ? "#C5C5C5" : "#C84C0E"} />,
              disable: isCardDisabled(["FACILITY_CATCHMENT_MAPPER", "ROOT_FACILITY_CATCHMENT_MAPPER"], isProcessDone(processData, "FINALIZE_CATCHMENT_MAPPING"), ["CENSUS_DATA_APPROVED"]),
              optionKey: "ASSIGN_FACILITIES_TO_VILLAGE"
            },
            {
              name: "VALIDATE_N_APPROVE_MICROPLAN_ESTIMATIONS",
              link: `plan-inbox?campaignId=${campaignId}&microplanId=${microplanId}`,
              doneLabel: isProcessDone(processData, "APPROVE_ESTIMATIONS") && "ESTIMATIONS_APPROVED_LABEL",
              icon: <SVG.FactCheck height="36" width="36" fill={isCardDisabled(["PLAN_ESTIMATION_APPROVER", "ROOT_PLAN_ESTIMATION_APPROVER"], isProcessDone(processData, "APPROVE_ESTIMATIONS"), ["RESOURCE_ESTIMATION_IN_PROGRESS"]) ? "#C5C5C5" : "#C84C0E"} />,
              disable: isCardDisabled(["PLAN_ESTIMATION_APPROVER", "ROOT_PLAN_ESTIMATION_APPROVER"], isProcessDone(processData, "APPROVE_ESTIMATIONS"), ["RESOURCE_ESTIMATION_IN_PROGRESS"]),
              optionKey: "VALIDATE_N_APPROVE_MICROPLAN_ESTIMATIONS"
            },
            // {
            //   name: "GEOSPATIAL_MAP_VIEW",
            //   link: `map-view?campaignId=${campaignId}&microplanId=${microplanId}`,
            //   icon: <SVG.LocationOn height="36" width="36" fill={isCardDisabled(["POPULATION_DATA_APPROVER","ROOT_POPULATION_DATA_APPROVER","FACILITY_CATCHMENT_MAPPER","ROOT_FACILITY_CATCHMENT_MAPPER","MICROPLAN_VIEWER","PLAN_ESTIMATION_APPROVER", "ROOT_PLAN_ESTIMATION_APPROVER"], workflowData, ["RESOURCE_ESTIMATION_IN_PROGRESS","RESOURCE_ESTIMATIONS_APPROVED"]) ? "#C5C5C5" : "#C84C0E"}/>,
            //   disable: isCardDisabled(["POPULATION_DATA_APPROVER","ROOT_POPULATION_DATA_APPROVER","FACILITY_CATCHMENT_MAPPER","ROOT_FACILITY_CATCHMENT_MAPPER","MICROPLAN_VIEWER","PLAN_ESTIMATION_APPROVER", "ROOT_PLAN_ESTIMATION_APPROVER"], workflowData, ["RESOURCE_ESTIMATION_IN_PROGRESS","RESOURCE_ESTIMATIONS_APPROVED"]),
            //   optionKey: "GEOSPATIAL_MAP_VIEW"
            // },
          ];
          setActivityCardData(updatedActivityCardData);
        }
     }, [planObject, workflowDataSample, processData]);


// Merged function to disable a card based on user roles 
const isCardDisabled = (validRoles = [], isProcessDone, validStatuses = [],) => {
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code) || [];

  // Check if user has any valid roles
  const hasValidRole = validRoles?.length > 0 && validRoles?.some(role => userRoles.includes(role));

  const hasValidCurrentStatus = validStatuses?.includes(planObject?.status);

  // Disable if either hasValidRole or hasValidNextAction is false
  return !(hasValidRole &&(isProcessDone || hasValidCurrentStatus) /*hasValidNextAction*/ );
};


// Function to check if process is done for the current card
const isProcessDone = (ProcessInstances, process) => {
  // Iterate over each process instance in the array
  return ProcessInstances.some((instance) => instance.action === process);
};

// Usage in activityCardData
    

    const updatePlan = async (req) => {
      const planRes = await Digit.CustomService.getResponse({
        url: "/plan-service/config/_update",
        body: {
          PlanConfiguration: req,
        },
      });
      return planRes;
    };

    const onClickCard = async (card) => {
      try {
        if(card.optionKey==="VALIDATE_N_APPROVE_POPULATION_DATA" && planObject.status==="EXECUTION_TO_BE_DONE"){
          // here update plan config
          await updatePlan({
            ...planObject,
            workflow:{
              action:"START_DATA_APPROVAL"
            }
          });
          setTimeout(() => {
            card.link ? history.push(card.link) : location.assign(card.locate);
          }, 3000);
        } else {
          card.link ? history.push(card.link) : location.assign(card.locate);
        }  
      } catch (error) {
        console.error("ERROR_OCCURED_WHILE_UPDATING_PLAN");
        console.error(error);
      }
    }

    if(isLoadingPlanObject || isBusinessServiceLoading || isProcessLoading){
      return <Loader/>;
    }

    return (
        <React.Fragment>
            <ActivityHomeCard title={t("SELECT_AN_ACTIVITY_TO_CONTINUE")} module={activityCardData} onClickCard={onClickCard}microplanName={planObject?.name}/>
        </React.Fragment>
    );
}

export default ChooseActivity;