import React, { Fragment, useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Button, Card, Divider, TextInput, Toast } from '@egovernments/digit-ui-components';

const EditVillagePopulationPopUp = ({ onClose, census, onSuccess }) => {
  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code);

  // State to manage confirmed population values dynamically
  const [confirmedValues, setConfirmedValues] = useState({});
  const [showToast, setShowToast] = useState(null);

  // Load initial values from census data
  useEffect(() => {
    if (census?.additionalFields) {
      const initialValues = {};
      census.additionalFields.forEach(field => {
        initialValues[field.key] = field.value;
      });
      setConfirmedValues(initialValues);
    }
  }, [census]);

  // Close the toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(null), 5000);
    }
  }, [showToast]);

  // Define the mutation configuration
  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: "/census-service/_update", // Replace with the appropriate API endpoint
  });

  const handleSave = async () => {
    let workflowAction = "";
    if (userRoles && userRoles.includes('POPULATION_DATA_APPROVER')) {
      workflowAction = "EDIT_AND_SEND_FOR_APPROVAL";
    } else if (userRoles && userRoles.includes('ROOT_POPULATION_DATA_APPROVER')) {
      workflowAction = "EDIT_AND_VALIDATE";
    }

    // Prepare the updated fields payload
    const updatedAdditionalFields = census.additionalFields.map(field => ({
      ...field,
      value: confirmedValues[field.key] || field.value
    }));

    await mutation.mutate(
      {
        body: {
          Census: {
            ...census,
            additionalFields: updatedAdditionalFields,
            workflow: {
              ...census.workflow,
              action: workflowAction,
            },
          },
        }
      },
      {
        onSuccess: (data) => {
          onSuccess && onSuccess(data); // Call the onSuccess callback if provided
          onClose();
        },
        onError: (error) => {
          setShowToast({ key: "error", label: t(error?.response?.data?.Errors?.[0]?.code) });
        }
      }
    );
  };

  // Separate fields into editable and non-editable
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

            {/* Render non-editable fields first */}
            {nonEditableFields.map((field, index) => (
              <Fragment key={field.key}>
                <div className="edit-label-field-pair">
                  <div className="edit-label">{t(field.key)}</div>
                  <div className="edit-value">
                    <span>{field.value || t("ES_COMMON_NA")}</span>
                  </div>
                </div>
                {/* Render divider only if it's not the last non-editable field */}
                {index < nonEditableFields.length - 1 && <Divider className="" variant="small" />}
              </Fragment>
            ))}

            {/* Render editable fields next */}
            {editableFields.map((field, index) => (
              <Fragment key={field.key}>
                <div className="edit-label-field-pair">
                  <div className="edit-label">{t(field.key)}</div>
                  <div className="edit-value">
                    <TextInput
                      type="text"
                      value={confirmedValues[field.key]}
                      onChange={(e) =>
                        setConfirmedValues({
                          ...confirmedValues,
                          [field.key]: e.target.value
                        })
                      }
                      placeholder={t(`HCM_MICROPLAN_ENTER_${field.key}`)}
                    />
                  </div>
                </div>
                {/* Render divider only if it's not the last editable field */}
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
            label={t(`HCM_MICROPLAN_EDIT_POPULATION_SEND_FOR_APPOVAL`)}
            onClick={handleSave}
            isDisabled={mutation.isLoading}
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