import { useMutation, useQuery } from "@tanstack/react-query";
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
    let facilityTypeColumnIndex = null;
    let facilityNameColumnIndex = null;
    let facilityStatusColumnIndex = null;
    let capacityColumnIndex = null;

    // Column index tracking variables
    let userRoleColumnIndex = null;
    let userRole1ColumnIndex = null;
    let userRole2ColumnIndex = null;
    let userRole3ColumnIndex = null;
    let userRole4ColumnIndex = null;
    let userRole5ColumnIndex = null;
    let employmentTypeColumnIndex = null;
    let phoneNumberColumnIndex = null;
    let userNameColumnIndex = null;

    targetSheet.getRow(1).eachCell((cell, colIndex) => {
      //for boundary cell
      if (
        sheetNameToUpdate === "HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES" &&
        cell.value === schemas?.find((i) => i.description === "Boundary Code")?.name
      ) {
        boundaryCodeColumnIndex = colIndex;
      } else if (
        sheetNameToUpdate === "HCM_ADMIN_CONSOLE_USER_LIST" &&
        cell.value === schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name
      ) {
        boundaryCodeColumnIndex = colIndex;
      }
      //for status cell
      if (
        sheetNameToUpdate === "HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES" &&
        cell.value === schemas?.find((i) => i.description === "Facility usage")?.name
      ) {
        statusColumnIndex = colIndex;
      } else if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_USER_LIST" && cell.value === schemas?.find((i) => i.description === "User Usage")?.name) {
        statusColumnIndex = colIndex;
      }

      if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_USER_LIST") {
        if (cell.value === schemas?.find((i) => i.description === "User Role")?.name) {
          userRoleColumnIndex = colIndex;
          userRole1ColumnIndex = userRoleColumnIndex - schemas?.find((i) => i.description === "User Role")?.multiSelectDetails?.maxSelections;
          userRole2ColumnIndex = userRole1ColumnIndex + 1;
          userRole3ColumnIndex = userRole1ColumnIndex + 2;
          userRole4ColumnIndex = userRole1ColumnIndex + 3;
          userRole5ColumnIndex = userRole1ColumnIndex + 4;
        }
        if (cell.value === schemas?.find((i) => i.description === "Employement Type")?.name) {
          employmentTypeColumnIndex = colIndex;
        }
        if (cell.value === schemas?.find((i) => i.description === "Phone Number")?.name) {
          phoneNumberColumnIndex = colIndex;
        }
        if (cell.value === schemas?.find((i) => i.description === "User Name")?.name) {
          userNameColumnIndex = colIndex;
        }
      }

      // Facility-specific columns (keeping existing facility related code)
      if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES") {
        if (cell.value === schemas?.find((i) => i.description === "Facility type")?.name) {
          facilityTypeColumnIndex = colIndex;
        }
        if (cell.value === schemas?.find((i) => i.description === "Facility Name")?.name) {
          facilityNameColumnIndex = colIndex;
        }
        if (cell.value === schemas?.find((i) => i.description === "Capacity")?.name) {
          capacityColumnIndex = colIndex;
        }
        if (cell.value === schemas?.find((i) => i.description === "Facility status")?.name) {
          facilityStatusColumnIndex = colIndex;
        }
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

    // Update the cells based on sheet type
    updatedData.forEach((newData, rowIndex) => {
      const cell = targetSheet.getCell(rowIndex + 3, boundaryCodeColumnIndex);
      const statusCell = targetSheet.getCell(rowIndex + 3, statusColumnIndex);

      if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_USER_LIST") {
        // Update user-specific fields
        const userRoleCell = targetSheet.getCell(rowIndex + 3, userRoleColumnIndex);

        const userRole1Cell = targetSheet.getCell(rowIndex + 3, userRole1ColumnIndex);
        const userRole2Cell = targetSheet.getCell(rowIndex + 3, userRole2ColumnIndex);
        const userRole3Cell = targetSheet.getCell(rowIndex + 3, userRole3ColumnIndex);
        const userRole4Cell = targetSheet.getCell(rowIndex + 3, userRole4ColumnIndex);
        const userRole5Cell = targetSheet.getCell(rowIndex + 3, userRole5ColumnIndex);

        const employmentTypeCell = targetSheet.getCell(rowIndex + 3, employmentTypeColumnIndex);
        const phoneNumberCell = targetSheet.getCell(rowIndex + 3, phoneNumberColumnIndex);
        const userNameCell = targetSheet.getCell(rowIndex + 3, userNameColumnIndex);

        // Update boundary code and status
        cell.value = newData?.[schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name];
        statusCell.value = newData?.[schemas?.find((i) => i.description === "User Usage")?.name];

        // Update user-specific fields
        // userRoleCell.value = newData?.[(schemas?.find((i) => i.description === "User Role")?.name)];
        userRole1Cell.value = newData?.["HCM_ADMIN_CONSOLE_USER_ROLE_MULTISELECT_1"] || "";
        userRole2Cell.value = newData?.["HCM_ADMIN_CONSOLE_USER_ROLE_MULTISELECT_2"] || "";
        userRole3Cell.value = newData?.["HCM_ADMIN_CONSOLE_USER_ROLE_MULTISELECT_3"] || "";
        userRole4Cell.value = newData?.["HCM_ADMIN_CONSOLE_USER_ROLE_MULTISELECT_4"] || "";
        userRole5Cell.value = newData?.["HCM_ADMIN_CONSOLE_USER_ROLE_MULTISELECT_5"] || "";

        employmentTypeCell.value = newData?.[schemas?.find((i) => i.description === "Employement Type")?.name];
        phoneNumberCell.value = Number(newData?.[schemas?.find((i) => i.description === "Phone Number")?.name] || 0);
        userNameCell.value = newData?.[schemas?.find((i) => i.description === "User Name")?.name];
      } else if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES") {
        // Keep existing facility update logic
        const facilityTypeCell = targetSheet.getCell(rowIndex + 3, facilityTypeColumnIndex);
        const facilityNameCell = targetSheet.getCell(rowIndex + 3, facilityNameColumnIndex);
        const capacityCell = targetSheet.getCell(rowIndex + 3, capacityColumnIndex);
        const facilityStatusCell = targetSheet.getCell(rowIndex + 3, facilityStatusColumnIndex);

        cell.value = newData?.[schemas?.find((i) => i.description === "Boundary Code")?.name];
        statusCell.value = newData?.[schemas?.find((i) => i.description === "Facility usage")?.name];
        facilityTypeCell.value = newData?.[schemas?.find((i) => i.description === "Facility type")?.name];
        facilityNameCell.value = newData?.[schemas?.find((i) => i.description === "Facility Name")?.name];
        capacityCell.value = Number(newData?.[schemas?.find((i) => i.description === "Capacity")?.name] || 0);
        facilityStatusCell.value = newData?.[schemas?.find((i) => i.description === "Facility status")?.name];
      }
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
  return useMutation({
    mutationFn: async ({ arrayBuffer, updatedData, sheetNameToUpdate, tenantId, schemas, t }) => {
      return await updateAndUploadExcel({
        arrayBuffer,
        updatedData,
        sheetNameToUpdate,
        tenantId,
        schemas,
        t,
      });
    },
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
    const sheetData = XLSX.utils.sheet_to_json(workbook?.Sheets?.[sheetName]);

    var jsonData = sheetData.map((row, index) => {
      let rowData = {};
      if (Object.keys(row).length > 0) {
        let allNull = true;
        Object.keys(row).forEach((key) => {
          if (row[key] !== undefined && row[key] !== "") {
            allNull = false;
          }
          rowData[key] = row[key] === undefined || row[key] == "" ? null : row[key];
        });

        if (!allNull) {
          rowData["!row#number!"] = index + 1;
        } else {
          rowData = null;
        }
        return rowData;
      }
    });

    jsonData = jsonData.filter((element) => element).slice(1);

    return { sheetData: jsonData, workbook: workbook, arrayBuffer: arrayBuffer }; // Return as array of objects
  } catch (error) {
    throw new Error(error);
  }
};

export const useReadExcelData = ({ tenantId, fileStoreId, currentCategories, sheetNameToFetch, config = {} }) => {
  return useQuery({
    queryKey: ["fetchExcelData", tenantId, fileStoreId, sheetNameToFetch],
    queryFn: () => fetchExcelData({ tenantId, fileStoreId, currentCategories, sheetNameToFetch }),
    ...config,
  });
};
