import React, { useState, useEffect } from "react";
//import { Loader } from "@egovernments/digit-ui-react-components";
import { Dropdown, LabelFieldPair, CardLabel, Loader } from "@egovernments/digit-ui-components";
import { useLocation } from "react-router-dom";

const SelectEmployeeDepartment = ({ t, config, onSelect, formData = {}, userType }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const { data: EmployeeDepartments = {}, isLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};
  const [employeeDepartment, setemployeeDepartment] = useState(formData?.SelectEmployeeDepartment);
  function SelectEmployeeDepartment(value) {
    setemployeeDepartment(value);
  }

  useEffect(() => {
    onSelect(config.key, employeeDepartment);
  }, [employeeDepartment]);

  function getdepartmentdata() {
    return EmployeeDepartments?.MdmsRes?.["common-masters"]?.Department.map((ele) => {
      ele["i18key"] = t("COMMON_MASTERS_DEPARTMENT_" + ele.code);
      return ele;
    });
  }

  const inputs = [
    {
      label: "HR_EMPLOYMENT_DEPARTMENT_LABEL",
      type: "text",
      name: "EmployeeDepartment",
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
          className="form-field"
          selected={employeeDepartment}
          option={getdepartmentdata() || []}
          select={SelectEmployeeDepartment}
          optionKey="code"
          defaultValue={undefined}
          t={t}
        />
      </LabelFieldPair>
    );
  });
};

export default SelectEmployeeDepartment;
