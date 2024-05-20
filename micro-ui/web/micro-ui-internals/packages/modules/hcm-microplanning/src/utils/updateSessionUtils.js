import { Request } from "@egovernments/digit-ui-libraries";
import { parseXlsxToJsonMultipleSheetsForSessionUtil } from "../utils/exceltojson";
import { convertJsonToXlsx } from "../utils/jsonToExcelBlob";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import axios from "axios";
import shp from "shpjs";
import { EXCEL, GEOJSON, SHAPEFILE, ACCEPT_HEADERS, LOCALITY } from "../configs/constants";

function handleExcelArrayBuffer(arrayBuffer, file) {
  return new Promise((resolve, reject) => {
    try {
      // Read the response as an array buffer
      // const arrayBuffer = response.arrayBuffer();

      // Convert the array buffer to binary string
      const data = new Uint8Array(arrayBuffer);
      const binaryString = String.fromCharCode.apply(null, data);

      // Parse the binary string into a workbook
      const workbook = XLSX.read(binaryString, { type: "binary" });

      // Assuming there's only one sheet in the workbook
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON object
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      resolve(jsonData);
    } catch (error) {
      reject(error);
    }
  });
}

function shpToGeoJSON(shpBuffer, file) {
  return new Promise((resolve, reject) => {
    try {
      shp(shpBuffer)
        .then((geojson) => {
          resolve({ jsonData: geojson, file });
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

function parseGeoJSONResponse(arrayBuffer, file) {
  return new Promise((resolve, reject) => {
    try {
      const decoder = new TextDecoder("utf-8");
      const jsonString = decoder.decode(arrayBuffer);
      const jsonData = JSON.parse(jsonString);
      resolve({ jsonData, file });
    } catch (error) {
      reject(error);
    }
  });
}

// Function to read blob data and parse it into JSON
function parseBlobToJSON(blob, file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const jsonData = {};

      workbook.SheetNames.forEach((sheetName) => {
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        jsonData[sheetName] = sheetData;
      });

      resolve({ jsonData, file });
    };

    reader.onerror = function () {
      reject(new Error("Error reading the blob data"));
    };

    reader.readAsArrayBuffer(blob);
  });
}

export const updateSessionUtils = {
  computeSessionObject: async (row, state, additionalProps) => {
    const sessionObj = {};
    const setCurrentPage = () => {
      sessionObj.currentPage = {
        id: 0,
        name: "MICROPLAN_DETAILS",
        component: "MicroplanDetails",
        checkForCompleteness: true,
      };
    };

    //currently hardcoded
    const setMicroplanStatus = () => {
      sessionObj.status = {
        MICROPLAN_DETAILS: true,
        UPLOAD_DATA: true,
        HYPOTHESIS: true,
        FORMULA_CONFIGURATION: true,
      };
    };

    const setMicroplanDetails = () => {
      if (row.name) {
        sessionObj.microplanDetails = {
          name: row?.name,
        };
      }
    };

    const setMicroplanHypothesis = () => {
      if (row.assumptions.length > 0) {
        sessionObj.hypothesis = row.assumptions;
      }
    };

    const setMicroplanRuleEngine = () => {
      const rulesList = state.UIConfiguration?.filter((item) => item.name === "ruleConfigure")?.[0]?.ruleConfigureOperators;

      if (row.operations.length > 0) {
        sessionObj.ruleEngine = row.operations?.map((item) => {
          return {
            ...item,
            operator: rulesList.filter((rule) => rule.code === item.operator)?.[0]?.name,
          };
        });
      }
    };

    const setDraftValues = () => {
      sessionObj.planConfigurationId = row?.id;
      sessionObj.auditDetails = row.auditDetails;
    };

    const handleGeoJson = (file, result, upload, translatedData, shapefileOrigin = false) => {
      const { inputFileType, templateIdentifier, filestoreId, id: fileId } = file || {};
      upload[templateIdentifier] = {
        id: templateIdentifier,
        section: templateIdentifier,
        fileName: templateIdentifier + (shapefileOrigin ? ".zip" : ".geojson"),
        fileType: inputFileType,
        file: {},
        fileId: fileId,
        filestoreId: filestoreId,
        error: null,
        resourceMapping: row?.resourceMapping?.filter((resourse) => resourse.filestoreId === filestoreId).map((item) => ({ ...item, filestoreId })),
        data: {},
      };

      const schema = state?.Schemas?.find((schema) => {
        if (schema.type === inputFileType && schema.section === templateIdentifier && schema.campaignType === additionalProps?.campaignType) {
          return true;
        } else {
          return false;
        }
      });
      if (!schema) {
        console.error("Schema got undefined while handling excel at handleExcel");
      }
      let schemaKeys;
      if (schema?.schema?.["Properties"]) schemaKeys = additionalProps.heirarchyData?.concat(Object.keys(schema.schema["Properties"]));
      let sortedSecondList = Digit.Utils.microplan.sortSecondListBasedOnFirstListOrder(schemaKeys, row?.resourceMapping);
      sortedSecondList = sortedSecondList.map(item=>{
        if(item?.mappedTo === LOCALITY && additionalProps.heirarchyData?.[ additionalProps.heirarchyData?.length-1]) return {...item, mappedTo:additionalProps.heirarchyData?.[additionalProps.heirarchyData?.length-1]}
        else return item
      })
      upload[templateIdentifier].data = result;
      if (translatedData) {
        const newFeatures = result["features"].map((item) => {
          let newProperties = {};
          sortedSecondList
            ?.filter((resourse) => resourse.filestoreId === file.filestoreId)
            .forEach((e) => {
              newProperties[e["mappedTo"]] = item["properties"][e["mappedFrom"]];
            });
          item["properties"] = newProperties;
          return item;
        });
        upload[templateIdentifier].data.features = newFeatures;
      }

      return upload;
    };

    const handleExcel = (file, result, upload, translatedData) => {
      const { inputFileType, templateIdentifier, filestoreId, id: fileId } = file || {};

      upload[templateIdentifier] = {
        id: templateIdentifier,
        section: templateIdentifier,
        fileName: templateIdentifier + ".xlsx",
        fileType: inputFileType,
        file: {},
        fileId: fileId,
        filestoreId: filestoreId,
        error: null,
        resourceMapping: row?.resourceMapping?.filter((resourse) => resourse.filestoreId === filestoreId).map((item) => ({ ...item, filestoreId })),
        data: {},
      };

      const schema = state?.Schemas?.find((schema) => {
        if (schema.type === inputFileType && schema.section === templateIdentifier && schema.campaignType === "ITIN") {
          return true;
        } else {
          return false;
        }
      });
      if (!schema) {
        console.error("Schema got undefined while handling excel at handleExcel");
      }

      const resultAfterMapping = Digit.Utils.microplan.resourceMappingAndDataFilteringForExcelFiles(
        schema,
        additionalProps.heirarchyData,
        {
          id: inputFileType,
        },
        result,
        additionalProps.t,
        translatedData
      );
      upload[templateIdentifier].data = resultAfterMapping?.tempFileDataToStore;
      // upload[templateIdentifier].resourceMapping = resultAfterMapping?.tempResourceMappingData;
    };

    const fetchFiles = async () => {
      const files = row?.files;
      if (!files || files.length === 0) {
        return [];
      }

      const promises = [];
      let storedData = [];
      files.forEach(({ filestoreId, inputFileType, templateIdentifier, id }) => {
        let fileData = {
          filestoreId,
          inputFileType,
          templateIdentifier,
          id,
        };
        let dataInSsn = Digit.SessionStorage.get("microplanData")?.upload?.[templateIdentifier];
        if (dataInSsn && dataInSsn.filestoreId === filestoreId) {
          storedData.push({ file: fileData, jsonData: dataInSsn?.data, translatedData: false  });
        } else {
          const promiseToAttach = axios
            .get("/filestore/v1/files/id", {
              responseType: "arraybuffer",
              headers: {
                "Content-Type": "application/json",
                Accept: ACCEPT_HEADERS[inputFileType],
                "auth-token": Digit.UserService.getUser()?.["access_token"],
              },
              params: {
                tenantId: Digit.ULBService.getCurrentTenantId(),
                fileStoreId: filestoreId,
              },
            })
            .then(async (res) => {
              if (inputFileType === EXCEL) {
                const file = new Blob([res.data], { type: ACCEPT_HEADERS[inputFileType] });
                const response = await parseXlsxToJsonMultipleSheetsForSessionUtil(
                  file,
                  { header: 1 },
                  {
                    filestoreId,
                    inputFileType,
                    templateIdentifier,
                    id,
                  }
                )
                return {...response,translatedData: true};
              } else if (inputFileType === GEOJSON) {
                let response = await parseGeoJSONResponse(res.data, {
                  filestoreId,
                  inputFileType,
                  templateIdentifier,
                  id,
                })
                return {...response,translatedData: true};
              } else if (inputFileType === SHAPEFILE) {
                const geoJson = await shpToGeoJSON(res.data, {
                  filestoreId,
                  inputFileType,
                  templateIdentifier,
                  id,
                });
                return {...geoJson,translatedData: true};
              }
            });
          promises.push(promiseToAttach);
        }
      });

      const resolvedPromises = await Promise.all(promises);
      let result = storedData;
      if (resolvedPromises) result = [...storedData, ...resolvedPromises];
      return result;
    };
    const setMicroplanUpload = async (filesResponse) => {
      //here based on files response set data in session
      if (filesResponse.length === 0) {
        return {};
      }
      //populate this object based on the files and return
      const upload = {};

      filesResponse.forEach(({ jsonData, file, translatedData }, idx) => {
        switch (file?.inputFileType) {
          case "Shapefile":
            handleGeoJson(file, jsonData, upload, translatedData, true);
            break;
          case "Excel":
            handleExcel(file, jsonData, upload ,translatedData);
            break;
          case "GeoJSON":
            handleGeoJson(file, jsonData, upload, translatedData);
          default:
            break;
        }
      });
      //here basically parse the files data from filestore parse it and populate upload object based on file type -> excel,shape,geojson
      return upload;
    };

    try {
      setCurrentPage();
      setMicroplanStatus();
      setMicroplanDetails();
      setMicroplanHypothesis();
      setMicroplanRuleEngine();
      setDraftValues();
      const filesResponse = await fetchFiles();
      const upload = await setMicroplanUpload(filesResponse); //should return upload object
      sessionObj.upload = upload;
      return sessionObj;
    } catch (error) {
      console.error(error.message);
    }
  },
};
