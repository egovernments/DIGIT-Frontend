import { useMutation, useQuery } from "react-query";
import axios from "axios";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

// const updateAndUploadExcel = async ({ workbook, updatedData, sheetNameToUpdate, tenantId }) => {
//   try {
//     // Update the target sheet with new data
//     const worksheet = XLSX.utils.json_to_sheet(updatedData);
//     workbook.Sheets[sheetNameToUpdate] = worksheet;

//     // Generate binary data for the updated workbook
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "updated_workbook.xlsx"; // The name of the saved file
//     document.body.appendChild(a);
//     a.click(); // Programmatically trigger a click to download
//     document.body.removeChild(a); // Clean up the DOM
//     URL.revokeObjectURL(url); // Release memory

//   } catch (error) {
//     console.error("Error updating or uploading Excel file:", error);
//     throw error;
//   }
// };

// const updateAndUploadExcel = async ({ arrayBuffer, workbook, updatedData, sheetNameToUpdate }) => {
//   try {
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.load(arrayBuffer);
//     const targetSheet = workbook.getWorksheet(sheetNameToUpdate);
//     // debugger
//     // const protectionOptions = targetSheet.protection;
//     // if (protectionOptions) {
//     // await targetSheet.unprotect(); // Temporarily unprotect the sheet
//     // }

//     const protectedCells = [];
//     workbook.eachSheet((sheet, sheetId) => {
//       sheet.eachRow((row, rowNumber) => {
//         row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//           // Backup protection settings for cells that are protected
//           if (cell.protection && (cell.protection.locked || cell.protection.hidden)) {
//             protectedCells.push({
//               sheet: sheet.name, // Backup the sheet name as well
//               row: rowNumber,
//               col: colNumber,
//               protection: { ...cell.protection }, // Copy protection settings
//             });
//           }
//         });
//       });
//     });

//     targetSheet.spliceRows(2, targetSheet.rowCount - 1);
//     updatedData.forEach((row) => {
//       targetSheet.addRow(row);
//     });

//     // Step 6: Reapply cell protection and styles
//     protectedCells.forEach(({ sheet, row, col, protection }) => {
//       const targetSheet = workbook.getWorksheet(sheet);
//       if (targetSheet) {
//         const cell = targetSheet.getRow(row).getCell(col);
//         if (cell) {
//           cell.protection = protection; // Reapply the protection settings
//         }
//       }
//     });

//     const updatedBuffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([updatedBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "UpdatedWorkbook.xlsx";
//     link.click();
//   } catch (error) {
//     console.error("Error updating or uploading Excel file:", error);
//     throw error;
//   }
// };

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
    // const sheetName = workbook?.SheetNames?.[1]; // Get the first sheet name
    const sheetName = workbook?.SheetNames?.find((i) => i === sheetNameToFetch);
    const sheetData = workbook?.Sheets?.[sheetName];

    // updateAndUploadExcel({
    //   workbook: workbook,
    //   updatedData: [
    //     {
    //       "Facility Code": "F-2024-06-12-009266",
    //       "Facility Name": "Maxixe Health Center",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 100,
    //       "Boundary Code (Mandatory)": "MICROPLAN_MO",
    //       "Facility Usage": "Active",
    //     },
    //     {
    //       "Facility Code": "F-2024-06-27-011295",
    //       "Facility Name": "Distributor-Liupo",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 200,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-07-17-011300",
    //       "Facility Name": "Delivery Team",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 200,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-09-18-055718",
    //       "Facility Name": "Yanee General Hospital",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 200,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-09-19-055720",
    //       "Facility Name": "Facility IRS Yarnee",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 200,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-09-19-055721",
    //       "Facility Name": "Facility IRS Timbo",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 200,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-09-19-055722",
    //       "Facility Name": "Facility IRS Jowein",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 200,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-10-09-055794",
    //       "Facility Name": "IRS Facilities",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 200,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-10-10-055809",
    //       "Facility Name": "Angoche District Hospital",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 444,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-10-16-055828",
    //       "Facility Name": "IRS Facilities",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 200,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-08-056817",
    //       "Facility Name": "Nampula Health Center",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 800,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-08-056820",
    //       "Facility Name": "Zimpeto Bednet Facility",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 1000,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-08-056821",
    //       "Facility Name": "Bednet Health Facility",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 1000,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-12-068803",
    //       "Facility Name": "SMC 1",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 100,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-12-068804",
    //       "Facility Name": "SMC 2",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 100,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-12-068805",
    //       "Facility Name": "SMC 3",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 100,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-12-068806",
    //       "Facility Name": "SMC 4",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 100,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-12-068807",
    //       "Facility Name": "SMC 5",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 100,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-12-068808",
    //       "Facility Name": "SMC 6",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 100,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-12-068809",
    //       "Facility Name": "SMC 7",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 100,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-12-068810",
    //       "Facility Name": "SMC 8",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 100,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-12-068811",
    //       "Facility Name": "SMC 9",
    //       "Facility Type": "Warehouse",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 100,
    //       "Facility Usage": "Inactive",
    //     },
    //     {
    //       "Facility Code": "F-2024-11-22-074844",
    //       "Facility Name": "JK Test",
    //       "Facility Type": "Storing Resource",
    //       "Facility Status": "Permanent",
    //       "Capacity (Units: Bales for Bednets/ SPAQ Blister for SMC)": 444,
    //       "Facility Usage": "Inactive",
    //     },
    //   ],
    //   sheetNameToUpdate: "List of Available Facilities",
    //   tenantId: "mz",
    //   arrayBuffer: arrayBuffer,
    // });
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
