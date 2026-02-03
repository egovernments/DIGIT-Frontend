import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FieldV1, Card, LabelFieldPair, RadioButtons } from "@egovernments/digit-ui-components";

const CycleSelection = ({ onSelect, formData, ...props }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(formData?.CycleSelection);

  const options = [
    { code: "HCM_SINGLE_ROUND", name: t("HCM_SINGLE_ROUND") },
    { code: "HCM_MULTI_ROUND", name: t("HCM_MULTI_ROUND") },
  ];

useEffect(()=>{
  if(formData?.CampaignType?.cycles?.length > 1){
    setSelectedOption("HCM_MULTI_ROUND");
  }
  else{
     setSelectedOption("HCM_SINGLE_ROUND");
  }

},[formData?.CampaignType?.code])

  useEffect(() =>{
    onSelect("CycleSelection", selectedOption);

  },[selectedOption])

  return (
    <>
    {formData?.CampaignType && (
      <LabelFieldPair className="beneficiary-selection-label">
        <RadioButtons
          onSelect={(selected) => {
            setSelectedOption(selected.code);
          }}
          disabled = {true}
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
