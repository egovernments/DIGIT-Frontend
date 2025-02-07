import React, { useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, DatePicker } from "@egovernments/digit-ui-components";
import { useLocation } from "react-router-dom";
import { convertEpochToDate } from "../Utils/index";

const SelectDateofEmployment = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const [date, setDate] = useState("");
  const inputs = [
    {
      label: "HR_BIRTH_DATE_LABEL",
      type: "date",
      name: "dateOfAppointment",
      validation: {
        isRequired: false,
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
      isMandatory: false,
    },
  ];

  const setValue = (e, input) => {
    onSelect(config.key, { ...formData[config.key], [input]: e });
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
            <div className="field">
              <TextInput
                type="date"
                populators={{ name: "date" }}
                key={input.name}
                onChange={(e) => {
                  setDate(e);
                  setValue(e, input.name);
                }}
                disable={false}
                value={date}
                // defaultValue={undefined}
                // value=""
              />
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectDateofEmployment;
