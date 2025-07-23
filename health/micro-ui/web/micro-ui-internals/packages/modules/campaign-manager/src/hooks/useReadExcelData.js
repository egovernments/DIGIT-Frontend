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
    let facilityTypeColumnIndex = null;
    let facilityNameColumnIndex = null;
    let facilityStatusColumnIndex = null;
    let capacityColumnIndex = null;


    // Column index tracking variables
    let userRoleColumnIndex = null;
    let employmentTypeColumnIndex = null;
    let phoneNumberColumnIndex = null;
    let userNameColumnIndex = null;




    targetSheet.getRow(1).eachCell((cell, colIndex) => {

      //for boundary cell
      if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES" && cell.value === (schemas?.find((i) => i.description === "Boundary Code")?.name)) {

        boundaryCodeColumnIndex = colIndex;
        console.log("boundaryCodeColumnIndex", boundaryCodeColumnIndex);
      } else if (
        sheetNameToUpdate === "HCM_ADMIN_CONSOLE_USER_LIST" &&
        cell.value === (schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)
      ) {

        boundaryCodeColumnIndex = colIndex;
      }
      //for status cell
      if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES" && cell.value === (schemas?.find((i) => i.description === "Facility usage")?.name)) {
        statusColumnIndex = colIndex;
      } else if (
        sheetNameToUpdate === "HCM_ADMIN_CONSOLE_USER_LIST" &&
        cell.value === (schemas?.find((i) => i.description === "User Usage")?.name)
      ) {
        statusColumnIndex = colIndex;
        console.log("statusColumnIndex", statusColumnIndex);
      }


      if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_USER_LIST") {
        if (cell.value === (schemas?.find((i) => i.description === "User Role")?.name)) {
          userRoleColumnIndex = colIndex;
        }
        if (cell.value === (schemas?.find((i) => i.description === "Employement Type")?.name)) {
          employmentTypeColumnIndex = colIndex;
        }
        if (cell.value === (schemas?.find((i) => i.description === "Phone Number")?.name)) {
          phoneNumberColumnIndex = colIndex;
        }
        if (cell.value === (schemas?.find((i) => i.description === "User Name")?.name)) {
          userNameColumnIndex = colIndex;
        }
      }


      // Facility-specific columns (keeping existing facility related code)
      if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES") {
        if (cell.value === (schemas?.find((i) => i.description === "Facility type")?.name)) {
          facilityTypeColumnIndex = colIndex;
        }
        if (cell.value === (schemas?.find((i) => i.description === "Facility Name")?.name)) {
          facilityNameColumnIndex = colIndex;
        }
        if (cell.value === (schemas?.find((i) => i.description === "Capacity")?.name)) {
          capacityColumnIndex = colIndex;
        }
        if (cell.value === (schemas?.find((i) => i.description === "Facility status")?.name)) {
          facilityStatusColumnIndex = colIndex;
        }
        console.log("facilityTypeColumnIndex", facilityTypeColumnIndex);
        console.log("facilityNameColumnIndex", facilityNameColumnIndex);
        console.log("capacityColumnIndex", capacityColumnIndex);
        console.log("facilityStatusColumnIndex", facilityStatusColumnIndex);
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



    console.log("updatedData", updatedData);

    // Update the cells based on sheet type
    updatedData.forEach((newData, rowIndex) => {
      const cell = targetSheet.getCell(rowIndex + 2, boundaryCodeColumnIndex);
      const statusCell = targetSheet.getCell(rowIndex + 2, statusColumnIndex);


      if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_USER_LIST") {
        // Update user-specific fields
        const userRoleCell = targetSheet.getCell(rowIndex + 2, userRoleColumnIndex);
        const employmentTypeCell = targetSheet.getCell(rowIndex + 2, employmentTypeColumnIndex);
        const phoneNumberCell = targetSheet.getCell(rowIndex + 2, phoneNumberColumnIndex);
        const userNameCell = targetSheet.getCell(rowIndex + 2, userNameColumnIndex);


        // Update boundary code and status
        cell.value = newData?.[(schemas?.find((i) => i.description === "Boundary Code (Mandatory)")?.name)];
        statusCell.value = newData?.[(schemas?.find((i) => i.description === "User Usage")?.name)];


        // Update user-specific fields
        userRoleCell.value = newData?.[(schemas?.find((i) => i.description === "User Role")?.name)];
        employmentTypeCell.value = newData?.[(schemas?.find((i) => i.description === "Employement Type")?.name)];
        phoneNumberCell.value = Number(newData?.[(schemas?.find((i) => i.description === "Phone Number")?.name)] || 0);
        userNameCell.value = newData?.[(schemas?.find((i) => i.description === "User Name")?.name)];


      } else if (sheetNameToUpdate === "HCM_ADMIN_CONSOLE_AVAILABLE_FACILITIES") {
        // Keep existing facility update logic
        const facilityTypeCell = targetSheet.getCell(rowIndex + 2, facilityTypeColumnIndex);
        const facilityNameCell = targetSheet.getCell(rowIndex + 2, facilityNameColumnIndex);
        const capacityCell = targetSheet.getCell(rowIndex + 2, capacityColumnIndex);
        const facilityStatusCell = targetSheet.getCell(rowIndex + 2, facilityStatusColumnIndex);


        cell.value = newData?.[(schemas?.find((i) => i.description === "Boundary Code")?.name)];
        statusCell.value = newData?.[(schemas?.find((i) => i.description === "Facility usage")?.name)];
        facilityTypeCell.value = newData?.[(schemas?.find((i) => i.description === "Facility type")?.name)];
        facilityNameCell.value = newData?.[(schemas?.find((i) => i.description === "Facility Name")?.name)];
        capacityCell.value = Number(newData?.[(schemas?.find((i) => i.description === "Capacity")?.name)] || 0);
        facilityStatusCell.value = newData?.[(schemas?.find((i) => i.description === "Facility status")?.name)];
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
    const sheetData = XLSX.utils.sheet_to_json(workbook?.Sheets?.[sheetName]);
    console.log("sheetData", sheetData);  
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
        }
        else {
          rowData = null;
        }
        return rowData;
      }
    });
    console.log("jsonData", jsonData);
    jsonData = jsonData.filter((element) => element).slice(1);
    console.log("jsonDataSliced", jsonData);
    return { sheetData: jsonData, workbook: workbook, arrayBuffer: arrayBuffer }; // Return as array of objects
  } catch (error) {
    throw new Error(error);
  }
};


export const useReadExcelData = ({ tenantId, fileStoreId, currentCategories, sheetNameToFetch, config = {} }) => {
  console.log("fileStoreId", fileStoreId);
  console.log("currentCategories", currentCategories);
  console.log("sheetNameToFetch", sheetNameToFetch);  

  return useQuery(
    ["fetchExcelData", tenantId, fileStoreId, sheetNameToFetch],
    () => fetchExcelData({ tenantId, fileStoreId, currentCategories, sheetNameToFetch }),
    {
      ...config,
    }
  );
};
