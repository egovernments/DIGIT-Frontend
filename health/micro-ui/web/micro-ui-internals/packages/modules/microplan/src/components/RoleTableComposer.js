import { Button, Card, Dropdown, Loader, TableMolecule, Toast, CardText,PopUp,CustomSVG } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import { CardLabel, LabelFieldPair, LinkLabel, SubmitBar, TextInput } from "@egovernments/digit-ui-react-components";
import { useUserAccessContext } from "./UserAccessWrapper";
import { useMyContext } from "../utils/context";
import { useQueryClient } from "react-query";
import { tableCustomStyle } from "./tableCustomStyle";
import styled, { keyframes } from "styled-components";
import useThrottleUnique from "../hooks/useThrottleUnique"
// import _ from "lodash";

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;
const Spinner = styled.div`
  margin: 16px;
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 2px solid grey;
  border-right: 2px solid grey;
  border-bottom: 2px solid grey;
  border-left: 4px solid black;
  background: transparent;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;
export function CustomLoader() {
  return (
    <div style={{ padding: "24px" }}>
      <Spinner />
    </div>
  );
}

function RoleTableComposer({ nationalRoles }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const totalFormData = Digit.SessionStorage.get("MICROPLAN_DATA");
  const MultiSelectWrapper = Digit.ComponentRegistryService.getComponent("MultiSelectDropdownBoundary");
  const selectedData = totalFormData?.BOUNDARY?.boundarySelection?.selectedData || [];
  const { hierarchyData, category } = useUserAccessContext();
  const { state, lowestHierarchy } = useMyContext();
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState({});
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [showToast, setShowToast] = useState(null);
  const { campaignId, microplanId, key, ...queryParams } = Digit.Hooks.useQueryParams();
  const { mutate: planEmployeeCreate } = Digit.Hooks.microplanv1.usePlanEmployeeCreate();
  const { mutate: planEmployeeUpdate } = Digit.Hooks.microplanv1.usePlanEmployeeUpdate();
  const [isLoading, setIsLoading] = useState(null);
  const [unassignPopup, setUnassignPopup] = useState(false); //true when set to rows
  const topBoundary = state?.boundaryHierarchy.find((boundary) => boundary.parentBoundaryType === null);
  const topBoundaryCode = topBoundary?.boundaryType;
  const topBoundaryValue = totalFormData?.BOUNDARY?.boundarySelection?.boundaryData?.[topBoundaryCode]
    ? Object.values(totalFormData.BOUNDARY.boundarySelection.boundaryData?.[topBoundaryCode])[0]
    : undefined;
  const { isLoading: isHrmsLoading, data: HrmsData, error: hrmsError, refetch: refetchHrms } = Digit.Hooks.microplanv1.useSearchHRMSEmployee({
    tenantId: tenantId,
    microplanId: microplanId,
    body: {},
    limit: rowsPerPage,
    offset: (currentPage - 1) * 5,
    roles: category,
    filters: filters,
    config: {
      enabled: true,
      select: (data) => {
        const resp = data?.Employees
        ?.map((item, index) => {
          return {
            rowIndex: index + 1,
            name: item?.user?.name,
            email: item?.user?.emailId,
            number: item?.user?.mobileNumber,
            employeeId: item?.user?.userServiceUuid,
            user: item?.user,
            selectedHierarchy: nationalRoles?.includes(category)
              ? topBoundary
              : state?.boundaryHierarchy?.find(
                (j) => j.boundaryType === data?.planData?.find((i) => i.employeeId === item?.user?.userServiceUuid)?.hierarchyLevel
              ),
            selectedBoundaries: nationalRoles?.includes(category)
              ? topBoundaryValue
              : data?.planData?.find((i) => i.employeeId === item?.user?.userServiceUuid)?.jurisdiction,
            userServiceUuid: item?.user?.userServiceUuid,
            planData: data?.planData?.find((i) => i.employeeId === item?.user?.userServiceUuid),
          };
        });
        return {
          planSearchData: data?.planData,
          data: resp,
          totalCount: data?.totalCount,
        };
      },
    },
  });

  useEffect(() => {
    if (HrmsData && HrmsData?.data) {
      // Initialize rowData from the HrmsData
      const initializedRowData = HrmsData.data.map((employee, index) => {
        const filteredBoundary = selectedData?.filter((item) => item?.type === employee?.selectedHierarchy?.boundaryType);
        const boundaryOptions = Digit.Utils.microplanv1.groupByParent(filteredBoundary);
        return {
          rowIndex: index + 1,
          name: employee?.name,
          email: employee?.email,
          number: employee?.number,
          employeeId: employee?.employeeId,
          userServiceUuid: employee?.userServiceUuid,
          selectedHierarchy: employee?.selectedHierarchy || null,
          boundaryOptions: boundaryOptions || [],
          selectedBoundaries: nationalRoles?.includes(category)
            ? filteredBoundary.filter((item) => employee?.selectedBoundaries?.includes(topBoundaryValue))
            : filteredBoundary.filter((item) => employee?.selectedBoundaries?.includes(item?.code)) || [],
        }; // Closing brace for the returned object
      });

      setRowData(initializedRowData); // Set the initialized data in the state
    }
  }, [HrmsData]);

  useEffect(() => {
    refetchHrms();
  }, [totalRows, currentPage, rowsPerPage]);
  useEffect(() => {
    setTotalRows(HrmsData?.totalCount);
  }, [HrmsData]);
  // const handleHierarchyChange = (value, row) => {
  //   setRowData((prev) => {
  //     const newRowData = [...prev];
  //     const filteredBoundary = selectedData?.filter((item) => item?.type === value?.boundaryType);
  //     const boundaryOptions = Digit.Utils.microplanv1.groupByParent(filteredBoundary);
  //     newRowData[row.rowIndex] = {
  //       rowIndex: row?.rowIndex,
  //       selectedHierarchy: value,
  //       boundaryOptions,
  //       selectedBoundaries: newRowData[row.rowIndex]?.selectedBoundaries || [], // Keep existing selected boundaries
  //     };
  //     return newRowData;
  //   });
  // };
  const handleHierarchyChange = (value, row) => {
    setRowData((prev) => {
      // Find the existing row by rowIndex
      const existingRow = prev.find((i) => i.rowIndex === row.rowIndex);

      const filteredBoundary = selectedData?.filter((item) => item?.type === value?.boundaryType);
      const boundaryOptions = Digit.Utils.microplanv1.groupByParent(filteredBoundary);

      if (existingRow) {
        // If the row exists, update it
        return prev.map((i) =>
          i.rowIndex === row.rowIndex
            ? {
              ...i,
              selectedHierarchy: value,
              boundaryOptions,
              selectedBoundaries: [], // Keep existing selected boundaries
            }
            : i
        );
      } else {
        // If the row does not exist, create a new one
        return [
          ...prev,
          {
            rowIndex: row?.rowIndex,
            selectedHierarchy: value,
            boundaryOptions,
            selectedBoundaries: [], // Default empty selected boundaries for new rows
          },
        ];
      }
    });
  };
  // const handleBoundaryChange = (value, row) => {
  //   if (!value) return;

  //   if (value.length === 0) {
  //     setRowData((prev) => {
  //       const newRowData = [...prev];
  //       newRowData[row?.rowIndex] = { ...newRowData[row?.rowIndex], selectedBoundaries: [] }; // Update selected boundaries for the row
  //       return newRowData;
  //     });
  //     return;
  //   }

  //   //otherwise your event object would look like this [[a,b],[a,b]] bs' are the boundaries that we need
  //   const boundariesInEvent = value?.map((event) => {
  //     return event?.[1];
  //   });

  //   setRowData((prev) => {
  //     const newRowData = [...prev];
  //     newRowData[row?.rowIndex] = { ...newRowData[row?.rowIndex], selectedBoundaries: boundariesInEvent }; // Update selected boundaries for the row
  //     return newRowData;
  //   });
  // };

  const handleBoundaryChange = (value, row) => {
    if (!value) return;

    if (value.length === 0) {
      setRowData((prev) => {
        // Find the existing row by rowIndex
        const existingRow = prev.find((i) => i.rowIndex === row.rowIndex);

        if (existingRow) {
          // If the row exists, update selectedBoundaries to an empty array
          return prev.map((i) =>
            i.rowIndex === row.rowIndex
              ? {
                ...i,
                selectedBoundaries: [], // Clear selected boundaries
              }
              : i
          );
        } else {
          // If the row doesn't exist, add a new entry
          return [
            ...prev,
            {
              rowIndex: row?.rowIndex,
              selectedBoundaries: [], // Initialize with an empty array
            },
          ];
        }
      });
      return;
    }

    // Otherwise, extract the boundaries from the event
    const boundariesInEvent = value?.map((event) => event?.[1]);

    setRowData((prev) => {
      // Find the existing row by rowIndex
      const existingRow = prev.find((i) => i.rowIndex === row.rowIndex);

      if (existingRow) {
        // If the row exists, update selectedBoundaries with new boundaries
        return prev.map((i) =>
          i.rowIndex === row.rowIndex
            ? {
              ...i,
              selectedBoundaries: boundariesInEvent, // Update boundaries
            }
            : i
        );
      } else {
        // If the row doesn't exist, add a new entry
        return [
          ...prev,
          {
            rowIndex: row?.rowIndex,
            selectedBoundaries: boundariesInEvent, // Set new boundaries
          },
        ];
      }
    });
  };

  const handleAssignEmployee = (row) => {
    setIsLoading(true);
    const payload = {
      PlanEmployeeAssignment: {
        tenantId: tenantId,
        planConfigurationId: microplanId,
        employeeId: row?.userServiceUuid,
        role: category,
        hierarchyLevel: rowData?.find((item) => item?.rowIndex === row?.rowIndex)?.selectedHierarchy?.boundaryType,
        jurisdiction: rowData?.find((item) => item?.rowIndex === row?.rowIndex)?.selectedBoundaries?.map((item) => item?.code),
        active: true,
      },
    };
    planEmployeeCreate(payload, {
      onSuccess: (data) => {
        queryClient.invalidateQueries("PLAN_SEARCH_EMPLOYEE_WITH_TAGGING");
        refetchHrms();
        setIsLoading(false);
        setShowToast({ key: "success", label: t("ASSIGNED_SUCCESSFULLY") });
      },
      onError: (error, variables) => {
        setIsLoading(false);
        setShowToast({ key: "error", label: error?.message ? error.message : t("FAILED_TO_UPDATE_RESOURCE") });
      },
    });
  };

  const handleAssignEmployeeThrottled = useThrottleUnique(handleAssignEmployee,5000)

  const handleUpdateAssignEmployee = (row, updateAssignee) => {
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
        refetchHrms();
        setShowToast({ key: "success", label: t("UNASSIGNED_SUCCESSFULLY") });
        setIsLoading(false);
      },
      onError: (error, variables) => {
        setShowToast({ key: "error", label: error?.message ? error.message : t("FAILED_TO_UPDATE_RESOURCE") });
        setIsLoading(false);
      },
    });

    setUnassignPopup(false);
  };

  const columns = [
    {
      name: t("NAME"),
      selector: (row) => {
        return <div title={row?.name || t("NA")}>{row.name || t("NA")}</div>;
      },
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const nameA = t(rowA.name).toLowerCase();
        const nameB = t(rowB.name).toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      name: t("EMAIL"),
      selector: (row) => <div title={row?.email || t("NA")}>{row?.email || t("NA")}</div>,
      sortable: false,
    },
    {
      name: t("CONTACT_NUMBER"),
      selector: (row) => {
        return row.number || t("NA");
      },
      sortable: true,
      sortFunction: (rowA, rowB) => {
        const numberA = parseInt(rowA.number, 10);
        const numberB = parseInt(rowB.number, 10);
        if (isNaN(numberA)) return 1; // Treat invalid numbers as larger
        if (isNaN(numberB)) return -1;
    
        if (numberA < numberB) return -1;
        if (numberA > numberB) return 1;
        return 0;
      },
    },
    {
      name: t("HIERARCHY"),
      cell: (row) => {
        const isUserAlreadyAssignedActive =
          HrmsData?.planSearchData?.filter((i) => i.employeeId === row.employeeId)?.length > 0 &&
            HrmsData?.planSearchData?.filter((i) => i.employeeId === row.employeeId)?.[0]?.active
            ? true
            : false;
        return (
          <Dropdown
            className="roleTableCell"
            selected={rowData?.find((item) => item?.rowIndex === row?.rowIndex)?.selectedHierarchy || null}
            disabled={isUserAlreadyAssignedActive || nationalRoles?.includes(category) ? true : false}
            isMandatory={true}
            option={state?.boundaryHierarchy.filter((item) => item.parentBoundaryType !== null && item.boundaryType !== state?.lowestHierarchy)}
            select={(value) => {
              row.selectedHeirarchy = value;
              handleHierarchyChange(value, row);
            }}
            optionKey="boundaryType"
            t={t}
          />
        );
      },
      sortable:false
    },

    {
      name: t("SELECTED_BOUNDARY"),
      grow: 2,
      cell: (row) => {
        const isUserAlreadyAssignedActive =
          HrmsData?.planSearchData?.filter((i) => i.employeeId === row.employeeId)?.length > 0 &&
          HrmsData?.planSearchData?.filter((i) => i.employeeId === row.employeeId)?.[0]?.active
            ? true
            : false;
        return (
          <div style={{ width: "100%" }}>
            <MultiSelectWrapper
              disabled={
                isUserAlreadyAssignedActive ||
                nationalRoles?.includes(category) ||
                !rowData?.find((item) => item?.rowIndex === row?.rowIndex)?.selectedHierarchy
                  ? true
                  : false
              }
              props={{ className: "roleTableCell" }}
              t={t}
              options={rowData?.find((item) => item?.rowIndex === row?.rowIndex)?.boundaryOptions || []}
              optionsKey={"code"}
              selected={rowData?.find((item) => item?.rowIndex === row?.rowIndex)?.selectedBoundaries || []}
              onClose={(value) => handleBoundaryChange(value, row)}
              onSelect={()=>{}}
              addCategorySelectAllCheck={true}
              addSelectAllCheck={true}
              style={{ width: "100%" }}
              variant="nestedmultiselect"
            />
          </div>
        );
      },
      sortable:false
    },
    {
      name: t("ACTION"),
      cell: (row) => {
        const isUserAlreadyAssigned = HrmsData?.planSearchData?.filter((i) => i.employeeId === row.employeeId)?.length > 0 ? true : false;
        const isUserAlreadyAssignedActive =
          HrmsData?.planSearchData?.filter((i) => i.employeeId === row.employeeId)?.length > 0 &&
            HrmsData?.planSearchData?.filter((i) => i.employeeId === row.employeeId)?.[0]?.active
            ? true
            : false;

        // const selectedBoundaries = rowData?.find((i) => i.employeeId === row.employeeId)?.selectedBoundaries?.map((i) => i?.code);
        // const incomingBoundaries = HrmsData?.planSearchData.find((i) => i.employeeId === row.employeeId)?.jurisdiction;
        // const selectedHierarchy = HrmsData?.planSearchData.find((i) => i.employeeId === row.employeeId)?.selectedHierarchy?.boundaryType;
        // const incomingHierarchy = rowData?.find((i) => i.employeeId === row.employeeId)?.hierarchyLevel;
        // const isHierarchyEqual = !incomingHierarchy ? true : _.isEqual(incomingHierarchy, selectedHierarchy);
        // const isBoundaryEqual = !incomingBoundaries || incomingBoundaries?.length === 0 ? true : _.isEqual(incomingBoundaries, selectedBoundaries);

        return (
          <Button
            isDisabled={
              !rowData?.find((item) => item?.rowIndex === row?.rowIndex)?.selectedBoundaries ||
              rowData?.find((item) => item?.rowIndex === row?.rowIndex)?.selectedBoundaries?.length === 0
            }
            style={{width:"100%"}}
            title={isUserAlreadyAssignedActive ? t(`UNASSIGN`) : t(`ASSIGN`)}
            size="medium"
            className={"roleTableCell"}
            variation={isUserAlreadyAssignedActive ? "secondary" : "primary"}
            label={isUserAlreadyAssignedActive ? t(`UNASSIGN`) : t(`ASSIGN`)}
            icon={isUserAlreadyAssignedActive ? "Close" : "DoubleArrow"}
            isSuffix={isUserAlreadyAssignedActive ? false : true}
            onClick={(value) => (isUserAlreadyAssignedActive ? setUnassignPopup(row) : handleAssignEmployeeThrottled(row.userServiceUuid,row))}
          />
        );
      },
      sortable:false
    },
  ];

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
    refetchHrms();
  };
  const handleRowsPerPageChange = (newPerPage, page) => {
    setRowsPerPage(newPerPage); // Update the rows per page state
    setCurrentPage(page); // Optionally reset the current page or maintain it
    refetchHrms(); // Fetch the updated data with the new rows per page
  };
  const handleSearchSubmit = (e) => {
    if (number?.length > 0 && number?.length !== 10) {
      setShowToast({ key: "error", label: t("INVALID_MOBILE_NUMBER_LENGTH") });
      return;
    }
    setCurrentPage(1);
    setFilters({
      name: name,
      number: number,
    });
  };
  const handleClearSearch = () => {
    setName("");
    setNumber("");
    setCurrentPage(1);
    setFilters({});
  };
  useEffect(() => {
    if (showToast) {
      setTimeout(closeToast, 5000);
    }
  }, [showToast]);
  const closeToast = () => {
    setShowToast(null);
  };

  return (
    <>
      <Card style={{ border: "1px solid #e6e5e4" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default submission
            e.stopPropagation(); // Stop the event from reaching the parent form
            handleSearchSubmit();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              handleSearchSubmit();
            }
          }}
        >
          <div>
            <div className={`search-field-wrapper roleComposer`}>
              <LabelFieldPair key={1}>
                <CardLabel style={{ margin:"0rem", marginBottom: "0.5rem" }}>{t("Name")}</CardLabel>
                <TextInput
                  value={name}
                  type={"text"}
                  name={"name"}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  //   inputRef={ref}
                  errorStyle={""}
                  min={1}
                  minlength={1}
                />
              </LabelFieldPair>
              <LabelFieldPair key={2}>
                <CardLabel style={{ margin:"0rem", marginBottom: "0.5rem" }}>{t("Number")}</CardLabel>
                <TextInput
                  value={number}
                  type={"text"}
                  name={"number"}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    setNumber(newValue);
                  }}
                  //   inputRef={ref}
                  errorStyle={""}
                  min={10}
                  minlength={10}
                />
              </LabelFieldPair>
              <div className={`search-field-wrapper roleComposer`} style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variation="teritiary" title={t("MP_USER_TAG_CLEAR")} label={t("MP_USER_TAG_CLEAR")} onClick={handleClearSearch} />

                <Button variation="primary" label={t("MP_USER_TAG_SEARCH")} title={t("MP_USER_TAG_SEARCH")} onClick={handleSearchSubmit} style={{ width: "140px" }} />
              </div>
            </div>
          </div>
        </form>
      </Card>

      {/* {isLoading || isHrmsLoading ? <LoaderOverlay /> : null} */}
      <Card style={{ overflow: "auto", boxShadow: "none", padding: "0px" }}>
        <DataTable
          columns={columns}
          data={HrmsData?.data}
          pagination
          progressPending={isLoading || isHrmsLoading}
          progressComponent={<Loader />}
          paginationServer
          paginationTotalRows={totalRows}
          customStyles={tableCustomStyle}
          onChangePage={handlePaginationChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          paginationPerPage={rowsPerPage}
          sortIcon={<CustomSVG.SortUp width={"16px"} height={"16px"} fill={"#0b4b66"} />}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          fixedHeader={true}
          fixedHeaderScrollHeight={"100vh"}
          paginationComponentOptions={{ rowsPerPageText:t("ROWS_PER_PAGE") }}
        />
      </Card>
      {showToast && (
        <Toast
          type={showToast?.key === "error" ? "error" : showToast?.key === "info" ? "info" : showToast?.key === "warning" ? "warning" : "success"}
          label={t(showToast?.label)}
          transitionTime={showToast.transitionTime}
          onClose={closeToast}
          style={{marginBottom:"0.75rem"}}
        />
      )}

      {unassignPopup && (
        <PopUp
          className={"popUpClass"}
          type={"alert"}
          alertHeading={t("USERTAG_CONFIRM_TO_UNASSIGN")}
          alertMessage={t("USERTAG_CONFIRM_TO_UNASSIGN_DESC")}
          equalWidthButtons={true}
          onOverlayClick={() => {
            setUnassignPopup(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("YES")}
              title={t("YES")}
              onClick={() => {
                handleUpdateAssignEmployee(unassignPopup);
              }}
            />,
            <Button type={"button"} size={"large"} variation={"secondary"} label={t("NO")} title={t("NO")} onClick={() => { setUnassignPopup(false); }} />,
          ]}
          sortFooterChildren={true}
          onClose={() => {
            setUnassignPopup(false);
          }}
        ></PopUp>
      )}
     
    </>
  );
}

export default RoleTableComposer;
