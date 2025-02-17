import React from "react";
import { useLocation } from "react-router-dom";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-components";
import { getPattern } from "../../utils/utlis";

const SelectEmployeePassword = ({ t, config, onSelect, formData = {}, errors }) => {
  const { pathname: url } = useLocation();
  const isEdit = window.location.pathname.includes("/edit/");
  const inputs = [
    {
      label: "HR_EMP_PASSWORD_LABEL",
      type: "text",
      password: "employeePassword",
      validation: {
        type: "password",
      },
      isMandatory: true,
    },
    {
      label: "HR_EMP_CONFIRM_PASSWORD_LABEL",
      type: "text",
      password: "employeeConfirmPassword",
      validation: {
        type: "password",
      },
      isMandatory: true,
    },
  ];

  const setValue = (e, input) => {
    if (e == undefined || e.target == undefined || e.target.value == undefined) {
      return;
    }
    onSelect(config.key, { ...formData[config.key], [input]: e.target.value });
  };

  return !isEdit ? (
    <div>
      {inputs?.map((input, index) => {
        let password = (formData && formData[config.key] && formData[config.key]["employeePassword"]) || "";
        let confirmPassword = (formData && formData[config.key] && formData[config.key]["employeeConfirmPassword"]) || "";
        return (
          <React.Fragment key={index}>
            {errors[input.password] && <CardLabelError>{t(input.error)}</CardLabelError>}
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">
                {t(input.label)}
                {input.isMandatory ? " * " : null}
              </CardLabel>
              <div className="digit-field">
                <TextInput
                  type="password"
                  key={input.password}
                  value={formData && formData[config.key] ? formData[config.key][input.password] : undefined}
                  onChange={(e) => {
                    setValue(e, input.password);
                  }}
                  disable={false}
                  //  defaultValue={undefined}
                  {...input.validation}
                />
                {input.password === "employeePassword" && password && password.length > 0 && !password.match(getPattern("Password")) && (
                  <CardLabelError style={{ width: "100%", marginTop: "0px", fontSize: "16px", marginBottom: "12px" }}>
                    {t("CORE_COMMON_APPLICANT_PASSWORD_INVALID")}
                  </CardLabelError>
                )}
                {input.password === "employeeConfirmPassword" && confirmPassword && confirmPassword.length > 0 && confirmPassword !== password && (
                  <CardLabelError style={{ width: "100%", marginTop: "0px", fontSize: "16px", marginBottom: "12px" }}>
                    {t("CORE_COMMON_APPLICANT_CONFIRM_PASSWORD_INVALID")}
                  </CardLabelError>
                )}
              </div>
            </LabelFieldPair>
          </React.Fragment>
        );
      })}
    </div>
  ) : null;
};

export default SelectEmployeePassword;
