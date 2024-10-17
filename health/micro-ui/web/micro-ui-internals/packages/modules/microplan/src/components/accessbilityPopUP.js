import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, Dropdown, LabelFieldPair, Card } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context"; // Ensure that the translation function `t` is handled here

const AccessibilityPopUp = ({ onClose }) => {
  const { state } = useMyContext(); // Extract state from context
  const { t } = useTranslation();

  const [dropdown1Value, setDropdown1Value] = useState(null);
  const [dropdown2Value, setDropdown2Value] = useState(null);
  const [dropdown3Value, setDropdown3Value] = useState(null);

  const handleDropdownChange = (value, key) => {
    switch (key) {
      case "dropdown1":
        setDropdown1Value(value);
        break;
      case "dropdown2":
        setDropdown2Value(value);
        break;
      case "dropdown3":
        setDropdown3Value(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    // Handle save logic here
    console.log(`Dropdown 1: ${dropdown1Value?.label}, Dropdown 2: ${dropdown2Value?.label}, Dropdown 3: ${dropdown3Value?.label}`);
    onClose(); // Close the popup after saving
  };

  const optionsList3 = [
    { name: "OTHER", code: "OTHER" },

  ];

  return (
    <PopUp
      onClose={onClose}
      heading={t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_LABEL`)}
      children={[
        <Card key="dropdown-card" type="secondary">
          <LabelFieldPair>
            <div className="edit-label">{t(`HCM_MICROPLAN_VILLAGE_ROAD_CONDITION_LABEL`)}</div>
            <Dropdown
              option={state.villageRoadCondition}
              optionKey="name"
              selected={dropdown1Value}
              select={(value) => handleDropdownChange(value, "dropdown1")}
              t={(label) => label} // Replace with translation function
            />
          </LabelFieldPair>

          <LabelFieldPair>
            <div className="edit-label">{t(`HCM_MICROPLAN_VILLAGE_TERRAIN_LABEL`)}</div>
            <Dropdown
              option={state.villageTerrain}
              optionKey="name"
              selected={dropdown2Value}
              select={(value) => handleDropdownChange(value, "dropdown2")}
              t={(label) => label} // Replace with translation function
            />
          </LabelFieldPair>

          <LabelFieldPair>
            <div className="edit-label">{t(`HCM_MICROPLAN_VILLAGE_TRANSPORTATION_MODE_LABEL`)}</div>
            <Dropdown
              option={optionsList3}
              optionKey="name"
              selected={dropdown3Value}
              select={(value) => handleDropdownChange(value, "dropdown3")}
              t={(label) => label} // Replace with translation function
            />
          </LabelFieldPair>
        </Card>,
      ]}
      onOverlayClick={onClose}
      footerChildren={[
        <Button
          className={"campaign-type-alert-button"}
          type={"button"}
          size={"large"}
          variation={"secondary"}
          label={t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_CLOSE_LABEL`)}
          onClick={onClose}
        />,
        <Button
          className={"campaign-type-alert-button"}
          type={"button"}
          size={"large"}
          variation={"primary"}
          label={t(`HCM_MICROPLAN_VILLAGE_ACCESSIBILITY_SAVE_LABEL`)}
          onClick={handleSave}
        />,
      ]}
    />
  );
};

export default AccessibilityPopUp;
