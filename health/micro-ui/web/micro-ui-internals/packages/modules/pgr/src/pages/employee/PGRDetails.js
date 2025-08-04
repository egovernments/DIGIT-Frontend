import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { HeaderComponent, Button, Card, Footer, ActionBar, SummaryCard, Tag, Timeline, Toast, NoResultsFound } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-react-components";
import { convertEpochFormateToDate } from "../../utils";
import TimelineWrapper from "../../components/TimeLineWrapper";
import PGRWorkflowModal from "../../components/PGRWorkflowModal";
import Urls from "../../utils/urls";

// Action configurations used for handling different workflow actions like ASSIGN, REJECT, RESOLVE
// TO DO: Move this to MDMS for handling Action Modal properties
const ACTION_CONFIGS = [
  {
    actionType: "ASSIGN",
    formConfig: {
      label: {
        heading: "CS_ACTION_ASSIGN",
        cancel: "CS_COMMON_CANCEL",
        submit: "CS_COMMON_SUBMIT",
      },
      form: [
        {
          body: [
            {
              type: "component",
              isMandatory: true,
              component: "PGRAssigneeComponent",
              key: "SelectedAssignee",
              label: "CS_COMMON_EMPLOYEE_NAME",
              populators: { name: "SelectedAssignee" },
            },
            {
              type: "textarea",
              isMandatory: true,
              key: "SelectedComments",
              label: "CS_COMMON_EMPLOYEE_COMMENTS",
              populators: {
                name: "SelectedComments",
                maxLength: 1000,
                validation: { required: true },
                error: "CORE_COMMON_REQUIRED_ERRMSG",
              },
            },
          ],
        },
      ],
    },
  },
  {
    actionType: "REJECT",
    formConfig: {
      label: {
        heading: "PGR_ACTION_REJECT",
        cancel: "CS_COMMON_CANCEL",
        submit: "CS_COMMON_SUBMIT",
      },
      form: [
        {
          body: [
            {
              isMandatory: true,
              key: "SelectedReason",
              type: "dropdown",
              label: "CS_REJECT_COMPLAINT",
              disable: false,
              populators: {
                name: "SelectedReason",
                optionsKey: "name",
                error: "Required",
                mdmsConfig: {
                  masterName: "RejectionReasons",
                  moduleName: "RAINMAKER-PGR",
                  localePrefix: "CS_REJECTION_",
                },
              },
            },
            {
              type: "textarea",
              isMandatory: true,
              key: "SelectedComments",
              label: "CS_COMMON_EMPLOYEE_COMMENTS",
              populators: {
                name: "SelectedComments",
                maxLength: 1000,
                validation: { required: true },
                error: "CORE_COMMON_REQUIRED_ERRMSG",
              },
            },
          ],
        },
      ],
    },
  },
  {
    actionType: "RESOLVE",
    formConfig: {
      label: {
        heading: "PGR_ACTION_RESOLVE",
        cancel: "CS_COMMON_CANCEL",
        submit: "CS_COMMON_SUBMIT",
      },
      form: [
        {
          body: [
            {
              type: "textarea",
              isMandatory: true,
              key: "SelectedComments",
              label: "CS_COMMON_EMPLOYEE_COMMENTS",
              populators: {
                name: "SelectedComments",
                maxLength: 1000,
                validation: { required: true },
                error: "CORE_COMMON_REQUIRED_ERRMSG",
              },
            },
          ],
        },
      ],
    },
  },
];

const PGRDetails = () => {
  // Hooks for local state management
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  const { id } = useParams();
  const [selectedAction, setSelectedAction] = useState(null);
  const [toast, setToast] = useState({ show: false, label: "", type: "" });
  const userInfo = Digit.UserService.getUser();

  // Persist session data for complaint update
  const UpdateComplaintSession = Digit.Hooks.useSessionStorage("COMPLAINT_UPDATE", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = UpdateComplaintSession;

  // Load master data from MDMS
  const { isLoading: isMDMSLoading, data: serviceDefs } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "RAINMAKER-PGR",
    [{ name: "ServiceDefs" }],
    {
      cacheTime: Infinity,
      select: (data) => data?.["RAINMAKER-PGR"]?.ServiceDefs,
    },
    { schemaCode: "SERVICE_DEFS_MASTER_DATA" }
  );

  // Fetch complaint details
  const { isLoading, isError, error, data: pgrData, revalidate: pgrSearchRevalidate } = Digit.Hooks.pgr.usePGRSearch({ serviceRequestId: id }, tenantId);

  // Hook to update the complaint
  const { mutate: UpdateComplaintMutation } = Digit.Hooks.pgr.usePGRUpdate(tenantId);

  // Fetch workflow details
  const { isLoading: isWorkflowLoading, data: workflowData, revalidate: workFlowRevalidate } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-workflow-v2/egov-wf/process/_search",
    params: { tenantId, history: true, businessIds: id },
    config: { enabled: true },
    changeQueryName: id,
  });

  // Fetch business service metadata
  const { isLoading: isBusinessServiceLoading, data: businessServiceData } = Digit.Hooks.useCustomAPIHook({
    url: Urls.workflow.businessServiceSearch,
    params: { tenantId, businessServices: "PGR" },
    config: { enabled: true },
  });

  // Automatically dismiss toast messages after 3 seconds
  useEffect(() => {
    if (toast?.show) {
      setTimeout(() => {
        handleToastClose();
      }, 3000);
    }
  }, [toast?.show]);

  const handleToastClose = () => {
    setToast({ show: false, label: "", type: "" });
  };

  // Prepare and submit the update complaint request
  const handleActionSubmit = (_data) => {
    const actionConfig = ACTION_CONFIGS.find((config) => config.actionType === selectedAction.action);

  if (!actionConfig) return;

  const missingFields = [];

  actionConfig.formConfig.form.forEach((section) => {
    section.body.forEach((field) => {
      if (field.isMandatory) {
        const fieldKey = field.key;
        const fieldValue = _data?.[fieldKey];

        // For dropdowns or components, also check if selected value is valid object or string
        const isEmpty =
          fieldValue === undefined ||
          fieldValue === null ||
          (typeof fieldValue === "string" && fieldValue.trim() === "") ||
          (typeof fieldValue === "object" && Object.keys(fieldValue).length === 0);

        if (isEmpty) {
          missingFields.push(t(field.label));
        }
      }
    });
  });

  if (missingFields.length > 0) {
    setToast({
      show: true,
      label: t("CS_COMMON_REQUIRED_FIELDS_MISSING") + ": " + missingFields.join(", "),
      type: "error",
    });
    return;
  }
    const updateRequest = {
      service: { ...pgrData?.ServiceWrappers[0].service },
      workflow: {
        action: selectedAction.action,
        assignes: _data?.SelectedAssignee?.userServiceUUID ? [_data?.SelectedAssignee?.userServiceUUID] : null,
        hrmsAssignes: _data?.SelectedAssignee?.uuid ? [_data?.SelectedAssignee?.uuid] : null,
        comments: _data?.SelectedComments || "",
      },
    };
    handleResponseForUpdateComplaint(updateRequest);
  };

  // Refresh the complaint and workflow data
  const refreshData = async () => {
    await pgrSearchRevalidate();
    await workFlowRevalidate();
  };

  // Handle response after updating complaint
  const handleResponseForUpdateComplaint = async (payload) => {
    setOpenModal(false);
    await UpdateComplaintMutation(payload, {
      onError: () => setToast({ show: true, label: t("FAILED_TO_UPDATE_COMPLAINT"), type: "error" }),
      onSuccess: async (responseData) => {
        const msg = payload.workflow.action || "RESOLVE";
        if (responseData?.ResponseInfo?.Errors) {
          setToast({ show: true, label: t("FAILED_TO_UPDATE_COMPLAINT"), type: "error" });
        } else {
          setToast({ show: true, label: t(`${msg}_SUCCESSFULLY`), type: "success" });
          await refreshData();
          clearSessionFormData();
        }
      },
    });
  };

  // Enhance config with roles and department dynamically
  const getUpdatedConfig = (selectedAction, workflowData, configs, serviceDefs, complaintData) => {
    const actionConfig = configs.find((config) => config.actionType === selectedAction.action);
    const department = serviceDefs?.find((def) => def.serviceCode === complaintData?.ServiceWrappers[0]?.service?.serviceCode)?.department;
    if (!actionConfig) return null;
    const roles = selectedAction?.roles || [];

    return {
      ...actionConfig.formConfig,
      form: actionConfig.formConfig.form.map((formItem) => ({
        ...formItem,
        body: formItem.body.map((bodyItem) => ({
          ...bodyItem,
          populators: {
            ...bodyItem.populators,
            roles,
            department,
          },
        })),
      })),
    };
  };

  // Get list of valid actions for current user and state
  const getNextActionOptions = (workflowData, businessServiceResponse) => {
    const currentState = workflowData?.ProcessInstances?.[0]?.state;
    const matchingState = businessServiceResponse?.states?.find((state) => state.uuid === currentState?.uuid);
    if (!matchingState) return [];
    const userRoles = userInfo?.info?.roles?.map((role) => role.code) || [];
    return matchingState.actions
      ? matchingState.actions.filter((action) => action.roles.some((role) => userRoles.includes(role)))
          .map((action) => ({
            action: action.action,
            roles: action.roles,
            nextState: action.nextState,
            uuid: action.uuid,
          }))
      : [];
  };

  // Display loader until required data loads
  if (isLoading || isMDMSLoading || isWorkflowLoading) return <Loader />;

  return (
    <React.Fragment>
      {/* Header */}
      <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
        {t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS")}
      </HeaderComponent>

      {/* Complaint Summary Card */}
      <div>
        {pgrData?.ServiceWrappers?.length > 0 ? (
          <SummaryCard
            asSeperateCards
            header="Heading"
            layout={1}
            sections={[
              {
                cardType: "primary",
                fieldPairs: [
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_DETAILS_COMPLAINT_NO"),
                    type: "text",
                    value: pgrData?.ServiceWrappers[0].service?.serviceRequestId || "NA",
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_DETAILS_COMPLAINT_TYPE"),
                    type: "text",
                    value: t(pgrData?.ServiceWrappers[0].service?.serviceCode || "NA"),
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_FILED_DATE"),
                    value: convertEpochFormateToDate(pgrData?.ServiceWrappers[0].service?.auditDetails?.createdTime) || t("NA"),
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_DETAILS_AREA"),
                    value: t(pgrData?.ServiceWrappers[0].service?.address?.locality?.code || "NA"),
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_DETAILS_CURRENT_STATUS"),
                    value: t(`CS_COMMON_PGR_STATE_${pgrData?.ServiceWrappers[0].service?.applicationStatus || "NA"}`),
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_LANDMARK__DETAILS"),
                    value: pgrData?.ServiceWrappers[0].service?.address?.landmark || "NA",
                  },
                  {
                    inline: true,
                    label: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS_DESCRIPTION"),
                    value: pgrData?.ServiceWrappers[0].service?.description || "NA",
                  },
                  {
                    inline: true,
                    label: t("COMPLAINTS_COMPLAINANT_NAME"),
                    value: pgrData?.ServiceWrappers[0].service?.user?.name || "NA",
                  },
                  {
                    inline: true,
                    label: t("COMPLAINTS_COMPLAINANT_CONTACT_NUMBER"),
                    value: pgrData?.ServiceWrappers[0].service?.user?.mobileNumber || "NA",
                  },
                ],
              },
              {
                cardType: "primary",
                fieldPairs: [
                  {
                    inline: false,
                    type: "custom",
                    renderCustomContent: () => (
                      <TimelineWrapper isWorkFlowLoading={isWorkflowLoading} workflowData={workflowData} businessId={id} labelPrefix="WF_PGR_" />
                    ),
                  },
                ],
                header: t("CS_COMPLAINT_DETAILS_COMPLAINT_TIMELINE"),
              },
            ]}
            type="primary"
          />
        ) : (
          <NoResultsFound />
        )}
      </div>

      {/* Footer Action Bar */}
      <Footer
      actionFields={[
        <Button 
          className="custom-class"
          isSearchable 
          onClick={function noRefCheck() {}}
          menuStyles={{
                  bottom: "40px",
                }}
          isDisabled={getNextActionOptions(workflowData, businessServiceData?.BusinessServices?.[0]).length === 0}
          key="action-button"
          label={t("ES_COMMON_TAKE_ACTION")}
          onOptionSelect={(selected) => {
            setSelectedAction(selected);
            setOpenModal(true);
          }}
          options={getNextActionOptions(workflowData, businessServiceData?.BusinessServices?.[0])}
          optionsKey="action"
          type="actionButton"
          />,
      ]}
      className=""
      maxActionFieldsAllowed={5}
      setactionFieldsToRight
      sortActionFields
      style={{}}
      />

      {/* Toast Message */}
      {toast?.show && <Toast type={toast?.type} label={toast?.label} isDleteBtn onClose={handleToastClose} />}

      {/* Workflow Modal for Actions */}
      {openModal && selectedAction && (
        <PGRWorkflowModal
          selectedAction={selectedAction}
          sessionFormData={sessionFormData}
          setSessionFormData={setSessionFormData}
          clearSessionFormData={clearSessionFormData}
          config={getUpdatedConfig(selectedAction, workflowData, ACTION_CONFIGS, serviceDefs, pgrData)}
          closeModal={() => setOpenModal(false)}
          onSubmit={handleActionSubmit}
        />
      )}
    </React.Fragment>
  );
};

export default PGRDetails;