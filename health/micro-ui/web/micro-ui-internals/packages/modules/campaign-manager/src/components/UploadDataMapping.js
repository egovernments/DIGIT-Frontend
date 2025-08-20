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
              ? i?.[(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
              : i?.[(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
          )
          : updatedData,
        currentData: getPageData(
          state?.filter
            ? updatedData?.filter((i) =>
              action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                ? i?.[(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                : i?.[(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
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
              ? i?.[(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
              : i?.[(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
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
            const numberLoc = (action?.schemas?.find((i) => i.description === "Phone Number")?.name);
            const BoundaryLoc = (action?.schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name);
            if (item?.[numberLoc] === action?.payload?.row?.[numberLoc]) {
              return {
                ...item,
                [BoundaryLoc]: action?.payload?.selectedBoundary?.map((i) => i?.code)?.join(","),
              };
            }
            return item;
          })
          : state?.data?.map((item) => {
            const BoundaryLoc = (action?.schemas?.find((i) => i.description === "Boundary Code")?.name);
            const facilityCode = item?.[("HCM_ADMIN_CONSOLE_FACILITY_CODE")];
            const facilityName = item?.[(action?.schemas?.find((i) => i.description === "Facility Name")?.name)];
            // if (item?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")] === action?.payload?.row?.[action.t("HCM_ADMIN_CONSOLE_FACILITY_CODE")]) {
            //   return {
            //     ...item,
            //     [BoundaryLoc]: action?.payload?.selectedBoundary?.map((i) => i?.code)?.join(","),
            //   };
            // }
            // Check facility code first, if not present then check facility name
            if (
              (facilityCode && facilityCode === action?.payload?.row?.[("HCM_ADMIN_CONSOLE_FACILITY_CODE")]) ||
              (!facilityCode &&
                facilityName === action?.payload?.row?.[(action?.schemas?.find((i) => i.description === "Facility Name")?.name)])
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
                ? i?.[(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
                : i?.[(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
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
            const numberLoc = (action?.schemas?.find((i) => i.description === "Phone Number")?.name);
            const ActiveLoc = (action?.schemas?.find((i) => i.description === "User Usage")?.name);
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
      return {
        ...state,
        data: temp1,
        currentData: getPageData(
          state?.filter
            ? temp1?.filter((i) =>
              action?.currentCategories === "HCM_UPLOAD_USER_MAPPING"
                ? i?.[(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
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
            ? i?.[(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
            : i?.[(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
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
              ? i?.[(action?.schemas?.find((i) => i.description === "User Usage")?.name)] === "Active"
              : i?.[(action?.schemas?.find((i) => i.description === "Facility usage")?.name)] === "Active"
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

const Wrapper = ({ currentCategories, setShowPopUp, alreadyQueuedSelectedState }) => {
  const { t } = useTranslation();
  return (
    <PopUp
      className={""}
      style={{
        maxWidth: "40%",
      }}
      type={"default"}
      heading={t(Digit.Utils.locale.getTransformedLocale(`POP_ADMINISTRATIVE_AREA_${currentCategories}`))}
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
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopUp] = useState(false);
  const [selectedBoundary, setSelectedBoundary] = useState(null);
  const [chipPopUpRowId, setChipPopUpRowId] = useState(null);
  const [allLowestHierarchyCodes, setAllLowestHierarchyCodes] = useState(null);
  const [allSelectedBoundary, setAllSelectedBoundary] = useState([]);
  const sessionData = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_UPLOAD_DATA");
  const paramsData = Digit.SessionStorage.get("HCM_CAMPAIGN_MANAGER_UPLOAD_ID");
  const selectedBoundaryData = sessionData?.["HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA"]?.boundaryType?.selectedData;
  const schemaFilter = currentCategories === "HCM_UPLOAD_FACILITY_MAPPING" ? "facility" : "user";
  const [state, dispatch] = useReducer(reducer, initialState);
  const boundaryHierarchy = paramsData?.hierarchy?.boundaryHierarchy;
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [translatedSchema, setTranslatedSchema] = useState({});
  const [convertedSchema, setConvertedSchema] = useState({});
  const totalData = Digit.SessionStorage.get("HCM_ADMIN_CONSOLE_UPLOAD_DATA");
  const [showToast, setShowToast] = useState(false);
  const type = formData?.validationType;

  const { data: Schemas, isLoading: isThisLoading, refetch: refetchSchema } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "schemas" }],
    {
      cacheTime: 0,
      staleTime: 0,
      select: (data) => {

        const currentSchema = data?.["HCM-ADMIN-CONSOLE"]?.schemas?.filter((i) => i?.title === schemaFilter);
        const result = Object.values(currentSchema?.[0]?.properties)?.flatMap((arr) => arr?.map((item) => item));
        return result;
      },
    },
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.schemas` }
  );

  const { data: SchemasAJV, isLoading: isThisLoadingAJV } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "schemas" }],
    {},
    { schemaCode: `${CONSOLE_MDMS_MODULENAME}.schemas` }
  );

  // Checking for sheet is uploaded
  if (
    (currentCategories === "HCM_UPLOAD_FACILITY_MAPPING" &&
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
    if (allLowestHierarchyCodes?.length > 0) {
      const allLowestBoundaryData = flattenHierarchyIterative(childrenData);
      const sessionSelectedData = sessionData?.["HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA"]?.boundaryType?.selectedData;
      const uniqueLowestBoundaryData = allLowestBoundaryData?.filter((data) => !sessionSelectedData?.some((selected) => selected.code === data.code));
      setAllSelectedBoundary([...sessionSelectedData, ...uniqueLowestBoundaryData]);
    }
  }, [allLowestHierarchyCodes, childrenData]);
  useEffect(() => {
    const lowestBoundary = boundaryHierarchy?.reduce((prev, current) => {
      return prev.parentBoundaryType && !current.parentBoundaryType ? current : prev;
    });

    if (
      lowestHierarchy &&
      lowestHierarchy !== lowestBoundary.boundaryType &&
      sessionData?.["HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA"]?.boundaryType?.selectedData?.length > 0
    ) {
      const lowestHierarchyCodes = sessionData?.["HCM_CAMPAIGN_SELECTING_BOUNDARY_DATA"]?.boundaryType?.selectedData
        ?.filter((i) => i.type === lowestHierarchy)
        ?.map((j) => j.code);
      setAllLowestHierarchyCodes(lowestHierarchyCodes);
    }
  }, [lowestHierarchy]);

  const getFileStoreId = () => {


    //switch (formData?.name) {
    switch (formData?.config?.[0]?.body?.[0]?.key) {

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

  function enrichSchema(data, properties, required, columns) {
    // Sort columns based on orderNumber, using name as tie-breaker if orderNumbers are equal
    columns.sort((a, b) => {
      if (a?.orderNumber === b?.orderNumber) {
        return a.name.localeCompare(b.name);
      }
      return a.orderNumber - b.orderNumber;
    });

    // Extract sorted property names
    const sortedPropertyNames = columns.map((column) => column.name);

    // Update data with new properties and required fields
    data.properties = properties;
    data.required = required;
  }

  function convertIntoSchema(data) {
    var convertData = { ...data };
    var properties = {};
    var required = [];
    var columns = [];
    for (const propType of ["enumProperties", "numberProperties", "stringProperties"]) {
      if (
        convertData?.properties?.[propType] &&
        Array.isArray(convertData?.properties?.[propType]) &&
        convertData?.properties?.[propType]?.length > 0
      ) {
        for (const property of convertData?.properties[propType]) {
          properties[property?.name] = {
            ...property,
            type: propType === "stringProperties" ? "string" : propType === "numberProperties" ? "number" : undefined,
          };

          if (property?.isRequired && required.indexOf(property?.name) === -1) {
            required.push(property?.name);
          }

          // If orderNumber is missing, default to a very high number
          columns.push({ name: property?.name, orderNumber: property?.orderNumber || 9999999999 });
        }
      }
    }
    enrichSchema(convertData, properties, required, columns);
    const newData = JSON.parse(JSON.stringify(convertData));
    delete newData.campaignType;
    return newData;
  }

  var translateSchema = (schema) => {
    var newSchema = { ...schema };
    var newProp = {};

    // Translate properties keys and their 'name' fields
    Object.keys(schema?.properties).forEach((key) => {
      const translatedKey = (key);
      const translatedProperty = { ...schema.properties[key], name: (schema.properties[key].name) };
      newProp[translatedKey] = translatedProperty;
    });
    const newRequired = schema?.required.map((e) => (e));

    newSchema.properties = newProp;
    newSchema.required = newRequired;
    delete newSchema.unique;
    return { ...newSchema };
  };

  useEffect(async () => {
    if (convertedSchema && Object.keys(convertedSchema).length > 0) {
      const newFacilitySchema = await translateSchema(convertedSchema?.facilityWithBoundary);
      const newBoundarySchema = await translateSchema(convertedSchema?.boundary);
      const newUserSchema = await translateSchema(convertedSchema?.userWithBoundary);

      const filterByUpdateFlag = (schemaProperties) => {
        return Object.keys(schemaProperties).filter((key) => {
          return schemaProperties[key].isUpdate !== true;
        });
      };

      const headers = {
        boundary: filterByUpdateFlag(newBoundarySchema?.properties),
        facilityWithBoundary: filterByUpdateFlag(newFacilitySchema?.properties),
        userWithBoundary: filterByUpdateFlag(newUserSchema?.properties),
      };

      const schema = {
        boundary: newBoundarySchema,
        facilityWithBoundary: newFacilitySchema,
        userWithBoundary: newUserSchema,
      };


      setTranslatedSchema(schema);
    }
  }, [convertedSchema]);

  useEffect(async () => {
    if (SchemasAJV?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.schemas && (totalData?.HCM_CAMPAIGN_TYPE?.projectType?.code)) {
      const facility = await convertIntoSchema(
        SchemasAJV?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.schemas?.filter((item) => item.title === "facility")?.[0]
      );
      const boundary = await convertIntoSchema(
        SchemasAJV?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.schemas?.filter(
          (item) => item.title === "boundaryWithTarget" && item.campaignType === (totalData?.HCM_CAMPAIGN_TYPE?.projectType?.code)
        )?.[0]
      );
      const user = await convertIntoSchema(
        SchemasAJV?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.schemas?.filter((item) => item.title === "user")?.[0]
      );
      const schema = {
        boundary: boundary,
        facilityWithBoundary: facility,
        userWithBoundary: user,
      };

      setConvertedSchema(schema);
    }
  }, [SchemasAJV, type]);

  const validateData = (data) => {

    const roleKey = "HCM_ADMIN_CONSOLE_USER_ROLE"
    const roles = data[roleKey];
    // Role max limit validation (if it's an array)
    if (typeof roles === "string" && roles.split(",").length > 5) {
      setShowToast({ label: t("HCM_MORE_USER"), isError: "error" });
      return;
    }
    // Phone Number conversion
    const phoneNumberKey = (Schemas?.find((i) => i.description === "Phone Number")?.name);
    const isValidPhone = /^0\d{10}$/.test(data[phoneNumberKey]);
    if (data[phoneNumberKey] !== undefined && isValidPhone) {
      data[phoneNumberKey] = data[phoneNumberKey];
    }

    // Capacity conversion
    const capacityKey = (Schemas?.find((i) => i.description === "Capacity")?.name);
    if (data[capacityKey] !== undefined) {

      data[capacityKey] = Number(data[capacityKey]);
    }


    const ajv = new Ajv({ strict: false }); // Initialize Ajv
    let validate = ajv.compile(translatedSchema[type]);

    const errors = []; // Array to hold validation errors

    const boundaryCodeFac = (Schemas?.find((i) => i.description === "Boundary Code")?.name);
    if (data[boundaryCodeFac]?.trim()?.length === 0) {
      setShowToast({ label: t("HCM_MAPPING_NO_BOUNDARY_ERROR"), isError: "error" });
      return;
    }

    const boundaryCode = (Schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name);
    if (data[boundaryCode]?.trim()?.length === 0) {
      setShowToast({ label: t("HCM_MAPPING_NO_BOUNDARY_ERROR"), isError: "error" });
      return;
    }

    data = [data];
    data.forEach((item, index) => {
      if (!validate(item)) {
        errors.push({ index: (item?.["!row#number!"] || item?.["__rowNum__"]) + 1, errors: validate.errors });
      }
    });

    if (errors.length > 0) {
      const errorMessage = errors
        .map(({ index, errors }) => {
          const formattedErrors = errors
            .map((error) => {

              let instancePath = error.instancePath || ""; // Assign an empty string if dataPath is not available
              if (error.instancePath === "/Phone Number (Mandatory)") {
                return `${t("HCM_DATA_AT_ROW")} ${t("HCM_IN_COLUMN")}  ${t("HCM_DATA_SHOULD_BE_10_DIGIT")}`;
              }
              if (instancePath.startsWith("/")) {

                instancePath = instancePath.slice(1);
              }
              if (error.keyword === "required") {
                const missingProperty = error.params?.missingProperty || "";
                return `${t("HCM_DATA_AT_ROW")} ${t("HCM_IN_COLUMN")} ${t(missingProperty)} ${t("HCM_DATA_SHOULD_NOT_BE_EMPTY")}`;
              }
              if (error.keyword === "type" && error.message === "must be string") {

                return `${t("HCM_DATA_AT_ROW")} ${t("HCM_IN_COLUMN")} ${t(instancePath)} ${t("HCM_IS_INVALID")}`;
              }
              let formattedError = `${t("HCM_IN_COLUMN")} ${t(instancePath)} ${t(error.message)}`;

              if (error.keyword === "enum" && error.params && error.params.allowedValues) {
                formattedError += `${t("HCM_DATA_ALLOWED_VALUES_ARE")} ${error.params.allowedValues.join("/ ")}`;
              }
              return `${t("HCM_DATA_AT_ROW")} ${t(formattedError)}`;
            })
            .join(", ");
          return formattedErrors;
        })
        .join(", ");

      return {
        isValid: false,
        message: errorMessage,
      };
    } else {
      // return true;
      return {
        isValid: true,
        message: t("NA"),
      };
    }
  };

  const childRef = useRef(null);

  const handleButtonAddClick = async (typeOfOperation) => {
    if (childRef.current) {
      try {
        const childData = childRef.current.getData();
        // Convert data types first

        const validationResult = validateData(childData);

        const userName = childData?.HCM_ADMIN_CONSOLE_USER_NAME;
        const facilityName = childData?.HCM_ADMIN_CONSOLE_FACILITY_NAME;


        // Validation logic for username 
        if (userName !== undefined) {

          if (typeof userName === "string") {
            const hasAlphabet = /[a-zA-Z]/.test(userName);
            if (!hasAlphabet) {
              setShowToast({ label: t("HCM_CAMPAIGN_CONSOLE_USER_NAME_TYPE_ERROR"), isError: "error" });
              return false;
            }
          }
          else {
            setShowToast({ label: t("HCM_CAMPAIGN_CONSOLE_USER_NAME_TYPE_ERROR"), isError: "error" });
            return false;
          }

        }
        // for validation facility name
        if (facilityName !== undefined) {

          if (typeof facilityName === "string") {
            const hasAlphabet = /[a-zA-Z]/.test(facilityName);
            if (!hasAlphabet) {
              setShowToast({ label: t("HCM_CAMPAIGN_CONSOLE_FACILITY_NAME_TYPE_ERROR"), isError: "error" });
              return false;
            }
          }
          else {
            setShowToast({ label: t("HCM_CAMPAIGN_CONSOLE_FACILITY_NAME_TYPE_ERROR"), isError: "error" });
            return false;
          }

        }

        if (validationResult.isValid) {
          if (typeOfOperation === "add") {
            dispatch({
              type: "ADD_DATA",
              payload: childData,
              schemas: Schemas,
              t: t,
              currentCategories: currentCategories,
            });
          } else {
            dispatch({
              type: "EDIT_DATA",
              payload: childData,
              schemas: Schemas,
              t: t,
              currentCategories: currentCategories,
            });
          }

          setShowToast({ label: t("HCM_MAPPING_ADDED"), isError: "success" });
          return true;
        } else {
          setShowToast({ label: validationResult?.message, isError: "error" });
          return false;
        }
      } catch (error) {
        console.error("Validation error:", error);
        return false;
      }
    } else {
      console.error("Child component ref is not accessible");
      return false;
    }
  };

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_DATA", payload: data, schemas: Schemas, t: t });
    }
  }, [data, Schemas]);
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
            return row?.[(Schemas?.find((i) => i.description === "User Name")?.name)] || t("NA");
          },
          sortable: true,
        },
        {
          name: t("PHONE_NUMBER"),
          selector: (row) => row?.[(Schemas?.find((i) => i.description === "Phone Number")?.name)] || t("NA"),
          sortable: true,
        },
        {
          name: t("ROLE"),
          selector: (row) => row?.[(Schemas?.find((i) => i.description === "User Role")?.name)] || t("NA"),
          sortable: true,
          cell: (row) => {

            const baseName = Schemas?.find(i => i.description === "User Role")?.name;
            if (!baseName) return t("NA");

            // 1. grab only the keys that start with `${baseName}_MULTISELECT_`
            // 2. filter out any null/undefined values
            // 3. map to the actual values
            const values = Object
              .keys(row)
              .filter(key => key.startsWith(`${baseName}_MULTISELECT_`) && row[key] != null)
              .map(key => t(row[key]));
            return (
              <div
                title={row?.[(Schemas?.find((i) => i.description === "User Role")?.name)] || t("NA")}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "150px",
                }}
              >
                {values?.join(",") || t("NA")}
              </div>
            )
          }
        },
        {
          name: t("EMPLOYEMENT_TYPE"),
          selector: (row) => row?.[(Schemas?.find((i) => i.description === "Employement Type")?.name)] || t("NA"),
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
                selected={a?.find((item) => item?.code === row?.[(Schemas?.find((i) => i.description === "User Usage")?.name)]) || null}
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
            const listOfBoundaries = row?.[(Schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)]?.split(",") || [];
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
      : [
        {
          name: t("FACILITY_NAME"),
          selector: (row) => {
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
                  isDisabled={row?.[t(Schemas?.find((i) => i.description === "Facility usage")?.name)] === "Inactive" ? true : false}
                  variation={"link"}
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
                label={t("MAPPING_EDIT")}
                icon={"Edit"}
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
        <Switch
          className={"data-mapping-filter-switch"}
          isLabelFirst
          label={t("FILTER_BY_ACTIVE_STATUS")}
          style={{
            position: "relative",
            zIndex: "1",
            alignSelf: "center",
          }}
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
          shapeOnOff={true}
        />
      </div>
      {showAddPopup && (
        <PopUp
          className={"custom-pop-up-mapping"}
          // className={"dataMapping"}
          type={"default"}
          heading={t("MAPPING_ADD_DATA")}
          children={[]}
          onOverlayClick={() => {
            setShowAddPopup(false);
          }}
          onClose={() => {
            setShowAddPopup(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("CLOSE")}
              onClick={() => {
                setShowAddPopup(false);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("ADD_DATA_MAPPING")}
              onClick={async () => {
                const result = await handleButtonAddClick("add");
                if (result) setShowAddPopup(false);
              }} // Trigger child method when button is clicked
            />,
          ]}
          sortFooterChildren={true}
        >
          <AddOrEditMapping
            ref={childRef}
            schema={Schemas}
            dispatch={dispatch}
            boundaryHierarchy={boundaryHierarchy}
            allSelectedBoundary={allSelectedBoundary}
            typeOfOperation="add"
            curData={showAddPopup}
          />
        </PopUp>
      )}
      {showEditPopup && (
        <PopUp
          className={"custom-pop-up-mapping"}
          // className={"dataMapping"}
          type={"default"}
          heading={t("MAPPING_EDIT_DATA")}
          children={[]}
          onOverlayClick={() => {
            setShowEditPopUp(false);
          }}
          onClose={() => {
            setShowEditPopUp(false);
          }}
          footerChildren={[
            <Button
              type={"button"}
              size={"large"}
              variation={"secondary"}
              label={t("CLOSE")}
              onClick={() => {
                setShowEditPopUp(false);
              }}
            />,
            <Button
              type={"button"}
              size={"large"}
              variation={"primary"}
              label={t("EDIT_DATA_MAPPING")}
              onClick={async () => {
                const result = await handleButtonAddClick("edit");
                if (result) setShowEditPopUp(false);
              }} // Trigger child method when button is clicked
            />,
          ]}
          sortFooterChildren={true}
        >
          <AddOrEditMapping
            ref={childRef}
            schema={Schemas}
            dispatch={dispatch}
            boundaryHierarchy={boundaryHierarchy}
            allSelectedBoundary={allSelectedBoundary}
            typeOfOperation="edit"
            curData={showEditPopup}
          />
        </PopUp>
      )}
      {showToast && <Toast style={{ zIndex: 999999 }} label={showToast.label} type={showToast.isError} onClose={() => setShowToast(false)} />}

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
                    setShowAddPopup(true);
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
      {chipPopUpRowId && (
        <Wrapper currentCategories={currentCategories} setShowPopUp={setChipPopUpRowId} alreadyQueuedSelectedState={chipPopUpRowId} />
      )}
      {showPopUp && (
        <PopUp
          className={"dataMapping"}
          type={"default"}
          heading={currentCategories === "HCM_UPLOAD_FACILITY_MAPPING" ? t("FACILITY_MAPPING_POP_HEADER") : t("USER_MAPPING_POP_HEADER")}
          equalWidthButtons={true}
          children={[
            <div>

              <LabelFieldPair key={1} style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
                <CardLabel style={{
                  marginBottom: "0.4rem",
                  width: "19rem",
                  flexShrink: 0,
                  display: "flex",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}>{t("CHOOSE_BOUNDARY_LEVEL")}</CardLabel>
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
              <LabelFieldPair className={"multiselect-label-field"} key={1} style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%" }}>
                <CardLabel style={{
                  marginBottom: "0.4rem",
                  width: "19rem",
                  flexShrink: 0,
                  display: "flex",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}>{t("CHOOSE_BOUNDARY")}</CardLabel>
                <MultiSelectDropdown
                  variant="nestedmultiselect"
                  props={{
                    className: "data-mapping-dropdown",
                    style: { width: "100%" },

                  }}
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
              variation={"secondary"}
              label={t("NO")}
              onClick={() => {
                setShowPopUp(false);
                setSelectedLevel(null);
                setSelectedBoundary(null);
              }}
            />,
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
