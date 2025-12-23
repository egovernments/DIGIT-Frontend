import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LabelFieldPair } from "@egovernments/digit-ui-react-components";
import { FieldV1 } from "@egovernments/digit-ui-components";

/**
 * CampaignNameInput component for the create-campaign flow.
 * This component handles the campaign name input and dispatches events
 * to the CampaignNameInfo component for real-time validation display.
 */
const CampaignNameInput = ({ onSelect, formData, customProps, ...props }) => {
  const { t } = useTranslation();
  const sessionData = customProps?.sessionData || props?.props?.sessionData;

  // Initializing name from session data or form data
  const [name, setName] = useState(
    sessionData?.CampaignName ||
    sessionData?.HCM_CAMPAIGN_NAME?.CampaignName ||
    formData?.CampaignName ||
    ""
  );
  const [error, setError] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [executionCount, setExecutionCount] = useState(0);

  // Register initial value with form on mount (similar to CampaignName.js)
  // This ensures the default/initial name is registered with FormComposerV2
  useEffect(() => {
    if (executionCount < 5) {
      if (onSelect) {
        onSelect("CampaignName", name);
      }
      setExecutionCount((prevCount) => prevCount + 1);
    }
  });

  // Sync with session data or formData when it changes
  useEffect(() => {
    const sessionName = sessionData?.CampaignName || sessionData?.HCM_CAMPAIGN_NAME?.CampaignName;
    const formName = formData?.CampaignName;
    const newName = sessionName || formName;
    if (newName && newName !== name) {
      setName(newName);
      // Dispatch event for validation component
      window.dispatchEvent(new CustomEvent("campaignNameChange", { detail: newName }));
    }
  }, [sessionData, formData?.CampaignName]);

  // Dispatching custom event whenever name changes for real time validation
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("campaignNameChange", { detail: name }));

    // Update form data
    if (onSelect) {
      onSelect("CampaignName", name);
    }
  }, [name]);

  // Validate on interaction
  useEffect(() => {
    if (hasInteracted && !name) {
      setError({ message: "ES__REQUIRED_NAME_AND_LENGTH" });
    } else {
      setError(null);
    }
  }, [name, hasInteracted]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setName(newValue);
    setHasInteracted(true);
  };

  return (
    <LabelFieldPair className="name-container-label" style={{ display: "flex" }}>
      <div className="name-container">
        <span>{`${t("HCM_SELECT_CAMPAIGN_NAME")}`}</span>
        <span className="mandatory-span">*</span>
      </div>
      <FieldV1
        type="text"
        error={error?.message ? t(error?.message) : ""}
        style={{ width: "-webkit-fill-available", marginBottom: "0" }}
        populators={{ name: "CampaignName" }}
        placeholder={t("HCM_CAMPAIGNNAME_DATE_MONTH_YEAR")}
        value={name}
        onChange={handleChange}
      />
    </LabelFieldPair>
  );
};

export default CampaignNameInput;
