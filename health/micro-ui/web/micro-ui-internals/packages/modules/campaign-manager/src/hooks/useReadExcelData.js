import { useMutation, useQuery } from "react-query";
import axios from "axios";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

const updateAndUploadExcel = async ({ arrayBuffer, updatedData, sheetNameToUpdate, tenantId, schemas, t }) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const targetSheet = workbook.getWorksheet(t(sheetNameToUpdate));
    let boundaryCodeColumnIndex = null;
    let statusColumnIndex = null;
    targetSheet.getRow(1).eachCell((cell, colIndex) => {
      //for boundary cell
      if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_FACILITIES" && cell.value === t(schemas?.find((i) => i.description === "Boundary Code")?.name)) {
        boundaryCodeColumnIndex = colIndex;
      } else if (
        sheetNameToUpdate === "HCM_ADMIN_CONSOLE_USER_LIST" &&
        cell.value === t(schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)
      ) {
        boundaryCodeColumnIndex = colIndex;
      }
      //for status cell
      if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_FACILITIES" && cell.value === t(schemas?.find((i) => i.description === "Facility usage")?.name)) {
        statusColumnIndex = colIndex;
      } else if (
        sheetNameToUpdate === "HCM_ADMIN_CONSOLE_USER_LIST" &&
        cell.value === t(schemas?.find((i) => i.description === "User Usage")?.name)
      ) {
        statusColumnIndex = colIndex;
      }
    });

    if (boundaryCodeColumnIndex === null) {
      console.error('Column "Boundary Code (Mandatory)" not found!');
      return;
    }
    const protectionSettings = [];
    targetSheet.eachRow((row, rowIndex) => {
      row.eachCell((cell, colIndex) => {
        if (colIndex === boundaryCodeColumnIndex && cell.protection && cell.protection.locked !== undefined) {
          protectionSettings.push({
            rowIndex: rowIndex,
            colIndex: colIndex,
            locked: cell.protection.locked,
          });
        }
      });
    });

    // Directly update the cells in the "Boundary Code (Mandatory)" column
    updatedData.forEach((newBoundaryCode, rowIndex) => {
      const cell = targetSheet.getCell(rowIndex + 2, boundaryCodeColumnIndex); // Row 2 onwards
      const statusCell = targetSheet.getCell(rowIndex + 2, statusColumnIndex); // Row 2 onwards
      cell.value =
        newBoundaryCode?.[
          sheetNameToUpdate === "HCM_ADMIN_CONSOLE_FACILITIES"
            ? t(schemas?.find((i) => i.description === "Boundary Code")?.name)
            : t(schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)
        ];
      statusCell.value =
        sheetNameToUpdate === "HCM_ADMIN_CONSOLE_FACILITIES"
          ? newBoundaryCode?.[t(schemas?.find((i) => i.description === "Facility usage")?.name)]
          : newBoundaryCode?.[t(schemas?.find((i) => i.description === "User Usage")?.name)];
    });

    // Reapply the protection settings for the updated cells
    protectionSettings.forEach((setting) => {
      const cell = targetSheet.getCell(setting.rowIndex + 2, setting.colIndex);
      cell.protection = { locked: setting.locked };
    });
    targetSheet.getRow(1).eachCell((cell, colIndex) => {
      if (!cell.value || cell.value === "") {
        // If the header is empty, protect the entire column
        targetSheet.getColumn(colIndex).eachCell((rowCell) => {
          rowCell.protection = { locked: true }; // Lock empty column cells
        });
      }
    });
    workbook.worksheets.forEach((sheet) => {
      sheet.protect();
    });
    // Save the updated workbook

    const updatedBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([updatedBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const file = new File([updatedBuffer], "your-file-name.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const module = "HCM-ADMIN-CONSOLE-CLIENT";
    const { data: { files: fileStoreIds } = {} } = await Digit.UploadServices.MultipleFilesStorage(module, [file], tenantId);
    const filesArray = fileStoreIds?.[0]?.fileStoreId;
    return filesArray;
  } catch (error) {
    console.error("Error updating or uploading Excel file:", error);
    throw error;
  }
};

export const useUpdateAndUploadExcel = () => {
  return useMutation(async ({ arrayBuffer, updatedData, sheetNameToUpdate, tenantId, schemas, t }) => {
    return await updateAndUploadExcel({
      arrayBuffer,
      updatedData,
      sheetNameToUpdate,
      tenantId,
      schemas,
      t,
    });
  });
};

const fetchExcelData = async ({ tenantId, fileStoreId, currentCategories, sheetNameToFetch }) => {
  if (!fileStoreId) throw new Error("FileStoreId is required");
  try {
    const response = await axios.get("/filestore/v1/files/id", {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "auth-token": Digit.UserService.getUser()?.["access_token"],
      },
      params: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        fileStoreId: fileStoreId,
      },
    });

    const arrayBuffer = response.data;
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook?.SheetNames?.find((i) => i === sheetNameToFetch);
    const sheetData = workbook?.Sheets?.[sheetName];
    return { sheetData: XLSX.utils.sheet_to_json(sheetData), workbook: workbook, arrayBuffer: arrayBuffer }; // Return as array of objects
  } catch (error) {
    throw new Error(error);
  }
};

export const useReadExcelData = ({ tenantId, fileStoreId, currentCategories, sheetNameToFetch, config = {} }) => {
  return useQuery(
    ["fetchExcelData", tenantId, fileStoreId, sheetNameToFetch],
    () => fetchExcelData({ tenantId, fileStoreId, currentCategories, sheetNameToFetch }),
    {
      ...config,
    }
  );
};
