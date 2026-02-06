import React, { useState, useEffect, useLayoutEffect, useMemo,Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-components";
import { CheckCircle, Close, InfoOutline } from "@egovernments/digit-ui-svg-components";
import { CONSOLE_MDMS_MODULENAME } from "../../Module";
import { validateCampaignName, allRulesMet } from "../../utils/campaignNameValidators";

const CampaignNameInfo = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Local state for campaign name - will be updated via custom event
  const [campaignName, setCampaignName] = useState("");
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [hasFocused, setHasFocused] = useState(false);

  // Use useLayoutEffect to register listeners BEFORE CampaignNameInput's useEffect dispatches events
  // This avoids the race condition where events are dispatched before listeners are registered
  useLayoutEffect(() => {
    const handleNameChange = (event) => {
      const newName = event.detail || "";
      setCampaignName(newName);
      if (newName.length > 0) {
        setHasStartedTyping(true);
      }
    };

    const handleFocus = () => {
      setHasFocused(true);
    };

    // Listening for custom events
    window.addEventListener("campaignNameChange", handleNameChange);
    window.addEventListener("campaignNameFocus", handleFocus);

    // Check separate session key for persisted focus flag (survives step navigation)
    const infoVisible = Digit.SessionStorage.get("CAMPAIGN_NAME_INFO_VISIBLE");
    // Also show immediately when editing an existing campaign's name
    const editName = new URLSearchParams(window.location.search).get("editName");
    if (infoVisible || editName === "true") {
      setHasFocused(true);
    }
    const consoleData = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_DATA");
    const sessionName = consoleData?.CampaignName;
    if (sessionName && sessionName.length > 0) {
      setCampaignName(sessionName);
      setHasStartedTyping(true);
    }

    return () => {
      window.removeEventListener("campaignNameChange", handleNameChange);
      window.removeEventListener("campaignNameFocus", handleFocus);
    };
  }, []);

  // Set hasStartedTyping to true if campaignName already has a value on mount/update
  // This handles the case when navigating back to the screen with existing data
  useEffect(() => {
    if (campaignName && campaignName.length > 0 && !hasStartedTyping) {
      setHasStartedTyping(true);
    }
  }, [campaignName]);

  // Fetch MDMS rules
  const { data: infoData, isLoading: infoLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "CampaignNamingConvention",
      },
    ],
    {
      select: (data) => {
        return data?.[CONSOLE_MDMS_MODULENAME]?.CampaignNamingConvention?.[0];
      },
    },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.CampaignNamingConvention` }
  );

  // Compute validation results
  const validationResults = useMemo(() => {
    if (!infoData?.data) return [];
    return validateCampaignName(campaignName, infoData.data);
  }, [campaignName, infoData]);

  const isAllRulesMet = useMemo(() => {
    return hasStartedTyping && validationResults.length > 0 && allRulesMet(validationResults);
  }, [validationResults, hasStartedTyping]);

  // Render icon based on validation state
  const renderIcon = (isValid) => {
    if (!hasStartedTyping) {
      return <InfoOutline fill="#787878" width="1.25rem" height="1.25rem" />;
    }
    if (isValid) {
      return <CheckCircle fill="#00703C" width="1.25rem" height="1.25rem" />;
    }
    return <Close fill="#D4351C" width="1.25rem" height="1.25rem" />;
  };

  // Get rule state class
  const getRuleStateClass = (isValid) => {
    if (!hasStartedTyping) return "rule-neutral";
    return isValid ? "rule-valid" : "rule-invalid";
  };

  if (infoLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  if (!hasFocused) {
    return null;
  }

  return (
    <div className="campaign-name-validation-container">
      <div className="validation-header">
        <span className="validation-title">{t("CONSOLE_NAMING_CONVENTION")}</span>
      </div>

      <div className="validation-rules-list">
        {validationResults.map((rule, index) => (
          <div
            key={`rule-${index}`}
            className={`validation-rule-item ${getRuleStateClass(rule.isValid)}`}
          >
            <div className="validation-icon">
              {renderIcon(rule.isValid)}
            </div>
            <span className="validation-text">
              {t(rule.translationKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignNameInfo;
