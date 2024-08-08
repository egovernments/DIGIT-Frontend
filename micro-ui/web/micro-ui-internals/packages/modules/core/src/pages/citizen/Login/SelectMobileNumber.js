import { FormStep } from "@egovernments/digit-ui-components";
import React, { useState } from "react";
import { PGRConstants } from "./PGRConstants";

const SelectMobileNumber = ({ t, onSelect, showRegisterLink, mobileNumber, onMobileChange, config, canSubmit }) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(PGRConstants.INDIA.countryCode);

  const countryOptions = Object.values(PGRConstants).map(({ countryCode }, index) => (
    <option key={index} value={countryCode}>
      {countryCode}
    </option>
  ));

  const getPhonePattern = (selectedCountryCode) => {
    return Object.values(PGRConstants).find(e => e.countryCode === selectedCountryCode)?.regex;
  };

  const validation = {
    required: true,
    pattern: getPhonePattern(selectedCountryCode),
  };

  return (
    <FormStep
      isDisabled={!(mobileNumber.length === 10 && canSubmit)}
      onSelect={onSelect}
      config={config}
      t={t}
      componentInFront={
        <select value={selectedCountryCode} onChange={(e) => setSelectedCountryCode(e.target.value)}>
          {countryOptions}
        </select>
      }
      onChange={onMobileChange}
      value={mobileNumber}
      validation={validation} 
    ></FormStep>
  );
};

export default SelectMobileNumber;
