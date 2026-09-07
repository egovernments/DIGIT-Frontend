import React, { useState, useEffect, useMemo, useRef, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FieldV1, Card, LabelFieldPair, RadioButtons } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

// Seasonal Malaria Chemoprevention runs in rounds, so it opens on multi round rather than
// the usual single round. The project type master carries no defaultRoundType field today;
// once it does, that value wins and this constant can go.
const MULTI_ROUND_BY_DEFAULT_PROJECT_TYPES = ["MR-DN"];

const CycleSelection = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(formData?.CycleSelection);

  // Read roundTypes from project type MDMS config.
  // Possible values: ["SINGLE_ROUND"], ["MULTI_ROUND"], ["SINGLE_ROUND", "MULTI_ROUND"]
  const roundTypes = formData?.CampaignType?.roundTypes;

  // Seeded with the type already on screen so an existing campaign opens on its saved
  // round type instead of being reset the moment the step mounts.
  const previousCampaignTypeRef = useRef(formData?.CampaignType?.code);

  const allOptions = useMemo(() => [
    { code: "HCM_SINGLE_ROUND", name: t(I18N_KEYS.COMMON.HCM_SINGLE_ROUND) },
    { code: "HCM_MULTI_ROUND", name: t(I18N_KEYS.COMPONENTS.HCM_MULTI_ROUND) },
  ], [t]);

  // Filter options based on roundTypes config; show all if not configured
  const options = useMemo(() => {
    if (!roundTypes || !Array.isArray(roundTypes) || roundTypes.length === 0) {
      return allOptions;
    }
    return allOptions.filter((opt) => {
      if (opt.code === "HCM_SINGLE_ROUND") return roundTypes.includes("SINGLE_ROUND");
      if (opt.code === "HCM_MULTI_ROUND") return roundTypes.includes("MULTI_ROUND");
      return false;
    });
  }, [allOptions, roundTypes]);

  // Disabled when only one round type is allowed
  const isDisabled = !roundTypes || !Array.isArray(roundTypes) || roundTypes.length < 2;

  useEffect(() => {
    const campaignTypeCode = formData?.CampaignType?.code;
    const campaignTypeChanged = previousCampaignTypeRef.current !== campaignTypeCode;
    previousCampaignTypeRef.current = campaignTypeCode;

    // A project type may declare which round it opens on; otherwise fall back to the
    // known multi-round types (SMC).
    const configuredDefault = formData?.CampaignType?.defaultRoundType;
    const defaultsToMultiRound = configuredDefault
      ? configuredDefault === "MULTI_ROUND"
      : MULTI_ROUND_BY_DEFAULT_PROJECT_TYPES.includes(campaignTypeCode);

    if (!roundTypes || !Array.isArray(roundTypes) || roundTypes.length === 0) {
      // No roundTypes configured — default to single round, disabled
      setSelectedOption("HCM_SINGLE_ROUND");
    } else if (roundTypes.length === 1) {
      // Only one option — auto-select it
      setSelectedOption(roundTypes[0] === "MULTI_ROUND" ? "HCM_MULTI_ROUND" : "HCM_SINGLE_ROUND");
    } else if (defaultsToMultiRound && roundTypes.includes("MULTI_ROUND") && (campaignTypeChanged || !selectedOption)) {
      // Picking this type is what applies the default, so a later manual switch is kept.
      setSelectedOption("HCM_MULTI_ROUND");
    } else if (!selectedOption) {
      // Both options available and no prior selection — default to single round
      setSelectedOption("HCM_SINGLE_ROUND");
    }
  }, [formData?.CampaignType?.code]);

  useEffect(() => {
    onSelect("CycleSelection", selectedOption);
  }, [selectedOption]);

  return (
    <>
      {formData?.CampaignType && (
        <LabelFieldPair className="beneficiary-selection-label">
          <RadioButtons
            onSelect={(selected) => {
              setSelectedOption(selected.code);
            }}
            disabled={isDisabled}
            options={options}
            optionsKey="name"
            selectedOption={options.find((opt) => opt.code === selectedOption)}
            value={selectedOption}
          />
        </LabelFieldPair>
      )}
    </>
  );
};

export default CycleSelection;
