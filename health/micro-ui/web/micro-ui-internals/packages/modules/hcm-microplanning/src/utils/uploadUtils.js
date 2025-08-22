import ExcelJS from "exceljs";
import {
  freezeSheetValues,
  freezeWorkbookValues,
  hideUniqueIdentifierColumn,
  performUnfreezeCells,
  unfreezeColumnsByHeader,
  updateFontNameToRoboto,
} from "../utils/excelUtils";
import { addBoundaryData, createTemplate, fetchBoundaryData, filterBoundaries } from "../utils/createTemplate";
import {
  BOUNDARY_DATA_SHEET,
  EXCEL,
  FACILITY_DATA_SHEET,
  GEOJSON,
  SCHEMA_PROPERTIES_PREFIX,
  SHAPEFILE,
  SHEET_COLUMN_WIDTH,
  UPLOADED_DATA_ACTIVE_STATUS,
  commonColumn,
} from "../configs/constants";
import shp from "shpjs";
import JSZip from "jszip";
import { checkForErrorInUploadedFileExcel } from "../utils/excelValidations";
import { convertJsonToXlsx } from "../utils/jsonToExcelBlob";
import { parseXlsxToJsonMultipleSheets } from "../utils/exceltojson";
import { geojsonValidations } from "../utils/geojsonValidations";

// Function for checking the uploaded file for nameing conventions
export const validateNamingConvention = (file, namingConvention, setToast, t) => {
  try {
    let processedConvention = namingConvention.replace("$", ".[^.]*$");
    const regx = new RegExp(processedConvention);

    if (regx && !regx.test(file.name)) {
      setToast({
        state: "error",
        message: t("ERROR_NAMING_CONVENSION"),
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error(error.message);
    setToast({
      state: "error",
      message: t("ERROR_UNKNOWN"),
    });
  }
};

// Function for reading ancd checking geojson data
export const readGeojson = async (file, t) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve({ valid: false, toast: { state: "error", message: t("ERROR_PARSING_FILE") } });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geoJSONData = JSON.parse(e.target.result);
        const trimmedGeoJSONData = trimJSON(geoJSONData);
        resolve({ valid: true, geojsonData: trimmedGeoJSONData });
      } catch (error) {
        resolve({ valid: false, toast: { state: "error", message: t("ERROR_INCORRECT_FORMAT") } });
      }
    };
    reader.onerror = (error) => {
      resolve({ valid: false, toast: { state: "error", message: t("ERROR_CORRUPTED_FILE") } });
    };

    reader.readAsText(file);
  });
};

// Function to recursively trim leading and trailing spaces from string values in a JSON object
export const trimJSON = (jsonObject) => {
  if (typeof jsonObject !== "object") {
    return jsonObject; // If not an object, return as is
  }

  if (Array.isArray(jsonObject)) {
    return jsonObject.map((item) => trimJSON(item)); // If it's an array, recursively trim each item
  }

  const trimmedObject = {};
  for (const key in jsonObject) {
    if (Object.hasOwn(jsonObject, key)) {
      const value = jsonObject[key];
      // Trim string values, recursively trim objects
      trimmedObject[key.trim()] = typeof value === "string" ? value.trim() : typeof value === "object" ? trimJSON(value) : value;
    }
  }
  return trimmedObject;
};
// Function for reading and validating shape file data
export const readAndValidateShapeFiles = async (file, t, namingConvention) => {
  return new Promise((resolve, reject) => {
    const readAndValidate = async () => {
      if (!file) {
        resolve({ valid: false, toast: { state: "error", message: t("ERROR_PARSING_FILE") } });
      }
      const fileRegex = new RegExp(namingConvention.replace("$", ".*$"));
      // File Size Check
      const fileSizeInBytes = file.size;
      const maxSizeInBytes = 2 * 1024 * 1024 * 1024; // 2 GB

      // Check if file size is within limit
      if (fileSizeInBytes > maxSizeInBytes)
        resolve({ valid: false, message: t("ERROR_FILE_SIZE"), toast: { state: "error", message: t("ERROR_FILE_SIZE") } });

      try {
        const zip = await JSZip.loadAsync(file);
        const isEPSG4326 = await checkProjection(zip);
        if (!isEPSG4326) {
          resolve({ valid: false, message: t("ERROR_WRONG_PRJ"), toast: { state: "error", message: t("ERROR_WRONG_PRJ") } });
        }
        const files = Object.keys(zip.files);
        const allFilesMatchRegex = files.every((fl) => {
          return fileRegex.test(fl);
        });
        let regx = new RegExp(namingConvention.replace("$", "\\.shp$"));
        const shpFile = zip.file(regx)[0];
        regx = new RegExp(namingConvention.replace("$", "\\.shx$"));
        const shxFile = zip.file(regx)[0];
        regx = new RegExp(namingConvention.replace("$", "\\.dbf$"));
        const dbfFile = zip.file(regx)[0];

        let geojson;
        if (shpFile && dbfFile) {
          const shpArrayBuffer = await shpFile.async("arraybuffer");
          const dbfArrayBuffer = await dbfFile.async("arraybuffer");

          geojson = shp.combine([shp.parseShp(shpArrayBuffer), shp.parseDbf(dbfArrayBuffer)]);
        }
        if (shpFile && dbfFile && shxFile && allFilesMatchRegex) resolve({ valid: true, data: geojson });
        else if (!allFilesMatchRegex)
          resolve({
            valid: false,
            message: [t("ERROR_CONTENT_NAMING_CONVENSION")],
            toast: { state: "error", data: geojson, message: t("ERROR_CONTENT_NAMING_CONVENSION") },
          });
        else if (!shpFile)
          resolve({ valid: false, message: [t("ERROR_SHP_MISSING")], toast: { state: "error", data: geojson, message: t("ERROR_SHP_MISSING") } });
        else if (!dbfFile)
          resolve({ valid: false, message: [t("ERROR_DBF_MISSING")], toast: { state: "error", data: geojson, message: t("ERROR_DBF_MISSING") } });
        else if (!shxFile)
          resolve({ valid: false, message: [t("ERROR_SHX_MISSING")], toast: { state: "error", data: geojson, message: t("ERROR_SHX_MISSING") } });
      } catch (error) {
        resolve({ valid: false, toast: { state: "error", message: t("ERROR_PARSING_FILE") } });
      }
    };
    readAndValidate();
  });
};

// Function for projections check in case of shapefile data
export const checkProjection = async (zip) => {
  const prjFile = zip.file(/.prj$/i)[0];
  if (!prjFile) {
    return "absent";
  }

  const prjText = await prjFile.async("text");

  if (prjText.includes("GEOGCS") && prjText.includes("WGS_1984") && prjText.includes("DATUM") && prjText.includes("D_WGS_1984")) {
    return "EPSG:4326";
  }
  return false;
};

// find readMe as per campaign, template identifier and file type
export const findReadMe = (readMeCollection, campaignType, type, section) => {
  if (!readMeCollection) return readMeCollection;
  return (
    readMeCollection.find(
      (readMe) => readMe.fileType === type && readMe.templateIdentifier === section && (!readMe.campaignType || readMe.campaignType === campaignType)
    ) || {}
  );
};

// Function to handle the template download
export const downloadTemplate = async ({
  campaignType,
  type,
  section,
  setToast,
  campaignData,
  hierarchyType,
  Schemas,
  HierarchyConfigurations,
  setLoader,
  hierarchy,
  readMeData,
  readMeSheetName,
  t,
}) => {
  try {
    setLoader("LOADING");
    await delay(100);
    // Find the template based on the provided parameters
    const schema = getSchema(campaignType, type, section, Schemas);
    const hierarchyLevelName = HierarchyConfigurations?.find((item) => item.name === "devideBoundaryDataBy")?.value;
    const filteredReadMeData = findReadMe(readMeData, campaignType, type, section);
    let template = await createTemplate({
      hierarchyLevelWiseSheets: schema?.template?.hierarchyLevelWiseSheets,
      hierarchyLevelName,
      addFacilityData: schema?.template?.includeFacilityData,
      schema,
      boundaries: campaignData?.boundaries,
      tenantId: Digit.ULBService.getCurrentTenantId(),
      hierarchyType,
      readMeData: filteredReadMeData,
      readMeSheetName,
      t,
    });
    const translatedTemplate = translateTemplate(template, t);

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    formatTemplate(translatedTemplate, workbook, t);

    // Color headers
    colorHeaders(
      workbook,
      [...hierarchy.map((item) => t(item)), t(commonColumn)],
      schema?.schema?.Properties ? Object.keys(schema.schema.Properties).map((item) => t(generateLocalisationKeyForSchemaProperties(item))) : [],
      []
    );

    formatAndColorReadMeFile(
      workbook,
      (filteredReadMeData?.data || [])?.map((item) => t(item?.header)),
      t(readMeSheetName)
    );

    // protextData
    // await protectData({
    //   workbook,
    //   hierarchyLevelWiseSheets: schema?.template?.hierarchyLevelWiseSheets,
    //   addFacilityData: schema?.template?.includeFacilityData,
    //   schema,
    //   readMeSheetName: t(readMeSheetName),
    //   t,
    // });

    // Write the workbook to a buffer
    workbook.xlsx.writeBuffer({ compression: true }).then((buffer) => {
      // Create a Blob from the buffer
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      // Create a link element and simulate click to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${t(section)}.xlsx`;
      link.click();
      // Revoke the URL to release the Blob
      URL.revokeObjectURL(url);
      setLoader(false);
    });
  } catch (error) {
    setLoader(false);
    console.error(error?.message);
    setToast({ state: "error", message: t("ERROR_DOWNLOADING_TEMPLATE") });
  }
};

export const formatAndColorReadMeFile = (workbook, headerSet, readMeSheetName) => {
  const readMeSheet = workbook.getWorksheet(readMeSheetName);
  if (!readMeSheet) return;
  setAndFormatHeaders(readMeSheet);
  formatWorksheet(readMeSheet, headerSet);
};

export function setAndFormatHeaders(worksheet) {
  const row = worksheet.getRow(1);
  // Color the header cell
  row.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "f25449" }, // Header cell color
    };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true }; // Center align and wrap text
    // cell.font = { bold: true };
  });
}
export function formatWorksheet(worksheet, headerSet) {
  // Add the data rows with text wrapping
  const lineHeight = 17; // Set an approximate line height
  const maxCharactersPerLine = 100; // Set a maximum number of characters per line for wrapping

  worksheet.eachRow((row, index) => {
    if (index === 1) return;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true }; // Apply text wrapping
      // Calculate the required row height based on content length
      const numberOfLines = Math.ceil(cell?.value.length / maxCharactersPerLine);
      row.height = numberOfLines * lineHeight;

      // Make the header text bold
      if (headerSet?.includes(cell.value)) {
        cell.font = { bold: true };
      }
    });
  });
  worksheet.getColumn(1).width = 130;
  updateFontNameToRoboto(worksheet);
}

const freezeHierarchySheets = async ({ workbook, readMeSheetName, t }) => {
  await freezeSheetValues(workbook, readMeSheetName);
};

const processFacilityData = async ({ workbook, schema, t }) => {
  await freezeSheetValues(workbook, t(BOUNDARY_DATA_SHEET));
  await performUnfreezeCells(workbook, t(FACILITY_DATA_SHEET));
  if (schema?.template?.propertiesToHide && Array.isArray(schema.template.propertiesToHide)) {
    const tempPropertiesToHide = schema?.template?.propertiesToHide.map((item) => t(generateLocalisationKeyForSchemaProperties(item)));
    await hideUniqueIdentifierColumn(workbook, t(FACILITY_DATA_SHEET), tempPropertiesToHide);
  }
  // Further processing based on facilitySchemaApiMapping can be done here if needed
};

const processBoundaryData = async ({ workbook, schema, t }) => {
  await freezeWorkbookValues(workbook);
  await unfreezeColumnsByHeader(
    workbook,
    schema?.schema?.Properties ? Object.keys(schema.schema.Properties).map((item) => t(generateLocalisationKeyForSchemaProperties(item))) : []
  );
};

export const protectData = async ({ workbook, hierarchyLevelWiseSheets = true, addFacilityData = false, schema, readMeSheetName, t }) => {
  await freezeHierarchySheets({ workbook, readMeSheetName, t });
  if (hierarchyLevelWiseSheets) {
    if (addFacilityData) {
      await processFacilityData({ workbook, schema, t });
    } else {
      await processBoundaryData({ workbook, schema, t });
    }
  } else {
    if (addFacilityData) {
      await processFacilityData({ workbook, schema, t });
    } else {
      await processBoundaryData({ workbook, schema, t });
    }
  }
};

export const colorHeaders = async (workbook, headerList1, headerList2, headerList3) => {
  try {
    // Iterate through each sheet
    workbook.eachSheet((sheet, sheetId) => {
      // Get the first row
      const firstRow = sheet.getRow(1);

      // Iterate through each cell in the first row
      firstRow.eachCell((cell, colNumber) => {
        const cellValue = cell.value.toString();

        // Check conditions and set colors
        if (headerList1?.includes(cellValue)) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ff9248" },
          };
        } else if (headerList2?.includes(cellValue)) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "93C47D" },
          };
        } else if (headerList3?.includes(cellValue)) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "CCCC00" },
          };
        }
      });
    });
  } catch (error) {
    console.error("Error coloring headers:", error);
  }
};

const addUniqueWorksheet = (workbook, sheetName) => {
  let uniqueSheetName = sheetName;
  let counter = 1;
  while (workbook.getWorksheet(uniqueSheetName)) {
    uniqueSheetName = `${sheetName} (${counter})`;
    counter++;
  }
  return workbook.addWorksheet(uniqueSheetName);
};

export const formatTemplate = (template, workbook, t) => {
  template.forEach(({ sheetName, data }) => {
    // Create a new worksheet with properties and unique name
    const worksheet = addUniqueWorksheet(workbook, sheetName);

    let commonColumnIndex = -1;
    data?.forEach((row, index) => {
      const worksheetRow = worksheet.addRow(row);

      // Apply fill color to each cell in the first row and make cells bold
      if (index === 0) {
        worksheetRow.eachCell((cell, colNumber) => {
          // Set font to bold
          cell.font = { bold: true };

          // Enable text wrapping
          cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
          // Update column width based on the length of the cell's text
          // const currentWidth = worksheet.getColumn(colNumber).width || SHEET_COLUMN_WIDTH; // Default width or current width
          // const newWidth = Math.min(currentWidth, cell.value.toString().length + 2); // Add padding
          if (cell.value === t(commonColumn) || cell.value === t(generateLocalisationKeyForSchemaProperties(commonColumn))) {
            commonColumnIndex = colNumber;
            worksheet.getColumn(colNumber).width = SHEET_COLUMN_WIDTH + 10;
          } else {
            worksheet.getColumn(colNumber).width = SHEET_COLUMN_WIDTH;
          }
        });
      }
      worksheetRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.alignment = { vertical: "middle", wrapText: colNumber !== commonColumnIndex }; // Apply text wrapping
      });
    });

    updateFontNameToRoboto(worksheet);
  });
};

export const translateTemplate = (template, t) => {
  // Initialize an array to hold the transformed result
  const transformedResult = [];

  // Iterate over each sheet in the divided data
  for (const sheet of template) {
    const sheetData = sheet.data;

    // Find the index of the boundaryCode column in the header row
    const boundaryCodeIndex = sheetData[0].indexOf(commonColumn);

    const sheetName = t(sheet.sheetName);
    const transformedSheet = {
      sheetName: sheetName.length > 31 ? sheetName.slice(0, 31) : sheetName,
      data: [],
    };

    // Iterate over each row in the sheet data
    for (const [rowIndex, row] of sheetData.entries()) {
      // Transform each entity in the row using the transformFunction
      const transformedRow = row.map((entity, index) => {
        // Skip transformation for the boundaryCode column
        if ((index === boundaryCodeIndex && rowIndex !== 0) || typeof entity === "number") {
          return entity;
        }
        return t(entity);
      });
      transformedSheet.data.push(transformedRow);
    }

    // Add the transformed sheet to the transformed result
    transformedResult.push(transformedSheet);
  }

  return transformedResult;
};

// get schema for validation
export const getSchema = (campaignType, type, section, schemas) => {
  return schemas.find((schema) => {
    if (!schema.campaignType) {
      return schema.type === type && schema.section === section;
    }
    return schema.campaignType === campaignType && schema.type === type && schema.section === section;
  });
};

// Performs resource mapping and data filtering for Excel files based on provided schema data, hierarchy, and file data.
export const resourceMappingAndDataFilteringForExcelFiles = (schemaData, hierarchy, selectedFileType, fileDataToStore, t) => {
  const resourceMappingData = [];
  const newFileData = {};
  if (selectedFileType.id === EXCEL && fileDataToStore) {
    // Extract all unique column names from fileDataToStore and then doing thir resource mapping
    const columnForMapping = new Set(Object.values(fileDataToStore).flatMap((value) => value?.[0] || []));
    if (schemaData?.schema?.["Properties"]) {
      const schemaKeys = Object.keys(schemaData.schema["Properties"])
        .map((item) => generateLocalisationKeyForSchemaProperties(item))
        .concat([...hierarchy, commonColumn]);
      schemaKeys.forEach((item) => {
        if (columnForMapping.has(t(item))) {
          resourceMappingData.push({
            mappedFrom: t(item),
            mappedTo: revertLocalisationKey(item),
          });
        }
      });
    }

    // Filtering the columns with respect to the resource mapping and removing the columns that are not needed
    Object.entries(fileDataToStore).forEach(([key, value]) => {
      const data = [];
      const headers = [];
      const toRemove = [];
      if (value && value.length > 0) {
        value[0].forEach((item, index) => {
          const mappedTo = resourceMappingData.find((e) => e.mappedFrom === item)?.mappedTo;
          if (!mappedTo) {
            toRemove.push(index);
            return;
          }
          headers.push(mappedTo);
          return;
        });
        for (let i = 1; i < value?.length; i++) {
          let temp = [];
          for (let j = 0; j < value[i].length; j++) {
            if (!toRemove.includes(j)) {
              temp.push(value[i][j]);
            }
          }
          data.push(temp);
        }
      }
      newFileData[key] = [headers, ...data];
    });
  }
  return { tempResourceMappingData: resourceMappingData, tempFileDataToStore: newFileData };
};
export const revertLocalisationKey = (localisedCode) => {
  if (!localisedCode || !localisedCode.startsWith(SCHEMA_PROPERTIES_PREFIX + "_")) {
    return localisedCode;
  }
  return localisedCode.substring(SCHEMA_PROPERTIES_PREFIX.length + 1);
};
// Function to process each dataset within the data object
const processData = (data, schemaCols, errors, hierarchy, sectionIdList, readMeSheetName, t) => {
  const processedData = {};
  for (const sheet of data) {
    const dataset = [...sheet.data];
    dataset[0] = dataset[0].map((item) => {
      if (item !== commonColumn && schemaCols.includes(item)) {
        return t(generateLocalisationKeyForSchemaProperties(item));
      }
      return t(item);
    });

    if (sheet.sheetName !== t(BOUNDARY_DATA_SHEET) && sheet.sheetName !== t(readMeSheetName)) {
      processSheetErrors(dataset, sheet.sheetName, errors, t);
    }

    if (sheet.sheetName === t(FACILITY_DATA_SHEET) || sectionIdList.includes(sheet.sheetName)) {
      dataset[0] = dataset[0].map((item) => {
        if (item === t(commonColumn)) {
          return t(generateLocalisationKeyForSchemaProperties(commonColumn));
        }
        return item;
      });

      if (hierarchy.every((item) => dataset[0].includes(item))) {
        for (let i = 0; i < dataset.length; i++) {
          dataset[i] = dataset[i].slice(hierarchy.length);
        }
      }
    }

    processedData[sheet.sheetName] = dataset;
  }
  return processedData;
};

// Function to process errors for a sheet
const processSheetErrors = (dataset, sheetName, errors, t) => {
  const headerCount = dataset[0].length;
  dataset[0].push(t("MICROPLAN_ERROR_STATUS_COLUMN"), t("MICROPLAN_ERROR_COLUMN"));

  for (let i = 1; i < dataset.length; i++) {
    const row = dataset[i];
    if (headerCount > row.length) {
      row.push(...Array(headerCount - row.length).fill(""));
    }

    const errorInfo = errors?.[sheetName]?.[i - 1];
    if (errorInfo) {
      const rowDataAddOn = Object.entries(errorInfo)
        .map(([key, value]) => {
          return `${t(key)}: ${value.map((item) => t(item)).join(", ")}`;
        })
        .join(". ");
      row.push(t("MICROPLAN_ERROR_STATUS_INVALID"), rowDataAddOn);
    } else {
      row.push("");
    }
  }
};

// Function to style the workbook
const styleWorkbook = (workbook, hierarchy, commonColumn, schema, t) => {
  const style = {
    font: { color: { argb: "B91900" } },
    border: {
      top: { style: "thin", color: { argb: "B91900" } },
      left: { style: "thin", color: { argb: "B91900" } },
      bottom: { style: "thin", color: { argb: "B91900" } },
      right: { style: "thin", color: { argb: "B91900" } },
    },
  };

  const header1 = [...hierarchy.map((item) => t(item)), t(commonColumn)];
  const header2 = schema?.schema?.Properties
    ? [
        ...Object.keys(schema.schema.Properties).map((item) => t(generateLocalisationKeyForSchemaProperties(item))),
        t(generateLocalisationKeyForSchemaProperties(commonColumn)),
      ]
    : [];

  colorHeaders(workbook, header1, header2, [t("MICROPLAN_ERROR_STATUS_COLUMN"), t("MICROPLAN_ERROR_COLUMN")]);
};

// Function to protect the workbook data
const protectWorkbookData = async (workbook, schema, t) => {
  await protectData({
    workbook,
    hierarchyLevelWiseSheets: schema?.template?.hierarchyLevelWiseSheets,
    addFacilityData: schema?.template?.includeFacilityData,
    schema,
    t,
  });
};

export const prepareExcelFileBlobWithErrors = async (dataInput, errors, schema, hierarchy, readMeData, readMeSheetName, sectionIdList, t) => {
  const data = _.cloneDeep(dataInput);
  const schemaCols = schema?.schema?.Properties ? Object.keys(schema.schema.Properties) : [];
  const processedData = processData(data, schemaCols, errors, hierarchy, sectionIdList, readMeSheetName, t);

  const workbook = await convertToWorkBook(
    processedData,
    {
      errorColumns: [t("MICROPLAN_ERROR_STATUS_COLUMN"), t("MICROPLAN_ERROR_COLUMN")],
      style: {
        font: { color: { argb: "B91900" } },
        border: {
          top: { style: "thin", color: { argb: "B91900" } },
          left: { style: "thin", color: { argb: "B91900" } },
          bottom: { style: "thin", color: { argb: "B91900" } },
          right: { style: "thin", color: { argb: "B91900" } },
        },
      },
    },
    t
  );

  styleWorkbook(workbook, hierarchy, commonColumn, schema, t);

  formatAndColorReadMeFile(
    workbook,
    readMeData?.map((item) => t(item?.header)),
    t(readMeSheetName)
  );

  // await protectWorkbookData(workbook, schema, t);

  return await workbook.xlsx.writeBuffer({ compression: true }).then((buffer) => {
    return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  });
};

export const convertToWorkBook = async (jsonData, columnWithStyle, t) => {
  const workbook = new ExcelJS.Workbook();

  // Iterate over each sheet in jsonData
  for (const [sheetName, data] of Object.entries(jsonData)) {
    // Create a new worksheet
    const worksheet = workbook.addWorksheet(sheetName);

    let index = 0;
    let commonColumnIndex = -1;

    // Convert data to worksheet
    for (const row of data) {
      const newRow = worksheet.addRow(row);

      const rowHasData = row?.filter((item) => item !== "").length !== 0;
      // Apply red font color to the errorColumn if it exists
      if (rowHasData && columnWithStyle?.errorColumns) {
        for (const errorColumn of columnWithStyle?.errorColumns) {
          const errorColumnIndex = data[0].indexOf(errorColumn);
          if (errorColumnIndex !== -1) {
            const columnIndex = errorColumnIndex + 1;
            if (columnIndex > 0) {
              const newCell = newRow.getCell(columnIndex);
              if (columnWithStyle.style && newCell) for (const key in columnWithStyle.style) newCell[key] = columnWithStyle.style[key];
            }
          }
        }
      }
      if (index === 0) {
        newRow.eachCell((cell, colNumber) => {
          // Set font to bold
          cell.font = { bold: true };

          // Enable text wrapping
          cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
          // Update column width based on the length of the cell's text
          // const currentWidth = worksheet.getColumn(colNumber).width || SHEET_COLUMN_WIDTH; // Default width or current width
          // const newWidth = Math.min(currentWidth, cell.value.toString().length + 2); // Add padding
          if (cell.value === t(commonColumn) || cell.value === t(generateLocalisationKeyForSchemaProperties(commonColumn))) {
            commonColumnIndex = colNumber;
            worksheet.getColumn(colNumber).width = SHEET_COLUMN_WIDTH + 10;
          } else {
            worksheet.getColumn(colNumber).width = SHEET_COLUMN_WIDTH;
          }
        });
      }
      newRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.alignment = { vertical: "middle", wrapText: colNumber !== commonColumnIndex }; // Apply text wrapping
      });
      index++;
    }

    // Make the first row bold
    if (worksheet.getRow(1)) {
      worksheet.getRow(1).font = { bold: true };
    }

    // Set column widths
    // const columnCount = data?.[0]?.length || 0;
    // const wscols = Array(columnCount).fill({ width: 30 });
    // wscols.forEach((col, colIndex) => {
    //   worksheet.getColumn(colIndex + 1).width = col.width;
    // });
  }
  return workbook;
};
export const boundaryDataGeneration = async (schemaData, campaignData, t) => {
  const boundaryDataAgainstBoundaryCode = {};
  if (schemaData && !schemaData.doHierarchyCheckInUploadedData) {
    try {
      const rootBoundary = campaignData?.boundaries?.filter((boundary) => boundary.isRoot); // Retrieve session storage data once and store it in a variable
      const sessionData = Digit.SessionStorage.get("microplanHelperData") || {};
      let boundaryData = sessionData.filteredBoundaries;
      let filteredBoundaries;
      if (!boundaryData) {
        // Only fetch boundary data if not present in session storage
        boundaryData = await fetchBoundaryData(Digit.ULBService.getCurrentTenantId(), campaignData?.hierarchyType, rootBoundary?.[0]?.code);
        filteredBoundaries = filterBoundaries(boundaryData, campaignData?.boundaries);

        // Update the session storage with the new filtered boundaries
        Digit.SessionStorage.set("microplanHelperData", {
          ...sessionData,
          filteredBoundaries: filteredBoundaries,
        });
      } else {
        filteredBoundaries = boundaryData;
      }
      const xlsxData = addBoundaryData([], filteredBoundaries, campaignData?.hierarchyType)?.[0]?.data;
      xlsxData.forEach((item, i) => {
        if (i === 0) return;
        let boundaryCodeIndex = xlsxData?.[0]?.indexOf(commonColumn);
        if (boundaryCodeIndex >= item.length) {
          // If boundaryCodeIndex is out of bounds, return the item as is
          boundaryDataAgainstBoundaryCode[item[boundaryCodeIndex]] = item.slice().map(t);
        } else {
          // Otherwise, remove the element at boundaryCodeIndex
          boundaryDataAgainstBoundaryCode[item[boundaryCodeIndex]] = item
            .slice(0, boundaryCodeIndex)
            .concat(item.slice(boundaryCodeIndex + 1))
            .map(t);
        }
      });
      return boundaryDataAgainstBoundaryCode;
    } catch (error) {
      console.error(error?.message);
    }
  }
};

const filterDataWithActiveInactiveStatus = (result, activeInactiveField, dataInObject, t) => {
  const facilityDataSheetKey = t(FACILITY_DATA_SHEET);
  const uploadedDataActiveStatus = t(UPLOADED_DATA_ACTIVE_STATUS);

  if (!result?.[facilityDataSheetKey]) {
    return result;
  }

  const facilityDataSheet = result[facilityDataSheetKey];

  const filterDataInObject = () => {
    return facilityDataSheet.filter((item) => item?.[activeInactiveField] === uploadedDataActiveStatus);
  };

  const filterDataInArray = () => {
    const activeInactiveFieldIndex = facilityDataSheet[0]?.findIndex((item) => item === activeInactiveField);

    if (activeInactiveFieldIndex === -1) {
      return facilityDataSheet;
    }

    return facilityDataSheet.filter((item, index) => {
      if (index === 0) {
        return true; // Include header
      }
      return item?.[activeInactiveFieldIndex] === uploadedDataActiveStatus;
    });
  };

  const filteredData = dataInObject ? filterDataInObject() : filterDataInArray();

  return { [facilityDataSheetKey]: filteredData };
};

export const handleExcelFile = async (
  file,
  schemaData,
  hierarchy,
  selectedFileType,
  boundaryDataAgainstBoundaryCode,
  setUploadedFileError,
  t,
  campaignData,
  readMeSheetName
) => {
  try {
    // Converting the file to preserve the sequence of columns so that it can be stored
    let fileDataToStore = await parseXlsxToJsonMultipleSheets(file, { header: 0 });

    const additionalSheets = [];
    if (fileDataToStore[t(BOUNDARY_DATA_SHEET)]) {
      additionalSheets.push({ sheetName: t(BOUNDARY_DATA_SHEET), data: fileDataToStore[t(BOUNDARY_DATA_SHEET)], position: -1 });
      delete fileDataToStore[t(BOUNDARY_DATA_SHEET)];
    }
    if (fileDataToStore[t(readMeSheetName)]) {
      additionalSheets.push({ sheetName: t(readMeSheetName), data: fileDataToStore[t(readMeSheetName)], position: 0 });
      delete fileDataToStore[t(readMeSheetName)];
    } else {
      return {
        check: false,
        interruptUpload: true,
        fileDataToStore: {},
        toast: { state: "error", message: t("ERROR_READ_ME_MISSING") },
      };
    }
    let { tempResourceMappingData, tempFileDataToStore } = resourceMappingAndDataFilteringForExcelFiles(
      schemaData,
      hierarchy,
      selectedFileType,
      fileDataToStore,
      t
    );
    fileDataToStore = await convertJsonToXlsx(tempFileDataToStore);
    // Converting the input file to json format
    let result = await parseXlsxToJsonMultipleSheets(fileDataToStore, { header: 1 });
    if (result) {
      const validSheets = {};
      const resultSheetNames = Object.keys(result);
      Object.keys(tempFileDataToStore).forEach((item) => {
        if (resultSheetNames.includes(item)) {
          validSheets[item] = tempFileDataToStore[item];
        }
      });
      tempFileDataToStore = validSheets;
    }
    if (result?.error) {
      return {
        check: false,
        interruptUpload: true,
        error: result.error,
        fileDataToStore: {},
        toast: { state: "error", message: t("ERROR_CORRUPTED_FILE") },
      };
    }
    let extraColumns = [commonColumn];
    // checking if the hierarchy and common column is present the  uploaded data
    extraColumns = [...hierarchy, commonColumn];
    let data = Object.values(tempFileDataToStore);
    let errorMsg;
    let errors; // object containing the location and type of error
    let toast;
    let hierarchyDataPresent = true;
    let latLngColumns =
      Object.entries(schemaData?.schema?.Properties || {}).reduce((acc, [key, value]) => {
        if (value?.isLocationDataColumns) {
          acc.push(key);
        }
        return acc;
      }, []) || [];
    data.forEach((item) => {
      const keys = item[0];
      if (keys?.length !== 0) {
        if (!extraColumns?.every((e) => keys.includes(e))) {
          if (schemaData && !schemaData.doHierarchyCheckInUploadedData) {
            hierarchyDataPresent = false;
          } else {
            errorMsg = {
              check: false,
              interruptUpload: true,
              error: t("ERROR_BOUNDARY_DATA_COLUMNS_ABSENT"),
              fileDataToStore: {},
              toast: { state: "error", message: t("ERROR_BOUNDARY_DATA_COLUMNS_ABSENT") },
            };
          }
        }
        if (!latLngColumns?.every((e) => keys.includes(e))) {
          toast = { state: "warning", message: t("ERROR_UPLOAD_EXCEL_LOCATION_DATA_MISSING") };
        }
      }
    });
    if (errorMsg && !errorMsg?.check) return errorMsg;
    if (
      schemaData?.schema?.Properties &&
      Object.keys(schemaData.schema.Properties).includes(schemaData.activeInactiveField) &&
      schemaData.schema.Properties?.[schemaData.activeInactiveField]?.isRequired
    ) {
      const hasColumn = Object.values(tempFileDataToStore).reduce((acc, item) => {
        const activeFieldIndex = item?.[0]?.indexOf(schemaData.activeInactiveField);
        const hasColumnData = activeFieldIndex !== -1 ? item.slice().every((e) => !!e?.[activeFieldIndex]) : undefined;
        return acc && activeFieldIndex !== -1 && hasColumnData;
      }, true);
      if (!hasColumn) {
        return {
          check: false,
          errors: [],
          interruptUpload: true,
          fileDataToStore: {},
          toast: { state: "error", message: t("ERROR_ACTIVE_INACTIVE_COLUMN_MISSING", { columnName: t(schemaData.activeInactiveField) }) },
        };
      }
    }
    if (
      schemaData?.activeInactiveField &&
      schemaData?.schema?.Properties &&
      Object.keys(schemaData.schema.Properties).includes(schemaData.activeInactiveField)
    ) {
      result = filterDataWithActiveInactiveStatus(result, schemaData.activeInactiveField, true, t);
      tempFileDataToStore = filterDataWithActiveInactiveStatus(tempFileDataToStore, schemaData.activeInactiveField, false, t);
      const hasActiveData = Object.values(tempFileDataToStore).reduce((acc, item) => {
        return acc && item?.length > 1;
      }, true);
      if (!hasActiveData) {
        return {
          check: false,
          errors: [],
          interruptUpload: true,
          fileDataToStore: {},
          toast: { state: "error", message: t("ERROR_ACTIVE_DATA_MISSING") },
        };
      }
    }
    // Running Validations for uploaded file
    let response = await checkForErrorInUploadedFileExcel(result, schemaData.schema, t);
    if (!response.valid) setUploadedFileError(response.message);
    errorMsg = response.message;
    errors = response.errors;
    const missingProperties = response.missingProperties;
    let check = response.valid;
    try {
      if (
        schemaData &&
        !schemaData.doHierarchyCheckInUploadedData &&
        !hierarchyDataPresent &&
        boundaryDataAgainstBoundaryCode &&
        (!missingProperties || [...missingProperties]?.includes(commonColumn))
      ) {
        let tempBoundaryDataAgainstBoundaryCode = (await boundaryDataGeneration(schemaData, campaignData, t)) || {};
        for (const sheet in tempFileDataToStore) {
          const commonColumnIndex = tempFileDataToStore[sheet]?.[0]?.indexOf(commonColumn);
          if (commonColumnIndex !== -1) {
            const dataCollector = [];
            for (let index = 0; index < tempFileDataToStore[sheet].length; index++) {
              let row = tempFileDataToStore[sheet][index];
              const commonColumnValues = row[commonColumnIndex]?.split(",").map((item) => item.trim());
              if (!commonColumnValues) {
                dataCollector.push([...new Array(hierarchy.length).fill(""), ...row]);
                continue;
              }
              for (const value of commonColumnValues) {
                const newRowData = [...row];
                newRowData[commonColumnIndex] = value;
                dataCollector.push([
                  ...(tempBoundaryDataAgainstBoundaryCode[value]
                    ? tempBoundaryDataAgainstBoundaryCode[value]
                    : index !== 0
                    ? new Array(hierarchy.length).fill("")
                    : []),
                  ...newRowData,
                ]);
              }
            }
            tempFileDataToStore[sheet] = dataCollector;
          }

          tempFileDataToStore[sheet][0] = [...hierarchy, ...tempFileDataToStore[sheet][0]];
        }
      }
    } catch (error) {
      console.error("Error in boundary adding operaiton: ", error);
    }
    tempFileDataToStore = addMissingPropertiesToFileData(tempFileDataToStore, missingProperties);

    // checking boundary codes
    const errorObject = await boundaryCodeValidations(tempFileDataToStore, campaignData, EXCEL, t);
    const combinedErrors =
      !errors && errorObject && Object.keys(errorObject).length === 0 ? false : Digit.Utils.microplan.mergeDeep(errors, errorObject);
    if (check && combinedErrors) setUploadedFileError(["ERROR_REFER_UPLOAD_PREVIEW_TO_SEE_THE_ERRORS"]);
    return {
      check: check && !combinedErrors,
      errors: combinedErrors,
      errorMsg: errorMsg ? errorMsg : combinedErrors ? ["ERROR_REFER_UPLOAD_PREVIEW_TO_SEE_THE_ERRORS"] : undefined,
      fileDataToStore: tempFileDataToStore,
      tempResourceMappingData,
      toast,
      additionalSheets,
    };
  } catch (error) {
    console.error("Error in handling Excel file:", error.message);
  }
};

export const addMissingPropertiesToFileData = (data, missingProperties) => {
  if (!data || !missingProperties) return data;
  let tempData = {};
  Object.entries(data).forEach(([key, value], index) => {
    const filteredMissingProperties = [...missingProperties]?.reduce((acc, item) => {
      if (!value?.[0]?.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, []);
    const newTempHeaders = value?.[0].length !== 0 ? [...value[0], ...filteredMissingProperties] : [...filteredMissingProperties];
    tempData[key] = [newTempHeaders, ...value.slice(1)];
  });
  return tempData;
};

export const handleGeojsonFile = async (file, schemaData, setUploadedFileError, t) => {
  // Reading and checking geojson data
  const data = await readGeojson(file, t);
  if (!data.valid) {
    return { check: false, stopUpload: true, toast: data.toast };
  }

  // Running geojson validaiton on uploaded file
  let response = geojsonValidations(data.geojsonData, schemaData.schema, t);
  if (!response.valid) setUploadedFileError(response.message);
  let check = response.valid;
  let error = response.message;
  let fileDataToStore = data.geojsonData;
  return { check, error, fileDataToStore };
};

const generateLocalisationKeyForSchemaProperties = (code) => {
  if (!code) return code;
  return `${SCHEMA_PROPERTIES_PREFIX}_${code}`;
};
export const handleShapefiles = async (file, schemaData, setUploadedFileError, selectedFileType, setToast, t) => {
  // Reading and validating the uploaded geojson file
  let response = await readAndValidateShapeFiles(file, t, selectedFileType["namingConvention"]);
  if (!response.valid) {
    setUploadedFileError(response.message);
    setToast(response.toast);
  }
  let check = response.valid;
  let error = response.message;
  let fileDataToStore = response.data;
  return { check, error, fileDataToStore };
};

export const convertToSheetArray = (data) => {
  if (!data) return [];
  const convertedSheetData = [];
  for (const [key, value] of Object.entries(data)) {
    convertedSheetData.push({ sheetName: key, data: value });
  }
  return convertedSheetData;
};

//find guideline
export const findGuideLine = (campaignType, type, section, guidelineArray) => {
  if (!guidelineArray) return guidelineArray;
  return guidelineArray.find(
    (guideline) =>
      guideline.fileType === type && guideline.templateIdentifier === section && (!guideline.campaignType || guideline.campaignType === campaignType)
  )?.guidelines;
};

// Utility function to introduce a delay
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchBoundary = async (campaignData) => {
  const rootBoundary = campaignData?.boundaries?.filter((boundary) => boundary.isRoot); // Retrieve session storage data once and store it in a variable
  const sessionData = Digit.SessionStorage.get("microplanHelperData") || {};
  let boundaryData = sessionData.filteredBoundaries;
  let filteredBoundaries;
  if (!boundaryData) {
    // Only fetch boundary data if not present in session storage
    boundaryData = await fetchBoundaryData(Digit.ULBService.getCurrentTenantId(), campaignData?.hierarchyType, rootBoundary?.[0]?.code);
    filteredBoundaries = filterBoundaries(boundaryData, campaignData?.boundaries);

    // Update the session storage with the new filtered boundaries
    Digit.SessionStorage.set("microplanHelperData", {
      ...sessionData,
      filteredBoundaries: filteredBoundaries,
    });
  } else {
    filteredBoundaries = boundaryData;
  }

  return filteredBoundaries;
};

const fetchBoundaryDataCodeList = (boundaryData, accumulator = []) => {
  let tempAccumulator = [...accumulator];

  for (const item of boundaryData) {
    if (item?.code && !tempAccumulator.includes(item.code)) {
      tempAccumulator.push(item.code);
    }
    if (item?.children?.length) {
      tempAccumulator = fetchBoundaryDataCodeList(item.children, tempAccumulator);
    }
  }

  return tempAccumulator;
};

const checkBoundaryExcel = (boundaryCodeList, data, t) => {
  let errorObject = {};
  for (const [key, value] of Object.entries(data)) {
    let boundaryCodeIndex = -1;
    if (Array.isArray(value)) {
      for (let i = 0; i < value?.length; i++) {
        if (i === 0) {
          boundaryCodeIndex = value?.[i]?.indexOf(commonColumn);
          continue;
        }
        if (boundaryCodeIndex === -1) continue;
        if (!boundaryCodeList.includes(value?.[i]?.[boundaryCodeIndex])) {
          errorObject = {
            ...errorObject,
            [key]: {
              ...(errorObject?.[key] ? errorObject[key] : {}),
              [i - 1]: {
                [commonColumn]: [
                  { error: "ERROR_BOUNDARY_CODE_INVALID", values: { boundaryCode: value?.[i]?.[boundaryCodeIndex] || t(commonColumn) } },
                ],
              },
            },
          };
        }
      }
    }
  }
  return errorObject;
};

const checkBoundaryGeojsonShapefile = (boundaryCodeList, data, t) => {
  if (data && !data.features) return {};
  let errorObject = {};
  for (const [key, value] of Object.entries(data?.features)) {
    if (!boundaryCodeList.includes(value?.properties?.[commonColumn])) {
      errorObject = {
        ...errorObject,
        [key]: {
          [commonColumn]: [{ error: "ERROR_BOUNDARY_CODE_INVALID", values: { boundaryCode: value?.properties?.[commonColumn] || t(commonColumn) } }],
        },
      };
    }
  }
  return errorObject;
};

export const boundaryCodeValidations = async (data, campaignData, fileType, t) => {
  const boundaryData = await fetchBoundary(campaignData);
  const boundaryCodeList = [...new Set(fetchBoundaryDataCodeList(boundaryData))];
  if (fileType === EXCEL) {
    return checkBoundaryExcel(boundaryCodeList, data, t);
  }
  if (fileType === GEOJSON || fileType === SHAPEFILE) {
    return checkBoundaryGeojsonShapefile(boundaryCodeList, data, t);
  }
  return;
};
