import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { HRMS_CONSTANTS } from "../../constants/constants";
import { Dropdown, LabelFieldPair, CardLabel, TextInput, CardLabelError, FieldV1 } from "@egovernments/digit-ui-components";

const SelectEmployeePhoneNumber = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const [iserror, setError] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState({
    code: HRMS_CONSTANTS.INDIA_COUNTRY_CODE,
    name: HRMS_CONSTANTS.INDIA_COUNTRY_CODE,
  });
  const [selectedCountry, setSelectedCountry] = useState("ind");
  let isMobile = window.Digit.Utils.browser.isMobile();
  const inputs = [
    {
      label: t("HR_MOB_NO_LABEL"),
      isMandatory: true,
      type: "text",
      name: "mobileNumber",
      populators: {
        validation: {
          ind: {
            required: false,
            pattern: /^[6-9]\d{9}$/,
          },
          moz: {
            required: false,
            pattern: /^[0-9]\d{8}$/,
          },
        },
        componentInFront: (
          <div className="employee-card-input employee-card-input--front">
            {formData?.SelectEmployeePhoneNumber?.mobileNumber?.length === 10 ? HRMS_CONSTANTS.INDIA_COUNTRY_CODE : HRMS_CONSTANTS.MOZ_COUNTRY_CODE}
          </div>
        ),
        error: t("CORE_COMMON_MOBILE_ERROR"),
      },
    },
  ];

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: selectedCountryCode.code + value });
  }
  function validate(value, input) {
    if (value) {
      setError(!input.populators.validation[selectedCountry].pattern.test(value));
    }
  }
  function handleCountryCodeChange(e) {
    setSelectedCountryCode(e);
    e.code === HRMS_CONSTANTS.MOZ_COUNTRY_CODE ? setSelectedCountry("moz") : setSelectedCountry("ind");
    let mobNumber = formData["SelectEmployeePhoneNumber"]?.mobileNumber;
    if (mobNumber) {
      let mobileNumberValidation =
        e.code === HRMS_CONSTANTS.MOZ_COUNTRY_CODE
          ? inputs[0].populators.validation["moz"].pattern.test(mobNumber)
          : inputs[0].populators.validation["ind"].pattern.test(mobNumber);
      setError(!mobileNumberValidation);
    }
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
            <div style={{ width: isMobile ? "100%" : "50%", display: "block" }}>
              <div style={{ display: "flex" }}>
                {
                  <Dropdown
                    t={t}
                    style={{ width: "12%" }}
                    selected={selectedCountryCode}
                    option={[
                      {
                        code: HRMS_CONSTANTS.INDIA_COUNTRY_CODE,
                        name: HRMS_CONSTANTS.INDIA_COUNTRY_CODE,
                      },
                      {
                        code: HRMS_CONSTANTS.MOZ_COUNTRY_CODE,
                        name: HRMS_CONSTANTS.MOZ_COUNTRY_CODE,
                      },
                    ]}
                    optionKey="name"
                    select={(value) => {
                      handleCountryCodeChange(value);
                    }}
                  />
                }
                {
                  <TextInput
                    style={{ width: "85%" }}
                    type="number"
                    withoutLabel={true}
                    key={input.name}
                    value={
                      formData && formData[config.key]
                        ? formData[config.key][input.name]?.startsWith("+")
                          ? formData[config.key][input.name].split(selectedCountryCode)?.[1]
                          : formData[config.key][input.name]
                        : undefined
                    }
                    onChange={(e) => {
                      setValue(e.target.value, input.name, validate(e.target.value, input));
                    }}
                    disable={false}
                    defaultValue={undefined}
                    onBlur={(e) => validate(e.target.value, input)}
                    {...input.validation}
                  />
                }
              </div>
              <div>
                {iserror ? (
                  <CardLabelError style={{ width: "100%" }}>{t(input.populators.error)}</CardLabelError>
                ) : (
                  <span
                    style={{
                      color: "gray",
                      width: "100%",
                      border: "none",
                      background: "none",
                      justifyContent: "start",
                    }}
                  >
                    {t("HR_MOBILE_NO_CHECK")}
                  </span>
                )}
              </div>
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectEmployeePhoneNumber;
