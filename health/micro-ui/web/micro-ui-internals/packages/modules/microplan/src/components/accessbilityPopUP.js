import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PopUp, Button, Dropdown, LabelFieldPair, Card, Toast } from "@egovernments/digit-ui-components";
import { useMyContext } from "../utils/context"; // Ensure that the translation function `t` is handled here


const AccessibilityPopUp = ({ onClose, census, onSuccess }) => {
  const { state } = useMyContext(); // Extract state from context
  const { t } = useTranslation();

  // Initialize dropdown values with the existing accessibility details from additionalDetails if available
  const [dropdown1Value, setDropdown1Value] = useState(null);
  const [dropdown2Value, setDropdown2Value] = useState(null);
  const [dropdown3Value, setDropdown3Value] = useState(null);
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    if (census?.additionalDetails?.accessibilityDetails) {
      setDropdown1Value(census.additionalDetails.accessibilityDetails.roadCondition);
      setDropdown2Value(census.additionalDetails.accessibilityDetails.terrain);
      setDropdown3Value(census.additionalDetails.accessibilityDetails.transportationMode);
    }
  }, [census]);

  // Close the toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(null), 5000);
    }
  }, [showToast]);

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

  // Prepare the request payload for the mutation
  const reqPayload = {
    Census: {
      ...census,
      additionalDetails: {
        ...census.additionalDetails,
        accessibilityDetails: {
          roadCondition: dropdown1Value,
          terrain: dropdown2Value,
          transportationMode: dropdown3Value,
        },
      },
    },
  };

  // Define the mutation configuration
  const mutation = Digit.Hooks.useCustomAPIMutationHook({
    url: "/census-service/_update",
  });

  const handleSave = async () => {
    await mutation.mutate(
      {
        body: reqPayload,

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

  return (
    <>
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
                option={[{ name: "OTHER", code: "OTHER" }]} // Your options list
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
            onClick={handleSave} // Calls save function on click
            isLoading={mutation.isLoading} // Disable button during API call
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

export default AccessibilityPopUp;