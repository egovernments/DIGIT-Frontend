import { Button, Card, Chip, Header, NoResultsFound, PopUp, Toast } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RoleTableComposer from "./RoleTableComposer";
import DataTable from "react-data-table-component";

function UserAccess({ category }) {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();
  const [showPopUp, setShowPopUp] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const {
    isLoading: isPlanEmpSearchLoading,
    data: planEmployee,
    error: planEmployeeError,
    refetch: refetchPlanEmployee,
  } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
    tenantId: tenantId,
    limit: rowsPerPage,
    offset: (currentPage - 1) * 5,
    body: {
      PlanEmployeeAssignmentSearchCriteria: {
        tenantId: tenantId,
        planConfigurationId: microplanId,
        role: [category],
        active: true,
      },
    },
    config: {
      enabled: true,
      select: (data) => {
        const rowData = data?.data?.map((item, index) => {
          return {
            id: index + 1,
            name: item?.user?.name,
            email: item?.user?.emailId,
            number: item?.user?.mobileNumber,
            hierarchyLevel: data?.planData?.find((i) => i?.employeeId === item?.user?.userServiceUuid)?.hierarchyLevel,
            jurisdiction: data?.planData?.find((i) => i?.employeeId === item?.user?.userServiceUuid)?.jurisdiction,
          };
        });
        return {
          data: rowData,
          totalCount: data?.totalCount,
        };
      },
    },
  });

  useEffect(() => {
    refetchPlanEmployee();
  }, [totalRows, currentPage, rowsPerPage]);
  useEffect(() => {
    setTotalRows(planEmployee?.totalCount);
  }, [planEmployee]);
  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    refetchPlanEmployee();
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => {
        return row.name;
      },
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Contact Number",
      selector: (row) => {
        return row.number;
      },
      sortable: true,
    },
    {
      name: "Adminitrative Heirarchy",
      selector: (row) => {
        return row?.hierarchyLevel;
      },
      sortable: true,
    },
    {
      name: "Adminitrative Boundary",
      selector: (row) => {
        return (
          <>
            {row?.jurisdiction?.map((item) => (
              <div className="digit-tag-container userAccessCell">
                <Chip
                  className=""
                  error=""
                  extraStyles={{}}
                  iconReq=""
                  hideClose={true}
                  // onClick={function noRefCheck() {}}
                  // onTagClick={function noRefCheck() {}}
                  text={t(item)}
                />
              </div>
            ))}
          </>
        );
      },
      sortable: true,
    },
  ];

  return (
    <>
      <Card style={{ marginBottom: "1rem" }}>
        <Header>{t(category)}</Header>
        <p className="mp-description">{t(`${category}_DESCRIPTION`)}</p>
      </Card>

      {planEmployee?.data?.length > 0 ? (
        <Card>
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button variation="secondary" label={t(`ASSIGN`)} icon={"AddIcon"} onClick={() => setShowPopUp(true)} />
          </div>
          <DataTable
            columns={columns}
            data={planEmployee?.data}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePaginationChange}
            paginationPerPage={rowsPerPage}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
          />
        </Card>
      ) : (
        <Card>
          <NoResultsFound />
          <Button variation="secondary" label={t(`ASSIGN`)} style={{ margin: "auto" }} icon={"AddIcon"} onClick={() => setShowPopUp(true)} />
        </Card>
      )}

      {showPopUp && (
        <PopUp
          className={"roleComposer"}
          type={"default"}
          heading={t(`${category}`)}
          children={[<RoleTableComposer />]}
          onOverlayClick={() => {}}
          footerChildren={[<Button type={"button"} size={"large"} variation={"secondary"} label={t("CLOSE")} onClick={() => setShowPopUp(false)} />]}
          sortFooterChildren={true}
          onClose={() => setShowPopUp(false)}
        />
      )}

      {showToast && (
        <Toast
          type={showToast.key === "error" ? "error" : "success"} // Adjust based on your needs
          label={t(showToast.label)}
          transitionTime={showToast.transitionTime}
          onClose={() => {
            setShowToast(false);
          }}
          isDleteBtn={true}
        />
      )}
    </>
  );
}

export default UserAccess;
