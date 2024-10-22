import { Button, PopUp, Chip, Loader,} from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { CardSubHeader, Card } from "@egovernments/digit-ui-react-components";


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

  const Wrapper = ({ setShowPopUp, alreadyQueuedSelectedState }) => {
   
    const { t } = useTranslation();
     return (
        <PopUp
        className={""}
        style={{
            maxWidth: '40%'
        }}
        type={"default"}
        heading={t("MICROPLAN_ADMINISTRATIVE_AREA")}
        children={[]}
        onOverlayClick={() => {
            setShowPopUp(false);
        }}
        onClose={() => {
            setShowPopUp(false);
        }}
        >
        <div className="digit-tag-container userAccessCell">
       {alreadyQueuedSelectedState?.map((item, index) => (
                <Chip 
                 key={index} 
                 text={t(item)} 
                 className=""
                 error=""
                 extraStyles={{}}
                 iconReq=""
                 hideClose={true}
                />
          ))}  
          </div>
        </PopUp>
     );

  };

const UserAccessMgmtTableWrapper = ({ role,}) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [showPopUp, setShowPopUp] = useState(false);
  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();


  const { isLoading: isLoading, data: planAssignmentData, refetch: refetchPlanSearch} = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
    tenantId: tenantId,
    body: {
        "PlanEmployeeAssignmentSearchCriteria": {
            tenantId: tenantId,
            planConfigurationId: microplanId, //Eg. "653441d7-a2ec-4196-b978-e2619d9e0848"
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
    setTotalRows(planAssignmentData?.totalCount);
  }, [planAssignmentData]);

  const openPopUp = (alreadyQueuedSelectedState) => {
    setShowPopUp(true);
  };
 
  const columns = [
    {
      name: t("CORE_COMMON_NAME"),
      selector: (row) => {
        return row.data?.user?.name;
      },
      sortable: true,
    },
    {
      name: t("CORE_COMMON_EMAIL_ID"),
      selector: (row) => row.data?.user?.emailId || "NA",
      sortable: true,
    },
    {
      name: t("CONTACT_NUMBER"),
      selector: (row) => {
        return row.data.user?.mobileNumber || "NA";
      },
      sortable: true,
    },

    {
        name: t("MICROPLAN_ADMINISTRATIVE_HIERARCHY"),
        selector: (row) => {
          return t(`MICROPLAN_${row.planData.hierarchyLevel?.toUpperCase()}`) ;
        },
        sortable: true,
    },
    {
        name: t("MICROPLAN_ADMINISTRATIVE_AREA"),
        cell: (row) => {
            return (
                <div className="digit-tag-container userAccessCell">
                    {row.planData.jurisdiction?.length > 0 &&
            row.planData?.jurisdiction
              ?.slice(0, 2)
              ?.map((value, index) => {
                const translatedText = t(value);
                return (
                  <Chip
                    key={index}
                    text={translatedText?.length > 64 ? `${translatedText.slice(0, 64)}...` : translatedText}
                    className=""
                    error=""
                    extraStyles={{}}
                    iconReq=""
                    hideClose={true}
                  />
                );
              })}

          {row.planData.jurisdiction?.length > (2) && (
            <Button
              label={`+${row.planData.jurisdiction.length - (2)} ${t("ES_MORE")}`}
              onClick={() => openPopUp(row.planData.jurisdiction)}
              variation="link"
              style={{
                height: "2rem",
                minWidth: "4.188rem",
                minHeight: "2rem",
                padding: "0.5rem",
                justifyContent: "center",
                alignItems: "center",
              }}
              textStyles={{
                height: "auto",
                fontSize: "0.875rem",
                fontWeight: "400",
                width: "100%",
                lineHeight: "16px",
                color: "#C84C0E",
              }}
            />
          )}
           {showPopUp && (
            <Wrapper
              setShowPopUp={setShowPopUp}
              alreadyQueuedSelectedState={row.planData.jurisdiction}
            ></Wrapper>
          )}
                </div>
            );
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
  return(
    <Card>
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
        
    </Card>
    );
}
}

export default UserAccessMgmtTableWrapper;
