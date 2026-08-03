import React, { useState, useEffect, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FieldV1, Card, LabelFieldPair, RadioButtons } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../../utils/i18nKeyConstants";

const CycleSelection = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(formData?.CycleSelection);

  // Read roundTypes from project type MDMS config.
  // Possible values: ["SINGLE_ROUND"], ["MULTI_ROUND"], ["SINGLE_ROUND", "MULTI_ROUND"]
  const roundTypes = formData?.CampaignType?.roundTypes;

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
    if (!roundTypes || !Array.isArray(roundTypes) || roundTypes.length === 0) {
      // No roundTypes configured — default to single round, disabled
      setSelectedOption("HCM_SINGLE_ROUND");
    } else if (roundTypes.length === 1) {
      // Only one option — auto-select it
      setSelectedOption(roundTypes[0] === "MULTI_ROUND" ? "HCM_MULTI_ROUND" : "HCM_SINGLE_ROUND");
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
