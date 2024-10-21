import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Button, Card, Divider, TextInput } from '@egovernments/digit-ui-components';
import { useMyContext } from "../utils/context"; // Assuming a similar context is used for fetching necessary data
import { Body } from '@egovernments/digit-ui-react-components';

const EditVillagePopulationPopUp = ({ onClose, census }) => {
  const { t } = useTranslation();
  const { state } = useMyContext(); // Extract state from context

  // State to manage confirmed population and target population
  const [confirmedTotalPopulation, setConfirmedTotalPopulation] = useState("");
  const [confirmedTargetPopulation, setConfirmedTargetPopulation] = useState("");

  // Load initial values from census data
  useEffect(() => {
    if (census?.additionalDetails) {
      setConfirmedTotalPopulation(census.additionalDetails.confirmedTotalPopulation || "");
      setConfirmedTargetPopulation(census.additionalDetails.confirmedTargetPopulation || "");
    }
  }, [census]);

  // Define the mutation configuration
  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: "/census-service/_update", // Replace with the appropriate API endpoint
  });

  const handleSave = async () => {
    await mutation.mutate(
      {
        body: {
          Census: {
            ...census,
            additionalDetails: {
              ...census.additionalDetails,
              confirmedTotalPopulation,
              confirmedTargetPopulation,
            },
            workflow: {
              action: "SEND_BACK_FOR_CORRECTION",
            },
          },
        }

      }
    );
  };

  // Close the popup when the mutation is successful
  useEffect(() => {
    if (!mutation.isLoading && mutation.data) {
      onClose(); // Close popup after saving
    }
  }, [mutation.data, mutation.isLoading, onClose]);

  return (
    <PopUp
      onClose={onClose}
      heading={t(`HCM_MICROPLAN_EDIT_POPULATION_LABEL`)}
      children={[
        <Card key="dropdown-card" type="secondary">
          <div className="edit-label-field-pair">
            <div className="edit-label">{t(`HCM_MICROPLAN_EDIT_VILLAGE`)}</div>
            <div className="edit-value">{census?.boundaryCode || "NA"}</div>
          </div>
          <Divider className="" variant="small" />
          <div className="edit-label-field-pair">
            <div className="edit-label">{t(`HCM_MICROPLAN_EDIT_VILLAGE_POPULATION`)}</div>
            <div className="edit-value">{census?.totalPopulation || "NA"}</div>
          </div>
          <Divider className="" variant="small" />
          <div className="edit-label-field-pair">
            <div className="edit-label">{t(`HCM_MICROPLAN_EDIT_TARGET_POPULATION`)}</div>
            <div className="edit-value">{census?.additionalDetails?.targetPopulation || "NA"}</div>
          </div>
          <Divider className="" variant="small" />
          <div className="edit-label-field-pair">
            <div className="edit-label">{t(`HCM_MICROPLAN_CONFIRM_VILLAGE_POPULATION`)}</div>
            <div className="edit-value">
              <TextInput
                type="text"
                value={confirmedTotalPopulation}
                onChange={(e) => setConfirmedTotalPopulation(e.target.value)}
                placeholder={t(`HCM_MICROPLAN_ENTER_VILLAGE_POPULATION`)}
              />
            </div>
          </div>
          <Divider className="" variant="small" />
          <div className="edit-label-field-pair">
            <div className="edit-label">{t(`HCM_MICROPLAN_CONFIRM_TARGET_POPULATION`)}</div>
            <div className="edit-value">
              <TextInput
                type="text"
                value={confirmedTargetPopulation}
                onChange={(e) => setConfirmedTargetPopulation(e.target.value)}
                placeholder={t(`HCM_MICROPLAN_ENTER_TARGET_POPULATION`)}
              />
            </div>
          </div>
        </Card>,
      ]}
      onOverlayClick={onClose}
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
          onClick={handleSave} // Calls save function on click
        />,
      ]}
    />
  );
};

export default EditVillagePopulationPopUp;
