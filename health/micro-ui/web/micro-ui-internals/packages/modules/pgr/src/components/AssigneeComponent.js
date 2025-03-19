import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Dropdown,  } from "@egovernments/digit-ui-components";
import { CardLabel, Loader } from "@egovernments/digit-ui-components";

const AssigneeComponent = ({ config, roles=[] }) => {

    const { t } = useTranslation();
    const [assignees, setAssignees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { isLoading: isEmployeeDataLoading, data: employeeData, } = Digit.Hooks.useCustomAPIHook({
        url: "/egov-hrms/employees/_search",
        params: {
            tenantId: tenantId,
            roles: roles.join(","),
        },
        config: {
            enabled: roles.length > 0,
        },
    }
    );

    function transformData(data) {
        return Object.values(
          data.reduce((acc, item) => {
            const employee = item;
            
            if (!acc[item?.assignments?.[0]?.department]) {
              acc[item?.assignments?.[0]?.department] = {
                code: item?.assignments?.[0]?.department,
                name: `DEPARTMENT_${item?.assignments?.[0]?.department}`,
                options: []
              };
            }
            
            acc[item?.assignments?.[0]?.department].options.push({...item, name: item?.user?.name, mobileNumber: item?.user?.mobileNumber, code: `${item?.user?.name} - ${item?.assignments?.[0]?.department}`});
      
            return acc;
          }, {})
        );
      }


    useEffect(() => {
        if(employeeData?.Employees?.length > 0){
            let filteredAssignees = employeeData?.Employees.filter((employee) => employee?.assignments && employee?.assignments?.length > 0 && employee?.assignments?.[0]?.department);
            setAssignees(transformData(filteredAssignees));
        }
    }, [employeeData]);

    return (
        <React.Fragment>
            {/* {assignees && <SectionalDropdown selected={selectedEmployee} menuData={employeeData?.Employees} displayKey="name" select={(e) => {
                setSelectedEmployee(e);
            }} />} */}
            {isEmployeeDataLoading && <Loader></Loader>}
            {
                employeeData && <Dropdown
                additionalWrapperClass=""
                description=""
                error=""
                errorStyle={null}
                inputRef={null}
                name="nestedoptions"
                option={assignees}
                optionKey="name"
                optionsCustomStyle={{}}
                select={(emp) => {
                    setSelectedEmployee(emp);
                }}
                t={t}
                type="dropdown"
                variant="nesteddropdown"
              />
            }
          </React.Fragment>
    );
}

export default AssigneeComponent;