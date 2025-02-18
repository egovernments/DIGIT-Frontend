import React, { useState } from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError, DatePicker } from "@egovernments/digit-ui-components";
import { useLocation } from "react-router-dom";
import { convertEpochToDate } from "../Utils/index";

const SelectDateofBirthEmployment = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const [date, setDate] = useState("");
  //const isEdit = window.location.pathname.includes("/edit/");
  const inputs = [
    {
      label: "HR_BIRTH_DATE_LABEL",
      type: "date",
      name: "dob",
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
            <div className="digit-field">
              <TextInput
                populators={{
                  name: "date" ,
                  validation: { ...input.validation },
                }}
                type="date"
                //populators={{ name: "date" }}
                onChange={(e) => {
                 // setDate(e || "");
                  setValue(e || "", input.name);
                }}
                // value={date}
                value={formData && formData[config.key] ? formData[config.key][input.name] : undefined}
                key={input.name}
                // onChange={(e) => {
                //   setValue(e, input.name);
                // }}
                disable={false}
                max={convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18))}
              />
            </div>
          </LabelFieldPair>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SelectDateofBirthEmployment;
