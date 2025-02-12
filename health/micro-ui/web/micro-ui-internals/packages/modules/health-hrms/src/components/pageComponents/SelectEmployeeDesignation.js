import React, { useState, useEffect } from "react";
// import { Loader } from "@egovernments/digit-ui-react-components";
import { Dropdown, LabelFieldPair, CardLabel, Loader } from "@egovernments/digit-ui-components";
import { useLocation } from "react-router-dom";

const SelectEmployeeDesignation = ({ t, config, onSelect, formData = {}, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const { data: EmployeeDesignations = {}, isLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};
  const [employeeDesignation, setemployeeDesignation] = useState(formData?.SelectEmployeeDesignation);
  function SelectEmployeeDesignation(value) {
    setemployeeDesignation(value);
  }

  useEffect(() => {
    onSelect(config.key, employeeDesignation);
  }, [employeeDesignation]);

  function getDesignationdata() {
    return EmployeeDesignations?.MdmsRes?.["common-masters"]?.Designation.map((ele) => {
      ele["i18key"] = t("COMMON_MASTERS_Designation_" + ele.code);
      return ele;
    });
  }

  const inputs = [
    {
      label: "HR_EMPLOYMENT_Designation_LABEL",
      type: "text",
      name: "EmployeeDesignation",
      validation: {
        isRequired: true,
      },
      isMandatory: true,
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return inputs?.map((input, index) => {
    return (
      <LabelFieldPair key={index}>
        <CardLabel className="card-label-smaller">
          {t(input.label)}
          {input.isMandatory ? " * " : null}
        </CardLabel>
        <Dropdown
          className="digit-field"
          selected={employeeDesignation}
          option={getDesignationdata() || []}
          select={SelectEmployeeDesignation}
          optionKey="code"
          defaultValue={undefined}
          t={t}
        />
      </LabelFieldPair>
    );
  });
};

export default SelectEmployeeDesignation;
