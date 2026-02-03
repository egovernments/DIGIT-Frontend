import React, { useEffect } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectEmployeeId = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const isEdit = window.location.pathname.includes("/edit/");
  const inputs = [
    {
      label: "HR_EMP_ID_LABEL",
      type: "text",
      name: "code",
      isMandatory: true,
      validation: {
        isRequired: true,
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
    },
  ];

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: value });
  }

  //Introduce useEffect to call onSelect function for MutliRootTenant explicitly.
  useEffect(() => {
    if(Digit.Utils.getMultiRootTenant()){
      onSelect(config.key, { ...formData[config.key], code: formData?.SelectEmployeeEmailId?.emailId });
    }
  },[formData?.SelectEmployeeEmailId?.emailId])

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
            <div className="field">
              <TextInput
                key={input.name}
                value={
                  Digit.Utils.getMultiRootTenant() && formData?.SelectEmployeeEmailId?.emailId
                    ? formData?.SelectEmployeeEmailId?.emailId
                    : formData && formData[config.key]
                    ? formData[config.key][input.name]
                    : undefined
                }
                onChange={(e) => setValue(e.target.value, input.name)}
                disable={Digit.Utils.getMultiRootTenant() ? true : isEdit}
                defaultValue={undefined}
                {...input.validation}
              />
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectEmployeeId;
