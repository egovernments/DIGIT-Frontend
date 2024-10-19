import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Button, Card, Divider, TextInput } from '@egovernments/digit-ui-components';

const EditVillagePopulationPopUp = ({ onClose, census }) => {
  const { t } = useTranslation();

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

  const handleSave = () => {
    // Prepare the updated census data with new population values
    const updatedCensus = {
      ...census,
      additionalDetails: {
        ...census.additionalDetails,
        confirmedTotalPopulation,
        confirmedTargetPopulation,
      },
    };

    // Log the updated data or trigger a save function with it
    console.log("Updated Census Data: ", updatedCensus);

    // Close the popup after saving
    onClose();
  };

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
