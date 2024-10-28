import { Button, Card, Chip, Header, Loader, NoResultsFound, PopUp, Toast } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RoleTableComposer, { CustomLoader } from "./RoleTableComposer";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./tableCustomStyle";

const Wrapper = ({ setShowPopUp, alreadyQueuedSelectedState }) => {
  const { t } = useTranslation();
  return (
    <PopUp
      className={""}
      style={{
        maxWidth: "40%",
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
          <Chip key={index} text={t(item)} className="" error="" extraStyles={{}} iconReq="" hideClose={true} />
        ))}
      </div>
    </PopUp>
  );
};
function UserAccess({ category, setData, nationalRoles }) {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();
  const [showPopUp, setShowPopUp] = useState(null);
  const [chipPopUp, setChipPopUp] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
        setData(data);
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
  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage); // Update the rows per page state
    setCurrentPage(page); // Optionally reset the current page or maintain it
    refetchPlanEmployee();
  };
  const columns = [
    {
      name: t("NAME"),
      selector: (row) => {
        return row.name;
      },
      sortable: true,
    },
    {
      name: t("EMAIL"),
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: t("CONTACT_NUMBER"),
      selector: (row) => {
        return row.number;
      },
      sortable: true,
    },
    {
      name: t("ADMINISTRATIVE_HIERARCHY"),
      selector: (row) => {
        // if (category?.startsWith("ROOT")) {
        //   return "COUNTRY"; // Set to "Country" if true
        // } else {
        //   return row?.hierarchyLevel; // Otherwise, return the existing hierarchy level
        // }
        return row?.hierarchyLevel;
      },
      sortable: true,
    },
    {
      name: t("ADMINISTRATIVE_BOUNDARY"),
      selector: (row) => {
        return (
          <>
            {row?.jurisdiction?.length > 0 && (
              <>
                {row.jurisdiction.slice(0, 2).map((item, index) => (
                  <div className="digit-tag-container userAccessCell" key={index}>
                    <Chip className="" error="" extraStyles={{}} iconReq="" hideClose={true} text={t(item)} />
                  </div>
                ))}

                {row.jurisdiction.length > 2 && (
                  <Button
                    label={`+${row.jurisdiction.length - 2} ${t("ES_MORE")}`}
                    onClick={() => setChipPopUp(true)}
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

                {chipPopUp && <Wrapper setShowPopUp={setChipPopUp} alreadyQueuedSelectedState={row.jurisdiction} />}
              </>
            )}
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

      <Card>
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button variation="secondary" label={t(`ASSIGN`)} icon={"AddIcon"} onClick={() => setShowPopUp(true)} />
        </div>
        {!isPlanEmpSearchLoading && (!planEmployee?.data || planEmployee?.data?.length === 0) ? (
          <Card>
            <NoResultsFound />
            <Button variation="secondary" label={t(`ASSIGN`)} style={{ margin: "auto" }} icon={"AddIcon"} onClick={() => setShowPopUp(true)} />
          </Card>
        ) : (
          <DataTable
            category={category}
            columns={columns}
            data={planEmployee?.data}
            progressPending={isPlanEmpSearchLoading}
            progressComponent={<CustomLoader />}
            pagination
            paginationServer
            customStyles={tableCustomStyle}
            paginationTotalRows={totalRows}
            onChangePage={handlePaginationChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            paginationPerPage={rowsPerPage}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
          />
        )}
      </Card>

      {showPopUp && (
        <PopUp
          className={"roleComposer"}
          type={"default"}
          heading={t(`${category}_POPUP_HEADING`)}
          children={[<RoleTableComposer category={category} nationalRoles={nationalRoles} />]}
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
