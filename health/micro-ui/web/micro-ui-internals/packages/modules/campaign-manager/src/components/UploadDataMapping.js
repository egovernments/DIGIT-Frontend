import { Button, CardLabel, CardText, Chip, Dropdown, LabelFieldPair, Loader, PopUp, Switch } from "@egovernments/digit-ui-components";
import React, { act, createContext, Fragment, useContext, useEffect, useReducer, useState } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { tableCustomStyle } from "./tableCustomStyle";
import { CONSOLE_MDMS_MODULENAME } from "../Module";
import MultiSelectDropdown from "./MultiSelectDropdown";
import NoResultsFound from "./NoResultsFound";
const initialState = {
  data: [],
  currentPage: 1,
  currentData: [],
  totalRows: 0,
  rowsPerPage: 10,
};
const getPageData = (data, currentPage, rowsPerPage) => {
  const startIdx = (currentPage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  return data.slice(startIdx, endIdx);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        data: action.payload?.sheetData,
        currentData: getPageData(action.payload?.sheetData, state.currentPage, state.rowsPerPage), // Slice data for current page
        workbook: action.payload?.workbook,
        totalRows: action.payload?.sheetData?.length,
        arrayBuffer: action.payload?.arrayBuffer,
        schemas: action?.schemas,
      };
    case "SET_PAGE":
      return {
        ...state,
        currentPage: action.payload,
        currentData: getPageData(state.data, action.payload, state.rowsPerPage), // Update data for the new page
      };
    case "SET_ROWS_PER_PAGE":
      return {
        ...state,
        rowsPerPage: action.payload,
        currentPage: 1, // Reset to the first page when rows per page changes
        currentData: getPageData(state.data, 1, action.payload), // Update data for the first page with the new page size
      };
    case "UPDATE_BOUNDARY":
      const temp =
        action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
          ? state?.data?.map((item) => {
              const numberLoc = action.t(action?.schemas?.find((i) => i.description === "Phone Number")?.name);
              const BoundaryLoc = action.t(action?.schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name);
              if (item?.[numberLoc] === action?.payload?.row?.[numberLoc]) {
                return {
                  ...item,
                  [BoundaryLoc]: action?.payload?.selectedBoundary?.map((i) => i?.code)?.join(","),
                };
              }
              return item;
            })
          : state?.data?.map((item) => {
              const BoundaryLoc = action.t(action?.schemas?.find((i) => i.description === "Boundary Code")?.name);
              if (item?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")] === action?.payload?.row?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")]) {
                return {
                  ...item,
                  [BoundaryLoc]: action?.payload?.selectedBoundary?.map((i) => i?.code)?.join(","),
                };
              }
              return item;
            });
      return {
        ...state,
        data: temp,
        currentData: getPageData(
          state?.filter
            ? temp?.filter((i) =>
                action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                  ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                  : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
              )
            : temp,
          state.currentPage,
          state.rowsPerPage
        ),
        updated: true,
      };
    case "UPDATE_STATUS":
      const temp1 =
        action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
          ? state?.data?.map((item) => {
              const numberLoc = action.t(action?.schemas?.find((i) => i.description === "Phone Number")?.name);
              const ActiveLoc = action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name);
              if (item?.[numberLoc] === action?.payload?.row?.[numberLoc]) {
                return {
                  ...item,
                  [ActiveLoc]: action?.payload?.selectedStatus?.code,
                };
              }
              return item;
            })
          : state?.data?.map((item) => {
              const ActiveLoc = action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name);
              if (item?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")] === action?.payload?.row?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")]) {
                return {
                  ...item,
                  [ActiveLoc]: action?.payload?.selectedStatus?.code,
                };
              }
              return item;
            });
      return {
        ...state,
        data: temp1,
        currentData: getPageData(
          state?.filter
            ? temp1?.filter((i) =>
                action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                  ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                  : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
              )
            : temp1,
          state.currentPage,
          state.rowsPerPage
        ),
        updated: true,
      };
    case "FILTER_BY_ACTIVE":
      return {
        ...state,
        currentData: action.payload?.filter
          ? getPageData(
              state.data?.filter((i) =>
                action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                  ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                  : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
              ),
              state.currentPage,
              state.rowsPerPage
            )
          : getPageData(state.data, state.currentPage, state.rowsPerPage), // Update data for the new page
        totalRows: action.payload?.filter
          ? state.data?.filter((i) =>
              action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
            )?.length
          : state.data?.length,
        filter: action?.payload?.filter,
      };
    default:
      return state;
  }
};

function flattenHierarchyIterative(data) {
  const stack = data.map((node) => ({ ...node, parentCode: null })); // Initialize stack with parentCode as null
  const result = [];

  while (stack.length > 0) {
    const { id, code, boundaryType, children, parentCode } = stack.pop();

    // Add the current node to the result with the parent code
    result.push({ id, name: code, code: code, type: boundaryType, parent: parentCode });

    // Push children onto the stack with their parentCode set to the current node's code
    if (children && children.length > 0) {
      stack.push(
        ...children.map((child) => ({
          ...child,
          parentCode: code, // Set the parent code for the child
        }))
      );
    }
  }

  return result;
}

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
      <div className="digit-tag-container">
        {alreadyQueuedSelectedState?.map((item, index) => (
          <Chip key={index} text={t(item)} className="" error="" extraStyles={{}} iconReq="" hideClose={true} />
        ))}
      </div>
    </PopUp>
  );
};

function UploadDataMapping({ formData, onSelect, currentCategories }) {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id, ...queryParams } = Digit.Hooks.useQueryParams();
  const [showPopUp, setShowPopUp] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedBoundary, setSelectedBoundary] = useState(null);
  const [chipPopUpRowId, setChipPopUpRowId] = useState(null);
  const [allLowestHierarchyCodes, setAllLowestHierarchyCodes] = useState(null);
  const [allSelectedBoundary, setAllSelectedBoundary] = useState([]);
  const sessionData = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_FORM_DATA");
  const paramsData = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
  const selectedBoundaryData = sessionData?.["HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA"]?.boundaryType?.selectedData;
  const schemaFilter = currentCategories === "HCM_UPLOAD_FACILITY_MAPPING" ? "facility" : "user";
  const [state, dispatch] = useReducer(reducer, initialState);
  const boundaryHierarchy = paramsData?.hierarchy?.boundaryHierarchy;
  const { data: Schemas, isLoading: isThisLoading, refetch: refetchSchema } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "adminSchema" }],
    {
      cacheTime: 0,
      staleTime: 0,
      select: (data) => {
        const currentSchema = data?.["HCM-ADMIN-CONSOLE"]?.adminSchema?.filter((i) => i?.title === schemaFilter && i?.campaignType === "all");
        const result = Object.values(currentSchema?.[0]?.properties)?.flatMap((arr) => arr?.map((item) => item));
        return result;
      },
    },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.adminSchema` }
  );
  // Checking for sheet is uploaded
  if (
    (currentCategories === "HCM_UPLOAD_USER_MAPPING" &&
      sessionData?.["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]?.uploadFacility?.uploadedFile?.length === 0) ||
    (currentCategories === "HCM_UPLOAD_USER_MAPPING" && sessionData?.["HCM_CAMPAIGN_UPLOAD_USER_DATA"]?.uploadUser?.uploadedFile?.length === 0)
  ) {
    return (
      <Fragment>
        <NoResultsFound text={Digit.Utils.locale.getTransformedLocale(`NO_RESULTS_FOR_MAPPING_${currentCategories}`)} />
      </Fragment>
    );
  }
  useEffect(() => {
    refetchSchema();
  }, [schemaFilter, currentCategories]);
  useEffect(() => {
    if (state?.updated) {
      switch (currentCategories) {
        case "HCM_UPLOAD_USER_MAPPING":
          onSelect("uploadUserMapping", state);
          break;
        default:
          onSelect("uploadFacilityMapping", state);
          break;
      }
    }
  }, [state]);
  const { isLoading: hierarchyLoading, data: lowestHierarchy } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [
      {
        name: "HierarchySchema",
        filter: "[?(@.type=='console')]",
      },
    ],
    {
      enabled: true,
      select: (data) => {
        return data?.["HCM-ADMIN-CONSOLE"]?.HierarchySchema?.[0]?.lowestHierarchy;
      },
    },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.HierarchySchema` }
  );

  const reqCriteriaResource = {
    url: `/boundary-service/boundary-relationships/_search`,
    params: {
      tenantId: tenantId,
      hierarchyType: paramsData?.hierarchy?.hierarchyType,
      includeChildren: true,
      codes: allLowestHierarchyCodes?.join(","),
    },
    config: {
      enabled: allLowestHierarchyCodes?.length > 0 ? true : false,
      select: (data) => {
        return data?.["TenantBoundary"]?.[0]?.boundary;
      },
    },
  };

  const { isLoading: childrenDataLoading, data: childrenData, isFetching, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);

  useEffect(() => {
    if (allLowestHierarchyCodes?.length > 0 && childrenData?.length > 0) {
      const allLowestBoundaryData = flattenHierarchyIterative(childrenData);
      const sessionSelectedData = sessionData?.["HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA"]?.boundaryType?.selectedData;
      setAllSelectedBoundary([...allLowestBoundaryData, ...sessionSelectedData]);
    }
  }, [allLowestHierarchyCodes, childrenData]);
  useEffect(() => {
    if (lowestHierarchy && sessionData?.["HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA"]?.boundaryType?.selectedData?.length > 0) {
      const lowestHierarchyCodes = sessionData?.["HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA"]?.boundaryType?.selectedData
        ?.filter((i) => i.type === lowestHierarchy)
        ?.map((j) => j.code);
      setAllLowestHierarchyCodes(lowestHierarchyCodes);
    }
  }, [lowestHierarchy]);

  const getFileStoreId = () => {
    switch (formData?.name) {
      case "uploadFacilityMapping":
        return sessionData?.["HCM_CAMPAIGN_UPLOAD_FACILITY_DATA"]?.uploadFacility?.uploadedFile?.[0]?.filestoreId;
        break;
      case "uploadUserMapping":
        return sessionData?.["HCM_CAMPAIGN_UPLOAD_USER_DATA"]?.uploadUser?.uploadedFile?.[0]?.filestoreId;
        break;
      default:
        return null;
        break;
    }
  };
  const { data, isLoading } = Digit.Hooks.campaign.useReadExcelData({
    tenantId: tenantId,
    fileStoreId: getFileStoreId(),
    currentCategories: currentCategories,
    sheetNameToFetch: currentCategories === "HCM_UPLOAD_FACILITY_MAPPING" ? t("HCM_ADMIN_CONSOLE_FACILITIES") : t("HCM_ADMIN_CONSOLE_USER_LIST"),
    schemas: Schemas,
    t: t,
    config: {
      enabled: true,
    },
  });

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_DATA", payload: data, schemas: Schemas, t: t });
    }
  }, [data, Schemas]);
  const handlePageChange = (page) => {
    dispatch({ type: "SET_PAGE", payload: page, schemas: Schemas, t: t });
  };
  const handleRowsPerPageChange = (newPerPage) => {
    dispatch({ type: "SET_ROWS_PER_PAGE", payload: newPerPage, schemas: Schemas, t: t });
  };

  const columns =
    currentCategories === "HCM_UPLOAD_USER_MAPPING"
      ? [
          {
            name: t("NAME_OF_PERSON"),
            selector: (row) => {
              return row?.[t(Schemas?.find((i) => i.description === "User Name")?.name)] || t("NA");
            },
            sortable: true,
          },
          {
            name: t("PHONE_NUMBER"),
            selector: (row) => row?.[t(Schemas?.find((i) => i.description === "Phone Number")?.name)] || t("NA"),
            sortable: true,
          },
          {
            name: t("ROLE"),
            selector: (row) => row?.[t(Schemas?.find((i) => i.description === "User Role")?.name)] || t("NA"),
            sortable: true,
          },
          {
            name: t("EMPLOYEMENT_TYPE"),
            selector: (row) => row?.[t(Schemas?.find((i) => i.description === "Employement Type")?.name)] || t("NA"),
            sortable: true,
          },
          {
            name: t("ACTIVE_STATUS"),
            cell: (row) => {
              // row?.["Active / Inactive"] || t("NA")
              const a = [
                {
                  code: "Active",
                },
                {
                  code: "Inactive",
                },
              ];
              return (
                <Dropdown
                  className="roleTableCell"
                  selected={a?.find((item) => item?.code === row?.[t(Schemas?.find((i) => i.description === "User Usage")?.name)]) || null}
                  isMandatory={true}
                  option={a}
                  select={(value) => {
                    dispatch({
                      type: "UPDATE_STATUS",
                      currentCategories: currentCategories,
                      schemas: Schemas,
                      t: t,
                      payload: {
                        row: row,
                        selectedStatus: value,
                      },
                    });
                  }}
                  optionKey="code"
                  t={t}
                />
              );
            },
          },
          {
            name: t("BOUNDARY"),
            cell: (row) => {
              return (
                <>
                  {row?.[t(Schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)] || t("NA")}
                  <Button
                    type={"button"}
                    size={"small"}
                    isDisabled={row?.[t(Schemas?.find((i) => i.description === "User Usage")?.name)] === "Inactive" ? true : false}
                    variation={"teritiary"}
                    label={t("CHANGE_BOUNDARY")}
                    onClick={() => {
                      setShowPopUp(row);
                    }}
                  />
                </>
              );
            },
          },
        ]
      : [
          {
            name: t("FACILITY_NAME"),
            selector: (row) => {
              return row?.[t(Schemas?.find((i) => i.description === "Facility Name")?.name)] || t("NA");
            },
            sortable: true,
          },
          {
            name: t("FACILITY_TYPE"),
            selector: (row) => row?.[t(Schemas?.find((i) => i.description === "Facility type")?.name)] || t("NA"),
            sortable: true,
          },
          {
            name: t("FACILITY_STATUS"),
            selector: (row) => row?.[t(Schemas?.find((i) => i.description === "Facility status")?.name)] || t("NA"),
            sortable: true,
          },
          {
            name: t("FACILITY_USAGE"),
            cell: (row) => {
              // row?.["Facility Usage"] || t("NA"),
              const b = [
                {
                  code: "Active",
                },
                {
                  code: "Inactive",
                },
              ];
              return (
                <Dropdown
                  className="dataMappingDropdown"
                  selected={b?.find((item) => item?.code === row?.[t(Schemas?.find((i) => i.description === "Facility usage")?.name)]) || null}
                  isMandatory={true}
                  option={b}
                  select={(value) => {
                    dispatch({
                      type: "UPDATE_STATUS",
                      t: t,
                      currentCategories: currentCategories,
                      schemas: Schemas,
                      payload: {
                        row: row,
                        selectedStatus: value,
                      },
                    });
                  }}
                  optionKey="code"
                  t={t}
                />
              );
            },
          },
          {
            name: t("BOUNDARY"),
            cell: (row) => {
              const listOfBoundaries = row?.[t(Schemas?.find((i) => i.description === "Boundary Code")?.name)]?.split(",") || [];
              return (
                <div>
                  <div>
                    {listOfBoundaries.slice(0, 2).map((item, index) => (
                      <Chip className="" error="" extraStyles={{}} iconReq="" hideClose={true} text={t(item)} />
                    ))}
                    {listOfBoundaries?.length > 2 && (
                      <Button
                        label={`+${listOfBoundaries?.length - 2} ${t("ES_MORE")}`}
                        onClick={() => setChipPopUpRowId(listOfBoundaries)}
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
                    {chipPopUpRowId && <Wrapper setShowPopUp={setChipPopUpRowId} alreadyQueuedSelectedState={listOfBoundaries} />}
                  </div>
                  <Button
                    type={"button"}
                    size={"small"}
                    isDisabled={row?.[t(Schemas?.find((i) => i.description === "Facility usage")?.name)] === "Inactive" ? true : false}
                    variation={"teritiary"}
                    label={t("CHANGE_BOUNDARY")}
                    onClick={() => {
                      setShowPopUp(row);
                    }}
                  />
                </div>
              );
            },
          },
        ];
  return (
    <Fragment>
      <Switch
        className={"data-mapping-filter-switch"}
        isLabelFirst
        label={t("FILTER_BY_ACTIVE_STATUS")}
        onToggle={(value) => {
          dispatch({
            type: "FILTER_BY_ACTIVE",
            t: t,
            schemas: Schemas,
            currentCategories: currentCategories,
            payload: {
              filter: value,
            },
          });
        }}
        shapeOnOff
      />
      <DataTable
        category={"category"}
        columns={columns}
        data={state?.currentData}
        progressPending={isLoading || state?.currentData?.length === 0}
        progressComponent={<Loader />}
        pagination
        paginationServer
        customStyles={tableCustomStyle}
        // paginationTotalRows={totalRows}
        // onChangePage={handlePaginationChange}
        // onChangeRowsPerPage={handleRowsPerPageChange}
        // paginationPerPage={rowsPerPage}
        paginationTotalRows={state.totalRows}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
      />
      {showPopUp && (
        <PopUp
          className={"dataMapping"}
          type={"default"}
          heading={t("FACILITY_MAPPING_POP_HEADER")}
          equalWidthButtons={true}
          children={[
            <div>
              <CardText>{t("FACILITY_MAPPING_POP_HEADER")}</CardText>
              <LabelFieldPair key={1}>
                <CardLabel style={{ marginBottom: "0.4rem" }}>{t("CHOOSE_BOUNDARY_LEVEL")}</CardLabel>
                <Dropdown
                  className="mappingPopUp"
                  selected={selectedLevel}
                  disabled={false}
                  isMandatory={true}
                  option={boundaryHierarchy}
                  select={(value) => {
                    setSelectedLevel(value);
                    setSelectedBoundary(null);
                  }}
                  optionKey="boundaryType"
                  t={t}
                />
              </LabelFieldPair>
              <LabelFieldPair className={"multiselect-label-field"} key={1}>
                <CardLabel style={{ marginBottom: "0.4rem" }}>{t("CHOOSE_BOUNDARY_LEVEL")}</CardLabel>
                <MultiSelectDropdown
                  variant="nestedmultiselect"
                  props={{ className: "data-mapping-dropdown" }}
                  t={t}
                  options={
                    Object.values(
                      (allSelectedBoundary?.filter((i) => i.type === selectedLevel?.boundaryType) || []).reduce((acc, item) => {
                        const { parent, code, type } = item;

                        // Initialize the parent group if it doesn't exist
                        if (!acc[parent]) {
                          acc[parent] = {
                            code: parent,
                            options: [],
                          };
                        }

                        // Add each item as a child of the corresponding parent
                        acc[parent].options.push({
                          code,
                          type,
                          parent,
                        });

                        return acc;
                      }, {})
                    ) || []
                  }
                  optionsKey={"code"}
                  selected={selectedBoundary ? selectedBoundary : []}
                  onClose={(value) => {
                    const boundariesInEvent = value?.map((event) => event?.[1]);
                    setSelectedBoundary(boundariesInEvent);
                  }}
                  onSelect={(value) => {
                    // setSelectedBoundary(value);
                  }}
                  addCategorySelectAllCheck={true}
                  addSelectAllCheck={true}
                />
                {/* <Dropdown
                  className="mappingPopUp"
                  selected={selectedBoundary}
                  disabled={false}
                  isMandatory={true}
                  option={
                    sessionData?.["HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA"]?.boundaryType?.selectedData?.filter(
                      (i) => i.type === selectedLevel?.boundaryType
                    ) || []
                  }
                  select={(value) => {
                    setSelectedBoundary(value);
                  }}
                  optionKey="code"
                  t={t}
                /> */}
              </LabelFieldPair>
            </div>,
          ]}
          onOverlayClick={() => {
            setShowPopUp(false);
            setSelectedLevel(null);
            setSelectedBoundary(null);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("YES")}
              onClick={() => {
                dispatch({
                  type: "UPDATE_BOUNDARY",
                  t: t,
                  schemas: Schemas,
                  currentCategories: currentCategories,
                  payload: {
                    row: showPopUp,
                    selectedBoundary: selectedBoundary,
                    selectedLevel: selectedLevel,
                  },
                });
                setShowPopUp(false);
                setSelectedLevel(null);
                setSelectedBoundary(null);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("NO")}
              onClick={() => {
                setShowPopUp(false);
                setSelectedLevel(null);
                setSelectedBoundary(null);
              }}
            />,
          ]}
          sortFooterChildren={true}
          onClose={() => {
            setShowPopUp(false);
            setSelectedLevel(null);
            setSelectedBoundary(null);
          }}
        ></PopUp>
      )}
    </Fragment>
  );
}

export default UploadDataMapping;
