import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { HeaderComponent, Button, Card, Footer, ActionBar, SummaryCard, Tag, Timeline, Toast } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-react-components";
import { convertEpochFormateToDate } from "../../utils";
import TimelineWrapper from "../../components/TimeLineWrapper";
import PGRWorkflowModal from "../../components/PGRWorkflowModal";
import Urls from "../../utils/urls";

// Define your action configurations (can be moved to a separate file)
const ACTION_CONFIGS = [
  {
    actionType: "ASSIGN",
    formConfig: {
      label: {
        heading: "CS_ACTION_ASSIGN",
        cancel: "CORE_COMMON_CANCEL",
        submit: "CORE_COMMON_SUBMIT",
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
                validation: {
                  required: true,
                },
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
        cancel: "CORE_COMMON_CANCEL",
        submit: "CORE_COMMON_SUBMIT",
      },
      form: [
        {
          body: [
            // {
            //   type: "component",
            //   isMandatory: true,
            //   component: "RejectionReasonsComponent",
            //   key: "SelectedReason",
            //   label: "CS_COMMON_SELECTED_REASON",
            //   populators: { name: "SelectedReason" },
            // },
            {
              isMandatory: true,
              key: "SelectedReason",
              type: "dropdown",
              label: "CS_MANDATORY_REJECTION_REASON",
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
                validation: {
                  required: true,
                },
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
        cancel: "CORE_COMMON_CANCEL",
        submit: "CORE_COMMON_SUBMIT",
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
                validation: {
                  required: true,
                },
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
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  const { id } = useParams();
  const [selectedAction, setSelectedAction] = useState(null);
  const [toast, setToast] = useState({ show: false, label: "", type: "" });
  const userInfo = Digit.UserService.getUser();

  const UpdateComplaintSession = Digit.Hooks.useSessionStorage("COMPLAINT_UPDATE", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = UpdateComplaintSession;
  const { isLoading: isMDMSLoading, data: serviceDefs } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "RAINMAKER-PGR",
    [{ name: "ServiceDefs" }],
    {
      cacheTime: Infinity,
      select: (data) => {
        return data?.["RAINMAKER-PGR"]?.ServiceDefs;
      },
    },
    { schemaCode: "SERVICE_DEFS_MASTER_DATA" } //mdmsv2
  );

  const { isLoading, isError, error, data, revalidate: pgrSearchRevalidate } = Digit.Hooks.pgr.usePGRSearch({ serviceRequestId: id }, tenantId);
  const { mutate: UpdateComplaintMutation } = Digit.Hooks.pgr.usePGRUpdate(tenantId);

  // const { isLoading: isWo, isError: IsWOerror, error : woError , data : WoData, } = Digit.Hooks.pgr.useWorkflowDetails({id, tenantId, moduleCode: "PGR", role: "EMPLOYEE", config: { enabled: !!id }});

  const { isLoading: isWorkflowLoading, data: workflowData, revalidate: workFlowRevalidate } = Digit.Hooks.useCustomAPIHook({
    url: "/egov-workflow-v2/egov-wf/process/_search",
    params: {
      tenantId: tenantId,
      history: true,
      businessIds: id,
    },
    config: {
      enabled: true,
    },
    changeQueryName: id,
  });

  const { isLoading: isBusinessServiceLoading, data: businessServiceData } = Digit.Hooks.useCustomAPIHook({
    url: Urls.workflow.businessServiceSearch,
    params: {
      tenantId: tenantId,
      businessServices: "PGR",
    },
    config: {
      enabled: true,
    },
  });

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
  const handleActionSubmit = (_data) => {
    
    // Add your API call logic here
    const updateRequest = {
      service: {
        ...data?.ServiceWrappers[0].service,
      },
      workflow: {
        action: selectedAction.action,
        assignes: _data?.SelectedAssignee?.userServiceUUID ? [_data?.SelectedAssignee?.userServiceUUID] : null,
        hrmsAssignes: _data?.SelectedAssignee?.uuid ? [_data?.SelectedAssignee?.uuid] : null,
        comments: _data?.SelectedComments || "",
      },
    };

    handleResponseForUpdateComplaint(updateRequest);
  };

  const refreshData = async () => {
    await pgrSearchRevalidate();
    await workFlowRevalidate();
  };

  const handleResponseForUpdateComplaint = async (payload) => {
    debugger;
    setOpenModal(false);
    await UpdateComplaintMutation(payload, {
      onError: async (error, variables) => {
        setToast(() => ({ show: true, label: t("FAILED_TO_UPDATE_COMPLAINT"), type: "error" }));
      },
      onSuccess: async (responseData, variables) => {
        const msg = payload.workflow.action || "RESOLVE";

        if (responseData?.ResponseInfo?.Errors) {
          setToast(() => ({ show: true, label: t("FAILED_TO_UPDATE_COMPLAINT"), type: "error" }));
        } else {
          setToast(() => ({ show: true, label: t(`${msg}_SUCCESSFULLY`), type: "success" }));
          await refreshData();
          clearSessionFormData();
        }
      },
    });
  };

  const getUpdatedConfig = (selectedAction, workflowData, configs, serviceDefs, complaintData) => {
    const actionConfig = configs.find((config) => config.actionType === selectedAction.action);
    const department = serviceDefs?.find((def) => def.serviceCode === complaintData?.ServiceWrappers[0]?.service?.serviceCode)?.department;

    if (!actionConfig) return null;

    const roles = selectedAction?.roles || [];

    const updatedConfig = {
      ...actionConfig.formConfig,
      form: actionConfig.formConfig.form.map((formItem) => ({
        ...formItem,
        body: formItem.body.map((bodyItem) => ({
          ...bodyItem,
          populators: {
            ...bodyItem.populators,
            roles: roles,
            department: department,
          },
        })),
      })),
    };

    return updatedConfig;
  };

  const getNextActionOptions = (workflowData, businessServiceResponse) => {
    const currentState = workflowData?.ProcessInstances?.[0]?.state;
    const matchingState = businessServiceResponse?.states?.find((state) => state.uuid === currentState?.uuid);

    if (!matchingState) return [];

    const userRoles = userInfo?.info?.roles?.map((role) => role.code) || [];

    const actions = matchingState.actions
      ? matchingState.actions
          .filter((action) => action.roles.some((role) => userRoles.includes(role)))
          .map((action) => ({
            action: action.action,
            roles: action.roles,
            nextState: action.nextState,
            uuid: action.uuid,
          }))
      : [];

    return actions;
  };

  if (isLoading || isMDMSLoading || isWorkflowLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div
        style={
          false ? { marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000" } : { marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }
        }
      >
        <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
          {t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS")}
        </HeaderComponent>
      </div>

      <div>
        <SummaryCard
          asSeperateCards
          className=""
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
                  value: data?.ServiceWrappers[0].service?.serviceRequestId || "NA",
                },
                {
                  inline: true,
                  label: t("CS_COMPLAINT_DETAILS_COMPLAINT_TYPE"),
                  type: "text",
                  value: t(data?.ServiceWrappers[0].service?.serviceCode || "NA"),
                },
                {
                  inline: true,
                  label: t("CS_COMPLAINT_FILED_DATE"),
                  value: convertEpochFormateToDate(data?.ServiceWrappers[0].service?.auditDetails?.createdTime) || t("NA"),
                },
                {
                  inline: true,
                  label: t("CS_COMPLAINT_DETAILS_AREA"),
                  value: t(data?.ServiceWrappers[0].service?.address?.locality?.code || "NA"),
                },
                {
                  inline: true,
                  label: t("CS_COMPLAINT_DETAILS_CURRENT_STATUS"),
                  value: t(`CS_COMPLAINT_STATUS_${data?.ServiceWrappers[0].service?.applicationStatus || "NA"}`),
                },
                {
                  inline: true,
                  label: t("CS_COMPLAINT_LANDMARK__DETAILS"),
                  value: data?.ServiceWrappers[0].service?.address?.landmark || "NA",
                },
                {
                  inline: true,
                  label: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS_DESCRIPTION"),
                  value: data?.ServiceWrappers[0].service?.description || "NA",
                },
                {
                  inline: true,
                  label: t("CORE_LOGIN_USERNAME"),
                  value: data?.ServiceWrappers[0].service?.user?.name || "NA",
                },
                {
                  inline: true,
                  label: t("ES_COMMON_CONTACT_DETAILS"),
                  value: data?.ServiceWrappers[0].service?.user?.mobileNumber || "NA",
                },
              ],
              header: "",
              subHeader: "",
            },
            {
              cardType: "primary",
              fieldPairs: [
                {
                  inline: false,
                  label: "",
                  type: "custom",
                  renderCustomContent: (value) => (
                    <TimelineWrapper isWorkFlowLoading={isWorkflowLoading} workflowData={workflowData} businessId={id} labelPrefix="WF_PGR_" />
                  ),
                },
              ],
              header: t("CS_COMPLAINT_DETAILS_COMPLAINT_TIMELINE"),
              subHeader: "",
            },
          ]}
          style={{}}
          subHeader="Subheading"
          type="primary"
        />
      </div>

      {/* Action Bar */}
      {isWorkflowLoading ? (
        <Loader />
      ) : (
        <Footer
          actionFields={[
            <Button
              isDisabled={getNextActionOptions(workflowData, businessServiceData?.BusinessServices?.[0]).length == 0 ? true : false}
              key="action-button"
              className="custom-class"
              isSearchable={true}
              label={t("ES_COMMON_TAKE_ACTION")}
              menuStyles={{
                bottom: "40px",
              }}
              style={{}}
              title=""
              onClick={function noRefCheck() {}}
              onOptionSelect={(selected) => {
                setSelectedAction(selected);
                setOpenModal(true);
              }}
              options={getNextActionOptions(workflowData, businessServiceData?.BusinessServices?.[0])}
              optionsKey="action"
              type="actionButton"
            />,
          ]}
          maxActionFieldsAllowed={5}
          className=""
          setactionFieldsToLeft="Right"
          setactionFieldsToRight
          sortActionFields
          style={{}}
        />
      )}
      {toast?.show && <Toast type={toast?.type} label={toast?.label} isDleteBtn={true} onClose={handleToastClose} />}

      {openModal &&
        selectedAction &&
        (console.log("Attempting to render PGRWorkflowModal"),
        (
          <PGRWorkflowModal
            selectedAction={selectedAction}
            sessionFormData={sessionFormData}
            setSessionFormData={setSessionFormData}
            clearSessionFormData={clearSessionFormData}
            config={getUpdatedConfig(selectedAction, workflowData, ACTION_CONFIGS, serviceDefs, data)}
            closeModal={() => setOpenModal(false)}
            onSubmit={handleActionSubmit}
            popupModuleActionBarStyles={{}}
            popupModuleMianStyles={{}}
          />
        ))}
    </React.Fragment>
  );
};

export default PGRDetails;
