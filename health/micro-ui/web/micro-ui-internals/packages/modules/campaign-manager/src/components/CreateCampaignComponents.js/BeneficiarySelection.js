import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FieldV1, Card, LabelFieldPair, RadioButtons } from "@egovernments/digit-ui-components";

const BeneficiarySelection = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { code: "HCM_SINGLE_ROUND", name: t("HCM_SINGLE_ROUND") },
    { code: "HCM_MULTI_ROUND", name: t("HCM_MULTI_ROUND") },
  ];

  useEffect(() => {
    if (formData?.CampaignType?.type === "singleround") {
      setSelectedOption("HCM_SINGLE_ROUND");
    } else if (formData?.CampaignType?.type === "multiround") {
      setSelectedOption("HCM_MULTI_ROUND");
    }
    
  }, [formData]);

  useEffect(() =>{
    onSelect("BeneficiarySelection", selectedOption);

  },[selectedOption])

  return (
    <>
    {formData?.CampaignType && (
      <LabelFieldPair className="beneficiary-selection-label">
        <RadioButtons
          onSelect={(selected) => {
            setSelectedOption(selected.code);
            onSelect(selected);
          }}
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

export default BeneficiarySelection;
