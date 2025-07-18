import { Button, CardLabel, CardText, Chip, Dropdown, LabelFieldPair, Loader, PopUp, Switch, Toast, CardHeader } from "@egovernments/digit-ui-components";
import React, { Fragment, useEffect, useReducer, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { tableCustomStyle } from "./tableCustomStyle";
import { CONSOLE_MDMS_MODULENAME } from "../Module";
import MultiSelectDropdown from "./MultiSelectDropdown";
import NoResultsFound from "./NoResultsFound";
import AddOrEditMapping from "./AddOrEditMapping";
import { CustomSVG } from "@egovernments/digit-ui-components";
import Ajv from "ajv";


const initialState = {
    data: [],
    currentPage: 1,
    currentData: [],
    filteredData: [],
    totalRows: 0,
    rowsPerPage: 10,
};

const getPageData = (data, currentPage, rowsPerPage) => {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    // Ensure currentPage is within valid range
    if (currentPage > totalPages) {
        currentPage = totalPages; // Shift down to the last available page
    }
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
        case "ADD_DATA":
            const updatedData = [...state.data, action.payload];
            return {
                ...state,
                data: updatedData,
                filteredData: state?.filter
                    ? updatedData?.filter((i) =>
                        action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                            ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                            : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
                    )
                    : updatedData,
                currentData: getPageData(
                    state?.filter
                        ? updatedData?.filter((i) =>
                            action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                                ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                                : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
                        )
                        : updatedData,
                    state.currentPage,
                    state.rowsPerPage
                ), // Using updated data array
                schemas: action?.schemas,
                workbook: state.workbook, // Keep existing workbook
                // arrayBuffer: state.arrayBuffer, // Keep existing arrayBuffer
                totalRows: state?.filter
                    ? updatedData?.filter((i) =>
                        action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                            ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                            : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
                    )?.length
                    : updatedData.length, // Use the new array length directly
                updated: true,
            };
        case "EDIT_DATA":
            const editedData = state.data.map((item) => (item.id === action.payload.id ? { ...item, ...action.payload } : item));
            return {
                ...state,
                data: editedData,
                filteredData: state?.filter
                    ? editedData?.filter((i) =>
                        action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                            ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                            : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
                    )
                    : editedData,
                currentData: getPageData(
                    state?.filter
                        ? editedData?.filter((i) =>
                            action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                                ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                                : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
                        )
                        : editedData,
                    state.currentPage,
                    state.rowsPerPage
                ),
                schemas: action?.schemas,
                workbook: state.workbook,
                totalRows: state?.filter
                    ? editedData?.filter((i) =>
                        action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                            ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                            : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
                    )?.length
                    : editedData.length,
                updated: true,
            };
        case "DELETE_DATA":
            const filteredData = state.data.filter((item) => item.id !== action.payload.id);
            return {
                ...state,
                data: filteredData,
                currentData: getPageData(filteredData, state.currentPage, state.rowsPerPage),
                schemas: state.schemas, // Retaining existing schemas
                workbook: state.workbook, // Retaining existing workbook
                totalRows: filteredData.length,
                updated: true,
            };
        case "SET_PAGE":
            return {
                ...state,
                currentPage: action.payload,
                currentData: getPageData(state?.filter ? state.filteredData : state.data, action.payload, state.rowsPerPage), // Update data for the new page
            };
        case "SET_ROWS_PER_PAGE":
            return {
                ...state,
                rowsPerPage: action.payload,
                currentPage: 1, // Reset to the first page when rows per page changes
                currentData: getPageData(state?.filter ? state.filteredData : state.data, 1, action.payload), // Update data for the first page with the new page size
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
                        const facilityCode = item?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")];
                        const facilityName = item?.[action.t(action?.schemas?.find((i) => i.description === "Facility Name")?.name)];
                        // if (item?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")] === action?.payload?.row?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")]) {
                        //   return {
                        //     ...item,
                        //     [BoundaryLoc]: action?.payload?.selectedBoundary?.map((i) => i?.code)?.join(","),
                        //   };
                        // }
                        // Check facility code first, if not present then check facility name
                        if (
                            (facilityCode && facilityCode === action?.payload?.row?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")]) ||
                            (!facilityCode &&
                                facilityName === action?.payload?.row?.[action.t(action?.schemas?.find((i) => i.description === "Facility Name")?.name)])
                        ) {
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
                        const ActiveLoc = (action?.schemas?.find((i) => i.description === "Facility usage")?.name);
                        const facilityCode = item?.[("HCM_ADMIN_CONSOLE_FACILITY_CODE")];
                        const facilityName = item?.[(action?.schemas?.find((i) => i.description === "Facility Name")?.name)];
                        // if (item?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")] === action?.payload?.row?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")]) {
                        //   return {
                        //     ...item,
                        //     [ActiveLoc]: action?.payload?.selectedStatus?.code,
                        //   };
                        // }
                        // return item;
                        if (
                            (facilityCode && facilityCode === action?.payload?.row?.[("HCM_ADMIN_CONSOLE_FACILITY_CODE")]) ||
                            (!facilityCode &&
                                facilityName === action?.payload?.row?.[(action?.schemas?.find((i) => i.description === "Facility Name")?.name)])
                        ) {
                            return {
                                ...item,
                                [ActiveLoc]: action?.payload?.selectedStatus?.code,
                            };
                        }
                        return item;
                    });
            console.log("temp", temp1);
            return {
                ...state,
                data: temp1,
                currentData: getPageData(
                    state?.filter
                        ? temp1?.filter((i) =>
                            action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                                ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                                : i?.[(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
                        )
                        : temp1,
                    state.currentPage,
                    state.rowsPerPage
                ),
                updated: true,
            };
        case "FILTER_BY_ACTIVE":
            const tempFilter = action.payload?.filter
                ? state.data?.filter((i) =>
                    action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                        ? i?.[action.t(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                        : i?.[action.t(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
                )
                : state.data;
            const tempActive = getPageData(tempFilter, 1, state.rowsPerPage);
            return {
                ...state,
                currentPage: 1,
                currentData: tempActive, // Update data for the new page
                filteredData: tempFilter,
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
    const stack = (data || [])?.map((node) => ({ ...node, parentCode: null })); // Initialize stack with parentCode as null
    const result = [];

    while (stack?.length > 0) {
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


const MyUploadDataMapping = ({ formData, onSelect, currentCategories }) => {

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [state, dispatch] = useReducer(reducer, initialState);
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();



    const { data: Schemas, isLoading: isThisLoading, refetch: refetchSchema } = Digit.Hooks.useCustomMDMS(
        tenantId,
        CONSOLE_MDMS_MODULENAME,
        [{ name: "adminSchema" }],
        {
            cacheTime: 0,
            staleTime: 0,
            select: (data) => {
                console.log(data)
                const currentSchema = data?.["HCM-ADMIN-CONSOLE"]?.adminSchema?.filter((i) => i?.title === schemaFilter && i?.campaignType === "all");
                const result = Object.values(currentSchema?.[0]?.properties)?.flatMap((arr) => arr?.map((item) => item));
                return result;
            },
        },
        { schemaCode: `${CONSOLE_MDMS_MODULENAME}.adminSchema` }
    );


    const { data: SchemasAJV, isLoading: isThisLoadingAJV } = Digit.Hooks.useCustomMDMS(
        tenantId,
        CONSOLE_MDMS_MODULENAME,
        [{ name: "adminSchema" }],
        {},
        { schemaCode: `${CONSOLE_MDMS_MODULENAME}.adminSchema` }
    );


    const { data, isLoading } = Digit.Hooks.campaign.useReadExcelData({
        tenantId: tenantId,
        fileStoreId: "22ade7ef-fa5d-4efb-8494-ec2b82b15fec",
        currentCategories: "HCM_UPLOAD_FACILITY_MAPPING",
        sheetNameToFetch: t("HCM_ADMIN_CONSOLE_FACILITIES"),
        schemas: Schemas,
        t: t,
        config: {
            enabled: true,
        },
    });

    console.log("data",data);
    


    const handlePageChange = (page) => {
        dispatch({ type: "SET_PAGE", payload: page, schemas: Schemas, t: t });
    };
    const handleRowsPerPageChange = (newPerPage) => {
        setRowsPerPage(newPerPage); // Update the rows per page state
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
                    cell: (row) => (
                        <div
                            title={row?.[t(Schemas?.find((i) => i.description === "User Role")?.name)] || t("NA")}
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "150px",
                            }}
                        >
                            {row?.[t(Schemas?.find((i) => i.description === "User Role")?.name)] || t("NA")}
                        </div>
                    )
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
                        const listOfBoundaries = row?.[t(Schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)]?.split(",") || [];
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
                                </div>
                                <Button
                                    type={"button"}
                                    size={"small"}
                                    isDisabled={row?.[t(Schemas?.find((i) => i.description === "User Usage")?.name)] === "Inactive" ? true : false}
                                    variation="link"
                                    label={Array.isArray(listOfBoundaries) && listOfBoundaries?.length > 0 ? t("CHANGE_BOUNDARY") : t("ADD _BOUNDARY")}
                                    onClick={() => {
                                        setShowPopUp(row);
                                    }}
                                />
                            </div>
                        );
                    },
                },
                {
                    name: t("MAPPING_EDIT"),
                    cell: (row) => {
                        return (
                            <Button
                                type={"button"}
                                size={"small"}
                                isDisabled={row?.editable ? false : true}
                                variation={"primary"}
                                icon={"Edit"}
                                // label={listOfBoundaries?.length > 0 ? t("CHANGE_BOUNDARY") : t("ADD _BOUNDARY")}
                                label={t("MAPPING_EDIT")}
                                onClick={() => {
                                    setShowEditPopUp(row);
                                }}
                            />
                        );
                    },
                },
                {
                    name: t("MAPPING_DELETE"),
                    cell: (row) => {
                        return (
                            <Button
                                type={"button"}
                                size={"small"}
                                isDisabled={row?.editable ? false : true}
                                variation={"primary"}
                                icon={"Delete"}
                                label={t("MAPPING_DELETE")}
                                onClick={() => {
                                    dispatch({
                                        type: "DELETE_DATA",
                                        payload: row,
                                        schemas: Schemas,
                                        t: t,
                                    });
                                }}
                            />
                        );
                    },
                },
            ]
            :


            [
                {
                    name: t("FACILITY_NAME"),
                    selector: (row) => {
                        console.log("row", row, Schemas);
                        return row?.[(Schemas?.find((i) => i.description === "Facility Name")?.name)] || t("NA");
                    },
                    sortable: true,
                },
                {
                    name: t("FACILITY_TYPE"),
                    selector: (row) => row?.[(Schemas?.find((i) => i.description === "Facility type")?.name)] || t("NA"),
                    sortable: true,
                },
                {
                    name: t("FACILITY_STATUS"),
                    selector: (row) => row?.[(Schemas?.find((i) => i.description === "Facility status")?.name)] || t("NA"),
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
                                className="roleTableCell"
                                selected={b?.find((item) => item?.code === row?.[(Schemas?.find((i) => i.description === "Facility usage")?.name)]) || null}
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
                        const listOfBoundaries = row?.[(Schemas?.find((i) => i.description === "Boundary Code")?.name)]?.split(",") || [];
                        return (
                            <div>
                                <div>
                                    {listOfBoundaries.slice(0, 2).map((item, index) => (
                                        <Chip className="" error="" extraStyles={{}} iconReq="" hideClose={true} text={t(item)} />
                                    ))}
                                    {listOfBoundaries?.length > 2 && (
                                        <Button
                                            label={`+${listOfBoundaries?.length - 2} ${t("ES_MORE")}`}
                                            onClick={() =>
                                                () => { }
                                                // setChipPopUpRowId(listOfBoundaries)
                                            }
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
                                </div>
                                <Button
                                    type={"button"}
                                    size={"small"}
                                    isDisabled={row?.[t(Schemas?.find((i) => i.description === "Facility usage")?.name)] === "Inactive" ? true : false}
                                    variation={"link"}
                                    label={Array.isArray(listOfBoundaries) && listOfBoundaries?.length > 0 ? t("CHANGE_BOUNDARY") : t("ADD _BOUNDARY")}
                                    onClick={() => {
                                        //setShowPopUp(row);
                                    }}
                                />
                            </div>
                        );
                    },
                },
                {
                    name: t("MAPPING_EDIT"),
                    cell: (row) => {
                        return (
                            <Button
                                type={"button"}
                                size={"small"}
                                isDisabled={row?.editable ? false : true}
                                variation={"primary"}
                                label={t("MAPPING_EDIT")}
                                icon={"Edit"}
                                onClick={() => {
                                    //setShowEditPopUp(row);
                                }}
                            />
                        );
                    },
                },
                {
                    name: t("MAPPING_DELETE"),
                    cell: (row) => {
                        return (
                            <Button
                                type={"button"}
                                size={"small"}
                                isDisabled={row?.editable ? false : true}
                                variation={"primary"}
                                label={t("MAPPING_DELETE")}
                                icon={"Delete"}
                                onClick={() => {
                                    dispatch({
                                        type: "DELETE_DATA",
                                        payload: row,
                                        schemas: Schemas,
                                        t: t,
                                    });
                                }}
                            />
                        );
                    },
                },
            ];


    return (
        <Fragment>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <CardHeader className="select-boundary">{t(`UPLOAD_DATA_MAPPING`)}</CardHeader>

                {state?.currentData?.length === 0 ? (
                    <Fragment>
                        <NoResultsFound
                            text={Digit.Utils.locale.getTransformedLocale(
                                state?.filter ? `NO_RESULTS_FOR_ACTIVE_FILTER_${currentCategories}` : `NO_RESULTS_FOR_MAPPING_${currentCategories}`
                            )}
                        />
                    </Fragment>
                ) : (
                    <DataTable
                        category={"category"}
                        columns={columns}
                        data={state?.currentData}
                        progressPending={isLoading || state?.currentData?.length === 0}
                        progressComponent={<Loader page={true} variant={"PageLoader"} />}
                        pagination
                        paginationServer
                        customStyles={tableCustomStyle}
                        paginationDefaultPage={state?.currentPage}
                        paginationResetDefaultPage={state?.currentPage}
                        paginationTotalRows={state.totalRows}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsPerPageChange}
                        style={{ width: "100%" }}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                        paginationComponent={() => {
                            const totalPages = Math.ceil(state.totalRows / state.rowsPerPage);
                            const startRow = (state.currentPage - 1) * state.rowsPerPage + 1;
                            const endRow = Math.min(state.currentPage * state.rowsPerPage, state.totalRows);

                            return (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem" }}>
                                    <Button
                                        className="custom-class"
                                        variation={"secondary"}
                                        label={t("MAPPING_ADD_DATA")}
                                        onClick={() => {
                                            // setShowAddPopup(true);
                                        }}
                                        showBottom
                                        style={{
                                            whiteSpace: "nowrap",
                                            width: "auto",
                                        }}
                                        title=""
                                    />

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                                        <div>
                                            <label style={{ marginRight: "5px" }}>Rows per page:</label>
                                            <select value={state.rowsPerPage} onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}>
                                                {[5, 10, 15, 20].map((size) => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <span>
                                                {startRow}-{endRow} of {state.totalRows}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            {/* First Page Button */}
                                            <button
                                                onClick={() => handlePageChange(1)}
                                                disabled={state.currentPage === 1}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: state.currentPage === 1 ? "not-allowed" : "pointer",
                                                    opacity: state.currentPage === 1 ? 0.5 : 1,
                                                }}
                                            >
                                                <CustomSVG.ArrowToFirst />
                                            </button>

                                            {/* Previous Page Button */}
                                            <button
                                                onClick={() => handlePageChange(state.currentPage - 1)}
                                                disabled={state.currentPage === 1}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: state.currentPage === 1 ? "not-allowed" : "pointer",
                                                    opacity: state.currentPage === 1 ? 0.5 : 1,
                                                }}
                                            >
                                                <CustomSVG.ArrowBack />
                                            </button>

                                            {/* Next Page Button */}
                                            <button
                                                onClick={() => handlePageChange(state.currentPage + 1)}
                                                disabled={state.currentPage >= totalPages}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: state.currentPage >= totalPages ? "not-allowed" : "pointer",
                                                    opacity: state.currentPage >= totalPages ? 0.5 : 1,
                                                }}
                                            >
                                                <CustomSVG.ArrowForward />
                                            </button>

                                            {/* Last Page Button */}
                                            <button
                                                onClick={() => handlePageChange(totalPages)}
                                                disabled={state.currentPage >= totalPages}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: state.currentPage >= totalPages ? "not-allowed" : "pointer",
                                                    opacity: state.currentPage >= totalPages ? 0.5 : 1,
                                                }}
                                            >
                                                <CustomSVG.ArrowToLast />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                )}

            </div>







        </Fragment>
    );
}

export default MyUploadDataMapping;