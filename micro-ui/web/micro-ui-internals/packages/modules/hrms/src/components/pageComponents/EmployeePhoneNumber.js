import React, { useState, useEffect } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { HRMSConstants } from "../../pages/HRMSConstants";

const SelectEmployeePhoneNumber = ({ t, config, onSelect, formData = {}, userType, register, errors, mobileNumber }) => {
  const { pathname: url } = useLocation();
  const [isError, setError] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(HRMSConstants.INDIA.countryCode);

  const countryOptions = Object.values(HRMSConstants).map(({ countryCode }, index) => (
    <option key={index} value={countryCode}>
      {countryCode}
    </option>
  ));

  const [regexPattern, setRegexPattern] = useState(getPhonePattern(selectedCountryCode));

  useEffect(() => {
    // Update regex pattern when country code changes
    setRegexPattern(getPhonePattern(selectedCountryCode));
  }, [selectedCountryCode]);

  const validateMobileNumber = (value) => {
    return regexPattern ? regexPattern.test(value) : false;
  };

  const inputs = [
    {
      label: t("HR_MOB_NO_LABEL"),
      isMandatory: false,
      type: "text",
      name: "mobileNumber",
      populators: {
        validation: {
          required: true,
          pattern: regexPattern, // Directly use the regexPattern
        },
        componentInFront: (
          <select
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            className="employee-card-input employee-card-input--front"
          >
            {countryOptions}
          </select>
        ),
        error: t("CORE_COMMON_MOBILE_ERROR"),
      },
    },
  ];

  const handleMobileNumberChange = (value, inputName) => {
    const isValid = validateMobileNumber(value);
    setError(!isValid);
    onSelect(config.key, { ...formData[config.key], [inputName]: value });
  };

  return (
    <div>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">
              {t(input.label)}
              {input.isMandatory ? " * " : null}
            </CardLabel>
            <div className="field-container" style={{ width: "50%", display: "block" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {input.populators.componentInFront}
                <TextInput
                  className="field desktop-w-full"
                  key={input.name}
                  value={mobileNumber}
                  onChange={(e) => handleMobileNumberChange(e.target.value, input.name)}
                  onBlur={(e) => setError(!validateMobileNumber(e.target.value))}
                  {...register(input.name, {
                    required: true,
                    validate: validateMobileNumber,
                  })}
                />
              </div>
              {isError ? (
                <CardLabelError style={{ width: "100%" }}>{t(input.populators.error)}</CardLabelError>
              ) : (
                <span style={{ color: "gray", width: "100%", border: "none", background: "none", justifyContent: "start" }}>
                  {t("HR_MOBILE_NO_CHECK")}
                </span>
              )}
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectEmployeePhoneNumber;
