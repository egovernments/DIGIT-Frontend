import React from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, RadioButtons } from "@egovernments/digit-ui-components";
import { useLocation } from "react-router-dom";

const SelectEmployeeGender = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();

  let isMobile = window.Digit.Utils.browser.isMobile();

  const inputs = [
    {
      label: "HR_GENDER_LABEL",
      type: "text",
      name: "gender",
      validation: {
        isRequired: false,
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
    },
  ];

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const { data: Menu } = Digit.Hooks.hrms.useHRMSGenderMDMS(stateId, "common-masters", "GenderType");

  let HRMenu = [];

  Menu &&
    Menu.map((comGender) => {
      HRMenu.push({ name: `COMMON_GENDER_${comGender.code}`, code: `${comGender.code}` });
    });

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: value });
  }

  return (
    <div>
      {inputs?.map((input, index) => (
        <React.Fragment key={index}>
          {errors[input.name] && <CardLabelError>{t(input.error)}</CardLabelError>}
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">
              {t(input.label)}
              {input.isMandatory ? " * " : null}
            </CardLabel>
            <div className="field" style={{ width: "50%", display: "block" }}>
              <RadioButtons
                style={{ display: "flex", justifyContent: "flex-start" }}
                options={HRMenu}
                key={input.name}
                optionsKey="name"
                selectedOption={formData && formData[config.key] ? formData[config.key][input.name] : null}
                onSelect={(e) => setValue(e, input.name)}
                disable={false}
                defaultValue={undefined}
                t={t}
                {...input.validation}
              />
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectEmployeeGender;
