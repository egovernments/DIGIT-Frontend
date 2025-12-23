import React, { useState, useEffect, useMemo,Fragment } from "react";
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

  // Listen for campaign name changes from CampaignName component
  useEffect(() => {
    const handleNameChange = (event) => {
      const newName = event.detail || "";
      setCampaignName(newName);
      if (newName.length > 0) {
        setHasStartedTyping(true);
      }
    };

    // Listening for custom event
    window.addEventListener("campaignNameChange", handleNameChange);

    // checking session storage on mount for initial value
    const storedName = sessionStorage.getItem("Digit.CAMPAIGN_NAME_REALTIME");
    if (storedName) {
      try {
        const parsed = JSON.parse(storedName);
        if (parsed) {
          setCampaignName(parsed);
          if (parsed.length > 0) {
            setHasStartedTyping(true);
          }
        }
      } catch (e) {
        // Ignoring errors
      }
    }

    return () => {
      window.removeEventListener("campaignNameChange", handleNameChange);
    };
  }, []);

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

      {isAllRulesMet && (
        <div className="validation-success-banner">
          <CheckCircle fill="#00703C" width="1.5rem" height="1.5rem" />
          <span className="success-text">{t("ALL_NAMING_RULES_MET")}</span>
        </div>
      )}
    </div>
  );
};

export default CampaignNameInfo;
