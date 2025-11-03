import { Button, PopUp, Chip, Loader, Card } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { CardSubHeader, Header } from "@egovernments/digit-ui-react-components";
import { tableCustomStyle } from "./tableCustomStyle";
import { ShowMoreWrapper } from "./ShowMoreWrapper";
import { useHistory } from "react-router-dom";


function groupEmployeesByPlan(data, planData) {
  const groupedEmployees = planData?.reduce((acc, plan) => {
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
  return groupedEmployees ? Object.values(groupedEmployees) : [];
}

const UserAccessMgmtTableWrapper = ({ role, internalKey, setupCompleted }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage,setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [showPopUp, setShowPopUp] = useState(false);
  const [chipPopUpRowId, setChipPopUpRowId] = useState(null); 

  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();


  const { isLoading, data: planAssignmentData, refetch: refetchPlanSearch } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
    tenantId: tenantId,
    limit: rowsPerPage,
    offset: (currentPage - 1) *  rowsPerPage,
    body: {
      "PlanEmployeeAssignmentSearchCriteria": {
        tenantId: tenantId,
        planConfigurationId: microplanId, //Eg. "653441d7-a2ec-4196-b978-e2619d9e0848"
        role: [role],
        config:{queryKey:`${microplanId} ${role} ${currentPage}`}
      },
    },
   
    config: {
      select: (data) => {
        return {
          data: groupEmployeesByPlan(data?.data, data?.planData),
          role: data?.planData[0]?.role,
          totalCount: data?.totalCount,
        };
      }
    }
  },
  )


  useEffect(() => {
    refetchPlanSearch();
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    setTotalRows(planAssignmentData?.totalCount);
  }, [planAssignmentData]);


  const columns = [
    {
      name: t("CORE_COMMON_NAME"),
      selector: (row) => {
        return row?.data?.user?.name;
      },
      sortable: true,
    },
    {
      name: t("CORE_COMMON_EMAIL_ID"),
      selector: (row) => row?.data?.user?.emailId || "NA",
      sortable: true,
    },
    {
      name: t("CONTACT_NUMBER"),
      selector: (row) => {
        return row?.data?.user?.mobileNumber || "NA";
      },
      sortable: true,
    },

    {
      name: t("MICROPLAN_ADMINISTRATIVE_HIERARCHY"),
      selector: (row) => {
        return t(`MICROPLAN_${row?.planData?.hierarchyLevel?.toUpperCase()}`);
      },
      sortable: true,
    },
    {
      name: t("MICROPLAN_ADMINISTRATIVE_AREA"),
      cell: (row) => {
        return (
          <div className="digit-tag-container userAccessCell">
            {row?.planData?.jurisdiction?.length > 0 &&
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
                label={`+${row?.planData?.jurisdiction?.length - (2)} ${t("ES_MORE")}`}
                onClick={() => {
                  setChipPopUpRowId(row.planData.id)
                }}
                title={`+${row?.planData?.jurisdiction?.length - (2)} ${t("ES_MORE")}`}
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
            {chipPopUpRowId===row.planData.id && (
              <ShowMoreWrapper
                setShowPopUp={setChipPopUpRowId}
                alreadyQueuedSelectedState={row?.planData?.jurisdiction}
                heading={"MICROPLAN_ADMINISTRATIVE_AREA"}
              />
            )}
          </div>
        );
      },
      sortable: true,
    },
  ];

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    
  };

  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage); // Update the rows per page state
    setCurrentPage(page); // Optionally reset the current page or maintain it
    
  };

  if (isLoading) return <Loader />;
  else if (planAssignmentData?.data?.length === 0) {
    return null;
  }
  else {
    return (
      <Card className="middle-child">
        {/* <div className="view-composer-header-section">
                <CardSubHeader style={{ marginTop: 0, fontSize: "1.5rem", color: " #0B4B66", marginBottom: "0rem" }}>{t(planAssignmentData?.role)}</CardSubHeader>
            </div> */}
        <div className="mp-header-container">
          <Header className="summary-sub-heading">
            {t(planAssignmentData?.role)}
          </Header>
          {!(setupCompleted === 'true') &&

            <Button
              label={t("WBH_EDIT")}
              title={t("WBH_EDIT")}
              variation="secondary"
              icon={"Edit"}
              style={{ width: "7.48rem" }}
              type="button"
              size="medium"
              onClick={(e) => {
                const url = Digit.Hooks.useQueryParams();
                const urlParams = Digit.Hooks.useQueryParams();
                urlParams.key = '9';
                urlParams.internalKey = internalKey + 1;
                const updatedUrl = `${window.location.pathname}?${new URLSearchParams(urlParams).toString()}`;
                history.push(updatedUrl);
              }}
            />
          }
        </div>
        {/* <Card > */}
        <DataTable
          columns={columns}
          data={planAssignmentData?.data}
          customStyles={tableCustomStyle}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePaginationChange}
          paginationPerPage={rowsPerPage}
          paginationDefaultPage={currentPage}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          onChangeRowsPerPage={handleRowsPerPageChange}
          paginationComponentOptions={{ rowsPerPageText:t("ROWS_PER_PAGE") }}
        />
        {/* </Card> */}
      </Card>
    );
  }
}

export default UserAccessMgmtTableWrapper;
