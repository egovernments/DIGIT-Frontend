import React, { useState, useEffect } from 'react';

// Importing configuration for modal
import configModal from './modalConfig';
import Modal from './Modal';

// External components
import { Loader, FormComposerV2, TextBlock } from '@egovernments/digit-ui-components';
import { useParams } from 'react-router-dom';

// Basic heading component
const Heading = (props) => {
    return <h1 className="heading-m">{props.label}</h1>;
};

// SVG Close icon
const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
);

// Close button wrapper
const CloseBtn = (props) => {
    return (
        <div className="icon-bg-secondary" onClick={props.onClick}>
            <Close />
        </div>
    );
};

// Payload builder for submitting workflow actions
const updatePayload = (applicationDetails, data, action, businessService) => {
    const workflow = {
        comment: data.comments,
        documents: data?.document
            ? Object.values(data?.document).flat().map((document) => {
                  return {
                      documentType: action?.action + " DOC",
                      fileName: document?.[1]?.file?.name,
                      fileStoreId: document?.[1]?.fileStoreId?.fileStoreId,
                      documentUid: document?.[1]?.fileStoreId?.fileStoreId,
                      tenantId: document?.[1]?.fileStoreId?.tenantId,
                  };
              })
            : [],
        assignees: data?.assignee?.uuid ? [data?.assignee?.uuid] : null,
        action: action.action,
        businessService: businessService,
    };

    // Remove null or empty properties from workflow
    Object.keys(workflow).forEach((key) => {
        if (!workflow[key] || workflow[key]?.length === 0) delete workflow[key];
    });

    applicationDetails = { ...applicationDetails, workflow };
    return {
        Application: applicationDetails,
    };
};

const WorkflowPopup = ({ applicationDetails, ...props }) => {
    const { action, tenantId, t, closeModal, submitAction, businessService, moduleCode } = props;
    const { module, service } = useParams();
    const serviceCode = `${module.toUpperCase()}.${service.toUpperCase()}`;


    // Enable assignee dropdown based on config
    const enableAssignee = true;

    const [config, setConfig] = useState(null); // Form config
    const [modalSubmit, setModalSubmit] = useState(true); // Toggle for enabling/disabling submit

    // Get HRMS employee list
    let { isLoading: isLoadingHrmsSearch, data: assigneeOptions } = Digit.Hooks.hrms.useHRMSSearch(
        { roles: action?.roles?.toString(), isActive: true, tenantId: tenantId },
        tenantId,
        null,
        null,
        { enabled: action?.roles?.length > 0 && enableAssignee }
    );

    assigneeOptions = assigneeOptions?.Employees;
    // Add fallback name
    assigneeOptions?.forEach((emp) => (emp.nameOfEmp = emp?.user?.name || t("ES_COMMON_NA")));

    // Request criteria for Document config
    // const requestCriteria = {
    //     url: "/egov-mdms-service/v1/_search",
    //     body: {
    //         MdmsCriteria: {
    //             tenantId: Digit.ULBService.getCurrentTenantId(),
    //             moduleDetails: [
    //                 {
    //                     moduleName: "DigitStudio",
    //                     masterDetails: [
    //                         {
    //                             name: "DocumentConfig2",
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //     },
    //     changeQueryName: "documentConfig",
    // };

    // // Load Document config
    // const { isLoading, data } = Digit.Hooks.useCustomAPIHook(requestCriteria);

    const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

    const serviceconfigrequestCriteria = {
        url: `/${mdms_context_path}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: Digit.ULBService.getCurrentTenantId(),
            schemaCode: "Studio.ServiceConfiguration",
            filters:{
              module:moduleCode
            }
          },
        },
      };
      const { isLoading: moduleListLoading, data:serviceconfig } = Digit.Hooks.useCustomAPIHook(serviceconfigrequestCriteria);
    // Check if all fields are hidden
    const hasVisibleFields = (config) => {
        if (!config?.form) return false;

        return config.form.some(section =>
            section.body?.some(field => !field.populators?.hideInForm)
        );
    };

    // Set config when HRMS and MDMS data is available
    useEffect(() => {
        if (serviceconfig) {
            setConfig(
                configModal(
                    t,
                    action,
                    assigneeOptions?.length >= 0 ? assigneeOptions : undefined,
                    businessService,
                    moduleCode,
                    serviceconfig?.mdms?.filter((ob) => ob?.uniqueIdentifier.toUpperCase() === serviceCode)?.[0]?.data?.documents
                )
            );
        }
    }, [assigneeOptions, serviceconfig]);

    // Form submit handler
    const _submit = (data) => {
        const customPayload = updatePayload(applicationDetails, data, action, businessService);
        submitAction(customPayload, action);
    };

    // Optional: to enable or disable modal submit dynamically
    const modalCallBack = (setValue, formData) => {
        Digit?.Customizations?.["commonUiConfig"]?.enableModalSubmit(businessService, action, setModalSubmit, formData);
    };

    if (isLoadingHrmsSearch || moduleListLoading) return <Loader />;

    const showConfirmationMessage = config && !hasVisibleFields(config);

    return action && config?.form ? (
        <Modal
            headerBarMain={<Heading label={t(config.label.heading)} />}
            headerBarEnd={<CloseBtn onClick={closeModal} />}
            actionCancelLabel={t(config.label.cancel)}
            actionCancelOnSubmit={closeModal}
            actionSaveLabel={t(config.label.submit)}
            headerBarMainStyle={{justifyContent: "space-between"}}
            style={{height: "revert"}}
            actionSaveOnSubmit={() => {
                // if (showConfirmationMessage) {
                    _submit({});
                // }
            }}
            formId="modal-action"
            isDisabled={!modalSubmit}
        >
            {showConfirmationMessage ? (
                <div style={{
                    paddingBottom: "20px",
                    textAlign: "center"
                }}>
                    <TextBlock body={t("WF_CONFIRMATION_MESSAGE_ARE_YOU_SURE")}/>
                </div>
            ) : (
                <FormComposerV2
                    config={config.form}
                    noBoxShadow
                    inline
                    childrenAtTheBottom
                    onSubmit={_submit}
                    defaultValues={{}}
                    formId="modal-action"
                    onFormValueChange={modalCallBack}
                />
            )}
        </Modal>
    ) : (
        <Loader />
    );
};

export default WorkflowPopup;
