import { FormStep } from "@egovernments/digit-ui-react-components";
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

  const regexPattern = getPhonePattern(selectedCountryCode);

  
  const isValid = regexPattern ? regexPattern.test(mobileNumber) : false;

  return (
    <div className="custom-margin-bottom">
      <FormStep
        isDisabled={!(isValid && canSubmit)}
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
      ></FormStep>
    </div>
  );
};

export default SelectMobileNumber;
