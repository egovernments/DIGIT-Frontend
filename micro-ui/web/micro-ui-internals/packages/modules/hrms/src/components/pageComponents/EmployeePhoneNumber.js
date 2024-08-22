import React, { useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { HRMSConstants } from "../../pages/HRMSConstants";

const SelectEmployeePhoneNumber = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const [iserror, setError] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(HRMSConstants.INDIA.countryCode);

  const countryOptions = Object.values(HRMSConstants).map(({ countryCode }, index) => (
    <option key={index} value={countryCode}>
      {countryCode}
    </option>
  ));

  const getPhonePattern = (selectedCountryCode) => {
    return Object.values(HRMSConstants).find(e => e.countryCode === selectedCountryCode)?.regex;
  };

  let isMobile = window.Digit.Utils.browser.isMobile();

  const inputs = [
    {
      label: t("HR_MOB_NO_LABEL"),
      isMandatory: false,
      type: "text",
      name: "mobileNumber",
      populators: {
        validation: {
          required: true,
          pattern:getPhonePattern,
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

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: value });
  }

  function validate(value, input) {
    setError(!input.populators.validation.pattern.test(value));
  }

  return (
    <div>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">
              {t(input.label)}
              {input.isMandatory ? " * " : null}
            </CardLabel>
            <div className="field-container" style={{ width: isMobile ? "100%" : "50%", display: "block" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {input.populators.componentInFront}
                <TextInput
                  className="field desktop-w-full"
                  key={input.name}
                  value={formData && formData[config.key] ? formData[config.key][input.name] : ""}
                  onChange={(e) => setValue(e.target.value, input.name)}
                  disable={false}
                  defaultValue={undefined}
                  onBlur={(e) => validate(e.target.value, input)}
                  {...input.populators.validation}
                />
              </div>
              {iserror ? (
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
