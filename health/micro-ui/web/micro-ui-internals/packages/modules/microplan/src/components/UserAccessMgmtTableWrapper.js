import { Button, Card, Dropdown, Loader, MultiSelectDropdown, TableMolecule, Toast } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { CardLabel, LabelFieldPair, LinkLabel, SubmitBar, TextInput, CardSubHeader } from "@egovernments/digit-ui-react-components";
import { useUserAccessContext } from "./UserAccessWrapper";
import { useMyContext } from "../utils/context";
import { useQueryClient } from "react-query";

function groupEmployeesByPlan(data, planData) {
    const groupedEmployees = planData.reduce((acc, plan) => {
      // Find matching user from data array by comparing userServiceUuid with employeeId
      const matchedEmployee = data.find(employee => employee.user?.userServiceUuid === plan.employeeId);
  
      // If matched employee is found
      if (matchedEmployee) {
        // Group by employeeId
        if (!acc[plan.employeeId]) {
          acc[plan.employeeId] = {
            employeeId: plan.employeeId,
            role: plan.role,
            userName: matchedEmployee.user?.userName,
            employeeName: matchedEmployee.user?.name,
            data: matchedEmployee,
            planData: plan,
          };
        }
      }
      return acc;
    }, {});
  
    // Convert grouped object to an array of values for easier use
    return Object.values(groupedEmployees);
  }

const UserAccessMgmtTableWrapper = ({ role,}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();


  const { isLoading: isLoading, data: planAssignmentData, refetch: refetchPlanSearch} = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
    tenantId: tenantId,
    body: {
        "PlanEmployeeAssignmentSearchCriteria": {
            tenantId: tenantId,
            planConfigurationId: "653441d7-a2ec-4196-b978-e2619d9e0848",
            role: [role]
        },
    },
    limit: rowsPerPage,
    offset: (currentPage - 1) * 5,
    config: {
        select: (data) => {
            return  {
                data: groupEmployeesByPlan(data.data, data.planData),
                role: data.planData[0]?.role,
                totalCount: data?.totalCount,
            };
        } 
    }
  },
)


  useEffect(() => {
    refetchPlanSearch();
  }, [totalRows, currentPage, rowsPerPage]);

  useEffect(() => {
    console.log("setTotalRows");
    setTotalRows(planAssignmentData?.totalCount);
  }, [planAssignmentData]);

 
  const columns = [
    {
      name: "Name",
      selector: (row) => {
        return row.data?.user?.name;
      },
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.data?.user?.emailId || "NA",
      sortable: true,
    },
    {
      name: "Contact Number",
      selector: (row) => {
        return row.data.user?.mobileNumber || "NA";
      },
      sortable: true,
    },
  ];

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    refetchPlanSearch();
  };

  if (isLoading) return <Loader />;
  else {
    // const result = groupEmployeesByPlan(planAssignmentData.data, planAssignmentData.planData);

  return(
    <div>
       
        {/* Second card */}
        
        
            <div className="view-composer-header-section">
                <CardSubHeader style={{ marginTop: 0, fontSize: "1.5rem", color: " #0B4B66", marginBottom: "0rem" }}>{t(planAssignmentData?.role)}</CardSubHeader>
            </div>
            <DataTable
    columns={columns}
    data={planAssignmentData?.data}
    pagination
    paginationServer
    paginationTotalRows={totalRows}
    onChangePage={handlePaginationChange}
    paginationPerPage={rowsPerPage}
    paginationRowsPerPageOptions={[5, 10, 15, 20]}
  />
        
    </div>
    );
}
}

export default UserAccessMgmtTableWrapper;
