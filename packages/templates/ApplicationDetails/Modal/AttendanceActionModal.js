import React, { useState, useEffect, Fragment } from "react";
import _ from "lodash";
import { Loader, Modal, FormComposer,WorkflowModal } from "@egovernments/digit-ui-react-components";
import { configAttendanceApproveModal, configAttendanceRejectModal, configAttendanceCheckModal } from "../config";
import getModalConfig from "../config/AttendanceSaveConfig";
const Heading = (props) => {
  return <h1 className={props.className ? `heading-m ${props.className}` : "heading-m"}>{props.label}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const AttendanceActionModal = ({ t, action, tenantId, state, id, closeModal, submitAction, actionData, applicationData, businessService, moduleCode,applicationDetails,workflowDetails, saveAttendanceState,approverList}) => {
  
  const [config, setConfig] = useState({});
  const [modalSubmit,setModalSubmit] = useState(false)
  const userUuid = Digit.UserService.getUser()?.info.uuid;
  const { isLoading, data:employeeData } = Digit.Hooks.hrms.useHRMSSearch(
    { uuids : userUuid }, tenantId
  );

  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [selectedApprover, setSelectedApprover] = useState({});
  const empData =  employeeData?.Employees[0]
  const empDepartment = empData?.assignments?.[0]?.department ? t(`COMMON_MASTERS_DEPARTMENT_${empData?.assignments?.[0]?.department}`) : t('NA')
  const empDesignation = empData?.assignments?.[0]?.designation ? t(`COMMON_MASTERS_DESIGNATION_${empData?.assignments?.[0]?.designation}`) : t('NA')
  const empName = empData?.user?.name || t('NA')

  useEffect(() => {
    setModalConfig(
        getModalConfig({
            t,
            approverList,
            selectedApprover,
            setSelectedApprover,
        })
    )

  }, [])

  const onModalSubmit = ({comments}) => {
    //here we have access to action, selectedApprover, action
    submitBasedOnAction(action, comments)
    
  }

  useEffect(() => {
    const selectedAction = action?.action
    switch(selectedAction) {
      case "VERIFY":
        submitBasedOnAction(action, 'Verify muster roll')
        break;
      case "REJECT":
        setConfig(
          configAttendanceRejectModal({
            t,
            action,
            empDepartment,
            empDesignation,
            empName
          })
        )
        break;
      case "APPROVE":
        setConfig(
          configAttendanceApproveModal({
            t,
            action
          })
        )
        break;
      case "RE-SUBMIT":
        submitBasedOnAction(action, 'Resubmit muster roll')
        break;
      case "SAVE":
        setShowModal(true)
        //submitBasedOnAction(action, 'Muster roll Re-Submitted')
        break;
      default:
        break
    }
  }, [employeeData, action]);

  function onSubmit (data) {
    
    submitBasedOnAction(action, data?.comments)
  }

  const submitBasedOnAction = (action, comments) => {
    //passing complete muster object with updated additionalDetails
    let musterRoll = updateMusterObject(applicationDetails)
    let workflow = { action: action?.action, comment: (comments || `${action?.action} done`), assignees: selectedApprover.uuid ? [selectedApprover.uuid] : [] }

    const selectedAction = action?.action
    switch(selectedAction) {
      case "SAVE":
        musterRoll.individualEntries = saveAttendanceState?.updatePayload
        workflow.action = 'RE-SUBMIT'
        break;
      case "RESUBMIT":
        musterRoll.additionalDetails = { computeAttendance : true } 
        break;
      default:
        break;
    }
    const dataTobeSubmitted = {musterRoll, workflow}
    submitAction(dataTobeSubmitted)
  }

  const updateMusterObject = (data) => {
    let musterRoll = data?.applicationDetails?.[0]?.applicationData
    musterRoll = { ...musterRoll, 
                    additionalDetails: { 
                      projectName: 'Building Walls', assignee: 'John Doe', amount: 5000, billType: 'Work Order', projectId : 'PR/2022-23/03/001111', ...musterRoll.additionalDetails }
                  }
    return musterRoll
  }

  const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
    setModalSubmit(formData?.acceptTerms)
  }

  const cardStyle = () => {
    if(config.label.heading === "Processing Details") {
      return {
        "padding" : "0px"
      }
    }
    return {}
  }
  
  if(action && modalConfig?.form && showModal ) {
    return <WorkflowModal
      closeModal={() => setShowModal(false)}
      onSubmit={onModalSubmit}
      config={modalConfig}
    />
  }

  if(action?.action === "SAVE" && !config?.form) {
    return <></>
  }

  

  return action && config?.form ? (
    <Modal
      headerBarMain={<Heading label={t(config.label.heading)} className="header-left-margin" />}
      headerBarMainStyle={{marginLeft:"15px"}}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config.label.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={() => {}}
      formId="modal-action"
      isDisabled = { action?.action === 'APPROVE' ? !modalSubmit : false }
    >
      <FormComposer
        config={config.form}
        noBoxShadow
        inline
        childrenAtTheBottom
        onSubmit={onSubmit}
        formId="modal-action"
        cardStyle = {cardStyle()}
        onFormValueChange={onFormValueChange}
        
      />
    </Modal>
  ) : (
    <Loader />
  );
}

export default AttendanceActionModal