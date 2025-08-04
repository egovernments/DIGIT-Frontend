import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormComposerV2,} from '@egovernments/digit-ui-components';
import PropTypes from 'prop-types';
import {  Modal, CloseSvg, Close } from "@egovernments/digit-ui-react-components";


const CloseBtn = (props) => {
  return (
    <div onClick={props?.onClick} style={props?.isMobileView ? { padding: 5 } : null}>
      {props?.isMobileView ? (
        <CloseSvg />
      ) : (
        <div className={"icon-bg-secondary"} style={{ backgroundColor: "#FFFFFF" }}>
          <Close />
        </div>
      )}
    </div>
  );
};

const ModalHeading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const PGRWorkflowModal = ({ 
  selectedAction,
  config,
  onSubmit, 
  closeModal,
  sessionFormData,
  setSessionFormData,
  clearSessionFormData,
  popupModuleActionBarStyles,
  popupModuleMianStyles 
}) => {
    
  const { t } = useTranslation();

  const onFormValueChange = (setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
    if (!_.isEqual(sessionFormData, formData)) {
      setSessionFormData({ ...sessionFormData, ...formData });
    }
  }

  if (!config || !selectedAction) return null;

  return (
    <Modal
     popupStyles={{ width: "48.438rem", borderRadius: "0.25rem", height: "fit-content" }}
      headerBarMainStyle={{ padding: 0, margin: 0 }}
      headerBarMain={<ModalHeading style={{ fontSize: "1.5rem" }} label={t(config?.label?.heading)} />}
      actionCancelLabel={t(config.label.cancel)}     
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={()=> onSubmit(sessionFormData)}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      formId="modal-action"
    >
      <FormComposerV2
        config={config.form}
        noBoxShadow
        inline
        childrenAtTheBottom
        onFormValueChange={onFormValueChange}
        defaultValues={sessionFormData}
        formId="modal-action"
      />
    </Modal>
  );
};

PGRWorkflowModal.propTypes = {
  selectedAction: PropTypes.shape({
    action: PropTypes.string.isRequired,
  }),
  config: PropTypes.shape({
    label: PropTypes.object.isRequired,
    form: PropTypes.array.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  popupModuleActionBarStyles: PropTypes.object,
  popupModuleMianStyles: PropTypes.object,
};

export default PGRWorkflowModal;
