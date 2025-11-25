import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormComposerV2, PopUp, Button } from '@egovernments/digit-ui-components';
import PropTypes from 'prop-types';

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
    <PopUp
      className="pgr-workflow-popup"
      style={{ width: "47.5rem", borderRadius: "0.25rem", height: "fit-content" }}
      onClose={closeModal}
      heading={t(config?.label?.heading)}
      onOverlayClick={closeModal}
      equalWidthButtons={true}
      children={[
        <div key="form-composer">
          <FormComposerV2
            config={config.form}
            noBoxShadow
            inline
            childrenAtTheBottom
            onFormValueChange={onFormValueChange}
            defaultValues={sessionFormData}
            formId="modal-action"
          />
        </div>
      ]}
      footerChildren={[
        <Button
          key="cancel-button"
          className="campaign-type-alert-button"
          type="button"
          size="large"
          variation="secondary"
          label={t(config.label.cancel)}
          title={t(config.label.cancel)}
          onClick={closeModal}
        />,
        <Button
          key="submit-button"
          className="campaign-type-alert-button"
          type="button"
          size="large"
          variation="primary"
          label={t(config.label.submit)}
          title={t(config.label.submit)}
          onClick={() => onSubmit(sessionFormData)}
        />
      ]}
    />
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
