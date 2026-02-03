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
      
      // Find the first key with an error
      const errorKey = Object.keys(errors).find((key) => errors[key]);
      
      // Set the toast with the key and its value
      setShowToast({ 
        key: "error", 
        label: t(errors[errorKey])
      });
      
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
  
    let newErrors = { ...errors }; 
  
    // Basic validation for positive integers within the range
    const isValueValid = value && Number(value) > 0 && Number(value) <= 100000 && Number.isInteger(Number(value));
    if (!isValueValid) {
      newErrors[fieldKey] = "HCM_MICROPLAN_ONLY_POSITIVE_NUMBERS_MAX_LIMIT_VALIDATION_ERROR";
    } else {
      // Clear basic validation errors only if no dependency errors exist for this field
      if (!errors[fieldKey]?.includes("HCM_MICROPLAN_TARGET_CANNOT_EXCEED_TOTAL") &&
          !errors[fieldKey]?.includes("HCM_MICROPLAN_TOTAL_CANNOT_BE_LESS_THAN_TARGET")) {
        delete newErrors[fieldKey];  /// safely delete when error is becuase of this condition
      }
    }
  
    // Dependency checks for TARGET_POPULATION and TOTAL_POPULATION
    if (fieldKey.includes("CONFIRMED_HCM_ADMIN_CONSOLE_TARGET_POPULATION")) {
      const totalPopulationField = census.additionalFields.find((f) =>
        f.key.includes("CONFIRMED_HCM_ADMIN_CONSOLE_TOTAL_POPULATION")
      );
      const totalPopulationValue = confirmedValues[totalPopulationField?.key] || 0;
  
      const targetPopulationSum = census.additionalFields
        .filter((f) => f.key.includes("CONFIRMED_HCM_ADMIN_CONSOLE_TARGET_POPULATION"))
        .reduce((sum, f) => {
          const fieldValue = f.key === fieldKey ? value : confirmedValues[f.key] || 0;
          return sum + Number(fieldValue);
        }, 0);
  
      if (targetPopulationSum > Number(totalPopulationValue)) {
        // Check if no error exists for the fieldKey, then assign the specific error
        if (!newErrors[fieldKey]) {
           newErrors[fieldKey] = "HCM_MICROPLAN_TARGET_CANNOT_EXCEED_TOTAL";
        }
      } else {
        if (newErrors[fieldKey] === "HCM_MICROPLAN_TARGET_CANNOT_EXCEED_TOTAL") {
          delete newErrors[fieldKey];
        }
        const totalErrorKey = census.additionalFields.find((f) => f.key.includes("CONFIRMED_HCM_ADMIN_CONSOLE_TOTAL_POPULATION"))?.key;
        if (totalErrorKey && newErrors[totalErrorKey] === "HCM_MICROPLAN_TOTAL_CANNOT_BE_LESS_THAN_TARGET") {
          delete newErrors[totalErrorKey];
        }
        // Iterate through all keys in newErrors to find and delete errors for all target keys
        Object.keys(newErrors).forEach((key) => {
          if (key.includes("CONFIRMED_HCM_ADMIN_CONSOLE_TARGET_POPULATION") && newErrors[key] === "HCM_MICROPLAN_TARGET_CANNOT_EXCEED_TOTAL") {
            delete newErrors[key];
          }
        });
      }
    }
  
    if (fieldKey.includes("CONFIRMED_HCM_ADMIN_CONSOLE_TOTAL_POPULATION")) {
      const targetPopulationSum = census.additionalFields
        .filter((f) => f.key.includes("CONFIRMED_HCM_ADMIN_CONSOLE_TARGET_POPULATION"))
        .reduce((sum, f) => {
          const fieldValue = confirmedValues[f.key] || 0;
          return sum + Number(fieldValue);
        }, 0);
  
      if (Number(value) < targetPopulationSum) {
        // Check if no error exists for the fieldKey, then assign the specific error
        if (!newErrors[fieldKey]) {
          newErrors[fieldKey] = "HCM_MICROPLAN_TOTAL_CANNOT_BE_LESS_THAN_TARGET";
        }
        
      } else {
        if (newErrors[fieldKey] === "HCM_MICROPLAN_TOTAL_CANNOT_BE_LESS_THAN_TARGET") {
          delete newErrors[fieldKey];
        }
        const targetErrorKeys = census.additionalFields
          .filter((f) => f.key.includes("CONFIRMED_HCM_ADMIN_CONSOLE_TARGET_POPULATION"))
          .map((f) => f.key);
        targetErrorKeys.forEach((targetKey) => {
          if (newErrors[targetKey] === "HCM_MICROPLAN_TARGET_CANNOT_EXCEED_TOTAL") {
            delete newErrors[targetKey];
          }
        });
      }
    }
  
    setErrors(newErrors); // Update state
  };
  
  

  const fieldsToShow = census?.additionalFields
  ? census.additionalFields.filter((field) => field.showOnUi)
  : [];

  const nonEditableFields = fieldsToShow
    .filter(field => !field.editable)
    .sort((a, b) => a.order - b.order);

  const editableFields = fieldsToShow
    .filter(field => field.editable)
    .sort((a, b) => a.order - b.order);


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
                {editableFields?.length > 0 && <Divider className="" variant="small" />}
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
                        message={t(errors[field.key])}
                        truncateMessage
                        maxLength={256}
                        showIcon
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
            title={t(`HCM_MICROPLAN_EDIT_POPULATION_CLOSE`)}
            onClick={onClose}
          />,
          <Button
            className={"campaign-type-alert-button"}
            type={"button"}
            size={"large"}
            variation={"primary"}
            label={t(`HCM_MICROPLAN_EDIT_POPULATION_${workflowAction}`)}
            title={t(`HCM_MICROPLAN_EDIT_POPULATION_${workflowAction}`)}
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
