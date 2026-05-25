import Urls from "../../utils/urls";

const makeCommentsSubsidariesOfPreviousActions = (wf) => {
  const TimelineMap = new Map();

  for (const eventHappened of wf) {
    if (eventHappened.action === "COMMENT") {
      const commentAccumulator = TimelineMap.get("pgrCommentStack") || [];
      TimelineMap.set("pgrCommentStack", [...commentAccumulator, eventHappened]);
    } else {
      const eventAccumulator = TimelineMap.get("pgrActions") || [];
      const commentAccumulator = TimelineMap.get("pgrCommentStack") || [];
      eventHappened.wfComments = [...commentAccumulator, ...eventHappened.comment ? [eventHappened] : []];
      TimelineMap.set("pgrActions", [...eventAccumulator, eventHappened]);
      TimelineMap.delete("pgrCommentStack");
    }
  }
  return TimelineMap.get("pgrActions");
};

export const WorkflowService = {
  init: (stateCode, businessServices) => {
    return Digit.CustomService.getResponse({
      url: Urls.workflow.businessServiceSearch,
      useCache: true,
      method: "POST",
      params: { tenantId: stateCode, businessServices },
    });
  },
  getByBusinessId: (stateCode, businessIds, params = {}, history = true) => {
    return Digit.CustomService.getResponse({
      url: Urls.WorkFlowProcessSearch,
      useCache: false,
      method: "POST",
      params: { tenantId: stateCode, businessIds, ...params, history },
    });
  },
  getDetailsById: async ({ tenantId, id, moduleCode, role }) => {
    const workflow = await WorkflowService.getByBusinessId(tenantId, id);
    const applicationProcessInstance = workflow?.ProcessInstances
      ? JSON.parse(JSON.stringify(workflow.ProcessInstances))
      : [];
    const businessServiceResponse = (await WorkflowService.init(tenantId, moduleCode))?.BusinessServices?.[0]?.states;

    if (workflow && workflow.ProcessInstances) {
      const processInstances = workflow.ProcessInstances;
      const nextStates = processInstances[0]?.nextActions?.map((action) => ({
        action: action?.action,
        nextState: processInstances[0]?.state?.uuid,
      }));
      const nextActions = nextStates?.map((id) => ({
        action: id.action,
        state: businessServiceResponse?.find((state) => state.uuid === id.nextState),
      }));

      const currentState = businessServiceResponse?.find((state) => state.uuid === processInstances[0]?.state?.uuid);
      if (currentState && currentState?.isStateUpdatable) {
        nextActions?.push({ action: "EDIT", state: currentState });
      }

      const getStateForUUID = (uuid) => businessServiceResponse?.find((state) => state.uuid === uuid);

      const actionState = businessServiceResponse
        ?.filter((state) => state.uuid === processInstances[0]?.state?.uuid)
        .map((state) => {
          let _nextActions = state.actions?.map((ac) => {
            let actionResultantState = getStateForUUID(ac.nextState);
            let assignees = actionResultantState?.actions?.reduce((acc, act) => [...acc, ...act.roles], []);
            return { ...actionResultantState, assigneeRoles: assignees, action: ac.action, roles: ac.roles };
          });
          if (state?.isStateUpdatable) {
            _nextActions?.push({ action: "EDIT", ...state, roles: state?.actions?.[0]?.roles });
          }
          return { ...state, nextActions: _nextActions, roles: state?.actions?.reduce((acc, el) => [...acc, ...el.roles], []) };
        })?.[0];

      const actionRolePair = nextActions?.map((action) => ({
        action: action?.action,
        roles: action.state?.actions?.map((action) => action.roles).join(","),
      }));

      if (processInstances.length > 0) {
        const TLEnrichedWithWorflowData = makeCommentsSubsidariesOfPreviousActions(processInstances);
        let timeline = TLEnrichedWithWorflowData?.map((instance, ind) => ({
          performedAction: instance.action,
          status: moduleCode === "BS.AMENDMENT" ? instance.state.state : instance.state.applicationStatus,
          state: instance.state.state,
          assigner: null,
          rating: instance?.rating,
          wfComment: instance?.wfComments?.map((e) => e?.comment),
          wfDocuments: instance?.documents,
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
        }));

        if (role !== "CITIZEN" && moduleCode === "PGR") {
          const onlyPendingForAssignmentStatusArray = timeline?.filter((e) => e?.status === "PENDINGFORASSIGNMENT");
          const duplicateCheckpointOfPendingForAssignment = onlyPendingForAssignmentStatusArray?.at(-1);
          timeline?.push({
            ...duplicateCheckpointOfPendingForAssignment,
            status: "COMPLAINT_FILED",
          });
        }

        return {
          timeline,
          nextActions: actionRolePair,
          actionState,
          applicationBusinessService: workflow?.ProcessInstances?.[0]?.businessService,
          processInstances: applicationProcessInstance,
        };
      }
    } else {
      throw new Error("error fetching workflow services");
    }
    return {};
  },
};
