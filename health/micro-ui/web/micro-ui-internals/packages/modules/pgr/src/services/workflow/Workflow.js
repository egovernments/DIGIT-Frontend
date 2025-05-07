import Urls from "../../utils/urls";
import { Request } from "@egovernments/digit-ui-libraries";


const makeCommentsSubsidariesOfPreviousActions = async (wf) => {
  const TimelineMap = new Map();
  // const tenantId = wf?.[0]?.tenantId;
  // let fileStoreIdsList = [];
  // let res = {};

  for (const eventHappened of wf) {
    if (eventHappened?.documents) {
      eventHappened.thumbnailsToShow = await getThumbnails(eventHappened?.documents?.map(e => e?.fileStoreId), eventHappened?.tenantId, eventHappened?.documents)
    }
    if (eventHappened.action === "COMMENT") {
      const commentAccumulator = TimelineMap.get("pgrCommentStack") || []
      TimelineMap.set("pgrCommentStack", [...commentAccumulator, eventHappened])
    }
    else {
      const eventAccumulator = TimelineMap.get("pgrActions") || []
      const commentAccumulator = TimelineMap.get("pgrCommentStack") || []
      eventHappened.wfComments = [...commentAccumulator, ...eventHappened.comment ? [eventHappened] : []]
      TimelineMap.set("pgrActions", [...eventAccumulator, eventHappened])
      TimelineMap.delete("pgrCommentStack")
    }
  }
  const response = TimelineMap.get("pgrActions")
  return response
};
export const WorkflowService = {
    init: (stateCode, businessServices) => {
        return Request({
          url: Urls.workflow.businessServiceSearch,
          useCache: true,
          method: "POST",
          params: { tenantId: stateCode, businessServices },
          auth: true,
        });
      },
      getByBusinessId: (stateCode, businessIds, params = {}, history = true) => {
        return Request({
          url: Urls.WorkFlowProcessSearch,
          useCache: false,
          method: "POST",
          params: { tenantId: stateCode, businessIds: businessIds, ...params, history },
          auth: true,
        });
      },
    getDetailsById: async ({ tenantId, id, moduleCode, role, }) => {
        const workflow = await WorkflowService.getByBusinessId(tenantId, id);
        const applicationProcessInstance = cloneDeep(workflow?.ProcessInstances);
        const moduleCodeData = getLocationDetails ? applicationProcessInstance?.[0]?.businessService : moduleCode;
        const businessServiceResponse = (await WorkflowService.init(tenantId, moduleCodeData))?.BusinessServices[0]?.states;
        if (workflow && workflow.ProcessInstances) {
          const processInstances = workflow.ProcessInstances;
          const nextStates = processInstances[0]?.nextActions.map((action) => ({ action: action?.action, nextState: processInstances[0]?.state.uuid }));
          const nextActions = nextStates.map((id) => ({
            action: id.action,
            state: businessServiceResponse?.find((state) => state.uuid === id.nextState),
          }));
    
          /* To check state is updatable and provide edit option*/
          const currentState = businessServiceResponse?.find((state) => state.uuid === processInstances[0]?.state.uuid);
          if (currentState && currentState?.isStateUpdatable) {
            nextActions.push({ action: "EDIT", state: currentState });
          }
    
          const getStateForUUID = (uuid) => businessServiceResponse?.find((state) => state.uuid === uuid);
    
          const actionState = businessServiceResponse
            ?.filter((state) => state.uuid === processInstances[0]?.state.uuid)
            .map((state) => {
              let _nextActions = state.actions?.map?.((ac) => {
                let actionResultantState = getStateForUUID(ac.nextState);
                let assignees = actionResultantState?.actions?.reduce?.((acc, act) => {
                  return [...acc, ...act.roles];
                }, []);
                return { ...actionResultantState, assigneeRoles: assignees, action: ac.action, roles: ac.roles };
              });
              if(state?.isStateUpdatable) {
                _nextActions.push({ action: "EDIT", ...state, roles: state?.actions?.[0]?.roles})
              }
              return { ...state, nextActions: _nextActions, roles: state?.action, roles: state?.actions?.reduce((acc, el) => [...acc, ...el.roles], []) };
            })?.[0];
    
          // HANDLING ACTION for NEW VEHICLE LOG FROM UI SIDE
    
          const actionRolePair = nextActions?.map((action) => ({
            action: action?.action,
            roles: action.state?.actions?.map((action) => action.roles).join(","),
          }));
    
          if (processInstances.length > 0) {
            const TLEnrichedWithWorflowData = await makeCommentsSubsidariesOfPreviousActions(processInstances)
            let timeline = TLEnrichedWithWorflowData.map((instance, ind) => {
              let checkPoint = {
                performedAction: instance.action,
                status: moduleCode === "BS.AMENDMENT" ? instance.state.state :instance.state.applicationStatus,
                state: instance.state.state,
                assigner: getAssignerDetails(instance, TLEnrichedWithWorflowData[ind - 1], moduleCode),
                rating: instance?.rating,
                wfComment: instance?.wfComments.map(e => e?.comment),
                wfDocuments: instance?.documents,
                thumbnailsToShow: { thumbs: instance?.thumbnailsToShow?.thumbs, fullImage: instance?.thumbnailsToShow?.images },
                assignes: instance.assignes,
                caption: instance.assignes ? instance.assignes.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
                auditDetails: {
                  created: Digit.DateUtils.ConvertEpochToDate(instance.auditDetails.createdTime),
                  lastModified: Digit.DateUtils.ConvertEpochToDate(instance.auditDetails.lastModifiedTime),
                  lastModifiedEpoch: instance.auditDetails.lastModifiedTime,
                },
                timeLineActions: instance.nextActions
                  ? instance.nextActions.filter((action) => action.roles.includes(role)).map((action) => action?.action)
                  : null,
              };
              return checkPoint;
            });
    
            const nextActions = actionRolePair;
    
            if (role !== "CITIZEN" && moduleCode === "PGR") {
              const onlyPendingForAssignmentStatusArray = timeline?.filter(e => e?.status === "PENDINGFORASSIGNMENT")
              const duplicateCheckpointOfPendingForAssignment = onlyPendingForAssignmentStatusArray.at(-1)
              // const duplicateCheckpointOfPendingForAssignment = timeline?.find( e => e?.status === "PENDINGFORASSIGNMENT")
              timeline.push({
                ...duplicateCheckpointOfPendingForAssignment,
                status: "COMPLAINT_FILED",
              });
            }
    
            const details = {
              timeline,
              nextActions,
              actionState,
              applicationBusinessService: workflow?.ProcessInstances?.[0]?.businessService,
              processInstances: applicationProcessInstance,
            };
            return details;
          }
        } else {
          throw new Error("error fetching workflow services");
        }
        return {};
      },
}