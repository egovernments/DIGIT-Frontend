import React, { useEffect, useState, useRef} from "react";
import { useTranslation } from "react-i18next";
import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';


const downloadTemplate = (hierarchyTemp, defaultHierarchyType ) => {

    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();

    let locale = "en_MZ";
    const reqCriteria = {
        url: '/localization/messages/v1/_search',
        params: {
            tenantId: tenantId,
            locale: locale,
            module: "rainmaker-hcm-admin-schemas"
        }
    };
    const { isLoading, data: lo,  isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);
   
    const [localizationResponse, setLocalizationResponse] = useState(null);
    useEffect(()=>{
        setLocalizationResponse(lo);
    }, [lo])
    
    const reqCriteriaResource = {
        url: `/boundary-service/boundary-relationships/_search`,
        params: {
            tenantId: tenantId,
            hierarchyType: defaultHierarchyType,
            "includeChildren": true
          }
    };
    const { isLoading1, data,  isFetching1 } = Digit.Hooks.useCustomAPIHook(reqCriteriaResource);
    
    const [allBoundaries1, setAllBoundaries1] = useState([]);
    useEffect(()=>{
        // allBoundaries1 = data?.TenantBoundary?.[0]?.boundary
        setAllBoundaries1(data?.TenantBoundary?.[0]?.boundary)
    }, [data]);

    const generatePaths = (data, path = [], allDatas) => {
        const newPath = [...path, data.code];
        allDatas.push(newPath);
        if (data.children && data.children.length > 0) {
            for (let child of data.children) {
                generatePaths(child, newPath, allDatas);
            }
        }
    };
    const getAllDatas = (allBoundaries) => {
        let allDatas = [];
        for (const data of allBoundaries) {
            generatePaths(data, [], allDatas);
        }
        return allDatas;
    };

    function formatBoundaryData(allDatas, localisedData, localizedHeaders) {
        const lengthOfHeaders = localizedHeaders.length;
        for (let i = 0; i < localisedData.length; i++) {
          const localisedDatas = localisedData[i];
          const unlocalisedDatas = allDatas[i];
          const dataLength = unlocalisedDatas.length;
          const lastElement = unlocalisedDatas[dataLength - 1];
          const toAdd = lengthOfHeaders - dataLength - 1;
          if (toAdd >= 0) {
            for (let j = 0; j < toAdd; j++) {
              localisedDatas.push('');
            }
            localisedDatas.push(lastElement);
          }
        }
    };

    function formatFirstRow(row, sheet, firstRowColor, columnWidth, frozeCells) {
        row.eachCell((cell, colNumber) => {
          setFirstRowCellStyles(cell, firstRowColor, frozeCells);
          adjustColumnWidth(sheet, colNumber, columnWidth);
          adjustRowHeight(row, cell, columnWidth);
        });
    };

    // Function to set styles for the first row cells
    function setFirstRowCellStyles(cell, firstRowColor, frozeCells) {
        cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: firstRowColor }
        };
    
        cell.font = { bold: true };
    
        if (frozeCells) {
        cell.protection = { locked: true };
        }
    
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    };
    
    // Function to adjust column width
    function adjustColumnWidth(sheet, colNumber, columnWidth) {
        sheet.getColumn(colNumber).width = columnWidth;
    };
    
    // Function to adjust row height based on content
    function adjustRowHeight(row, cell, columnWidth) {
        const text = cell.value ? cell.value.toString() : '';
        const lines = Math.ceil(text.length / (columnWidth - 2)); // Approximate number of lines
        row.height = Math.max(row.height || 0, lines * 15);
    };

    function formatOtherRows(row, frozeCells) {
        row.eachCell((cell) => {
          if (frozeCells) {
            cell.protection = { locked: true };
          }
        });
        row.alignment = { wrapText: true };
    };

    function finalizeSheet(sheet, frozeCells, frozeWholeSheet) {
        if (frozeCells) {
          performUnfreezeCells(sheet);
        }
        if (frozeWholeSheet) {
          performFreezeWholeSheet(sheet);
        }

        updateFontNameToRoboto(sheet);
        sheet.views = [{ state: 'frozen', ySplit: 1, zoomScale: 110 }];
    };

    function updateFontNameToRoboto(worksheet) {
        worksheet.eachRow({ includeEmpty: true }, (row) => {
          row.eachCell({ includeEmpty: true }, (cell) => {
            // Preserve existing font properties
            const existingFont = cell.font || {};
      
            // Update only the font name to Roboto
            cell.font = {
              ...existingFont, // Spread existing properties
              name: 'Roboto'   // Update the font name
            };
          });
        });
      }
      
      function performUnfreezeCells(sheet) {
        // logger.info(`Unfreezing the sheet ${sheet.name}`);
      
        let lastFilledColumn = 1;
        sheet.getRow(1).eachCell((cell, colNumber) => {
          if (cell.value !== undefined && cell.value !== null && cell.value !== '') {
            lastFilledColumn = colNumber;
          }
        });
      
        for (let row = 1; row <= parseInt("10000"); row++) {
          for (let col = 1; col <= lastFilledColumn; col++) {
            const cell = sheet.getCell(row, col);
            if (!cell.value && cell.value !== 0) {
              cell.protection = { locked: false };
            }
          }
        }
        sheet.protect('passwordhere', { selectLockedCells: true, selectUnlockedCells: true });
      }
      
      function performFreezeWholeSheet(sheet) {
        // logger.info(`Freezing the whole sheet ${sheet.name}`);
        sheet.eachRow((row) => {
          row.eachCell((cell) => {
            cell.protection = { locked: true };
          });
        });
        sheet.protect('passwordhere', { selectLockedCells: true });
      }
      
      
      
  
      

    function addDataToSheet(sheet, sheetData, firstRowColor = '93C47D', columnWidth = 40, frozeCells = false, frozeWholeSheet = false) {
        sheetData?.forEach((row, index) => {
          const worksheetRow = sheet.addRow(row);
      
          if (index === 0) {
            formatFirstRow(worksheetRow, sheet, firstRowColor, columnWidth, frozeCells);
          } else {
            formatOtherRows(worksheetRow, frozeCells);
          }
        });

      
        finalizeSheet(sheet, frozeCells, frozeWholeSheet);

    };
      

    function traverseChildren(parent, parentMap, hierarchyList) {
        for (const boundaryType in parentMap) {
          if (Object.prototype.hasOwnProperty.call(parentMap, boundaryType)) {
            const parentBoundaryType = parentMap[boundaryType];
            if (parentBoundaryType === parent) {
              // This boundary type has the current parent, add it to the hierarchy list
              hierarchyList.push(boundaryType);
              // Traverse its children recursively
              traverseChildren(boundaryType, parentMap, hierarchyList);
            }
          }
        }
      }
      
      // Function to generate hierarchy from boundaries
      function generateHierarchy(boundaries) {
        // Create an object to store boundary types and their parents
        const parentMap = {};
      
        // Populate the object with boundary types and their parents
        for (const boundary of boundaries) {
          parentMap[boundary.boundaryType] = boundary.parentBoundaryType;
        }
      
        // Traverse the hierarchy to generate the hierarchy list
        const hierarchyList = [];
        for (const boundaryType in parentMap) {
          if (Object.prototype.hasOwnProperty.call(parentMap, boundaryType)) {
            const parentBoundaryType = parentMap[boundaryType];
            if (parentBoundaryType === null) {
              // This boundary type has no parent, add it to the hierarchy list
              hierarchyList.push(boundaryType);
              // Traverse its children recursively
              traverseChildren(boundaryType, parentMap, hierarchyList);
            }
          }
        }
        return hierarchyList; // Return the hierarchy list
      }
      

    function getLocalizedHeaders(headers, localizationMap) {
        const messages = headers.map(header => (localizationMap ? localizationMap[header] || header : header));
        return messages;
    }
      
    const addParents = ()=>{
        setNewBoundaryData((prevItems) => {
            // Loop through the array starting from the second element
            return prevItems.map((item, idx) => {
                if(idx===0) 
                {
                    if(boundaryData.length===0) item.parentBoundaryType=null;
                    else item.parentBoundaryType = boundaryData[boundaryData.length-1].boundaryType;
                }
                if (idx > 0) {
                    // Set the parent name to the previous element's name
                    item.parentBoundaryType = prevItems[idx - 1].boundaryType;
                }
                return item; // Return the updated item
            });
        });

    }

    const requestCriteriaBulkUpload = {
        url: "/project-factory/v1/data/_create",
        params: {},
        body: {
          ResourceDetails: {},
        },
      };
    
    const mutation = Digit.Hooks.useCustomAPIMutationHook(requestCriteriaBulkUpload);

    const downloadExcelTemplate = async ()=> {
        //code of generate boundary template service call
        let request
        // const locale = getLocaleFromRequest(request);
            // Extract msgId from request body
        const msgId = request?.body?.RequestInfo?.msgId;
            // Split msgId by '|' delimiter and get the second part (index 1)
            // If splitting fails or no second part is found, use default locale from config
        // locale = msgId.split("|")?.[1] || "en_MZ";
        locale = "en_MZ";
        
      
        let messages = localizationResponse?.messages;

        const localizationMap = {};
        messages.forEach((message) => {
            localizationMap[message.code] = message.message;
        });
        
        //locallization map achieved


        let hierarchy = generateHierarchy(hierarchyTemp);
        const modifiedHierarchy = hierarchy.map(ele => `${defaultHierarchyType}_${ele}`.toUpperCase())
        const headers = [...modifiedHierarchy, "HCM_ADMIN_CONSOLE_BOUNDARY_CODE"];
        const localizedHeaders = headers.map((header) => 
            localizationMap ? localizationMap[header] || header : header
        );
        
        const allDatas = getAllDatas(allBoundaries1);


        const newLocaisationMap = localizationMap;

        let localisedArray = [];
        allDatas.map((data) => {
            const localisedElement = getLocalizedHeaders(data, newLocaisationMap);
            localisedArray.push(localisedElement);
        });

        let localisedData = localisedArray;


        formatBoundaryData(allDatas, localisedData, localizedHeaders);
        const allBoundaries = [localizedHeaders, ...localisedData];


        const workbook = new ExcelJS.Workbook();
        let localizedBoundaryTab;
        let expectedName = "HCM_ADMIN_CONSOLE_BOUNDARY_DATA";
        if (!localizationMap || !(expectedName in localizationMap)) 
        {
            localizedBoundaryTab = expectedName;
        }
        else{
            localizedBoundaryTab = localizationMap[expectedName];
        }
        const boundarySheet = workbook.addWorksheet(localizedBoundaryTab);
        addDataToSheet(boundarySheet, allBoundaries, undefined, undefined, true, true);
        
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Use FileSaver.js to download the Blob as Boundary.xlsx
        saveAs(blob, "Boundary.xlsx");

    };

    return { downloadExcelTemplate, isLoading };

};

export default downloadTemplate;