import React from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-components";

import { useLocation } from "react-router-dom";

const SelectEmployeeName = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const isEdit = window.location.pathname.includes("/edit/");
  const inputs = [
    {
      label: "HR_EMP_NAME_LABEL",
      type: "text",
      name: "employeeName",
      isMandatory: true,
      validation: {
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
    },
  ];

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: value });
  }

  return (
    <div>
      {inputs?.map((input, index) => {
        let currentValue = (formData && formData[config.key] && formData[config.key][input.name]) || "";

        return (
          <React.Fragment key={index}>
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t(input.label)}
                {input.isMandatory ? <span className="required"> *</span> : null}
              </CardLabel>
              <div className="digit-field">
                <TextInput
                  key={input.name}
                  value={formData && formData[config.key] ? formData[config.key][input.name] : undefined}
                  onChange={(e) => setValue(e.target.value, input.name)}
                  disable={true}
                  defaultValue={undefined}
                  {...input.validation}
                />
                {currentValue && currentValue.length > 0 && !currentValue.match(Digit.Utils.getPattern("Name")) && (
                  <CardLabelError style={{ width: "100%", marginTop: "0px", fontSize: "16px", marginBottom: "12px" }}>
                    {t("CORE_COMMON_APPLICANT_NAME_INVALID")}
                  </CardLabelError>
                )}
              </div>
            </LabelFieldPair>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SelectEmployeeName;
