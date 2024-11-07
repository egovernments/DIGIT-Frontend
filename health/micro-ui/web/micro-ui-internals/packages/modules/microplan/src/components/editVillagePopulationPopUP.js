import React, { Fragment, useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Button, Card, Divider, TextInput, Toast, ErrorMessage } from '@egovernments/digit-ui-components';
import WorkflowCommentPopUp from './WorkflowCommentPopUp';

const EditVillagePopulationPopUp = ({ onClose, census, onSuccess }) => {
  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);

  const [confirmedValues, setConfirmedValues] = useState({});
  const [showComment, setShowComment] = useState(false);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(null);
  const [updatedCensus, setUpdatedCensus] = useState(null); // Add updatedCensus as state

  let workflowAction = "";
  if (userRoles && userRoles.includes('POPULATION_DATA_APPROVER')) {
    workflowAction = "EDIT_AND_SEND_FOR_APPROVAL";
  } else if (userRoles && userRoles.includes('ROOT_POPULATION_DATA_APPROVER')) {
    workflowAction = "EDIT_AND_VALIDATE";
  }

  useEffect(() => {
    if (census?.additionalFields) {
      const initialValues = {};
      census.additionalFields.forEach(field => {
        initialValues[field.key] = field.value;
      });
      setConfirmedValues(initialValues);
    }
  }, [census]);

  const onCommentLogClose = () => {
    setShowComment(false);
  };

  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(null), 5000);
    }
  }, [showToast]);


  const handleSave = () => {

    if (Object.keys(errors).some((key) => errors[key])) {
      setShowToast({ key: "error", label: t("HCM_MICROPLAN_ONLY_POSITIVE_NUMBERS") });
      return;
    }

    const updatedAdditionalFields = census.additionalFields.map(field => ({
      ...field,
      value: confirmedValues[field.key] || field.value
    }));

    const newUpdatedCensus = {
      ...census,
      additionalFields: updatedAdditionalFields,
      workflow: {
        ...census.workflow,
        action: workflowAction,
      },
    };

    setUpdatedCensus(newUpdatedCensus);
    onSuccess(newUpdatedCensus);
    onClose();
  };

  const handleInputChange = (fieldKey, value) => {
    setConfirmedValues({
      ...confirmedValues,
      [fieldKey]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [fieldKey]: !value || Number(value) <= 0
    }));
  };

  const nonEditableFields = census.additionalFields.filter(field => !field.editable);
  const editableFields = census.additionalFields.filter(field => field.editable);

  return (
    <>
      <PopUp
        onClose={onClose}
        heading={t(`HCM_MICROPLAN_EDIT_POPULATION_LABEL`)}
        children={[
          <Card key="dropdown-card" type="secondary">
            <div className="edit-label-field-pair">
              <div className="edit-label">{t(`HCM_MICROPLAN_EDIT_VILLAGE`)}</div>
              <div className="edit-value">{t(census?.boundaryCode) || "NA"}</div>
            </div>
            <Divider className="" variant="small" />

            {nonEditableFields.map((field, index) => (
              <Fragment key={field.key}>
                <div className="edit-label-field-pair">
                  <div className="edit-label">{t(field.key)}</div>
                  <div className="edit-value">
                    <span>{field.value || t("ES_COMMON_NA")}</span>
                  </div>
                </div>
                {index < nonEditableFields.length - 1 && <Divider className="" variant="small" />}
              </Fragment>
            ))}

            {editableFields.map((field, index) => (
              <Fragment key={field.key}>
                <div className="edit-label-field-pair">
                  <div className="edit-label">{t(field.key)}</div>
                  <div className="edit-value">
                    <TextInput
                      type="number"
                      value={confirmedValues[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={t(`HCM_MICROPLAN_ENTER_${field.key}`)}
                      error={errors[field.key]}
                    />
                    {errors[field.key] && (
                      <ErrorMessage
                        message={t("HCM_MICROPLAN_ONLY_POSITIVE_NUMBERS")}
                        truncateMessage={true}
                        maxLength={256}
                        showIcon={true}
                      />
                    )}
                  </div>
                </div>
                {index < editableFields.length - 1 && <Divider className="" variant="small" />}
              </Fragment>
            ))}
          </Card>
        ]}
        onOverlayClick={onClose}
        equalWidthButtons={true}
        footerChildren={[
          <Button
            className={"campaign-type-alert-button"}
            type={"button"}
            size={"large"}
            variation={"secondary"}
            label={t(`HCM_MICROPLAN_EDIT_POPULATION_CLOSE`)}
            onClick={onClose}
          />,
          <Button
            className={"campaign-type-alert-button"}
            type={"button"}
            size={"large"}
            variation={"primary"}
            label={t(`HCM_MICROPLAN_EDIT_POPULATION_${workflowAction}`)}
            onClick={handleSave}
          />,
        ]}
      />
      {showToast && (
        <Toast style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          error={showToast.key === "error"}
          onClose={() => setShowToast(null)}
        />
      )}


    </>
  );
};

export default EditVillagePopulationPopUp;
