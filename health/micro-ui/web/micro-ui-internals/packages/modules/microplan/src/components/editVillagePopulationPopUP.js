import React from 'react';
import { useTranslation } from "react-i18next";
import { PopUp, Button, Card, LabelFieldPair, FieldV1, Divider, TextInput } from '@egovernments/digit-ui-components';

const EditVillagePopulationPopUp = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <PopUp
      onClose={onClose}
      heading={t(`HCM_MICROPLAN_EDIT_POPULATION_LABEL`)}
      children={[
        <Card key="dropdown-card" type="secondary">
          <div className="edit-label-field-pair">
            <div className="edit-label">{t(`HCM_MICROPLAN_EDIT_VILLAGE`)}</div>
            <div className="edit-value">{"Value 1"}</div>
          </div>
          <Divider className="" variant="small" />
          <div className="edit-label-field-pair">
            <div className="edit-label">{t(`HCM_MICROPLAN_EDIT_VILLAGE_POPULATION`)}</div>
            <div className="edit-value">{"Value 2"}</div>
          </div>
          <Divider className="" variant="small" />
          <div className="edit-label-field-pair">
            <div className="edit-label">{t(`HCM_MICROPLAN_EDIT_TARGET_POPULATION`)}</div>
            <div className="edit-value">{"Value 3"}</div>
          </div>
          <Divider className="" variant="small" />
          <div className="edit-label-field-pair">
            <div className="edit-label">{t(`HCM_MICROPLAN_CONFIRM_VILLAGE_POPULATION`)}</div>
            <div className="edit-value">
              <TextInput type="text" placeholder={"Value"}></TextInput>
            </div>
          </div>
          <Divider className="" variant="small" />
          <div className="edit-label-field-pair">
            <div className="edit-label">{t(`HCM_MICROPLAN_CONFIRM_TARGET_POPULATION`)}</div>
            <div className="edit-value">
              <TextInput type="text" placeholder={"Value"}></TextInput>
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
          onClick={onClose}
        />,
      ]}
    />
  );
};

export default EditVillagePopulationPopUp;
