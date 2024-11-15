import { Button, Card, Chip, Header, Loader, PopUp, Toast } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RoleTableComposer, { CustomLoader } from "./RoleTableComposer";
import DataTable from "react-data-table-component";
import { tableCustomStyle } from "./tableCustomStyle";
import TableSearchField from "./TableSearchBar";
import { useQueryClient } from "react-query";
import NoResultsFound from "./NoResultsFound";

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
  const queryClient = useQueryClient();
  const [showPopUp, setShowPopUp] = useState(null);
  const [chipPopUp, setChipPopUp] = useState(null);
  const [chipPopUpRowId, setChipPopUpRowId] = useState(null); 
  const [showToast, setShowToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setIsLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const { mutate: planEmployeeUpdate } = Digit.Hooks.microplanv1.usePlanEmployeeUpdate();
  const {
    isLoading: isPlanEmpSearchLoading,
    data: planEmployee,
    error: planEmployeeError,
    refetch: refetchPlanEmployee,
  } = Digit.Hooks.microplanv1.usePlanSearchEmployeeWithTagging({
    tenantId: tenantId,
    limit: rowsPerPage,
    offset: (currentPage - 1) * 5,
    names: searchQuery,
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
            planData: data?.planData?.find((i) => i?.employeeId === item?.user?.userServiceUuid),
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
  }, [totalRows, currentPage, rowsPerPage, searchQuery]);
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

  const handleUpdateAssignEmployee = (row) => {
    setIsLoading(true);
    const payload = {
      PlanEmployeeAssignment: {
        ...row?.planData,
        active: !row?.planData?.active,
      },
    };
    planEmployeeUpdate(payload, {
      onSuccess: (data) => {
        queryClient.invalidateQueries("PLAN_SEARCH_EMPLOYEE_WITH_TAGGING");
        refetchPlanEmployee();
        setShowToast({ key: "success", label: t("UNASSIGNED_SUCCESSFULLY") });
        setIsLoading(false);
      },
      onError: (error, variables) => {
        setShowToast({ key: "error", label: error?.message ? error.message : t("FAILED_TO_UPDATE_RESOURCE") });
        setIsLoading(false);
      },
    });
  };
  const columns = [
    {
      name: t("NAME"),
      selector: (row) => {
        return row.name || t("NA");
      },
      sortable: true,
    },
    {
      name: t("EMAIL"),
      selector: (row) => row.email || t("NA"),
      sortable: true,
    },
    {
      name: t("CONTACT_NUMBER"),
      selector: (row) => {
        return row.number || t("NA");
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
        return t(row?.hierarchyLevel || "NA");
      },
      sortable: true,
    },
    {
      name: t("ADMINISTRATIVE_BOUNDARY"),
      selector: (row) => {
        return (
          <div className="digit-tag-container userAccessCell">
            {row?.jurisdiction?.length > 0 && (
              <>
                {row.jurisdiction.slice(0, 2).map((item, index) => (
                  <Chip className="" error="" extraStyles={{}} iconReq="" hideClose={true} text={t(item)} />
                ))}

                {row.jurisdiction.length > 2 && (
                  <Button
                    label={`+${row.jurisdiction.length - 2} ${t("ES_MORE")}`}
                    onClick={() => setChipPopUpRowId(row.id)}
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

                {chipPopUpRowId === row.id && (
                  <Wrapper setShowPopUp={setChipPopUpRowId} alreadyQueuedSelectedState={row.jurisdiction} />
                )}
              </>
            )}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: t("ACTION"),
      cell: (row) => {
        return (
          <Button
            className={"roleTableCell"}
            variation={"secondary"}
            label={t(`UNASSIGN`)}
            title={t(`UNASSIGN`)}
            style={{ padding: "1rem" }}
            icon={"Close"}
            isSuffix={false}
            onClick={(value) => handleUpdateAssignEmployee(row)}
          />
        );
      },
    },
  ];

  const handleSearch = (query) => {
    // if (query?.length >= 2) {
      setSearchQuery(query);
    // } else {
      // setSearchQuery(null);
    // }
    // Handle search logic, such as filtering or API calls
  };

  return (
    <>
      <Card className="middle-child">
        <Header className="uploader-sub-heading">{t(category)}</Header>
        <p className="mp-description">{t(`${category}_DESCRIPTION`)}</p>
      </Card>

      <Card style={{ maxWidth: "100%", overflow: "auto", marginBottom: "2.5rem" }}>
        {planEmployee?.data?.length > 0 || searchQuery ? (
          <div style={styles.container}>
            <TableSearchField onSearch={handleSearch} />
            <Button
              variation="secondary"
              label={t(Digit.Utils.locale.getTransformedLocale(`ASSIGN_` + category))}
              icon={"AddIcon"}
              onClick={() => setShowPopUp(true)}
            />
          </div>
        ) : null}
        {!isPlanEmpSearchLoading && (!planEmployee?.data || planEmployee?.data?.length === 0) ? (
          <Card style={{ boxShadow: "none" }}>
            <NoResultsFound text={searchQuery ? Digit.Utils.locale.getTransformedLocale(`NO_SEARCH_RESUTS_${category}`) : Digit.Utils.locale.getTransformedLocale(`NO_RESULTS_${category}`)} />
            <Button
              variation="secondary"
              label={t(Digit.Utils.locale.getTransformedLocale(`ASSIGN_` + category))}
              style={{ margin: "auto" }}
              icon={"AddIcon"}
              onClick={() => setShowPopUp(true)}
            />
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
          onOverlayClick={() => {
            setShowPopUp(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("CLOSE")}
              onClick={() => setShowPopUp(false)}
              style={{ minWidth: "200px" }}
            />,
          ]}
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

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between", // Ensures space between search and button
    alignItems: "center",
    width: "100%",
    padding: "8px", // Optional padding for layout
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row-reverse",
  },
};

export default UserAccess;
