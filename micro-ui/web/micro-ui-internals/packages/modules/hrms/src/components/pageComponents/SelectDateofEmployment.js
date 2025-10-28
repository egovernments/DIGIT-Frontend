import React from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, DatePicker } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { convertEpochToDate } from "../Utils/index";

const SelectDateofEmployment = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const inputs = [
    {
      label: "HR_APPOINTMENT_DATE_LABEL",
      type: "date",
      name: "dateOfAppointment",
      validation: {
        isRequired: true,
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
      isMandatory: true,
    },
  ];

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: value });
  }


  const fieldStyle = {
    maxWidth: "36.25rem",
    paddingRight: "2.5rem",
  };

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
            <div className="field" style={fieldStyle}>
              <DatePicker
                key={input.name}
                min={formData?.SelectDateofBirthEmployment?.dob}
                max={convertEpochToDate(new Date())}
                date={formData && formData[config.key] ? formData[config.key][input.name] : undefined}
                onChange={(e) => setValue(e, input.name)}
                disable={false}
                {...input.validation}
                defaultValue={undefined}
              />
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectDateofEmployment;
